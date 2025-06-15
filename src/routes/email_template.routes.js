const express = require('express');
const router = express.Router();
const emailTemplateController = require('../controllers/email_template.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all email templates - accessible by admin
router.get('/', isAdmin, emailTemplateController.getAllEmailTemplates);

// Get email template by ID - accessible by admin
router.get('/:id', isAdmin, emailTemplateController.getEmailTemplateById);

// Get email template by template code - accessible by staff or admin
router.get('/code/:code', isStaffOrAdmin, emailTemplateController.getEmailTemplateByCode);

// Create new email template - accessible by admin
router.post('/', isAdmin, emailTemplateController.createEmailTemplate);

// Update email template - accessible by admin
router.put('/:id', isAdmin, emailTemplateController.updateEmailTemplate);

// Delete email template - accessible by admin
router.delete('/:id', isAdmin, emailTemplateController.deleteEmailTemplate);

module.exports = router;
