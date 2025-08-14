const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

async function createTestData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/localmarket');
    console.log('Connected to MongoDB');
    
    // Create a test merchant (pending approval)
    const existingMerchant = await User.findOne({ email: 'testmerchant@test.com' });
    let merchant;
    
    if (!existingMerchant) {
      merchant = new User({
        name: 'Test Merchant',
        email: 'testmerchant@test.com',
        password: 'password123',
        phone: '555-123-4567',
        role: 'merchant',
        businessInfo: {
          businessName: 'Fresh Farm Produce',
          businessDescription: 'Local organic farm providing fresh vegetables and fruits',
          businessAddress: '123 Farm Road, Farmville, ST 12345',
          businessPhone: '555-123-4567',
          isApproved: false // This will need admin approval
        }
      });
      await merchant.save();
      console.log('Created test merchant (pending approval)');
    } else {
      merchant = existingMerchant;
      console.log('Test merchant already exists');
    }
    
    // Create a test customer
    const existingCustomer = await User.findOne({ email: 'testcustomer@test.com' });
    if (!existingCustomer) {
      const customer = new User({
        name: 'Test Customer',
        email: 'testcustomer@test.com',
        password: 'password123',
        phone: '555-987-6543',
        role: 'customer'
      });
      await customer.save();
      console.log('Created test customer');
    } else {
      console.log('Test customer already exists');
    }
    
    // Create a test product with organic certificate (pending)
    const existingProduct = await Product.findOne({ name: 'Organic Tomatoes' });
    if (!existingProduct && merchant) {
      const product = new Product({
        name: 'Organic Tomatoes',
        description: 'Fresh organic tomatoes grown without pesticides',
        price: 4.99,
        category: 'produce',
        subcategory: 'vegetables',
        merchant: merchant._id,
        inventory: {
          quantity: 50,
          unit: 'pound'
        },
        isOrganic: true,
        organicCertificate: {
          url: 'https://example.com/certificate.pdf',
          filename: 'organic_cert.pdf',
          originalName: 'Organic Certificate.pdf',
          status: 'pending' // This will need admin approval
        },
        fulfillment: {
          method: 'both',
          pickupInstructions: 'Available at the farm stand every Saturday 9am-5pm',
          deliveryOptions: {
            localDelivery: true,
            deliveryRadius: 10,
            deliveryFee: 5,
            freeDeliveryMinimum: 25,
            estimatedTime: 'same-day'
          }
        }
      });
      await product.save();
      console.log('Created test product with pending organic certificate');
    } else {
      console.log('Test product already exists or merchant not found');
    }
    
    console.log('\n=== Test Data Created Successfully ===');
    console.log('Admin credentials: admin@localmarket.com / admin123');
    console.log('Test merchant: testmerchant@test.com / password123 (pending approval)');
    console.log('Test customer: testcustomer@test.com / password123');
    console.log('\nTest admin panel by:');
    console.log('1. Login as admin');
    console.log('2. Go to /dashboard/admin');
    console.log('3. Check pending merchant approvals');
    console.log('4. Check pending organic certificate reviews');
    console.log('5. Test activating/deactivating users and products');
    
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestData();