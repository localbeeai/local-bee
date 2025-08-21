const express = require('express');
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMerchants = await User.countDocuments({ role: 'merchant' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Get pending approvals
    const pendingMerchants = await User.countDocuments({ 
      role: 'merchant',
      'businessInfo.isApproved': false 
    });
    
    const pendingOrganic = await Product.countDocuments({
      isOrganic: true,
      'organicCertificate.status': 'pending'
    });
    
    const pendingProducts = await Product.countDocuments({
      approvalStatus: { $in: ['pending', 'resubmitted'] }
    });

    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt businessInfo.businessName');

    const recentProducts = await Product.find()
      .populate('merchant', 'name businessInfo.businessName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price merchant createdAt');

    res.json({
      stats: {
        totalUsers,
        totalMerchants,
        totalCustomers,
        totalProducts,
        totalOrders,
        pendingMerchants,
        pendingOrganic,
        pendingProducts
      },
      recentActivity: {
        recentUsers,
        recentProducts
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with pagination and filters
router.get('/users', auth, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { 'businessInfo.businessName': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasMore: skip + users.length < totalUsers
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products with pagination and filters
router.get('/products', auth, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isOrganic) filter.isOrganic = req.query.isOrganic === 'true';
    if (req.query.status) filter.approvalStatus = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .populate('merchant', 'name businessInfo.businessName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasMore: skip + products.length < totalProducts
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject merchant
router.put('/users/:id/approve', auth, admin, async (req, res) => {
  try {
    const { approved, reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'merchant') {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    user.businessInfo.isApproved = approved;
    if (reason) user.businessInfo.approvalReason = reason;
    if (approved) user.businessInfo.approvedAt = new Date();

    await user.save();

    // Send email notification
    try {
      if (approved) {
        await sendEmail(
          user.email,
          'merchantApproved',
          [user.name, user.businessInfo.businessName]
        );
      } else {
        await sendEmail(
          user.email,
          'merchantRejected',
          [user.name, reason || 'Application did not meet our requirements']
        );
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the approval process if email fails
    }

    res.json({ message: `Merchant ${approved ? 'approved' : 'rejected'} successfully` });
  } catch (error) {
    console.error('Approve merchant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject product
router.put('/products/:id/approve', auth, admin, async (req, res) => {
  try {
    const { approved, reason } = req.body;
    const product = await Product.findById(req.params.id).populate('merchant', 'name email businessInfo.businessName');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product status
    const newStatus = approved ? 'approved' : 'rejected';
    product.approvalStatus = newStatus;
    
    if (approved) {
      product.approvedAt = new Date();
      product.approvedBy = req.user._id;
      product.rejectionReason = undefined; // Clear any previous rejection reason
    } else {
      product.rejectedAt = new Date();
      product.rejectionReason = reason || 'Product did not meet our requirements';
    }

    // Add to approval history
    product.approvalHistory.push({
      status: newStatus,
      reason: reason,
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      notes: `Product ${approved ? 'approved' : 'rejected'} by admin`
    });

    await product.save();

    // Send email notification to merchant
    try {
      const { sendEmail } = require('../services/emailService');
      
      if (product.merchant) {
        const merchantName = product.merchant.name;
        const businessName = product.merchant.businessInfo?.businessName;
        
        if (approved) {
          await sendEmail(
            product.merchant.email,
            'productApproved',
            [merchantName, product.name, businessName]
          );
        } else {
          await sendEmail(
            product.merchant.email,
            'productRejected',
            [merchantName, product.name, reason || 'Product did not meet our requirements', businessName]
          );
        }
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the approval process if email fails
    }

    res.json({ 
      message: `Product ${approved ? 'approved' : 'rejected'} successfully`,
      product: {
        _id: product._id,
        name: product.name,
        approvalStatus: product.approvalStatus,
        rejectionReason: product.rejectionReason
      }
    });
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject organic certificate
router.put('/products/:id/organic-certificate', auth, admin, async (req, res) => {
  try {
    const { status, reason } = req.body; // status: 'approved' | 'rejected' | 'pending'
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.organicCertificate) {
      return res.status(400).json({ message: 'No organic certificate found' });
    }

    product.organicCertificate.status = status;
    if (reason) product.organicCertificate.reason = reason;
    product.organicCertificate.reviewedAt = new Date();
    product.organicCertificate.reviewedBy = req.user._id;

    await product.save();

    // Send email notification to merchant
    try {
      const populatedProduct = await Product.findById(product._id).populate('merchant', 'name email');
      if (populatedProduct.merchant) {
        if (status === 'approved') {
          await sendEmail(
            populatedProduct.merchant.email,
            'organicApproved',
            [populatedProduct.merchant.name, populatedProduct.name]
          );
        } else if (status === 'rejected') {
          await sendEmail(
            populatedProduct.merchant.email,
            'organicRejected',
            [populatedProduct.merchant.name, populatedProduct.name, reason || 'Certificate did not meet our standards']
          );
        }
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the approval process if email fails
    }

    res.json({ message: `Organic certificate ${status} successfully` });
  } catch (error) {
    console.error('Review organic certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (soft delete by deactivating)
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting other admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Soft delete by marking as inactive
    user.isActive = false;
    user.deactivatedAt = new Date();
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reactivate user
router.put('/users/:id/reactivate', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Reactivate user
    user.isActive = true;
    user.deactivatedAt = undefined;
    await user.save();

    res.json({ message: 'User reactivated successfully' });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle product status (activate/deactivate)
router.put('/products/:id/toggle-status', auth, admin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = isActive;
    await product.save();

    res.json({ message: `Product ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending approvals
router.get('/pending', auth, admin, async (req, res) => {
  try {
    const pendingMerchants = await User.find({ 
      role: 'merchant',
      'businessInfo.isApproved': false 
    }).select('-password');

    const pendingOrganic = await Product.find({
      isOrganic: true,
      'organicCertificate.status': 'pending'
    }).populate('merchant', 'name businessInfo.businessName email');

    const pendingProducts = await Product.find({
      approvalStatus: { $in: ['pending', 'resubmitted'] }
    }).populate('merchant', 'name businessInfo.businessName email');

    res.json({
      pendingMerchants,
      pendingOrganic,
      pendingProducts
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;