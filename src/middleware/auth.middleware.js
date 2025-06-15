const { verifyToken } = require('../config/jwt.config');
const User = require('../models/user.model');
const { dbType } = require('../config/database');

/**
 * Authentication middleware to verify JWT token
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    // Find user by ID
    let user;
    if (dbType === 'mongodb') {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/**
 * Authorization middleware to check user type
 * @param {Array} allowedTypes - Array of allowed user types
 */
exports.authorize = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!allowedTypes.includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

/**
 * Check if user is admin
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

/**
 * Check if user is staff or admin
 */
exports.isStaffOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.user_type !== 'admin' && req.user.user_type !== 'staff') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Staff or admin privileges required.'
    });
  }

  next();
};
