const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');

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
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    let query = { isActive: true, approvalStatus: 'approved' };

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

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('merchant', 'name businessInfo avatar location businessPhoto')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasMore: page < totalPages
      }
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

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMerchantProducts,
  addReview
};