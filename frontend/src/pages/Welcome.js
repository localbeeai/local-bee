import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, var(--secondary-green), var(--accent-green));
  border-radius: 2rem;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  .celebration {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  h1 {
    color: var(--text-dark);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .subtitle {
    color: var(--text-light);
    font-size: 1.25rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: var(--shadow);

  .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-light);
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  .btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    text-decoration: none;
    display: inline-block;
    border-radius: 0.75rem;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
  }
`;

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const isMerchant = user.role === 'merchant';

  const customerFeatures = [
    {
      icon: '🛍️',
      title: 'Browse Local Products',
      description: 'Discover amazing products from local merchants in your area'
    },
    {
      icon: '📍',
      title: 'Shop by Location',
      description: 'Find products near you with our location-based search'
    },
    {
      icon: '🚚',
      title: 'Flexible Delivery',
      description: 'Choose pickup, same-day, or standard delivery options'
    },
    {
      icon: '⭐',
      title: 'Rate & Review',
      description: 'Help other customers by leaving reviews for your purchases'
    }
  ];

  const merchantFeatures = [
    {
      icon: '📦',
      title: 'List Your Products',
      description: 'Add photos, descriptions, and pricing for your products'
    },
    {
      icon: '📊',
      title: 'Track Performance',
      description: 'Monitor views, sales, and customer feedback'
    },
    {
      icon: '📱',
      title: 'Manage Orders',
      description: 'Receive and fulfill customer orders efficiently'
    },
    {
      icon: '💰',
      title: 'Grow Your Business',
      description: 'Reach more local customers and increase your sales'
    }
  ];

  return (
    <Container>
      <WelcomeCard>
        <div className="celebration">🎉</div>
        <h1>
          Welcome to LocalMarket, {user.name}!
        </h1>
        <p className="subtitle">
          {isMerchant ? (
            <>
              You're all set up as a merchant! Start listing your products and 
              connecting with local customers. Your business <strong>
              {user.businessInfo?.businessName || 'profile'}</strong> is ready to grow.
            </>
          ) : (
            <>
              You're ready to discover amazing local products and support 
              businesses in your community. Start shopping and make a difference!
            </>
          )}
        </p>

        <FeatureGrid>
          {(isMerchant ? merchantFeatures : customerFeatures).map((feature, index) => (
            <FeatureCard key={index}>
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeatureGrid>

        <ActionButtons>
          {isMerchant ? (
            <>
              <Link to="/dashboard/merchant" className="btn-primary">
                Go to Dashboard
              </Link>
              <Link to="/products" className="btn-secondary">
                Browse Products
              </Link>
            </>
          ) : (
            <>
              <Link to="/products" className="btn-primary">
                Start Shopping
              </Link>
              <Link to="/dashboard/customer" className="btn-secondary">
                My Account
              </Link>
            </>
          )}
        </ActionButtons>
      </WelcomeCard>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        color: 'var(--text-light)',
        fontSize: '0.875rem'
      }}>
        <p>
          {isMerchant ? (
            <>Need help getting started? Check out our <Link to="/how-it-works">merchant guide</Link></>
          ) : (
            <>Questions? Visit our <Link to="/contact">help center</Link> or <Link to="/how-it-works">learn how it works</Link></>
          )}
        </p>
      </div>
    </Container>
  );
};

export default Welcome;