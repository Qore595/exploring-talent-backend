const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const Branch = require('../models/branch.model');
const { dbType } = require('../config/database');
const { generateToken, generateRefreshToken } = require('../config/jwt.config');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Get all users with pagination and filtering
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.user_type) {
      filters.user_type = req.query.user_type;
    }
    if (req.query.employee_id) {
      filters.employee_id = parseInt(req.query.employee_id);
    }

    // Search functionality
    if (req.query.search) {
      const searchTerm = req.query.search;
      if (dbType === 'mongodb') {
        filters.$or = [
          { username: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { first_name: { $regex: searchTerm, $options: 'i' } },
          { last_name: { $regex: searchTerm, $options: 'i' } }
        ];
      } else {
        const { Op } = User.sequelize;
        filters[Op.or] = [
          { username: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } },
          { first_name: { [Op.like]: `%${searchTerm}%` } },
          { last_name: { [Op.like]: `%${searchTerm}%` } }
        ];
      }
    }

    let users;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await User.countDocuments(filters);
      users = await User.find(filters)
        .select('-password -password_reset_token -password_reset_expires -remember_token -two_factor_secret')
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['created_at', 'DESC']],
        attributes: {
          exclude: [
            'password',
            'password_reset_token',
            'password_reset_expires',
            'remember_token',
            'two_factor_secret'
          ]
        },
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Branch,
            as: 'DefaultBranch',
            attributes: ['id', 'name'],
            required: false
          }
        ]
      };

      const result = await User.findAndCountAll(queryOptions);
      users = result.rows;
      total = result.count;
    }

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    let user;

    if (dbType === 'mongodb') {
      user = await User.findById(id)
        .select('-password -password_reset_token -password_reset_expires -remember_token -two_factor_secret');
    } else {
      user = await User.findByPk(parseInt(id), {
        attributes: {
          exclude: [
            'password',
            'password_reset_token',
            'password_reset_expires',
            'remember_token',
            'two_factor_secret'
          ]
        },
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Branch,
            as: 'DefaultBranch',
            attributes: ['id', 'name'],
            required: false
          }
        ]
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const {
      employee_id, username, email, password, first_name, last_name,
      phone, profile_image, auth_type, user_type, default_branch_id,
      language, timezone, is_active, is_system, created_by
    } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user with same email or username already exists
    let existingUser;
    if (dbType === 'mongodb') {
      const query = { $or: [{ email }] };
      if (username) query.$or.push({ username });

      existingUser = await User.findOne(query);
    } else {
      const { Op } = User.sequelize;
      const query = {
        where: {
          [Op.or]: [{ email }]
        }
      };

      if (username) query.where[Op.or].push({ username });

      existingUser = await User.findOne(query);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    let newUser;

    if (dbType === 'mongodb') {
      newUser = new User({
        employee_id, username, email, password, first_name, last_name,
        phone, profile_image, auth_type, user_type, default_branch_id,
        language, timezone, is_active, is_system, created_by
      });
      await newUser.save();

      // Remove sensitive data
      newUser = newUser.toObject();
      delete newUser.password;
      delete newUser.password_reset_token;
      delete newUser.password_reset_expires;
      delete newUser.remember_token;
      delete newUser.two_factor_secret;
    } else {
      newUser = await User.create({
        employee_id, username, email, password, first_name, last_name,
        phone, profile_image, auth_type, user_type, default_branch_id,
        language, timezone, is_active, is_system, created_by
      });

      // Fetch the user with relations but without sensitive data
      newUser = await User.findByPk(newUser.id, {
        attributes: {
          exclude: [
            'password',
            'password_reset_token',
            'password_reset_expires',
            'remember_token',
            'two_factor_secret'
          ]
        },
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Branch,
            as: 'DefaultBranch',
            attributes: ['id', 'name'],
            required: false
          }
        ]
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      employee_id, username, email, password, first_name, last_name,
      phone, profile_image, auth_type, user_type, default_branch_id,
      language, timezone, is_active, is_system, updated_by
    } = req.body;

    // Find user
    let user;
    if (dbType === 'mongodb') {
      user = await User.findById(id);
    } else {
      user = await User.findByPk(parseInt(id));
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email or username is being changed and if it already exists
    if ((email && email !== user.email) || (username && username !== user.username)) {
      let existingUser;
      if (dbType === 'mongodb') {
        const query = { _id: { $ne: id } };
        const conditions = [];

        if (email && email !== user.email) {
          conditions.push({ email });
        }

        if (username && username !== user.username) {
          conditions.push({ username });
        }

        if (conditions.length > 0) {
          query.$or = conditions;
          existingUser = await User.findOne(query);
        }
      } else {
        const { Op } = User.sequelize;
        const query = {
          where: {
            id: { [Op.ne]: parseInt(id) }
          }
        };

        const conditions = [];
        if (email && email !== user.email) {
          conditions.push({ email });
        }

        if (username && username !== user.username) {
          conditions.push({ username });
        }

        if (conditions.length > 0) {
          query.where[Op.or] = conditions;
          existingUser = await User.findOne(query);
        }
      }

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email or username already in use by another user'
        });
      }
    }

    // Update user
    if (dbType === 'mongodb') {
      const updateData = {
        employee_id, username, email, first_name, last_name,
        phone, profile_image, auth_type, user_type, default_branch_id,
        language, timezone, is_active, is_system, updated_by
      };

      // Only update password if provided
      if (password) {
        updateData.password = password;
      }

      // Remove undefined fields
      Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
      );

      user = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select('-password -password_reset_token -password_reset_expires -remember_token -two_factor_secret');
    } else {
      const updateData = {
        employee_id, username, email, first_name, last_name,
        phone, profile_image, auth_type, user_type, default_branch_id,
        language, timezone, is_active, is_system, updated_by
      };

      // Only update password if provided
      if (password) {
        updateData.password = password;
      }

      // Remove undefined fields
      Object.keys(updateData).forEach(key =>
        updateData[key] === undefined && delete updateData[key]
      );

      await User.update(updateData, {
        where: { id: parseInt(id) }
      });

      // Fetch updated user
      user = await User.findByPk(parseInt(id), {
        attributes: {
          exclude: [
            'password',
            'password_reset_token',
            'password_reset_expires',
            'remember_token',
            'two_factor_secret'
          ]
        },
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Branch,
            as: 'DefaultBranch',
            attributes: ['id', 'name'],
            required: false
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Find user
    let user;
    if (dbType === 'mongodb') {
      user = await User.findById(id);
    } else {
      user = await User.findByPk(parseInt(id));
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if it's a system user
    if (user.is_system) {
      return res.status(403).json({
        success: false,
        message: 'System users cannot be deleted'
      });
    }

    // Soft delete
    if (dbType === 'mongodb') {
      await User.findByIdAndUpdate(id, {
        $set: { deleted_at: new Date() }
      });
    } else {
      await user.destroy(); // Sequelize soft delete (uses paranoid)
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// User signup
exports.signup = async (req, res) => {
  try {
    const {
      username, email, password, first_name, last_name, phone
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user with same email or username already exists
    let existingUser;
    if (dbType === 'mongodb') {
      const query = { $or: [{ email }] };
      if (username) query.$or.push({ username });

      existingUser = await User.findOne(query);
    } else {
      const { Op } = User.sequelize;
      const query = {
        where: {
          [Op.or]: [{ email }]
        }
      };

      if (username) query.where[Op.or].push({ username });

      existingUser = await User.findOne(query);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    let newUser;

    if (dbType === 'mongodb') {
      newUser = new User({
        username,
        email,
        password,
        first_name,
        last_name,
        phone,
        auth_type: ['password'],
        user_type: 'customer', // Default for signup
        email_verification_token: emailVerificationToken,
        email_verification_sent_at: new Date()
      });
      await newUser.save();

      // Generate tokens
      const token = generateToken({ id: newUser._id });
      const refreshToken = generateRefreshToken({ id: newUser._id });

      // Remove sensitive data
      newUser = newUser.toObject();
      delete newUser.password;
      delete newUser.password_reset_token;
      delete newUser.password_reset_expires;
      delete newUser.remember_token;
      delete newUser.two_factor_secret;

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser,
          token,
          refreshToken
        }
      });
    } else {
      newUser = await User.create({
        username,
        email,
        password,
        first_name,
        last_name,
        phone,
        auth_type: 'password',
        user_type: 'customer', // Default for signup
        email_verification_token: emailVerificationToken,
        email_verification_sent_at: new Date()
      });

      // Generate tokens
      const token = generateToken({ id: newUser.id });
      const refreshToken = generateRefreshToken({ id: newUser.id });

      // Fetch the user without sensitive data
      newUser = await User.findByPk(newUser.id, {
        attributes: {
          exclude: [
            'password',
            'password_reset_token',
            'password_reset_expires',
            'remember_token',
            'two_factor_secret'
          ]
        }
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser,
          token,
          refreshToken
        }
      });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    let user;
    if (dbType === 'mongodb') {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.login_locked_until && new Date(user.login_locked_until) > new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Please contact support.'
      });
    }

    // Check if password auth is enabled for this user
    const authTypes = dbType === 'mongodb' ? user.auth_type : user.auth_type.split(',');
    if (!authTypes.includes('password')) {
      return res.status(400).json({
        success: false,
        message: 'Password authentication is not enabled for this account'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      const loginAttempts = (user.login_attempts || 0) + 1;
      const updateData = { login_attempts: loginAttempts };

      // Lock account after 5 failed attempts
      if (loginAttempts >= 5) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 30); // Lock for 30 minutes
        updateData.login_locked_until = lockUntil;
      }

      // Update user
      if (dbType === 'mongodb') {
        await User.findByIdAndUpdate(user._id, { $set: updateData });
      } else {
        await User.update(updateData, { where: { id: user.id } });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts and update last login
    if (dbType === 'mongodb') {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          login_attempts: 0,
          login_locked_until: null,
          last_login: new Date()
        }
      });

      // Generate tokens
      const token = generateToken({ id: user._id });
      const refreshToken = generateRefreshToken({ id: user._id });

      // Remove sensitive data
      user = user.toObject();
      delete user.password;
      delete user.password_reset_token;
      delete user.password_reset_expires;
      delete user.remember_token;
      delete user.two_factor_secret;

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
          refreshToken
        }
      });
    } else {
      await User.update({
        login_attempts: 0,
        login_locked_until: null,
        last_login: new Date()
      }, { where: { id: user.id } });

      // Generate tokens
      const token = generateToken({ id: user.id });
      const refreshToken = generateRefreshToken({ id: user.id });

      // Fetch user without sensitive data
      const userData = await User.findByPk(user.id, {
        attributes: {
          exclude: [
            'password',
            'password_reset_token',
            'password_reset_expires',
            'remember_token',
            'two_factor_secret'
          ]
        },
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Branch,
            as: 'DefaultBranch',
            attributes: ['id', 'name'],
            required: false
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userData,
          token,
          refreshToken
        }
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    // Find user
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

    // Generate new tokens
    const newToken = generateToken({ id: dbType === 'mongodb' ? user._id : user.id });
    const newRefreshToken = generateRefreshToken({ id: dbType === 'mongodb' ? user._id : user.id });

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    // User is already attached to request by auth middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      username, first_name, last_name, phone,
      profile_image, language, timezone
    } = req.body;

    // Check if username is being changed and if it already exists
    if (username && username !== req.user.username) {
      let existingUser;
      if (dbType === 'mongodb') {
        existingUser = await User.findOne({
          username,
          _id: { $ne: userId }
        });
      } else {
        const { Op } = User.sequelize;
        existingUser = await User.findOne({
          where: {
            username,
            id: { [Op.ne]: userId }
          }
        });
      }

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already in use by another user'
        });
      }
    }

    // Update user
    let updatedUser;
    if (dbType === 'mongodb') {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            username, first_name, last_name, phone,
            profile_image, language, timezone
          }
        },
        { new: true }
      ).select('-password -password_reset_token -password_reset_expires -remember_token -two_factor_secret');
    } else {
      await User.update({
        username, first_name, last_name, phone,
        profile_image, language, timezone
      }, {
        where: { id: userId }
      });

      // Fetch updated user
      updatedUser = await User.findByPk(userId, {
        attributes: {
          exclude: [
            'password',
            'password_reset_token',
            'password_reset_expires',
            'remember_token',
            'two_factor_secret'
          ]
        },
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Branch,
            as: 'DefaultBranch',
            attributes: ['id', 'name'],
            required: false
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Find user with password
    let user;
    if (dbType === 'mongodb') {
      user = await User.findById(userId);
    } else {
      user = await User.findByPk(userId);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(current_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    if (dbType === 'mongodb') {
      user.password = new_password;
      await user.save();
    } else {
      await User.update({
        password: new_password,
        must_change_password: false
      }, {
        where: { id: userId },
        individualHooks: true // Ensure password hashing hook runs
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    let user;
    if (dbType === 'mongodb') {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token valid for 1 hour

    // Update user with reset token
    if (dbType === 'mongodb') {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          password_reset_token: resetToken,
          password_reset_expires: resetExpires
        }
      });
    } else {
      await User.update({
        password_reset_token: resetToken,
        password_reset_expires: resetExpires
      }, {
        where: { id: user.id }
      });
    }

    // In a real application, send an email with the reset link
    // For now, just return the token in the response
    res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
      // In production, remove the following line and send email instead
      debug_token: resetToken
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: error.message
    });
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Find user by reset token
    let user;
    if (dbType === 'mongodb') {
      user = await User.findOne({
        password_reset_token: token,
        password_reset_expires: { $gt: new Date() }
      });
    } else {
      const { Op } = User.sequelize;
      user = await User.findOne({
        where: {
          password_reset_token: token,
          password_reset_expires: { [Op.gt]: new Date() }
        }
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    // Update password and clear reset token
    if (dbType === 'mongodb') {
      user.password = new_password;
      user.password_reset_token = undefined;
      user.password_reset_expires = undefined;
      user.login_attempts = 0;
      user.login_locked_until = null;
      await user.save();
    } else {
      await User.update({
        password: new_password,
        password_reset_token: null,
        password_reset_expires: null,
        login_attempts: 0,
        login_locked_until: null,
        must_change_password: false
      }, {
        where: { id: user.id },
        individualHooks: true // Ensure password hashing hook runs
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
};