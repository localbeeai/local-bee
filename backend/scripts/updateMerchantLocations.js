const mongoose = require('mongoose');
const User = require('../models/User');
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
    
    console.log('Finding merchants with invalid locations...');
    const merchants = await User.find({ 
      role: 'merchant',
      $or: [
        { 'location.coordinates': [0, 0] },
        { 'location.coordinates': { $exists: false } },
        { location: { $exists: false } }
      ]
    });
    
    console.log(`Found ${merchants.length} merchants to update`);
    
    for (let i = 0; i < merchants.length; i++) {
      const merchant = merchants[i];
      const locationData = testLocations[i % testLocations.length]; // Cycle through locations
      
      // Update merchant location
      merchant.location = {
        type: 'Point',
        coordinates: locationData.coordinates
      };
      
      // Update address if it doesn't exist or is incomplete
      if (!merchant.address || !merchant.address.city) {
        merchant.address = {
          ...merchant.address,
          city: locationData.city,
          state: locationData.state,
          zipCode: locationData.zipCode,
          country: 'USA'
        };
      }
      
      await merchant.save();
      
      console.log(`Updated ${merchant.name} (${merchant.businessInfo?.businessName}) -> ${locationData.city}, ${locationData.state}`);
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