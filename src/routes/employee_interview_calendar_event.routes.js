const express = require('express');
const router = express.Router();
const employeeInterviewCalendarEventController = require('../controllers/employee_interview_calendar_event.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all employee interview calendar events - accessible by staff or admin
router.get('/', isStaffOrAdmin, employeeInterviewCalendarEventController.getAllCalendarEvents);

// Get calendar event by ID - accessible by staff or admin
router.get('/:id', isStaffOrAdmin, employeeInterviewCalendarEventController.getCalendarEventById);

// Get calendar events by interview ID - accessible by staff or admin
router.get('/interview/:interviewId', isStaffOrAdmin, employeeInterviewCalendarEventController.getCalendarEventsByInterviewId);

// Create new calendar event - accessible by admin
router.post('/', isAdmin, employeeInterviewCalendarEventController.createCalendarEvent);

// Update calendar event - accessible by admin
router.put('/:id', isAdmin, employeeInterviewCalendarEventController.updateCalendarEvent);

// Delete calendar event - accessible by admin
router.delete('/:id', isAdmin, employeeInterviewCalendarEventController.deleteCalendarEvent);

// Update sync status - accessible by admin
router.patch('/:id/sync-status', isAdmin, employeeInterviewCalendarEventController.updateSyncStatus);

module.exports = router;
