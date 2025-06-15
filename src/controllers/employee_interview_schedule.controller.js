const EmployeeInterviewSchedule = require('../models/employee_interview_schedule.model');
const Employee = require('../models/employee.model');
const Job = require('../models/job.model');
const { dbType } = require('../config/database');

// Get all employee interview schedules with pagination and filtering
exports.getAllEmployeeInterviewSchedules = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      employee_id,
      job_id,
      status,
      decision,
      interview_type,
      scheduled_date_from,
      scheduled_date_to,
      is_active,
      round,
      search
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    let filters = {};
    let mongoQuery = {};
    
    if (employee_id) {
      if (dbType === 'mongodb') {
        mongoQuery.employee_id = parseInt(employee_id);
      } else {
        filters.employee_id = employee_id;
      }
    }
    
    if (job_id) {
      if (dbType === 'mongodb') {
        mongoQuery.job_id = parseInt(job_id);
      } else {
        filters.job_id = job_id;
      }
    }
    
    if (status) {
      if (dbType === 'mongodb') {
        mongoQuery.status = status;
      } else {
        filters.status = status;
      }
    }
    
    if (decision) {
      if (dbType === 'mongodb') {
        mongoQuery.decision = decision;
      } else {
        filters.decision = decision;
      }
    }
    
    if (interview_type) {
      if (dbType === 'mongodb') {
        mongoQuery.interview_type = interview_type;
      } else {
        filters.interview_type = interview_type;
      }
    }
    
    if (round) {
      if (dbType === 'mongodb') {
        mongoQuery.round = parseInt(round);
      } else {
        filters.round = round;
      }
    }
    
    if (is_active !== undefined) {
      const isActive = is_active === 'true';
      if (dbType === 'mongodb') {
        mongoQuery.is_active = isActive;
      } else {
        filters.is_active = isActive;
      }
    }
    
    // Date range filtering
    if (scheduled_date_from || scheduled_date_to) {
      if (dbType === 'mongodb') {
        mongoQuery.scheduled_date = {};
        if (scheduled_date_from) {
          mongoQuery.scheduled_date.$gte = new Date(scheduled_date_from);
        }
        if (scheduled_date_to) {
          mongoQuery.scheduled_date.$lte = new Date(scheduled_date_to);
        }
      } else {
        const { Op } = EmployeeInterviewSchedule.sequelize;
        filters.scheduled_date = {};
        if (scheduled_date_from) {
          filters.scheduled_date[Op.gte] = scheduled_date_from;
        }
        if (scheduled_date_to) {
          filters.scheduled_date[Op.lte] = scheduled_date_to;
        }
      }
    }
    
    let interviews;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      if (search) {
        mongoQuery.$or = [
          { title: { $regex: search, $options: 'i' } }
        ];
      }
      
      total = await EmployeeInterviewSchedule.countDocuments(mongoQuery);
      interviews = await EmployeeInterviewSchedule.find(mongoQuery)
        .sort({ scheduled_date: -1, start_time: 1 })
        .skip(offset)
        .limit(parseInt(limit))
        .populate('employee_id', 'first_name last_name employee_id')
        .populate('job_id', 'job_title');
    } else {
      // SQL implementation
      const queryOptions = {
        where: filters,
        limit: parseInt(limit),
        offset,
        order: [
          ['scheduled_date', 'DESC'],
          ['start_time', 'ASC']
        ],
        include: [
          {
            model: Employee,
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            as: 'employee'
          },
          {
            model: Job,
            attributes: ['id', 'job_title'],
            as: 'job'
          }
        ]
      };
      
      // Add search functionality for SQL databases
      if (search) {
        const { Op } = EmployeeInterviewSchedule.sequelize;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } }
          ]
        };
      }
      
      const result = await EmployeeInterviewSchedule.findAndCountAll(queryOptions);
      interviews = result.rows;
      total = result.count;
    }
    
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: interviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching employee interview schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee interview schedules',
      error: error.message
    });
  }
};

// Get employee interview schedule by ID
exports.getEmployeeInterviewScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let interview;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      interview = await EmployeeInterviewSchedule.findById(id)
        .populate('employee_id', 'first_name last_name employee_id')
        .populate('job_id', 'job_title');
    } else {
      // SQL implementation
      interview = await EmployeeInterviewSchedule.findByPk(id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            as: 'employee'
          },
          {
            model: Job,
            attributes: ['id', 'job_title'],
            as: 'job'
          }
        ]
      });
    }
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Employee interview schedule not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Error fetching employee interview schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee interview schedule',
      error: error.message
    });
  }
};

// Get interview schedules by employee ID
exports.getInterviewSchedulesByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      page = 1,
      limit = 10,
      status,
      decision,
      interview_type,
      scheduled_date_from,
      scheduled_date_to,
      is_active,
      round
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Validate employee exists
    let employee;
    if (dbType === 'mongodb') {
      employee = await Employee.findById(employeeId);
    } else {
      employee = await Employee.findByPk(employeeId);
    }
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Build filter conditions
    let filters = {};
    let mongoQuery = { employee_id: parseInt(employeeId) };
    
    if (dbType !== 'mongodb') {
      filters.employee_id = employeeId;
    }
    
    if (status) {
      if (dbType === 'mongodb') {
        mongoQuery.status = status;
      } else {
        filters.status = status;
      }
    }
    
    if (decision) {
      if (dbType === 'mongodb') {
        mongoQuery.decision = decision;
      } else {
        filters.decision = decision;
      }
    }
    
    if (interview_type) {
      if (dbType === 'mongodb') {
        mongoQuery.interview_type = interview_type;
      } else {
        filters.interview_type = interview_type;
      }
    }
    
    if (round) {
      if (dbType === 'mongodb') {
        mongoQuery.round = parseInt(round);
      } else {
        filters.round = round;
      }
    }
    
    if (is_active !== undefined) {
      const isActive = is_active === 'true';
      if (dbType === 'mongodb') {
        mongoQuery.is_active = isActive;
      } else {
        filters.is_active = isActive;
      }
    }
    
    // Date range filtering
    if (scheduled_date_from || scheduled_date_to) {
      if (dbType === 'mongodb') {
        mongoQuery.scheduled_date = {};
        if (scheduled_date_from) {
          mongoQuery.scheduled_date.$gte = new Date(scheduled_date_from);
        }
        if (scheduled_date_to) {
          mongoQuery.scheduled_date.$lte = new Date(scheduled_date_to);
        }
      } else {
        const { Op } = EmployeeInterviewSchedule.sequelize;
        filters.scheduled_date = {};
        if (scheduled_date_from) {
          filters.scheduled_date[Op.gte] = scheduled_date_from;
        }
        if (scheduled_date_to) {
          filters.scheduled_date[Op.lte] = scheduled_date_to;
        }
      }
    }
    
    let interviews;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      total = await EmployeeInterviewSchedule.countDocuments(mongoQuery);
      interviews = await EmployeeInterviewSchedule.find(mongoQuery)
        .sort({ scheduled_date: -1, start_time: 1 })
        .skip(offset)
        .limit(parseInt(limit))
        .populate('job_id', 'job_title');
    } else {
      // SQL implementation
      const queryOptions = {
        where: filters,
        limit: parseInt(limit),
        offset,
        order: [
          ['scheduled_date', 'DESC'],
          ['start_time', 'ASC']
        ],
        include: [
          {
            model: Job,
            attributes: ['id', 'job_title'],
            as: 'job'
          }
        ]
      };
      
      const result = await EmployeeInterviewSchedule.findAndCountAll(queryOptions);
      interviews = result.rows;
      total = result.count;
    }
    
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: interviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching employee interview schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee interview schedules',
      error: error.message
    });
  }
};

// Create new employee interview schedule
exports.createEmployeeInterviewSchedule = async (req, res) => {
  try {
    const {
      employee_id, job_id, title, round, interview_type,
      scheduled_date, start_time, end_time, timezone,
      is_virtual, location, meeting_link, meeting_id, meeting_password, meeting_provider,
      status, employee_confirmed, confirmation_date, is_active,
      preparation_instructions, interviewer_instructions, assessment_criteria, notes,
      decision, decision_reason, next_steps,
      reminder_sent, reminder_sent_at,
      created_by
    } = req.body;
    
    // Validate required fields
    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }
    
    if (!job_id) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Interview title is required'
      });
    }
    
    if (!interview_type) {
      return res.status(400).json({
        success: false,
        message: 'Interview type is required'
      });
    }
    
    if (!scheduled_date) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled date is required'
      });
    }
    
    if (!start_time) {
      return res.status(400).json({
        success: false,
        message: 'Start time is required'
      });
    }
    
    if (!end_time) {
      return res.status(400).json({
        success: false,
        message: 'End time is required'
      });
    }
    
    // Validate employee exists
    let employee;
    if (dbType === 'mongodb') {
      employee = await Employee.findById(employee_id);
    } else {
      employee = await Employee.findByPk(employee_id);
    }
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Validate job exists
    let job;
    if (dbType === 'mongodb') {
      job = await Job.findById(job_id);
    } else {
      job = await Job.findByPk(job_id);
    }
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    let newInterviewSchedule;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      newInterviewSchedule = new EmployeeInterviewSchedule({
        employee_id, job_id, title, round, interview_type,
        scheduled_date, start_time, end_time, timezone,
        is_virtual, location, meeting_link, meeting_id, meeting_password, meeting_provider,
        status, employee_confirmed, confirmation_date, is_active,
        preparation_instructions, interviewer_instructions, assessment_criteria, notes,
        decision, decision_reason, next_steps,
        reminder_sent, reminder_sent_at,
        created_by
      });
      
      await newInterviewSchedule.save();
    } else {
      // SQL implementation
      newInterviewSchedule = await EmployeeInterviewSchedule.create({
        employee_id, job_id, title, round, interview_type,
        scheduled_date, start_time, end_time, timezone,
        is_virtual, location, meeting_link, meeting_id, meeting_password, meeting_provider,
        status, employee_confirmed, confirmation_date, is_active,
        preparation_instructions, interviewer_instructions, assessment_criteria, notes,
        decision, decision_reason, next_steps,
        reminder_sent, reminder_sent_at,
        created_by
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Employee interview schedule created successfully',
      data: newInterviewSchedule
    });
  } catch (error) {
    console.error('Error creating employee interview schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee interview schedule',
      error: error.message
    });
  }
};

// Update employee interview schedule
exports.updateEmployeeInterviewSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;
    
    // Add updated_by if provided
    if (req.body.updated_by) {
      updateData.updated_by = req.body.updated_by;
    }
    
    let interviewSchedule;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      interviewSchedule = await EmployeeInterviewSchedule.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await EmployeeInterviewSchedule.update(
        updateData,
        { where: { id } }
      );
      
      interviewSchedule = await EmployeeInterviewSchedule.findByPk(id);
    }
    
    if (!interviewSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Employee interview schedule not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Employee interview schedule updated successfully',
      data: interviewSchedule
    });
  } catch (error) {
    console.error('Error updating employee interview schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee interview schedule',
      error: error.message
    });
  }
};

// Delete employee interview schedule (soft delete)
exports.deleteEmployeeInterviewSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    let result;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      result = await EmployeeInterviewSchedule.findByIdAndUpdate(
        id,
        { deleted_at: new Date() }
      );
    } else {
      // SQL implementation
      result = await EmployeeInterviewSchedule.destroy({
        where: { id }
      });
    }
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Employee interview schedule not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Employee interview schedule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee interview schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee interview schedule',
      error: error.message
    });
  }
};

// Change employee interview schedule status
exports.changeEmployeeInterviewScheduleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, updated_by } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['scheduled', 'confirmed', 'rescheduled', 'completed', 'canceled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    const updateData = { 
      status,
      updated_by
    };
    
    let interviewSchedule;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      interviewSchedule = await EmployeeInterviewSchedule.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await EmployeeInterviewSchedule.update(
        updateData,
        { where: { id } }
      );
      
      interviewSchedule = await EmployeeInterviewSchedule.findByPk(id);
    }
    
    if (!interviewSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Employee interview schedule not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Employee interview schedule status changed to ${status} successfully`,
      data: interviewSchedule
    });
  } catch (error) {
    console.error('Error changing employee interview schedule status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change employee interview schedule status',
      error: error.message
    });
  }
};

// Update employee interview schedule decision
exports.updateEmployeeInterviewScheduleDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, decision_reason, next_steps, updated_by } = req.body;
    
    if (!decision) {
      return res.status(400).json({
        success: false,
        message: 'Decision is required'
      });
    }
    
    const validDecisions = ['pending', 'positive', 'negative', 'action_required', 'follow_up_needed', 'no_decision'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid decision. Must be one of: ' + validDecisions.join(', ')
      });
    }
    
    const updateData = { 
      decision,
      decision_reason,
      next_steps,
      updated_by
    };
    
    let interviewSchedule;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      interviewSchedule = await EmployeeInterviewSchedule.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await EmployeeInterviewSchedule.update(
        updateData,
        { where: { id } }
      );
      
      interviewSchedule = await EmployeeInterviewSchedule.findByPk(id);
    }
    
    if (!interviewSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Employee interview schedule not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Employee interview schedule decision updated to ${decision} successfully`,
      data: interviewSchedule
    });
  } catch (error) {
    console.error('Error updating employee interview schedule decision:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee interview schedule decision',
      error: error.message
    });
  }
};
