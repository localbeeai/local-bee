import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Section = styled.section`
  padding: 5rem 0;
  background: white;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  
  h2 {
    font-size: 2.75rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.125rem;
    color: var(--text-light);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
`;

const StepCard = styled.div`
  text-align: center;
  position: relative;
  
  &:not(:last-child)::after {
    content: '→';
    position: absolute;
    top: 50%;
    right: -1.5rem;
    transform: translateY(-50%);
    font-size: 2rem;
    color: var(--primary-green);
    font-weight: bold;
    
    @media (max-width: 968px) {
      content: '↓';
      top: auto;
      bottom: -1.5rem;
      right: 50%;
      transform: translateX(50%);
    }
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const StepIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
  position: relative;
  
  .step-number {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background: #fbbf24;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-dark);
  }
`;

const StepContent = styled.div`
  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .features {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      color: var(--primary-green);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      
      &::before {
        content: '✓ ';
        font-weight: bold;
      }
    }
  }
`;

const DeliveryOptions = styled.div`
  background: var(--natural-beige);
  border-radius: 1rem;
  padding: 3rem 2rem;
  margin: 4rem 0;
  
  h3 {
    text-align: center;
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 2rem;
    font-weight: 700;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const OptionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .time {
    color: var(--primary-green);
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-light);
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const CTASection = styled.div`
  background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  color: white;
  
  h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.2s;
  display: inline-block;
  
  &.primary {
    background: #fbbf24;
    color: var(--text-dark);
    
    &:hover {
      background: #f59e0b;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
    }
  }
  
  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: white;
      color: var(--text-dark);
      transform: translateY(-2px);
    }
  }
`;

const HowItWorksSection = () => {
  const steps = [
    {
      icon: '📍',
      title: 'Set Your Location',
      description: 'Tell us your zip code or allow location access to find local merchants and products near you.',
      features: ['Automatic location detection', 'Zip code search', 'Customizable radius']
    },
    {
      icon: '🛒',
      title: 'Browse & Shop',
      description: 'Discover amazing local products from farmers, bakers, artisans, and small businesses in your area.',
      features: ['Fresh produce & groceries', 'Handmade crafts & goods', 'Specialty foods & treats']
    },
    {
      icon: '🚚',
      title: 'Choose Delivery',
      description: 'Pick the option that works best for you - pickup, same-day delivery, or standard delivery.',
      features: ['Flexible pickup times', 'Same-day delivery', 'Contactless options']
    },
    {
      icon: '🎉',
      title: 'Enjoy Local Goodness',
      description: 'Receive your fresh, local products while knowing you\'re supporting your community.',
      features: ['Fresh & quality guaranteed', 'Support local economy', 'Sustainable shopping']
    }
  ];

  return (
    <Section>
      <Container>
        <SectionHeader>
          <h2>How LocalMarket Works</h2>
          <p>
            Shopping local has never been easier. Follow these simple steps to discover 
            amazing products from your community.
          </p>
        </SectionHeader>
        
        <StepsGrid>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepIcon>
                {step.icon}
                <span className="step-number">{index + 1}</span>
              </StepIcon>
              <StepContent>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <ul className="features">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </StepContent>
            </StepCard>
          ))}
        </StepsGrid>
        
        <DeliveryOptions>
          <h3>Flexible Delivery & Pickup Options</h3>
          <OptionsGrid>
            <OptionCard>
              <div className="icon">🏪</div>
              <h4>Pickup</h4>
              <div className="time">Ready in 1-2 hours</div>
              <p>
                Pick up your order directly from the merchant. Perfect for saving on delivery 
                fees and meeting local business owners.
              </p>
            </OptionCard>
            
            <OptionCard>
              <div className="icon">⚡</div>
              <h4>Same-Day Delivery</h4>
              <div className="time">2-4 hours</div>
              <p>
                Get your local products delivered the same day. Ideal for fresh produce 
                and when you need items quickly.
              </p>
            </OptionCard>
            
            <OptionCard>
              <div className="icon">📦</div>
              <h4>Standard Delivery</h4>
              <div className="time">1-2 days</div>
              <p>
                Scheduled delivery for non-perishable items. Plan ahead and save with 
                our most economical delivery option.
              </p>
            </OptionCard>
          </OptionsGrid>
        </DeliveryOptions>
        
        <CTASection>
          <h3>Ready to Support Local Business?</h3>
          <p>
            Join thousands of customers who are already discovering amazing local products 
            and supporting their community's economy.
          </p>
          <CTAButtons>
            <Button to="/products" className="primary">
              Start Shopping Now
            </Button>
            <Button to="/signup" className="secondary">
              Become a Merchant
            </Button>
          </CTAButtons>
        </CTASection>
      </Container>
    </Section>
  );
};

export default HowItWorksSection;