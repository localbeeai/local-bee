import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationDropdown = ({ user, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, read: true, readAt: new Date() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'product_approved': return '✅';
      case 'product_rejected': return '📋';
      case 'organic_approved': return '🌱';
      case 'organic_rejected': return '⚠️';
      case 'order_status': return '📦';
      case 'merchant_approved': return '🎉';
      case 'merchant_rejected': return '📄';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '20px',
        width: '350px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb',
        zIndex: 1000,
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>Loading notifications...</div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: '60px',
      right: '20px',
      width: '400px',
      maxHeight: '500px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      border: '1px solid #e5e7eb',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          Notifications {unreadCount > 0 && (
            <span style={{
              background: '#ef4444',
              color: 'white',
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '10px',
              marginLeft: '8px'
            }}>
              {unreadCount}
            </span>
          )}
        </h3>
        <div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-green)',
                fontSize: '14px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
            <div>No notifications yet</div>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => !notification.read && markAsRead(notification._id)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
                cursor: notification.read ? 'default' : 'pointer',
                background: notification.read ? 'white' : '#f8fafc',
                transition: 'background 0.2s'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: notification.read ? '400' : '600',
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: '#1f2937'
                  }}>
                    {notification.title}
                  </div>
                  
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.4',
                    marginBottom: '6px'
                  }}>
                    {notification.message}
                  </div>
                  
                  {notification.data?.reason && (
                    <div style={{
                      fontSize: '12px',
                      color: '#ef4444',
                      background: '#fef2f2',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '6px',
                      border: '1px solid #fecaca'
                    }}>
                      <strong>Reason:</strong> {notification.data.reason}
                    </div>
                  )}
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#9ca3af'
                  }}>
                    {formatDate(notification.createdAt)}
                  </div>
                </div>
                
                {!notification.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--primary-green)',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '6px'
                  }} />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;