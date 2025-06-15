const express = require('express');
const router = express.Router();
const sidebarSubMenuController = require('../controllers/sidebar_sub_menu.controller');

// GET all sidebar sub-menus with pagination and filtering
router.get('/', sidebarSubMenuController.getAllSidebarSubMenus);

// GET sub-menus by parent menu ID
router.get('/parent/:parentId', sidebarSubMenuController.getSubMenusByParentId);

// GET sidebar sub-menu by ID
router.get('/:id', sidebarSubMenuController.getSidebarSubMenuById);

// POST create new sidebar sub-menu
router.post('/', sidebarSubMenuController.createSidebarSubMenu);

// PUT update sidebar sub-menu
router.put('/:id', sidebarSubMenuController.updateSidebarSubMenu);

// DELETE sidebar sub-menu (soft delete)
router.delete('/:id', sidebarSubMenuController.deleteSidebarSubMenu);

module.exports = router;
