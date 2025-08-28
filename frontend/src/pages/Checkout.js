import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import CartReview from '../components/checkout/CartReview';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderConfirmation from '../components/checkout/OrderConfirmation';
import api from '../config/api';

// Load Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
  background: #FAFAFA;
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MainPanel = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SidePanel = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;

  @media (max-width: 968px) {
    position: static;
    order: -1;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    color: #6B7280;
    font-size: 1.1rem;
    margin: 0.5rem 0 0;
  }
`;

const ErrorAlert = styled.div`
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #DC2626;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #E5E7EB;
    border-top: 4px solid #3B82F6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const navigate = useNavigate();

  // Checkout state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Form data
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    deliveryMethod: 'standard-delivery',
    deliveryInstructions: ''
  });

  const [billingData, setBillingData] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  // Auto-populate user data
  useEffect(() => {
    if (user && Object.keys(shippingData).every(key => !shippingData[key] || key === 'country' || key === 'deliveryMethod')) {
      setShippingData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'US'
      }));
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, authLoading, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cartItems || cartItems.length === 0)) {
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate]);

  // Calculate totals
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = shippingData.deliveryMethod === 'same-day-delivery' ? 15 : 
                   shippingData.deliveryMethod === 'standard-delivery' ? 5 : 0;
  const total = subtotal + tax + shipping;

  const handleStepNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleStepBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !shippingData[field]?.trim());
    
    if (missing.length > 0) {
      setError(`Please fill in the following fields: ${missing.join(', ')}`);
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    if (shippingData.phone && !/^\+?[\d\s\-\(\)]+$/.test(shippingData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/payments/create-intent', {
        amount: total,
        currency: 'usd',
        shipping: shippingData,
        billing: billingData,
        items: cartItems.map(item => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }))
      });

      if (response.data.success) {
        setPaymentIntent(response.data.paymentIntent);
        return true;
      } else {
        setError(response.data.error || 'Failed to create payment intent');
        return false;
      }
    } catch (error) {
      console.error('Payment intent creation error:', error);
      setError(error.response?.data?.message || 'Payment processing error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!validateShipping()) return;

    // If billing is same as shipping, copy data
    if (billingData.sameAsShipping) {
      setBillingData(prev => ({
        ...prev,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        address: shippingData.address,
        apartment: shippingData.apartment,
        city: shippingData.city,
        state: shippingData.state,
        zipCode: shippingData.zipCode,
        country: shippingData.country
      }));
    }

    const success = await createPaymentIntent();
    if (success) {
      handleStepNext();
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      setLoading(true);
      
      // Create order in database
      const orderResponse = await api.post('/orders/create', {
        paymentIntentId: paymentResult.paymentIntent.id,
        items: cartItems.map(item => ({
          product: item.product._id,
          merchant: item.product.merchant,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
          subtotal: item.product.price * item.quantity
        })),
        shippingAddress: shippingData,
        billingAddress: billingData.sameAsShipping ? shippingData : billingData,
        deliveryMethod: shippingData.deliveryMethod,
        deliveryInstructions: shippingData.deliveryInstructions,
        billing: {
          subtotal,
          tax,
          deliveryFee: shipping,
          total
        }
      });

      if (orderResponse.data.success) {
        setOrderData(orderResponse.data.order);
        clearCart();
        handleStepNext();
      } else {
        setError('Order creation failed. Please contact support.');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setError('Failed to create order. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setError(error.message || 'Payment failed. Please try again.');
  };

  if (authLoading || cartLoading) {
    return (
      <CheckoutContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </CheckoutContainer>
    );
  }

  if (!user) return null;
  if (!cartItems || cartItems.length === 0) return null;

  return (
    <CheckoutContainer>
      <Header>
        <h1>Secure Checkout</h1>
        <p>Complete your purchase with confidence</p>
      </Header>

      <CheckoutStepper currentStep={currentStep} />

      {error && (
        <ErrorAlert>
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </ErrorAlert>
      )}

      <CheckoutContent>
        <MainPanel>
          {currentStep === 1 && (
            <CartReview
              cartItems={cartItems}
              onNext={handleStepNext}
              loading={loading}
            />
          )}

          {currentStep === 2 && (
            <ShippingForm
              shippingData={shippingData}
              setShippingData={setShippingData}
              billingData={billingData}
              setBillingData={setBillingData}
              onNext={handleShippingSubmit}
              onBack={handleStepBack}
              loading={loading}
            />
          )}

          {currentStep === 3 && paymentIntent && (
            <Elements stripe={stripePromise} options={{ clientSecret: paymentIntent.client_secret }}>
              <PaymentForm
                paymentIntent={paymentIntent}
                total={total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onBack={handleStepBack}
                loading={loading}
                setLoading={setLoading}
              />
            </Elements>
          )}

          {currentStep === 4 && orderData && (
            <OrderConfirmation
              orderData={orderData}
              shippingData={shippingData}
            />
          )}
        </MainPanel>

        <SidePanel>
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
            deliveryMethod={shippingData.deliveryMethod}
          />
        </SidePanel>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

// Order Summary Component
const OrderSummary = ({ cartItems, subtotal, tax, shipping, total, deliveryMethod }) => {
  return (
    <OrderSummaryContainer>
      <SummaryHeader>
        <h3>Order Summary</h3>
        <span>{cartItems?.length || 0} items</span>
      </SummaryHeader>

      <ItemsList>
        {cartItems?.map((item) => (
          <SummaryItem key={`${item.product._id}`}>
            <ItemImage src={item.product.images?.[0] || '/placeholder.jpg'} alt={item.product.name} />
            <ItemDetails>
              <ItemName>{item.product.name}</ItemName>
              <ItemPrice>${item.product.price} × {item.quantity}</ItemPrice>
              <ItemMerchant>by {item.product.merchantName}</ItemMerchant>
            </ItemDetails>
            <ItemTotal>${(item.product.price * item.quantity).toFixed(2)}</ItemTotal>
          </SummaryItem>
        ))}
      </ItemsList>

      <SummaryBreakdown>
        <SummaryLine>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </SummaryLine>
        <SummaryLine>
          <span>Shipping ({deliveryMethod})</span>
          <span>${shipping.toFixed(2)}</span>
        </SummaryLine>
        <SummaryLine>
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </SummaryLine>
        <SummaryTotal>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </SummaryTotal>
      </SummaryBreakdown>

      <SecurityBadges>
        <SecurityBadge>
          <span>🔒</span>
          <div>
            <strong>Secure Payment</strong>
            <p>256-bit SSL encryption</p>
          </div>
        </SecurityBadge>
        <SecurityBadge>
          <span>🛡️</span>
          <div>
            <strong>Buyer Protection</strong>
            <p>100% money-back guarantee</p>
          </div>
        </SecurityBadge>
      </SecurityBadges>
    </OrderSummaryContainer>
  );
};

// Order Summary Styles
const OrderSummaryContainer = styled.div`
  padding: 1.5rem;
`;

const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
    color: #1F2937;
  }
  
  span {
    color: #6B7280;
    font-size: 0.9rem;
  }
`;

const ItemsList = styled.div`
  border-bottom: 1px solid #E5E7EB;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
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
  font-weight: 500;
  color: #1F2937;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.div`
  font-size: 0.8rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
`;

const ItemMerchant = styled.div`
  font-size: 0.8rem;
  color: #6B7280;
`;

const ItemTotal = styled.div`
  font-weight: 600;
  color: #1F2937;
  font-size: 0.9rem;
`;

const SummaryBreakdown = styled.div`
  border-bottom: 1px solid #E5E7EB;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #4B5563;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1F2937;
  padding: 1rem 0;
  border-top: 2px solid #E5E7EB;
  margin-top: 1rem;
`;

const SecurityBadges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  span {
    font-size: 1.5rem;
  }
  
  div {
    strong {
      display: block;
      font-size: 0.9rem;
      color: #1F2937;
      margin-bottom: 0.25rem;
    }
    
    p {
      margin: 0;
      font-size: 0.8rem;
      color: #6B7280;
    }
  }
`;

export default Checkout;