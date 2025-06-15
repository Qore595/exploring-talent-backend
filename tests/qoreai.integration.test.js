/**
 * QORE AI Integration Test Suite
 * Tests the functionality of the QORE AI integration with UltraVox
 */

const request = require('supertest');
const express = require('express');
const qoreaiRoutes = require('../src/routes/qoreai.routes');
const axios = require('axios');
const config = require('../src/config/qoreai.config');
const cache = require('../src/utils/qoreai.cache');

// Mock axios and cache
jest.mock('axios');
jest.mock('../src/utils/qoreai.cache');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/qoreai', qoreaiRoutes);

// Sample mock data
const mockCallMessages = {
  results: [
    {
      id: 'msg_123',
      role: 'agent',
      content: 'Hello, how can I help you today?',
      timespan: {
        start: '2025-06-01T10:00:00Z',
        end: '2025-06-01T10:00:10Z'
      }
    },
    {
      id: 'msg_124',
      role: 'customer',
      content: 'I have a question about my recent order.',
      timespan: {
        start: '2025-06-01T10:00:15Z',
        end: '2025-06-01T10:00:25Z'
      }
    }
  ]
};

// Reset mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
  
  // Set environment variable for testing
  process.env.QORE_INTERNAL_API_KEY = 'test-api-key';
  
  // Mock the API key in request headers
  app.use((req, res, next) => {
    req.headers['x-qore-api-key'] = 'test-api-key';
    next();
  });
});

describe('QORE AI Integration Tests', () => {
  describe('GET /api/qoreai/calls/:call_id/messages', () => {
    it('should fetch call messages successfully', async () => {
      // Mock axios.get to resolve with sample data
      axios.get.mockResolvedValue({ data: mockCallMessages });
      
      // Mock cache.getCache to return null (cache miss)
      cache.getCache.mockReturnValue(null);
      
      const res = await request(app).get('/api/qoreai/calls/call_123/messages');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toEqual(mockCallMessages);
    });
    
    it('should return cached data when available', async () => {
      // Mock cached data
      const cachedData = {
        success: true,
        source: 'UltraVox AI',
        data: mockCallMessages,
        timestamp: new Date().toISOString(),
        qoreIntegrationVersion: '1.0.0'
      };
      
      // Mock cache.getCache to return cached data
      cache.getCache.mockReturnValue(cachedData);
      
      const res = await request(app).get('/api/qoreai/calls/call_123/messages');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(cachedData);
      expect(axios.get).not.toHaveBeenCalled(); // API should not be called when cache hits
    });
    
    it('should handle API errors gracefully', async () => {
      // Mock axios.get to reject with error
      axios.get.mockRejectedValue({ 
        response: { 
          status: 404, 
          data: { message: 'Call not found' } 
        } 
      });
      
      const res = await request(app).get('/api/qoreai/calls/nonexistent_call/messages');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
      expect(res.body.error.message).toEqual('Call not found');
    });
  });
  
  // Additional test cases for other endpoints
  // ...
});
