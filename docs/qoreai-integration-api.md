# QORE AI Integration API 🤖

## Overview

The QORE AI Integration API provides a seamless interface between the QORE Backend system and UltraVox AI's conversation analysis capabilities. This API enables applications to retrieve and analyze call messages, providing valuable insights from customer interactions.

### Key Features

- 📞 **Call Message Retrieval**: Fetch all messages from specific calls
- 🧩 **Message Details**: Access detailed information about specific messages
- 📊 **Conversation Analysis**: Get AI-powered analysis of call conversations
- 🔒 **Secure Integration**: Enterprise-grade security with API key authentication
- ⚡ **Rate Limiting**: Protect your systems with built-in rate limiting
- 📈 **Performance Monitoring**: Detailed logging for integration performance

## Base URL

All API endpoints are relative to: `http://localhost:3000/api/qoreai`

## Authentication

All endpoints require authentication. Include your QORE AI API key in the request header:

```
X-QORE-API-Key: {your_api_key}
```

## API Endpoints

### 1. Get Call Messages 📞

Retrieve all messages for a specific call from UltraVox AI.

**Endpoint:** `GET /api/qoreai/calls/{call_id}/messages`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `call_id` | String | Yes | Unique identifier of the call |

**Example Request:**
```bash
GET /api/qoreai/calls/call_123456/messages
```

**Success Response (200):**
```json
{
  "success": true,
  "source": "UltraVox AI",
  "data": {
    "next": "http://api.example.org/accounts/?cursor=cD00ODY%3D\"",
    "previous": "http://api.example.org/accounts/?cursor=cj0xJnA9NDg3",
    "results": [
      {
        "role": "MESSAGE_ROLE_UNSPECIFIED",
        "text": "Hello, how can I help you today?",
        "invocationId": "abc123",
        "toolName": "greetings",
        "errorDetails": null,
        "medium": "MESSAGE_MEDIUM_UNSPECIFIED",
        "callStageMessageIndex": 1,
        "callStageId": "stage_1",
        "callState": {},
        "timespan": {
          "start": "2025-06-02T10:15:30Z",
          "end": "2025-06-02T10:15:35Z"
        }
      }
    ],
    "total": 10
  },
  "timestamp": "2025-06-02T10:20:00.000Z",
  "qoreIntegrationVersion": "1.0.0"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Call ID is required",
  "source": "QORE AI"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Failed to fetch call messages",
  "error": "Call not found",
  "source": "UltraVox AI"
}
```

### 2. Get Specific Call Message 📝

Retrieve a specific message from a call.

**Endpoint:** `GET /api/qoreai/calls/{call_id}/messages/{message_id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `call_id` | String | Yes | Unique identifier of the call |
| `message_id` | String | Yes | Unique identifier of the message |

**Example Request:**
```bash
GET /api/qoreai/calls/call_123456/messages/msg_789012
```

**Success Response (200):**
```json
{
  "success": true,
  "source": "UltraVox AI",
  "data": {
    "role": "MESSAGE_ROLE_UNSPECIFIED",
    "text": "Hello, how can I help you today?",
    "invocationId": "abc123",
    "toolName": "greetings",
    "errorDetails": null,
    "medium": "MESSAGE_MEDIUM_UNSPECIFIED",
    "callStageMessageIndex": 1,
    "callStageId": "stage_1",
    "callState": {},
    "timespan": {
      "start": "2025-06-02T10:15:30Z",
      "end": "2025-06-02T10:15:35Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Both Call ID and Message ID are required"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Failed to fetch call message",
  "error": "Message not found",
  "source": "UltraVox AI"
}
```

### 3. Analyze Call Conversation 🧠

Get AI-powered analysis of a call conversation.

**Endpoint:** `GET /api/qoreai/calls/{call_id}/analysis`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `call_id` | String | Yes | Unique identifier of the call |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `analysis_type` | String | 'default' | Type of analysis to perform (default, sentiment, topics, full) |

**Example Request:**
```bash
GET /api/qoreai/calls/call_123456/analysis?analysis_type=full
```

**Success Response (200):**
```json
{
  "success": true,
  "source": "QORE AI",
  "call_id": "call_123456",
  "analysis_type": "full",
  "analysis": {
    "summary": {
      "totalMessages": 15,
      "messagesByRole": {
        "AGENT": 7,
        "CUSTOMER": 8
      },
      "errorMessages": 0,
      "avgResponseTime": 2.5
    },
    "sentiment": {
      "overall": "positive",
      "breakdown": {
        "positive": 10,
        "neutral": 4,
        "negative": 1
      }
    },
    "topics": {
      "mainTopics": ["product inquiry", "pricing", "features"],
      "confidence": "high"
    }
  },
  "raw_messages_count": 15,
  "timestamp": "2025-06-02T10:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Call ID is required"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Failed to analyze call conversation",
  "error": "Call not found"
}
```

## Rate Limiting

To ensure service quality and prevent abuse, the API implements rate limiting:

- **Default Limit**: 60 requests per minute per client IP
- **Header Information**: Rate limit information is included in response headers
  - `X-Rate-Limit-Limit`: Maximum requests allowed in the current period
  - `X-Rate-Limit-Remaining`: Number of requests remaining in the current period
  - `X-Rate-Limit-Reset`: Time (in seconds) until the rate limit resets

**Rate Limit Exceeded Response (429):**
```json
{
  "success": false,
  "message": "Rate limit exceeded for QORE AI API",
  "retryAfter": "60 seconds"
}
```

## Error Codes

The API uses standard HTTP status codes and returns detailed error messages:

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing API key |
| 403 | Forbidden - Invalid API key |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error |

## Response Headers

All responses include the following custom headers:

| Header | Description |
|--------|-------------|
| X-QORE-Version | Current version of the QORE AI integration |
| X-QORE-Request-ID | Unique identifier for the request (useful for debugging) |

## Usage Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

// Configure the base client
const qoreaiClient = axios.create({
  baseURL: 'http://localhost:3000/api/qoreai',
  headers: {
    'X-QORE-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  }
});

// Get call messages
async function getCallMessages(callId) {
  try {
    const response = await qoreaiClient.get(`/calls/${callId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching call messages:', error.response?.data || error.message);
    throw error;
  }
}

// Analyze call conversation
async function analyzeCall(callId, analysisType = 'full') {
  try {
    const response = await qoreaiClient.get(`/calls/${callId}/analysis`, {
      params: { analysis_type: analysisType }
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing call:', error.response?.data || error.message);
    throw error;
  }
}
```

### Python

```python
import requests

# Configure the base URL and headers
base_url = "http://localhost:3000/api/qoreai"
headers = {
    "X-QORE-API-Key": "your_api_key_here",
    "Content-Type": "application/json"
}

# Get call messages
def get_call_messages(call_id):
    try:
        response = requests.get(f"{base_url}/calls/{call_id}/messages", headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching call messages: {e}")
        raise

# Analyze call conversation
def analyze_call(call_id, analysis_type="full"):
    try:
        response = requests.get(
            f"{base_url}/calls/{call_id}/analysis",
            headers=headers,
            params={"analysis_type": analysis_type}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error analyzing call: {e}")
        raise
```

## Implementation Notes

1. **Environment Variables**: The following environment variables should be set:
   - `ULTRAVOX_API_URL`: Base URL for the UltraVox API
   - `ULTRAVOX_API_KEY`: Your UltraVox API key
   - `QORE_INTERNAL_API_KEY`: Your internal QORE API key for authentication

2. **Error Handling**: The API provides detailed error messages to help with troubleshooting.

3. **Caching**: Consider implementing client-side caching for frequently accessed data.

## Support

For technical support or questions about this API:

- Contact the QORE AI integration team at `qoreai-support@example.com`
- Include the `X-QORE-Request-ID` header value in your support requests for faster troubleshooting

---

*This documentation was last updated on June 2, 2025.*
