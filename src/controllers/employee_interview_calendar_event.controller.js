const EmployeeInterviewCalendarEvent = require('../models/employee_interview_calendar_event.model');
const EmployeeInterviewSchedule = require('../models/employee_interview_schedule.model');
const { dbType } = require('../config/database');

// Get all employee interview calendar events
exports.getAllCalendarEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      interview_id,
      calendar_type,
      sync_status,
      is_active
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    let filters = {};
    let mongoQuery = {};
    
    if (interview_id) {
      if (dbType === 'mongodb') {
        mongoQuery.interview_id = parseInt(interview_id);
      } else {
        filters.interview_id = interview_id;
      }
    }
    
    if (calendar_type) {
      if (dbType === 'mongodb') {
        mongoQuery.calendar_type = calendar_type;
      } else {
        filters.calendar_type = calendar_type;
      }
    }
    
    if (sync_status) {
      if (dbType === 'mongodb') {
        mongoQuery.sync_status = sync_status;
      } else {
        filters.sync_status = sync_status;
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
    
    let calendarEvents;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      total = await EmployeeInterviewCalendarEvent.countDocuments(mongoQuery);
      calendarEvents = await EmployeeInterviewCalendarEvent.find(mongoQuery)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(parseInt(limit))
        .populate('interview_id');
    } else {
      // SQL implementation
      const queryOptions = {
        where: filters,
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: EmployeeInterviewSchedule,
            as: 'interview'
          }
        ]
      };
      
      const result = await EmployeeInterviewCalendarEvent.findAndCountAll(queryOptions);
      calendarEvents = result.rows;
      total = result.count;
    }
    
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: calendarEvents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching employee interview calendar events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee interview calendar events',
      error: error.message
    });
  }
};

// Get calendar event by ID
exports.getCalendarEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let calendarEvent;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      calendarEvent = await EmployeeInterviewCalendarEvent.findById(id)
        .populate('interview_id');
    } else {
      // SQL implementation
      calendarEvent = await EmployeeInterviewCalendarEvent.findByPk(id, {
        include: [
          {
            model: EmployeeInterviewSchedule,
            as: 'interview'
          }
        ]
      });
    }
    
    if (!calendarEvent) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: calendarEvent
    });
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar event',
      error: error.message
    });
  }
};

// Get calendar events by interview ID
exports.getCalendarEventsByInterviewId = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    let calendarEvents;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      calendarEvents = await EmployeeInterviewCalendarEvent.find({ interview_id: parseInt(interviewId) })
        .sort({ created_at: -1 });
    } else {
      // SQL implementation
      calendarEvents = await EmployeeInterviewCalendarEvent.findAll({
        where: { interview_id: interviewId },
        order: [['created_at', 'DESC']],
        include: [
          {
            model: EmployeeInterviewSchedule,
            as: 'interview'
          }
        ]
      });
    }
    
    res.status(200).json({
      success: true,
      data: calendarEvents
    });
  } catch (error) {
    console.error('Error fetching calendar events by interview ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar events by interview ID',
      error: error.message
    });
  }
};

// Create new calendar event
exports.createCalendarEvent = async (req, res) => {
  try {
    const {
      interview_id,
      calendar_type,
      event_id,
      organizer_id,
      event_url,
      sync_status,
      is_active,
      last_synced_at
    } = req.body;
    
    // Validate required fields
    if (!interview_id) {
      return res.status(400).json({
        success: false,
        message: 'Interview ID is required'
      });
    }
    
    if (!calendar_type) {
      return res.status(400).json({
        success: false,
        message: 'Calendar type is required'
      });
    }
    
    if (!event_id) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }
    
    // Check if interview exists
    let interview;
    if (dbType === 'mongodb') {
      interview = await EmployeeInterviewSchedule.findById(interview_id);
    } else {
      interview = await EmployeeInterviewSchedule.findByPk(interview_id);
    }
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    // Check if calendar event already exists for this interview and calendar type
    let existingEvent;
    if (dbType === 'mongodb') {
      existingEvent = await EmployeeInterviewCalendarEvent.findOne({
        interview_id: parseInt(interview_id),
        calendar_type
      });
    } else {
      existingEvent = await EmployeeInterviewCalendarEvent.findOne({
        where: {
          interview_id,
          calendar_type
        }
      });
    }
    
    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: `A calendar event of type ${calendar_type} already exists for this interview`
      });
    }
    
    let newCalendarEvent;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      newCalendarEvent = new EmployeeInterviewCalendarEvent({
        interview_id: parseInt(interview_id),
        calendar_type,
        event_id,
        organizer_id: organizer_id ? parseInt(organizer_id) : null,
        event_url,
        sync_status: sync_status || 'synced',
        is_active: is_active !== undefined ? is_active : true,
        last_synced_at: last_synced_at || new Date()
      });
      
      await newCalendarEvent.save();
    } else {
      // SQL implementation
      newCalendarEvent = await EmployeeInterviewCalendarEvent.create({
        interview_id,
        calendar_type,
        event_id,
        organizer_id,
        event_url,
        sync_status: sync_status || 'synced',
        is_active: is_active !== undefined ? is_active : true,
        last_synced_at: last_synced_at || new Date()
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Calendar event created successfully',
      data: newCalendarEvent
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create calendar event',
      error: error.message
    });
  }
};

// Update calendar event
exports.updateCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.interview_id;
    delete updateData.calendar_type;
    delete updateData.created_at;
    
    let calendarEvent;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      calendarEvent = await EmployeeInterviewCalendarEvent.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await EmployeeInterviewCalendarEvent.update(
        updateData,
        { where: { id } }
      );
      
      calendarEvent = await EmployeeInterviewCalendarEvent.findByPk(id);
    }
    
    if (!calendarEvent) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Calendar event updated successfully',
      data: calendarEvent
    });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update calendar event',
      error: error.message
    });
  }
};

// Delete calendar event
exports.deleteCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    let result;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      result = await EmployeeInterviewCalendarEvent.findByIdAndDelete(id);
    } else {
      // SQL implementation
      result = await EmployeeInterviewCalendarEvent.destroy({
        where: { id }
      });
    }
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Calendar event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete calendar event',
      error: error.message
    });
  }
};

// Update sync status
exports.updateSyncStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { sync_status } = req.body;
    
    if (!sync_status) {
      return res.status(400).json({
        success: false,
        message: 'Sync status is required'
      });
    }
    
    const validStatuses = ['synced', 'out_of_sync', 'failed'];
    if (!validStatuses.includes(sync_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sync status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    const updateData = { 
      sync_status,
      last_synced_at: sync_status === 'synced' ? new Date() : null
    };
    
    let calendarEvent;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      calendarEvent = await EmployeeInterviewCalendarEvent.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await EmployeeInterviewCalendarEvent.update(
        updateData,
        { where: { id } }
      );
      
      calendarEvent = await EmployeeInterviewCalendarEvent.findByPk(id);
    }
    
    if (!calendarEvent) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Calendar event sync status updated to ${sync_status} successfully`,
      data: calendarEvent
    });
  } catch (error) {
    console.error('Error updating calendar event sync status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update calendar event sync status',
      error: error.message
    });
  }
};
