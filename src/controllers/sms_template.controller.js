const SmsTemplate = require('../models/sms_template.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all SMS templates with pagination and filtering
exports.getAllSmsTemplates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.template_code) {
      filters.template_code = req.query.template_code;
    }
    
    // Search functionality
    if (req.query.search) {
      const searchTerm = req.query.search;
      if (dbType === 'mongodb') {
        filters.$or = [
          { template_name: { $regex: searchTerm, $options: 'i' } },
          { template_code: { $regex: searchTerm, $options: 'i' } },
          { content: { $regex: searchTerm, $options: 'i' } }
        ];
      } else {
        const { Op } = SmsTemplate.sequelize;
        filters[Op.or] = [
          { template_name: { [Op.like]: `%${searchTerm}%` } },
          { template_code: { [Op.like]: `%${searchTerm}%` } },
          { content: { [Op.like]: `%${searchTerm}%` } }
        ];
      }
    }
    
    let smsTemplates;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await SmsTemplate.countDocuments(filters);
      smsTemplates = await SmsTemplate.find(filters)
        .sort({ template_name: 1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['template_name', 'ASC']],
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
      
      const result = await SmsTemplate.findAndCountAll(queryOptions);
      smsTemplates = result.rows;
      total = result.count;
    }
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: smsTemplates,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching SMS templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS templates',
      error: error.message
    });
  }
};

// Get SMS template by ID
exports.getSmsTemplateById = async (req, res) => {
  try {
    const id = req.params.id;
    let smsTemplate;
    
    if (dbType === 'mongodb') {
      smsTemplate = await SmsTemplate.findById(id);
    } else {
      smsTemplate = await SmsTemplate.findByPk(id, {
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
    
    if (!smsTemplate) {
      return res.status(404).json({ 
        success: false,
        message: 'SMS template not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: smsTemplate
    });
  } catch (error) {
    console.error('Error fetching SMS template by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch SMS template',
      error: error.message 
    });
  }
};

// Create new SMS template
exports.createSmsTemplate = async (req, res) => {
  try {
    const { 
      template_name, template_code, content, variables,
      category, is_active, created_by
    } = req.body;
    
    // Validate required fields
    if (!template_name || !template_code || !content) {
      return res.status(400).json({ 
        success: false,
        message: 'Template name, code, and content are required' 
      });
    }
    
    // Check if template_code already exists
    let existingTemplate;
    if (dbType === 'mongodb') {
      existingTemplate = await SmsTemplate.findOne({ template_code });
    } else {
      existingTemplate = await SmsTemplate.findOne({ where: { template_code } });
    }
    
    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'SMS template with this template code already exists'
      });
    }
    
    // Create new SMS template
    let newSmsTemplate;
    
    if (dbType === 'mongodb') {
      newSmsTemplate = new SmsTemplate({
        template_name, template_code, content, variables,
        category, is_active, created_by,
        character_count: content.length // Calculate character count for MongoDB
      });
      await newSmsTemplate.save();
    } else {
      newSmsTemplate = await SmsTemplate.create({
        template_name, template_code, content, variables,
        category, is_active, created_by
        // character_count is calculated automatically as a virtual field in Sequelize
      });
      
      // Fetch the template with relations
      newSmsTemplate = await SmsTemplate.findByPk(newSmsTemplate.id, {
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
      message: 'SMS template created successfully',
      data: newSmsTemplate
    });
  } catch (error) {
    console.error('Error creating SMS template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create SMS template',
      error: error.message
    });
  }
};

// Update SMS template
exports.updateSmsTemplate = async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      template_name, template_code, content, variables,
      category, is_active, updated_by
    } = req.body;
    
    // Find SMS template
    let smsTemplate;
    if (dbType === 'mongodb') {
      smsTemplate = await SmsTemplate.findById(id);
    } else {
      smsTemplate = await SmsTemplate.findByPk(id);
    }
    
    if (!smsTemplate) {
      return res.status(404).json({ 
        success: false,
        message: 'SMS template not found' 
      });
    }
    
    // Check if template_code is being changed and if it already exists
    if (template_code && template_code !== smsTemplate.template_code) {
      let existingTemplate;
      if (dbType === 'mongodb') {
        existingTemplate = await SmsTemplate.findOne({ 
          template_code,
          _id: { $ne: id }
        });
      } else {
        const { Op } = SmsTemplate.sequelize;
        existingTemplate = await SmsTemplate.findOne({ 
          where: { 
            template_code,
            id: { [Op.ne]: id }
          }
        });
      }
      
      if (existingTemplate) {
        return res.status(400).json({
          success: false,
          message: 'SMS template with this template code already exists'
        });
      }
    }
    
    // Update SMS template
    if (dbType === 'mongodb') {
      const updateData = { 
        template_name, template_code, content, variables,
        category, is_active, updated_by
      };
      
      // Calculate character count if content is provided
      if (content) {
        updateData.character_count = content.length;
      }
      
      smsTemplate = await SmsTemplate.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    } else {
      await SmsTemplate.update({ 
        template_name, template_code, content, variables,
        category, is_active, updated_by
        // character_count is calculated automatically as a virtual field in Sequelize
      }, {
        where: { id }
      });
      
      // Fetch updated SMS template
      smsTemplate = await SmsTemplate.findByPk(id, {
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
      message: 'SMS template updated successfully',
      data: smsTemplate
    });
  } catch (error) {
    console.error('Error updating SMS template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SMS template',
      error: error.message
    });
  }
};

// Delete SMS template (soft delete)
exports.deleteSmsTemplate = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find SMS template
    let smsTemplate;
    if (dbType === 'mongodb') {
      smsTemplate = await SmsTemplate.findById(id);
    } else {
      smsTemplate = await SmsTemplate.findByPk(id);
    }
    
    if (!smsTemplate) {
      return res.status(404).json({ 
        success: false,
        message: 'SMS template not found' 
      });
    }
    
    // Soft delete
    if (dbType === 'mongodb') {
      await SmsTemplate.findByIdAndUpdate(id, {
        $set: { deleted_at: new Date() }
      });
    } else {
      await smsTemplate.destroy(); // Sequelize soft delete (uses paranoid)
    }
    
    res.status(200).json({
      success: true,
      message: 'SMS template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting SMS template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete SMS template',
      error: error.message
    });
  }
};
