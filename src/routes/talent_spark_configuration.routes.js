const express = require('express');
const router = express.Router();
const talentSparkConfigurationController = require('../controllers/talent_spark_configuration.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all talent spark configurations with pagination and filtering - accessible by staff or admin
router.get('/', isStaffOrAdmin, talentSparkConfigurationController.getAllConfigurations);

// Get configuration by ID - accessible by staff or admin
router.get('/:id', isStaffOrAdmin, talentSparkConfigurationController.getConfigurationById);

// Get configurations by branch ID - accessible by staff or admin
router.get('/branch/:branchId', isStaffOrAdmin, talentSparkConfigurationController.getConfigurationsByBranchId);

// Get default configuration for a branch - accessible by staff or admin
router.get('/branch/:branchId/default', isStaffOrAdmin, talentSparkConfigurationController.getDefaultConfigurationForBranch);

// Create new configuration - accessible by admin
router.post('/', isAdmin, talentSparkConfigurationController.createConfiguration);

// Update configuration - accessible by admin
router.put('/:id', isAdmin, talentSparkConfigurationController.updateConfiguration);

// Delete configuration - accessible by admin
router.delete('/:id', isAdmin, talentSparkConfigurationController.deleteConfiguration);

// Update configuration status - accessible by admin
router.patch('/:id/status', isAdmin, talentSparkConfigurationController.updateConfigurationStatus);

module.exports = router;
