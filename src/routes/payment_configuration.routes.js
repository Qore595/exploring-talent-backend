const express = require('express');
const router = express.Router();
const paymentConfigurationController = require('../controllers/payment_configuration.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all payment configurations - accessible by admin
router.get('/', isAdmin, paymentConfigurationController.getAllPaymentConfigurations);

// Get payment configuration by ID - accessible by admin
router.get('/:id', isAdmin, paymentConfigurationController.getPaymentConfigurationById);

// Create new payment configuration - accessible by admin
router.post('/', isAdmin, paymentConfigurationController.createPaymentConfiguration);

// Update payment configuration - accessible by admin
router.put('/:id', isAdmin, paymentConfigurationController.updatePaymentConfiguration);

// Delete payment configuration - accessible by admin
router.delete('/:id', isAdmin, paymentConfigurationController.deletePaymentConfiguration);

module.exports = router;
