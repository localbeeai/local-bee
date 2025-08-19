const express = require('express');
const { auth } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const paymentService = require('../services/paymentService');

const router = express.Router();

// Create new order from successful checkout
router.post('/create', auth, async (req, res) => {
  try {
    const {
      paymentIntentId,
      items = [],
      shipping,
      billing,
      deliveryMethod = 'standard-delivery',
      deliveryInstructions = '',
      paymentMethod = 'card'
    } = req.body;

    // Validate required fields
    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item'
      });
    }

    if (!shipping || !shipping.firstName || !shipping.email) {
      return res.status(400).json({
        success: false,
        error: 'Shipping information is required'
      });
    }

    // Verify payment was successful (unless cash payment)
    if (paymentMethod !== 'cash') {
      const paymentStatus = await paymentService.getPaymentStatus(paymentIntentId);
      
      if (!paymentStatus.success || paymentStatus.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          error: 'Payment not completed or failed. Please try again.',
          paymentStatus: paymentStatus.status
        });
      }
    }

    // Validate and process items
    let totalSubtotal = 0;
    const processedItems = [];
    const merchantUpdates = {}; // Track inventory updates by merchant

    for (const item of items) {
      // Validate product exists and is available
      const product = await Product.findById(item.id).populate('merchant', 'firstName lastName businessName');
      
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product ${item.name} no longer exists`
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
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      // Calculate item totals
      const itemSubtotal = product.price * item.quantity;
      totalSubtotal += itemSubtotal;

      // Prepare item for order
      processedItems.push({
        product: product._id,
        merchant: product.merchant._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
        subtotal: itemSubtotal
      });

      // Track inventory updates
      merchantUpdates[product._id] = {
        product: product,
        quantityOrdered: item.quantity
      };
    }

    // Calculate billing totals
    const tax = totalSubtotal * 0.08; // 8% tax rate
    const deliveryFee = deliveryMethod === 'same-day-delivery' ? 15 : 
                      deliveryMethod === 'standard-delivery' ? 5 : 0;
    const finalTotal = totalSubtotal + tax + deliveryFee;

    // Verify total matches billing (if provided)
    if (billing && billing.total && Math.abs(billing.total - finalTotal) > 0.01) {
      return res.status(400).json({
        success: false,
        error: 'Billing total mismatch. Please refresh and try again.'
      });
    }

    // Create order
    const newOrder = new Order({
      customer: req.user._id,
      items: processedItems,
      billing: {
        subtotal: totalSubtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        total: finalTotal
      },
      shippingAddress: {
        name: `${shipping.firstName} ${shipping.lastName}`,
        street: `${shipping.address}${shipping.apartment ? ', ' + shipping.apartment : ''}`,
        city: shipping.city,
        state: shipping.state,
        zipCode: shipping.zipCode,
        country: shipping.country || 'US',
        phone: shipping.phone
      },
      deliveryMethod: deliveryMethod,
      deliveryInstructions: deliveryInstructions,
      paymentMethod: paymentMethod,
      paymentStatus: 'paid',
      status: 'confirmed',
      paymentDetails: paymentMethod !== 'cash' ? {
        transactionId: paymentIntentId,
        // Additional payment details would be extracted from Stripe
      } : undefined
    });

    // Save order
    await newOrder.save();

    // Update product inventory
    const inventoryUpdates = Object.values(merchantUpdates).map(update => {
      return Product.findByIdAndUpdate(
        update.product._id,
        { 
          $inc: { 
            stock: -update.quantityOrdered,
            totalSold: update.quantityOrdered
          }
        },
        { new: true }
      );
    });

    await Promise.all(inventoryUpdates);

    // Populate order for response
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name images')
      .populate('items.merchant', 'firstName lastName businessName');

    // Format response data for frontend
    const orderResponse = {
      orderNumber: populatedOrder.orderNumber,
      createdAt: populatedOrder.createdAt,
      status: populatedOrder.status,
      paymentStatus: populatedOrder.paymentStatus,
      items: populatedOrder.items.map(item => ({
        id: item.product._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        subtotal: item.subtotal,
        merchantName: item.merchant.businessName || `${item.merchant.firstName} ${item.merchant.lastName}`,
        product: {
          images: item.product.images
        }
      })),
      billing: populatedOrder.billing,
      shippingAddress: populatedOrder.shippingAddress,
      deliveryMethod: populatedOrder.deliveryMethod,
      deliveryInstructions: populatedOrder.deliveryInstructions,
      timeline: populatedOrder.timeline
    };

    // TODO: Send confirmation email
    // await emailService.sendOrderConfirmation(populatedOrder);

    // TODO: Notify merchants of new orders
    // await notificationService.notifyMerchantsNewOrder(populatedOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: orderResponse
    });

  } catch (error) {
    console.error('Create order error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(500).json({
        success: false,
        error: 'Order processing conflict. Please try again.'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid order data provided',
        details: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create order. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = { customer: req.user._id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name images')
      .populate('items.merchant', 'firstName lastName businessName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalOrders = await Order.countDocuments(query);
    
    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.billing.total,
      itemCount: order.items.length,
      deliveryMethod: order.deliveryMethod,
      estimatedDelivery: order.estimatedDelivery,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        images: item.product.images
      }))
    }));

    res.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders'
    });
  }
});

// Get specific order details
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name images description')
      .populate('items.merchant', 'firstName lastName businessName email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns this order (or is admin/merchant)
    if (order.customer._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      // Check if user is merchant for any items in this order
      const isMerchant = order.items.some(item => 
        item.merchant._id.toString() === req.user._id.toString()
      );
      
      if (!isMerchant) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        items: order.items.map(item => ({
          id: item.product._id,
          name: item.name,
          description: item.product.description,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          subtotal: item.subtotal,
          merchant: {
            id: item.merchant._id,
            name: item.merchant.businessName || `${item.merchant.firstName} ${item.merchant.lastName}`,
            email: item.merchant.email,
            phone: item.merchant.phone
          },
          product: {
            images: item.product.images
          }
        })),
        billing: order.billing,
        shippingAddress: order.shippingAddress,
        deliveryMethod: order.deliveryMethod,
        deliveryInstructions: order.deliveryInstructions,
        timeline: order.timeline,
        tracking: order.tracking,
        estimatedDelivery: order.estimatedDelivery,
        actualDelivery: order.actualDelivery,
        rating: order.rating
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order details'
    });
  }
});

// Update order status (merchants and admins only)
router.patch('/:orderId/status', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready-for-pickup', 'out-for-delivery', 'delivered', 'cancelled', 'returned'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status provided'
      });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin') {
      // Check if user is merchant for any items in this order
      const isMerchant = order.items.some(item => 
        item.merchant.toString() === req.user._id.toString()
      );
      
      if (!isMerchant) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    // Update status
    order.addStatusUpdate(status, note);
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      status: order.status,
      timeline: order.timeline
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
});

module.exports = router;