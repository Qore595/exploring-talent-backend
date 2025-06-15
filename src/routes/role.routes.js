const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

// GET all roles with pagination and filtering
router.get('/', roleController.getAllRoles);

// GET role by ID
router.get('/:id', roleController.getRoleById);

// POST create new role
router.post('/', roleController.createRole);

// PUT update role
router.put('/:id', roleController.updateRole);

// DELETE role (soft delete)
router.delete('/:id', roleController.deleteRole);

module.exports = router;
