const express = require('express');
const router = express.Router();
const generalSettingController = require('../controllers/general_setting.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all general settings - accessible by admin
router.get('/', isAdmin, generalSettingController.getAllGeneralSettings);

// Get general setting by ID - accessible by admin
router.get('/:id', isAdmin, generalSettingController.getGeneralSettingById);

// Create new general setting - accessible by admin
router.post('/', isAdmin, generalSettingController.createGeneralSetting);

// Update general setting - accessible by admin
router.put('/:id', isAdmin, generalSettingController.updateGeneralSetting);

// Delete general setting - accessible by admin
router.delete('/:id', isAdmin, generalSettingController.deleteGeneralSetting);

module.exports = router;
