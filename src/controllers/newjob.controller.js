const NewJob = require('../models/newjob.model');
const Department = require('../models/department.model');
const Employee = require('../models/employee.model');
const { dbType, Sequelize, sequelize } = require('../config/database');

// Get all jobs with pagination and filtering
exports.getAllNewJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.department_id) {
      filters.department_id = parseInt(req.query.department_id);
    }
    if (req.query.priority) {
      filters.priority = req.query.priority;
    }
    if (req.query.assigned_to_employee_id) {
      filters.assigned_to_employee_id = parseInt(req.query.assigned_to_employee_id);
    }
    if (req.query.is_remote !== undefined) {
      filters.is_remote = req.query.is_remote === 'true';
    }
    if (req.query.employment_type) {
      filters.employment_type = req.query.employment_type;
    }

    // Search by job title
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.$or = [
          { job_title: { $regex: req.query.search, $options: 'i' } },
          { job_description: { $regex: req.query.search, $options: 'i' } }
        ];
      } else {
        // For SQL databases, we'll handle this in the query options
      }
    }

    let jobs;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await NewJob.countDocuments(filters);
      jobs = await NewJob.find(filters)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit)
        .populate('department_id', 'name')
        .populate('assigned_to_employee_id', 'first_name last_name');
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,        limit,
        offset,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: Department,
            as: 'Department',
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Employee,
            as: 'AssignedEmployee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        const Op = Sequelize.Op;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { job_title: { [Op.like]: `%${req.query.search}%` } },
            { job_description: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }

      const result = await NewJob.findAndCountAll(queryOptions);
      jobs = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// Get job by ID
exports.getNewJobById = async (req, res) => {
  try {
    const id = req.params.id;
    let job;

    if (dbType === 'mongodb') {
      job = await NewJob.findOne({ job_id: parseInt(id) })
        .populate('department_id', 'name')
        .populate('assigned_to_employee_id', 'first_name last_name');
    } else {      job = await NewJob.findByPk(parseInt(id), {
        include: [
          {
            model: Department,
            as: 'Department',
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Employee,
            as: 'AssignedEmployee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// Create new job
exports.createNewJob = async (req, res) => {
  try {
    const {
      job_title, job_description, department_id, status, priority,
      assigned_to_employee_id, min_salary, max_salary, employment_type,
      application_deadline, is_remote, client_budget_hourly,
      internal_budget_hourly, candidate_split_percentage,
      company_split_percentage, requirements, responsibilities, benefits
    } = req.body;

    // Validate required fields
    if (!job_title || !job_description || !department_id || !employment_type) {
      return res.status(400).json({
        success: false,
        message: 'Job title, description, department ID, and employment type are required'
      });
    }

    // Check if department exists
    const department = await Department.findByPk(department_id);
    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if assigned employee exists if provided
    if (assigned_to_employee_id) {
      const employee = await Employee.findByPk(assigned_to_employee_id);
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Assigned employee not found'
        });
      }
    }

    let newJob;

    if (dbType === 'mongodb') {
      // Get the next job_id
      const maxJobDoc = await NewJob.findOne().sort('-job_id');
      const nextJobId = maxJobDoc ? maxJobDoc.job_id + 1 : 1;

      newJob = new NewJob({
        job_id: nextJobId,
        job_title,
        job_description,
        department_id,
        status: status || 'Draft',
        priority: priority || 'Medium',
        assigned_to_employee_id,
        min_salary,
        max_salary,
        employment_type,
        application_deadline,
        is_remote: is_remote || false,
        client_budget_hourly,
        internal_budget_hourly,
        candidate_split_percentage,
        company_split_percentage,
        requirements,
        responsibilities,
        benefits
      });

      await newJob.save();
      
      // Populate the relationships
      newJob = await NewJob.findOne({ job_id: newJob.job_id })
        .populate('department_id', 'name')
        .populate('assigned_to_employee_id', 'first_name last_name');
    } else {
      newJob = await NewJob.create({
        job_title,
        job_description,
        department_id,
        status: status || 'Draft',
        priority: priority || 'Medium',
        assigned_to_employee_id,
        min_salary,
        max_salary,
        employment_type,
        application_deadline,
        is_remote: is_remote || false,
        client_budget_hourly,
        internal_budget_hourly,
        candidate_split_percentage,
        company_split_percentage,
        requirements,
        responsibilities,
        benefits
      });      // Fetch the job with relations
      newJob = await NewJob.findByPk(newJob.job_id, {
        include: [
          {
            model: Department,
            as: 'Department',
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Employee,
            as: 'AssignedEmployee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// Update job
exports.updateNewJob = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // Remove the job_id from updateData if it exists
    delete updateData.job_id;

    let job;
    let updatedJob;

    if (dbType === 'mongodb') {
      job = await NewJob.findOne({ job_id: parseInt(id) });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Check if department exists if being updated
      if (updateData.department_id) {
        const department = await Department.findByPk(updateData.department_id);
        if (!department) {
          return res.status(400).json({
            success: false,
            message: 'Department not found'
          });
        }
      }

      // Check if assigned employee exists if being updated
      if (updateData.assigned_to_employee_id) {
        const employee = await Employee.findByPk(updateData.assigned_to_employee_id);
        if (!employee) {
          return res.status(400).json({
            success: false,
            message: 'Assigned employee not found'
          });
        }
      }

      updatedJob = await NewJob.findOneAndUpdate(
        { job_id: parseInt(id) },
        updateData,
        { new: true }
      ).populate('department_id', 'name')
        .populate('assigned_to_employee_id', 'first_name last_name');
    } else {
      job = await NewJob.findByPk(parseInt(id));

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Check if department exists if being updated
      if (updateData.department_id) {
        const department = await Department.findByPk(updateData.department_id);
        if (!department) {
          return res.status(400).json({
            success: false,
            message: 'Department not found'
          });
        }
      }

      // Check if assigned employee exists if being updated
      if (updateData.assigned_to_employee_id) {
        const employee = await Employee.findByPk(updateData.assigned_to_employee_id);
        if (!employee) {
          return res.status(400).json({
            success: false,
            message: 'Assigned employee not found'
          });
        }
      }

      await job.update(updateData);
        updatedJob = await NewJob.findByPk(parseInt(id), {
        include: [
          {
            model: Department,
            as: 'Department',
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Employee,
            as: 'AssignedEmployee',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// Delete job
exports.deleteNewJob = async (req, res) => {
  try {
    const id = req.params.id;
    let job;

    if (dbType === 'mongodb') {
      job = await NewJob.findOne({ job_id: parseInt(id) });
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      await NewJob.deleteOne({ job_id: parseInt(id) });
    } else {
      job = await NewJob.findByPk(parseInt(id));
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      await job.destroy();
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};
