import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ConfirmationContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const SuccessAnimation = styled.div`
  margin: 2rem 0;
  
  .checkmark {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #10B981;
    position: relative;
    margin: 0 auto 1rem;
    animation: scaleIn 0.8s ease-out;
    
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30px;
      height: 15px;
      border: 4px solid white;
      border-top: none;
      border-right: none;
      transform: translate(-50%, -60%) rotate(-45deg);
      animation: checkmark 0.8s ease-out 0.3s both;
    }
  }
  
  @keyframes scaleIn {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes checkmark {
    0% {
      opacity: 0;
      transform: translate(-50%, -60%) rotate(-45deg) scale(0);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -60%) rotate(-45deg) scale(1);
    }
  }
`;

const SuccessTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SuccessMessage = styled.p`
  font-size: 1.2rem;
  color: #6B7280;
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const OrderDetailsCard = styled.div`
  background: #FAFAFA;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #E5E7EB;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const OrderNumber = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0 0 0.25rem;
  }
  
  p {
    color: #6B7280;
    margin: 0;
  }
`;

const OrderDate = styled.div`
  text-align: right;
  
  @media (max-width: 640px) {
    text-align: center;
  }
  
  .label {
    font-size: 0.9rem;
    color: #6B7280;
    margin-bottom: 0.25rem;
  }
  
  .date {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1F2937;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #ECFDF5;
  color: #065F46;
  border: 1px solid #10B981;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const OrderItems = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.25rem;
`;

const ItemMerchant = styled.div`
  font-size: 0.9rem;
  color: #3B82F6;
  margin-bottom: 0.25rem;
`;

const ItemQuantity = styled.div`
  font-size: 0.9rem;
  color: #6B7280;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #1F2937;
  text-align: right;
`;

const ShippingInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.5rem;
  
  h5 {
    font-size: 1rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .address {
    color: #4B5563;
    line-height: 1.6;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  &.total {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1F2937;
    border-top: 2px solid #E5E7EB;
    padding-top: 0.75rem;
    margin-top: 1rem;
    margin-bottom: 0;
  }
  
  .label {
    color: #6B7280;
  }
  
  .value {
    font-weight: 600;
    color: #1F2937;
  }
`;

const NextSteps = styled.div`
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
`;

const StepsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
`;

const Step = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #4B5563;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .icon {
    width: 24px;
    height: 24px;
    background: #3B82F6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    flex-shrink: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
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
  min-width: 160px;
`;

const PrimaryButton = styled(Button)`
  background: #3B82F6;
  color: white;
  border: 2px solid #3B82F6;
  
  &:hover {
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
  
  &:hover {
    border-color: #9CA3AF;
    background: #F9FAFB;
  }
`;

const ContactSupport = styled.div`
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  
  h5 {
    margin: 0 0 0.5rem;
    color: #1F2937;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0 0 1rem;
    color: #6B7280;
  }
  
  .contact-info {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    
    .item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #3B82F6;
      font-weight: 500;
      
      .icon {
        font-size: 1.2rem;
      }
    }
  }
`;

const OrderConfirmation = ({ orderData, shippingData }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Send confirmation email (would be handled by backend)
    // sendConfirmationEmail(orderData);
  }, [orderData]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryMethodText = (method) => {
    switch (method) {
      case 'pickup':
        return '🏪 Store Pickup';
      case 'same-day-delivery':
        return '⚡ Same Day Delivery';
      case 'standard-delivery':
        return '🚚 Standard Delivery';
      default:
        return method;
    }
  };

  return (
    <ConfirmationContainer>
      <SuccessAnimation>
        <div className="checkmark"></div>
      </SuccessAnimation>

      <SuccessTitle>Order Confirmed!</SuccessTitle>
      <SuccessMessage>
        Thank you for your purchase! Your order has been successfully placed 
        and you'll receive a confirmation email shortly.
      </SuccessMessage>

      <OrderDetailsCard>
        <OrderHeader>
          <OrderNumber>
            <h3>Order #{orderData.orderNumber}</h3>
            <StatusBadge>Confirmed</StatusBadge>
          </OrderNumber>
          <OrderDate>
            <div className="label">Order Date</div>
            <div className="date">{formatDate(orderData.createdAt)}</div>
          </OrderDate>
        </OrderHeader>

        <OrderItems>
          <SectionTitle>
            🛒 Order Items ({orderData.items?.length || 0})
          </SectionTitle>
          <ItemsList>
            {orderData.items?.map((item, index) => (
              <OrderItem key={index}>
                <ItemImage 
                  src={item.product?.images?.[0] || '/placeholder.jpg'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemMerchant>Sold by {item.merchantName}</ItemMerchant>
                  <ItemQuantity>Quantity: {item.quantity} {item.unit && `${item.unit}${item.quantity > 1 ? 's' : ''}`}</ItemQuantity>
                </ItemDetails>
                <ItemPrice>
                  ${item.subtotal?.toFixed(2)}
                </ItemPrice>
              </OrderItem>
            ))}
          </ItemsList>
        </OrderItems>

        <ShippingInfo>
          <InfoSection>
            <h5>
              📍 Shipping Address
            </h5>
            <div className="address">
              {shippingData.firstName} {shippingData.lastName}<br />
              {shippingData.address}<br />
              {shippingData.apartment && `${shippingData.apartment}<br />`}
              {shippingData.city}, {shippingData.state} {shippingData.zipCode}<br />
              {shippingData.email}<br />
              {shippingData.phone}
            </div>
          </InfoSection>

          <InfoSection>
            <h5>
              🚛 Delivery Method
            </h5>
            <div className="address">
              {getDeliveryMethodText(shippingData.deliveryMethod)}<br />
              {shippingData.deliveryMethod === 'pickup' && 'Ready for pickup in 2-4 hours'}
              {shippingData.deliveryMethod === 'standard-delivery' && 'Estimated delivery: 2-5 business days'}
              {shippingData.deliveryMethod === 'same-day-delivery' && 'Delivery within 24 hours'}
              <br />
              {shippingData.deliveryInstructions && (
                <>
                  <strong>Special Instructions:</strong><br />
                  {shippingData.deliveryInstructions}
                </>
              )}
            </div>
          </InfoSection>
        </ShippingInfo>

        <OrderSummary>
          <SectionTitle>
            💰 Order Summary
          </SectionTitle>
          <SummaryRow>
            <span className="label">Subtotal:</span>
            <span className="value">${orderData.billing?.subtotal?.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span className="label">Delivery:</span>
            <span className="value">
              ${orderData.billing?.deliveryFee?.toFixed(2)}
            </span>
          </SummaryRow>
          <SummaryRow>
            <span className="label">Tax:</span>
            <span className="value">${orderData.billing?.tax?.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span className="label">Total Paid:</span>
            <span className="value">${orderData.billing?.total?.toFixed(2)}</span>
          </SummaryRow>
        </OrderSummary>
      </OrderDetailsCard>

      <NextSteps>
        <SectionTitle>
          📋 What Happens Next?
        </SectionTitle>
        <StepsList>
          <Step>
            <div className="icon">1</div>
            <span>We'll send you an email confirmation with your order details</span>
          </Step>
          <Step>
            <div className="icon">2</div>
            <span>Merchants will prepare your items and confirm availability</span>
          </Step>
          <Step>
            <div className="icon">3</div>
            <span>You'll receive tracking information once items ship or are ready for pickup</span>
          </Step>
          <Step>
            <div className="icon">4</div>
            <span>Enjoy your locally-sourced products!</span>
          </Step>
        </StepsList>
      </NextSteps>

      <ActionButtons>
        <SecondaryButton onClick={() => navigate('/customer/orders')}>
          📋 View All Orders
        </SecondaryButton>
        <PrimaryButton onClick={() => navigate('/products')}>
          🛍️ Continue Shopping
        </PrimaryButton>
      </ActionButtons>

      <ContactSupport>
        <h5>Need Help?</h5>
        <p>Our customer support team is here to assist you with any questions about your order.</p>
        <div className="contact-info">
          <div className="item">
            <span className="icon">📧</span>
            <span>support@localmarket.com</span>
          </div>
          <div className="item">
            <span className="icon">📞</span>
            <span>(555) 123-4567</span>
          </div>
          <div className="item">
            <span className="icon">💬</span>
            <span>Live Chat Available</span>
          </div>
        </div>
      </ContactSupport>
    </ConfirmationContainer>
  );
};

export default OrderConfirmation;