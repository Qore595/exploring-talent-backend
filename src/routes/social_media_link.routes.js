const express = require('express');
const router = express.Router();
const socialMediaLinkController = require('../controllers/social_media_link.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all social media links - accessible by admin
router.get('/', isAdmin, socialMediaLinkController.getAllSocialMediaLinks);

// Get social media link by ID - accessible by admin
router.get('/:id', isAdmin, socialMediaLinkController.getSocialMediaLinkById);

// Create new social media link - accessible by admin
router.post('/', isAdmin, socialMediaLinkController.createSocialMediaLink);

// Update social media link - accessible by admin
router.put('/:id', isAdmin, socialMediaLinkController.updateSocialMediaLink);

// Delete social media link - accessible by admin
router.delete('/:id', isAdmin, socialMediaLinkController.deleteSocialMediaLink);

module.exports = router;
