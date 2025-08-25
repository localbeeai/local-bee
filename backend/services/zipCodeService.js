const axios = require('axios');

// Free zip code lookup service using Zippopotam.us API
const lookupZipCode = async (zipCode) => {
  try {
    // Remove any non-digit characters
    const cleanZip = zipCode.replace(/\D/g, '');
    
    if (cleanZip.length !== 5) {
      throw new Error('Invalid zip code format');
    }

    const response = await axios.get(`https://api.zippopotam.us/us/${cleanZip}`);
    
    if (response.status !== 200) {
      throw new Error('Zip code not found');
    }

    const data = response.data;
    
    if (!data.places || data.places.length === 0) {
      throw new Error('No location data found');
    }

    const place = data.places[0];
    
    return {
      zipCode: cleanZip,
      city: place['place name'],
      state: place['state abbreviation'],
      stateName: place['state'],
      latitude: parseFloat(place['latitude']),
      longitude: parseFloat(place['longitude'])
    };
  } catch (error) {
    console.error('Zip code lookup error:', error);
    throw new Error('Could not find location for this zip code');
  }
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

module.exports = {
  lookupZipCode,
  calculateDistance
};