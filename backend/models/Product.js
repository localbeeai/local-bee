const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'produce', 'dairy', 'meat', 'seafood', 'bakery', 'beverages',
      'prepared-foods', 'snacks', 'condiments', 'spices', 'health',
      'beauty', 'home', 'crafts', 'flowers', 'other'
    ]
  },
  subcategory: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['piece', 'pound', 'ounce', 'gram', 'kilogram', 'liter', 'gallon', 'quart', 'pint', 'bunch', 'dozen', 'package']
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    }
  },
  tags: [String],
  isOrganic: {
    type: Boolean,
    default: false
  },
  isLocallySourced: {
    type: Boolean,
    default: true
  },
  harvestDate: Date,
  expirationDate: Date,
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    canPickup: {
      type: Boolean,
      default: true
    },
    canDeliver: {
      type: Boolean,
      default: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    deliveryTime: {
      standard: {
        type: Number,
        default: 1
      },
      sameDay: {
        type: Boolean,
        default: false
      }
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ merchant: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ price: 1 });

productSchema.virtual('inStock').get(function() {
  return this.inventory.quantity > 0;
});

productSchema.virtual('lowStock').get(function() {
  return this.inventory.quantity <= this.inventory.lowStockThreshold;
});

productSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = sum / this.reviews.length;
    this.rating.count = this.reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
};

productSchema.pre('save', function(next) {
  this.updateRating();
  next();
});

module.exports = mongoose.model('Product', productSchema);