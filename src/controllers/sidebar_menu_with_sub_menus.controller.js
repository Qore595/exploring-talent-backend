const SidebarMenu = require('../models/sidebar_menu.model');
const SidebarSubMenu = require('../models/sidebar_sub_menu.model');
const PermissionGroup = require('../models/permission_group.model');
const PermissionCategory = require('../models/permission_category.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all sidebar menus with their sub-menus
exports.getAllMenusWithSubMenus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.sidebar_display !== undefined) {
      filters.sidebar_display = req.query.sidebar_display === 'true';
    }
    if (req.query.is_system !== undefined) {
      filters.is_system = req.query.is_system === 'true';
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

    // Exclude deleted items
    filters.deleted_at = null;

    let sidebarMenus;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await SidebarMenu.countDocuments(filters);
      sidebarMenus = await SidebarMenu.find(filters)
        .sort({ display_order: 1, level: 1 })
        .skip(offset)
        .limit(limit);

      // Get sub-menus for each menu
      const menuIds = sidebarMenus.map(menu => menu._id);
      const subMenus = await SidebarSubMenu.find({
        sidebar_menu_id: { $in: menuIds },
        deleted_at: null
      }).sort({ display_order: 1, level: 1 });

      // Group sub-menus by parent menu ID
      const subMenusByParent = {};
      subMenus.forEach(subMenu => {
        const parentId = subMenu.sidebar_menu_id.toString();
        if (!subMenusByParent[parentId]) {
          subMenusByParent[parentId] = [];
        }
        subMenusByParent[parentId].push(subMenu);
      });

      // Add sub-menus to their parent menus
      const menusWithSubMenus = sidebarMenus.map(menu => {
        const menuObj = menu.toObject();
        menuObj.sub_menus = subMenusByParent[menu._id.toString()] || [];
        return menuObj;
      });

      sidebarMenus = menusWithSubMenus;
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
          },
          {
            model: SidebarSubMenu,
            as: 'SubMenus',
            where: { deleted_at: null },
            required: false,
            include: [
              {
                model: PermissionCategory,
                as: 'PermissionCategory',
                attributes: ['id', 'name', 'short_code'],
                required: false
              }
            ]
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
    console.error('Error fetching sidebar menus with sub-menus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sidebar menus with sub-menus',
      error: error.message
    });
  }
};

// Get a single sidebar menu with its sub-menus by ID
exports.getMenuWithSubMenusById = async (req, res) => {
  try {
    const { id } = req.params;
    let sidebarMenu;

    if (dbType === 'mongodb') {
      sidebarMenu = await SidebarMenu.findOne({
        _id: id,
        deleted_at: null
      });

      if (!sidebarMenu) {
        return res.status(404).json({
          success: false,
          message: 'Sidebar menu not found'
        });
      }

      // Get sub-menus for this menu
      const subMenus = await SidebarSubMenu.find({
        sidebar_menu_id: id,
        deleted_at: null
      }).sort({ display_order: 1, level: 1 });

      // Convert to plain object and add sub-menus
      const menuWithSubMenus = sidebarMenu.toObject();
      menuWithSubMenus.sub_menus = subMenus;

      sidebarMenu = menuWithSubMenus;
    } else {
      sidebarMenu = await SidebarMenu.findOne({
        where: {
          id: parseInt(id),
          deleted_at: null
        },
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
          },
          {
            model: SidebarSubMenu,
            as: 'SubMenus',
            where: { deleted_at: null },
            required: false,
            include: [
              {
                model: PermissionCategory,
                as: 'PermissionCategory',
                attributes: ['id', 'name', 'short_code'],
                required: false
              }
            ]
          }
        ]
      });

      if (!sidebarMenu) {
        return res.status(404).json({
          success: false,
          message: 'Sidebar menu not found'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: sidebarMenu
    });
  } catch (error) {
    console.error('Error fetching sidebar menu with sub-menus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sidebar menu with sub-menus',
      error: error.message
    });
  }
};

// Create a new sidebar menu with sub-menus
exports.createMenuWithSubMenus = async (req, res) => {
  try {
    const {
      menu_data,
      sub_menus
    } = req.body;

    // Validate required fields for menu
    if (!menu_data || !menu_data.lang_key) {
      return res.status(400).json({
        success: false,
        message: 'Menu data with language key is required'
      });
    }

    // Start a transaction
    let transaction;
    let newSidebarMenu;
    let newSubMenus = [];

    if (dbType === 'mongodb') {
      // MongoDB doesn't have transactions in the same way as SQL databases
      // Create the main menu
      newSidebarMenu = new SidebarMenu({
        permission_group_id: menu_data.permission_group_id,
        icon: menu_data.icon,
        menu: menu_data.menu,
        activate_menu: menu_data.activate_menu,
        url: menu_data.url,
        lang_key: menu_data.lang_key,
        system_level: menu_data.system_level,
        level: menu_data.level,
        display_order: menu_data.display_order,
        sidebar_display: menu_data.sidebar_display,
        access_permissions: menu_data.access_permissions,
        is_active: menu_data.is_active !== undefined ? menu_data.is_active : true,
        is_system: menu_data.is_system !== undefined ? menu_data.is_system : false,
        created_by: menu_data.created_by
      });
      await newSidebarMenu.save();

      // Create sub-menus if provided
      if (sub_menus && Array.isArray(sub_menus) && sub_menus.length > 0) {
        for (const subMenuData of sub_menus) {
          if (!subMenuData.sub_menu || !subMenuData.url || !subMenuData.lang_key) {
            continue; // Skip invalid sub-menus
          }

          const newSubMenu = new SidebarSubMenu({
            sidebar_menu_id: newSidebarMenu._id,
            permission_category_id: subMenuData.permission_category_id,
            icon: subMenuData.icon,
            sub_menu: subMenuData.sub_menu,
            activate_menu: subMenuData.activate_menu,
            url: subMenuData.url,
            lang_key: subMenuData.lang_key,
            system_level: subMenuData.system_level,
            level: subMenuData.level,
            display_order: subMenuData.display_order,
            sidebar_display: subMenuData.sidebar_display,
            access_permissions: subMenuData.access_permissions,
            is_active: subMenuData.is_active !== undefined ? subMenuData.is_active : true,
            is_system: subMenuData.is_system !== undefined ? subMenuData.is_system : false,
            created_by: subMenuData.created_by || menu_data.created_by
          });
          await newSubMenu.save();
          newSubMenus.push(newSubMenu);
        }
      }

      // Prepare response
      const menuWithSubMenus = newSidebarMenu.toObject();
      menuWithSubMenus.sub_menus = newSubMenus;

      return res.status(201).json({
        success: true,
        message: 'Sidebar menu with sub-menus created successfully',
        data: menuWithSubMenus
      });
    } else {
      // SQL databases (MySQL or PostgreSQL)
      transaction = await SidebarMenu.sequelize.transaction();

      try {
        // Create the main menu
        newSidebarMenu = await SidebarMenu.create({
          permission_group_id: menu_data.permission_group_id,
          icon: menu_data.icon,
          menu: menu_data.menu,
          activate_menu: menu_data.activate_menu,
          url: menu_data.url,
          lang_key: menu_data.lang_key,
          system_level: menu_data.system_level,
          level: menu_data.level,
          display_order: menu_data.display_order,
          sidebar_display: menu_data.sidebar_display,
          access_permissions: menu_data.access_permissions,
          is_active: menu_data.is_active !== undefined ? menu_data.is_active : true,
          is_system: menu_data.is_system !== undefined ? menu_data.is_system : false,
          created_by: menu_data.created_by
        }, { transaction });

        // Create sub-menus if provided
        if (sub_menus && Array.isArray(sub_menus) && sub_menus.length > 0) {
          for (const subMenuData of sub_menus) {
            if (!subMenuData.sub_menu || !subMenuData.url || !subMenuData.lang_key) {
              continue; // Skip invalid sub-menus
            }

            const newSubMenu = await SidebarSubMenu.create({
              sidebar_menu_id: newSidebarMenu.id,
              permission_category_id: subMenuData.permission_category_id,
              icon: subMenuData.icon,
              sub_menu: subMenuData.sub_menu,
              activate_menu: subMenuData.activate_menu,
              url: subMenuData.url,
              lang_key: subMenuData.lang_key,
              system_level: subMenuData.system_level,
              level: subMenuData.level,
              display_order: subMenuData.display_order,
              sidebar_display: subMenuData.sidebar_display,
              access_permissions: subMenuData.access_permissions,
              is_active: subMenuData.is_active !== undefined ? subMenuData.is_active : true,
              is_system: subMenuData.is_system !== undefined ? subMenuData.is_system : false,
              created_by: subMenuData.created_by || menu_data.created_by
            }, { transaction });
            newSubMenus.push(newSubMenu);
          }
        }

        // Commit the transaction
        await transaction.commit();

        // Fetch the created menu with its sub-menus
        const createdMenu = await SidebarMenu.findByPk(newSidebarMenu.id, {
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
              model: SidebarSubMenu,
              as: 'SubMenus',
              required: false,
              include: [
                {
                  model: PermissionCategory,
                  as: 'PermissionCategory',
                  attributes: ['id', 'name', 'short_code'],
                  required: false
                }
              ]
            }
          ]
        });

        return res.status(201).json({
          success: true,
          message: 'Sidebar menu with sub-menus created successfully',
          data: createdMenu
        });
      } catch (error) {
        // Rollback transaction in case of error
        if (transaction) await transaction.rollback();
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating sidebar menu with sub-menus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sidebar menu with sub-menus',
      error: error.message
    });
  }
};

// Update a sidebar menu with its sub-menus
exports.updateMenuWithSubMenus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      menu_data,
      sub_menus_to_add = [],
      sub_menus_to_update = [],
      sub_menus_to_delete = []
    } = req.body;

    // Validate required fields for menu
    if (!menu_data) {
      return res.status(400).json({
        success: false,
        message: 'Menu data is required'
      });
    }

    // Check if menu exists
    let sidebarMenu;
    if (dbType === 'mongodb') {
      sidebarMenu = await SidebarMenu.findById(id);
    } else {
      sidebarMenu = await SidebarMenu.findByPk(parseInt(id));
    }

    if (!sidebarMenu) {
      return res.status(404).json({
        success: false,
        message: 'Sidebar menu not found'
      });
    }

    // Check if it's a system menu and prevent modification if is_system is being changed to false
    if (sidebarMenu.is_system && menu_data.is_system === false) {
      return res.status(403).json({
        success: false,
        message: 'System sidebar menus cannot be modified'
      });
    }

    // Start a transaction for SQL databases
    let transaction;
    if (dbType !== 'mongodb') {
      transaction = await SidebarMenu.sequelize.transaction();
    }

    try {
      // Update the main menu
      if (dbType === 'mongodb') {
        await SidebarMenu.findByIdAndUpdate(id, {
          $set: {
            permission_group_id: menu_data.permission_group_id,
            icon: menu_data.icon,
            menu: menu_data.menu,
            activate_menu: menu_data.activate_menu,
            url: menu_data.url,
            lang_key: menu_data.lang_key,
            system_level: menu_data.system_level,
            level: menu_data.level,
            display_order: menu_data.display_order,
            sidebar_display: menu_data.sidebar_display,
            access_permissions: menu_data.access_permissions,
            is_active: menu_data.is_active,
            is_system: menu_data.is_system,
            updated_by: menu_data.updated_by
          }
        });

        // 1. Add new sub-menus
        const newSubMenus = [];
        for (const subMenuData of sub_menus_to_add) {
          if (!subMenuData.sub_menu || !subMenuData.url || !subMenuData.lang_key) {
            continue; // Skip invalid sub-menus
          }

          const newSubMenu = new SidebarSubMenu({
            sidebar_menu_id: id,
            permission_category_id: subMenuData.permission_category_id,
            icon: subMenuData.icon,
            sub_menu: subMenuData.sub_menu,
            activate_menu: subMenuData.activate_menu,
            url: subMenuData.url,
            lang_key: subMenuData.lang_key,
            system_level: subMenuData.system_level,
            level: subMenuData.level,
            display_order: subMenuData.display_order,
            sidebar_display: subMenuData.sidebar_display,
            access_permissions: subMenuData.access_permissions,
            is_active: subMenuData.is_active !== undefined ? subMenuData.is_active : true,
            is_system: subMenuData.is_system !== undefined ? subMenuData.is_system : false,
            created_by: subMenuData.created_by || menu_data.updated_by
          });
          await newSubMenu.save();
          newSubMenus.push(newSubMenu);
        }

        // 2. Update existing sub-menus
        for (const subMenuData of sub_menus_to_update) {
          if (!subMenuData.id) {
            continue; // Skip if no ID provided
          }

          // Check if sub-menu exists and belongs to this menu
          const subMenu = await SidebarSubMenu.findOne({
            _id: subMenuData.id,
            sidebar_menu_id: id,
            deleted_at: null
          });

          if (!subMenu) {
            continue; // Skip if sub-menu not found
          }

          // Check if it's a system sub-menu and prevent modification
          if (subMenu.is_system && subMenuData.is_system === false) {
            continue; // Skip system sub-menus
          }

          await SidebarSubMenu.findByIdAndUpdate(subMenuData.id, {
            $set: {
              permission_category_id: subMenuData.permission_category_id,
              icon: subMenuData.icon,
              sub_menu: subMenuData.sub_menu,
              activate_menu: subMenuData.activate_menu,
              url: subMenuData.url,
              lang_key: subMenuData.lang_key,
              system_level: subMenuData.system_level,
              level: subMenuData.level,
              display_order: subMenuData.display_order,
              sidebar_display: subMenuData.sidebar_display,
              access_permissions: subMenuData.access_permissions,
              is_active: subMenuData.is_active,
              is_system: subMenuData.is_system,
              updated_by: subMenuData.updated_by || menu_data.updated_by
            }
          });
        }

        // 3. Delete sub-menus
        for (const subMenuId of sub_menus_to_delete) {
          // Check if sub-menu exists and belongs to this menu
          const subMenu = await SidebarSubMenu.findOne({
            _id: subMenuId,
            sidebar_menu_id: id,
            deleted_at: null
          });

          if (!subMenu) {
            continue; // Skip if sub-menu not found
          }

          // Check if it's a system sub-menu and prevent deletion
          if (subMenu.is_system) {
            continue; // Skip system sub-menus
          }

          // Soft delete
          await SidebarSubMenu.findByIdAndUpdate(subMenuId, {
            deleted_at: new Date(),
            is_active: false
          });
        }

        // Get updated menu with sub-menus
        const updatedMenu = await SidebarMenu.findById(id);
        const updatedSubMenus = await SidebarSubMenu.find({
          sidebar_menu_id: id,
          deleted_at: null
        }).sort({ display_order: 1, level: 1 });

        // Prepare response
        const menuWithSubMenus = updatedMenu.toObject();
        menuWithSubMenus.sub_menus = updatedSubMenus;

        return res.status(200).json({
          success: true,
          message: 'Sidebar menu with sub-menus updated successfully',
          data: menuWithSubMenus
        });
      } else {
        // SQL databases (MySQL or PostgreSQL)
        // Update the main menu
        await SidebarMenu.update({
          permission_group_id: menu_data.permission_group_id,
          icon: menu_data.icon,
          menu: menu_data.menu,
          activate_menu: menu_data.activate_menu,
          url: menu_data.url,
          lang_key: menu_data.lang_key,
          system_level: menu_data.system_level,
          level: menu_data.level,
          display_order: menu_data.display_order,
          sidebar_display: menu_data.sidebar_display,
          access_permissions: menu_data.access_permissions,
          is_active: menu_data.is_active,
          is_system: menu_data.is_system,
          updated_by: menu_data.updated_by
        }, {
          where: { id: parseInt(id) },
          transaction
        });

        // 1. Add new sub-menus
        for (const subMenuData of sub_menus_to_add) {
          if (!subMenuData.sub_menu || !subMenuData.url || !subMenuData.lang_key) {
            continue; // Skip invalid sub-menus
          }

          await SidebarSubMenu.create({
            sidebar_menu_id: parseInt(id),
            permission_category_id: subMenuData.permission_category_id,
            icon: subMenuData.icon,
            sub_menu: subMenuData.sub_menu,
            activate_menu: subMenuData.activate_menu,
            url: subMenuData.url,
            lang_key: subMenuData.lang_key,
            system_level: subMenuData.system_level,
            level: subMenuData.level,
            display_order: subMenuData.display_order,
            sidebar_display: subMenuData.sidebar_display,
            access_permissions: subMenuData.access_permissions,
            is_active: subMenuData.is_active !== undefined ? subMenuData.is_active : true,
            is_system: subMenuData.is_system !== undefined ? subMenuData.is_system : false,
            created_by: subMenuData.created_by || menu_data.updated_by
          }, { transaction });
        }

        // 2. Update existing sub-menus
        for (const subMenuData of sub_menus_to_update) {
          if (!subMenuData.id) {
            continue; // Skip if no ID provided
          }

          // Check if sub-menu exists and belongs to this menu
          const subMenu = await SidebarSubMenu.findOne({
            where: {
              id: parseInt(subMenuData.id),
              sidebar_menu_id: parseInt(id),
              deleted_at: null
            },
            transaction
          });

          if (!subMenu) {
            continue; // Skip if sub-menu not found
          }

          // Check if it's a system sub-menu and prevent modification
          if (subMenu.is_system && subMenuData.is_system === false) {
            continue; // Skip system sub-menus
          }

          await SidebarSubMenu.update({
            permission_category_id: subMenuData.permission_category_id,
            icon: subMenuData.icon,
            sub_menu: subMenuData.sub_menu,
            activate_menu: subMenuData.activate_menu,
            url: subMenuData.url,
            lang_key: subMenuData.lang_key,
            system_level: subMenuData.system_level,
            level: subMenuData.level,
            display_order: subMenuData.display_order,
            sidebar_display: subMenuData.sidebar_display,
            access_permissions: subMenuData.access_permissions,
            is_active: subMenuData.is_active,
            is_system: subMenuData.is_system,
            updated_by: subMenuData.updated_by || menu_data.updated_by
          }, {
            where: { id: parseInt(subMenuData.id) },
            transaction
          });
        }

        // 3. Delete sub-menus
        for (const subMenuId of sub_menus_to_delete) {
          // Check if sub-menu exists and belongs to this menu
          const subMenu = await SidebarSubMenu.findOne({
            where: {
              id: parseInt(subMenuId),
              sidebar_menu_id: parseInt(id),
              deleted_at: null
            },
            transaction
          });

          if (!subMenu) {
            continue; // Skip if sub-menu not found
          }

          // Check if it's a system sub-menu and prevent deletion
          if (subMenu.is_system) {
            continue; // Skip system sub-menus
          }

          // Soft delete
          await SidebarSubMenu.update({
            deleted_at: new Date(),
            is_active: false
          }, {
            where: { id: parseInt(subMenuId) },
            transaction
          });
        }

        // Commit the transaction
        await transaction.commit();

        // Fetch the updated menu with its sub-menus
        const updatedMenu = await SidebarMenu.findByPk(parseInt(id), {
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
            },
            {
              model: SidebarSubMenu,
              as: 'SubMenus',
              where: { deleted_at: null },
              required: false,
              include: [
                {
                  model: PermissionCategory,
                  as: 'PermissionCategory',
                  attributes: ['id', 'name', 'short_code'],
                  required: false
                }
              ]
            }
          ]
        });

        return res.status(200).json({
          success: true,
          message: 'Sidebar menu with sub-menus updated successfully',
          data: updatedMenu
        });
      }
    } catch (error) {
      // Rollback transaction in case of error for SQL databases
      if (dbType !== 'mongodb' && transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating sidebar menu with sub-menus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sidebar menu with sub-menus',
      error: error.message
    });
  }
};

// Delete a sidebar menu with all its sub-menus
exports.deleteMenuWithSubMenus = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if menu exists
    let sidebarMenu;
    if (dbType === 'mongodb') {
      sidebarMenu = await SidebarMenu.findById(id);
    } else {
      sidebarMenu = await SidebarMenu.findByPk(parseInt(id));
    }

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

    // Start a transaction for SQL databases
    let transaction;
    if (dbType !== 'mongodb') {
      transaction = await SidebarMenu.sequelize.transaction();
    }

    try {
      if (dbType === 'mongodb') {
        // Soft delete all sub-menus
        await SidebarSubMenu.updateMany(
          { sidebar_menu_id: id, deleted_at: null },
          { $set: { deleted_at: new Date(), is_active: false } }
        );

        // Soft delete the menu
        await SidebarMenu.findByIdAndUpdate(id, {
          deleted_at: new Date(),
          is_active: false
        });
      } else {
        // Soft delete all sub-menus
        await SidebarSubMenu.update(
          { deleted_at: new Date(), is_active: false },
          {
            where: { sidebar_menu_id: parseInt(id), deleted_at: null },
            transaction
          }
        );

        // Soft delete the menu
        await SidebarMenu.update(
          { deleted_at: new Date(), is_active: false },
          {
            where: { id: parseInt(id) },
            transaction
          }
        );

        // Commit the transaction
        await transaction.commit();
      }

      return res.status(200).json({
        success: true,
        message: 'Sidebar menu with all sub-menus deleted successfully'
      });
    } catch (error) {
      // Rollback transaction in case of error for SQL databases
      if (dbType !== 'mongodb' && transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting sidebar menu with sub-menus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sidebar menu with sub-menus',
      error: error.message
    });
  }
};