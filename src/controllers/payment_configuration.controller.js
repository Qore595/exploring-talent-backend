const PaymentConfiguration = require('../models/payment_configuration.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all payment configurations with pagination and filtering
exports.getAllPaymentConfigurations = async (req, res) => {
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
    if (req.query.supports_recurring !== undefined) {
      filters.supports_recurring = req.query.supports_recurring === 'true';
    }
    if (req.query.supports_refunds !== undefined) {
      filters.supports_refunds = req.query.supports_refunds === 'true';
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
        const { Op } = PaymentConfiguration.sequelize;
        filters[Op.or] = [
          { gateway_name: { [Op.like]: `%${searchTerm}%` } },
          { gateway_code: { [Op.like]: `%${searchTerm}%` } }
        ];
      }
    }
    
    let paymentConfigurations;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await PaymentConfiguration.countDocuments(filters);
      paymentConfigurations = await PaymentConfiguration.find(filters)
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
      
      const result = await PaymentConfiguration.findAndCountAll(queryOptions);
      paymentConfigurations = result.rows;
      total = result.count;
    }
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: paymentConfigurations,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching payment configurations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment configurations',
      error: error.message
    });
  }
};

// Get payment configuration by ID
exports.getPaymentConfigurationById = async (req, res) => {
  try {
    const id = req.params.id;
    let paymentConfiguration;
    
    if (dbType === 'mongodb') {
      paymentConfiguration = await PaymentConfiguration.findById(id);
    } else {
      paymentConfiguration = await PaymentConfiguration.findByPk(id, {
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
    
    if (!paymentConfiguration) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment configuration not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: paymentConfiguration
    });
  } catch (error) {
    console.error('Error fetching payment configuration by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch payment configuration',
      error: error.message 
    });
  }
};

// Create new payment configuration
exports.createPaymentConfiguration = async (req, res) => {
  try {
    const { 
      gateway_name, gateway_code, live_values, test_values, mode,
      is_active, priority, gateway_image, supports_recurring, supports_refunds,
      webhook_url, webhook_secret, created_by
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
      existingConfig = await PaymentConfiguration.findOne({ gateway_code });
    } else {
      existingConfig = await PaymentConfiguration.findOne({ where: { gateway_code } });
    }
    
    if (existingConfig) {
      return res.status(400).json({
        success: false,
        message: 'Payment configuration with this gateway code already exists'
      });
    }
    
    // Create new payment configuration
    let newPaymentConfiguration;
    
    if (dbType === 'mongodb') {
      newPaymentConfiguration = new PaymentConfiguration({
        gateway_name, gateway_code, live_values, test_values, mode,
        is_active, priority, gateway_image, supports_recurring, supports_refunds,
        webhook_url, webhook_secret, created_by
      });
      await newPaymentConfiguration.save();
    } else {
      newPaymentConfiguration = await PaymentConfiguration.create({
        gateway_name, gateway_code, live_values, test_values, mode,
        is_active, priority, gateway_image, supports_recurring, supports_refunds,
        webhook_url, webhook_secret, created_by
      });
      
      // Fetch the configuration with relations
      newPaymentConfiguration = await PaymentConfiguration.findByPk(newPaymentConfiguration.id, {
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
      message: 'Payment configuration created successfully',
      data: newPaymentConfiguration
    });
  } catch (error) {
    console.error('Error creating payment configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment configuration',
      error: error.message
    });
  }
};

// Update payment configuration
exports.updatePaymentConfiguration = async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      gateway_name, gateway_code, live_values, test_values, mode,
      is_active, priority, gateway_image, supports_recurring, supports_refunds,
      webhook_url, webhook_secret, updated_by
    } = req.body;
    
    // Find payment configuration
    let paymentConfiguration;
    if (dbType === 'mongodb') {
      paymentConfiguration = await PaymentConfiguration.findById(id);
    } else {
      paymentConfiguration = await PaymentConfiguration.findByPk(id);
    }
    
    if (!paymentConfiguration) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment configuration not found' 
      });
    }
    
    // Check if gateway_code is being changed and if it already exists
    if (gateway_code && gateway_code !== paymentConfiguration.gateway_code) {
      let existingConfig;
      if (dbType === 'mongodb') {
        existingConfig = await PaymentConfiguration.findOne({ 
          gateway_code,
          _id: { $ne: id }
        });
      } else {
        const { Op } = PaymentConfiguration.sequelize;
        existingConfig = await PaymentConfiguration.findOne({ 
          where: { 
            gateway_code,
            id: { [Op.ne]: id }
          }
        });
      }
      
      if (existingConfig) {
        return res.status(400).json({
          success: false,
          message: 'Payment configuration with this gateway code already exists'
        });
      }
    }
    
    // Update payment configuration
    if (dbType === 'mongodb') {
      paymentConfiguration = await PaymentConfiguration.findByIdAndUpdate(
        id,
        { 
          $set: { 
            gateway_name, gateway_code, live_values, test_values, mode,
            is_active, priority, gateway_image, supports_recurring, supports_refunds,
            webhook_url, webhook_secret, updated_by
          } 
        },
        { new: true }
      );
    } else {
      await PaymentConfiguration.update({ 
        gateway_name, gateway_code, live_values, test_values, mode,
        is_active, priority, gateway_image, supports_recurring, supports_refunds,
        webhook_url, webhook_secret, updated_by
      }, {
        where: { id }
      });
      
      // Fetch updated payment configuration
      paymentConfiguration = await PaymentConfiguration.findByPk(id, {
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
      message: 'Payment configuration updated successfully',
      data: paymentConfiguration
    });
  } catch (error) {
    console.error('Error updating payment configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment configuration',
      error: error.message
    });
  }
};

// Delete payment configuration (soft delete)
exports.deletePaymentConfiguration = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find payment configuration
    let paymentConfiguration;
    if (dbType === 'mongodb') {
      paymentConfiguration = await PaymentConfiguration.findById(id);
    } else {
      paymentConfiguration = await PaymentConfiguration.findByPk(id);
    }
    
    if (!paymentConfiguration) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment configuration not found' 
      });
    }
    
    // Soft delete
    if (dbType === 'mongodb') {
      await PaymentConfiguration.findByIdAndUpdate(id, {
        $set: { deleted_at: new Date() }
      });
    } else {
      await paymentConfiguration.destroy(); // Sequelize soft delete (uses paranoid)
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment configuration',
      error: error.message
    });
  }
};
