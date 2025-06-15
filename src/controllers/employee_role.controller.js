const EmployeeRole = require('../models/employee_role.model');
const Employee = require('../models/employee.model');
const Role = require('../models/role.model');
const Branch = require('../models/branch.model');
const { dbType } = require('../config/database');

// Get all employee roles with pagination and filtering
exports.getAllEmployeeRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.is_primary !== undefined) {
      filters.is_primary = req.query.is_primary === 'true';
    }
    if (req.query.employee_id) {
      filters.employee_id = parseInt(req.query.employee_id);
    }
    if (req.query.role_id) {
      filters.role_id = parseInt(req.query.role_id);
    }
    if (req.query.branch_id) {
      filters.branch_id = parseInt(req.query.branch_id);
    }

    // Exclude deleted items
    filters.deleted_at = null;

    let employeeRoles;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await EmployeeRole.countDocuments(filters);
      employeeRoles = await EmployeeRole.find(filters)
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
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Role,
            as: 'Role',
            attributes: ['id', 'name', 'slug'],
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

      const result = await EmployeeRole.findAndCountAll(queryOptions);
      employeeRoles = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: employeeRoles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employee roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee roles',
      error: error.message
    });
  }
};

// Get employee role by ID
exports.getEmployeeRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    let employeeRole;

    if (dbType === 'mongodb') {
      employeeRole = await EmployeeRole.findById(id);
    } else {
      employeeRole = await EmployeeRole.findByPk(parseInt(id), {
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Role,
            as: 'Role',
            attributes: ['id', 'name', 'slug'],
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

    if (!employeeRole) {
      return res.status(404).json({
        success: false,
        message: 'Employee role not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employeeRole
    });
  } catch (error) {
    console.error('Error fetching employee role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee role',
      error: error.message
    });
  }
};

// Get roles by employee ID
exports.getRolesByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    let employeeRoles;

    const filters = {
      employee_id: parseInt(employeeId),
      is_active: true,
      deleted_at: null
    };

    if (dbType === 'mongodb') {
      employeeRoles = await EmployeeRole.find(filters);
    } else {
      employeeRoles = await EmployeeRole.findAll({
        where: filters,
        include: [
          {
            model: Role,
            as: 'Role',
            attributes: ['id', 'name', 'slug', 'description', 'priority'],
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
      data: employeeRoles
    });
  } catch (error) {
    console.error('Error fetching roles by employee ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles by employee ID',
      error: error.message
    });
  }
};

// Create new employee role
exports.createEmployeeRole = async (req, res) => {
  try {
    const {
      employee_id, role_id, branch_id, is_primary, is_active, created_by
    } = req.body;

    // Validate required fields
    if (!employee_id || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and Role ID are required'
      });
    }

    // Check if employee exists
    let employee;
    if (dbType === 'mongodb') {
      employee = await Employee.findById(employee_id);
    } else {
      employee = await Employee.findByPk(parseInt(employee_id));
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if role exists
    let role;
    if (dbType === 'mongodb') {
      role = await Role.findById(role_id);
    } else {
      role = await Role.findByPk(parseInt(role_id));
    }

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // If is_primary is true, set all other roles for this employee to is_primary=false
    if (is_primary && dbType !== 'mongodb') {
      await EmployeeRole.update(
        { is_primary: false },
        {
          where: {
            employee_id: parseInt(employee_id),
            is_primary: true
          }
        }
      );
    }

    let newEmployeeRole;

    if (dbType === 'mongodb') {
      // Check for duplicate
      const existingRole = await EmployeeRole.findOne({
        employee_id,
        role_id,
        branch_id: branch_id || null
      });

      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Employee already has this role assigned for this branch'
        });
      }

      // If is_primary is true, set all other roles for this employee to is_primary=false
      if (is_primary) {
        await EmployeeRole.updateMany(
          { employee_id, is_primary: true },
          { is_primary: false }
        );
      }

      newEmployeeRole = new EmployeeRole({
        employee_id, role_id, branch_id, is_primary, is_active, created_by
      });
      await newEmployeeRole.save();
    } else {
      try {
        newEmployeeRole = await EmployeeRole.create({
          employee_id, role_id, branch_id, is_primary, is_active, created_by
        });

        // Fetch the employee role with relations
        newEmployeeRole = await EmployeeRole.findByPk(newEmployeeRole.id, {
          include: [
            {
              model: Employee,
              as: 'Employee',
              attributes: ['id', 'employee_id', 'first_name', 'last_name'],
              required: false
            },
            {
              model: Role,
              as: 'Role',
              attributes: ['id', 'name', 'slug'],
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
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({
            success: false,
            message: 'Employee already has this role assigned for this branch'
          });
        }
        throw error;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Employee role assigned successfully',
      data: newEmployeeRole
    });
  } catch (error) {
    console.error('Error creating employee role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee role',
      error: error.message
    });
  }
};

// Update employee role
exports.updateEmployeeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employee_id, role_id, branch_id, is_primary, is_active, updated_by
    } = req.body;

    let employeeRole;

    if (dbType === 'mongodb') {
      employeeRole = await EmployeeRole.findById(id);

      if (!employeeRole) {
        return res.status(404).json({
          success: false,
          message: 'Employee role not found'
        });
      }

      // If is_primary is being set to true, set all other roles for this employee to is_primary=false
      if (is_primary && !employeeRole.is_primary) {
        await EmployeeRole.updateMany(
          {
            employee_id: employeeRole.employee_id,
            is_primary: true,
            _id: { $ne: id }
          },
          { is_primary: false }
        );
      }

      // Update the employee role
      await EmployeeRole.findByIdAndUpdate(id, {
        employee_id, role_id, branch_id, is_primary, is_active, updated_by
      });

      // Get the updated employee role
      employeeRole = await EmployeeRole.findById(id);
    } else {
      employeeRole = await EmployeeRole.findByPk(parseInt(id));

      if (!employeeRole) {
        return res.status(404).json({
          success: false,
          message: 'Employee role not found'
        });
      }

      // If is_primary is being set to true, set all other roles for this employee to is_primary=false
      if (is_primary && !employeeRole.is_primary) {
        await EmployeeRole.update(
          { is_primary: false },
          {
            where: {
              employee_id: employeeRole.employee_id,
              is_primary: true,
              id: { [EmployeeRole.sequelize.Op.ne]: parseInt(id) }
            }
          }
        );
      }

      // Update the employee role
      await employeeRole.update({
        employee_id, role_id, branch_id, is_primary, is_active, updated_by
      });

      // Fetch the updated employee role with relations
      employeeRole = await EmployeeRole.findByPk(parseInt(id), {
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Role,
            as: 'Role',
            attributes: ['id', 'name', 'slug'],
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
      message: 'Employee role updated successfully',
      data: employeeRole
    });
  } catch (error) {
    console.error('Error updating employee role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee role',
      error: error.message
    });
  }
};

// Delete employee role (soft delete)
exports.deleteEmployeeRole = async (req, res) => {
  try {
    const { id } = req.params;
    let employeeRole;

    if (dbType === 'mongodb') {
      employeeRole = await EmployeeRole.findById(id);

      if (!employeeRole) {
        return res.status(404).json({
          success: false,
          message: 'Employee role not found'
        });
      }

      // Soft delete by setting deleted_at
      await EmployeeRole.findByIdAndUpdate(id, {
        deleted_at: new Date(),
        is_active: false
      });
    } else {
      employeeRole = await EmployeeRole.findByPk(parseInt(id));

      if (!employeeRole) {
        return res.status(404).json({
          success: false,
          message: 'Employee role not found'
        });
      }

      // Soft delete by setting deleted_at
      await employeeRole.update({
        deleted_at: new Date(),
        is_active: false
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee role deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee role',
      error: error.message
    });
  }
};

// Get employees by role ID
exports.getEmployeesByRoleId = async (req, res) => {
  try {
    const { roleId } = req.params;
    let employeeRoles;

    const filters = {
      role_id: parseInt(roleId),
      is_active: true,
      deleted_at: null
    };

    if (dbType === 'mongodb') {
      employeeRoles = await EmployeeRole.find(filters);
    } else {
      employeeRoles = await EmployeeRole.findAll({
        where: filters,
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name', 'email', 'phone', 'designation_id'],
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
      data: employeeRoles
    });
  } catch (error) {
    console.error('Error fetching employees by role ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees by role ID',
      error: error.message
    });
  }
};