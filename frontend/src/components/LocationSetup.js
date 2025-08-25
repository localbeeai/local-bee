import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import locationService from '../services/locationService';

const LocationSetupModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  p {
    color: var(--text-light);
    line-height: 1.5;
  }
`;

const LocationOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-light);
  border-radius: 0.75rem;
  background: white;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  
  &:hover {
    border-color: var(--primary-green);
    background: var(--secondary-green);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .icon {
    font-size: 1.5rem;
    min-width: 1.5rem;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .description {
      font-size: 0.875rem;
      color: var(--text-light);
    }
  }
`;

const ZipCodeForm = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
  }
  
  .input-group {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-green);
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
  }
  
  .radius-input {
    width: 120px;
    flex: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    
    &.secondary {
      background: var(--border-light);
      color: var(--text-dark);
      border: 1px solid var(--border-light);
      
      &:hover {
        background: #E5E7EB;
      }
    }
    
    &.primary {
      background: var(--primary-green);
      color: white;
      border: 1px solid var(--primary-green);
      
      &:hover:not(:disabled) {
        background: var(--primary-green-dark);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
`;

const ErrorMessage = styled.div`
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  color: #DC2626;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid var(--primary-green);
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LocationSetup = ({ isOpen, onClose, onLocationSet }) => {
  const [showZipForm, setShowZipForm] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Check if user has already set a location
      const existingZip = locationService.getUserZipCode();
      const existingLocation = locationService.getUserLocation();
      const permission = locationService.getLocationPermission();
      
      setLocationStatus({
        hasZipCode: !!existingZip,
        hasLocation: !!existingLocation,
        permission
      });
      
      if (existingZip) {
        setZipCode(existingZip);
      }
    }
  }, [isOpen]);

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { location, zipCode: foundZip } = await locationService.requestLocationWithPrompt();
      
      if (foundZip) {
        await onLocationSet({
          type: 'gps',
          zipCode: foundZip,
          latitude: location.latitude,
          longitude: location.longitude,
          radius: radius
        });
        onClose();
      } else {
        setError('Could not determine your zip code from GPS location. Please enter it manually.');
        setShowZipForm(true);
      }
    } catch (error) {
      console.error('Location error:', error);
      if (error.code === 1) {
        setError('Location access denied. Please enter your zip code manually.');
      } else if (error.code === 2) {
        setError('Location unavailable. Please enter your zip code manually.');
      } else {
        setError('Location request timed out. Please enter your zip code manually.');
      }
      setShowZipForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleZipCodeSubmit = async () => {
    if (!zipCode.trim()) {
      setError('Please enter a zip code');
      return;
    }
    
    if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const locationData = await locationService.setUserZipCode(zipCode.trim());
      
      await onLocationSet({
        type: 'zipcode',
        zipCode: zipCode.trim(),
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        city: locationData?.city,
        state: locationData?.state,
        radius: radius
      });
      
      onClose();
    } catch (error) {
      console.error('Zip code error:', error);
      setError('Invalid zip code or service unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Continue without location
    onLocationSet(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <LocationSetupModal>
      <Modal>
        <Header>
          <div className="icon">📍</div>
          <h2>Find Local Products Near You</h2>
          <p>
            Set your location to discover fresh products from nearby merchants and farmers.
            We'll show you items within your preferred delivery radius.
          </p>
        </Header>

        {error && (
          <ErrorMessage>
            <span>⚠️</span>
            {error}
          </ErrorMessage>
        )}

        {!showZipForm ? (
          <LocationOptions>
            <LocationButton 
              onClick={handleUseCurrentLocation} 
              disabled={loading}
            >
              <div className="icon">🎯</div>
              <div className="content">
                <div className="title">
                  Use Current Location
                  {loading && <LoadingSpinner style={{marginLeft: '0.5rem'}} />}
                </div>
                <div className="description">
                  Automatically detect your location for the most accurate results
                </div>
              </div>
            </LocationButton>

            <LocationButton onClick={() => setShowZipForm(true)}>
              <div className="icon">📮</div>
              <div className="content">
                <div className="title">Enter Zip Code</div>
                <div className="description">
                  Manually enter your zip code and set your shopping radius
                </div>
              </div>
            </LocationButton>
          </LocationOptions>
        ) : (
          <ZipCodeForm>
            <label>Zip Code & Shopping Radius</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter zip code (e.g., 90210)"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                maxLength="5"
                pattern="\d{5}"
              />
              <input
                type="number"
                className="radius-input"
                placeholder="Miles"
                value={radius}
                onChange={(e) => setRadius(Math.max(1, Math.min(50, parseInt(e.target.value) || 25)))}
                min="1"
                max="50"
              />
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
              We'll show products from merchants within {radius} miles of {zipCode || 'your zip code'}
            </div>
          </ZipCodeForm>
        )}

        <ActionButtons>
          <button 
            className="secondary" 
            onClick={showZipForm ? () => setShowZipForm(false) : handleSkip}
            disabled={loading}
          >
            {showZipForm ? 'Back' : 'Skip for Now'}
          </button>
          
          {showZipForm && (
            <button 
              className="primary" 
              onClick={handleZipCodeSubmit}
              disabled={loading || !zipCode.trim()}
            >
              {loading ? (
                <>Finding Products... <LoadingSpinner /></>
              ) : (
                'Find Local Products'
              )}
            </button>
          )}
        </ActionButtons>

        {locationStatus?.hasZipCode && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--secondary-green)', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dark)' }}>
            💡 Currently showing products near {locationService.getUserZipCode()}
          </div>
        )}
      </Modal>
    </LocationSetupModal>
  );
};

export default LocationSetup;