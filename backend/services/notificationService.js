const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');

// Create an in-app notification
const createNotification = async (recipientId, type, title, message, data = {}) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      title,
      message,
      data
    });
    
    await notification.save();
    console.log(`📱 Notification created for user ${recipientId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send both email and in-app notification for product approval/rejection
const notifyProductStatus = async (product, approved, reason = '') => {
  try {
    const merchant = product.merchant;
    if (!merchant) return;

    const merchantName = merchant.name;
    const businessName = merchant.businessInfo?.businessName;
    const productName = product.name;

    if (approved) {
      // Product approved
      const title = `Product Approved: ${productName}`;
      const message = `Great news! Your product "${productName}" has been approved and is now live on LocalMarket.`;
      
      // Create in-app notification
      await createNotification(merchant._id, 'product_approved', title, message, {
        productId: product._id,
        status: 'approved'
      });
      
      // Send email
      try {
        await sendEmail(
          merchant.email,
          'productApproved',
          [merchantName, productName, businessName]
        );
      } catch (emailError) {
        console.error('Email failed, but in-app notification created:', emailError);
      }
      
    } else {
      // Product rejected
      const title = `Product Needs Changes: ${productName}`;
      const message = `Your product "${productName}" requires some changes before it can go live. Please review the feedback and resubmit when ready.`;
      
      // Create in-app notification
      await createNotification(merchant._id, 'product_rejected', title, message, {
        productId: product._id,
        status: 'rejected',
        reason: reason || 'Product did not meet our requirements'
      });
      
      // Send email
      try {
        await sendEmail(
          merchant.email,
          'productRejected',
          [merchantName, productName, reason || 'Product did not meet our requirements', businessName]
        );
      } catch (emailError) {
        console.error('Email failed, but in-app notification created:', emailError);
      }
    }
    
    console.log(`📧 Product ${approved ? 'approval' : 'rejection'} notification sent to ${merchant.email}`);
    
  } catch (error) {
    console.error('Error sending product status notification:', error);
    throw error;
  }
};

// Get notifications for a user
const getUserNotifications = async (userId, limit = 20, offset = 0, unreadOnly = false) => {
  try {
    const query = { recipient: userId };
    if (unreadOnly) {
      query.read = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('data.productId', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
      
    const totalCount = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });
    
    return {
      notifications,
      totalCount,
      unreadCount,
      hasMore: (offset + limit) < totalCount
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );
    
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true, readAt: new Date() }
    );
    
    console.log(`All notifications marked as read for user ${userId}`);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  notifyProductStatus,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};