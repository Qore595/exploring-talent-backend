const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// Public routes
// Get all published jobs with filtering and pagination
router.get('/public', jobController.getAllJobs);

// Get job by ID (public)
router.get('/public/:id', jobController.getJobById);

// Get job by slug (public)
router.get('/public/slug/:slug', jobController.getJobBySlug);

// Increment application count
router.post('/public/:id/apply', jobController.incrementApplicationCount);

// Protected routes - require authentication
router.use(authenticate);

// Get all jobs with filtering and pagination (admin/staff)
router.get('/', isStaffOrAdmin, jobController.getAllJobs);

// Get job by ID (admin/staff)
router.get('/:id', isStaffOrAdmin, jobController.getJobById);

// Get job by slug (admin/staff)
router.get('/slug/:slug', isStaffOrAdmin, jobController.getJobBySlug);

// Create new job (admin only)
router.post('/', isAdmin, jobController.createJob);

// Update job (admin only)
router.put('/:id', isAdmin, jobController.updateJob);

// Delete job (soft delete) (admin only)
router.delete('/:id', isAdmin, jobController.deleteJob);

// Change job status (admin only)
router.patch('/:id/status', isAdmin, jobController.changeJobStatus);

module.exports = router;
