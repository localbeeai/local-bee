const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: String,
    subtotal: Number
  }],
  billing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'standard-delivery', 'same-day-delivery'],
    required: true
  },
  deliveryInstructions: String,
  preferredDeliveryTime: Date,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready-for-pickup', 'out-for-delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'digital-wallet'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    last4: String,
    brand: String
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    location: String
  }],
  tracking: {
    trackingNumber: String,
    carrier: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    deliveryAttempts: [{
      date: Date,
      status: String,
      note: String
    }]
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  rating: {
    overall: {
      type: Number,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      min: 1,
      max: 5
    },
    packaging: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: Date
  },
  notes: String,
  refund: {
    amount: Number,
    reason: String,
    date: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'items.merchant': 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'LM' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  
  if (this.timeline.length === 0) {
    this.timeline.push({
      status: this.status,
      timestamp: this.createdAt || new Date()
    });
  }
  
  next();
});

orderSchema.methods.addStatusUpdate = function(status, note = '') {
  this.status = status;
  this.timeline.push({
    status,
    timestamp: new Date(),
    note
  });
};

orderSchema.virtual('merchantGroups').get(function() {
  const groups = {};
  this.items.forEach(item => {
    const merchantId = item.merchant.toString();
    if (!groups[merchantId]) {
      groups[merchantId] = {
        merchant: item.merchant,
        items: [],
        subtotal: 0
      };
    }
    groups[merchantId].items.push(item);
    groups[merchantId].subtotal += item.subtotal;
  });
  return Object.values(groups);
});

module.exports = mongoose.model('Order', orderSchema);