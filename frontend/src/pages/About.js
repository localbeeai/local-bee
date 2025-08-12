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
  margin-bottom: 3rem;

  h2 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);

  .number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 0.5rem;
  }

  .label {
    color: var(--text-light);
    font-weight: 500;
  }
`;

const About = () => {
  return (
    <Container>
      <Hero>
        <h1>🌱 About LocalMarket</h1>
        <p>
          We're on a mission to strengthen local communities by connecting 
          customers with amazing local businesses and fresh, quality products.
        </p>
      </Hero>

      <Section>
        <h2>Our Story</h2>
        <p>
          LocalMarket was born from a simple idea: what if supporting local businesses 
          was as easy as shopping online? We saw how challenging it was for local farmers, 
          artisans, and small business owners to reach customers beyond their immediate 
          neighborhood, while customers struggled to discover the amazing products 
          available right in their own communities.
        </p>
        <p>
          Founded in 2024, we've built a platform that bridges this gap, making it 
          simple for local merchants to showcase their products and for customers to 
          discover, order, and receive fresh, local goods with convenient pickup and 
          delivery options.
        </p>
      </Section>

      <Section>
        <h2>Our Mission</h2>
        <p>
          To revitalize local economies by creating meaningful connections between 
          communities and their local businesses. We believe that when you shop local, 
          you're not just buying a product – you're supporting a dream, creating jobs, 
          and building a stronger, more sustainable community.
        </p>
      </Section>

      <StatsGrid>
        <StatCard>
          <div className="number">500+</div>
          <div className="label">Local Merchants</div>
        </StatCard>
        <StatCard>
          <div className="number">10,000+</div>
          <div className="label">Happy Customers</div>
        </StatCard>
        <StatCard>
          <div className="number">50+</div>
          <div className="label">Cities Served</div>
        </StatCard>
        <StatCard>
          <div className="number">$2M+</div>
          <div className="label">Paid to Local Businesses</div>
        </StatCard>
      </StatsGrid>

      <Section>
        <h2>Why Local Matters</h2>
        <p>
          Shopping local isn't just a trend – it's a powerful way to make a positive 
          impact. When you choose local products, you're supporting sustainable practices, 
          reducing environmental impact, and ensuring that your money stays within your 
          community, creating a multiplier effect that benefits everyone.
        </p>
        <p>
          Local businesses are the backbone of vibrant communities. They create unique 
          character, provide personalized service, and often source their products 
          more sustainably than large corporations. By shopping local through LocalMarket, 
          you're voting for the kind of community you want to live in.
        </p>
      </Section>

      <Section>
        <h2>Our Values</h2>
        <ul style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>
          <li><strong>Community First:</strong> Every decision we make prioritizes the well-being of local communities</li>
          <li><strong>Sustainability:</strong> We promote environmentally responsible practices and reduce food miles</li>
          <li><strong>Quality:</strong> We help merchants showcase their best products and maintain high standards</li>
          <li><strong>Transparency:</strong> Fair pricing and clear communication for both merchants and customers</li>
          <li><strong>Innovation:</strong> Using technology to solve real problems for real people</li>
        </ul>
      </Section>
    </Container>
  );
};

export default About;