import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from '../config/api';

const NotificationContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: var(--natural-beige);
  }

  .bell-icon {
    font-size: 1.5rem;
    color: var(--text-dark);
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.open ? 'block' : 'none'};
`;

const NotificationHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  font-weight: 600;
  color: var(--text-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: none;
    border: none;
    color: var(--primary-green);
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${props => props.unread ? 'var(--secondary-green)' : 'white'};

  &:hover {
    background: var(--natural-beige);
  }

  &:last-child {
    border-bottom: none;
  }

  .notification-content {
    display: flex;
    gap: 0.75rem;
  }

  .notification-icon {
    font-size: 1.25rem;
    margin-top: 0.125rem;
  }

  .notification-text {
    flex: 1;

    .title {
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.25rem;
    }

    .message {
      color: var(--text-light);
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .time {
      color: var(--text-light);
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }
  }
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-light);

  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  useEffect(() => {
    fetchNotifications();
    // Set up periodic polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const [messagesResponse] = await Promise.all([
        axios.get('/api/messages/notifications')
      ]);

      const messageNotifications = messagesResponse.data.map(message => ({
        id: `message_${message._id}`,
        type: 'message',
        title: 'New Message',
        message: `From ${message.sender.name}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
        time: new Date(message.createdAt).toLocaleString(),
        unread: !message.read,
        icon: '💬',
        data: message
      }));

      const allNotifications = [
        ...messageNotifications
      ].sort((a, b) => new Date(b.data?.createdAt || 0) - new Date(a.data?.createdAt || 0));

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => n.unread).length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty notifications on error
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/messages/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (notification.unread && notification.type === 'message') {
        await axios.put(`/api/messages/${notification.data._id}/read`);
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, unread: false } : n
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }

      // Navigate to relevant page based on notification type
      switch (notification.type) {
        case 'order':
          window.location.href = '/dashboard?tab=orders';
          break;
        case 'message':
          window.location.href = '/messages';
          break;
        case 'review':
          window.location.href = '/dashboard?tab=products';
          break;
        default:
          break;
      }
      
      setIsOpen(false); // Close the dropdown after clicking
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  return (
    <NotificationContainer ref={containerRef}>
      <NotificationButton onClick={() => setIsOpen(!isOpen)}>
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <NotificationBadge>
            {unreadCount > 99 ? '99+' : unreadCount}
          </NotificationBadge>
        )}
      </NotificationButton>

      <NotificationDropdown open={isOpen}>
        <NotificationHeader>
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </NotificationHeader>

        {loading ? (
          <EmptyState>
            <div className="icon">⏳</div>
            <div>Loading notifications...</div>
          </EmptyState>
        ) : notifications.length === 0 ? (
          <EmptyState>
            <div className="icon">🔔</div>
            <div>No notifications yet</div>
          </EmptyState>
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              unread={notification.unread}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
                <div className="notification-icon">
                  {notification.icon}
                </div>
                <div className="notification-text">
                  <div className="title">{notification.title}</div>
                  <div className="message">{notification.message}</div>
                  <div className="time">{notification.time}</div>
                </div>
              </div>
            </NotificationItem>
          ))
        )}
      </NotificationDropdown>
    </NotificationContainer>
  );
};

export default NotificationBell;