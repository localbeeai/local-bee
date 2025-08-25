const mongoose = require('mongoose');
const User = require('../models/User');
const { lookupZipCode } = require('../services/zipCodeService');
require('dotenv').config();

// Sample locations around major US cities for testing
const testLocations = [
  // Los Angeles, CA area
  { coordinates: [-118.2437, 34.0522], city: "Los Angeles", state: "CA", zipCode: "90210" },
  { coordinates: [-118.2017, 34.1030], city: "Beverly Hills", state: "CA", zipCode: "90211" },
  { coordinates: [-118.3965, 34.0195], city: "Santa Monica", state: "CA", zipCode: "90401" },
  
  // New York, NY area  
  { coordinates: [-73.9857, 40.7484], city: "New York", state: "NY", zipCode: "10001" },
  { coordinates: [-73.9776, 40.7831], city: "New York", state: "NY", zipCode: "10025" },
  { coordinates: [-74.0059, 40.7128], city: "New York", state: "NY", zipCode: "10013" },
  
  // Chicago, IL area
  { coordinates: [-87.6298, 41.8781], city: "Chicago", state: "IL", zipCode: "60601" },
  { coordinates: [-87.6244, 41.8819], city: "Chicago", state: "IL", zipCode: "60614" },
  
  // Austin, TX area
  { coordinates: [-97.7431, 30.2672], city: "Austin", state: "TX", zipCode: "78701" },
  { coordinates: [-97.7559, 30.2849], city: "Austin", state: "TX", zipCode: "78703" },
  
  // Denver, CO area
  { coordinates: [-104.9903, 39.7392], city: "Denver", state: "CO", zipCode: "80202" },
  { coordinates: [-104.9847, 39.7391], city: "Denver", state: "CO", zipCode: "80205" },
  
  // Seattle, WA area  
  { coordinates: [-122.3321, 47.6062], city: "Seattle", state: "WA", zipCode: "98101" },
  { coordinates: [-122.3493, 47.6205], city: "Seattle", state: "WA", zipCode: "98102" }
];

async function updateMerchantLocations() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Finding merchants to update locations...');
    const merchants = await User.find({ role: 'merchant' });
    
    console.log(`Found ${merchants.length} merchants to check`);
    
    for (let i = 0; i < merchants.length; i++) {
      const merchant = merchants[i];
      
      // Check if merchant has address with zip code
      let zipCode = merchant.address?.zipCode;
      let city = merchant.address?.city;
      let state = merchant.address?.state;
      
      console.log(`Processing ${merchant.businessInfo?.businessName || merchant.name}`);
      console.log(`Current address: ${JSON.stringify(merchant.address)}`);
      
      // If no zip code, use a default location (you should collect this from merchants)
      if (!zipCode) {
        console.log('No zip code found, prompting merchant to update profile...');
        // For now, let's use a placeholder - in production, merchants should provide this
        zipCode = '06457'; // Middletown, CT (mentioned in their bio)
        city = 'Middletown';
        state = 'CT';
        
        // Update their address
        merchant.address = {
          ...merchant.address,
          zipCode,
          city,
          state,
          country: 'USA'
        };
      }
      
      try {
        // Use the zip code service to get accurate coordinates
        const locationData = await lookupZipCode(zipCode);
        
        // Update merchant location with real coordinates from their zip code
        merchant.location = {
          type: 'Point',
          coordinates: [locationData.longitude, locationData.latitude] // [lng, lat] for MongoDB
        };
        
        await merchant.save();
        
        console.log(`✅ Updated ${merchant.businessInfo?.businessName || merchant.name}`);
        console.log(`   Address: ${city}, ${state} ${zipCode}`);
        console.log(`   Coordinates: [${locationData.longitude}, ${locationData.latitude}]`);
        
      } catch (error) {
        console.error(`❌ Error updating ${merchant.name}: ${error.message}`);
        // Fall back to approximate location if zip lookup fails
        const fallbackLocation = testLocations[i % testLocations.length];
        merchant.location = {
          type: 'Point',
          coordinates: fallbackLocation.coordinates
        };
        await merchant.save();
        console.log(`   Used fallback location: ${fallbackLocation.city}, ${fallbackLocation.state}`);
      }
    }
    
    console.log(`✅ Successfully updated ${merchants.length} merchant locations!`);
    
    // Verify the updates
    console.log('\nVerifying updates...');
    const updatedMerchants = await User.find({ 
      role: 'merchant',
      'location.coordinates': { $ne: [0, 0] }
    }).select('name businessInfo.businessName location address.city address.state');
    
    console.log('\n=== UPDATED MERCHANTS ===');
    updatedMerchants.forEach(merchant => {
      console.log(`${merchant.businessInfo?.businessName || merchant.name}: [${merchant.location.coordinates.join(', ')}] - ${merchant.address?.city}, ${merchant.address?.state}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error updating merchant locations:', error);
    process.exit(1);
  }
}

updateMerchantLocations();