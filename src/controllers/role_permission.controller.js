const RolePermission = require('../models/role_permission.model');
const Role = require('../models/role.model');
const PermissionCategory = require('../models/permission_category.model');
const Branch = require('../models/branch.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all role permissions with pagination and filtering
exports.getAllRolePermissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.role_id) {
      filters.role_id = parseInt(req.query.role_id);
    }
    if (req.query.perm_cat_id) {
      filters.perm_cat_id = parseInt(req.query.perm_cat_id);
    }
    if (req.query.branch_id) {
      filters.branch_id = parseInt(req.query.branch_id);
    }

    let rolePermissions;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await RolePermission.countDocuments(filters);
      rolePermissions = await RolePermission.find(filters)
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        include: [
          {
            model: Role,
            as: 'Role',
            attributes: ['id', 'name', 'slug'],
            required: false
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Branch,
            as: 'Branch',
            attributes: ['id', 'name', 'code'],
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

      const result = await RolePermission.findAndCountAll(queryOptions);
      rolePermissions = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: rolePermissions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role permissions',
      error: error.message
    });
  }
};

// Get role permission by ID
exports.getRolePermissionById = async (req, res) => {
  try {
    const id = req.params.id;
    let rolePermission;

    if (dbType === 'mongodb') {
      rolePermission = await RolePermission.findById(id);
    } else {
      rolePermission = await RolePermission.findByPk(parseInt(id), {
        include: [
          {
            model: Role,
            as: 'Role',
            attributes: ['id', 'name', 'slug'],
            required: false
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Branch,
            as: 'Branch',
            attributes: ['id', 'name', 'code'],
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

    if (!rolePermission) {
      return res.status(404).json({
        success: false,
        message: 'Role permission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rolePermission
    });
  } catch (error) {
    console.error('Error fetching role permission by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role permission',
      error: error.message
    });
  }
};

// Get role permissions by role ID
exports.getRolePermissionsByRoleId = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    let rolePermissions;

    if (dbType === 'mongodb') {
      rolePermissions = await RolePermission.find({
        role_id: parseInt(roleId),
        is_active: true
      });
    } else {
      rolePermissions = await RolePermission.findAll({
        where: {
          role_id: parseInt(roleId),
          is_active: true
        },
        include: [
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Branch,
            as: 'Branch',
            attributes: ['id', 'name', 'code'],
            required: false
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: rolePermissions
    });
  } catch (error) {
    console.error('Error fetching role permissions by role ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role permissions',
      error: error.message
    });
  }
};

// Create new role permission
exports.createRolePermission = async (req, res) => {
  try {
    const {
      role_id, perm_cat_id, can_view, can_add, can_edit, can_delete,
      is_active, created_by, branch_id, custom_attributes
    } = req.body;

    // Validate required fields
    if (!role_id || !perm_cat_id || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'Role ID, permission category ID, and created by are required'
      });
    }

    // Check if role exists
    let role;
    if (dbType === 'mongodb') {
      role = await Role.findOne({ _id: role_id });
    } else {
      role = await Role.findByPk(parseInt(role_id));
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if permission category exists
    let permissionCategory;
    if (dbType === 'mongodb') {
      permissionCategory = await PermissionCategory.findOne({ _id: perm_cat_id });
    } else {
      permissionCategory = await PermissionCategory.findByPk(parseInt(perm_cat_id));
    }

    if (!permissionCategory) {
      return res.status(400).json({
        success: false,
        message: 'Permission category not found'
      });
    }

    // Check if branch exists if branch_id is provided
    if (branch_id) {
      let branch;
      if (dbType === 'mongodb') {
        branch = await Branch.findOne({ _id: branch_id });
      } else {
        branch = await Branch.findByPk(parseInt(branch_id));
      }

      if (!branch) {
        return res.status(400).json({
          success: false,
          message: 'Branch not found'
        });
      }
    }

    // Check if role permission already exists
    let existingRolePermission;
    if (dbType === 'mongodb') {
      existingRolePermission = await RolePermission.findOne({
        role_id,
        perm_cat_id,
        branch_id: branch_id || null
      });
    } else {
      existingRolePermission = await RolePermission.findOne({
        where: {
          role_id,
          perm_cat_id,
          branch_id: branch_id || null
        }
      });
    }

    if (existingRolePermission) {
      return res.status(400).json({
        success: false,
        message: 'Role permission already exists for this role, permission category, and branch combination'
      });
    }

    let newRolePermission;

    if (dbType === 'mongodb') {
      newRolePermission = new RolePermission({
        role_id, perm_cat_id, can_view, can_add, can_edit, can_delete,
        is_active, created_by, branch_id, custom_attributes
      });
      await newRolePermission.save();
    } else {
      newRolePermission = await RolePermission.create({
        role_id, perm_cat_id, can_view, can_add, can_edit, can_delete,
        is_active, created_by, branch_id, custom_attributes
      });

      // Fetch the role permission with relations
      newRolePermission = await RolePermission.findByPk(newRolePermission.id, {
        include: [
          {
            model: Role,
            as: 'Role',
            attributes: ['id', 'name', 'slug'],
            required: false
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Branch,
            as: 'Branch',
            attributes: ['id', 'name', 'code'],
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
      message: 'Role permission created successfully',
      data: newRolePermission
    });
  } catch (error) {
    console.error('Error creating role permission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role permission',
      error: error.message
    });
  }
};

// Update role permission
exports.updateRolePermission = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.role_id;
    delete updateData.perm_cat_id;
    delete updateData.branch_id;
    delete updateData.created_by;
    delete updateData.created_at;

    let rolePermission;
    let updatedRolePermission;

    if (dbType === 'mongodb') {
      rolePermission = await RolePermission.findById(id);

      if (!rolePermission) {
        return res.status(404).json({
          success: false,
          message: 'Role permission not found'
        });
      }

      updatedRolePermission = await RolePermission.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );
    } else {
      rolePermission = await RolePermission.findByPk(parseInt(id));

      if (!rolePermission) {
        return res.status(404).json({
          success: false,
          message: 'Role permission not found'
        });
      }

      await rolePermission.update(updateData);
      updatedRolePermission = await RolePermission.findByPk(parseInt(id), {
        include: [
          {
            model: Role,
            as: 'Role',
            attributes: ['id', 'name', 'slug'],
            required: false
          },
          {
            model: PermissionCategory,
            as: 'PermissionCategory',
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Branch,
            as: 'Branch',
            attributes: ['id', 'name', 'code'],
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
      message: 'Role permission updated successfully',
      data: updatedRolePermission
    });
  } catch (error) {
    console.error('Error updating role permission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role permission',
      error: error.message
    });
  }
};

// Delete role permission
exports.deleteRolePermission = async (req, res) => {
  try {
    const id = req.params.id;
    let rolePermission;

    if (dbType === 'mongodb') {
      rolePermission = await RolePermission.findById(id);

      if (!rolePermission) {
        return res.status(404).json({
          success: false,
          message: 'Role permission not found'
        });
      }

      // Soft delete by setting deleted_at
      await RolePermission.findByIdAndUpdate(id, {
        deleted_at: new Date(),
        is_active: false
      });
    } else {
      rolePermission = await RolePermission.findByPk(parseInt(id));

      if (!rolePermission) {
        return res.status(404).json({
          success: false,
          message: 'Role permission not found'
        });
      }

      // Soft delete by setting deleted_at
      await rolePermission.update({
        deleted_at: new Date(),
        is_active: false
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role permission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting role permission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete role permission',
      error: error.message
    });
  }
};

// Batch create or update role permissions
exports.batchCreateOrUpdateRolePermissions = async (req, res) => {
  try {
    const { role_id, permissions, created_by, updated_by } = req.body;

    // Validate required fields
    if (!role_id || !permissions || !Array.isArray(permissions) || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'Role ID, permissions array, and created by are required'
      });
    }

    // Check if role exists
    let role;
    if (dbType === 'mongodb') {
      role = await Role.findOne({ _id: role_id });
    } else {
      role = await Role.findByPk(parseInt(role_id));
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role not found'
      });
    }

    const results = [];

    // Process each permission in the array
    for (const permission of permissions) {
      const { perm_cat_id, can_view, can_add, can_edit, can_delete, branch_id, custom_attributes } = permission;

      // Check if permission category exists
      let permissionCategory;
      if (dbType === 'mongodb') {
        permissionCategory = await PermissionCategory.findOne({ _id: perm_cat_id });
      } else {
        permissionCategory = await PermissionCategory.findByPk(parseInt(perm_cat_id));
      }

      if (!permissionCategory) {
        results.push({
          perm_cat_id,
          success: false,
          message: 'Permission category not found'
        });
        continue;
      }

      // Check if branch exists if branch_id is provided
      if (branch_id) {
        let branch;
        if (dbType === 'mongodb') {
          branch = await Branch.findOne({ _id: branch_id });
        } else {
          branch = await Branch.findByPk(parseInt(branch_id));
        }

        if (!branch) {
          results.push({
            perm_cat_id,
            branch_id,
            success: false,
            message: 'Branch not found'
          });
          continue;
        }
      }

      // Check if role permission already exists
      let existingRolePermission;
      if (dbType === 'mongodb') {
        existingRolePermission = await RolePermission.findOne({
          role_id,
          perm_cat_id,
          branch_id: branch_id || null
        });
      } else {
        existingRolePermission = await RolePermission.findOne({
          where: {
            role_id,
            perm_cat_id,
            branch_id: branch_id || null
          }
        });
      }

      if (existingRolePermission) {
        // Update existing role permission
        const updateData = {
          can_view: can_view !== undefined ? can_view : existingRolePermission.can_view,
          can_add: can_add !== undefined ? can_add : existingRolePermission.can_add,
          can_edit: can_edit !== undefined ? can_edit : existingRolePermission.can_edit,
          can_delete: can_delete !== undefined ? can_delete : existingRolePermission.can_delete,
          is_active: true,
          updated_by,
          deleted_at: null
        };

        if (custom_attributes !== undefined) {
          updateData.custom_attributes = custom_attributes;
        }

        if (dbType === 'mongodb') {
          await RolePermission.findByIdAndUpdate(existingRolePermission._id, updateData);
          const updatedPermission = await RolePermission.findById(existingRolePermission._id);
          results.push({
            id: updatedPermission._id,
            perm_cat_id,
            branch_id,
            success: true,
            message: 'Role permission updated successfully',
            data: updatedPermission
          });
        } else {
          await existingRolePermission.update(updateData);
          const updatedPermission = await RolePermission.findByPk(existingRolePermission.id, {
            include: [
              {
                model: PermissionCategory,
                as: 'PermissionCategory',
                attributes: ['id', 'name', 'short_code'],
                required: false
              },
              {
                model: Branch,
                as: 'Branch',
                attributes: ['id', 'name', 'code'],
                required: false
              }
            ]
          });
          results.push({
            id: updatedPermission.id,
            perm_cat_id,
            branch_id,
            success: true,
            message: 'Role permission updated successfully',
            data: updatedPermission
          });
        }
      } else {
        // Create new role permission
        const newPermissionData = {
          role_id,
          perm_cat_id,
          can_view: can_view !== undefined ? can_view : false,
          can_add: can_add !== undefined ? can_add : false,
          can_edit: can_edit !== undefined ? can_edit : false,
          can_delete: can_delete !== undefined ? can_delete : false,
          is_active: true,
          created_by,
          branch_id: branch_id || null,
          custom_attributes: custom_attributes || null
        };

        if (dbType === 'mongodb') {
          const newRolePermission = new RolePermission(newPermissionData);
          await newRolePermission.save();
          results.push({
            id: newRolePermission._id,
            perm_cat_id,
            branch_id,
            success: true,
            message: 'Role permission created successfully',
            data: newRolePermission
          });
        } else {
          const newRolePermission = await RolePermission.create(newPermissionData);
          const createdPermission = await RolePermission.findByPk(newRolePermission.id, {
            include: [
              {
                model: PermissionCategory,
                as: 'PermissionCategory',
                attributes: ['id', 'name', 'short_code'],
                required: false
              },
              {
                model: Branch,
                as: 'Branch',
                attributes: ['id', 'name', 'code'],
                required: false
              }
            ]
          });
          results.push({
            id: createdPermission.id,
            perm_cat_id,
            branch_id,
            success: true,
            message: 'Role permission created successfully',
            data: createdPermission
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Batch operation completed',
      results
    });
  } catch (error) {
    console.error('Error in batch create or update role permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process batch operation',
      error: error.message
    });
  }
};
