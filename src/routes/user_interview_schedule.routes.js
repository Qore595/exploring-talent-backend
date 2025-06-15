const express = require('express');
const router = express.Router();
const userInterviewScheduleController = require('../controllers/user_interview_schedule.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all user interview schedules with pagination and filtering - accessible by staff or admin
router.get('/', isStaffOrAdmin, userInterviewScheduleController.getAllUserInterviewSchedules);

// Get user interview schedule by ID - accessible by staff or admin
router.get('/:id', isStaffOrAdmin, userInterviewScheduleController.getUserInterviewScheduleById);

// Get interview schedules by user ID - accessible by staff or admin
router.get('/user/:userId', isStaffOrAdmin, userInterviewScheduleController.getInterviewSchedulesByUserId);

// Create new user interview schedule - accessible by admin
router.post('/', isAdmin, userInterviewScheduleController.createUserInterviewSchedule);

// Update user interview schedule - accessible by admin
router.put('/:id', isAdmin, userInterviewScheduleController.updateUserInterviewSchedule);

// Delete user interview schedule (soft delete) - accessible by admin
router.delete('/:id', isAdmin, userInterviewScheduleController.deleteUserInterviewSchedule);

// Change user interview schedule status - accessible by admin
router.patch('/:id/status', isAdmin, userInterviewScheduleController.changeUserInterviewScheduleStatus);

// Update user interview schedule decision - accessible by admin
router.patch('/:id/decision', isAdmin, userInterviewScheduleController.updateUserInterviewScheduleDecision);

module.exports = router;
