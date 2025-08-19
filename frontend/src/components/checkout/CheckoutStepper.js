import React from 'react';
import styled from 'styled-components';

const StepperContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  padding: 0 1rem;
`;

const StepWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 200px;
`;

const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: ${props => {
    if (props.completed) return '#10B981';
    if (props.active) return '#3B82F6';
    return '#E5E7EB';
  }};
  color: ${props => {
    if (props.completed || props.active) return 'white';
    return '#6B7280';
  }};
  border: 3px solid ${props => {
    if (props.completed) return '#10B981';
    if (props.active) return '#3B82F6';
    return '#E5E7EB';
  }};
`;

const StepLine = styled.div`
  flex: 1;
  height: 3px;
  margin: 0 10px;
  background: ${props => props.completed ? '#10B981' : '#E5E7EB'};
  transition: all 0.3s ease;
`;

const StepLabel = styled.div`
  text-align: center;
  margin-top: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => {
    if (props.completed || props.active) return '#1F2937';
    return '#6B7280';
  }};
`;

const CheckoutStepper = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: 'Cart Review', icon: '🛒' },
    { number: 2, label: 'Shipping', icon: '📍' },
    { number: 3, label: 'Payment', icon: '💳' },
    { number: 4, label: 'Confirmation', icon: '✅' }
  ];

  return (
    <>
      <StepperContainer>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <StepWrapper>
              <div style={{ textAlign: 'center' }}>
                <StepCircle
                  active={currentStep === step.number}
                  completed={currentStep > step.number}
                >
                  {currentStep > step.number ? '✓' : step.icon}
                </StepCircle>
                <StepLabel
                  active={currentStep === step.number}
                  completed={currentStep > step.number}
                >
                  {step.label}
                </StepLabel>
              </div>
            </StepWrapper>
            {index < steps.length - 1 && (
              <StepLine completed={currentStep > step.number} />
            )}
          </React.Fragment>
        ))}
      </StepperContainer>
    </>
  );
};

export default CheckoutStepper;