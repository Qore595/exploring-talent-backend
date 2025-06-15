const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');

// GET all departments with pagination and filtering
router.get('/', departmentController.getAllDepartments);

// GET departments by branch ID
router.get('/branch/:branchId', departmentController.getDepartmentsByBranchId);

// GET department by ID
router.get('/:id', departmentController.getDepartmentById);

// POST create new department
router.post('/', departmentController.createDepartment);

// PUT update department
router.put('/:id', departmentController.updateDepartment);

// DELETE department
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
