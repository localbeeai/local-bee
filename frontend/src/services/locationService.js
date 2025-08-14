class LocationService {
  constructor() {
    this.currentLocation = null;
    this.userZipCode = localStorage.getItem('userZipCode') || null;
    this.locationPermission = localStorage.getItem('locationPermission') || null;
  }

  // Request user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          localStorage.setItem('locationPermission', 'granted');
          this.locationPermission = 'granted';
          resolve(this.currentLocation);
        },
        (error) => {
          localStorage.setItem('locationPermission', 'denied');
          this.locationPermission = 'denied';
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Convert coordinates to zip code using a reverse geocoding service
  async coordinatesToZipCode(latitude, longitude) {
    try {
      // For development, we'll use a simple approximation
      // In production, you'd want to use a proper geocoding service like:
      // - Google Geocoding API
      // - Mapbox Geocoding API
      // - OpenCage Geocoding API
      
      // Mock implementation for development
      const mockZipCodes = [
        { lat: 40.7589, lng: -73.9851, zip: '10018' }, // NYC
        { lat: 34.0522, lng: -118.2437, zip: '90210' }, // LA
        { lat: 41.8781, lng: -87.6298, zip: '60601' }, // Chicago
        { lat: 29.7604, lng: -95.3698, zip: '77001' }, // Houston
        { lat: 39.7392, lng: -104.9903, zip: '80202' }, // Denver
      ];

      // Find closest zip code (simple distance calculation)
      let closestZip = '00000';
      let minDistance = Infinity;
      
      mockZipCodes.forEach(location => {
        const distance = Math.sqrt(
          Math.pow(latitude - location.lat, 2) + 
          Math.pow(longitude - location.lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestZip = location.zip;
        }
      });

      return closestZip;
    } catch (error) {
      console.error('Error converting coordinates to zip code:', error);
      return null;
    }
  }

  // Validate zip code format
  isValidZipCode(zipCode) {
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    return zipCodeRegex.test(zipCode);
  }

  // Set user's zip code
  setUserZipCode(zipCode) {
    if (this.isValidZipCode(zipCode)) {
      this.userZipCode = zipCode;
      localStorage.setItem('userZipCode', zipCode);
      return true;
    }
    return false;
  }

  // Get user's zip code
  getUserZipCode() {
    return this.userZipCode;
  }

  // Get location permission status
  getLocationPermission() {
    return this.locationPermission;
  }

  // Clear location data
  clearLocationData() {
    this.currentLocation = null;
    this.userZipCode = null;
    this.locationPermission = null;
    localStorage.removeItem('userZipCode');
    localStorage.removeItem('locationPermission');
  }

  // Calculate distance between two zip codes (mock implementation)
  calculateDistance(zipCode1, zipCode2) {
    // In a real implementation, you'd use a proper distance calculation
    // or a service that provides zip code coordinates
    const randomDistance = Math.random() * 50 + 1; // 1-50 miles
    return Math.round(randomDistance * 10) / 10;
  }

  // Get nearby zip codes within a radius (mock implementation)
  getNearbyZipCodes(centerZip, radiusMiles = 25) {
    // Mock nearby zip codes - in production, use a proper service
    const mockNearbyZips = [
      centerZip,
      String(parseInt(centerZip) + 1).padStart(5, '0'),
      String(parseInt(centerZip) + 2).padStart(5, '0'),
      String(parseInt(centerZip) - 1).padStart(5, '0'),
      String(parseInt(centerZip) - 2).padStart(5, '0'),
    ].filter(zip => this.isValidZipCode(zip));

    return mockNearbyZips;
  }

  // Request location with user-friendly prompts
  async requestLocationWithPrompt() {
    try {
      const location = await this.getCurrentLocation();
      const zipCode = await this.coordinatesToZipCode(location.latitude, location.longitude);
      
      if (zipCode) {
        this.setUserZipCode(zipCode);
      }
      
      return { location, zipCode };
    } catch (error) {
      throw error;
    }
  }
}

export default new LocationService();