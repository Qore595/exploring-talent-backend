const express = require('express');
const router = express.Router();
const permissionCategoryController = require('../controllers/permission_category.controller');

// GET all permission categories with pagination and filtering
router.get('/', permissionCategoryController.getAllPermissionCategories);

// GET permission category by ID
router.get('/:id', permissionCategoryController.getPermissionCategoryById);

// POST create new permission category
router.post('/', permissionCategoryController.createPermissionCategory);

// PUT update permission category
router.put('/:id', permissionCategoryController.updatePermissionCategory);

// DELETE permission category
router.delete('/:id', permissionCategoryController.deletePermissionCategory);

module.exports = router;
