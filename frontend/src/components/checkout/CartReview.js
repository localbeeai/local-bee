import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';

const CartReviewContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 0.5rem;
  }
  
  p {
    color: #6B7280;
    margin: 0;
  }
`;

const ItemsList = styled.div`
  margin-bottom: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: #FAFAFA;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #D1D5DB;
    background: #F3F4F6;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.5rem;
`;

const ItemMerchant = styled.p`
  color: #3B82F6;
  font-size: 0.9rem;
  margin: 0 0 0.5rem;
  font-weight: 500;
`;

const ItemDescription = styled.p`
  color: #6B7280;
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
  line-height: 1.4;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ItemPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #059669;
`;

const ItemUnit = styled.div`
  font-size: 0.9rem;
  color: #6B7280;
  background: #F3F4F6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  color: #4B5563;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    border-color: #9CA3AF;
    background: #F9FAFB;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.div`
  min-width: 40px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
`;

const ItemTotal = styled.div`
  text-align: right;
  
  .price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 0.25rem;
  }
  
  .savings {
    font-size: 0.8rem;
    color: #059669;
    font-weight: 500;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #EF4444;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #FEF2F2;
    color: #DC2626;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const DeliveryOptions = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const DeliveryTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DeliveryOption = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#3B82F6' : '#E5E7EB'};
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#EFF6FF' : 'white'};
  
  &:hover {
    border-color: ${props => props.selected ? '#3B82F6' : '#D1D5DB'};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const DeliveryInfo = styled.div`
  flex: 1;
  
  .title {
    font-size: 1rem;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 0.25rem;
  }
  
  .description {
    font-size: 0.9rem;
    color: #6B7280;
    margin-bottom: 0.25rem;
  }
  
  .time {
    font-size: 0.8rem;
    color: #059669;
    font-weight: 500;
  }
`;

const DeliveryPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #E5E7EB;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: #3B82F6;
  color: white;
  border: 2px solid #3B82F6;
  
  &:hover:not(:disabled) {
    background: #2563EB;
    border-color: #2563EB;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #4B5563;
  border: 2px solid #D1D5DB;
  
  &:hover:not(:disabled) {
    border-color: #9CA3AF;
    background: #F9FAFB;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6B7280;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    color: #1F2937;
    margin: 0 0 0.5rem;
  }
  
  p {
    margin: 0;
  }
`;

const CartReview = ({ cartItems, onNext, loading }) => {
  const { updateCartQuantity, removeFromCart, getCartTotal } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('standard-delivery');

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const deliveryOptions = [
    {
      id: 'pickup',
      title: '🏪 Store Pickup',
      description: 'Pick up from merchant locations',
      time: 'Ready in 2-4 hours',
      price: 0
    },
    {
      id: 'standard-delivery',
      title: '🚚 Standard Delivery',
      description: 'Delivery to your address',
      time: '2-5 business days',
      price: 5
    },
    {
      id: 'same-day-delivery',
      title: '⚡ Same Day Delivery',
      description: 'Express delivery service',
      time: 'Within 24 hours',
      price: 15
    }
  ];

  if (!cartItems || cartItems.length === 0) {
    return (
      <CartReviewContainer>
        <EmptyCart>
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
        </EmptyCart>
      </CartReviewContainer>
    );
  }

  return (
    <CartReviewContainer>
      <Header>
        <h2>Review Your Order</h2>
        <p>Verify your items and delivery preferences before checkout</p>
      </Header>

      <ItemsList>
        {cartItems.map((item) => (
          <CartItem key={item.product._id}>
            <ItemImage 
              src={item.product.images?.[0] || '/placeholder.jpg'} 
              alt={item.product.name}
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
            
            <ItemDetails>
              <ItemName>{item.product.name}</ItemName>
              <ItemMerchant>Sold by {item.product.merchantName}</ItemMerchant>
              <ItemDescription>
                {item.product.description?.substring(0, 100)}
                {item.product.description?.length > 100 && '...'}
              </ItemDescription>
              
              <ItemMeta>
                <ItemPrice>${item.product.price.toFixed(2)}</ItemPrice>
                {item.product.unit && <ItemUnit>per {item.product.unit}</ItemUnit>}
                
                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    disabled={loading}
                  >
                    −
                  </QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    disabled={loading}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>
              </ItemMeta>
            </ItemDetails>

            <ItemTotal>
              <div className="price">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              {item.quantity > 1 && (
                <div className="savings">
                  {item.quantity} × ${item.product.price}
                </div>
              )}
            </ItemTotal>

            <RemoveButton 
              onClick={() => handleRemoveItem(item.product._id)}
              disabled={loading}
              title="Remove item"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </RemoveButton>
          </CartItem>
        ))}
      </ItemsList>

      <DeliveryOptions>
        <DeliveryTitle>
          🚛 Choose Delivery Method
        </DeliveryTitle>
        
        {deliveryOptions.map((option) => (
          <DeliveryOption
            key={option.id}
            selected={deliveryMethod === option.id}
          >
            <RadioInput
              type="radio"
              name="deliveryMethod"
              value={option.id}
              checked={deliveryMethod === option.id}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            />
            <DeliveryInfo>
              <div className="title">{option.title}</div>
              <div className="description">{option.description}</div>
              <div className="time">{option.time}</div>
            </DeliveryInfo>
            <DeliveryPrice>
              {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
            </DeliveryPrice>
          </DeliveryOption>
        ))}
      </DeliveryOptions>

      <ActionButtons>
        <SecondaryButton 
          onClick={() => window.history.back()}
          disabled={loading}
        >
          ← Continue Shopping
        </SecondaryButton>
        
        <PrimaryButton 
          onClick={onNext}
          disabled={loading || cartItems.length === 0}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              Proceed to Shipping
              <span>$${getCartTotal().toFixed(2)}</span>
            </>
          )}
        </PrimaryButton>
      </ActionButtons>
    </CartReviewContainer>
  );
};

export default CartReview;