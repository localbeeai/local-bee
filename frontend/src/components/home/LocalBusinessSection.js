import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Section = styled.section`
  padding: 5rem 0;
  background: linear-gradient(to bottom, white 0%, var(--natural-beige) 100%);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  
  .badge {
    background: var(--primary-green);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 2.75rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.2;
    
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ImagePlaceholder = styled.div`
  background: linear-gradient(135deg, var(--primary-green-light) 0%, var(--secondary-green) 100%);
  border-radius: 1rem;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.2)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23dots)"/></svg>');
  }
  
  .content {
    position: relative;
    z-index: 2;
    text-align: center;
    
    .icon {
      display: block;
      margin-bottom: 0.5rem;
    }
    
    .label {
      font-size: 1rem;
      font-weight: 600;
      opacity: 0.9;
    }
  }
`;

const ContentText = styled.div`
  h3 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    color: var(--text-light);
    font-size: 1.125rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  
  .highlight {
    color: var(--primary-green);
    font-weight: 600;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  
  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: var(--text-dark);
    font-size: 1rem;
    
    .icon {
      background: var(--primary-green);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      flex-shrink: 0;
    }
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-green);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.2s;
  
  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid var(--border-light);
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .number {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 0.5rem;
    display: block;
  }
  
  .label {
    color: var(--text-dark);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .description {
    color: var(--text-light);
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const LocalBusinessSection = () => {
  return (
    <Section>
      <Container>
        <SectionHeader>
          <div className="badge">🌱 Supporting Local Communities</div>
          <h2>Every Purchase Makes a Difference</h2>
          <p>
            When you shop local through our platform, you're not just buying products – 
            you're investing in your community's future and supporting real families.
          </p>
        </SectionHeader>
        
        <ContentGrid>
          <ImagePlaceholder>
            <div className="content">
              <span className="icon">🚜</span>
              <div className="label">Local Farmers at Work</div>
            </div>
          </ImagePlaceholder>
          
          <ContentText>
            <h3>Fresh from Local Farms</h3>
            <p>
              Our <span className="highlight">local farmers and producers</span> work tirelessly 
              to bring you the freshest, highest-quality products. By shopping with us, you're 
              getting produce that was likely harvested within days, not weeks.
            </p>
            
            <FeaturesList>
              <li>
                <span className="icon">✓</span>
                Harvested within 48 hours of delivery
              </li>
              <li>
                <span className="icon">✓</span>
                No long-distance shipping required
              </li>
              <li>
                <span className="icon">✓</span>
                Support sustainable farming practices
              </li>
              <li>
                <span className="icon">✓</span>
                Know exactly where your food comes from
              </li>
            </FeaturesList>
          </ContentText>
        </ContentGrid>
        
        <ContentGrid style={{ gridTemplateColumns: '1fr 1fr' }}>
          <ContentText>
            <h3>Artisan-Made with Love</h3>
            <p>
              From <span className="highlight">handcrafted goods to specialty foods</span>, 
              our local artisans pour their passion into every product. Each purchase 
              helps preserve traditional crafts and supports creative entrepreneurs.
            </p>
            
            <FeaturesList>
              <li>
                <span className="icon">✓</span>
                Unique, one-of-a-kind products
              </li>
              <li>
                <span className="icon">✓</span>
                Made by skilled local artisans
              </li>
              <li>
                <span className="icon">✓</span>
                Customization often available
              </li>
              <li>
                <span className="icon">✓</span>
                Stories behind every product
              </li>
            </FeaturesList>
            
            <CTAButton to="/products?category=crafts">
              Explore Artisan Products →
            </CTAButton>
          </ContentText>
          
          <ImagePlaceholder>
            <div className="content">
              <span className="icon">🎨</span>
              <div className="label">Local Artisans Creating</div>
            </div>
          </ImagePlaceholder>
        </ContentGrid>
        
        <SectionHeader style={{ marginTop: '4rem', marginBottom: '3rem' }}>
          <h2>Your Impact in Numbers</h2>
          <p>See how shopping local creates real change in our community</p>
        </SectionHeader>
        
        <StatsGrid>
          <StatCard>
            <div className="icon">💰</div>
            <span className="number">85%</span>
            <div className="label">Local Economic Impact</div>
            <p className="description">
              Of every dollar spent stays in the local community
            </p>
          </StatCard>
          
          <StatCard>
            <div className="icon">🌍</div>
            <span className="number">75%</span>
            <div className="label">Reduced Carbon Footprint</div>
            <p className="description">
              Less transportation means cleaner air for everyone
            </p>
          </StatCard>
          
          <StatCard>
            <div className="icon">👥</div>
            <span className="number">3x</span>
            <div className="label">More Local Jobs</div>
            <p className="description">
              Local businesses create more jobs per dollar than chains
            </p>
          </StatCard>
          
          <StatCard>
            <div className="icon">🏠</div>
            <span className="number">$125</span>
            <div className="label">Community Reinvestment</div>
            <p className="description">
              Average annual local spending per customer creates lasting value
            </p>
          </StatCard>
        </StatsGrid>
      </Container>
    </Section>
  );
};

export default LocalBusinessSection;