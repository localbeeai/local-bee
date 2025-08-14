const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
  markAsRead
} = require('../controllers/messageController');

const router = express.Router();

// Get notifications for user (must be before /:conversationId route)
router.get('/notifications', auth, (req, res) => {
  // Return empty array for now to fix the error
  res.json([]);
});

// Get user's conversations
router.get('/', auth, getConversations);

// Get messages in a conversation
router.get('/:conversationId', auth, getMessages);

// Send a message
router.post('/send', [
  auth,
  body('conversationId')
    .notEmpty()
    .withMessage('Conversation ID is required'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'product_inquiry'])
    .withMessage('Invalid message type')
], sendMessage);

// Start a new conversation
router.post('/start', [
  auth,
  body('merchantId')
    .notEmpty()
    .withMessage('Merchant ID is required'),
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('initialMessage')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Initial message must be between 1 and 1000 characters')
], startConversation);

// Mark conversation as read
router.put('/:conversationId/read', auth, markAsRead);

module.exports = router;