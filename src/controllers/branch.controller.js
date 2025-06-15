const Branch = require('../models/branch.model');
const { dbType } = require('../config/database');

// Get all branches with pagination and filtering
exports.getAllBranches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.branch_type) {
      filters.branch_type = req.query.branch_type;
    }
    if (req.query.city) {
      filters.city = req.query.city;
    }
    if (req.query.state) {
      filters.state = req.query.state;
    }
    if (req.query.country) {
      filters.country = req.query.country;
    }

    // Search by name
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.name = { $regex: req.query.search, $options: 'i' };
      } else {
        // For SQL databases, we'll handle this in the query options
      }
    }

    let branches;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await Branch.countDocuments(filters);
      branches = await Branch.find(filters)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['created_at', 'DESC']]
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        queryOptions.where = {
          ...queryOptions.where,
          name: {
            [Branch.sequelize.Op.like]: `%${req.query.search}%`
          }
        };
      }

      const result = await Branch.findAndCountAll(queryOptions);
      branches = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: branches,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branches',
      error: error.message
    });
  }
};

// Get branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const id = req.params.id;
    let branch;

    if (dbType === 'mongodb') {
      branch = await Branch.findById(id);
    } else {
      branch = await Branch.findByPk(parseInt(id));
    }

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.status(200).json({
      success: true,
      data: branch
    });
  } catch (error) {
    console.error('Error fetching branch by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branch',
      error: error.message
    });
  }
};

// Create new branch
exports.createBranch = async (req, res) => {
  try {
    const {
      name, code, slug, address, landmark, city, district, state, country,
      postal_code, phone, alt_phone, email, fax, manager_id, description,
      location_lat, location_lng, google_maps_url, working_hours, timezone,
      logo_url, website_url, support_email, support_phone, branch_type,
      opening_date, last_renovated, monthly_rent, owned_or_rented,
      no_of_employees, fire_safety_certified, is_default, is_active, created_by
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Branch name is required'
      });
    }

    if (!created_by) {
      return res.status(400).json({
        success: false,
        message: 'Created by is required'
      });
    }

    let newBranch;

    if (dbType === 'mongodb') {
      newBranch = new Branch({
        name, code, slug, address, landmark, city, district, state, country,
        postal_code, phone, alt_phone, email, fax, manager_id, description,
        location_lat, location_lng, google_maps_url, working_hours, timezone,
        logo_url, website_url, support_email, support_phone, branch_type,
        opening_date, last_renovated, monthly_rent, owned_or_rented,
        no_of_employees, fire_safety_certified, is_default, is_active, created_by
      });
      await newBranch.save();
    } else {
      newBranch = await Branch.create({
        name, code, slug, address, landmark, city, district, state, country,
        postal_code, phone, alt_phone, email, fax, manager_id, description,
        location_lat, location_lng, google_maps_url, working_hours, timezone,
        logo_url, website_url, support_email, support_phone, branch_type,
        opening_date, last_renovated, monthly_rent, owned_or_rented,
        no_of_employees, fire_safety_certified, is_default, is_active, created_by
      });
    }

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: newBranch
    });
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create branch',
      error: error.message
    });
  }
};

// Update branch
exports.updateBranch = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;

    let branch;
    let updatedBranch;

    if (dbType === 'mongodb') {
      branch = await Branch.findById(id);

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }

      updatedBranch = await Branch.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      );
    } else {
      branch = await Branch.findByPk(parseInt(id));

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }

      await branch.update(updateData);
      updatedBranch = await Branch.findByPk(parseInt(id));
    }

    res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: updatedBranch
    });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update branch',
      error: error.message
    });
  }
};

// Delete branch
exports.deleteBranch = async (req, res) => {
  try {
    const id = req.params.id;
    let branch;

    if (dbType === 'mongodb') {
      branch = await Branch.findById(id);

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }

      // Hard delete the branch
      await Branch.findByIdAndDelete(id);
    } else {
      branch = await Branch.findByPk(parseInt(id));

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }

      // Hard delete the branch
      await branch.destroy();
    }

    res.status(200).json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete branch',
      error: error.message
    });
  }
};
