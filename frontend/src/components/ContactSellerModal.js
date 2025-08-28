import React, { useState } from 'react';
import styled from 'styled-components';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    color: var(--text-dark);
    margin: 0;
    font-size: 1.5rem;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-light);
    
    &:hover {
      color: var(--text-dark);
    }
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--natural-beige);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;

  .product-image {
    width: 60px;
    height: 60px;
    border-radius: 0.5rem;
    background: var(--primary-green-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.5rem;
    }
  }

  .product-details {
    flex: 1;

    .product-name {
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.25rem;
    }

    .product-price {
      color: var(--primary-green);
      font-weight: 600;
    }

    .merchant-name {
      color: var(--text-light);
      font-size: 0.875rem;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--primary-green);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;

  button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &.cancel {
      background: white;
      color: var(--text-dark);
      border: 1px solid var(--border-light);

      &:hover {
        background: var(--natural-beige);
      }
    }

    &.send {
      background: var(--primary-green);
      color: white;
      border: none;

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

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--primary-green);
  }

  h3 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-light);
    margin-bottom: 1.5rem;
  }

  button {
    background: var(--primary-green);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: var(--primary-green-dark);
    }
  }
`;

const ContactSellerModal = ({ isOpen, onClose, product, user }) => {
  const [formData, setFormData] = useState({
    subject: `Inquiry about ${product?.name || 'product'}`,
    message: `Hi! I'm interested in your ${product?.name || 'product'}. Could you provide more information?`
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to contact the seller');
      return;
    }

    if (user.role === 'merchant' && product.merchant._id === user.id) {
      setError('You cannot message yourself');
      return;
    }

    setSending(true);
    setError('');

    try {
      await axios.post('/messages/start', {
        merchantId: product.merchant._id,
        productId: product._id,
        subject: formData.subject,
        initialMessage: formData.message
      });

      setSuccess(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.message || 'Error sending message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setFormData({
      subject: `Inquiry about ${product?.name || 'product'}`,
      message: `Hi! I'm interested in your ${product?.name || 'product'}. Could you provide more information?`
    });
    setSuccess(false);
    setError('');
    setSending(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {success ? (
          <SuccessMessage>
            <div className="icon">✅</div>
            <h3>Message Sent!</h3>
            <p>The seller will respond soon. You can view your conversation in your messages.</p>
            <button onClick={handleClose}>
              Close
            </button>
          </SuccessMessage>
        ) : (
          <>
            <ModalHeader>
              <h2>Contact Seller</h2>
              <button type="button" className="close-button" onClick={handleClose}>
                ×
              </button>
            </ModalHeader>

            {product && (
              <ProductInfo>
                <div className="product-image">
                  {product.images?.[0] ? (
                    <img src={getImageUrl(product.images[0].url)} alt={product.name} />
                  ) : (
                    '📦'
                  )}
                </div>
                <div className="product-details">
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">${product.price}</div>
                  <div className="merchant-name">
                    by {product.merchant?.businessInfo?.businessName || product.merchant?.name}
                  </div>
                </div>
              </ProductInfo>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Ask about availability, pricing, pickup options, or any other questions..."
                />
              </FormGroup>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {error}
                </div>
              )}

              <ButtonGroup>
                <button type="button" className="cancel" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="send" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </ButtonGroup>
            </Form>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ContactSellerModal;