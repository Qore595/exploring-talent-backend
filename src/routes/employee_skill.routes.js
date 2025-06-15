const express = require('express');
const router = express.Router();
const employeeSkillController = require('../controllers/employee_skill.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all skills for a specific employee
router.get('/employee/:employeeId', isStaffOrAdmin, employeeSkillController.getEmployeeSkills);

// Get a specific skill by ID
router.get('/:id', isStaffOrAdmin, employeeSkillController.getEmployeeSkillById);

// Create a new skill for an employee
router.post('/employee/:employeeId', isStaffOrAdmin, employeeSkillController.createEmployeeSkill);

// Update a skill
router.put('/:id', isStaffOrAdmin, employeeSkillController.updateEmployeeSkill);

// Delete a skill
router.delete('/:id', isStaffOrAdmin, employeeSkillController.deleteEmployeeSkill);

module.exports = router;
