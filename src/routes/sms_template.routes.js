const express = require('express');
const router = express.Router();
const smsTemplateController = require('../controllers/sms_template.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all SMS templates - accessible by admin
router.get('/', isAdmin, smsTemplateController.getAllSmsTemplates);

// Get SMS template by ID - accessible by admin
router.get('/:id', isAdmin, smsTemplateController.getSmsTemplateById);

// Create new SMS template - accessible by admin
router.post('/', isAdmin, smsTemplateController.createSmsTemplate);

// Update SMS template - accessible by admin
router.put('/:id', isAdmin, smsTemplateController.updateSmsTemplate);

// Delete SMS template - accessible by admin
router.delete('/:id', isAdmin, smsTemplateController.deleteSmsTemplate);

module.exports = router;
