const Designation = require('../models/designation.model');
const Branch = require('../models/branch.model');
const { dbType, Sequelize } = require('../config/database');
const { Op } = Sequelize || {};

// Get all designations with pagination and filtering
exports.getAllDesignations = async (req, res) => {
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

    let designations;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await Designation.countDocuments(filters);
      designations = await Designation.find(filters)
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

      const result = await Designation.findAndCountAll(queryOptions);
      designations = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: designations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching designations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch designations',
      error: error.message
    });
  }
};

// Get designation by ID
exports.getDesignationById = async (req, res) => {
  try {
    const id = req.params.id;
    let designation;

    if (dbType === 'mongodb') {
      designation = await Designation.findById(id);
    } else {
      designation = await Designation.findByPk(parseInt(id), {
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          }
        ]
      });
    }

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: 'Designation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: designation
    });
  } catch (error) {
    console.error('Error fetching designation by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch designation',
      error: error.message
    });
  }
};

// Create new designation
exports.createDesignation = async (req, res) => {
  try {
    const {
      name, branch_id, short_code, description, is_active, created_by
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Designation name is required'
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

    // Check if designation with same name already exists in the branch
    let existingDesignation;
    if (dbType === 'mongodb') {
      existingDesignation = await Designation.findOne({
        name,
        branch_id: branch_id || null
      });
    } else {
      existingDesignation = await Designation.findOne({
        where: {
          name,
          branch_id: branch_id || null
        }
      });
    }

    if (existingDesignation) {
      return res.status(400).json({
        success: false,
        message: 'Designation with this name already exists in the branch'
      });
    }

    let newDesignation;

    if (dbType === 'mongodb') {
      newDesignation = new Designation({
        name, branch_id, short_code, description, is_active, created_by
      });
      await newDesignation.save();
    } else {
      newDesignation = await Designation.create({
        name, branch_id, short_code, description, is_active, created_by
      });
    }

    res.status(201).json({
      success: true,
      message: 'Designation created successfully',
      data: newDesignation
    });
  } catch (error) {
    console.error('Error creating designation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create designation',
      error: error.message
    });
  }
};

// Update designation
exports.updateDesignation = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;

    let designation;
    let updatedDesignation;

    if (dbType === 'mongodb') {
      designation = await Designation.findById(id);

      if (!designation) {
        return res.status(404).json({
          success: false,
          message: 'Designation not found'
        });
      }

      // Check if designation with same name already exists in the branch
      if (updateData.name && (updateData.branch_id !== undefined || designation.branch_id !== undefined)) {
        const branchId = updateData.branch_id !== undefined ? updateData.branch_id : designation.branch_id;

        const existingDesignation = await Designation.findOne({
          name: updateData.name,
          branch_id: branchId,
          _id: { $ne: id }
        });

        if (existingDesignation) {
          return res.status(400).json({
            success: false,
            message: 'Designation with this name already exists in the branch'
          });
        }
      }

      // Update the designation
      updatedDesignation = await Designation.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );

      // If branch_id exists, try to get branch info
      if (updatedDesignation.branch_id) {
        try {
          const branch = await Branch.findById(updatedDesignation.branch_id);
          if (branch) {
            updatedDesignation = updatedDesignation.toObject();
            updatedDesignation.Branch = {
              id: branch._id,
              name: branch.name
            };
          }
        } catch (branchError) {
          console.error('Error fetching branch for designation:', branchError);
          // Continue without branch info
        }
      }
    } else {
      designation = await Designation.findByPk(parseInt(id));

      if (!designation) {
        return res.status(404).json({
          success: false,
          message: 'Designation not found'
        });
      }

      // Check if designation with same name already exists in the branch
      if (updateData.name !== undefined || updateData.branch_id !== undefined) {
        const name = updateData.name || designation.name;
        const branch_id = updateData.branch_id !== undefined ? updateData.branch_id : designation.branch_id;

        const existingDesignation = await Designation.findOne({
          where: {
            name,
            branch_id: branch_id || null,
            id: { [Op.ne]: parseInt(id) }
          }
        });

        if (existingDesignation) {
          return res.status(400).json({
            success: false,
            message: 'Designation with this name already exists in the branch'
          });
        }
      }

      await designation.update(updateData);
      updatedDesignation = await Designation.findByPk(parseInt(id), {
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
      message: 'Designation updated successfully',
      data: updatedDesignation
    });
  } catch (error) {
    console.error('Error updating designation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update designation',
      error: error.message
    });
  }
};

// Delete designation
exports.deleteDesignation = async (req, res) => {
  try {
    const id = req.params.id;
    let designation;

    if (dbType === 'mongodb') {
      designation = await Designation.findById(id);

      if (!designation) {
        return res.status(404).json({
          success: false,
          message: 'Designation not found'
        });
      }

      await Designation.findByIdAndDelete(id);
    } else {
      designation = await Designation.findByPk(parseInt(id));

      if (!designation) {
        return res.status(404).json({
          success: false,
          message: 'Designation not found'
        });
      }

      await designation.destroy();
    }

    res.status(200).json({
      success: true,
      message: 'Designation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting designation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete designation',
      error: error.message
    });
  }
};
