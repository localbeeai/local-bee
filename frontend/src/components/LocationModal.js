import React, { useState } from 'react';
import styled from 'styled-components';
import locationService from '../services/locationService';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
  padding: 2rem;
  text-align: center;
  color: white;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.875rem;
  }
`;

const Content = styled.div`
  padding: 2rem;
`;

const LocationOption = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border: 2px solid var(--border-light);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-green);
    background: var(--natural-beige);
  }
  
  .option-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
    
    .icon {
      font-size: 1.5rem;
    }
    
    h3 {
      margin: 0;
      color: var(--text-dark);
      font-size: 1.125rem;
    }
  }
  
  p {
    margin: 0;
    color: var(--text-light);
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const ZipCodeForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: var(--primary-green);
    color: white;
    
    &:hover:not(:disabled) {
      background: #059669;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: var(--border-light);
    color: var(--text-dark);
    
    &:hover {
      background: #e5e5e5;
    }
  }
`;

const Footer = styled.div`
  padding: 1rem 2rem 2rem;
  text-align: center;
  
  .skip-link {
    color: var(--text-light);
    text-decoration: none;
    font-size: 0.875rem;
    
    &:hover {
      color: var(--primary-green);
      text-decoration: underline;
    }
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 1rem;
  color: var(--text-light);
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const LocationModal = ({ isOpen, onClose, onLocationSet }) => {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showZipForm, setShowZipForm] = useState(false);

  if (!isOpen) return null;

  const handleCurrentLocation = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await locationService.requestLocationWithPrompt();
      onLocationSet(result.zipCode || null, 'geolocation');
      onClose();
    } catch (error) {
      console.error('Location error:', error);
      if (error.code === 1) {
        setError('Location access denied. Please use the zip code option below.');
      } else if (error.code === 2) {
        setError('Unable to determine your location. Please try the zip code option.');
      } else {
        setError('Location service unavailable. Please enter your zip code manually.');
      }
      setShowZipForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleZipCodeSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!zipCode.trim()) {
      setError('Please enter a zip code');
      return;
    }
    
    if (!locationService.isValidZipCode(zipCode)) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }
    
    locationService.setUserZipCode(zipCode);
    onLocationSet(zipCode, 'manual');
    onClose();
  };

  const handleSkip = () => {
    onLocationSet(null, 'skipped');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <div className="icon">📍</div>
          <h2>Find Local Products Near You</h2>
          <p>Help us show you the best local merchants and products in your area</p>
        </Header>
        
        <Content>
          {loading ? (
            <LoadingState>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
              <p>Getting your location...</p>
            </LoadingState>
          ) : (
            <>
              {!showZipForm && (
                <LocationOption onClick={handleCurrentLocation}>
                  <div className="option-header">
                    <span className="icon">🎯</span>
                    <h3>Use Current Location</h3>
                  </div>
                  <p>
                    Automatically detect your location to show nearby merchants and products. 
                    Your location is only used to improve your shopping experience.
                  </p>
                </LocationOption>
              )}
              
              <LocationOption onClick={() => setShowZipForm(true)}>
                <div className="option-header">
                  <span className="icon">📮</span>
                  <h3>Enter Zip Code</h3>
                </div>
                <p>
                  Manually enter your zip code to find local products and merchants in your area.
                </p>
                
                {showZipForm && (
                  <ZipCodeForm onSubmit={handleZipCodeSubmit}>
                    <Input
                      type="text"
                      placeholder="Enter zip code (e.g., 84049)"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      maxLength={5}
                      pattern="\d{5}"
                    />
                    <Button type="submit" className="primary">
                      Set Location
                    </Button>
                  </ZipCodeForm>
                )}
              </LocationOption>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </>
          )}
        </Content>
        
        <Footer>
          <button className="skip-link" onClick={handleSkip}>
            Skip for now - Browse all products
          </button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default LocationModal;