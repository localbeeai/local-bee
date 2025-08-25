import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLocation } from '../../context/LocationContext';

const HeroSection = styled.section`
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.95) 0%,
    rgba(5, 150, 105, 0.95) 50%,
    rgba(4, 120, 87, 0.95) 100%
  ),
  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="farmers-market" patternUnits="userSpaceOnUse" width="200" height="200"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="150" cy="100" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="100" cy="150" r="2.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23farmers-market)"/></svg>');
  background-size: cover;
  background-position: center;
  padding: 6rem 0 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 4rem 0 3rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
`;

const MainHeading = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  .highlight {
    color: #fbbf24;
    display: inline-block;
    position: relative;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.375rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 0 auto 3rem;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    margin: 0 1rem 2rem;
    padding: 1rem;
  }
`;

const SearchTitle = styled.h3`
  color: var(--text-dark);
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-light);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
  }
  
  &::placeholder {
    color: var(--text-light);
  }
`;

const SearchButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  
  &:hover {
    background: #059669;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 2px dashed var(--primary-green);
  border-radius: 0.5rem;
  color: var(--primary-green);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(16, 185, 129, 0.1);
    border-style: solid;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  
  .btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    border-radius: 0.75rem;
    transition: all 0.2s;
    border: 2px solid transparent;
  }
  
  .btn-primary {
    background: #fbbf24;
    color: var(--text-dark);
    border-color: #fbbf24;
    
    &:hover {
      background: #f59e0b;
      border-color: #f59e0b;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
    }
  }
  
  .btn-secondary {
    background: transparent;
    color: white;
    border-color: white;
    
    &:hover {
      background: white;
      color: var(--text-dark);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
    }
  }
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    flex-wrap: wrap;
  }
`;

const Stat = styled.div`
  text-align: center;
  color: white;
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    display: block;
    color: #fbbf24;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  .label {
    font-size: 0.875rem;
    opacity: 0.8;
    margin-top: 0.25rem;
  }
`;

const EnhancedHero = () => {
  const { userLocation, setLocation, promptLocationSetup } = useLocation();
  const [searchZip, setSearchZip] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearchError('');
    
    if (!searchZip.trim()) {
      setSearchError('Please enter a zip code');
      return;
    }
    
    // Basic zip code validation (5 digits)
    const zipCodeRegex = /^\d{5}$/;
    if (!zipCodeRegex.test(searchZip)) {
      setSearchError('Please enter a valid 5-digit zip code');
      return;
    }
    
    try {
      // Set the location using LocationContext
      await setLocation(searchZip);
      navigate(`/products?zip=${searchZip}`);
    } catch (error) {
      setSearchError('Invalid zip code. Please try again.');
    }
  };

  const handleLocationRequest = () => {
    promptLocationSetup();
  };

  return (
    <HeroSection>
      <HeroContent>
        <MainHeading>
          Discover <span className="highlight">Local Products</span><br />
          From Your Community
        </MainHeading>
        
        <Subtitle>
          Support local farmers, artisans, and small businesses while getting the freshest products 
          delivered right to your door or available for pickup.
        </Subtitle>
        
        <SearchContainer>
          <SearchTitle>🔍 Find products near you</SearchTitle>
          
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchInput
              type="text"
              placeholder={userLocation ? `Current: ${userLocation.city || userLocation.zipCode} - Enter new zip` : "Enter your zip code (e.g. 10001)"}
              value={searchZip}
              onChange={(e) => setSearchZip(e.target.value)}
              maxLength={5}
              pattern="\d{5}"
            />
            <SearchButton type="submit">
              Search Products
            </SearchButton>
          </SearchForm>
          
          {!userLocation && (
            <LocationButton onClick={handleLocationRequest}>
              📍 Or Use GPS to Set Location
            </LocationButton>
          )}
          
          {searchError && (
            <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {searchError}
            </div>
          )}
        </SearchContainer>
        
        <CTAButtons>
          <Link to="/products" className="btn-primary">
            Browse All Products
          </Link>
          <Link to="/signup" className="btn-secondary">
            Become a Local Merchant
          </Link>
        </CTAButtons>
        
        <StatsRow>
          <Stat>
            <span className="number">500+</span>
            <div className="label">Local Products</div>
          </Stat>
          <Stat>
            <span className="number">50+</span>
            <div className="label">Local Merchants</div>
          </Stat>
          <Stat>
            <span className="number">25mi</span>
            <div className="label">Average Delivery</div>
          </Stat>
          <Stat>
            <span className="number">100%</span>
            <div className="label">Local Focus</div>
          </Stat>
        </StatsRow>
      </HeroContent>
    </HeroSection>
  );
};

export default EnhancedHero;