const express = require('express');
const router = express.Router();
const employeeRoleController = require('../controllers/employee_role.controller');

// GET all employee roles with pagination and filtering
router.get('/', employeeRoleController.getAllEmployeeRoles);

// GET roles by employee ID
router.get('/employee/:employeeId', employeeRoleController.getRolesByEmployeeId);

// GET employees by role ID
router.get('/role/:roleId', employeeRoleController.getEmployeesByRoleId);

// GET employee role by ID
router.get('/:id', employeeRoleController.getEmployeeRoleById);

// POST create new employee role
router.post('/', employeeRoleController.createEmployeeRole);

// PUT update employee role
router.put('/:id', employeeRoleController.updateEmployeeRole);

// DELETE employee role (soft delete)
router.delete('/:id', employeeRoleController.deleteEmployeeRole);

module.exports = router;
