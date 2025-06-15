const PermissionGroup = require('../models/permission_group.model');
const { dbType } = require('../config/database');
const { Employee } = require('../models');

// Get all permission groups with pagination and filtering
exports.getAllPermissionGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.is_system !== undefined) {
      filters.is_system = req.query.is_system === 'true';
    }
    
    // Search by name or short_code
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { short_code: { $regex: req.query.search, $options: 'i' } }
        ];
      } else {
        // For SQL databases, we'll handle this in the query options
      }
    }
    
    let permissionGroups;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await PermissionGroup.countDocuments(filters);
      permissionGroups = await PermissionGroup.find(filters)
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
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      };
      
      // Add search functionality for SQL databases
      if (req.query.search) {
        const { Op } = PermissionGroup.sequelize;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { name: { [Op.like]: `%${req.query.search}%` } },
            { short_code: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }
      
      const result = await PermissionGroup.findAndCountAll(queryOptions);
      permissionGroups = result.rows;
      total = result.count;
    }
    
    res.status(200).json({
      success: true,
      data: permissionGroups,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching permission groups:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch permission groups',
      error: error.message 
    });
  }
};

// Get permission group by ID
exports.getPermissionGroupById = async (req, res) => {
  try {
    const id = req.params.id;
    let permissionGroup;
    
    if (dbType === 'mongodb') {
      permissionGroup = await PermissionGroup.findById(id);
    } else {
      permissionGroup = await PermissionGroup.findByPk(parseInt(id), {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      });
    }
    
    if (!permissionGroup) {
      return res.status(404).json({ 
        success: false,
        message: 'Permission group not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: permissionGroup
    });
  } catch (error) {
    console.error('Error fetching permission group by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch permission group',
      error: error.message 
    });
  }
};

// Create new permission group
exports.createPermissionGroup = async (req, res) => {
  try {
    const { 
      name, short_code, description, is_system, 
      is_active, created_by
    } = req.body;
    
    // Validate required fields
    if (!name || !short_code) {
      return res.status(400).json({ 
        success: false,
        message: 'Permission group name and short_code are required' 
      });
    }
    
    // Check if short_code already exists
    let existingGroup;
    if (dbType === 'mongodb') {
      existingGroup = await PermissionGroup.findOne({ short_code });
    } else {
      existingGroup = await PermissionGroup.findOne({ where: { short_code } });
    }
    
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: 'Permission group with this short_code already exists'
      });
    }
    
    let newPermissionGroup;
    
    if (dbType === 'mongodb') {
      newPermissionGroup = new PermissionGroup({
        name, short_code, description, is_system, 
        is_active, created_by
      });
      await newPermissionGroup.save();
    } else {
      newPermissionGroup = await PermissionGroup.create({
        name, short_code, description, is_system, 
        is_active, created_by
      });
      
      // Fetch the permission group with relations
      newPermissionGroup = await PermissionGroup.findByPk(newPermissionGroup.id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Permission group created successfully',
      data: newPermissionGroup
    });
  } catch (error) {
    console.error('Error creating permission group:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create permission group',
      error: error.message 
    });
  }
};

// Update permission group
exports.updatePermissionGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;
    
    // Add updated_by if provided
    if (req.body.updated_by) {
      updateData.updated_by = req.body.updated_by;
    }
    
    let permissionGroup;
    let updatedPermissionGroup;
    
    if (dbType === 'mongodb') {
      permissionGroup = await PermissionGroup.findById(id);
      
      if (!permissionGroup) {
        return res.status(404).json({ 
          success: false,
          message: 'Permission group not found' 
        });
      }
      
      // Check if it's a system group and prevent modification
      if (permissionGroup.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System permission groups cannot be modified'
        });
      }
      
      // Check if short_code is being updated and if it already exists
      if (updateData.short_code && updateData.short_code !== permissionGroup.short_code) {
        const existingGroup = await PermissionGroup.findOne({ 
          short_code: updateData.short_code,
          _id: { $ne: id }
        });
        
        if (existingGroup) {
          return res.status(400).json({
            success: false,
            message: 'Permission group with this short_code already exists'
          });
        }
      }
      
      updatedPermissionGroup = await PermissionGroup.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );
    } else {
      permissionGroup = await PermissionGroup.findByPk(parseInt(id));
      
      if (!permissionGroup) {
        return res.status(404).json({ 
          success: false,
          message: 'Permission group not found' 
        });
      }
      
      // Check if it's a system group and prevent modification
      if (permissionGroup.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System permission groups cannot be modified'
        });
      }
      
      // Check if short_code is being updated and if it already exists
      if (updateData.short_code && updateData.short_code !== permissionGroup.short_code) {
        const existingGroup = await PermissionGroup.findOne({ 
          where: { 
            short_code: updateData.short_code,
            id: { [PermissionGroup.sequelize.Op.ne]: parseInt(id) }
          }
        });
        
        if (existingGroup) {
          return res.status(400).json({
            success: false,
            message: 'Permission group with this short_code already exists'
          });
        }
      }
      
      await permissionGroup.update(updateData);
      updatedPermissionGroup = await PermissionGroup.findByPk(parseInt(id), {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Permission group updated successfully',
      data: updatedPermissionGroup
    });
  } catch (error) {
    console.error('Error updating permission group:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update permission group',
      error: error.message 
    });
  }
};

// Delete permission group (soft delete)
exports.deletePermissionGroup = async (req, res) => {
  try {
    const id = req.params.id;
    let permissionGroup;
    
    if (dbType === 'mongodb') {
      permissionGroup = await PermissionGroup.findById(id);
      
      if (!permissionGroup) {
        return res.status(404).json({ 
          success: false,
          message: 'Permission group not found' 
        });
      }
      
      // Check if it's a system group and prevent deletion
      if (permissionGroup.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System permission groups cannot be deleted'
        });
      }
      
      // Soft delete by setting deleted_at
      await PermissionGroup.findByIdAndUpdate(id, { 
        deleted_at: new Date(),
        is_active: false
      });
    } else {
      permissionGroup = await PermissionGroup.findByPk(parseInt(id));
      
      if (!permissionGroup) {
        return res.status(404).json({ 
          success: false,
          message: 'Permission group not found' 
        });
      }
      
      // Check if it's a system group and prevent deletion
      if (permissionGroup.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System permission groups cannot be deleted'
        });
      }
      
      // Soft delete by setting deleted_at
      await permissionGroup.update({ 
        deleted_at: new Date(),
        is_active: false
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Permission group deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting permission group:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete permission group',
      error: error.message 
    });
  }
};
