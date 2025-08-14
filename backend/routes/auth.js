const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  signup,
  login,
  getMe,
  updateProfile
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['customer', 'merchant'])
    .withMessage('Role must be either customer or merchant'),
  body('phone')
    .if(body('role').equals('merchant'))
    .notEmpty()
    .withMessage('Phone number is required for merchants'),
  body('businessName')
    .if(body('role').equals('merchant'))
    .notEmpty()
    .withMessage('Business name is required for merchants'),
  body('businessDescription')
    .if(body('role').equals('merchant'))
    .notEmpty()
    .withMessage('Business description is required for merchants')
], signup);

router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], login);

router.get('/me', auth, getMe);

router.put('/profile', auth, updateProfile);

module.exports = router;