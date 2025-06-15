const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

// Protected routes - require authentication
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/change-password', authenticate, userController.changePassword);

// Admin routes - require admin privileges
router.get('/', authenticate, isStaffOrAdmin, userController.getAllUsers);
router.get('/:id', authenticate, isStaffOrAdmin, userController.getUserById);
router.post('/', authenticate, isAdmin, userController.createUser);
router.put('/:id', authenticate, isAdmin, userController.updateUser);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

module.exports = router;
