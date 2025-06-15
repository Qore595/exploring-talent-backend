const express = require('express');
const router = express.Router();
const sidebarMenuController = require('../controllers/sidebar_menu.controller');

// GET all sidebar menus with pagination and filtering
router.get('/', sidebarMenuController.getAllSidebarMenus);

// GET active sidebar menus for navigation
router.get('/active', sidebarMenuController.getActiveSidebarMenus);

// GET sidebar menu by ID
router.get('/:id', sidebarMenuController.getSidebarMenuById);

// POST create new sidebar menu
router.post('/', sidebarMenuController.createSidebarMenu);

// PUT update sidebar menu
router.put('/:id', sidebarMenuController.updateSidebarMenu);

// DELETE sidebar menu (soft delete)
router.delete('/:id', sidebarMenuController.deleteSidebarMenu);

module.exports = router;
