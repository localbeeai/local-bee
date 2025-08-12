import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: var(--text-dark);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: var(--primary-green-light);
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  ul {
    list-style: none;
    
    li {
      margin-bottom: 0.5rem;
      
      a {
        color: #d1d5db;
        text-decoration: none;
        transition: color 0.2s;
        
        &:hover {
          color: var(--primary-green-light);
        }
      }
    }
  }

  p {
    color: #d1d5db;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #374151;
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  color: #9ca3af;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>🌱 LocalMarket</h3>
          <p>
            Supporting local businesses and connecting communities through fresh, 
            locally-sourced products and artisan goods.
          </p>
          <p>
            Shop local, support local, grow local.
          </p>
        </FooterSection>

        <FooterSection>
          <h3>For Customers</h3>
          <ul>
            <li><Link to="/products">Browse Products</Link></li>
            <li><Link to="/products?category=produce">Fresh Produce</Link></li>
            <li><Link to="/products?category=prepared-foods">Prepared Foods</Link></li>
            <li><Link to="/products?category=crafts">Local Crafts</Link></li>
            <li><Link to="/dashboard/customer">My Orders</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>For Merchants</h3>
          <ul>
            <li><Link to="/signup">Become a Merchant</Link></li>
            <li><Link to="/dashboard/merchant">Merchant Dashboard</Link></li>
            <li><a href="#seller-guide">Seller Guide</a></li>
            <li><a href="#pricing">Pricing & Fees</a></li>
            <li><a href="#support">Merchant Support</a></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Support & Info</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/delivery">Delivery Info</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/contact#faq">FAQ</Link></li>
          </ul>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; 2024 LocalMarket. All rights reserved. | Privacy Policy | Terms of Service</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;