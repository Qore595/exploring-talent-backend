const express = require('express');
const router = express.Router();
const userSkillController = require('../controllers/user_skill.controller');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get all skills for a specific user
router.get('/user/:userId', isStaffOrAdmin, userSkillController.getUserSkills);

// Get a specific skill by ID
router.get('/:id', isStaffOrAdmin, userSkillController.getUserSkillById);

// Create a new skill for a user
router.post('/user/:userId', isStaffOrAdmin, userSkillController.createUserSkill);

// Update a skill
router.put('/:id', isStaffOrAdmin, userSkillController.updateUserSkill);

// Delete a skill
router.delete('/:id', isStaffOrAdmin, userSkillController.deleteUserSkill);

module.exports = router;
