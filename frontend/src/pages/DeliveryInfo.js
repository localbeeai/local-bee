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
    margin-bottom: 1.5rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const DeliveryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const DeliveryCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .price {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  .features {
    margin-top: 1rem;
    
    li {
      color: var(--text-light);
      margin-bottom: 0.5rem;
    }
  }
`;

const ZoneMap = styled.div`
  background: var(--natural-beige);
  padding: 2rem;
  border-radius: 1rem;
  margin: 2rem 0;

  h3 {
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  .zone {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-light);

    &:last-child {
      border-bottom: none;
    }

    .zone-name {
      font-weight: 500;
      color: var(--text-dark);
    }

    .zone-fee {
      color: var(--primary-green);
      font-weight: 600;
    }
  }
`;

const InfoBox = styled.div`
  background: ${props => props.type === 'tip' ? '#f0f9ff' : '#fef3c7'};
  border: 1px solid ${props => props.type === 'tip' ? '#0ea5e9' : '#f59e0b'};
  padding: 1.5rem;
  border-radius: 1rem;
  margin: 1.5rem 0;

  .icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }

  h4 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }

  p {
    color: var(--text-light);
    margin: 0;
  }
`;

const DeliveryInfo = () => {
  return (
    <Container>
      <Hero>
        <h1>🚚 Delivery Information</h1>
        <p>
          Fast, reliable delivery options to get your fresh, local products 
          right to your door. Choose what works best for your schedule.
        </p>
      </Hero>

      <Section>
        <h2>Delivery Options</h2>
        <DeliveryGrid>
          <DeliveryCard>
            <div className="icon">🏪</div>
            <h3>Local Pickup</h3>
            <div className="price">FREE</div>
            <p>Pick up your order directly from the merchant's location.</p>
            <ul className="features">
              <li>✅ No delivery fees</li>
              <li>✅ Meet local business owners</li>
              <li>✅ Available during business hours</li>
              <li>✅ Perfect for large or fragile items</li>
            </ul>
          </DeliveryCard>

          <DeliveryCard>
            <div className="icon">🚛</div>
            <h3>Standard Delivery</h3>
            <div className="price">$3 - $8</div>
            <p>Reliable next-day delivery for most orders.</p>
            <ul className="features">
              <li>✅ 1-2 business day delivery</li>
              <li>✅ Delivery tracking included</li>
              <li>✅ Available 7 days a week</li>
              <li>✅ Contactless delivery option</li>
            </ul>
          </DeliveryCard>

          <DeliveryCard>
            <div className="icon">⚡</div>
            <h3>Same-Day Delivery</h3>
            <div className="price">$8 - $15</div>
            <p>Get your order delivered the same day for urgent needs.</p>
            <ul className="features">
              <li>✅ Order by 12 PM for same-day delivery</li>
              <li>✅ Perfect for fresh ingredients</li>
              <li>✅ Available in select areas</li>
              <li>✅ Real-time tracking</li>
            </ul>
          </DeliveryCard>
        </DeliveryGrid>
      </Section>

      <Section>
        <h2>📍 Delivery Areas & Fees</h2>
        <p>
          Delivery fees are calculated based on distance from the merchant. 
          Many merchants offer free delivery for orders over a certain amount.
        </p>
        
        <ZoneMap>
          <h3>Typical Delivery Zones</h3>
          <div className="zone">
            <span className="zone-name">Within 5 miles</span>
            <span className="zone-fee">$3.00</span>
          </div>
          <div className="zone">
            <span className="zone-name">5-10 miles</span>
            <span className="zone-fee">$5.00</span>
          </div>
          <div className="zone">
            <span className="zone-name">10-15 miles</span>
            <span className="zone-fee">$8.00</span>
          </div>
          <div className="zone">
            <span className="zone-name">15+ miles</span>
            <span className="zone-fee">Varies by merchant</span>
          </div>
        </ZoneMap>

        <InfoBox type="tip">
          <h4><span className="icon">💡</span>Pro Tip</h4>
          <p>
            Many merchants offer free delivery on orders over $50! Look for the 
            "Free Delivery" badge when browsing products.
          </p>
        </InfoBox>
      </Section>

      <Section>
        <h2>⏰ Delivery Times</h2>
        
        <DeliveryGrid>
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1rem' }}>Standard Delivery Schedule</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <strong>Monday - Friday</strong><br/>
                <span style={{ color: 'var(--text-light)' }}>9 AM - 7 PM</span>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <strong>Saturday</strong><br/>
                <span style={{ color: 'var(--text-light)' }}>10 AM - 6 PM</span>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <strong>Sunday</strong><br/>
                <span style={{ color: 'var(--text-light)' }}>12 PM - 5 PM</span>
              </div>
            </div>
          </div>
        </DeliveryGrid>

        <InfoBox type="warning">
          <h4><span className="icon">⚠️</span>Weather Notice</h4>
          <p>
            Delivery times may be extended during severe weather conditions. 
            We'll notify you of any delays and work to deliver your order as soon as safely possible.
          </p>
        </InfoBox>
      </Section>

      <Section>
        <h2>📦 What to Expect</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>📧 Order Confirmation</h4>
            <p style={{ color: 'var(--text-light)', margin: 0 }}>
              You'll receive an email confirmation with your order details and estimated delivery time.
            </p>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>📱 Real-time Updates</h4>
            <p style={{ color: 'var(--text-light)', margin: 0 }}>
              Track your order status and get notifications when it's being prepared and out for delivery.
            </p>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>🏠 Safe Delivery</h4>
            <p style={{ color: 'var(--text-light)', margin: 0 }}>
              Our drivers follow contactless delivery protocols and will place orders safely at your door.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <h2>❄️ Special Handling</h2>
        <p>
          We take extra care with temperature-sensitive items like fresh produce, 
          dairy, and frozen goods. All cold items are delivered in insulated bags 
          to maintain freshness.
        </p>
        
        <ul style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>
          <li><strong>Fresh Produce:</strong> Delivered in breathable bags to maintain quality</li>
          <li><strong>Dairy & Frozen:</strong> Kept cold with ice packs during transport</li>
          <li><strong>Fragile Items:</strong> Carefully packaged to prevent damage</li>
          <li><strong>Large Orders:</strong> May require scheduled delivery appointment</li>
        </ul>
      </Section>
    </Container>
  );
};

export default DeliveryInfo;