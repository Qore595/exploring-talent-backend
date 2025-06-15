const express = require('express');
const router = express.Router();
const permissionGroupController = require('../controllers/permission_group.controller');

// GET all permission groups with pagination and filtering
router.get('/', permissionGroupController.getAllPermissionGroups);

// GET permission group by ID
router.get('/:id', permissionGroupController.getPermissionGroupById);

// POST create new permission group
router.post('/', permissionGroupController.createPermissionGroup);

// PUT update permission group
router.put('/:id', permissionGroupController.updatePermissionGroup);

// DELETE permission group (soft delete)
router.delete('/:id', permissionGroupController.deletePermissionGroup);

module.exports = router;
