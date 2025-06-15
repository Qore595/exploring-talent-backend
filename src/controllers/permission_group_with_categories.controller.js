const PermissionGroup = require('../models/permission_group.model');
const PermissionCategory = require('../models/permission_category.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all permission groups with their categories
exports.getAllGroupsWithCategories = async (req, res) => {
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

    // Exclude deleted items
    filters.deleted_at = null;

    let permissionGroups;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await PermissionGroup.countDocuments(filters);
      permissionGroups = await PermissionGroup.find(filters)
        .skip(offset)
        .limit(limit);

      // Get categories for each group
      const groupIds = permissionGroups.map(group => group._id);
      const categories = await PermissionCategory.find({
        perm_group_id: { $in: groupIds },
        is_active: true
      }).sort({ display_order: 1 });

      // Group categories by parent group ID
      const categoriesByGroup = {};
      categories.forEach(category => {
        const groupId = category.perm_group_id.toString();
        if (!categoriesByGroup[groupId]) {
          categoriesByGroup[groupId] = [];
        }
        categoriesByGroup[groupId].push(category);
      });

      // Add categories to their parent groups
      const groupsWithCategories = permissionGroups.map(group => {
        const groupObj = group.toObject();
        groupObj.categories = categoriesByGroup[group._id.toString()] || [];
        return groupObj;
      });

      permissionGroups = groupsWithCategories;
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
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
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategories',
            where: { is_active: true },
            required: false,
            order: [['display_order', 'ASC']]
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
            { short_code: { [Op.like]: `%${req.query.search}%` } },
            { description: { [Op.like]: `%${req.query.search}%` } }
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
    console.error('Error fetching permission groups with categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permission groups with categories',
      error: error.message
    });
  }
};

// Get a single permission group with its categories by ID
exports.getGroupWithCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    let permissionGroup;

    if (dbType === 'mongodb') {
      permissionGroup = await PermissionGroup.findOne({
        _id: id,
        deleted_at: null
      });

      if (!permissionGroup) {
        return res.status(404).json({
          success: false,
          message: 'Permission group not found'
        });
      }

      // Get categories for this group
      const categories = await PermissionCategory.find({
        perm_group_id: id,
        is_active: true
      }).sort({ display_order: 1 });

      // Convert to plain object and add categories
      const groupWithCategories = permissionGroup.toObject();
      groupWithCategories.categories = categories;

      permissionGroup = groupWithCategories;
    } else {
      permissionGroup = await PermissionGroup.findOne({
        where: {
          id: parseInt(id),
          deleted_at: null
        },
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
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategories',
            where: { is_active: true },
            required: false,
            order: [['display_order', 'ASC']]
          }
        ]
      });

      if (!permissionGroup) {
        return res.status(404).json({
          success: false,
          message: 'Permission group not found'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: permissionGroup
    });
  } catch (error) {
    console.error('Error fetching permission group with categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permission group with categories',
      error: error.message
    });
  }
};

// Create a new permission group with categories
exports.createGroupWithCategories = async (req, res) => {
  try {
    const {
      group_data,
      categories
    } = req.body;

    // Validate required fields for group
    if (!group_data || !group_data.name || !group_data.short_code) {
      return res.status(400).json({
        success: false,
        message: 'Group data with name and short_code is required'
      });
    }

    // Check if short_code already exists
    let existingGroup;
    if (dbType === 'mongodb') {
      existingGroup = await PermissionGroup.findOne({ short_code: group_data.short_code });
    } else {
      existingGroup = await PermissionGroup.findOne({ where: { short_code: group_data.short_code } });
    }

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: 'Permission group with this short_code already exists'
      });
    }

    // Start a transaction
    let transaction;
    let newPermissionGroup;
    let newCategories = [];

    if (dbType === 'mongodb') {
      // MongoDB doesn't have transactions in the same way as SQL databases
      // Create the main group
      newPermissionGroup = new PermissionGroup({
        name: group_data.name,
        short_code: group_data.short_code,
        description: group_data.description,
        is_system: group_data.is_system !== undefined ? group_data.is_system : false,
        is_active: group_data.is_active !== undefined ? group_data.is_active : true,
        created_by: group_data.created_by
      });
      await newPermissionGroup.save();

      // Create categories if provided
      if (categories && Array.isArray(categories) && categories.length > 0) {
        for (const categoryData of categories) {
          if (!categoryData.name || !categoryData.short_code) {
            continue; // Skip invalid categories
          }

          // Check if category short_code already exists
          const existingCategory = await PermissionCategory.findOne({ short_code: categoryData.short_code });
          if (existingCategory) {
            continue; // Skip if short_code already exists
          }

          const newCategory = new PermissionCategory({
            perm_group_id: newPermissionGroup._id,
            name: categoryData.name,
            short_code: categoryData.short_code,
            description: categoryData.description,
            enable_view: categoryData.enable_view !== undefined ? categoryData.enable_view : false,
            enable_add: categoryData.enable_add !== undefined ? categoryData.enable_add : false,
            enable_edit: categoryData.enable_edit !== undefined ? categoryData.enable_edit : false,
            enable_delete: categoryData.enable_delete !== undefined ? categoryData.enable_delete : false,
            is_system: categoryData.is_system !== undefined ? categoryData.is_system : false,
            is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
            display_order: categoryData.display_order || 0
          });
          await newCategory.save();
          newCategories.push(newCategory);
        }
      }

      // Prepare response
      const groupWithCategories = newPermissionGroup.toObject();
      groupWithCategories.categories = newCategories;

      return res.status(201).json({
        success: true,
        message: 'Permission group with categories created successfully',
        data: groupWithCategories
      });
    } else {
      // SQL databases (MySQL or PostgreSQL)
      transaction = await PermissionGroup.sequelize.transaction();

      try {
        // Create the main group
        newPermissionGroup = await PermissionGroup.create({
          name: group_data.name,
          short_code: group_data.short_code,
          description: group_data.description,
          is_system: group_data.is_system !== undefined ? group_data.is_system : false,
          is_active: group_data.is_active !== undefined ? group_data.is_active : true,
          created_by: group_data.created_by
        }, { transaction });

        // Create categories if provided
        if (categories && Array.isArray(categories) && categories.length > 0) {
          for (const categoryData of categories) {
            if (!categoryData.name || !categoryData.short_code) {
              continue; // Skip invalid categories
            }

            // Check if category short_code already exists
            const existingCategory = await PermissionCategory.findOne({
              where: { short_code: categoryData.short_code },
              transaction
            });
            if (existingCategory) {
              continue; // Skip if short_code already exists
            }

            const newCategory = await PermissionCategory.create({
              perm_group_id: newPermissionGroup.id,
              name: categoryData.name,
              short_code: categoryData.short_code,
              description: categoryData.description,
              enable_view: categoryData.enable_view !== undefined ? categoryData.enable_view : false,
              enable_add: categoryData.enable_add !== undefined ? categoryData.enable_add : false,
              enable_edit: categoryData.enable_edit !== undefined ? categoryData.enable_edit : false,
              enable_delete: categoryData.enable_delete !== undefined ? categoryData.enable_delete : false,
              is_system: categoryData.is_system !== undefined ? categoryData.is_system : false,
              is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
              display_order: categoryData.display_order || 0
            }, { transaction });
            newCategories.push(newCategory);
          }
        }

        // Commit the transaction
        await transaction.commit();

        // Fetch the created group with its categories
        const createdGroup = await PermissionGroup.findByPk(newPermissionGroup.id, {
          include: [
            {
              model: Employee,
              as: 'CreatedBy',
              attributes: ['id', 'first_name', 'last_name', 'employee_id'],
              required: false
            },
            {
              model: PermissionCategory,
              as: 'PermissionCategories',
              required: false
            }
          ]
        });

        return res.status(201).json({
          success: true,
          message: 'Permission group with categories created successfully',
          data: createdGroup
        });
      } catch (error) {
        // Rollback transaction in case of error
        if (transaction) await transaction.rollback();
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating permission group with categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create permission group with categories',
      error: error.message
    });
  }
};

// Update a permission group with its categories
exports.updateGroupWithCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      group_data,
      categories_to_add = [],
      categories_to_update = [],
      categories_to_delete = []
    } = req.body;

    // Validate required fields for group
    if (!group_data) {
      return res.status(400).json({
        success: false,
        message: 'Group data is required'
      });
    }

    // Check if group exists
    let permissionGroup;
    if (dbType === 'mongodb') {
      permissionGroup = await PermissionGroup.findById(id);
    } else {
      permissionGroup = await PermissionGroup.findByPk(parseInt(id));
    }

    if (!permissionGroup) {
      return res.status(404).json({
        success: false,
        message: 'Permission group not found'
      });
    }

    // Check if it's a system group and prevent modification if is_system is being changed to false
    if (permissionGroup.is_system && group_data.is_system === false) {
      return res.status(403).json({
        success: false,
        message: 'System permission groups cannot be modified'
      });
    }

    // If updating short_code, check if it already exists for another group
    if (group_data.short_code && group_data.short_code !== permissionGroup.short_code) {
      let existingGroup;
      if (dbType === 'mongodb') {
        existingGroup = await PermissionGroup.findOne({
          short_code: group_data.short_code,
          _id: { $ne: id }
        });
      } else {
        existingGroup = await PermissionGroup.findOne({
          where: {
            short_code: group_data.short_code,
            id: { [PermissionGroup.sequelize.Op.ne]: parseInt(id) }
          }
        });
      }

      if (existingGroup) {
        return res.status(400).json({
          success: false,
          message: 'Permission group with this short_code already exists'
        });
      }
    }

    // Start a transaction for SQL databases
    let transaction;
    if (dbType !== 'mongodb') {
      transaction = await PermissionGroup.sequelize.transaction();
    }

    try {
      // Update the main group
      if (dbType === 'mongodb') {
        await PermissionGroup.findByIdAndUpdate(id, {
          $set: {
            name: group_data.name,
            short_code: group_data.short_code,
            description: group_data.description,
            is_active: group_data.is_active,
            is_system: group_data.is_system,
            updated_by: group_data.updated_by
          }
        });

        // 1. Add new categories
        const newCategories = [];
        for (const categoryData of categories_to_add) {
          if (!categoryData.name || !categoryData.short_code) {
            continue; // Skip invalid categories
          }

          // Check if category short_code already exists
          const existingCategory = await PermissionCategory.findOne({ short_code: categoryData.short_code });
          if (existingCategory) {
            continue; // Skip if short_code already exists
          }

          const newCategory = new PermissionCategory({
            perm_group_id: id,
            name: categoryData.name,
            short_code: categoryData.short_code,
            description: categoryData.description,
            enable_view: categoryData.enable_view !== undefined ? categoryData.enable_view : false,
            enable_add: categoryData.enable_add !== undefined ? categoryData.enable_add : false,
            enable_edit: categoryData.enable_edit !== undefined ? categoryData.enable_edit : false,
            enable_delete: categoryData.enable_delete !== undefined ? categoryData.enable_delete : false,
            is_system: categoryData.is_system !== undefined ? categoryData.is_system : false,
            is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
            display_order: categoryData.display_order || 0
          });
          await newCategory.save();
          newCategories.push(newCategory);
        }

        // 2. Update existing categories
        for (const categoryData of categories_to_update) {
          if (!categoryData.id) {
            continue; // Skip if no ID provided
          }

          // Check if category exists and belongs to this group
          const category = await PermissionCategory.findOne({
            _id: categoryData.id,
            perm_group_id: id
          });

          if (!category) {
            continue; // Skip if category not found
          }

          // Check if it's a system category and prevent modification
          if (category.is_system && categoryData.is_system === false) {
            continue; // Skip system categories
          }

          // If updating short_code, check if it already exists for another category
          if (categoryData.short_code && categoryData.short_code !== category.short_code) {
            const existingCategory = await PermissionCategory.findOne({
              short_code: categoryData.short_code,
              _id: { $ne: categoryData.id }
            });
            if (existingCategory) {
              continue; // Skip if short_code already exists
            }
          }

          await PermissionCategory.findByIdAndUpdate(categoryData.id, {
            $set: {
              name: categoryData.name,
              short_code: categoryData.short_code,
              description: categoryData.description,
              enable_view: categoryData.enable_view,
              enable_add: categoryData.enable_add,
              enable_edit: categoryData.enable_edit,
              enable_delete: categoryData.enable_delete,
              is_system: categoryData.is_system,
              is_active: categoryData.is_active,
              display_order: categoryData.display_order
            }
          });
        }

        // 3. Delete categories
        for (const categoryId of categories_to_delete) {
          // Check if category exists and belongs to this group
          const category = await PermissionCategory.findOne({
            _id: categoryId,
            perm_group_id: id
          });

          if (!category) {
            continue; // Skip if category not found
          }

          // Check if it's a system category and prevent deletion
          if (category.is_system) {
            continue; // Skip system categories
          }

          // Soft delete by setting is_active to false
          await PermissionCategory.findByIdAndUpdate(categoryId, {
            is_active: false
          });
        }

        // Get updated group with categories
        const updatedGroup = await PermissionGroup.findById(id);
        const updatedCategories = await PermissionCategory.find({
          perm_group_id: id,
          is_active: true
        }).sort({ display_order: 1 });

        // Prepare response
        const groupWithCategories = updatedGroup.toObject();
        groupWithCategories.categories = updatedCategories;

        return res.status(200).json({
          success: true,
          message: 'Permission group with categories updated successfully',
          data: groupWithCategories
        });
      } else {
        // SQL databases (MySQL or PostgreSQL)
        // Update the main group
        await PermissionGroup.update({
          name: group_data.name,
          short_code: group_data.short_code,
          description: group_data.description,
          is_active: group_data.is_active,
          is_system: group_data.is_system,
          updated_by: group_data.updated_by
        }, {
          where: { id: parseInt(id) },
          transaction
        });

        // 1. Add new categories
        for (const categoryData of categories_to_add) {
          if (!categoryData.name || !categoryData.short_code) {
            continue; // Skip invalid categories
          }

          // Check if category short_code already exists
          const existingCategory = await PermissionCategory.findOne({
            where: { short_code: categoryData.short_code },
            transaction
          });
          if (existingCategory) {
            continue; // Skip if short_code already exists
          }

          await PermissionCategory.create({
            perm_group_id: parseInt(id),
            name: categoryData.name,
            short_code: categoryData.short_code,
            description: categoryData.description,
            enable_view: categoryData.enable_view !== undefined ? categoryData.enable_view : false,
            enable_add: categoryData.enable_add !== undefined ? categoryData.enable_add : false,
            enable_edit: categoryData.enable_edit !== undefined ? categoryData.enable_edit : false,
            enable_delete: categoryData.enable_delete !== undefined ? categoryData.enable_delete : false,
            is_system: categoryData.is_system !== undefined ? categoryData.is_system : false,
            is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
            display_order: categoryData.display_order || 0
          }, { transaction });
        }

        // 2. Update existing categories
        for (const categoryData of categories_to_update) {
          if (!categoryData.id) {
            continue; // Skip if no ID provided
          }

          // Check if category exists and belongs to this group
          const category = await PermissionCategory.findOne({
            where: {
              id: parseInt(categoryData.id),
              perm_group_id: parseInt(id)
            },
            transaction
          });

          if (!category) {
            continue; // Skip if category not found
          }

          // Check if it's a system category and prevent modification
          if (category.is_system && categoryData.is_system === false) {
            continue; // Skip system categories
          }

          // If updating short_code, check if it already exists for another category
          if (categoryData.short_code && categoryData.short_code !== category.short_code) {
            const existingCategory = await PermissionCategory.findOne({
              where: {
                short_code: categoryData.short_code,
                id: { [PermissionCategory.sequelize.Op.ne]: parseInt(categoryData.id) }
              },
              transaction
            });
            if (existingCategory) {
              continue; // Skip if short_code already exists
            }
          }

          await PermissionCategory.update({
            name: categoryData.name,
            short_code: categoryData.short_code,
            description: categoryData.description,
            enable_view: categoryData.enable_view,
            enable_add: categoryData.enable_add,
            enable_edit: categoryData.enable_edit,
            enable_delete: categoryData.enable_delete,
            is_system: categoryData.is_system,
            is_active: categoryData.is_active,
            display_order: categoryData.display_order
          }, {
            where: { id: parseInt(categoryData.id) },
            transaction
          });
        }

        // 3. Delete categories (soft delete by setting is_active to false)
        for (const categoryId of categories_to_delete) {
          // Check if category exists and belongs to this group
          const category = await PermissionCategory.findOne({
            where: {
              id: parseInt(categoryId),
              perm_group_id: parseInt(id)
            },
            transaction
          });

          if (!category) {
            continue; // Skip if category not found
          }

          // Check if it's a system category and prevent deletion
          if (category.is_system) {
            continue; // Skip system categories
          }

          // Soft delete by setting is_active to false
          await PermissionCategory.update({
            is_active: false
          }, {
            where: { id: parseInt(categoryId) },
            transaction
          });
        }

        // Commit the transaction
        await transaction.commit();

        // Fetch the updated group with its categories
        const updatedGroup = await PermissionGroup.findByPk(parseInt(id), {
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
            },
            {
              model: PermissionCategory,
              as: 'PermissionCategories',
              where: { is_active: true },
              required: false
            }
          ]
        });

        return res.status(200).json({
          success: true,
          message: 'Permission group with categories updated successfully',
          data: updatedGroup
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
    console.error('Error updating permission group with categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update permission group with categories',
      error: error.message
    });
  }
};

// Delete a permission group with all its categories
exports.deleteGroupWithCategories = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if group exists
    let permissionGroup;
    if (dbType === 'mongodb') {
      permissionGroup = await PermissionGroup.findById(id);
    } else {
      permissionGroup = await PermissionGroup.findByPk(parseInt(id));
    }

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

    // Start a transaction for SQL databases
    let transaction;
    if (dbType !== 'mongodb') {
      transaction = await PermissionGroup.sequelize.transaction();
    }

    try {
      if (dbType === 'mongodb') {
        // Soft delete all categories by setting is_active to false
        await PermissionCategory.updateMany(
          { perm_group_id: id },
          { $set: { is_active: false } }
        );

        // Soft delete the group by setting is_active to false
        await PermissionGroup.findByIdAndUpdate(id, {
          is_active: false,
          deleted_at: new Date()
        });
      } else {
        // Soft delete all categories by setting is_active to false
        await PermissionCategory.update(
          { is_active: false },
          {
            where: { perm_group_id: parseInt(id) },
            transaction
          }
        );

        // Soft delete the group by setting is_active to false and deleted_at to current date
        await PermissionGroup.update(
          { is_active: false, deleted_at: new Date() },
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
        message: 'Permission group with all categories deleted successfully'
      });
    } catch (error) {
      // Rollback transaction in case of error for SQL databases
      if (dbType !== 'mongodb' && transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting permission group with categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete permission group with categories',
      error: error.message
    });
  }
};