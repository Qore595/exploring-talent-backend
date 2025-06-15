const express = require('express');
const router = express.Router();
const smsConfigurationController = require('../controllers/sms_configuration.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all SMS configurations - accessible by admin
router.get('/', isAdmin, smsConfigurationController.getAllSmsConfigurations);

// Get SMS configuration by ID - accessible by admin
router.get('/:id', isAdmin, smsConfigurationController.getSmsConfigurationById);

// Create new SMS configuration - accessible by admin
router.post('/', isAdmin, smsConfigurationController.createSmsConfiguration);

// Update SMS configuration - accessible by admin
router.put('/:id', isAdmin, smsConfigurationController.updateSmsConfiguration);

// Delete SMS configuration - accessible by admin
router.delete('/:id', isAdmin, smsConfigurationController.deleteSmsConfiguration);

module.exports = router;
