const EmailConfig = require('../models/email_config.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all email configurations with pagination and filtering
exports.getAllEmailConfigs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.is_default !== undefined) {
      filters.is_default = req.query.is_default === 'true';
    }
    if (req.query.email_type) {
      filters.email_type = req.query.email_type;
    }
    
    // Exclude deleted records
    filters.deleted_at = null;
    
    let emailConfigs;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await EmailConfig.countDocuments(filters);
      emailConfigs = await EmailConfig.find(filters)
        .sort({ is_default: -1, created_at: -1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['is_default', 'DESC'], ['created_at', 'DESC']],
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      };
      
      const result = await EmailConfig.findAndCountAll(queryOptions);
      emailConfigs = result.rows;
      total = result.count;
    }
    
    // Mask sensitive data
    emailConfigs = emailConfigs.map(config => {
      const configObj = dbType === 'mongodb' ? config.toObject() : config.toJSON();
      
      // Mask sensitive fields
      if (configObj.smtp_password) {
        configObj.smtp_password = '********';
      }
      if (configObj.api_secret) {
        configObj.api_secret = '********';
      }
      
      return configObj;
    });
    
    res.status(200).json({
      success: true,
      data: emailConfigs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching email configurations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch email configurations',
      error: error.message 
    });
  }
};

// Get email configuration by ID
exports.getEmailConfigById = async (req, res) => {
  try {
    const id = req.params.id;
    
    let emailConfig;
    
    if (dbType === 'mongodb') {
      emailConfig = await EmailConfig.findOne({ _id: id, deleted_at: null });
    } else {
      emailConfig = await EmailConfig.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    if (!emailConfig) {
      return res.status(404).json({ 
        success: false,
        message: 'Email configuration not found' 
      });
    }
    
    // Mask sensitive data
    const configObj = dbType === 'mongodb' ? emailConfig.toObject() : emailConfig.toJSON();
    
    // Mask sensitive fields
    if (configObj.smtp_password) {
      configObj.smtp_password = '********';
    }
    if (configObj.api_secret) {
      configObj.api_secret = '********';
    }
    
    res.status(200).json({
      success: true,
      data: configObj
    });
  } catch (error) {
    console.error('Error fetching email configuration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch email configuration',
      error: error.message 
    });
  }
};

// Create new email configuration
exports.createEmailConfig = async (req, res) => {
  try {
    const { 
      email_type, smtp_server, smtp_port, smtp_username, smtp_password,
      ssl_tls, smtp_auth, api_key, api_secret, region,
      from_email, from_name, reply_to_email, is_active, is_default, created_by
    } = req.body;
    
    // Validate required fields based on email_type
    if (email_type === 'SMTP') {
      if (!smtp_server || !smtp_port || !smtp_username) {
        return res.status(400).json({ 
          success: false,
          message: 'SMTP server, port, and username are required for SMTP configuration' 
        });
      }
    } else if (email_type === 'API') {
      if (!api_key) {
        return res.status(400).json({ 
          success: false,
          message: 'API key is required for API configuration' 
        });
      }
    }
    
    // Validate sender information
    if (!from_email) {
      return res.status(400).json({ 
        success: false,
        message: 'From email is required' 
      });
    }
    
    // If setting as default, update existing default configurations
    if (is_default) {
      if (dbType === 'mongodb') {
        await EmailConfig.updateMany(
          { is_default: true },
          { $set: { is_default: false } }
        );
      } else {
        await EmailConfig.update(
          { is_default: false },
          { where: { is_default: true } }
        );
      }
    }
    
    // Create new email configuration
    let newEmailConfig;
    
    if (dbType === 'mongodb') {
      newEmailConfig = new EmailConfig({
        email_type, smtp_server, smtp_port, smtp_username, smtp_password,
        ssl_tls, smtp_auth, api_key, api_secret, region,
        from_email, from_name, reply_to_email, is_active, is_default, created_by
      });
      await newEmailConfig.save();
    } else {
      newEmailConfig = await EmailConfig.create({
        email_type, smtp_server, smtp_port, smtp_username, smtp_password,
        ssl_tls, smtp_auth, api_key, api_secret, region,
        from_email, from_name, reply_to_email, is_active, is_default, created_by
      });
      
      // Fetch the configuration with relations
      newEmailConfig = await EmailConfig.findByPk(newEmailConfig.id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    // Mask sensitive data in response
    const configObj = dbType === 'mongodb' ? newEmailConfig.toObject() : newEmailConfig.toJSON();
    
    // Mask sensitive fields
    if (configObj.smtp_password) {
      configObj.smtp_password = '********';
    }
    if (configObj.api_secret) {
      configObj.api_secret = '********';
    }
    
    res.status(201).json({
      success: true,
      message: 'Email configuration created successfully',
      data: configObj
    });
  } catch (error) {
    console.error('Error creating email configuration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create email configuration',
      error: error.message 
    });
  }
};

// Update email configuration
exports.updateEmailConfig = async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      email_type, smtp_server, smtp_port, smtp_username, smtp_password,
      ssl_tls, smtp_auth, api_key, api_secret, region,
      from_email, from_name, reply_to_email, is_active, is_default, updated_by
    } = req.body;
    
    // Find email configuration
    let emailConfig;
    if (dbType === 'mongodb') {
      emailConfig = await EmailConfig.findOne({ _id: id, deleted_at: null });
    } else {
      emailConfig = await EmailConfig.findByPk(id);
    }
    
    if (!emailConfig) {
      return res.status(404).json({ 
        success: false,
        message: 'Email configuration not found' 
      });
    }
    
    // Validate required fields based on email_type
    if (email_type === 'SMTP') {
      if (!smtp_server || !smtp_port || !smtp_username) {
        return res.status(400).json({ 
          success: false,
          message: 'SMTP server, port, and username are required for SMTP configuration' 
        });
      }
    } else if (email_type === 'API') {
      if (!api_key) {
        return res.status(400).json({ 
          success: false,
          message: 'API key is required for API configuration' 
        });
      }
    }
    
    // Validate sender information
    if (!from_email) {
      return res.status(400).json({ 
        success: false,
        message: 'From email is required' 
      });
    }
    
    // If setting as default, update existing default configurations
    if (is_default) {
      if (dbType === 'mongodb') {
        await EmailConfig.updateMany(
          { _id: { $ne: id }, is_default: true },
          { $set: { is_default: false } }
        );
      } else {
        await EmailConfig.update(
          { is_default: false },
          { where: { id: { [EmailConfig.sequelize.Op.ne]: id }, is_default: true } }
        );
      }
    }
    
    // Update email configuration
    if (dbType === 'mongodb') {
      // Create update object with only provided fields
      const updateData = {};
      if (email_type !== undefined) updateData.email_type = email_type;
      if (smtp_server !== undefined) updateData.smtp_server = smtp_server;
      if (smtp_port !== undefined) updateData.smtp_port = smtp_port;
      if (smtp_username !== undefined) updateData.smtp_username = smtp_username;
      if (smtp_password !== undefined) updateData.smtp_password = smtp_password;
      if (ssl_tls !== undefined) updateData.ssl_tls = ssl_tls;
      if (smtp_auth !== undefined) updateData.smtp_auth = smtp_auth;
      if (api_key !== undefined) updateData.api_key = api_key;
      if (api_secret !== undefined) updateData.api_secret = api_secret;
      if (region !== undefined) updateData.region = region;
      if (from_email !== undefined) updateData.from_email = from_email;
      if (from_name !== undefined) updateData.from_name = from_name;
      if (reply_to_email !== undefined) updateData.reply_to_email = reply_to_email;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (is_default !== undefined) updateData.is_default = is_default;
      if (updated_by !== undefined) updateData.updated_by = updated_by;
      
      emailConfig = await EmailConfig.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    } else {
      // Create update object with only provided fields
      const updateData = {};
      if (email_type !== undefined) updateData.email_type = email_type;
      if (smtp_server !== undefined) updateData.smtp_server = smtp_server;
      if (smtp_port !== undefined) updateData.smtp_port = smtp_port;
      if (smtp_username !== undefined) updateData.smtp_username = smtp_username;
      if (smtp_password !== undefined) updateData.smtp_password = smtp_password;
      if (ssl_tls !== undefined) updateData.ssl_tls = ssl_tls;
      if (smtp_auth !== undefined) updateData.smtp_auth = smtp_auth;
      if (api_key !== undefined) updateData.api_key = api_key;
      if (api_secret !== undefined) updateData.api_secret = api_secret;
      if (region !== undefined) updateData.region = region;
      if (from_email !== undefined) updateData.from_email = from_email;
      if (from_name !== undefined) updateData.from_name = from_name;
      if (reply_to_email !== undefined) updateData.reply_to_email = reply_to_email;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (is_default !== undefined) updateData.is_default = is_default;
      if (updated_by !== undefined) updateData.updated_by = updated_by;
      
      await EmailConfig.update(updateData, {
        where: { id }
      });
      
      // Fetch updated record with relations
      emailConfig = await EmailConfig.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    // Mask sensitive data in response
    const configObj = dbType === 'mongodb' ? emailConfig.toObject() : emailConfig.toJSON();
    
    // Mask sensitive fields
    if (configObj.smtp_password) {
      configObj.smtp_password = '********';
    }
    if (configObj.api_secret) {
      configObj.api_secret = '********';
    }
    
    res.status(200).json({
      success: true,
      message: 'Email configuration updated successfully',
      data: configObj
    });
  } catch (error) {
    console.error('Error updating email configuration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update email configuration',
      error: error.message 
    });
  }
};

// Delete email configuration (soft delete)
exports.deleteEmailConfig = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find email configuration
    let emailConfig;
    if (dbType === 'mongodb') {
      emailConfig = await EmailConfig.findOne({ _id: id, deleted_at: null });
    } else {
      emailConfig = await EmailConfig.findByPk(id);
    }
    
    if (!emailConfig) {
      return res.status(404).json({ 
        success: false,
        message: 'Email configuration not found' 
      });
    }
    
    // Check if it's the default configuration
    if (emailConfig.is_default) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the default email configuration'
      });
    }
    
    // Soft delete the email configuration
    if (dbType === 'mongodb') {
      await EmailConfig.findByIdAndUpdate(
        id,
        { $set: { deleted_at: new Date() } }
      );
    } else {
      await emailConfig.destroy();
    }
    
    res.status(200).json({
      success: true,
      message: 'Email configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email configuration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete email configuration',
      error: error.message 
    });
  }
};

// Set email configuration as default
exports.setAsDefault = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find email configuration
    let emailConfig;
    if (dbType === 'mongodb') {
      emailConfig = await EmailConfig.findOne({ _id: id, deleted_at: null });
    } else {
      emailConfig = await EmailConfig.findByPk(id);
    }
    
    if (!emailConfig) {
      return res.status(404).json({ 
        success: false,
        message: 'Email configuration not found' 
      });
    }
    
    // Check if it's already the default
    if (emailConfig.is_default) {
      return res.status(400).json({
        success: false,
        message: 'This configuration is already set as default'
      });
    }
    
    // Update all other configurations to not be default
    if (dbType === 'mongodb') {
      await EmailConfig.updateMany(
        { is_default: true },
        { $set: { is_default: false } }
      );
      
      // Set this configuration as default
      await EmailConfig.findByIdAndUpdate(
        id,
        { $set: { is_default: true } }
      );
      
      // Fetch updated record
      emailConfig = await EmailConfig.findById(id);
    } else {
      // Update all configurations to not be default
      await EmailConfig.update(
        { is_default: false },
        { where: { is_default: true } }
      );
      
      // Set this configuration as default
      await EmailConfig.update(
        { is_default: true },
        { where: { id } }
      );
      
      // Fetch updated record with relations
      emailConfig = await EmailConfig.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    // Mask sensitive data in response
    const configObj = dbType === 'mongodb' ? emailConfig.toObject() : emailConfig.toJSON();
    
    // Mask sensitive fields
    if (configObj.smtp_password) {
      configObj.smtp_password = '********';
    }
    if (configObj.api_secret) {
      configObj.api_secret = '********';
    }
    
    res.status(200).json({
      success: true,
      message: 'Email configuration set as default successfully',
      data: configObj
    });
  } catch (error) {
    console.error('Error setting email configuration as default:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to set email configuration as default',
      error: error.message 
    });
  }
};
