const express = require('express');
const router = express.Router();
const userInterviewCalendarEventController = require('../controllers/user_interview_calendar_event.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all user interview calendar events - accessible by staff or admin
router.get('/', isStaffOrAdmin, userInterviewCalendarEventController.getAllCalendarEvents);

// Get calendar event by ID - accessible by staff or admin
router.get('/:id', isStaffOrAdmin, userInterviewCalendarEventController.getCalendarEventById);

// Get calendar events by interview ID - accessible by staff or admin
router.get('/interview/:interviewId', isStaffOrAdmin, userInterviewCalendarEventController.getCalendarEventsByInterviewId);

// Create new calendar event - accessible by admin
router.post('/', isAdmin, userInterviewCalendarEventController.createCalendarEvent);

// Update calendar event - accessible by admin
router.put('/:id', isAdmin, userInterviewCalendarEventController.updateCalendarEvent);

// Delete calendar event - accessible by admin
router.delete('/:id', isAdmin, userInterviewCalendarEventController.deleteCalendarEvent);

// Update sync status - accessible by admin
router.patch('/:id/sync-status', isAdmin, userInterviewCalendarEventController.updateSyncStatus);

module.exports = router;
