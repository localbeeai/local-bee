const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { lookupZipCode, calculateDistance } = require('../services/zipCodeService');

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      subcategory,
      merchant,
      minPrice,
      maxPrice,
      isOrganic,
      isLocallySourced,
      zipCode,
      zipCodes, // Multiple zip codes comma separated
      radius = 25, // Default 25 mile radius
      latitude,
      longitude,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    let query = { isActive: true, approvalStatus: 'approved' };
    let merchantLocationFilter = null;
    let userLocation = null;

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (merchant) {
      query.merchant = merchant;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (isOrganic !== undefined) {
      query.isOrganic = isOrganic === 'true';
    }

    if (isLocallySourced !== undefined) {
      query.isLocallySourced = isLocallySourced === 'true';
    }

    if (req.query.featured !== undefined) {
      query.featured = req.query.featured === 'true';
    }

    // Location-based filtering
    if (zipCode || zipCodes || (latitude && longitude)) {
      try {
        // Handle single zip code
        if (zipCode) {
          const locationData = await lookupZipCode(zipCode);
          userLocation = {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            zipCode: locationData.zipCode,
            city: locationData.city,
            state: locationData.state
          };
        }
        
        // Handle multiple zip codes
        if (zipCodes) {
          const zipCodeArray = zipCodes.split(',').map(zip => zip.trim());
          const locationPromises = zipCodeArray.map(zip => lookupZipCode(zip));
          const locations = await Promise.allSettled(locationPromises);
          
          // Use the first successful location as primary
          const validLocations = locations
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
            
          if (validLocations.length > 0) {
            userLocation = {
              latitude: validLocations[0].latitude,
              longitude: validLocations[0].longitude,
              zipCode: validLocations[0].zipCode,
              city: validLocations[0].city,
              state: validLocations[0].state,
              additionalZipCodes: validLocations.slice(1)
            };
          }
        }
        
        // Handle direct coordinates
        if (latitude && longitude && !userLocation) {
          userLocation = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
          };
        }
        
        // Find merchants within radius
        if (userLocation) {
          console.log('DEBUG: Processing location filter with userLocation:', userLocation);
          const merchants = await User.find({ 
            role: 'merchant',
            'businessInfo.isApproved': true,
            location: { $exists: true }
          });
          console.log('DEBUG: Found', merchants.length, 'merchants with location data');
          
          const nearbyMerchants = merchants.filter(merchant => {
            if (!merchant.location || !merchant.location.coordinates) return false;
            
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              merchant.location.coordinates[1], // MongoDB stores as [lng, lat]
              merchant.location.coordinates[0]
            );
            
            console.log(`DEBUG: Merchant ${merchant.businessInfo?.businessName || merchant.name} is ${distance} miles away (radius: ${radius})`);
            return distance <= parseFloat(radius);
          });
          console.log('DEBUG: Found', nearbyMerchants.length, 'nearby merchants within', radius, 'miles');
          
          if (nearbyMerchants.length > 0) {
            merchantLocationFilter = nearbyMerchants.map(m => m._id);
            query.merchant = { $in: merchantLocationFilter };
          } else {
            // No merchants in range - find closest merchants and show them with message
            console.log(`No merchants within ${radius} miles, finding nearest ones...`);
            
            // Calculate distances to all merchants and sort by distance
            const allMerchantsWithDistance = merchants.map(merchant => {
              if (!merchant.location?.coordinates) return null;
              
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                merchant.location.coordinates[1],
                merchant.location.coordinates[0]
              );
              
              return { merchant, distance };
            }).filter(item => item !== null).sort((a, b) => a.distance - b.distance);
            
            // Get products from the 3 nearest merchants
            const nearestMerchants = allMerchantsWithDistance.slice(0, 3).map(item => item.merchant._id);
            
            if (nearestMerchants.length > 0) {
              query.merchant = { $in: nearestMerchants };
              merchantLocationFilter = nearestMerchants;
              
              // Add special flag to indicate these are fallback results
              userLocation.fallbackResults = true;
              userLocation.nearestDistance = allMerchantsWithDistance[0]?.distance || null;
            } else {
              // Truly no merchants with location data
              return res.json({
                products: [],
                pagination: {
                  currentPage: parseInt(page),
                  totalPages: 0,
                  totalProducts: 0,
                  hasMore: false
                },
                locationInfo: {
                  userLocation,
                  radius: parseFloat(radius),
                  nearbyMerchants: 0,
                  message: `No merchants found. Please check back later as we add more local businesses to your area.`
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('Location filtering error:', error);
        // Continue without location filtering if there's an error
      }
    }

    const skip = (page - 1) * limit;
    
    let sortOptions;
    // Smart sorting based on location
    if (userLocation && merchantLocationFilter) {
      // If we have location data, sort by relevance then distance
      if (sort === '-createdAt' || sort === 'createdAt') {
        sortOptions = [['featured', -1], ['createdAt', -1]];
      } else {
        sortOptions = sort;
      }
    } else {
      sortOptions = sort;
    }

    const products = await Product.find(query)
      .populate({
        path: 'merchant', 
        select: 'name businessInfo avatar location businessPhoto',
        populate: {
          path: 'businessInfo'
        }
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate distances and add to response if we have user location
    let productsWithDistance = products;
    if (userLocation && products.length > 0) {
      productsWithDistance = products.map(product => {
        let distance = null;
        if (product.merchant?.location?.coordinates) {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            product.merchant.location.coordinates[1],
            product.merchant.location.coordinates[0]
          );
        }
        
        return {
          ...product.toObject(),
          distance,
          merchantDistance: distance
        };
      });
      
      // Sort by distance if location-based
      if (userLocation && (sort === 'distance' || !sort || sort === '-createdAt')) {
        productsWithDistance.sort((a, b) => {
          // Prioritize: featured > distance > date
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.distance !== null && b.distance !== null) {
            return a.distance - b.distance;
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }
    }

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Create response with appropriate messaging
    const locationInfo = userLocation ? {
      userLocation,
      radius: parseFloat(radius),
      nearbyMerchants: merchantLocationFilter ? merchantLocationFilter.length : null,
      appliedLocationFilter: !!merchantLocationFilter,
      fallbackResults: userLocation.fallbackResults || false,
      message: userLocation.fallbackResults 
        ? `No merchants found within ${radius} miles of ${userLocation.city || 'your location'}. Showing nearest merchants (${userLocation.nearestDistance} miles away).`
        : merchantLocationFilter && merchantLocationFilter.length > 0
        ? `Found ${merchantLocationFilter.length} merchant${merchantLocationFilter.length === 1 ? '' : 's'} within ${radius} miles.`
        : null
    } : null;

    res.json({
      products: productsWithDistance,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasMore: page < totalPages
      },
      locationInfo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('merchant', 'name businessInfo avatar location phone businessPhoto')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.views += 1;
    await product.save();

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      merchant: req.user.id
    };

    // Clean organicCertificate data if product is not organic or has null values
    if (!productData.isOrganic || 
        (productData.organicCertificate && productData.organicCertificate.status === null)) {
      delete productData.organicCertificate;
    }

    const product = new Product(productData);
    await product.save();

    await product.populate('merchant', 'name businessInfo avatar location businessPhoto');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.merchant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    Object.assign(product, req.body);
    await product.save();

    await product.populate('merchant', 'name businessInfo avatar location businessPhoto');

    res.json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.merchant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMerchantProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;

    let query = { merchant: req.user.id };

    if (status !== 'all') {
      query.isActive = status === 'active';
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const stats = await Product.aggregate([
      { $match: { merchant: req.user._id } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          averageRating: { $avg: '$rating.average' }
        }
      }
    ]);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasMore: page < totalPages
      },
      stats: stats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        totalViews: 0,
        averageRating: 0
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    product.reviews.push({
      user: req.user.id,
      rating,
      comment: comment || ''
    });

    await product.save();

    await product.populate('reviews.user', 'name avatar');

    res.json({
      message: 'Review added successfully',
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get personalized product recommendations
const getRecommendations = async (req, res) => {
  try {
    const {
      zipCode,
      latitude,
      longitude,
      radius = 25,
      limit = 12,
      userId
    } = req.query;

    let userLocation = null;
    
    // Get user location
    if (zipCode) {
      try {
        const locationData = await lookupZipCode(zipCode);
        userLocation = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          zipCode: locationData.zipCode
        };
      } catch (error) {
        console.error('Zip code lookup failed:', error);
      }
    } else if (latitude && longitude) {
      userLocation = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    // Base query for active, approved products
    let baseQuery = { isActive: true, approvalStatus: 'approved' };
    let merchantIds = [];

    // Find nearby merchants if location provided
    if (userLocation) {
      const merchants = await User.find({
        role: 'merchant',
        'businessInfo.isApproved': true,
        location: { $exists: true, $ne: null }
      });

      const nearbyMerchants = merchants.filter(merchant => {
        if (!merchant.location?.coordinates) return false;
        
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          merchant.location.coordinates[1],
          merchant.location.coordinates[0]
        );
        
        return distance <= parseFloat(radius);
      });

      merchantIds = nearbyMerchants.map(m => m._id);
      if (merchantIds.length > 0) {
        baseQuery.merchant = { $in: merchantIds };
      }
    }

    // Algorithm: Mix of featured, popular, recent, and seasonal
    const recommendations = {
      featured: [],
      popular: [],
      recent: [],
      seasonal: []
    };

    // 1. Featured products (25% of results)
    const featuredCount = Math.ceil(limit * 0.25);
    recommendations.featured = await Product.find({
      ...baseQuery,
      featured: true
    })
    .populate('merchant', 'name businessInfo location')
    .sort({ 'rating.average': -1, views: -1 })
    .limit(featuredCount);

    // 2. Popular products by views and ratings (35% of results)
    const popularCount = Math.ceil(limit * 0.35);
    const usedIds = recommendations.featured.map(p => p._id);
    recommendations.popular = await Product.find({
      ...baseQuery,
      _id: { $nin: usedIds },
      'rating.average': { $gte: 4.0 },
      views: { $gte: 10 }
    })
    .populate('merchant', 'name businessInfo location')
    .sort({ views: -1, 'rating.average': -1 })
    .limit(popularCount);

    // 3. Recent products (25% of results)
    const recentCount = Math.ceil(limit * 0.25);
    const moreUsedIds = [...usedIds, ...recommendations.popular.map(p => p._id)];
    recommendations.recent = await Product.find({
      ...baseQuery,
      _id: { $nin: moreUsedIds }
    })
    .populate('merchant', 'name businessInfo location')
    .sort({ createdAt: -1 })
    .limit(recentCount);

    // 4. Seasonal products (remaining results)
    const seasonalCount = limit - recommendations.featured.length - recommendations.popular.length - recommendations.recent.length;
    const allUsedIds = [...moreUsedIds, ...recommendations.recent.map(p => p._id)];
    
    // Seasonal logic based on current month
    const currentMonth = new Date().getMonth() + 1;
    let seasonalCategories = [];
    
    if ([12, 1, 2].includes(currentMonth)) { // Winter
      seasonalCategories = ['prepared-foods', 'bakery', 'beverages'];
    } else if ([3, 4, 5].includes(currentMonth)) { // Spring
      seasonalCategories = ['produce', 'flowers', 'dairy'];
    } else if ([6, 7, 8].includes(currentMonth)) { // Summer
      seasonalCategories = ['produce', 'beverages', 'dairy'];
    } else { // Fall (9, 10, 11)
      seasonalCategories = ['produce', 'prepared-foods', 'bakery'];
    }

    if (seasonalCount > 0) {
      recommendations.seasonal = await Product.find({
        ...baseQuery,
        _id: { $nin: allUsedIds },
        category: { $in: seasonalCategories }
      })
      .populate('merchant', 'name businessInfo location')
      .sort({ createdAt: -1, 'rating.average': -1 })
      .limit(seasonalCount);
    }

    // Combine all recommendations
    let allRecommendations = [
      ...recommendations.featured,
      ...recommendations.popular, 
      ...recommendations.recent,
      ...recommendations.seasonal
    ];

    // Add distance information if location available
    if (userLocation && allRecommendations.length > 0) {
      allRecommendations = allRecommendations.map(product => {
        let distance = null;
        if (product.merchant?.location?.coordinates) {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            product.merchant.location.coordinates[1],
            product.merchant.location.coordinates[0]
          );
        }
        
        return {
          ...product.toObject(),
          distance,
          recommendationType: getRecommendationType(product, recommendations)
        };
      });
    }

    // Shuffle within each category for variety
    const shuffledRecommendations = shuffleArray(allRecommendations).slice(0, limit);

    res.json({
      recommendations: shuffledRecommendations,
      algorithm: {
        location: userLocation ? 'location-based' : 'general',
        radius: userLocation ? parseFloat(radius) : null,
        nearbyMerchants: merchantIds.length,
        breakdown: {
          featured: recommendations.featured.length,
          popular: recommendations.popular.length,
          recent: recommendations.recent.length,
          seasonal: recommendations.seasonal.length
        }
      },
      locationInfo: userLocation
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
};

// Helper function to determine recommendation type
const getRecommendationType = (product, recommendations) => {
  if (recommendations.featured.find(p => p._id.toString() === product._id.toString())) return 'featured';
  if (recommendations.popular.find(p => p._id.toString() === product._id.toString())) return 'popular';
  if (recommendations.recent.find(p => p._id.toString() === product._id.toString())) return 'recent';
  if (recommendations.seasonal.find(p => p._id.toString() === product._id.toString())) return 'seasonal';
  return 'general';
};

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
  addReview,
  getRecommendations
};