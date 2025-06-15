const express = require('express');
const router = express.Router();
const permissionGroupWithCategoriesController = require('../controllers/permission_group_with_categories.controller');

// GET all permission groups with their categories
router.get('/', permissionGroupWithCategoriesController.getAllGroupsWithCategories);

// GET a single permission group with its categories by ID
router.get('/:id', permissionGroupWithCategoriesController.getGroupWithCategoriesById);

// POST create a new permission group with categories
router.post('/', permissionGroupWithCategoriesController.createGroupWithCategories);

// PUT update a permission group with its categories
router.put('/:id', permissionGroupWithCategoriesController.updateGroupWithCategories);

// DELETE a permission group with all its categories
router.delete('/:id', permissionGroupWithCategoriesController.deleteGroupWithCategories);

module.exports = router;
