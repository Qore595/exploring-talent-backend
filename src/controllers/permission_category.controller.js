const PermissionCategory = require('../models/permission_category.model');
const PermissionGroup = require('../models/permission_group.model');
const { dbType } = require('../config/database');

// Get all permission categories with pagination and filtering
exports.getAllPermissionCategories = async (req, res) => {
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
    if (req.query.perm_group_id) {
      filters.perm_group_id = parseInt(req.query.perm_group_id);
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
    
    let permissionCategories;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await PermissionCategory.countDocuments(filters);
      permissionCategories = await PermissionCategory.find(filters)
        .sort({ display_order: 1, name: 1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [
          ['display_order', 'ASC'],
          ['name', 'ASC']
        ],
        include: [
          {
            model: PermissionGroup,
            as: 'PermissionGroup',
            attributes: ['id', 'name', 'short_code'],
            required: false
          }
        ]
      };
      
      // Add search functionality for SQL databases
      if (req.query.search) {
        const { Op } = PermissionCategory.sequelize;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { name: { [Op.like]: `%${req.query.search}%` } },
            { short_code: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }
      
      const result = await PermissionCategory.findAndCountAll(queryOptions);
      permissionCategories = result.rows;
      total = result.count;
    }
    
    res.status(200).json({
      success: true,
      data: permissionCategories,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching permission categories:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch permission categories',
      error: error.message 
    });
  }
};

// Get permission category by ID
exports.getPermissionCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    let permissionCategory;
    
    if (dbType === 'mongodb') {
      permissionCategory = await PermissionCategory.findById(id);
    } else {
      permissionCategory = await PermissionCategory.findByPk(parseInt(id), {
        include: [
          {
            model: PermissionGroup,
            as: 'PermissionGroup',
            attributes: ['id', 'name', 'short_code'],
            required: false
          }
        ]
      });
    }
    
    if (!permissionCategory) {
      return res.status(404).json({ 
        success: false,
        message: 'Permission category not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: permissionCategory
    });
  } catch (error) {
    console.error('Error fetching permission category by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch permission category',
      error: error.message 
    });
  }
};

// Create new permission category
exports.createPermissionCategory = async (req, res) => {
  try {
    const { 
      perm_group_id, name, short_code, description, 
      enable_view, enable_add, enable_edit, enable_delete,
      is_system, is_active, display_order
    } = req.body;
    
    // Validate required fields
    if (!name || !short_code || !perm_group_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Permission category name, short_code, and perm_group_id are required' 
      });
    }
    
    // Check if permission group exists
    let permissionGroup;
    if (dbType === 'mongodb') {
      permissionGroup = await PermissionGroup.findById(perm_group_id);
    } else {
      permissionGroup = await PermissionGroup.findByPk(parseInt(perm_group_id));
    }
    
    if (!permissionGroup) {
      return res.status(400).json({
        success: false,
        message: 'Permission group not found'
      });
    }
    
    // Check if short_code already exists
    let existingCategory;
    if (dbType === 'mongodb') {
      existingCategory = await PermissionCategory.findOne({ short_code });
    } else {
      existingCategory = await PermissionCategory.findOne({ where: { short_code } });
    }
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Permission category with this short_code already exists'
      });
    }
    
    let newPermissionCategory;
    
    if (dbType === 'mongodb') {
      newPermissionCategory = new PermissionCategory({
        perm_group_id, name, short_code, description, 
        enable_view, enable_add, enable_edit, enable_delete,
        is_system, is_active, display_order
      });
      await newPermissionCategory.save();
    } else {
      newPermissionCategory = await PermissionCategory.create({
        perm_group_id, name, short_code, description, 
        enable_view, enable_add, enable_edit, enable_delete,
        is_system, is_active, display_order
      });
      
      // Fetch the permission category with relations
      newPermissionCategory = await PermissionCategory.findByPk(newPermissionCategory.id, {
        include: [
          {
            model: PermissionGroup,
            as: 'PermissionGroup',
            attributes: ['id', 'name', 'short_code'],
            required: false
          }
        ]
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Permission category created successfully',
      data: newPermissionCategory
    });
  } catch (error) {
    console.error('Error creating permission category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create permission category',
      error: error.message 
    });
  }
};

// Update permission category
exports.updatePermissionCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    
    let permissionCategory;
    let updatedPermissionCategory;
    
    if (dbType === 'mongodb') {
      permissionCategory = await PermissionCategory.findById(id);
      
      if (!permissionCategory) {
        return res.status(404).json({ 
          success: false,
          message: 'Permission category not found' 
        });
      }
      
      // Check if it's a system category and prevent modification
      if (permissionCategory.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System permission categories cannot be modified'
        });
      }
      
      // Check if short_code is being updated and if it already exists
      if (updateData.short_code && updateData.short_code !== permissionCategory.short_code) {
        const existingCategory = await PermissionCategory.findOne({ 
          short_code: updateData.short_code,
          _id: { $ne: id }
        });
        
        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: 'Permission category with this short_code already exists'
          });
        }
      }
      
      // Check if permission group exists if it's being updated
      if (updateData.perm_group_id) {
        const permissionGroup = await PermissionGroup.findById(updateData.perm_group_id);
        if (!permissionGroup) {
          return res.status(400).json({
            success: false,
            message: 'Permission group not found'
          });
        }
      }
      
      updatedPermissionCategory = await PermissionCategory.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );
    } else {
      permissionCategory = await PermissionCategory.findByPk(parseInt(id));
      
      if (!permissionCategory) {
        return res.status(404).json({ 
          success: false,
          message: 'Permission category not found' 
        });
      }
      
      // Check if it's a system category and prevent modification
      if (permissionCategory.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System permission categories cannot be modified'
        });
      }
      
      // Check if short_code is being updated and if it already exists
      if (updateData.short_code && updateData.short_code !== permissionCategory.short_code) {
        const existingCategory = await PermissionCategory.findOne({ 
          where: { 
            short_code: updateData.short_code,
            id: { [PermissionCategory.sequelize.Op.ne]: parseInt(id) }
          }
        });
        
        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: 'Permission category with this short_code already exists'
          });
        }
      }
      
      // Check if permission group exists if it's being updated
      if (updateData.perm_group_id) {
        const permissionGroup = await PermissionGroup.findByPk(parseInt(updateData.perm_group_id));
        if (!permissionGroup) {
          return res.status(400).json({
            success: false,
            message: 'Permission group not found'
          });
        }
      }
      
      await permissionCategory.update(updateData);
      updatedPermissionCategory = await PermissionCategory.findByPk(parseInt(id), {
        include: [
          {
            model: PermissionGroup,
            as: 'PermissionGroup',
            attributes: ['id', 'name', 'short_code'],
            required: false
          }
        ]
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Permission category updated successfully',
      data: updatedPermissionCategory
    });
  } catch (error) {
    console.error('Error updating permission category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update permission category',
      error: error.message 
    });
  }
};

// Delete permission category
exports.deletePermissionCategory = async (req, res) => {
  try {
    const id = req.params.id;
    let permissionCategory;
    
    if (dbType === 'mongodb') {
      permissionCategory = await PermissionCategory.findById(id);
      
      if (!permissionCategory) {
        return res.status(404).json({ 
          success: false,
          message: 'Permission category not found' 
        });
      }
      
      // Check if it's a system category and prevent deletion
      if (permissionCategory.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System permission categories cannot be deleted'
        });
      }
      
      await PermissionCategory.findByIdAndDelete(id);
    } else {
      permissionCategory = await PermissionCategory.findByPk(parseInt(id));
      
      if (!permissionCategory) {
        return res.status(404).json({ 
          success: false,
          message: 'Permission category not found' 
        });
      }
      
      // Check if it's a system category and prevent deletion
      if (permissionCategory.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System permission categories cannot be deleted'
        });
      }
      
      await permissionCategory.destroy();
    }
    
    res.status(200).json({
      success: true,
      message: 'Permission category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting permission category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete permission category',
      error: error.message 
    });
  }
};
