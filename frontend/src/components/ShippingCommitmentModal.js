import React, { useState } from 'react';
import styled from 'styled-components';

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
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;

  h2 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  p {
    color: var(--text-light);
    font-size: 0.875rem;
  }
`;

const ShippingOptionsContainer = styled.div`
  margin-bottom: 2rem;
`;

const ShippingOption = styled.div`
  border: 2px solid ${props => props.selected ? 'var(--primary-green)' : 'var(--border-light)'};
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  background: ${props => props.selected ? 'var(--secondary-green)' : 'white'};
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary-green);
  }

  .option-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;

    .icon {
      font-size: 1.25rem;
    }

    .title {
      font-weight: 600;
      color: var(--text-dark);
    }

    .badge {
      background: var(--primary-green);
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
  }

  .description {
    color: var(--text-light);
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .commitments {
    background: ${props => props.selected ? 'white' : 'var(--natural-beige)'};
    border-radius: 0.5rem;
    padding: 0.75rem;

    .commitment-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    ul {
      margin: 0;
      padding-left: 1rem;
      
      li {
        font-size: 0.75rem;
        color: var(--text-dark);
        margin-bottom: 0.25rem;
        line-height: 1.3;
      }
    }
  }
`;

const PenaltyWarning = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;

  .warning-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .icon {
      color: #dc2626;
      font-size: 1.25rem;
    }

    .title {
      color: #dc2626;
      font-weight: 600;
      font-size: 0.875rem;
    }
  }

  .warning-text {
    color: #7f1d1d;
    font-size: 0.75rem;
    line-height: 1.4;
  }

  ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1rem;

    li {
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
      color: #7f1d1d;
    }
  }
`;

const AgreementSection = styled.div`
  background: var(--secondary-green);
  border: 1px solid var(--primary-green);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;

  .agreement-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;

    input[type="checkbox"] {
      margin-top: 0.125rem;
      width: auto;
    }

    label {
      font-size: 0.875rem;
      line-height: 1.4;
      color: var(--text-dark);
      cursor: pointer;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &.cancel {
      background: none;
      border: 1px solid var(--border-light);
      color: var(--text-light);

      &:hover {
        background: var(--natural-beige);
      }
    }

    &.confirm {
      background: var(--primary-green);
      border: none;
      color: white;

      &:hover:not(:disabled) {
        background: var(--primary-green-dark);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;

const ShippingCommitmentModal = ({ isOpen, onClose, onConfirm, currentShippingOption = 'standard' }) => {
  const [selectedOptions, setSelectedOptions] = useState([currentShippingOption]);
  const [hasAgreed, setHasAgreed] = useState(false);

  const shippingOptions = [
    {
      id: 'standard',
      icon: '📦',
      title: 'Standard Delivery',
      badge: 'Most Popular',
      description: 'Reliable delivery within 2-5 business days. Perfect for most products.',
      commitments: [
        'Ship within 1-2 business days of order',
        'Provide tracking information within 24 hours',
        'Package items securely to prevent damage',
        'Deliver within promised timeframe 95% of the time'
      ]
    },
    {
      id: 'express',
      icon: '🚀',
      title: 'Express Delivery',
      badge: 'Premium',
      description: 'Fast delivery within 1-2 business days for urgent orders.',
      commitments: [
        'Ship within 4-6 hours of order placement',
        'Guarantee delivery within 1-2 business days',
        'Provide real-time tracking updates',
        'Priority handling and secure packaging'
      ]
    },
    {
      id: 'same-day',
      icon: '⚡',
      title: 'Same-Day Delivery',
      badge: 'Premium+',
      description: 'Ultra-fast same-day delivery for local customers within 25 miles.',
      commitments: [
        'Process and ship within 2 hours of order',
        'Deliver same day for orders placed before 2 PM',
        'Provide live delivery tracking',
        'Direct communication with customer for delivery'
      ]
    },
    {
      id: 'pickup',
      icon: '🏪',
      title: 'Local Pickup',
      badge: 'Eco-Friendly',
      description: 'Customers can pick up orders directly from your location.',
      commitments: [
        'Have orders ready within 2-4 hours',
        'Notify customer when order is ready',
        'Provide clear pickup instructions',
        'Maintain convenient pickup hours'
      ]
    }
  ];

  const toggleOption = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleConfirm = () => {
    if (hasAgreed && selectedOptions.length > 0) {
      onConfirm(selectedOptions);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <h2>📋 Shipping Commitment Agreement</h2>
          <p>Choose your shipping commitment levels (you can select multiple options) and agree to our delivery standards</p>
        </ModalHeader>

        <ShippingOptionsContainer>
          {shippingOptions.map((option) => (
            <ShippingOption
              key={option.id}
              selected={selectedOptions.includes(option.id)}
              onClick={() => toggleOption(option.id)}
            >
              <div className="option-header">
                <span className="icon">{option.icon}</span>
                <span className="title">{option.title}</span>
                <span className="badge">{option.badge}</span>
              </div>
              <div className="description">{option.description}</div>
              <div className="commitments">
                <div className="commitment-title">Your Commitments:</div>
                <ul>
                  {option.commitments.map((commitment, index) => (
                    <li key={index}>{commitment}</li>
                  ))}
                </ul>
              </div>
            </ShippingOption>
          ))}
        </ShippingOptionsContainer>

        <PenaltyWarning>
          <div className="warning-header">
            <span className="icon">⚠️</span>
            <span className="title">Performance Standards & Penalties</span>
          </div>
          <div className="warning-text">
            Failure to meet your shipping commitments may result in:
          </div>
          <ul>
            <li>Account performance warnings and monitoring</li>
            <li>Reduced visibility in search results</li>
            <li>Customer refunds at your expense</li>
            <li>Temporary suspension of shipping options</li>
            <li>Account restrictions for repeated violations</li>
          </ul>
        </PenaltyWarning>

        <AgreementSection>
          <div className="agreement-checkbox">
            <input
              type="checkbox"
              id="shipping-agreement"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
            />
            <label htmlFor="shipping-agreement">
              I understand and agree to fulfill the selected shipping commitment. I acknowledge that 
              consistently failing to meet these standards may result in penalties to my account, 
              including performance warnings, reduced visibility, and potential account restrictions.
            </label>
          </div>
        </AgreementSection>

        <ButtonGroup>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="confirm" 
            onClick={handleConfirm}
            disabled={!hasAgreed || selectedOptions.length === 0}
          >
            Confirm Shipping Commitments ({selectedOptions.length} selected)
          </button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ShippingCommitmentModal;