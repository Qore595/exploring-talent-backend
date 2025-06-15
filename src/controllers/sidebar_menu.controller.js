const SidebarMenu = require('../models/sidebar_menu.model');
const PermissionGroup = require('../models/permission_group.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all sidebar menus with pagination and filtering
exports.getAllSidebarMenus = async (req, res) => {
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
    if (req.query.sidebar_display !== undefined) {
      filters.sidebar_display = req.query.sidebar_display === 'true';
    }
    if (req.query.permission_group_id) {
      filters.permission_group_id = parseInt(req.query.permission_group_id);
    }
    if (req.query.level) {
      filters.level = parseInt(req.query.level);
    }
    if (req.query.system_level) {
      filters.system_level = parseInt(req.query.system_level);
    }
    
    // Search by menu or lang_key
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.$or = [
          { menu: { $regex: req.query.search, $options: 'i' } },
          { lang_key: { $regex: req.query.search, $options: 'i' } }
        ];
      } else {
        // For SQL databases, we'll handle this in the query options
      }
    }
    
    let sidebarMenus;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await SidebarMenu.countDocuments(filters);
      sidebarMenus = await SidebarMenu.find(filters)
        .sort({ display_order: 1, level: 1 })
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
          ['level', 'ASC']
        ],
        include: [
          {
            model: PermissionGroup,
            as: 'PermissionGroup',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
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
        const { Op } = SidebarMenu.sequelize;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { menu: { [Op.like]: `%${req.query.search}%` } },
            { lang_key: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }
      
      const result = await SidebarMenu.findAndCountAll(queryOptions);
      sidebarMenus = result.rows;
      total = result.count;
    }
    
    res.status(200).json({
      success: true,
      data: sidebarMenus,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching sidebar menus:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch sidebar menus',
      error: error.message 
    });
  }
};

// Get sidebar menu by ID
exports.getSidebarMenuById = async (req, res) => {
  try {
    const id = req.params.id;
    let sidebarMenu;
    
    if (dbType === 'mongodb') {
      sidebarMenu = await SidebarMenu.findById(id);
    } else {
      sidebarMenu = await SidebarMenu.findByPk(parseInt(id), {
        include: [
          {
            model: PermissionGroup,
            as: 'PermissionGroup',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
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
    
    if (!sidebarMenu) {
      return res.status(404).json({ 
        success: false,
        message: 'Sidebar menu not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: sidebarMenu
    });
  } catch (error) {
    console.error('Error fetching sidebar menu by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch sidebar menu',
      error: error.message 
    });
  }
};

// Get active sidebar menus for navigation
exports.getActiveSidebarMenus = async (req, res) => {
  try {
    let sidebarMenus;
    
    if (dbType === 'mongodb') {
      sidebarMenus = await SidebarMenu.find({ 
        is_active: true,
        sidebar_display: true
      }).sort({ display_order: 1, level: 1 });
    } else {
      sidebarMenus = await SidebarMenu.findAll({
        where: { 
          is_active: true,
          sidebar_display: true
        },
        order: [
          ['display_order', 'ASC'],
          ['level', 'ASC']
        ],
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
    
    // Transform the data to create a hierarchical menu structure
    const menuTree = buildMenuTree(sidebarMenus);
    
    res.status(200).json({
      success: true,
      data: menuTree
    });
  } catch (error) {
    console.error('Error fetching active sidebar menus:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch active sidebar menus',
      error: error.message 
    });
  }
};

// Helper function to build menu tree
function buildMenuTree(menus) {
  const menuMap = {};
  const rootMenus = [];
  
  // First pass: create a map of all menus by their ID
  menus.forEach(menu => {
    const menuItem = menu.toJSON ? menu.toJSON() : menu;
    menuItem.children = [];
    menuMap[menuItem.id] = menuItem;
  });
  
  // Second pass: build the tree structure
  menus.forEach(menu => {
    const menuItem = menuMap[menu.id];
    
    // If it's a top-level menu (level 0 or null)
    if (!menuItem.level || menuItem.level === 0) {
      rootMenus.push(menuItem);
    } else {
      // Find the parent menu based on level and system_level
      const potentialParents = menus.filter(m => 
        m.level === (menuItem.level - 1) && 
        m.system_level === menuItem.system_level
      );
      
      if (potentialParents.length > 0) {
        // Sort by display_order to find the closest parent
        potentialParents.sort((a, b) => a.display_order - b.display_order);
        
        // Find the parent with the highest display_order that is still less than the current menu
        let parent = null;
        for (const p of potentialParents) {
          if (p.display_order <= menuItem.display_order) {
            parent = p;
          } else {
            break;
          }
        }
        
        if (parent && menuMap[parent.id]) {
          menuMap[parent.id].children.push(menuItem);
        } else {
          rootMenus.push(menuItem);
        }
      } else {
        rootMenus.push(menuItem);
      }
    }
  });
  
  return rootMenus;
}

// Create new sidebar menu
exports.createSidebarMenu = async (req, res) => {
  try {
    const { 
      permission_group_id, icon, menu, activate_menu, url, lang_key,
      system_level, level, display_order, sidebar_display, access_permissions,
      is_active, is_system, created_by
    } = req.body;
    
    // Validate required fields
    if (!lang_key) {
      return res.status(400).json({ 
        success: false,
        message: 'Language key is required' 
      });
    }
    
    // Check if permission group exists if permission_group_id is provided
    if (permission_group_id) {
      let permissionGroup;
      if (dbType === 'mongodb') {
        permissionGroup = await PermissionGroup.findById(permission_group_id);
      } else {
        permissionGroup = await PermissionGroup.findByPk(parseInt(permission_group_id));
      }
      
      if (!permissionGroup) {
        return res.status(400).json({
          success: false,
          message: 'Permission group not found'
        });
      }
    }
    
    let newSidebarMenu;
    
    if (dbType === 'mongodb') {
      newSidebarMenu = new SidebarMenu({
        permission_group_id, icon, menu, activate_menu, url, lang_key,
        system_level, level, display_order, sidebar_display, access_permissions,
        is_active, is_system, created_by
      });
      await newSidebarMenu.save();
    } else {
      newSidebarMenu = await SidebarMenu.create({
        permission_group_id, icon, menu, activate_menu, url, lang_key,
        system_level, level, display_order, sidebar_display, access_permissions,
        is_active, is_system, created_by
      });
      
      // Fetch the sidebar menu with relations
      newSidebarMenu = await SidebarMenu.findByPk(newSidebarMenu.id, {
        include: [
          {
            model: PermissionGroup,
            as: 'PermissionGroup',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
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
      message: 'Sidebar menu created successfully',
      data: newSidebarMenu
    });
  } catch (error) {
    console.error('Error creating sidebar menu:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create sidebar menu',
      error: error.message 
    });
  }
};

// Update sidebar menu
exports.updateSidebarMenu = async (req, res) => {
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
    
    let sidebarMenu;
    let updatedSidebarMenu;
    
    if (dbType === 'mongodb') {
      sidebarMenu = await SidebarMenu.findById(id);
      
      if (!sidebarMenu) {
        return res.status(404).json({ 
          success: false,
          message: 'Sidebar menu not found' 
        });
      }
      
      // Check if it's a system menu and prevent modification
      if (sidebarMenu.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System sidebar menus cannot be modified'
        });
      }
      
      // Check if permission group exists if permission_group_id is provided
      if (updateData.permission_group_id) {
        const permissionGroup = await PermissionGroup.findById(updateData.permission_group_id);
        if (!permissionGroup) {
          return res.status(400).json({
            success: false,
            message: 'Permission group not found'
          });
        }
      }
      
      updatedSidebarMenu = await SidebarMenu.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );
    } else {
      sidebarMenu = await SidebarMenu.findByPk(parseInt(id));
      
      if (!sidebarMenu) {
        return res.status(404).json({ 
          success: false,
          message: 'Sidebar menu not found' 
        });
      }
      
      // Check if it's a system menu and prevent modification
      if (sidebarMenu.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System sidebar menus cannot be modified'
        });
      }
      
      // Check if permission group exists if permission_group_id is provided
      if (updateData.permission_group_id) {
        const permissionGroup = await PermissionGroup.findByPk(parseInt(updateData.permission_group_id));
        if (!permissionGroup) {
          return res.status(400).json({
            success: false,
            message: 'Permission group not found'
          });
        }
      }
      
      await sidebarMenu.update(updateData);
      updatedSidebarMenu = await SidebarMenu.findByPk(parseInt(id), {
        include: [
          {
            model: PermissionGroup,
            as: 'PermissionGroup',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
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
      message: 'Sidebar menu updated successfully',
      data: updatedSidebarMenu
    });
  } catch (error) {
    console.error('Error updating sidebar menu:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update sidebar menu',
      error: error.message 
    });
  }
};

// Delete sidebar menu
exports.deleteSidebarMenu = async (req, res) => {
  try {
    const id = req.params.id;
    let sidebarMenu;
    
    if (dbType === 'mongodb') {
      sidebarMenu = await SidebarMenu.findById(id);
      
      if (!sidebarMenu) {
        return res.status(404).json({ 
          success: false,
          message: 'Sidebar menu not found' 
        });
      }
      
      // Check if it's a system menu and prevent deletion
      if (sidebarMenu.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System sidebar menus cannot be deleted'
        });
      }
      
      // Soft delete by setting deleted_at
      await SidebarMenu.findByIdAndUpdate(id, { 
        deleted_at: new Date(),
        is_active: false
      });
    } else {
      sidebarMenu = await SidebarMenu.findByPk(parseInt(id));
      
      if (!sidebarMenu) {
        return res.status(404).json({ 
          success: false,
          message: 'Sidebar menu not found' 
        });
      }
      
      // Check if it's a system menu and prevent deletion
      if (sidebarMenu.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System sidebar menus cannot be deleted'
        });
      }
      
      // Soft delete by setting deleted_at
      await sidebarMenu.update({ 
        deleted_at: new Date(),
        is_active: false
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Sidebar menu deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sidebar menu:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete sidebar menu',
      error: error.message 
    });
  }
};
