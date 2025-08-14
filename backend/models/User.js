const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['customer', 'merchant', 'admin'],
    default: 'customer'
  },
  phone: {
    type: String,
    required: function() { return this.role === 'merchant'; }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  businessInfo: {
    businessName: {
      type: String,
      required: function() { return this.role === 'merchant'; }
    },
    businessDescription: {
      type: String,
      required: function() { return this.role === 'merchant'; }
    },
    businessType: String,
    businessLicense: String,
    businessPhoto: {
      url: String,
      filename: String
    },
    website: String,
    taxId: String,
    deliveryRadius: {
      type: Number,
      default: 10
    },
    offersPickup: {
      type: Boolean,
      default: true
    },
    offersDelivery: {
      type: Boolean,
      default: true
    },
    sameDayDelivery: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    approvalReason: String,
    approvedAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deactivatedAt: Date,
  avatar: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  return user;
};

module.exports = mongoose.model('User', userSchema);