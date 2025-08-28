import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const MessagesContainer = styled.div`
  display: flex;
  height: 600px;
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 70vh;
  }
`;

const ConversationsList = styled.div`
  width: 350px;
  border-right: 1px solid var(--border-light);
  background: white;
  
  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-light);
    max-height: 300px;
    overflow-y: auto;
    
    &.hidden {
      display: none;
    }
  }
`;

const ConversationsHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--natural-beige);
  
  h3 {
    margin: 0;
    color: var(--text-dark);
  }
`;

const ConversationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: var(--natural-beige);
  }

  &.active {
    background: var(--primary-green-light);
  }

  .conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    .participant-name {
      font-weight: 600;
      color: var(--text-dark);
    }

    .timestamp {
      font-size: 0.75rem;
      color: var(--text-light);
    }
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .product-image {
      width: 40px;
      height: 40px;
      border-radius: 0.25rem;
      background: var(--natural-beige);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.25rem;
      }
    }

    .product-name {
      font-size: 0.875rem;
      color: var(--text-dark);
      font-weight: 500;
    }
  }

  .last-message {
    font-size: 0.875rem;
    color: var(--text-light);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .unread-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: var(--primary-green);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  
  @media (max-width: 768px) {
    min-height: 400px;
    
    &.hidden {
      display: none;
    }
  }
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--natural-beige);
  position: relative;

  .mobile-back-btn {
    display: none;
    background: none;
    border: none;
    color: var(--primary-green);
    cursor: pointer;
    font-size: 1.25rem;
    margin-right: 0.5rem;
    
    @media (max-width: 768px) {
      display: block;
    }
  }

  .participant-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-green-light);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--primary-green);
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .info {
      .name {
        font-weight: 600;
        color: var(--text-dark);
      }

      .business {
        font-size: 0.875rem;
        color: var(--text-light);
      }
    }
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  
  .message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.isMerchant && !props.isOwn ? 'var(--primary-green-light)' : 'var(--natural-beige)'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: ${props => props.isMerchant && !props.isOwn ? 'var(--primary-green)' : 'var(--text-dark)'};
    font-size: 0.75rem;
    overflow: hidden;
    order: ${props => props.isOwn ? '2' : '0'};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
  background: ${props => {
    if (props.isOwn) return 'var(--primary-green)';
    return props.isMerchant ? '#10b981' : 'var(--natural-beige)'; // Green for merchant messages
  }};
  color: ${props => (props.isOwn || props.isMerchant) ? 'white' : 'var(--text-dark)'};

  .message-content {
    margin-bottom: 0.25rem;
  }

  .message-time {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .product-reference {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }
`;

const MessageInput = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-light);
  background: white;

  .input-container {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;

    textarea {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--border-light);
      border-radius: 1rem;
      resize: none;
      max-height: 100px;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: var(--primary-green);
      }
    }

    button {
      padding: 0.75rem 1.5rem;
      background: var(--primary-green);
      color: white;
      border: none;
      border-radius: 1rem;
      cursor: pointer;
      font-weight: 600;

      &:hover {
        background: var(--primary-green-dark);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  text-align: center;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
`;

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showChatArea, setShowChatArea] = useState(false); // For mobile view toggle

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/messages');
      setConversations(response.data.conversations);
      if (response.data.conversations.length > 0) {
        setSelectedConversation(response.data.conversations[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/messages/${conversationId}`);
      setMessages(response.data.messages);
      
      // Mark as read
      await axios.put(`/messages/${conversationId}/read`);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await axios.post('/messages/send', {
        conversationId: selectedConversation._id,
        content: newMessage.trim(),
        messageType: 'text'
      });

      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== conversation.currentUserId);
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading messages...</div>;
  }

  return (
    <MessagesContainer>
      <ConversationsList className={showChatArea ? 'hidden' : ''}>
        <ConversationsHeader>
          <h3>Messages</h3>
        </ConversationsHeader>
        
        {conversations.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
            No conversations yet. Start shopping to connect with sellers!
          </div>
        ) : (
          conversations.map(conv => {
            const otherParticipant = getOtherParticipant(conv);
            return (
              <ConversationItem
                key={conv._id}
                className={selectedConversation?._id === conv._id ? 'active' : ''}
                onClick={() => {
                  setSelectedConversation(conv);
                  setShowChatArea(true); // Show chat area on mobile
                }}
              >
                {conv.unreadCount > 0 && (
                  <div className="unread-badge">{conv.unreadCount}</div>
                )}
                
                <div className="conversation-header">
                  <div className="participant-name">
                    {otherParticipant?.businessInfo?.businessName || otherParticipant?.name || 'Unknown User'}
                  </div>
                  <div className="timestamp">
                    {formatTime(conv.lastActivity)}
                  </div>
                </div>

                {conv.product && (
                  <div className="product-info">
                    <div className="product-image">
                      {conv.product.images?.[0] ? (
                        <img src={getImageUrl(conv.product.images[0].url)} alt={conv.product.name} />
                      ) : (
                        '📦'
                      )}
                    </div>
                    <div className="product-name">{conv.product.name}</div>
                  </div>
                )}

                {conv.lastMessage && (
                  <div className="last-message">
                    {conv.lastMessage.content}
                  </div>
                )}
              </ConversationItem>
            );
          })
        )}
      </ConversationsList>

      <ChatArea className={showChatArea ? '' : 'hidden'}>
        {selectedConversation ? (
          <>
            <ChatHeader>
              <button 
                className="mobile-back-btn"
                onClick={() => setShowChatArea(false)}
              >
                ← Back
              </button>
              <div className="participant-info">
                <div className="avatar">
                  {getOtherParticipant(selectedConversation)?.businessPhoto?.url ? (
                    <img src={getImageUrl(getOtherParticipant(selectedConversation).businessPhoto.url)} alt="Business" />
                  ) : (
                    getOtherParticipant(selectedConversation)?.businessInfo?.businessName?.[0] || 
                    getOtherParticipant(selectedConversation)?.name?.[0] || '?'
                  )}
                </div>
                <div className="info">
                  <div className="name">
                    {getOtherParticipant(selectedConversation)?.businessInfo?.businessName || 
                     getOtherParticipant(selectedConversation)?.name || 'Unknown User'}
                  </div>
                  {selectedConversation.product && (
                    <div className="business">
                      About: {selectedConversation.product.name}
                    </div>
                  )}
                </div>
              </div>
            </ChatHeader>

            <MessagesArea>
              {messages.map(message => {
                const isOwn = message.sender._id === selectedConversation.currentUserId;
                const isMerchant = message.sender.role === 'merchant' && !isOwn;
                
                return (
                  <MessageWrapper
                    key={message._id}
                    isOwn={isOwn}
                    isMerchant={isMerchant}
                  >
                    {!isOwn && (
                      <div className="message-avatar">
                        {message.sender.businessInfo?.businessPhoto?.url ? (
                          <img src={getImageUrl(message.sender.businessInfo.businessPhoto.url)} alt={message.sender.name} />
                        ) : (
                          (message.sender.businessInfo?.businessName?.[0] || message.sender.name?.[0] || '?').toUpperCase()
                        )}
                      </div>
                    )}
                    
                    <MessageBubble
                      isOwn={isOwn}
                      isMerchant={isMerchant}
                    >
                      <div className="message-content">{message.content}</div>
                      <div className="message-time">{formatTime(message.createdAt)}</div>
                      
                      {message.productReference && (
                        <div className="product-reference">
                          📦 {message.productReference.name} - ${message.productReference.price}
                        </div>
                      )}
                    </MessageBubble>
                  </MessageWrapper>
                );
              })}
            </MessagesArea>

            <MessageInput>
              <div className="input-container">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={1}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? '...' : 'Send'}
                </button>
              </div>
            </MessageInput>
          </>
        ) : (
          <EmptyState>
            <div className="icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the left to start messaging</p>
          </EmptyState>
        )}
      </ChatArea>
    </MessagesContainer>
  );
};

export default Messages;