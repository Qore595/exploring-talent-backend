const EmployeeInterviewScreening = require('../models/employee_interview_screening.model');
const Employee = require('../models/employee.model');
const Department = require('../models/department.model');
const Branch = require('../models/branch.model');
const Designation = require('../models/designation.model');
const { dbType, Sequelize } = require('../config/database');

// Get all employee interview screenings with pagination and filtering
exports.getAllScreenings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.callid) {
      filters.callid = req.query.callid;
    }
    if (req.query.userid) {
      filters.userid = req.query.userid;
    }
    // Add filters for job_id and status
    if (req.query.job_id) {
      filters.job_id = req.query.job_id;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }

    let screenings, total;

    if (dbType === 'mongodb') {
      // MongoDB implementation
      const query = {};
      
      // Apply filters
      if (req.query.callid) {
        query.callid = new RegExp(req.query.callid, 'i');
      }
      if (req.query.userid) {
        query.userid = new RegExp(req.query.userid, 'i');
      }
      if (req.query.job_id) {
        query.job_id = new RegExp(req.query.job_id, 'i');
      }
      if (req.query.status) {
        query.status = new RegExp(req.query.status, 'i');
      }      // Add search functionality
      if (req.query.search) {
        query.$or = [
          { callid: new RegExp(req.query.search, 'i') },
          { userid: new RegExp(req.query.search, 'i') },
          { job_id: new RegExp(req.query.search, 'i') },
          { status: new RegExp(req.query.search, 'i') }
        ];
      }

      total = await EmployeeInterviewScreening.countDocuments(query);
      screenings = await EmployeeInterviewScreening.find(query)
        .sort({ created: -1 })
        .skip(offset)
        .limit(limit);
    } else {
      // SQL implementation
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['created', 'DESC']]
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        const Op = Sequelize.Op;
        queryOptions.where = {
          ...queryOptions.where,          [Op.or]: [
            { callid: { [Op.like]: `%${req.query.search}%` } },
            { userid: { [Op.like]: `%${req.query.search}%` } },
            { job_id: { [Op.like]: `%${req.query.search}%` } },
            { status: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }

      const result = await EmployeeInterviewScreening.findAndCountAll(queryOptions);
      screenings = result.rows;
      total = result.count;
    }

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: screenings,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching screenings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screenings',
      error: error.message
    });
  }
};

// Get single screening by ID
exports.getScreeningById = async (req, res) => {
  try {
    const { id } = req.params;
    let screening;

    if (dbType === 'mongodb') {
      screening = await EmployeeInterviewScreening.findById(id);
    } else {
      screening = await EmployeeInterviewScreening.findByPk(parseInt(id));
    }

    if (!screening) {
      return res.status(404).json({
        success: false,
        message: 'Screening not found'
      });
    }

    res.status(200).json({
      success: true,
      data: screening
    });
  } catch (error) {
    console.error('Error fetching screening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screening',
      error: error.message
    });
  }
};

// Create new screening or update existing if userid exists
exports.createScreening = async (req, res) => {
  try {
    const { callid, userid, joinurl, job_id, status } = req.body;

    // Basic validation
    if (!callid && !userid && !joinurl) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (callid, userid, or joinurl) is required'
      });
    }
    
    // Validate status if provided
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let screening;
    let isUpdate = false;
    
    if (dbType === 'mongodb') {
      // Check if both userid and job_id exist
      if (userid && job_id) {
        const existingScreening = await EmployeeInterviewScreening.findOne({ userid, job_id });
        
        if (existingScreening) {
          // Update existing record when both userid and job_id match
          const updateData = {};
          if (callid !== undefined) updateData.callid = callid;
          if (joinurl !== undefined) updateData.joinurl = joinurl;
          if (status !== undefined) updateData.status = status;
          updateData.updated = new Date();

          screening = await EmployeeInterviewScreening.findOneAndUpdate(
            { userid, job_id },
            updateData,
            { new: true, runValidators: true }
          );
          isUpdate = true;
        } else {
          // Create new record
          screening = new EmployeeInterviewScreening({
            callid,
            userid,
            joinurl,
            job_id,
            status: status || 'pending',
            created: new Date(),
            updated: new Date()
          });
          await screening.save();
        }
      } else if (userid) {
        // Check if record exists with just userid when job_id is not provided
        const existingUserScreening = await EmployeeInterviewScreening.findOne({ userid });
        
        if (existingUserScreening) {
          // Update existing record when only userid matches
          const updateData = {};
          if (callid !== undefined) updateData.callid = callid;
          if (joinurl !== undefined) updateData.joinurl = joinurl;
          if (job_id !== undefined) updateData.job_id = job_id; 
          if (status !== undefined) updateData.status = status;
          updateData.updated = new Date();

          screening = await EmployeeInterviewScreening.findOneAndUpdate(
            { userid },
            updateData,
            { new: true, runValidators: true }
          );          isUpdate = true;
        } else {
          // Create new record
          screening = new EmployeeInterviewScreening({
            callid,
            userid,
            joinurl,
            job_id,
            status: status || 'pending',
            created: new Date(),
            updated: new Date()
          });
          await screening.save();
        }
      } else {
        // Create new record when no userid provided
        screening = new EmployeeInterviewScreening({
          callid,
          userid,
          joinurl,
          job_id,
          status: status || 'pending',
          created: new Date(),
          updated: new Date()
        });
        await screening.save();
      }    } else {
      // SQL implementation
      if (userid && job_id) {
        const existingScreening = await EmployeeInterviewScreening.findOne({
          where: { userid, job_id }
        });

        if (existingScreening) {
          // Update existing record when both userid and job_id match
          const updateData = {};
          if (callid !== undefined) updateData.callid = callid;
          if (joinurl !== undefined) updateData.joinurl = joinurl;
          if (status !== undefined) updateData.status = status;
          updateData.updated = new Date();

          await existingScreening.update(updateData);
          screening = existingScreening;
          isUpdate = true;
        } else {
          // Create new record
          screening = await EmployeeInterviewScreening.create({
            callid,
            userid,
            joinurl,
            job_id,
            status: status || 'pending'
          });
        }
      } else if (userid) {
        // Check if record exists with just userid when job_id is not provided
        const existingUserScreening = await EmployeeInterviewScreening.findOne({
          where: { userid }
        });
        
        if (existingUserScreening) {
          // Update existing record when only userid matches
          const updateData = {};
          if (callid !== undefined) updateData.callid = callid;
          if (joinurl !== undefined) updateData.joinurl = joinurl;
          if (job_id !== undefined) updateData.job_id = job_id;
          if (status !== undefined) updateData.status = status;
          updateData.updated = new Date();

          await existingUserScreening.update(updateData);
          screening = existingUserScreening;
          isUpdate = true;
        } else {
          // Create new record
          screening = await EmployeeInterviewScreening.create({
            callid,
            userid,
            joinurl,
            job_id,
            status: status || 'pending'
          });
        }
      } else {
        // Create new record when no userid provided
        screening = await EmployeeInterviewScreening.create({
          callid,
          userid,
          joinurl,
          job_id,
          status: status || 'pending'
        });
      }
    }

    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate ? 'Screening updated successfully' : 'Screening created successfully',
      data: screening,
      action: isUpdate ? 'updated' : 'created'
    });
  } catch (error) {
    console.error('Error creating/updating screening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create or update screening',
      error: error.message
    });
  }
};

// Update screening
exports.updateScreening = async (req, res) => {
  try {
    const { id } = req.params;
    const { callid, userid, joinurl, job_id, status } = req.body;

    // Validate status if provided
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let screening;

    if (dbType === 'mongodb') {
      const updateData = {};
      if (callid !== undefined) updateData.callid = callid;
      if (userid !== undefined) updateData.userid = userid;
      if (joinurl !== undefined) updateData.joinurl = joinurl;
      if (job_id !== undefined) updateData.job_id = job_id;
      if (status !== undefined) updateData.status = status;
      updateData.updated = new Date();

      screening = await EmployeeInterviewScreening.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      screening = await EmployeeInterviewScreening.findByPk(parseInt(id));
      
      if (!screening) {
        return res.status(404).json({
          success: false,
          message: 'Screening not found'
        });
      }      const updateData = {};
      if (callid !== undefined) updateData.callid = callid;
      if (userid !== undefined) updateData.userid = userid;
      if (joinurl !== undefined) updateData.joinurl = joinurl;
      if (job_id !== undefined) updateData.job_id = job_id;
      if (status !== undefined) updateData.status = status;
      updateData.updated = new Date();

      await screening.update(updateData);
    }

    if (!screening) {
      return res.status(404).json({
        success: false,
        message: 'Screening not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Screening updated successfully',
      data: screening
    });
  } catch (error) {
    console.error('Error updating screening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update screening',
      error: error.message
    });
  }
};

// Delete screening
exports.deleteScreening = async (req, res) => {
  try {
    const { id } = req.params;
    let screening;

    if (dbType === 'mongodb') {
      screening = await EmployeeInterviewScreening.findByIdAndDelete(id);
    } else {
      screening = await EmployeeInterviewScreening.findByPk(parseInt(id));
      if (screening) {
        await screening.destroy();
      }
    }

    if (!screening) {
      return res.status(404).json({
        success: false,
        message: 'Screening not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Screening deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting screening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete screening',
      error: error.message
    });
  }
};

// Get screenings by call ID
exports.getScreeningsByCallId = async (req, res) => {
  try {
    const { callid } = req.params;
    let screenings;

    if (dbType === 'mongodb') {
      screenings = await EmployeeInterviewScreening.find({ callid })
        .sort({ created: -1 });
    } else {
      screenings = await EmployeeInterviewScreening.findAll({
        where: { callid },
        order: [['created', 'DESC']]
      });
    }

    res.status(200).json({
      success: true,
      data: screenings,
      count: screenings.length
    });
  } catch (error) {
    console.error('Error fetching screenings by call ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screenings by call ID',
      error: error.message
    });
  }
};

// Get screenings by user ID
exports.getScreeningsByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    let screenings;

    if (dbType === 'mongodb') {
      screenings = await EmployeeInterviewScreening.find({ userid })
        .sort({ created: -1 });
    } else {
      screenings = await EmployeeInterviewScreening.findAll({
        where: { userid },
        order: [['created', 'DESC']]
      });
    }    res.status(200).json({
      success: true,
      data: screenings,
      count: screenings.length
    });
  } catch (error) {
    console.error('Error fetching screenings by user ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screenings by user ID',
      error: error.message
    });
  }
};

// Get screenings by job ID
exports.getScreeningsByJobId = async (req, res) => {
  try {
    const { job_id } = req.params;
    let screenings;

    if (dbType === 'mongodb') {
      screenings = await EmployeeInterviewScreening.find({ job_id })
        .sort({ created: -1 });
    } else {
      screenings = await EmployeeInterviewScreening.findAll({
        where: { job_id },
        order: [['created', 'DESC']]
      });
    }

    res.status(200).json({
      success: true,
      data: screenings,
      count: screenings.length    });
  } catch (error) {
    console.error('Error fetching screenings by job ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screenings by job ID',
      error: error.message
    });
  }
};

// Get screenings by status
exports.getScreeningsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let screenings;

    if (dbType === 'mongodb') {
      screenings = await EmployeeInterviewScreening.find({ status })
        .sort({ created: -1 });
    } else {
      screenings = await EmployeeInterviewScreening.findAll({
        where: { status },
        order: [['created', 'DESC']]
      });
    }

    res.status(200).json({
      success: true,
      data: screenings,
      count: screenings.length    });
  } catch (error) {
    console.error('Error fetching screenings by status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screenings by status',
      error: error.message
    });
  }
};

// Get all screenings with employee details
exports.getAllScreeningsWithEmployeeDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    let mongoQuery = {};
    
    if (req.query.callid) {
      if (dbType === 'mongodb') {
        mongoQuery.callid = req.query.callid;
      } else {
        filters.callid = req.query.callid;
      }
    }
    
    if (req.query.userid) {
      if (dbType === 'mongodb') {
        mongoQuery.userid = req.query.userid;
      } else {
        filters.userid = req.query.userid;
      }
    }
    
    if (req.query.job_id) {
      if (dbType === 'mongodb') {
        mongoQuery.job_id = parseInt(req.query.job_id);
      } else {
        filters.job_id = parseInt(req.query.job_id);
      }
    }
    
    if (req.query.status) {
      if (dbType === 'mongodb') {
        mongoQuery.status = req.query.status;
      } else {
        filters.status = req.query.status;
      }
    }

    let screenings, total;
    let result = [];
    const Op = Sequelize.Op;

    if (dbType === 'mongodb') {
      // MongoDB implementation
      total = await EmployeeInterviewScreening.countDocuments(mongoQuery);
      screenings = await EmployeeInterviewScreening.find(mongoQuery)
        .sort({ created: -1 })
        .skip(offset)
        .limit(limit);
        
      // Fetch employee details for each screening
      for (const screening of screenings) {
        let employeeDetails = null;
        if (screening.userid) {          // Try to find employee by either id or employee_id
          employeeDetails = await Employee.findOne({ 
            $or: [
              { _id: screening.userid }, 
              { employee_id: screening.userid }
            ]
          });
          
          // If employee is found, get their department, branch, and designation details
          if (employeeDetails) {
            // Get department details
            if (employeeDetails.department_id) {
              const department = await Department.findById(employeeDetails.department_id);
              if (department) {
                employeeDetails = employeeDetails.toObject();
                employeeDetails.Department = {
                  id: department._id,
                  name: department.name,
                  short_code: department.short_code,
                  description: department.description
                };
              }
            }
            
            // Get branch details
            if (employeeDetails.branch_id) {
              const branch = await Branch.findById(employeeDetails.branch_id);
              if (branch) {
                if (!employeeDetails.toObject) {
                  employeeDetails = employeeDetails.toObject();
                }
                employeeDetails.Branch = {
                  id: branch._id,
                  name: branch.name,
                  code: branch.code,
                  city: branch.city,
                  state: branch.state,
                  country: branch.country
                };
              }
            }
            
            // Get designation details
            if (employeeDetails.designation_id) {
              const designation = await Designation.findById(employeeDetails.designation_id);
              if (designation) {
                if (!employeeDetails.toObject) {
                  employeeDetails = employeeDetails.toObject();
                }
                employeeDetails.Designation = {
                  id: designation._id,
                  name: designation.name,
                  short_code: designation.short_code,
                  description: designation.description
                };
              }
            }
          }
        }
        
        result.push({
          ...screening.toObject(),
          employee: employeeDetails ? employeeDetails.toObject() : null
        });
      }
    } else {
      // SQL implementation with optimized query - manual join approach
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['created', 'DESC']]
      };
      
      // Add search functionality for SQL databases
      if (req.query.search) {
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { callid: { [Op.like]: `%${req.query.search}%` } },
            { userid: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
        
        // Add numeric fields with different comparison
        if (!isNaN(parseInt(req.query.search))) {
          const numericSearch = parseInt(req.query.search);
          queryOptions.where[Op.or].push({ job_id: numericSearch });
        }
      }
      
      const { rows, count } = await EmployeeInterviewScreening.findAndCountAll(queryOptions);
      screenings = rows;
      total = count;      // Fetch employee details for each screening with manual join
      for (const screening of screenings) {
        let employeeDetails = null;
        if (screening.userid) {
          // Try to find employee by either numeric id or string employee_id
          const employeeQuery = {
            where: {
              [Op.or]: []
            },
            // Include department, branch, and designation
            include: [
              {
                model: Department,
                attributes: ['id', 'name', 'short_code', 'description'],
                required: false
              },
              {
                model: Branch,
                attributes: ['id', 'name', 'code', 'address', 'city', 'state', 'country'],
                required: false
              },
              {
                model: Designation,
                attributes: ['id', 'name', 'short_code', 'description'],
                required: false
              }
            ]
          };
          
          // Check if userid could be a number (employee.id)
          if (!isNaN(parseInt(screening.userid))) {
            employeeQuery.where[Op.or].push({ id: parseInt(screening.userid) });
          }
          
          // Always try employee_id match (string)
          employeeQuery.where[Op.or].push({ employee_id: screening.userid });
          
          employeeDetails = await Employee.findOne(employeeQuery);
        }
        
        result.push({
          ...screening.toJSON(),
          employee: employeeDetails ? employeeDetails.toJSON() : null
        });
      }
    }

    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching screenings with employee details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screenings with employee details',
      error: error.message
    });
  }
};

// Get screening with employee details by ID
exports.getScreeningWithEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let screening;
    let employeeDetails;
    const Op = Sequelize.Op;

    if (dbType === 'mongodb') {
      // MongoDB implementation
      screening = await EmployeeInterviewScreening.findById(id);
      
      if (!screening) {
        return res.status(404).json({
          success: false,
          message: 'Screening not found'
        });
      }
      
      if (screening.userid) {        // Try to find the employee by either id or employee_id
        employeeDetails = await Employee.findOne({ 
          $or: [
            { _id: screening.userid },
            { employee_id: screening.userid }
          ]
        });
        
        // If employee is found, get their department, branch, and designation details
        if (employeeDetails) {
          // Get department details
          if (employeeDetails.department_id) {
            const department = await Department.findById(employeeDetails.department_id);
            if (department) {
              employeeDetails = employeeDetails.toObject();
              employeeDetails.Department = {
                id: department._id,
                name: department.name,
                short_code: department.short_code,
                description: department.description
              };
            }
          }
          
          // Get branch details
          if (employeeDetails.branch_id) {
            const branch = await Branch.findById(employeeDetails.branch_id);
            if (branch) {
              if (!employeeDetails.toObject) {
                employeeDetails = employeeDetails.toObject();
              }
              employeeDetails.Branch = {
                id: branch._id,
                name: branch.name,
                code: branch.code,
                city: branch.city,
                state: branch.state,
                country: branch.country
              };
            }
          }
          
          // Get designation details
          if (employeeDetails.designation_id) {
            const designation = await Designation.findById(employeeDetails.designation_id);
            if (designation) {
              if (!employeeDetails.toObject) {
                employeeDetails = employeeDetails.toObject();
              }
              employeeDetails.Designation = {
                id: designation._id,
                name: designation.name,
                short_code: designation.short_code,
                description: designation.description
              };
            }
          }
        }
      }
      
      const result = {
        ...screening.toObject(),
        employee: employeeDetails ? employeeDetails.toObject() : null
      };
      
      res.status(200).json({
        success: true,
        data: result
      });
    } else {
      // SQL implementation
      screening = await EmployeeInterviewScreening.findByPk(id);
      
      if (!screening) {
        return res.status(404).json({
          success: false,
          message: 'Screening not found'
        });
      }
      
      if (screening.userid) {        // Create query to find employee by id or employee_id
        const employeeQuery = {
          where: {
            [Op.or]: []
          },
          // Include department, branch, and designation
          include: [
            {
              model: Department,
              attributes: ['id', 'name', 'short_code', 'description'],
              required: false
            },
            {
              model: Branch,
              attributes: ['id', 'name', 'code', 'address', 'city', 'state', 'country'],
              required: false
            },
            {
              model: Designation,
              attributes: ['id', 'name', 'short_code', 'description'],
              required: false
            }
          ]
        };
        
        // Check if userid could be a number (employee.id)
        if (!isNaN(parseInt(screening.userid))) {
          employeeQuery.where[Op.or].push({ id: parseInt(screening.userid) });
        }
        
        // Always try employee_id match (string)
        employeeQuery.where[Op.or].push({ employee_id: screening.userid });
        
        employeeDetails = await Employee.findOne(employeeQuery);
      }
      
      res.status(200).json({
        success: true,
        data: {
          ...screening.toJSON(),
          employee: employeeDetails ? employeeDetails.toJSON() : null
        }
      });
    }
  } catch (error) {
    console.error('Error fetching screening with employee details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screening with employee details',
      error: error.message
    });
  }
};
