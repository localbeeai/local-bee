import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  useStripe, 
  useElements, 
  PaymentElement,
  AddressElement
} from '@stripe/react-stripe-js';

const PaymentContainer = styled.div`
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

const PaymentSection = styled.div`
  background: #FAFAFA;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const SecurityBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #166534;
  font-size: 0.9rem;
  font-weight: 500;
  
  .icon {
    font-size: 1.1rem;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentMethodIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 40px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #D1D5DB;
    transform: translateY(-1px);
  }
`;

const StripeElementContainer = styled.div`
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .StripeElement {
    padding: 0.5rem 0;
  }
  
  .StripeElement--focus {
    outline: none;
  }
`;

const OrderSummaryCard = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1F2937;
  }
  
  button {
    background: none;
    border: none;
    color: #3B82F6;
    font-size: 0.9rem;
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: #2563EB;
    }
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  
  &.total {
    font-size: 1.1rem;
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
    color: #1F2937;
    font-weight: 500;
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
  
  .icon {
    flex-shrink: 0;
    font-size: 1.2rem;
  }
`;

const SuccessAlert = styled.div`
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #166534;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .icon {
    flex-shrink: 0;
    font-size: 1.2rem;
  }
`;

const PaymentOptions = styled.div`
  margin-bottom: 2rem;
`;

const PaymentOption = styled.label`
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

const PaymentOptionInfo = styled.div`
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
  }
`;

const PaymentOptionIcon = styled.div`
  font-size: 1.5rem;
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
  background: #059669;
  color: white;
  border: 2px solid #059669;
  
  &:hover:not(:disabled) {
    background: #047857;
    border-color: #047857;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
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

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PaymentForm = ({ 
  paymentIntent, 
  total, 
  onSuccess, 
  onError, 
  onBack, 
  loading, 
  setLoading 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Payment method options
  const paymentOptions = [
    {
      id: 'card',
      title: '💳 Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: '💳'
    },
    {
      id: 'digital-wallet',
      title: '📱 Digital Wallets',
      description: 'Apple Pay, Google Pay',
      icon: '📱'
    }
  ];

  useEffect(() => {
    if (!stripe || !paymentIntent) return;

    // Check payment status on mount
    const checkPaymentStatus = async () => {
      try {
        const { paymentIntent: updatedIntent } = await stripe.retrievePaymentIntent(
          paymentIntent.client_secret
        );

        if (updatedIntent.status === 'succeeded') {
          setSuccess('Payment completed successfully!');
          onSuccess({ paymentIntent: updatedIntent });
        }
      } catch (err) {
        console.error('Payment status check failed:', err);
      }
    };

    checkPaymentStatus();
  }, [stripe, paymentIntent, onSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setProcessing(true);
    setLoading(true);
    setError('');

    try {
      // Handle cash payment for pickup orders
      if (paymentMethod === 'cash') {
        // Mock cash payment processing
        setTimeout(() => {
          onSuccess({
            paymentIntent: {
              id: `cash_${Date.now()}`,
              status: 'succeeded',
              payment_method: 'cash'
            }
          });
        }, 1000);
        return;
      }

      // Confirm payment with Stripe
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        return;
      }

      const { error: confirmError, paymentIntent: confirmedIntent } = 
        await stripe.confirmPayment({
          elements,
          clientSecret: paymentIntent.client_secret,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation`,
          },
          redirect: 'if_required'
        });

      if (confirmError) {
        setError(confirmError.message);
        onError(confirmError);
      } else if (confirmedIntent.status === 'succeeded') {
        setSuccess('Payment successful!');
        onSuccess({ paymentIntent: confirmedIntent });
      } else if (confirmedIntent.status === 'requires_action') {
        setError('Additional authentication required. Please complete the verification.');
      } else {
        setError('Payment could not be processed. Please try again.');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('An unexpected error occurred. Please try again.');
      onError(err);
    } finally {
      setProcessing(false);
      setLoading(false);
    }
  };

  // Calculate order summary
  const subtotal = total * 0.9259; // Reverse calculate from total with tax
  const tax = subtotal * 0.08;
  const shipping = total - subtotal - tax;

  return (
    <PaymentContainer>
      <Header>
        <h2>Secure Payment</h2>
        <p>Your payment information is encrypted and secure</p>
      </Header>

      <SecurityBadges>
        <SecurityBadge>
          <span className="icon">🔒</span>
          256-bit SSL Encryption
        </SecurityBadge>
        <SecurityBadge>
          <span className="icon">🛡️</span>
          PCI DSS Compliant
        </SecurityBadge>
        <SecurityBadge>
          <span className="icon">✅</span>
          100% Secure
        </SecurityBadge>
      </SecurityBadges>

      <OrderSummaryCard>
        <SummaryHeader>
          <h4>Order Summary</h4>
          <button onClick={() => setShowOrderSummary(!showOrderSummary)}>
            {showOrderSummary ? 'Hide' : 'Show'} Details
          </button>
        </SummaryHeader>

        {showOrderSummary && (
          <>
            <SummaryItem>
              <span className="label">Subtotal:</span>
              <span className="value">${subtotal.toFixed(2)}</span>
            </SummaryItem>
            <SummaryItem>
              <span className="label">Shipping:</span>
              <span className="value">${shipping.toFixed(2)}</span>
            </SummaryItem>
            <SummaryItem>
              <span className="label">Tax:</span>
              <span className="value">${tax.toFixed(2)}</span>
            </SummaryItem>
          </>
        )}

        <SummaryItem className="total">
          <span className="label">Total:</span>
          <span className="value">${total.toFixed(2)}</span>
        </SummaryItem>
      </OrderSummaryCard>

      {error && (
        <ErrorAlert>
          <span className="icon">⚠️</span>
          {error}
        </ErrorAlert>
      )}

      {success && (
        <SuccessAlert>
          <span className="icon">✅</span>
          {success}
        </SuccessAlert>
      )}

      <form onSubmit={handleSubmit}>
        <PaymentSection>
          <h3>💳 Payment Method</h3>

          <PaymentMethods>
            <PaymentMethodIcon title="Visa">
              💳
            </PaymentMethodIcon>
            <PaymentMethodIcon title="Mastercard">
              💳
            </PaymentMethodIcon>
            <PaymentMethodIcon title="American Express">
              💳
            </PaymentMethodIcon>
            <PaymentMethodIcon title="Apple Pay">
              📱
            </PaymentMethodIcon>
            <PaymentMethodIcon title="Google Pay">
              🔔
            </PaymentMethodIcon>
          </PaymentMethods>

          <PaymentOptions>
            {paymentOptions.map((option) => (
              <PaymentOption
                key={option.id}
                selected={paymentMethod === option.id}
              >
                <RadioInput
                  type="radio"
                  name="paymentMethod"
                  value={option.id}
                  checked={paymentMethod === option.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <PaymentOptionIcon>{option.icon}</PaymentOptionIcon>
                <PaymentOptionInfo>
                  <div className="title">{option.title}</div>
                  <div className="description">{option.description}</div>
                </PaymentOptionInfo>
              </PaymentOption>
            ))}
          </PaymentOptions>

          {paymentMethod === 'card' && (
            <StripeElementContainer>
              <PaymentElement 
                options={{
                  layout: 'tabs',
                  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
                  fields: {
                    billingDetails: 'never'
                  }
                }}
              />
            </StripeElementContainer>
          )}

          {paymentMethod === 'digital-wallet' && (
            <StripeElementContainer>
              <PaymentElement 
                options={{
                  layout: 'tabs',
                  paymentMethodOrder: ['apple_pay', 'google_pay', 'card'],
                  fields: {
                    billingDetails: 'never'
                  }
                }}
              />
            </StripeElementContainer>
          )}
        </PaymentSection>

        <ActionButtons>
          <SecondaryButton 
            type="button"
            onClick={onBack}
            disabled={processing || loading}
          >
            ← Back to Shipping
          </SecondaryButton>
          
          <PrimaryButton 
            type="submit"
            disabled={!stripe || processing || loading || success}
          >
            {processing || loading ? (
              <>
                <LoadingSpinner />
                Processing Payment...
              </>
            ) : success ? (
              <>
                ✅ Payment Complete
              </>
            ) : (
              <>
                🔒 Pay ${total.toFixed(2)}
              </>
            )}
          </PrimaryButton>
        </ActionButtons>
      </form>
    </PaymentContainer>
  );
};

export default PaymentForm;