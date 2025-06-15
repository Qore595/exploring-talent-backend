const express = require('express');
const router = express.Router();
const qoreaiController = require('../controllers/qoreai.controller');
const qoreaiMiddleware = require('../middleware/qoreai.middleware');

// Apply middleware to all routes
router.use([
  qoreaiMiddleware.authenticateRequest,
  qoreaiMiddleware.logApiCall,
  qoreaiMiddleware.rateLimit,
  qoreaiMiddleware.addQoreHeaders
]);

/**
 * @route GET /api/qoreai/calls/:call_id/messages
 * @desc Get all messages for a specific call from UltraVox AI
 * @access Private
 */
router.get('/calls/:call_id/messages', qoreaiController.getCallMessages);

/**
 * @route GET /api/qoreai/calls/:call_id/messages/:message_id
 * @desc Get a specific message from a call from UltraVox AI
 * @access Private
 */
router.get('/calls/:call_id/messages/:message_id', qoreaiController.getCallMessageById);

/**
 * @route GET /api/qoreai/calls/:call_id/analysis
 * @desc Get analysis of call conversation
 * @access Private
 */
router.get('/calls/:call_id/analysis', qoreaiController.analyzeCallConversation);

module.exports = router;
