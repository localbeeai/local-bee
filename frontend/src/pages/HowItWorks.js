import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Hero = styled.section`
  text-align: center;
  padding: 3rem 0;
  background: var(--secondary-green);
  border-radius: 1rem;
  margin-bottom: 3rem;

  h1 {
    font-size: 3rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    color: var(--text-light);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const StepCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  text-align: center;

  .step-number {
    background: var(--primary-green);
    color: white;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
    margin: 0 auto 1rem;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  border: 2px solid var(--primary-green);
  background: ${props => props.active ? 'var(--primary-green)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--primary-green)'};
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--primary-green);
    color: white;
  }
`;

const HowItWorks = () => {
  const [activeTab, setActiveTab] = React.useState('customers');

  const customerSteps = [
    {
      number: 1,
      icon: '🔍',
      title: 'Discover Local Products',
      description: 'Browse our marketplace to find fresh produce, artisan goods, and unique products from local merchants in your area.'
    },
    {
      number: 2,
      icon: '🛒',
      title: 'Add to Cart & Checkout',
      description: 'Select your favorite items, choose pickup or delivery, and complete your order with our secure checkout process.'
    },
    {
      number: 3,
      icon: '📦',
      title: 'Pickup or Delivery',
      description: 'Either pick up your order at the merchant location or have it delivered to your door with our flexible delivery options.'
    },
    {
      number: 4,
      icon: '🌟',
      title: 'Enjoy & Review',
      description: 'Enjoy your fresh, local products and leave a review to help other customers and support your favorite merchants.'
    }
  ];

  const merchantSteps = [
    {
      number: 1,
      icon: '📝',
      title: 'Create Your Account',
      description: 'Sign up as a merchant and provide your business information, location, and delivery preferences.'
    },
    {
      number: 2,
      icon: '📸',
      title: 'List Your Products',
      description: 'Upload photos and descriptions of your products, set prices, and specify inventory and delivery options.'
    },
    {
      number: 3,
      icon: '📱',
      title: 'Manage Orders',
      description: 'Receive notifications for new orders, update order status, and communicate with customers through our platform.'
    },
    {
      number: 4,
      icon: '💰',
      title: 'Get Paid',
      description: 'Receive payments directly to your account and track your sales performance with our merchant dashboard.'
    }
  ];

  return (
    <Container>
      <Hero>
        <h1>🛍️ How LocalMarket Works</h1>
        <p>
          Connecting local communities with fresh products and amazing merchants 
          has never been easier. Here's how it works for everyone.
        </p>
      </Hero>

      <TabContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'customers'} 
            onClick={() => setActiveTab('customers')}
          >
            🛒 For Customers
          </TabButton>
          <TabButton 
            active={activeTab === 'merchants'} 
            onClick={() => setActiveTab('merchants')}
          >
            🏪 For Merchants
          </TabButton>
        </TabButtons>

        <Section>
          <h2>
            {activeTab === 'customers' ? 'Shopping Made Simple' : 'Selling Made Easy'}
          </h2>
          <StepsGrid>
            {(activeTab === 'customers' ? customerSteps : merchantSteps).map((step) => (
              <StepCard key={step.number}>
                <div className="step-number">{step.number}</div>
                <div className="icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </StepCard>
            ))}
          </StepsGrid>
        </Section>
      </TabContainer>

      <Section>
        <h2>🚚 Delivery Options</h2>
        <StepsGrid>
          <StepCard>
            <div className="icon">🏪</div>
            <h3>Local Pickup</h3>
            <p>
              Pick up your order directly from the merchant's location at your 
              convenience. Perfect for fresh items and building relationships 
              with local business owners.
            </p>
          </StepCard>
          
          <StepCard>
            <div className="icon">🚛</div>
            <h3>Standard Delivery</h3>
            <p>
              Get your order delivered within 1-2 business days. Great for 
              planning ahead and ensuring you have fresh, local products 
              when you need them.
            </p>
          </StepCard>
          
          <StepCard>
            <div className="icon">⚡</div>
            <h3>Same-Day Delivery</h3>
            <p>
              Need something today? Many of our merchants offer same-day delivery 
              for orders placed before noon. Perfect for last-minute needs and 
              fresh ingredients.
            </p>
          </StepCard>
        </StepsGrid>
      </Section>

      <Section>
        <h2>💳 Payment & Pricing</h2>
        <div style={{ background: 'var(--natural-beige)', padding: '2rem', borderRadius: '1rem' }}>
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>Transparent Pricing</h3>
          <ul style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>
            <li><strong>For Customers:</strong> No hidden fees! You pay the merchant's price plus any applicable delivery fees (clearly shown at checkout)</li>
            <li><strong>For Merchants:</strong> Simple commission structure - we only succeed when you succeed</li>
            <li><strong>Payment Methods:</strong> Credit cards, debit cards, and digital wallets accepted</li>
            <li><strong>Secure Processing:</strong> All transactions are encrypted and secure</li>
          </ul>
        </div>
      </Section>
    </Container>
  );
};

export default HowItWorks;