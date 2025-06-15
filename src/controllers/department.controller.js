const Department = require('../models/department.model');
const Branch = require('../models/branch.model');
const { dbType, Sequelize } = require('../config/database');
const { Op } = Sequelize || {};

// Get all departments with pagination and filtering
exports.getAllDepartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.branch_id) {
      filters.branch_id = parseInt(req.query.branch_id);
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

    let departments;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await Department.countDocuments(filters);
      departments = await Department.find(filters)
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
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          }
        ]
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { name: { [Op.like]: `%${req.query.search}%` } },
            { short_code: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }

      const result = await Department.findAndCountAll(queryOptions);
      departments = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: departments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const id = req.params.id;
    let department;

    if (dbType === 'mongodb') {
      department = await Department.findById(id);
    } else {
      department = await Department.findByPk(parseInt(id), {
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          }
        ]
      });
    }

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department',
      error: error.message
    });
  }
};

// Get departments by branch ID
exports.getDepartmentsByBranchId = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    
    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: 'Branch ID is required'
      });
    }

    // Check if branch exists
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = { branch_id: branchId };
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
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

    let departments;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await Department.countDocuments(filters);
      departments = await Department.find(filters)
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
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          }
        ]
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { name: { [Op.like]: `%${req.query.search}%` } },
            { short_code: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }

      const result = await Department.findAndCountAll(queryOptions);
      departments = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: departments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching departments by branch ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments by branch ID',
      error: error.message
    });
  }
};

// Create new department
exports.createDepartment = async (req, res) => {
  try {
    const {
      name, branch_id, short_code, description, is_active, created_by
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Department name is required'
      });
    }

    if (!created_by) {
      return res.status(400).json({
        success: false,
        message: 'Created by is required'
      });
    }

    // Check if branch exists if branch_id is provided
    if (branch_id) {
      const branch = await Branch.findByPk(branch_id);
      if (!branch) {
        return res.status(400).json({
          success: false,
          message: 'Branch not found'
        });
      }
    }

    // Check if department with same name already exists in the branch
    let existingDepartment;
    if (dbType === 'mongodb') {
      existingDepartment = await Department.findOne({
        name,
        branch_id: branch_id || null
      });
    } else {
      existingDepartment = await Department.findOne({
        where: {
          name,
          branch_id: branch_id || null
        }
      });
    }

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name already exists in the branch'
      });
    }

    let newDepartment;

    if (dbType === 'mongodb') {
      newDepartment = new Department({
        name, branch_id, short_code, description, is_active, created_by
      });
      await newDepartment.save();
    } else {
      newDepartment = await Department.create({
        name, branch_id, short_code, description, is_active, created_by
      });
    }

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: newDepartment
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create department',
      error: error.message
    });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;

    let department;
    let updatedDepartment;

    if (dbType === 'mongodb') {
      department = await Department.findById(id);

      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      // Check if department with same name already exists in the branch
      if (updateData.name && (updateData.branch_id !== undefined || department.branch_id !== undefined)) {
        const branchId = updateData.branch_id !== undefined ? updateData.branch_id : department.branch_id;

        const existingDepartment = await Department.findOne({
          name: updateData.name,
          branch_id: branchId,
          _id: { $ne: id }
        });

        if (existingDepartment) {
          return res.status(400).json({
            success: false,
            message: 'Department with this name already exists in the branch'
          });
        }
      }

      // Update the department
      updatedDepartment = await Department.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );

      // If branch_id exists, try to get branch info
      if (updatedDepartment.branch_id) {
        try {
          const branch = await Branch.findById(updatedDepartment.branch_id);
          if (branch) {
            updatedDepartment = updatedDepartment.toObject();
            updatedDepartment.Branch = {
              id: branch._id,
              name: branch.name
            };
          }
        } catch (branchError) {
          console.error('Error fetching branch for department:', branchError);
          // Continue without branch info
        }
      }
    } else {
      department = await Department.findByPk(parseInt(id));

      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      // Check if department with same name already exists in the branch
      if (updateData.name !== undefined || updateData.branch_id !== undefined) {
        const name = updateData.name || department.name;
        const branch_id = updateData.branch_id !== undefined ? updateData.branch_id : department.branch_id;

        const existingDepartment = await Department.findOne({
          where: {
            name,
            branch_id: branch_id || null,
            id: { [Op.ne]: parseInt(id) }
          }
        });

        if (existingDepartment) {
          return res.status(400).json({
            success: false,
            message: 'Department with this name already exists in the branch'
          });
        }
      }

      await department.update(updateData);
      updatedDepartment = await Department.findByPk(parseInt(id), {
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update department',
      error: error.message
    });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    let department;

    if (dbType === 'mongodb') {
      department = await Department.findById(id);

      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      await Department.findByIdAndDelete(id);
    } else {
      department = await Department.findByPk(parseInt(id));

      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      await department.destroy();
    }

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete department',
      error: error.message
    });
  }
};
