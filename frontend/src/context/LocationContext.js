import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import locationService from '../services/locationService';
import api from '../config/api';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(25);
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyMerchants, setNearbyMerchants] = useState([]);

  // Initialize location on app start
  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = useCallback(() => {
    const existingZip = locationService.getUserZipCode();
    const existingLocation = locationService.getUserLocation();
    
    if (existingLocation) {
      setUserLocation(existingLocation);
    } else if (existingZip) {
      // Try to get full location data from zip code
      locationService.setUserZipCode(existingZip)
        .then(locationData => {
          if (locationData) {
            setUserLocation(locationData);
          }
        })
        .catch(error => {
          console.error('Failed to initialize location:', error);
        });
    }
  }, []);

  // Prompt for location setup
  const promptLocationSetup = useCallback(() => {
    setShowLocationSetup(true);
  }, []);

  // Handle location setup completion
  const handleLocationSet = useCallback(async (locationData) => {
    if (!locationData) {
      // User skipped location setup
      setShowLocationSetup(false);
      return;
    }

    setLocationLoading(true);
    
    try {
      // Store location data
      setUserLocation(locationData);
      setRadius(locationData.radius || 25);
      
      // Persist to localStorage via locationService
      if (locationData.zipCode) {
        await locationService.setUserZipCode(locationData.zipCode);
      }
      
      // Fetch nearby merchants for this location
      await updateNearbyMerchants(locationData);
      
      setShowLocationSetup(false);
    } catch (error) {
      console.error('Error setting location:', error);
    } finally {
      setLocationLoading(false);
    }
  }, []);

  // Update nearby merchants based on location
  const updateNearbyMerchants = useCallback(async (location = userLocation) => {
    if (!location) return;

    try {
      const params = {
        zipCode: location.zipCode,
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radius,
        limit: 0 // Get count only
      };

      const response = await api.get('/api/products', { params });
      
      if (response.data.locationInfo) {
        setNearbyMerchants(response.data.locationInfo.nearbyMerchants || 0);
      }
    } catch (error) {
      console.error('Error fetching nearby merchants:', error);
    }
  }, [userLocation, radius]);

  // Clear location and prompt for new setup
  const clearLocation = useCallback(() => {
    locationService.clearLocationData();
    setUserLocation(null);
    setNearbyMerchants([]);
    setShowLocationSetup(true);
  }, []);

  // Update radius and refresh nearby merchants
  const updateRadius = useCallback(async (newRadius) => {
    setRadius(newRadius);
    if (userLocation) {
      const updatedLocation = { ...userLocation, radius: newRadius };
      setUserLocation(updatedLocation);
      await updateNearbyMerchants(updatedLocation);
    }
  }, [userLocation, updateNearbyMerchants]);

  // Get location-based product filter params
  const getLocationParams = useCallback(() => {
    if (!userLocation) return {};
    
    return {
      zipCode: userLocation.zipCode,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius: radius
    };
  }, [userLocation, radius]);

  // Check if location is set
  const hasLocation = useCallback(() => {
    return !!(userLocation?.zipCode || (userLocation?.latitude && userLocation?.longitude));
  }, [userLocation]);

  // Get formatted location string
  const getLocationString = useCallback(() => {
    if (!userLocation) return 'Location not set';
    
    if (userLocation.city && userLocation.state) {
      return `${userLocation.city}, ${userLocation.state} ${userLocation.zipCode}`;
    } else if (userLocation.zipCode) {
      return userLocation.zipCode;
    } else {
      return 'Custom location';
    }
  }, [userLocation]);

  const value = {
    // State
    userLocation,
    radius,
    showLocationSetup,
    locationLoading,
    nearbyMerchants,
    
    // Actions
    promptLocationSetup,
    handleLocationSet,
    clearLocation,
    updateRadius,
    
    // Helpers
    getLocationParams,
    hasLocation,
    getLocationString,
    
    // Internal
    setShowLocationSetup
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};