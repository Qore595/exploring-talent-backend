const { verifyToken } = require('../config/jwt.config');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

/**
 * Authentication middleware to verify employee JWT token
 */
exports.authenticateEmployee = async (req, res, next) => {
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
    if (!decoded || decoded.type !== 'employee') {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    // Find employee by ID
    let employee;
    if (dbType === 'mongodb') {
      employee = await Employee.findById(decoded.id).select('-password');
    } else {
      employee = await Employee.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    }

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (!employee.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Employee account is inactive'
      });
    }

    // Add employee to request object
    req.employee = employee;
    next();
  } catch (error) {
    console.error('Employee authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/**
 * Check if employee is a superadmin
 */
exports.isSuperAdmin = (req, res, next) => {
  if (!req.employee) {
    return res.status(401).json({
      success: false,
      message: 'Employee not authenticated'
    });
  }

  if (!req.employee.is_superadmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Superadmin privileges required.'
    });
  }

  next();
};
