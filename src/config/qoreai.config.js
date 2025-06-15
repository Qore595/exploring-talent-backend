/**
 * QORE AI Integration Configuration
 * Configuration settings for QORE AI's integration with third-party services
 */

module.exports = {
  // UltraVox API configuration
  ultravox: {
    baseUrl: process.env.ULTRAVOX_API_URL || 'https://api.ultravox.ai',
    apiKey: process.env.ULTRAVOX_API_KEY || '',
    timeout: parseInt(process.env.ULTRAVOX_API_TIMEOUT || '5000'),
    retries: parseInt(process.env.ULTRAVOX_API_RETRIES || '3')
  },
  
  // QORE AI integration settings
  qoreai: {
    version: '1.0.0',
    enableCaching: process.env.QOREAI_ENABLE_CACHING === 'true',
    cacheExpiration: parseInt(process.env.QOREAI_CACHE_EXPIRATION || '300'), // 5 minutes in seconds
    logApiCalls: process.env.QOREAI_LOG_API_CALLS === 'true',
    maxRequestsPerMinute: parseInt(process.env.QOREAI_MAX_REQUESTS_PER_MINUTE || '60')
  }
};
