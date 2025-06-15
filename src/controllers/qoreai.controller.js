const axios = require('axios');
const config = require('../config/qoreai.config');
const cache = require('../utils/qoreai.cache');

/**
 * Get call messages from UltraVox AI API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with call messages data
 */
exports.getCallMessages = async (req, res) => {
  try {
    const { call_id } = req.params;
    
    if (!call_id) {
      return res.status(400).json({
        success: false,
        message: 'Call ID is required',
        source: 'QORE AI'
      });
    }

    // Cache key for this request
    const cacheKey = `call_messages_${call_id}`;
    
    // Check if we have a cached response and caching is enabled
    if (config.qoreai.enableCaching) {
      const cachedData = cache.getCache(cacheKey);
      if (cachedData) {
        // Return cached data with cache header
        res.setHeader('X-QORE-Cache', 'HIT');
        return res.status(200).json(cachedData);
      }
    }

    // Prepare the request to UltraVox API
    console.log('Using UltraVox API Key:', config.ultravox.apiKey);
    const apiUrl = `${config.ultravox.baseUrl}/api/calls/${call_id}/messages`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'X-API-Key': config.ultravox.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'QORE AI Integration/1.0'
      },
      timeout: config.ultravox.timeout
    });

    // Handle UltraVox API errors
    if (response.status !== 200) {
      throw new Error(`UltraVox API error: ${response.statusText}`);
    }

    // Format the response to match UltraVox structure
    const formattedData = {
      success: true,
      source: "UltraVox AI",
      data: response.data
    };

    // Enrich the response data with additional QORE specific info
    const enrichedData = {
      success: true,
      source: 'UltraVox AI',
      data: formattedData.data,
      timestamp: new Date().toISOString(),
      qoreIntegrationVersion: config.qoreai.version
    };

    // Cache the response if caching is enabled
    if (config.qoreai.enableCaching) {
      cache.setCache(cacheKey, enrichedData, config.qoreai.cacheExpiration);
    }
    
    res.setHeader('X-QORE-Cache', 'MISS');
    return res.status(200).json(enrichedData);
  } catch (error) {
    console.error('Error fetching call messages from UltraVox:', error);
    
    let statusCode = 500;
    let errorMessage = 'Unknown error';
    let errorDetail = null;
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || `Server responded with ${statusCode}`;
      errorDetail = error.response.data;

      // Special handling for 404 errors
      if (statusCode === 404) {
        return res.status(404).json({
          success: false,
          message: 'Failed to fetch call messages',
          error: 'Call not found',
          source: 'UltraVox AI'
        });
      }
    } else if (error.request) {
      // The request was made but no response was received
      statusCode = 503;
      errorMessage = 'UltraVox AI service unavailable';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request to UltraVox AI timed out';
      }
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }
    
    return res.status(statusCode).json({
      success: false,
      timestamp: new Date().toISOString(),
      message: 'Failed to fetch call messages',
      error: errorMessage,
      source: 'UltraVox AI'
    });
  }
};

/**
 * Get call message by ID from UltraVox AI API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with specific message data
 */
exports.getCallMessageById = async (req, res) => {
  try {
    const { call_id, message_id } = req.params;
    
    if (!call_id || !message_id) {
      return res.status(400).json({
        success: false,
        message: 'Both Call ID and Message ID are required'
      });
    }

    // Cache key for this request
    const cacheKey = `call_message_${call_id}_${message_id}`;
    
    // Check if we have a cached response and caching is enabled
    if (config.qoreai.enableCaching) {
      const cachedData = cache.getCache(cacheKey);
      if (cachedData) {
        // Return cached data with cache header
        res.setHeader('X-QORE-Cache', 'HIT');
        return res.status(200).json(cachedData);
      }
    }

    // Prepare the request to UltraVox API
    console.log('Using UltraVox API Key:', config.ultravox.apiKey);
    const apiUrl = `${config.ultravox.baseUrl}/api/calls/${call_id}/messages/${message_id}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'X-API-Key': config.ultravox.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'QORE AI Integration/1.0'
      },
      timeout: config.ultravox.timeout
    });

    // Handle UltraVox API errors
    if (response.status !== 200) {
      throw new Error(`UltraVox API error: ${response.statusText}`);
    }

    // Format the response to match UltraVox structure
    const formattedData = {
      success: true,
      source: "UltraVox AI",
      data: response.data
    };

    const responseData = {
      success: true,
      source: 'UltraVox AI',
      data: formattedData.data,
      timestamp: new Date().toISOString(),
      qoreIntegrationVersion: config.qoreai.version
    };

    // Cache the response if caching is enabled
    if (config.qoreai.enableCaching) {
      cache.setCache(cacheKey, responseData, config.qoreai.cacheExpiration);
    }
    
    res.setHeader('X-QORE-Cache', 'MISS');
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching specific call message from UltraVox:', error);
    
    let statusCode = 500;
    let errorMessage = 'Unknown error';
    
    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx range
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || `Server responded with ${statusCode}`;

      // Special handling for 404 errors
      if (statusCode === 404) {
        return res.status(404).json({
          success: false,
          message: 'Failed to fetch call message',
          error: 'Message not found',
          source: 'UltraVox AI'
        });
      }
    } else if (error.request) {
      // The request was made but no response was received
      statusCode = 503;
      errorMessage = 'UltraVox AI service unavailable';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request to UltraVox AI timed out';
      }
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }
    
    return res.status(statusCode).json({
      success: false,
      timestamp: new Date().toISOString(),
      message: 'Failed to fetch call message',
      error: errorMessage,
      source: 'UltraVox AI'
    });
  }
};

/**
 * Analyze call conversation from UltraVox AI API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with analysis data
 */
exports.analyzeCallConversation = async (req, res) => {
  try {
    const { call_id } = req.params;
    const { analysis_type = 'default' } = req.query;
    
    if (!call_id) {
      return res.status(400).json({
        success: false,
        message: 'Call ID is required'
      });
    }

    // Validate analysis type
    const validAnalysisTypes = ['default', 'sentiment', 'topics', 'full'];
    if (!validAnalysisTypes.includes(analysis_type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid analysis_type. Must be one of: ${validAnalysisTypes.join(', ')}`
      });
    }

    // Cache key for this request
    const cacheKey = `call_analysis_${call_id}_${analysis_type}`;
    
    // Check if we have a cached response
    if (config.qoreai.enableCaching) {
      const cachedData = cache.getCache(cacheKey);
      if (cachedData) {
        // Return cached data with cache header
        res.setHeader('X-QORE-Cache', 'HIT');
        return res.status(200).json(cachedData);
      }
    }

    // First, get all messages for the call from UltraVox
    console.log('Using UltraVox API Key:', config.ultravox.apiKey);
    const apiUrl = `${config.ultravox.baseUrl}/api/calls/${call_id}/messages`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'X-API-Key': config.ultravox.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'QORE AI Integration/1.0'
      },
      timeout: config.ultravox.timeout
    });

    // Handle UltraVox API errors
    if (response.status !== 200) {
      throw new Error(`UltraVox API error: ${response.statusText}`);
    }

    // Format the response to match UltraVox structure
    const formattedData = {
      success: true,
      source: "UltraVox AI",
      data: response.data
    };

    // Check if we have messages to analyze
    if (!formattedData.data || !formattedData.data.results || formattedData.data.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Failed to analyze call conversation',
        error: 'No messages found for this call',
        source: 'QORE AI'
      });
    }

    // Perform analysis on the messages based on requested type
    const analysisResults = performAnalysis(formattedData.data.results, analysis_type);

    const responseData = {
      success: true,
      source: 'QORE AI',
      call_id: call_id,
      analysis_type: analysis_type,
      analysis: analysisResults,
      raw_messages_count: formattedData.data.results.length,
      timestamp: new Date().toISOString()
    };

    // Cache the response if caching is enabled
    if (config.qoreai.enableCaching) {
      cache.setCache(cacheKey, responseData, config.qoreai.cacheExpiration);
    }
    
    res.setHeader('X-QORE-Cache', 'MISS');
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error analyzing call conversation:', error);
    
    let statusCode = 500;
    let errorMessage = 'Unknown error';
    
    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx range
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || `Server responded with ${statusCode}`;

      // Special handling for 404 errors
      if (statusCode === 404) {
        return res.status(404).json({
          success: false,
          message: 'Failed to analyze call conversation',
          error: 'Call not found'
        });
      }
    } else if (error.request) {
      // The request was made but no response was received
      statusCode = 503;
      errorMessage = 'UltraVox AI service unavailable';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Analysis request timed out';
      }
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }
    
    return res.status(statusCode).json({
      success: false,
      message: 'Failed to analyze call conversation',
      error: errorMessage
    });
  }
};

/**
 * Helper function to perform analysis on messages
 * @param {Array} messages - Array of message objects from UltraVox API
 * @param {String} type - Type of analysis to perform
 * @returns {Object} Analysis results
 */
function performAnalysis(messages, type) {
  // Basic message statistics
  const summary = {
    totalMessages: messages.length,
    messagesByRole: {},
    errorMessages: messages.filter(msg => msg.errorDetails).length,
    avgResponseTime: calculateAverageResponseTime(messages)
  };

  // Count messages by role
  messages.forEach(msg => {
    const role = msg.role || 'UNKNOWN';
    summary.messagesByRole[role] = (summary.messagesByRole[role] || 0) + 1;
  });

  // Return analysis based on requested type
  switch (type) {
    case 'sentiment':
      return {
        summary,
        sentiment: analyzeMessageSentiment(messages)
      };
    case 'topics':
      return {
        summary,
        topics: analyzeTopics(messages)
      };
    case 'full':
      return {
        summary,
        sentiment: analyzeMessageSentiment(messages),
        topics: analyzeTopics(messages)
      };
    case 'default':
    default:
      return { summary };
  }
}

/**
 * Calculate average response time between messages
 * @param {Array} messages - Array of message objects
 * @returns {Number} Average response time in seconds
 */
function calculateAverageResponseTime(messages) {
  if (!messages || messages.length < 2) return 0;
  
  let totalResponseTime = 0;
  let responsesCount = 0;
  
  // Sort messages by start time if not already sorted
  const sortedMessages = [...messages].sort((a, b) => {
    const aStart = a.timespan?.start ? new Date(a.timespan.start) : 0;
    const bStart = b.timespan?.start ? new Date(b.timespan.start) : 0;
    return aStart - bStart;
  });
  
  for (let i = 1; i < sortedMessages.length; i++) {
    const prevMsg = sortedMessages[i-1];
    const currMsg = sortedMessages[i];
    
    if (prevMsg.timespan?.end && currMsg.timespan?.start) {
      const prevEnd = new Date(prevMsg.timespan.end);
      const currStart = new Date(currMsg.timespan.start);
      
      const diffSeconds = (currStart - prevEnd) / 1000;
      
      // Only count realistic response times (between 0.1 and 30 seconds)
      if (diffSeconds > 0.1 && diffSeconds < 30) {
        totalResponseTime += diffSeconds;
        responsesCount++;
      }
    }
  }
  
  return responsesCount > 0 ? parseFloat((totalResponseTime / responsesCount).toFixed(2)) : 0;
}

/**
 * Analyze sentiment of messages
 * @param {Array} messages - Array of message objects
 * @returns {Object} Sentiment analysis results
 */
function analyzeMessageSentiment(messages) {
  // This is a simplified mock implementation
  // In a production environment, you would use a proper NLP service
  const textContent = messages
    .filter(msg => msg.text)
    .map(msg => msg.text);
  
  // Simple keyword-based sentiment analysis for demonstration
  const positiveWords = ['great', 'good', 'excellent', 'thank', 'appreciate', 'happy', 'yes'];
  const negativeWords = ['bad', 'issue', 'problem', 'sorry', 'cannot', 'error', 'fail', 'no'];
  
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  textContent.forEach(text => {
    const lowerText = text.toLowerCase();
    const posCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (posCount > negCount) positive++;
    else if (negCount > posCount) negative++;
    else neutral++;
  });
  
  const total = positive + negative + neutral;
  const overallSentiment = positive > negative 
    ? 'positive' 
    : negative > positive 
      ? 'negative' 
      : 'neutral';
  
  return {
    overall: overallSentiment,
    breakdown: {
      positive,
      neutral,
      negative
    }
  };
}

/**
 * Analyze topics in messages
 * @param {Array} messages - Array of message objects
 * @returns {Object} Topic analysis results
 */
function analyzeTopics(messages) {
  // This is a simplified mock implementation
  // In a production environment, you would use a proper NLP service
  
  // Extract text content
  const textContent = messages
    .filter(msg => msg.text)
    .map(msg => msg.text)
    .join(' ')
    .toLowerCase();
  
  // Predefined topic keywords for demonstration
  const topicKeywords = {
    'product inquiry': ['product', 'purchase', 'buy', 'feature', 'specification'],
    'pricing': ['price', 'cost', 'discount', 'offer', 'package', 'subscription'],
    'technical support': ['help', 'issue', 'problem', 'error', 'not working', 'broken'],
    'account': ['account', 'login', 'password', 'profile', 'settings'],
    'shipping': ['ship', 'delivery', 'track', 'package', 'arrived'],
    'features': ['feature', 'capability', 'function', 'can it', 'does it']
  };
  
  // Count keyword occurrences for each topic
  const topicCounts = {};
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    topicCounts[topic] = keywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = textContent.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  });
  
  // Sort topics by count
  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 0)
    .map(([topic]) => topic);
  
  // Determine confidence level
  const topCount = sortedTopics.length > 0 ? topicCounts[sortedTopics[0]] : 0;
  let confidence = 'low';
  
  if (topCount > 5) {
    confidence = 'high';
  } else if (topCount > 2) {
    confidence = 'medium';
  }
  
  return {
    mainTopics: sortedTopics.slice(0, 3), // Return top 3 topics
    confidence: confidence
  };
}

module.exports = {
  getCallMessages: exports.getCallMessages,
  getCallMessageById: exports.getCallMessageById,
  analyzeCallConversation: exports.analyzeCallConversation
};