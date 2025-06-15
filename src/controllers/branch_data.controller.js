const Department = require('../models/department.model');
const Designation = require('../models/designation.model');
const Branch = require('../models/branch.model');
const Role = require('../models/role.model');
const { dbType, Sequelize } = require('../config/database');
const { Op } = Sequelize || {};

/**
 * Get departments and designations by branch ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with departments and designations
 */
exports.getDepartmentsAndDesignationsByBranchId = async (req, res) => {
  try {
    const { branchId } = req.params;

    // Validate branch ID
    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: 'Branch ID is required'
      });
    }

    // Check if branch exists
    let branch;
    if (dbType === 'mongodb') {
      branch = await Branch.findById(branchId);
    } else {
      branch = await Branch.findByPk(parseInt(branchId));
    }

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Get departments for the branch
    let departments;
    if (dbType === 'mongodb') {
      departments = await Department.find({
        branch_id: parseInt(branchId),
        is_active: true
      }).sort({ name: 1 });
    } else {
      departments = await Department.findAll({
        where: {
          branch_id: parseInt(branchId),
          is_active: true
        },
        order: [['name', 'ASC']]
      });
    }

    // Get designations for the branch
    let designations;
    if (dbType === 'mongodb') {
      designations = await Designation.find({
        branch_id: parseInt(branchId),
        is_active: true
      }).sort({ name: 1 });
    } else {
      designations = await Designation.findAll({
        where: {
          branch_id: parseInt(branchId),
          is_active: true
        },
        order: [['name', 'ASC']]
      });
    }

    res.status(200).json({
      success: true,
      data: {
        branch: {
          id: branch.id,
          name: branch.name,
          code: branch.code
        },
        departments,
        designations
      }
    });
  } catch (error) {
    console.error('Error fetching departments and designations by branch ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments and designations',
      error: error.message
    });
  }
};

/**
 * Get branch by ID with departments, designations, and roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with branch details, departments, designations, and roles
 */
exports.getBranchWithRelatedData = async (req, res) => {
  try {
    const { branchId } = req.params;

    // Validate branch ID
    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: 'Branch ID is required'
      });
    }

    // Check if branch exists
    let branch;
    if (dbType === 'mongodb') {
      branch = await Branch.findById(branchId);
    } else {
      branch = await Branch.findByPk(parseInt(branchId));
    }

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Get departments for the branch
    let departments;
    if (dbType === 'mongodb') {
      departments = await Department.find({
        branch_id: parseInt(branchId),
        is_active: true
      }).sort({ name: 1 });
    } else {
      departments = await Department.findAll({
        where: {
          branch_id: parseInt(branchId),
          is_active: true
        },
        order: [['name', 'ASC']]
      });
    }

    // Get designations for the branch
    let designations;
    if (dbType === 'mongodb') {
      designations = await Designation.find({
        branch_id: parseInt(branchId),
        is_active: true
      }).sort({ name: 1 });
    } else {
      designations = await Designation.findAll({
        where: {
          branch_id: parseInt(branchId),
          is_active: true
        },
        order: [['name', 'ASC']]
      });
    }

    // Get roles for the branch
    let roles;
    if (dbType === 'mongodb') {
      roles = await Role.find({
        branch_id: parseInt(branchId),
        is_active: true
      }).sort({ name: 1 });
    } else {
      roles = await Role.findAll({
        where: {
          branch_id: parseInt(branchId),
          is_active: true
        },
        order: [['name', 'ASC']]
      });
    }

    // Prepare branch data with all details
    const branchData = {
      id: branch.id,
      name: branch.name,
      code: branch.code,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      country: branch.country,
      postal_code: branch.postal_code,
      phone: branch.phone,
      email: branch.email,
      branch_type: branch.branch_type,
      is_active: branch.is_active,
      created_at: branch.created_at,
      updated_at: branch.updated_at
    };

    res.status(200).json({
      success: true,
      data: {
        branch: branchData,
        departments,
        designations,
        roles
      }
    });
  } catch (error) {
    console.error('Error fetching branch with related data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branch with related data',
      error: error.message
    });
  }
};
