const express = require('express');
const { auth } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Create payment intent for checkout flow (cart-based)
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { 
      amount, 
      currency = 'usd', 
      shipping, 
      billing, 
      items = [] 
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid amount' 
      });
    }

    if (!shipping || !shipping.firstName || !shipping.email) {
      return res.status(400).json({ 
        success: false,
        error: 'Shipping information is required' 
      });
    }

    // Validate items exist and are available
    if (items.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No items in cart' 
      });
    }

    // Verify products exist and calculate total
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(400).json({ 
          success: false,
          error: `Product ${item.name} not found` 
        });
      }

      if (!product.isActive) {
        return res.status(400).json({ 
          success: false,
          error: `Product ${product.name} is no longer available` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          error: `Insufficient stock for ${product.name}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemTotal
      });
    }

    // Add tax and delivery fee to calculated total
    const tax = calculatedTotal * 0.08; // 8% tax
    const deliveryFee = shipping.deliveryMethod === 'same-day-delivery' ? 15 : 
                       shipping.deliveryMethod === 'standard-delivery' ? 5 : 0;
    const finalTotal = calculatedTotal + tax + deliveryFee;

    // Verify the amount matches calculated total (prevent manipulation)
    if (Math.abs(amount - finalTotal) > 0.01) {
      return res.status(400).json({ 
        success: false,
        error: 'Amount mismatch. Please refresh and try again.' 
      });
    }

    // Create payment intent with Stripe
    const paymentResult = await paymentService.createPaymentIntent(
      amount,
      currency,
      {
        customerId: req.user._id.toString(),
        customerEmail: req.user.email,
        customerName: `${shipping.firstName} ${shipping.lastName}`,
        items: validatedItems,
        shipping_address: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          address: {
            line1: shipping.address,
            line2: shipping.apartment || null,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.zipCode,
            country: shipping.country || 'US'
          }
        },
        billing_address: billing.sameAsShipping ? {
          name: `${shipping.firstName} ${shipping.lastName}`,
          address: {
            line1: shipping.address,
            line2: shipping.apartment || null,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.zipCode,
            country: shipping.country || 'US'
          }
        } : {
          name: `${billing.firstName} ${billing.lastName}`,
          address: {
            line1: billing.address,
            line2: billing.apartment || null,
            city: billing.city,
            state: billing.state,
            postal_code: billing.zipCode,
            country: billing.country || 'US'
          }
        }
      }
    );

    if (!paymentResult.success) {
      return res.status(400).json({ 
        success: false,
        error: paymentResult.error 
      });
    }

    res.json({
      success: true,
      paymentIntent: paymentResult.paymentIntent,
      clientSecret: paymentResult.clientSecret,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Payment processing failed. Please try again.' 
    });
  }
});

// Get available payment methods for delivery method
router.get('/methods', auth, async (req, res) => {
  try {
    const { deliveryMethod } = req.query;
    
    const orderDetails = { deliveryMethod: deliveryMethod || 'standard-delivery' };
    const availableMethods = paymentService.getAvailablePaymentMethods(orderDetails);
    
    res.json({
      success: true,
      methods: availableMethods,
      deliveryMethod: orderDetails.deliveryMethod
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get payment methods' 
    });
  }
});

// Confirm payment and retrieve payment intent
router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ 
        success: false,
        error: 'Payment intent ID is required' 
      });
    }

    const confirmResult = await paymentService.confirmPayment(paymentIntentId);

    res.json({
      success: confirmResult.success,
      status: confirmResult.status,
      paymentIntent: confirmResult.paymentIntent,
      error: confirmResult.error
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Payment confirmation failed' 
    });
  }
});

// Process refund (admin/merchant only)
router.post('/refund', auth, async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    // Check if user is admin or merchant
    if (req.user.role !== 'admin' && req.user.role !== 'merchant') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied' 
      });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // For merchants, verify they own the order
    if (req.user.role === 'merchant') {
      const orderItems = order.items.map(item => item.merchant.toString());
      if (!orderItems.includes(req.user._id.toString())) {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied' 
        });
      }
    }

    // Handle cash payments
    if (order.paymentMethod === 'cash') {
      order.refund = {
        amount: amount || order.billing.total,
        reason: reason || 'Merchant refund',
        date: new Date(),
        processedBy: req.user._id
      };
      order.paymentStatus = 'refunded';
      order.addStatusUpdate('refunded', `Refund processed: ${reason}`);
      await order.save();

      return res.json({
        success: true,
        message: 'Cash refund processed',
        refundAmount: amount || order.billing.total
      });
    }

    // Process card refund
    if (!order.paymentDetails?.transactionId) {
      return res.status(400).json({ 
        success: false,
        error: 'No payment transaction found for refund' 
      });
    }

    const refundResult = await paymentService.processRefund(
      order.paymentDetails.transactionId,
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
      order.addStatusUpdate('refunded', `Refund processed: ${reason}`);
      await order.save();

      res.json({
        success: true,
        message: 'Refund processed successfully',
        refundAmount: refundResult.amount
      });
    } else {
      res.status(400).json({
        success: false,
        error: refundResult.error
      });
    }

  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Refund processing failed' 
    });
  }
});

// Get payment fees calculation
router.post('/calculate-fees', auth, async (req, res) => {
  try {
    const { amount, paymentMethod = 'card' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid amount' 
      });
    }

    const fees = paymentService.calculateFees(amount, paymentMethod);

    res.json({
      success: true,
      amount,
      paymentMethod,
      fees
    });

  } catch (error) {
    console.error('Calculate fees error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to calculate fees' 
    });
  }
});

// Validate payment details
router.post('/validate', auth, async (req, res) => {
  try {
    const { paymentMethod, deliveryMethod, items = [] } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ 
        success: false,
        error: 'Payment method is required' 
      });
    }

    // Validate payment method for delivery method
    const orderDetails = { deliveryMethod };
    const validation = paymentService.validatePaymentMethod(paymentMethod, orderDetails);
    
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false,
        error: validation.error 
      });
    }

    // Validate items availability
    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(400).json({ 
          success: false,
          error: `Product ${item.name} not found` 
        });
      }

      if (!product.isActive) {
        return res.status(400).json({ 
          success: false,
          error: `Product ${product.name} is no longer available` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
    }

    res.json({
      success: true,
      message: 'Payment method and items validated',
      paymentMethod,
      deliveryMethod
    });

  } catch (error) {
    console.error('Validate payment error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Validation failed' 
    });
  }
});

// Create Stripe customer for saved payment methods
router.post('/create-customer', auth, async (req, res) => {
  try {
    const { email, name } = req.body;

    const customerResult = await paymentService.createCustomer(
      email || req.user.email,
      name || `${req.user.firstName} ${req.user.lastName}`,
      {
        userId: req.user._id.toString(),
        createdAt: new Date().toISOString()
      }
    );

    if (customerResult.success) {
      // Save Stripe customer ID to user record
      req.user.stripeCustomerId = customerResult.customer.id;
      await req.user.save();

      res.json({
        success: true,
        customer: customerResult.customer,
        message: 'Customer created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: customerResult.error
      });
    }

  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create customer' 
    });
  }
});

// Webhook endpoint for payment provider notifications (Stripe)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    // In production, verify webhook signature
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    console.log('Payment webhook received');
    
    // Handle different event types
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     // Handle successful payment
    //     break;
    //   case 'payment_intent.payment_failed':
    //     // Handle failed payment
    //     break;
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

module.exports = router;