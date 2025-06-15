const Role = require('../models/role.model');
const { dbType } = require('../config/database');

// Get all roles with pagination and filtering

exports.getAllRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Option to include deleted records - default to true to show all records
    const includeDeleted = req.query.include_deleted !== 'false';
    console.log('Include deleted records:', includeDeleted);

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.is_system !== undefined) {
      filters.is_system = req.query.is_system === 'true';
    }
    if (req.query.branch_id) {
      filters.branch_id = parseInt(req.query.branch_id);
    }

    // For MongoDB, explicitly exclude soft-deleted records unless includeDeleted is true
    if (dbType === 'mongodb' && !includeDeleted) {
      filters.deleted_at = { $eq: null };
    }

    // Search by name
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.name = { $regex: req.query.search, $options: 'i' };
      } else {
        // For SQL databases, we'll handle this in the query options
      }
    }

    let roles;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await Role.countDocuments(filters);
      roles = await Role.find(filters)
        .sort({ priority: -1, created_at: -1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [
          ['priority', 'DESC'],
          ['created_at', 'DESC']
        ],
        // Only exclude soft-deleted records if includeDeleted is false
        paranoid: !includeDeleted
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        const { Op } = Role.sequelize;
        queryOptions.where = {
          ...queryOptions.where,
          name: {
            [Op.like]: `%${req.query.search}%`
          }
        };
      }

      console.log('Query options:', JSON.stringify(queryOptions));

      // Use direct SQL query if includeDeleted is true to ensure we get all records
      if (includeDeleted) {
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST || '127.0.0.1',
          user: process.env.DB_USERNAME || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_DATABASE || 'talent_spark'
        });

        // Build WHERE clause based on filters
        let whereClause = '';
        const whereParams = [];

        if (Object.keys(filters).length > 0) {
          whereClause = 'WHERE ';
          const conditions = [];

          if (filters.is_active !== undefined) {
            conditions.push('is_active = ?');
            whereParams.push(filters.is_active ? 1 : 0);
          }

          if (filters.is_system !== undefined) {
            conditions.push('is_system = ?');
            whereParams.push(filters.is_system ? 1 : 0);
          }

          if (filters.branch_id) {
            conditions.push('branch_id = ?');
            whereParams.push(filters.branch_id);
          }

          if (req.query.search) {
            conditions.push('name LIKE ?');
            whereParams.push(`%${req.query.search}%`);
          }

          whereClause += conditions.join(' AND ');
        }

        // Count total records
        const [countResult] = await connection.execute(
          `SELECT COUNT(*) as count FROM roles ${whereClause}`,
          whereParams
        );
        total = countResult[0].count;

        // Get paginated records
        const [rolesResult] = await connection.execute(
          `SELECT * FROM roles ${whereClause} ORDER BY priority DESC, created_at DESC LIMIT ? OFFSET ?`,
          [...whereParams, limit, offset]
        );

        roles = rolesResult;

        // Close the connection
        await connection.end();
      } else {
        const result = await Role.findAndCountAll(queryOptions);
        roles = result.rows;
        total = result.count;
      }
    }

    res.status(200).json({
      success: true,
      data: roles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message
    });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const id = req.params.id;
    let role;

    if (dbType === 'mongodb') {
      // For MongoDB, explicitly exclude soft-deleted records
      role = await Role.findOne({
        _id: id,
        deleted_at: null
      });
    } else {
      // For SQL databases, use paranoid: true to exclude soft-deleted records
      role = await Role.findByPk(parseInt(id), {
        paranoid: true // This will exclude soft-deleted records
      });
    }

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role',
      error: error.message
    });
  }
};

// Create new role
exports.createRole = async (req, res) => {
  try {
    const {
      name, slug, description, branch_id, is_system,
      priority, is_active, created_by
    } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Role name and slug are required'
      });
    }

    let newRole;

    if (dbType === 'mongodb') {
      newRole = new Role({
        name, slug, description, branch_id, is_system,
        priority, is_active, created_by
      });
      await newRole.save();
    } else {
      newRole = await Role.create({
        name, slug, description, branch_id, is_system,
        priority, is_active, created_by
      });
    }

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: newRole
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message
    });
  }
};

// Update role
exports.updateRole = async (req, res) => {
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

    let role;
    let updatedRole;

    if (dbType === 'mongodb') {
      role = await Role.findById(id);

      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      // Check if it's a system role and prevent modification
      if (role.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System roles cannot be modified'
        });
      }

      updatedRole = await Role.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );
    } else {
      role = await Role.findByPk(parseInt(id));

      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      // Check if it's a system role and prevent modification
      if (role.is_system) {
        return res.status(403).json({
          success: false,
          message: 'System roles cannot be modified'
        });
      }

      await role.update(updateData);
      updatedRole = await Role.findByPk(parseInt(id));
    }

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRole
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message
    });
  }
};

// Delete role (simplest possible implementation)
exports.deleteRole = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Attempting to delete role with ID: ${id}`);

    // Skip all checks and just delete directly
    const mysql = require('mysql2/promise');

    // Create a connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'talent_spark'
    });

    console.log('Connected to MySQL database');

    // Execute the delete query
    const [result] = await connection.execute(
      'DELETE FROM roles WHERE id = ?',
      [id]
    );

    console.log('Delete result:', result);

    // Close the connection
    await connection.end();

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
      result: result
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message
    });
  }
};


