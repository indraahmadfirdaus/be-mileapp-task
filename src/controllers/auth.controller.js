const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    const user = User.findByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user.id, user.email);

    const userData = User.getUserWithoutPassword(user);

    return successResponse(res, 'Login successful', {
      token,
      user: userData
    }, 200);

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Server error during login', 500);
  }
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return errorResponse(res, 'Please provide all required fields', 400);
    }

    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    const newUser = User.create({ email, password, name });

    const token = generateToken(newUser.id, newUser.email);

    const userData = User.getUserWithoutPassword(newUser);

    return successResponse(res, 'Registration successful', {
      token,
      user: userData
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, 'Server error during registration', 500);
  }
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
exports.getMe = (req, res) => {
  try {
    const user = User.findById(req.user.id);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const userData = User.getUserWithoutPassword(user);
    return successResponse(res, 'User data retrieved', userData, 200);

  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};