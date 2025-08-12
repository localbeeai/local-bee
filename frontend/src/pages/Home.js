import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Hero = styled.section`
  background: linear-gradient(135deg, var(--secondary-green), var(--accent-green));
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 1rem;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.25rem;
    color: var(--text-light);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  .btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    text-decoration: none;
    display: inline-block;
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const Features = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  h2 {
    text-align: center;
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 3rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--natural-beige);

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const CategoriesSection = styled.section`
  padding: 4rem 0;
  background: var(--natural-beige);
`;

const Categories = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  h2 {
    text-align: center;
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 3rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const CategoryCard = styled(Link)`
  display: block;
  text-decoration: none;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }

  .category-image {
    height: 150px;
    background: var(--primary-green-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .category-content {
    padding: 1.5rem;
    
    h3 {
      color: var(--text-dark);
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--text-light);
      font-size: 0.875rem;
    }
  }
`;

const Home = () => {
  const { user } = useAuth();
  
  const categories = [
    { name: 'Fresh Produce', icon: '🥕', path: '/products?category=produce', desc: 'Farm-fresh fruits & vegetables' },
    { name: 'Dairy & Eggs', icon: '🥛', path: '/products?category=dairy', desc: 'Local dairy products' },
    { name: 'Meat & Seafood', icon: '🥩', path: '/products?category=meat', desc: 'Locally sourced proteins' },
    { name: 'Seafood', icon: '🦐', path: '/products?category=seafood', desc: 'Fresh local seafood' },
    { name: 'Bakery', icon: '🥖', path: '/products?category=bakery', desc: 'Fresh baked goods' },
    { name: 'Beverages', icon: '☕', path: '/products?category=beverages', desc: 'Coffee, tea, juices & more' },
    { name: 'Prepared Foods', icon: '🍽️', path: '/products?category=prepared-foods', desc: 'Ready-to-eat meals' },
    { name: 'Snacks', icon: '🍪', path: '/products?category=snacks', desc: 'Local treats & snacks' },
    { name: 'Condiments', icon: '🍯', path: '/products?category=condiments', desc: 'Sauces, jams & spreads' },
    { name: 'Spices & Herbs', icon: '🌿', path: '/products?category=spices', desc: 'Fresh & dried seasonings' },
    { name: 'Health Products', icon: '🧴', path: '/products?category=health', desc: 'Natural wellness products' },
    { name: 'Beauty Products', icon: '💄', path: '/products?category=beauty', desc: 'Natural beauty items' },
    { name: 'Home Goods', icon: '🏠', path: '/products?category=home', desc: 'Candles, decor & essentials' },
    { name: 'Local Crafts', icon: '🎨', path: '/products?category=crafts', desc: 'Handmade local goods' },
    { name: 'Fresh Flowers', icon: '🌸', path: '/products?category=flowers', desc: 'Locally grown flowers' },
    { name: 'Other Items', icon: '📦', path: '/products?category=other', desc: 'Unique local products' },
  ];

  return (
    <>
      <Hero>
        <HeroContent>
          <h1>Discover Amazing Local Products</h1>
          <p>
            Connect with local merchants and discover fresh produce, artisan goods, 
            and unique products from your community. Support local businesses with 
            convenient pickup and delivery options.
          </p>
          <CTAButtons>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
            {user ? (
              user.role === 'merchant' ? (
                <Link to="/dashboard/merchant" className="btn-secondary">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/dashboard/customer" className="btn-secondary">
                  My Account
                </Link>
              )
            ) : (
              <Link to="/signup" className="btn-secondary">
                Become a Merchant
              </Link>
            )}
          </CTAButtons>
        </HeroContent>
      </Hero>

      <FeaturesSection>
        <Features>
          <h2>Why Choose LocalMarket?</h2>
          <FeatureGrid>
            <FeatureCard>
              <div className="icon">🌱</div>
              <h3>Support Local</h3>
              <p>
                Every purchase directly supports local farmers, artisans, and small businesses 
                in your community, helping your local economy thrive.
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="icon">🚚</div>
              <h3>Flexible Delivery</h3>
              <p>
                Choose from pickup, same-day delivery, or standard delivery. 
                Get fresh products delivered right to your door or pick up at your convenience.
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="icon">📍</div>
              <h3>Hyper-Local</h3>
              <p>
                Find products within your desired radius. Search by zip code and discover 
                amazing local businesses you never knew existed.
              </p>
            </FeatureCard>
          </FeatureGrid>
        </Features>
      </FeaturesSection>

      <CategoriesSection>
        <Categories>
          <h2>Shop by Category</h2>
          <CategoryGrid>
            {categories.map((category) => (
              <CategoryCard key={category.name} to={category.path}>
                <div className="category-image">
                  {category.icon}
                </div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.desc}</p>
                </div>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </Categories>
      </CategoriesSection>
    </>
  );
};

export default Home;