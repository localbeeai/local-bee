const express = require('express');
const { body } = require('express-validator');
const { auth, merchant } = require('../middleware/auth');
const Product = require('../models/Product');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
  addReview,
  getRecommendations
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);

// Get personalized recommendations
router.get('/recommendations/personalized', getRecommendations);

router.get('/my-products', auth, merchant, getMerchantProducts);

router.get('/:id', getProduct);

router.post('/', [
  auth,
  merchant,
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('subcategory')
    .notEmpty()
    .withMessage('Subcategory is required'),
  body('inventory.quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('inventory.unit')
    .notEmpty()
    .withMessage('Unit is required')
], createProduct);

router.put('/:id', [
  auth,
  merchant,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('inventory.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
], updateProduct);

router.delete('/:id', auth, merchant, deleteProduct);

router.post('/:id/reviews', [
  auth,
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], addReview);

// Resubmit product for approval (merchant action)
router.put('/:id/resubmit', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the merchant who owns this product
    if (product.merchant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to resubmit this product' });
    }

    // Only allow resubmission if product is rejected
    if (product.approvalStatus !== 'rejected') {
      return res.status(400).json({ message: 'Product must be rejected before resubmission' });
    }

    // Update status to resubmitted (which will put it back in admin queue)
    product.approvalStatus = 'resubmitted';
    product.resubmissionCount = (product.resubmissionCount || 0) + 1;
    product.rejectionReason = undefined; // Clear rejection reason
    
    // Add to approval history
    product.approvalHistory.push({
      status: 'resubmitted',
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      notes: `Product resubmitted by merchant (attempt #${product.resubmissionCount})`
    });

    await product.save();

    res.json({ 
      message: 'Product resubmitted for review successfully',
      product: {
        _id: product._id,
        name: product.name,
        approvalStatus: product.approvalStatus,
        resubmissionCount: product.resubmissionCount
      }
    });
  } catch (error) {
    console.error('Resubmit product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resubmit organic certificate for review (merchant action)
router.put('/:id/resubmit-organic', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the merchant who owns this product
    if (product.merchant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to resubmit this organic certificate' });
    }

    // Only allow resubmission if organic certificate is rejected
    if (!product.organicCertificate || product.organicCertificate.status !== 'rejected') {
      return res.status(400).json({ message: 'Organic certificate must be rejected before resubmission' });
    }

    // Update organic certificate status to resubmitted
    product.organicCertificate.status = 'resubmitted';
    product.organicCertificate.reason = undefined; // Clear rejection reason
    product.organicCertificate.reviewedAt = undefined; // Clear previous review
    product.organicCertificate.reviewedBy = undefined;
    
    await product.save();

    res.json({ 
      message: 'Organic certificate resubmitted for review successfully',
      product: {
        _id: product._id,
        name: product.name,
        organicCertificate: product.organicCertificate
      }
    });
  } catch (error) {
    console.error('Resubmit organic certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;