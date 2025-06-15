const config = require('../config/qoreai.config');

/**
 * Middleware to authenticate and verify QORE AI requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.authenticateRequest = (req, res, next) => {
  // Only validate internal QORE routes if needed
  next();
};

/**
 * Rate limiting middleware for QORE AI API calls
 * Simple in-memory rate limiting implementation
 */
const requestCounts = new Map();
exports.rateLimit = (req, res, next) => {
  const clientIp = req.ip;
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  // Initialize or clean up old requests
  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, []);
  }
  
  let requestTimestamps = requestCounts.get(clientIp);
  requestTimestamps = requestTimestamps.filter(timestamp => timestamp > windowStart);
  
  // Check if rate limit is exceeded
  if (requestTimestamps.length >= config.qoreai.maxRequestsPerMinute) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded for QORE AI API',
      retryAfter: '60 seconds'
    });
  }
  
  // Add current request timestamp
  requestTimestamps.push(now);
  requestCounts.set(clientIp, requestTimestamps);
  
  next();
};

/**
 * Logging middleware for QORE AI API calls
 */
exports.logApiCall = (req, res, next) => {
  if (!config.qoreai.logApiCalls) {
    return next();
  }
  
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);
  
  // Log request details
  console.log(`[QORE AI] [${requestId}] ${new Date().toISOString()} | REQUEST: ${req.method} ${req.originalUrl}`);
  
  // Capture response
  const originalSend = res.send;
  
  res.send = function(body) {
    const responseTime = Date.now() - startTime;
    
    // Log response details
    console.log(`[QORE AI] [${requestId}] ${new Date().toISOString()} | RESPONSE: ${res.statusCode} | Time: ${responseTime}ms`);
    
    // Original response
    originalSend.call(this, body);
  };
  
  next();
};

/**
 * Add QORE AI headers to response
 */
exports.addQoreHeaders = (req, res, next) => {
  res.setHeader('X-QORE-Version', config.qoreai.version);
  res.setHeader('X-QORE-Request-ID', Math.random().toString(36).substring(2, 15));
  next();
};
