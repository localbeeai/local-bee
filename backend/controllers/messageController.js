const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'name avatar businessInfo businessPhoto')
    .populate('product', 'name images price')
    .populate('lastMessage', 'content messageType createdAt sender')
    .sort({ lastActivity: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Calculate unread counts
    const conversationsWithUnread = conversations.map(conv => ({
      ...conv.toObject(),
      unreadCount: conv.unreadCount.get(userId.toString()) || 0
    }));

    const total = await Conversation.countDocuments({
      participants: userId,
      isActive: true
    });

    res.json({
      conversations: conversationsWithUnread,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalConversations: total,
        hasMore: page < Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant in conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar businessInfo businessPhoto')
      .populate('productReference', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Mark conversation as read for this user
    await conversation.markAsRead(userId);

    const total = await Message.countDocuments({ conversation: conversationId });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        hasMore: page < Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { conversationId, content, messageType = 'text', productReference } = req.body;
    const senderId = req.user.id;

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      content,
      messageType,
      productReference: productReference || undefined
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = message._id;
    await conversation.updateLastActivity();

    // Increment unread count for other participants
    for (const participantId of conversation.participants) {
      if (participantId.toString() !== senderId) {
        await conversation.incrementUnread(participantId);
      }
    }

    await message.populate('sender', 'name avatar businessInfo businessPhoto');
    await message.populate('productReference', 'name images price');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const startConversation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { merchantId, productId, subject, initialMessage } = req.body;
    const customerId = req.user.id;

    // Verify product exists and belongs to merchant
    const product = await Product.findById(productId).populate('merchant');
    if (!product || product.merchant._id.toString() !== merchantId) {
      return res.status(404).json({ message: 'Product or merchant not found' });
    }

    // Check if conversation already exists for this product
    let conversation = await Conversation.findOne({
      participants: { $all: [customerId, merchantId] },
      product: productId
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [customerId, merchantId],
        product: productId,
        subject: subject || `Inquiry about ${product.name}`
      });
      await conversation.save();
    }

    // Send initial message if provided
    if (initialMessage) {
      const message = new Message({
        conversation: conversation._id,
        sender: customerId,
        content: initialMessage,
        messageType: 'product_inquiry',
        productReference: productId
      });

      await message.save();

      conversation.lastMessage = message._id;
      await conversation.updateLastActivity();
      await conversation.incrementUnread(merchantId);
    }

    await conversation.populate('participants', 'name avatar businessInfo businessPhoto');
    await conversation.populate('product', 'name images price');

    res.status(201).json({
      message: 'Conversation started successfully',
      conversation
    });

  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await conversation.markAsRead(userId);

    res.json({ message: 'Conversation marked as read' });

  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
  markAsRead
};