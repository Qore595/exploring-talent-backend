const express = require('express');
const router = express.Router();
const newJobController = require('../controllers/newjob.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route   GET /api/newjobs
 * @desc    Get all jobs with pagination and filtering
 * @access  Public
 */
router.get('/', newJobController.getAllNewJobs);

/**
 * @route   GET /api/newjobs/:id
 * @desc    Get job by ID
 * @access  Public
 */
router.get('/:id', newJobController.getNewJobById);

/**
 * @route   POST /api/newjobs
 * @desc    Create a new job
 * @access  Public
 */
router.post('/', newJobController.createNewJob);

/**
 * @route   PUT /api/newjobs/:id
 * @desc    Update an existing job
 * @access  Private
 */
router.put('/:id', newJobController.updateNewJob);

/**
 * @route   DELETE /api/newjobs/:id
 * @desc    Delete a job
 * @access  Public
 */
router.delete('/:id', newJobController.deleteNewJob);

module.exports = router;
