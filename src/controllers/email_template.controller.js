const EmailTemplate = require('../models/email_template.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all email templates with pagination and filtering
exports.getAllEmailTemplates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.email_type) {
      filters.email_type = req.query.email_type;
    }
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { template_code: { $regex: req.query.search, $options: 'i' } },
          { subject: { $regex: req.query.search, $options: 'i' } }
        ];
      } else {
        const { Op } = EmailTemplate.sequelize;
        filters[Op.or] = [
          { name: { [Op.like]: `%${req.query.search}%` } },
          { template_code: { [Op.like]: `%${req.query.search}%` } },
          { subject: { [Op.like]: `%${req.query.search}%` } }
        ];
      }
    }
    
    // Exclude deleted records
    filters.deleted_at = null;
    
    let emailTemplates;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await EmailTemplate.countDocuments(filters);
      emailTemplates = await EmailTemplate.find(filters)
        .sort({ name: 1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['name', 'ASC']],
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
      
      const result = await EmailTemplate.findAndCountAll(queryOptions);
      emailTemplates = result.rows;
      total = result.count;
    }
    
    res.status(200).json({
      success: true,
      data: emailTemplates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch email templates',
      error: error.message 
    });
  }
};

// Get email template by ID
exports.getEmailTemplateById = async (req, res) => {
  try {
    const id = req.params.id;
    
    let emailTemplate;
    
    if (dbType === 'mongodb') {
      emailTemplate = await EmailTemplate.findOne({ _id: id, deleted_at: null });
    } else {
      emailTemplate = await EmailTemplate.findByPk(id, {
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
    
    if (!emailTemplate) {
      return res.status(404).json({ 
        success: false,
        message: 'Email template not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: emailTemplate
    });
  } catch (error) {
    console.error('Error fetching email template:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch email template',
      error: error.message 
    });
  }
};

// Get email template by template code
exports.getEmailTemplateByCode = async (req, res) => {
  try {
    const code = req.params.code;
    
    let emailTemplate;
    
    if (dbType === 'mongodb') {
      emailTemplate = await EmailTemplate.findOne({ 
        template_code: code, 
        deleted_at: null,
        is_active: true
      });
    } else {
      emailTemplate = await EmailTemplate.findOne({
        where: { 
          template_code: code,
          is_active: true
        },
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
    
    if (!emailTemplate) {
      return res.status(404).json({ 
        success: false,
        message: 'Email template not found or not active' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: emailTemplate
    });
  } catch (error) {
    console.error('Error fetching email template by code:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch email template',
      error: error.message 
    });
  }
};

// Create new email template
exports.createEmailTemplate = async (req, res) => {
  try {
    const { 
      template_code, name, subject, body_html, body_text, variables,
      email_type, description, is_active, is_system, from_name,
      from_email, reply_to, cc, bcc, created_by
    } = req.body;
    
    // Validate required fields
    if (!template_code || !name || !subject || !body_html) {
      return res.status(400).json({ 
        success: false,
        message: 'Template code, name, subject, and HTML body are required' 
      });
    }
    
    // Check if template_code already exists
    let existingTemplate;
    if (dbType === 'mongodb') {
      existingTemplate = await EmailTemplate.findOne({ template_code });
    } else {
      existingTemplate = await EmailTemplate.findOne({ where: { template_code } });
    }
    
    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: 'Email template with this template code already exists'
      });
    }
    
    // Create new email template
    let newEmailTemplate;
    
    if (dbType === 'mongodb') {
      newEmailTemplate = new EmailTemplate({
        template_code, name, subject, body_html, body_text, variables,
        email_type, description, is_active, is_system, from_name,
        from_email, reply_to, cc, bcc, created_by
      });
      await newEmailTemplate.save();
    } else {
      newEmailTemplate = await EmailTemplate.create({
        template_code, name, subject, body_html, body_text, variables,
        email_type, description, is_active, is_system, from_name,
        from_email, reply_to, cc, bcc, created_by
      });
      
      // Fetch the template with relations
      newEmailTemplate = await EmailTemplate.findByPk(newEmailTemplate.id, {
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
      message: 'Email template created successfully',
      data: newEmailTemplate
    });
  } catch (error) {
    console.error('Error creating email template:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create email template',
      error: error.message 
    });
  }
};

// Update email template
exports.updateEmailTemplate = async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      template_code, name, subject, body_html, body_text, variables,
      email_type, description, is_active, is_system, from_name,
      from_email, reply_to, cc, bcc, updated_by
    } = req.body;
    
    // Find email template
    let emailTemplate;
    if (dbType === 'mongodb') {
      emailTemplate = await EmailTemplate.findOne({ _id: id, deleted_at: null });
    } else {
      emailTemplate = await EmailTemplate.findByPk(id);
    }
    
    if (!emailTemplate) {
      return res.status(404).json({ 
        success: false,
        message: 'Email template not found' 
      });
    }
    
    // Check if it's a system template and prevent certain changes
    if (emailTemplate.is_system) {
      // Allow updating content but not status or code
      if (template_code && template_code !== emailTemplate.template_code) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change template code of a system template'
        });
      }
      
      if (is_system === false) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change system status of a system template'
        });
      }
    }
    
    // If template_code is being changed, check if new code already exists
    if (template_code && template_code !== emailTemplate.template_code) {
      let existingTemplate;
      if (dbType === 'mongodb') {
        existingTemplate = await EmailTemplate.findOne({ template_code });
      } else {
        existingTemplate = await EmailTemplate.findOne({ where: { template_code } });
      }
      
      if (existingTemplate) {
        return res.status(400).json({
          success: false,
          message: 'Email template with this template code already exists'
        });
      }
    }
    
    // Update email template
    if (dbType === 'mongodb') {
      // Create update object with only provided fields
      const updateData = {};
      if (template_code !== undefined) updateData.template_code = template_code;
      if (name !== undefined) updateData.name = name;
      if (subject !== undefined) updateData.subject = subject;
      if (body_html !== undefined) updateData.body_html = body_html;
      if (body_text !== undefined) updateData.body_text = body_text;
      if (variables !== undefined) updateData.variables = variables;
      if (email_type !== undefined) updateData.email_type = email_type;
      if (description !== undefined) updateData.description = description;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (is_system !== undefined && !emailTemplate.is_system) updateData.is_system = is_system;
      if (from_name !== undefined) updateData.from_name = from_name;
      if (from_email !== undefined) updateData.from_email = from_email;
      if (reply_to !== undefined) updateData.reply_to = reply_to;
      if (cc !== undefined) updateData.cc = cc;
      if (bcc !== undefined) updateData.bcc = bcc;
      if (updated_by !== undefined) updateData.updated_by = updated_by;
      
      emailTemplate = await EmailTemplate.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    } else {
      // Create update object with only provided fields
      const updateData = {};
      if (template_code !== undefined) updateData.template_code = template_code;
      if (name !== undefined) updateData.name = name;
      if (subject !== undefined) updateData.subject = subject;
      if (body_html !== undefined) updateData.body_html = body_html;
      if (body_text !== undefined) updateData.body_text = body_text;
      if (variables !== undefined) updateData.variables = variables;
      if (email_type !== undefined) updateData.email_type = email_type;
      if (description !== undefined) updateData.description = description;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (is_system !== undefined && !emailTemplate.is_system) updateData.is_system = is_system;
      if (from_name !== undefined) updateData.from_name = from_name;
      if (from_email !== undefined) updateData.from_email = from_email;
      if (reply_to !== undefined) updateData.reply_to = reply_to;
      if (cc !== undefined) updateData.cc = cc;
      if (bcc !== undefined) updateData.bcc = bcc;
      if (updated_by !== undefined) updateData.updated_by = updated_by;
      
      await EmailTemplate.update(updateData, {
        where: { id }
      });
      
      // Fetch updated record with relations
      emailTemplate = await EmailTemplate.findByPk(id, {
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
      message: 'Email template updated successfully',
      data: emailTemplate
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update email template',
      error: error.message 
    });
  }
};

// Delete email template (soft delete)
exports.deleteEmailTemplate = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find email template
    let emailTemplate;
    if (dbType === 'mongodb') {
      emailTemplate = await EmailTemplate.findOne({ _id: id, deleted_at: null });
    } else {
      emailTemplate = await EmailTemplate.findByPk(id);
    }
    
    if (!emailTemplate) {
      return res.status(404).json({ 
        success: false,
        message: 'Email template not found' 
      });
    }
    
    // Check if it's a system template
    if (emailTemplate.is_system) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a system template'
      });
    }
    
    // Soft delete the email template
    if (dbType === 'mongodb') {
      await EmailTemplate.findByIdAndUpdate(
        id,
        { $set: { deleted_at: new Date() } }
      );
    } else {
      await emailTemplate.destroy();
    }
    
    res.status(200).json({
      success: true,
      message: 'Email template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email template:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete email template',
      error: error.message 
    });
  }
};
