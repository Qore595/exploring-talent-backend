const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designation.controller');

// GET all designations with pagination and filtering
router.get('/', designationController.getAllDesignations);

// GET designation by ID
router.get('/:id', designationController.getDesignationById);

// POST create new designation
router.post('/', designationController.createDesignation);

// PUT update designation
router.put('/:id', designationController.updateDesignation);

// DELETE designation
router.delete('/:id', designationController.deleteDesignation);

module.exports = router;
