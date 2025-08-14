const mongoose = require('mongoose');
const Product = require('./models/Product');

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/localmarket');
    console.log('Connected to MongoDB');
    
    // Delete all products
    const productResult = await Product.deleteMany({});
    console.log(`Deleted ${productResult.deletedCount} products`);
    
    console.log('Cleanup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();