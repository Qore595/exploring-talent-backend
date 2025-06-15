const SmsConfiguration = require('../models/sms_configuration.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all SMS configurations with pagination and filtering
exports.getAllSmsConfigurations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.gateway_code) {
      filters.gateway_code = req.query.gateway_code;
    }
    if (req.query.mode) {
      filters.mode = req.query.mode;
    }
    
    // Search functionality
    if (req.query.search) {
      const searchTerm = req.query.search;
      if (dbType === 'mongodb') {
        filters.$or = [
          { gateway_name: { $regex: searchTerm, $options: 'i' } },
          { gateway_code: { $regex: searchTerm, $options: 'i' } }
        ];
      } else {
        const { Op } = SmsConfiguration.sequelize;
        filters[Op.or] = [
          { gateway_name: { [Op.like]: `%${searchTerm}%` } },
          { gateway_code: { [Op.like]: `%${searchTerm}%` } }
        ];
      }
    }
    
    let smsConfigurations;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await SmsConfiguration.countDocuments(filters);
      smsConfigurations = await SmsConfiguration.find(filters)
        .sort({ priority: 1, gateway_name: 1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['priority', 'ASC'], ['gateway_name', 'ASC']],
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
      
      const result = await SmsConfiguration.findAndCountAll(queryOptions);
      smsConfigurations = result.rows;
      total = result.count;
    }
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: smsConfigurations,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching SMS configurations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS configurations',
      error: error.message
    });
  }
};

// Get SMS configuration by ID
exports.getSmsConfigurationById = async (req, res) => {
  try {
    const id = req.params.id;
    let smsConfiguration;
    
    if (dbType === 'mongodb') {
      smsConfiguration = await SmsConfiguration.findById(id);
    } else {
      smsConfiguration = await SmsConfiguration.findByPk(id, {
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
    
    if (!smsConfiguration) {
      return res.status(404).json({ 
        success: false,
        message: 'SMS configuration not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: smsConfiguration
    });
  } catch (error) {
    console.error('Error fetching SMS configuration by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch SMS configuration',
      error: error.message 
    });
  }
};

// Create new SMS configuration
exports.createSmsConfiguration = async (req, res) => {
  try {
    const { 
      gateway_name, gateway_code, live_values, test_values, mode,
      is_active, priority, gateway_image, retry_attempts, retry_interval,
      created_by
    } = req.body;
    
    // Validate required fields
    if (!gateway_name || !gateway_code) {
      return res.status(400).json({ 
        success: false,
        message: 'Gateway name and code are required' 
      });
    }
    
    // Check if gateway_code already exists
    let existingConfig;
    if (dbType === 'mongodb') {
      existingConfig = await SmsConfiguration.findOne({ gateway_code });
    } else {
      existingConfig = await SmsConfiguration.findOne({ where: { gateway_code } });
    }
    
    if (existingConfig) {
      return res.status(400).json({
        success: false,
        message: 'SMS configuration with this gateway code already exists'
      });
    }
    
    // Create new SMS configuration
    let newSmsConfiguration;
    
    if (dbType === 'mongodb') {
      newSmsConfiguration = new SmsConfiguration({
        gateway_name, gateway_code, live_values, test_values, mode,
        is_active, priority, gateway_image, retry_attempts, retry_interval,
        created_by
      });
      await newSmsConfiguration.save();
    } else {
      newSmsConfiguration = await SmsConfiguration.create({
        gateway_name, gateway_code, live_values, test_values, mode,
        is_active, priority, gateway_image, retry_attempts, retry_interval,
        created_by
      });
      
      // Fetch the configuration with relations
      newSmsConfiguration = await SmsConfiguration.findByPk(newSmsConfiguration.id, {
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
    
    res.status(201).json({
      success: true,
      message: 'SMS configuration created successfully',
      data: newSmsConfiguration
    });
  } catch (error) {
    console.error('Error creating SMS configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create SMS configuration',
      error: error.message
    });
  }
};

// Update SMS configuration
exports.updateSmsConfiguration = async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      gateway_name, gateway_code, live_values, test_values, mode,
      is_active, priority, gateway_image, retry_attempts, retry_interval,
      updated_by
    } = req.body;
    
    // Find SMS configuration
    let smsConfiguration;
    if (dbType === 'mongodb') {
      smsConfiguration = await SmsConfiguration.findById(id);
    } else {
      smsConfiguration = await SmsConfiguration.findByPk(id);
    }
    
    if (!smsConfiguration) {
      return res.status(404).json({ 
        success: false,
        message: 'SMS configuration not found' 
      });
    }
    
    // Check if gateway_code is being changed and if it already exists
    if (gateway_code && gateway_code !== smsConfiguration.gateway_code) {
      let existingConfig;
      if (dbType === 'mongodb') {
        existingConfig = await SmsConfiguration.findOne({ 
          gateway_code,
          _id: { $ne: id }
        });
      } else {
        const { Op } = SmsConfiguration.sequelize;
        existingConfig = await SmsConfiguration.findOne({ 
          where: { 
            gateway_code,
            id: { [Op.ne]: id }
          }
        });
      }
      
      if (existingConfig) {
        return res.status(400).json({
          success: false,
          message: 'SMS configuration with this gateway code already exists'
        });
      }
    }
    
    // Update SMS configuration
    if (dbType === 'mongodb') {
      smsConfiguration = await SmsConfiguration.findByIdAndUpdate(
        id,
        { 
          $set: { 
            gateway_name, gateway_code, live_values, test_values, mode,
            is_active, priority, gateway_image, retry_attempts, retry_interval,
            updated_by
          } 
        },
        { new: true }
      );
    } else {
      await SmsConfiguration.update({ 
        gateway_name, gateway_code, live_values, test_values, mode,
        is_active, priority, gateway_image, retry_attempts, retry_interval,
        updated_by
      }, {
        where: { id }
      });
      
      // Fetch updated SMS configuration
      smsConfiguration = await SmsConfiguration.findByPk(id, {
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
    
    res.status(200).json({
      success: true,
      message: 'SMS configuration updated successfully',
      data: smsConfiguration
    });
  } catch (error) {
    console.error('Error updating SMS configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SMS configuration',
      error: error.message
    });
  }
};

// Delete SMS configuration (soft delete)
exports.deleteSmsConfiguration = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find SMS configuration
    let smsConfiguration;
    if (dbType === 'mongodb') {
      smsConfiguration = await SmsConfiguration.findById(id);
    } else {
      smsConfiguration = await SmsConfiguration.findByPk(id);
    }
    
    if (!smsConfiguration) {
      return res.status(404).json({ 
        success: false,
        message: 'SMS configuration not found' 
      });
    }
    
    // Soft delete
    if (dbType === 'mongodb') {
      await SmsConfiguration.findByIdAndUpdate(id, {
        $set: { deleted_at: new Date() }
      });
    } else {
      await smsConfiguration.destroy(); // Sequelize soft delete (uses paranoid)
    }
    
    res.status(200).json({
      success: true,
      message: 'SMS configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting SMS configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete SMS configuration',
      error: error.message
    });
  }
};
