const SidebarSubMenu = require('../models/sidebar_sub_menu.model');
const SidebarMenu = require('../models/sidebar_menu.model');
const PermissionCategory = require('../models/permission_category.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all sidebar sub-menus with pagination and filtering
exports.getAllSidebarSubMenus = async (req, res) => {
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
    if (req.query.sidebar_menu_id) {
      filters.sidebar_menu_id = parseInt(req.query.sidebar_menu_id);
    }
    if (req.query.permission_category_id) {
      filters.permission_category_id = parseInt(req.query.permission_category_id);
    }
    if (req.query.level) {
      filters.level = parseInt(req.query.level);
    }
    if (req.query.system_level) {
      filters.system_level = parseInt(req.query.system_level);
    }

    // Exclude deleted items
    filters.deleted_at = null;

    let sidebarSubMenus;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await SidebarSubMenu.countDocuments(filters);
      sidebarSubMenus = await SidebarSubMenu.find(filters)
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
            model: SidebarMenu,
            as: 'ParentMenu',
            attributes: ['id', 'menu', 'lang_key'],
            required: false
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
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
        const { Op } = SidebarSubMenu.sequelize;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { sub_menu: { [Op.like]: `%${req.query.search}%` } },
            { lang_key: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }

      const result = await SidebarSubMenu.findAndCountAll(queryOptions);
      sidebarSubMenus = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: sidebarSubMenus,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching sidebar sub-menus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sidebar sub-menus',
      error: error.message
    });
  }
};

// Get sidebar sub-menu by ID
exports.getSidebarSubMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    let sidebarSubMenu;

    if (dbType === 'mongodb') {
      sidebarSubMenu = await SidebarSubMenu.findById(id);
    } else {
      sidebarSubMenu = await SidebarSubMenu.findByPk(parseInt(id), {
        include: [
          {
            model: SidebarMenu,
            as: 'ParentMenu',
            attributes: ['id', 'menu', 'lang_key'],
            required: false
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
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

    if (!sidebarSubMenu) {
      return res.status(404).json({
        success: false,
        message: 'Sidebar sub-menu not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sidebarSubMenu
    });
  } catch (error) {
    console.error('Error fetching sidebar sub-menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sidebar sub-menu',
      error: error.message
    });
  }
};

// Get sub-menus by parent menu ID
exports.getSubMenusByParentId = async (req, res) => {
  try {
    const { parentId } = req.params;
    let sidebarSubMenus;

    const filters = {
      sidebar_menu_id: parseInt(parentId),
      is_active: true,
      deleted_at: null
    };

    if (dbType === 'mongodb') {
      sidebarSubMenus = await SidebarSubMenu.find(filters)
        .sort({ display_order: 1, level: 1 });
    } else {
      sidebarSubMenus = await SidebarSubMenu.findAll({
        where: filters,
        order: [
          ['display_order', 'ASC'],
          ['level', 'ASC']
        ],
        include: [
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
            attributes: ['id', 'name', 'short_code'],
            required: false
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: sidebarSubMenus
    });
  } catch (error) {
    console.error('Error fetching sub-menus by parent ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sub-menus by parent ID',
      error: error.message
    });
  }
};

// Create new sidebar sub-menu
exports.createSidebarSubMenu = async (req, res) => {
  try {
    const {
      sidebar_menu_id, permission_category_id, icon, sub_menu, activate_menu, url, lang_key,
      system_level, level, display_order, sidebar_display, access_permissions,
      is_active, is_system, created_by
    } = req.body;

    // Validate required fields
    if (!sidebar_menu_id || !sub_menu || !url || !lang_key) {
      return res.status(400).json({
        success: false,
        message: 'Sidebar menu ID, sub-menu name, URL, and language key are required'
      });
    }

    // Check if parent menu exists
    let parentMenu;
    if (dbType === 'mongodb') {
      parentMenu = await SidebarMenu.findById(sidebar_menu_id);
    } else {
      parentMenu = await SidebarMenu.findByPk(parseInt(sidebar_menu_id));
    }

    if (!parentMenu) {
      return res.status(404).json({
        success: false,
        message: 'Parent sidebar menu not found'
      });
    }

    let newSidebarSubMenu;

    if (dbType === 'mongodb') {
      newSidebarSubMenu = new SidebarSubMenu({
        sidebar_menu_id, permission_category_id, icon, sub_menu, activate_menu, url, lang_key,
        system_level, level, display_order, sidebar_display, access_permissions,
        is_active, is_system, created_by
      });
      await newSidebarSubMenu.save();
    } else {
      newSidebarSubMenu = await SidebarSubMenu.create({
        sidebar_menu_id, permission_category_id, icon, sub_menu, activate_menu, url, lang_key,
        system_level, level, display_order, sidebar_display, access_permissions,
        is_active, is_system, created_by
      });

      // Fetch the sidebar sub-menu with relations
      newSidebarSubMenu = await SidebarSubMenu.findByPk(newSidebarSubMenu.id, {
        include: [
          {
            model: SidebarMenu,
            as: 'ParentMenu',
            attributes: ['id', 'menu', 'lang_key'],
            required: false
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
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
      message: 'Sidebar sub-menu created successfully',
      data: newSidebarSubMenu
    });
  } catch (error) {
    console.error('Error creating sidebar sub-menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sidebar sub-menu',
      error: error.message
    });
  }
};

// Update sidebar sub-menu
exports.updateSidebarSubMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sidebar_menu_id, permission_category_id, icon, sub_menu, activate_menu, url, lang_key,
      system_level, level, display_order, sidebar_display, access_permissions,
      is_active, is_system, updated_by
    } = req.body;

    let sidebarSubMenu;

    if (dbType === 'mongodb') {
      sidebarSubMenu = await SidebarSubMenu.findById(id);

      if (!sidebarSubMenu) {
        return res.status(404).json({
          success: false,
          message: 'Sidebar sub-menu not found'
        });
      }

      // Check if it's a system menu and prevent modification
      if (sidebarSubMenu.is_system && is_system === false) {
        return res.status(403).json({
          success: false,
          message: 'System sidebar sub-menus cannot be modified'
        });
      }

      // Update the sidebar sub-menu
      await SidebarSubMenu.findByIdAndUpdate(id, {
        sidebar_menu_id, permission_category_id, icon, sub_menu, activate_menu, url, lang_key,
        system_level, level, display_order, sidebar_display, access_permissions,
        is_active, is_system, updated_by
      });

      // Get the updated sidebar sub-menu
      sidebarSubMenu = await SidebarSubMenu.findById(id);
    } else {
      sidebarSubMenu = await SidebarSubMenu.findByPk(parseInt(id));

      if (!sidebarSubMenu) {
        return res.status(404).json({
          success: false,
          message: 'Sidebar sub-menu not found'
        });
      }

      // Check if it's a system menu and prevent modification
      if (sidebarSubMenu.is_system && is_system === false) {
        return res.status(403).json({
          success: false,
          message: 'System sidebar sub-menus cannot be modified'
        });
      }

      // Update the sidebar sub-menu
      await sidebarSubMenu.update({
        sidebar_menu_id, permission_category_id, icon, sub_menu, activate_menu, url, lang_key,
        system_level, level, display_order, sidebar_display, access_permissions,
        is_active, is_system, updated_by
      });

      // Fetch the updated sidebar sub-menu with relations
      sidebarSubMenu = await SidebarSubMenu.findByPk(parseInt(id), {
        include: [
          {
            model: SidebarMenu,
            as: 'ParentMenu',
            attributes: ['id', 'menu', 'lang_key'],
            required: false
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
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
      message: 'Sidebar sub-menu updated successfully',
      data: sidebarSubMenu
    });
  } catch (error) {
    console.error('Error updating sidebar sub-menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sidebar sub-menu',
      error: error.message
    });
  }
};

// Delete sidebar sub-menu (soft delete)
exports.deleteSidebarSubMenu = async (req, res) => {
  try {
    const { id } = req.params;
    let sidebarSubMenu;

    if (dbType === 'mongodb') {
      sidebarSubMenu = await SidebarSubMenu.findById(id);

      if (!sidebarSubMenu) {
        return res.status(404).json({
          success: false,
          message: 'Sidebar sub-menu not found'
        });
      }

      // Check if it's a system menu and prevent deletion
      if (sidebarSubMenu.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System sidebar sub-menus cannot be deleted'
        });
      }

      // Soft delete by setting deleted_at
      await SidebarSubMenu.findByIdAndUpdate(id, {
        deleted_at: new Date(),
        is_active: false
      });
    } else {
      sidebarSubMenu = await SidebarSubMenu.findByPk(parseInt(id));

      if (!sidebarSubMenu) {
        return res.status(404).json({
          success: false,
          message: 'Sidebar sub-menu not found'
        });
      }

      // Check if it's a system menu and prevent deletion
      if (sidebarSubMenu.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System sidebar sub-menus cannot be deleted'
        });
      }

      // Soft delete by setting deleted_at
      await sidebarSubMenu.update({
        deleted_at: new Date(),
        is_active: false
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sidebar sub-menu deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sidebar sub-menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sidebar sub-menu',
      error: error.message
    });
  }
};