const express = require('express');
const { body } = require('express-validator');
const { auth, merchant } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
  addReview
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);

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

module.exports = router;