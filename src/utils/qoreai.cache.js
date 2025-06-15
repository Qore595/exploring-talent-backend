/**
 * Simple in-memory cache for QORE AI integration
 * In production, consider using a proper cache system like Redis
 */
const cache = new Map();

/**
 * Cache middleware for QORE AI API responses
 * @param {String} key - The cache key, usually endpoint + parameters
 * @param {Number} ttl - Time to live in seconds
 * @returns {Object} Cached data or null
 */
exports.getCache = (key) => {
  if (!cache.has(key)) {
    return null;
  }
  
  const item = cache.get(key);
  
  // Check if cached item has expired
  if (item.expiry < Date.now()) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
};

/**
 * Set cache item
 * @param {String} key - The cache key
 * @param {Object} data - The data to cache
 * @param {Number} ttl - Time to live in seconds
 */
exports.setCache = (key, data, ttl) => {
  cache.set(key, {
    data,
    expiry: Date.now() + (ttl * 1000)
  });
};

/**
 * Clear all cache or specific key
 * @param {String} key - Optional key to clear specific cache item
 */
exports.clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};
