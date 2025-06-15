const express = require('express');
const router = express.Router();
const rolePermissionController = require('../controllers/role_permission.controller');

// GET all role permissions with pagination and filtering
router.get('/', rolePermissionController.getAllRolePermissions);

// GET role permission by ID
router.get('/:id', rolePermissionController.getRolePermissionById);

// GET role permissions by role ID
router.get('/role/:roleId', rolePermissionController.getRolePermissionsByRoleId);

// POST create new role permission
router.post('/', rolePermissionController.createRolePermission);

// POST batch create or update role permissions
router.post('/batch', rolePermissionController.batchCreateOrUpdateRolePermissions);

// PUT update role permission
router.put('/:id', rolePermissionController.updateRolePermission);

// DELETE role permission (soft delete)
router.delete('/:id', rolePermissionController.deleteRolePermission);

module.exports = router;
