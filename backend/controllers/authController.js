const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const signup = async (req, res) => {
  try {
    console.log('Signup attempt with data:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name, email, password, role, phone, businessName, businessDescription, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const userData = {
      name,
      email,
      password,
      role: role || 'customer'
    };

    if (role === 'merchant') {
      userData.phone = phone;
      userData.businessInfo = {
        businessName,
        businessDescription
      };
    }

    if (address) {
      userData.address = {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode
      };
      
      // Set location coordinates if provided
      if (address.latitude && address.longitude) {
        userData.location = {
          type: 'Point',
          coordinates: [address.longitude, address.latitude] // [lng, lat] format for MongoDB
        };
      }
    }

    console.log('Creating user with data:', userData);
    
    const user = new User(userData);
    await user.save();

    console.log('User created successfully:', user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.getPublicProfile());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, businessInfo } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (businessInfo && user.role === 'merchant') {
      user.businessInfo = { ...user.businessInfo, ...businessInfo };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfile
};