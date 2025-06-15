const express = require('express');
const router = express.Router();
const sidebarMenuWithSubMenusController = require('../controllers/sidebar_menu_with_sub_menus.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate);

// GET all sidebar menus with their sub-menus
router.get('/', sidebarMenuWithSubMenusController.getAllMenusWithSubMenus);

// GET a single sidebar menu with its sub-menus by ID
router.get('/:id', sidebarMenuWithSubMenusController.getMenuWithSubMenusById);

// POST create a new sidebar menu with sub-menus
router.post('/', sidebarMenuWithSubMenusController.createMenuWithSubMenus);

// PUT update a sidebar menu with its sub-menus
router.put('/:id', sidebarMenuWithSubMenusController.updateMenuWithSubMenus);

// DELETE a sidebar menu with all its sub-menus
router.delete('/:id', sidebarMenuWithSubMenusController.deleteMenuWithSubMenus);

module.exports = router;
