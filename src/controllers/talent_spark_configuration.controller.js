const TalentSparkConfiguration = require('../models/talent_spark_configuration.model');
const Branch = require('../models/branch.model');
const { dbType } = require('../config/database');

// Get all talent spark configurations with pagination and filtering
exports.getAllConfigurations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      branch_id,
      name,
      status,
      is_active,
      is_default,
      search
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    let filters = {};
    let mongoQuery = {};
    
    if (branch_id) {
      if (dbType === 'mongodb') {
        mongoQuery.branch_id = parseInt(branch_id);
      } else {
        filters.branch_id = branch_id;
      }
    }
    
    if (name) {
      if (dbType === 'mongodb') {
        mongoQuery.name = { $regex: name, $options: 'i' };
      } else {
        const { Op } = TalentSparkConfiguration.sequelize;
        filters.name = { [Op.like]: `%${name}%` };
      }
    }
    
    if (status) {
      if (dbType === 'mongodb') {
        mongoQuery.status = status;
      } else {
        filters.status = status;
      }
    }
    
    if (is_active !== undefined) {
      const isActive = is_active === 'true';
      if (dbType === 'mongodb') {
        mongoQuery.is_active = isActive;
      } else {
        filters.is_active = isActive;
      }
    }
    
    if (is_default !== undefined) {
      const isDefault = is_default === 'true';
      if (dbType === 'mongodb') {
        mongoQuery.is_default = isDefault;
      } else {
        filters.is_default = isDefault;
      }
    }
    
    // Add search functionality
    if (search) {
      if (dbType === 'mongodb') {
        mongoQuery.$or = [
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } }
        ];
      } else {
        const { Op } = TalentSparkConfiguration.sequelize;
        filters = {
          ...filters,
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { title: { [Op.like]: `%${search}%` } }
          ]
        };
      }
    }
    
    let configurations;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      total = await TalentSparkConfiguration.countDocuments(mongoQuery);
      configurations = await TalentSparkConfiguration.find(mongoQuery)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(parseInt(limit))
        .populate('branch_id', 'name');
    } else {
      // SQL implementation
      const queryOptions = {
        where: filters,
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            as: 'branch'
          }
        ]
      };
      
      const result = await TalentSparkConfiguration.findAndCountAll(queryOptions);
      configurations = result.rows;
      total = result.count;
    }
    
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: configurations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching talent spark configurations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch talent spark configurations',
      error: error.message
    });
  }
};

// Get configuration by ID
exports.getConfigurationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let configuration;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      configuration = await TalentSparkConfiguration.findById(id)
        .populate('branch_id', 'name');
    } else {
      // SQL implementation
      configuration = await TalentSparkConfiguration.findByPk(id, {
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            as: 'branch'
          }
        ]
      });
    }
    
    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'Talent Spark configuration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: configuration
    });
  } catch (error) {
    console.error('Error fetching talent spark configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch talent spark configuration',
      error: error.message
    });
  }
};

// Get configurations by branch ID
exports.getConfigurationsByBranchId = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { is_active, status } = req.query;
    
    // Build filter conditions
    let filters = { branch_id: branchId };
    let mongoQuery = { branch_id: parseInt(branchId) };
    
    if (is_active !== undefined) {
      const isActive = is_active === 'true';
      if (dbType === 'mongodb') {
        mongoQuery.is_active = isActive;
      } else {
        filters.is_active = isActive;
      }
    }
    
    if (status) {
      if (dbType === 'mongodb') {
        mongoQuery.status = status;
      } else {
        filters.status = status;
      }
    }
    
    let configurations;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      configurations = await TalentSparkConfiguration.find(mongoQuery)
        .sort({ created_at: -1 })
        .populate('branch_id', 'name');
    } else {
      // SQL implementation
      configurations = await TalentSparkConfiguration.findAll({
        where: filters,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            as: 'branch'
          }
        ]
      });
    }
    
    res.status(200).json({
      success: true,
      data: configurations
    });
  } catch (error) {
    console.error('Error fetching configurations by branch ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configurations by branch ID',
      error: error.message
    });
  }
};

// Create new configuration
exports.createConfiguration = async (req, res) => {
  try {
    const {
      branch_id,
      name,
      title,
      overview,
      system_prompt,
      model,
      voice,
      api_key,
      language_hint,
      temperature,
      max_duration,
      time_exceeded_message,
      is_active,
      is_default,
      version,
      status,
      callback_url,
      analytics_enabled,
      additional_settings,
      created_by
    } = req.body;
    
    // Validate required fields
    if (!branch_id) {
      return res.status(400).json({
        success: false,
        message: 'Branch ID is required'
      });
    }
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Configuration name is required'
      });
    }
    
    if (!system_prompt) {
      return res.status(400).json({
        success: false,
        message: 'System prompt is required'
      });
    }
    
    if (!model) {
      return res.status(400).json({
        success: false,
        message: 'Model is required'
      });
    }
    
    if (!voice) {
      return res.status(400).json({
        success: false,
        message: 'Voice is required'
      });
    }
    
    // Check if branch exists
    let branch;
    if (dbType === 'mongodb') {
      branch = await Branch.findById(branch_id);
    } else {
      branch = await Branch.findByPk(branch_id);
    }
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }
    
    // Check if configuration with same name already exists for this branch
    let existingConfig;
    if (dbType === 'mongodb') {
      existingConfig = await TalentSparkConfiguration.findOne({
        branch_id: parseInt(branch_id),
        name
      });
    } else {
      existingConfig = await TalentSparkConfiguration.findOne({
        where: {
          branch_id,
          name
        }
      });
    }
    
    if (existingConfig) {
      return res.status(400).json({
        success: false,
        message: `A configuration with name "${name}" already exists for this branch`
      });
    }
    
    // If is_default is true, update all other configurations for this branch to is_default=false
    if (is_default) {
      if (dbType === 'mongodb') {
        await TalentSparkConfiguration.updateMany(
          { branch_id: parseInt(branch_id), is_default: true },
          { is_default: false }
        );
      } else {
        await TalentSparkConfiguration.update(
          { is_default: false },
          { where: { branch_id, is_default: true } }
        );
      }
    }
    
    let newConfiguration;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      newConfiguration = new TalentSparkConfiguration({
        branch_id: parseInt(branch_id),
        name,
        title,
        overview,
        system_prompt,
        model,
        voice,
        api_key,
        language_hint,
        temperature,
        max_duration,
        time_exceeded_message,
        is_active: is_active !== undefined ? is_active : true,
        is_default: is_default !== undefined ? is_default : false,
        version,
        status: status || 'draft',
        callback_url,
        analytics_enabled: analytics_enabled !== undefined ? analytics_enabled : true,
        additional_settings,
        created_by: created_by ? parseInt(created_by) : null
      });
      
      await newConfiguration.save();
    } else {
      // SQL implementation
      newConfiguration = await TalentSparkConfiguration.create({
        branch_id,
        name,
        title,
        overview,
        system_prompt,
        model,
        voice,
        api_key,
        language_hint,
        temperature,
        max_duration,
        time_exceeded_message,
        is_active: is_active !== undefined ? is_active : true,
        is_default: is_default !== undefined ? is_default : false,
        version,
        status: status || 'draft',
        callback_url,
        analytics_enabled: analytics_enabled !== undefined ? analytics_enabled : true,
        additional_settings,
        created_by
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Talent Spark configuration created successfully',
      data: newConfiguration
    });
  } catch (error) {
    console.error('Error creating talent spark configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create talent spark configuration',
      error: error.message
    });
  }
};

// Update configuration
exports.updateConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;
    
    // Add updated_by if provided
    if (req.body.updated_by) {
      updateData.updated_by = req.body.updated_by;
    }
    
    // If is_default is being set to true, update all other configurations for this branch to is_default=false
    if (updateData.is_default === true) {
      let configuration;
      
      if (dbType === 'mongodb') {
        configuration = await TalentSparkConfiguration.findById(id);
      } else {
        configuration = await TalentSparkConfiguration.findByPk(id);
      }
      
      if (configuration) {
        const branchId = configuration.branch_id;
        
        if (dbType === 'mongodb') {
          await TalentSparkConfiguration.updateMany(
            { branch_id: branchId, is_default: true, _id: { $ne: id } },
            { is_default: false }
          );
        } else {
          await TalentSparkConfiguration.update(
            { is_default: false },
            { where: { branch_id: branchId, is_default: true, id: { [TalentSparkConfiguration.sequelize.Op.ne]: id } } }
          );
        }
      }
    }
    
    let configuration;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      configuration = await TalentSparkConfiguration.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await TalentSparkConfiguration.update(
        updateData,
        { where: { id } }
      );
      
      configuration = await TalentSparkConfiguration.findByPk(id);
    }
    
    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'Talent Spark configuration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Talent Spark configuration updated successfully',
      data: configuration
    });
  } catch (error) {
    console.error('Error updating talent spark configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update talent spark configuration',
      error: error.message
    });
  }
};

// Delete configuration
exports.deleteConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    
    let result;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      result = await TalentSparkConfiguration.findByIdAndDelete(id);
    } else {
      // SQL implementation
      result = await TalentSparkConfiguration.destroy({
        where: { id }
      });
    }
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Talent Spark configuration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Talent Spark configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting talent spark configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete talent spark configuration',
      error: error.message
    });
  }
};

// Update configuration status
exports.updateConfigurationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, updated_by } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['draft', 'testing', 'production', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    const updateData = { 
      status,
      updated_by
    };
    
    let configuration;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      configuration = await TalentSparkConfiguration.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await TalentSparkConfiguration.update(
        updateData,
        { where: { id } }
      );
      
      configuration = await TalentSparkConfiguration.findByPk(id);
    }
    
    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'Talent Spark configuration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Talent Spark configuration status updated to ${status} successfully`,
      data: configuration
    });
  } catch (error) {
    console.error('Error updating talent spark configuration status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update talent spark configuration status',
      error: error.message
    });
  }
};

// Get default configuration for a branch
exports.getDefaultConfigurationForBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    
    let configuration;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      configuration = await TalentSparkConfiguration.findOne({
        branch_id: parseInt(branchId),
        is_default: true,
        is_active: true
      }).populate('branch_id', 'name');
    } else {
      // SQL implementation
      configuration = await TalentSparkConfiguration.findOne({
        where: {
          branch_id: branchId,
          is_default: true,
          is_active: true
        },
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            as: 'branch'
          }
        ]
      });
    }
    
    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'No default configuration found for this branch'
      });
    }
    
    res.status(200).json({
      success: true,
      data: configuration
    });
  } catch (error) {
    console.error('Error fetching default configuration for branch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch default configuration for branch',
      error: error.message
    });
  }
};
