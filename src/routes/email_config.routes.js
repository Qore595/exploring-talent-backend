const express = require('express');
const router = express.Router();
const emailConfigController = require('../controllers/email_config.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all email configurations - accessible by admin
router.get('/', isAdmin, emailConfigController.getAllEmailConfigs);

// Get email configuration by ID - accessible by admin
router.get('/:id', isAdmin, emailConfigController.getEmailConfigById);

// Create new email configuration - accessible by admin
router.post('/', isAdmin, emailConfigController.createEmailConfig);

// Update email configuration - accessible by admin
router.put('/:id', isAdmin, emailConfigController.updateEmailConfig);

// Delete email configuration - accessible by admin
router.delete('/:id', isAdmin, emailConfigController.deleteEmailConfig);

// Set email configuration as default - accessible by admin
router.patch('/:id/set-default', isAdmin, emailConfigController.setAsDefault);

module.exports = router;
