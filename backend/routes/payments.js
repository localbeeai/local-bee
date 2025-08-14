const express = require('express');
const { auth } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Get available payment methods for an order
router.get('/methods/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user owns the order
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const availableMethods = paymentService.getAvailablePaymentMethods(order);
    
    res.json({
      methods: availableMethods,
      order: {
        id: order._id,
        total: order.billing.total,
        deliveryMethod: order.deliveryMethod
      }
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create payment intent for card payments
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findById(orderId).populate('customer');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user owns the order
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate payment method
    const validation = paymentService.validatePaymentMethod(paymentMethod, order);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.error });
    }

    // Handle cash payments
    if (paymentMethod === 'cash') {
      const cashPayment = paymentService.processCashPayment(order.billing.total, order._id);
      
      // Update order with cash payment details
      order.paymentMethod = 'cash';
      order.paymentStatus = 'pending'; // Will be marked as paid when order is picked up
      order.paymentDetails = {
        transactionId: cashPayment.transactionId,
        method: 'cash'
      };
      await order.save();

      return res.json({
        success: true,
        paymentMethod: 'cash',
        message: 'Cash payment selected - pay on pickup',
        orderId: order._id
      });
    }

    // Create payment intent for card payments
    const paymentResult = await paymentService.createPaymentIntent(
      order.billing.total,
      'usd',
      {
        orderId: order._id.toString(),
        customerId: order.customer._id.toString(),
        customerEmail: order.customer.email
      }
    );

    if (!paymentResult.success) {
      return res.status(400).json({ 
        message: 'Payment processing failed',
        error: paymentResult.error 
      });
    }

    // Store payment intent ID in order
    order.paymentDetails = {
      ...order.paymentDetails,
      paymentIntentId: paymentResult.paymentIntent.id
    };
    await order.save();

    res.json({
      success: true,
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntent.id
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm payment
router.post('/confirm', auth, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user owns the order
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const confirmResult = await paymentService.confirmPayment(paymentIntentId);

    if (confirmResult.success) {
      order.paymentStatus = 'paid';
      order.paymentDetails = {
        ...order.paymentDetails,
        paymentIntentId,
        paidAt: new Date()
      };
      order.addStatusUpdate('confirmed', 'Payment confirmed');
      await order.save();

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        order: {
          id: order._id,
          status: order.status,
          paymentStatus: order.paymentStatus
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment confirmation failed',
        error: confirmResult.error
      });
    }

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process refund (admin only)
router.post('/refund', auth, async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    // Check if user is admin or merchant
    if (req.user.role !== 'admin' && req.user.role !== 'merchant') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // For merchants, verify they own the order
    if (req.user.role === 'merchant') {
      const orderItems = order.items.map(item => item.merchant.toString());
      if (!orderItems.includes(req.user._id.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    if (order.paymentMethod === 'cash') {
      // Handle cash refund
      order.refund = {
        amount: amount || order.billing.total,
        reason: reason || 'Merchant refund',
        date: new Date(),
        processedBy: req.user._id
      };
      order.paymentStatus = 'refunded';
      await order.save();

      return res.json({
        success: true,
        message: 'Cash refund processed',
        refundAmount: amount || order.billing.total
      });
    }

    // Process card refund
    if (!order.paymentDetails?.paymentIntentId) {
      return res.status(400).json({ message: 'No payment intent found for refund' });
    }

    const refundResult = await paymentService.processRefund(
      order.paymentDetails.paymentIntentId,
      amount,
      reason
    );

    if (refundResult.success) {
      order.refund = {
        amount: refundResult.amount,
        reason: reason || 'Merchant refund',
        date: new Date(),
        processedBy: req.user._id
      };
      order.paymentStatus = 'refunded';
      await order.save();

      res.json({
        success: true,
        message: 'Refund processed successfully',
        refundAmount: refundResult.amount
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Refund processing failed',
        error: refundResult.error
      });
    }

  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment fees calculation
router.post('/calculate-fees', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const fees = paymentService.calculateFees(amount, paymentMethod);

    res.json({
      amount,
      paymentMethod,
      fees
    });

  } catch (error) {
    console.error('Calculate fees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Webhook endpoint for payment provider notifications (Stripe)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    // This would handle webhook events from payment providers
    // For now, just acknowledge receipt
    console.log('Payment webhook received');
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook error' });
  }
});

module.exports = router;