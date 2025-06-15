const express = require('express');
const router = express.Router();
const employeeInterviewScheduleController = require('../controllers/employee_interview_schedule.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all employee interview schedules with pagination and filtering - accessible by staff or admin
router.get('/', isStaffOrAdmin, employeeInterviewScheduleController.getAllEmployeeInterviewSchedules);

// Get employee interview schedule by ID - accessible by staff or admin
router.get('/:id', isStaffOrAdmin, employeeInterviewScheduleController.getEmployeeInterviewScheduleById);

// Get interview schedules by employee ID - accessible by staff or admin
router.get('/employee/:employeeId', isStaffOrAdmin, employeeInterviewScheduleController.getInterviewSchedulesByEmployeeId);

// Create new employee interview schedule - accessible by admin
router.post('/', isAdmin, employeeInterviewScheduleController.createEmployeeInterviewSchedule);

// Update employee interview schedule - accessible by admin
router.put('/:id', isAdmin, employeeInterviewScheduleController.updateEmployeeInterviewSchedule);

// Delete employee interview schedule (soft delete) - accessible by admin
router.delete('/:id', isAdmin, employeeInterviewScheduleController.deleteEmployeeInterviewSchedule);

// Change employee interview schedule status - accessible by admin
router.patch('/:id/status', isAdmin, employeeInterviewScheduleController.changeEmployeeInterviewScheduleStatus);

// Update employee interview schedule decision - accessible by admin
router.patch('/:id/decision', isAdmin, employeeInterviewScheduleController.updateEmployeeInterviewScheduleDecision);

module.exports = router;
