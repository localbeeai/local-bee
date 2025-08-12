import React, { useState } from 'react';
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);

  h2 {
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
  }

  input, textarea, select {
    width: 100%;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  background: var(--primary-green);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover:not(:disabled) {
    background: var(--primary-green-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ContactInfo = styled.div`
  h2 {
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
  }
`;

const InfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;

  .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
  }

  a {
    color: var(--primary-green);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FAQSection = styled.section`
  margin-top: 3rem;

  h2 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const FAQItem = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  margin-bottom: 1rem;

  h3 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'general',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        type: 'general',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  const faqs = [
    {
      question: 'How do I become a merchant on LocalMarket?',
      answer: 'Simply click "Sign Up" and select "Merchant" during registration. You\'ll need to provide business information and verification documents. Once approved, you can start listing products immediately.'
    },
    {
      question: 'What are the delivery fees?',
      answer: 'Delivery fees vary by merchant and distance. Standard delivery typically ranges from $3-8, while same-day delivery may have additional charges. All fees are clearly shown before checkout.'
    },
    {
      question: 'How do I track my order?',
      answer: 'After placing an order, you\'ll receive email updates and can track your order status in your customer dashboard. You\'ll get notifications when your order is being prepared, ready for pickup, or out for delivery.'
    },
    {
      question: 'What if I need to return something?',
      answer: 'Each merchant has their own return policy, which you can find on their profile page. For fresh products, please contact the merchant directly within 24 hours if there are any quality issues.'
    }
  ];

  return (
    <Container>
      <Hero>
        <h1>📞 Contact Us</h1>
        <p>
          Have questions, suggestions, or need help? We're here for you! 
          Reach out to our friendly team and we'll get back to you quickly.
        </p>
      </Hero>

      <ContentGrid>
        <ContactForm onSubmit={handleSubmit}>
          <h2>Send us a Message</h2>
          
          <FormGroup>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="type">Message Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="general">General Inquiry</option>
              <option value="merchant">Merchant Support</option>
              <option value="customer">Customer Support</option>
              <option value="technical">Technical Issue</option>
              <option value="partnership">Partnership</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Brief description of your inquiry"
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Tell us more about how we can help you..."
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </SubmitButton>
        </ContactForm>

        <ContactInfo>
          <h2>Get in Touch</h2>
          
          <InfoCard>
            <div className="icon">💬</div>
            <h3>Customer Support</h3>
            <p>
              Need help with an order or have questions about products?<br/>
              <a href="mailto:support@localmarket.com">support@localmarket.com</a><br/>
              Response time: Within 4 hours
            </p>
          </InfoCard>

          <InfoCard>
            <div className="icon">🏪</div>
            <h3>Merchant Support</h3>
            <p>
              Questions about selling on LocalMarket?<br/>
              <a href="mailto:merchants@localmarket.com">merchants@localmarket.com</a><br/>
              Response time: Within 2 hours
            </p>
          </InfoCard>

          <InfoCard>
            <div className="icon">📞</div>
            <h3>Phone Support</h3>
            <p>
              For urgent matters, call us:<br/>
              <a href="tel:+1-555-LOCAL-01">+1 (555) LOCAL-01</a><br/>
              Mon-Fri: 8 AM - 8 PM<br/>
              Sat-Sun: 10 AM - 6 PM
            </p>
          </InfoCard>

          <InfoCard>
            <div className="icon">📍</div>
            <h3>Office Location</h3>
            <p>
              123 Community Street<br/>
              Local City, LC 12345<br/>
              United States
            </p>
          </InfoCard>
        </ContactInfo>
      </ContentGrid>

      <FAQSection>
        <h2>❓ Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <FAQItem key={index}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </FAQItem>
        ))}
      </FAQSection>
    </Container>
  );
};

export default Contact;