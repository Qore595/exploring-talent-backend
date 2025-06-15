# Talent Spark Configurations API

This API allows you to manage Talent Spark configurations for voice and LLM interactions.

## Base URL

```
/api/talent-spark-configurations
```

## Authentication

All endpoints require authentication. Use a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Endpoints

### Get All Configurations

Retrieves a paginated list of Talent Spark configurations with optional filtering.

**URL**: `GET /api/talent-spark-configurations`

**Access**: Staff or Admin

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Number | Page number (default: 1) |
| limit | Number | Items per page (default: 10) |
| branch_id | Number | Filter by branch ID |
| name | String | Filter by configuration name |
| status | String | Filter by status (draft, testing, production, archived) |
| is_active | Boolean | Filter by active status |
| is_default | Boolean | Filter by default status |
| search | String | Search in name and title |

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "branch_id": 1,
      "name": "Default Customer Service",
      "title": "Customer Service AI Assistant",
      "overview": "AI assistant for handling customer service inquiries",
      "system_prompt": "You are a helpful customer service assistant...",
      "model": "fixie-ai/ultravox-70B",
      "voice": "en-US-Neural2-F",
      "api_key": "sk_123456789",
      "language_hint": "en-US",
      "temperature": 0.7,
      "max_duration": "600s",
      "time_exceeded_message": "I'm sorry, but our conversation has reached its time limit...",
      "is_active": true,
      "is_default": true,
      "version": "1.0",
      "status": "production",
      "callback_url": "https://example.com/webhook",
      "analytics_enabled": true,
      "additional_settings": {
        "greeting": "Hello! How can I help you today?",
        "farewell": "Thank you for contacting us. Have a great day!"
      },
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-06-01T10:00:00Z",
      "updated_at": "2023-06-01T10:00:00Z",
      "branch": {
        "id": 1,
        "name": "Headquarters"
      }
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "total_pages": 1
  }
}
```

### Get Configuration by ID

Retrieves a specific Talent Spark configuration by its ID.

**URL**: `GET /api/talent-spark-configurations/:id`

**Access**: Staff or Admin

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Configuration ID |

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "branch_id": 1,
    "name": "Default Customer Service",
    "title": "Customer Service AI Assistant",
    "overview": "AI assistant for handling customer service inquiries",
    "system_prompt": "You are a helpful customer service assistant...",
    "model": "fixie-ai/ultravox-70B",
    "voice": "en-US-Neural2-F",
    "api_key": "sk_123456789",
    "language_hint": "en-US",
    "temperature": 0.7,
    "max_duration": "600s",
    "time_exceeded_message": "I'm sorry, but our conversation has reached its time limit...",
    "is_active": true,
    "is_default": true,
    "version": "1.0",
    "status": "production",
    "callback_url": "https://example.com/webhook",
    "analytics_enabled": true,
    "additional_settings": {
      "greeting": "Hello! How can I help you today?",
      "farewell": "Thank you for contacting us. Have a great day!"
    },
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-06-01T10:00:00Z",
    "updated_at": "2023-06-01T10:00:00Z",
    "branch": {
      "id": 1,
      "name": "Headquarters"
    }
  }
}
```

### Get Configurations by Branch ID

Retrieves all Talent Spark configurations for a specific branch.

**URL**: `GET /api/talent-spark-configurations/branch/:branchId`

**Access**: Staff or Admin

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| branchId | Number | Branch ID |

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| is_active | Boolean | Filter by active status |
| status | String | Filter by status (draft, testing, production, archived) |

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "branch_id": 1,
      "name": "Default Customer Service",
      "title": "Customer Service AI Assistant",
      "overview": "AI assistant for handling customer service inquiries",
      "system_prompt": "You are a helpful customer service assistant...",
      "model": "fixie-ai/ultravox-70B",
      "voice": "en-US-Neural2-F",
      "api_key": "sk_123456789",
      "language_hint": "en-US",
      "temperature": 0.7,
      "max_duration": "600s",
      "time_exceeded_message": "I'm sorry, but our conversation has reached its time limit...",
      "is_active": true,
      "is_default": true,
      "version": "1.0",
      "status": "production",
      "callback_url": "https://example.com/webhook",
      "analytics_enabled": true,
      "additional_settings": {
        "greeting": "Hello! How can I help you today?",
        "farewell": "Thank you for contacting us. Have a great day!"
      },
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-06-01T10:00:00Z",
      "updated_at": "2023-06-01T10:00:00Z",
      "branch": {
        "id": 1,
        "name": "Headquarters"
      }
    }
  ]
}
```

### Get Default Configuration for Branch

Retrieves the default Talent Spark configuration for a specific branch.

**URL**: `GET /api/talent-spark-configurations/branch/:branchId/default`

**Access**: Staff or Admin

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| branchId | Number | Branch ID |

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "branch_id": 1,
    "name": "Default Customer Service",
    "title": "Customer Service AI Assistant",
    "overview": "AI assistant for handling customer service inquiries",
    "system_prompt": "You are a helpful customer service assistant...",
    "model": "fixie-ai/ultravox-70B",
    "voice": "en-US-Neural2-F",
    "api_key": "sk_123456789",
    "language_hint": "en-US",
    "temperature": 0.7,
    "max_duration": "600s",
    "time_exceeded_message": "I'm sorry, but our conversation has reached its time limit...",
    "is_active": true,
    "is_default": true,
    "version": "1.0",
    "status": "production",
    "callback_url": "https://example.com/webhook",
    "analytics_enabled": true,
    "additional_settings": {
      "greeting": "Hello! How can I help you today?",
      "farewell": "Thank you for contacting us. Have a great day!"
    },
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-06-01T10:00:00Z",
    "updated_at": "2023-06-01T10:00:00Z",
    "branch": {
      "id": 1,
      "name": "Headquarters"
    }
  }
}
```

### Create Configuration

Creates a new Talent Spark configuration.

**URL**: `POST /api/talent-spark-configurations`

**Access**: Admin only

**Request Body**:

```json
{
  "branch_id": 1,
  "name": "Sales Assistant",
  "title": "Sales AI Assistant",
  "overview": "AI assistant for handling sales inquiries",
  "system_prompt": "You are a helpful sales assistant...",
  "model": "fixie-ai/ultravox-70B",
  "voice": "en-US-Neural2-M",
  "api_key": "sk_987654321",
  "language_hint": "en-US",
  "temperature": 0.8,
  "max_duration": "900s",
  "time_exceeded_message": "I'm sorry, but our conversation has reached its time limit...",
  "is_active": true,
  "is_default": false,
  "version": "1.0",
  "status": "draft",
  "callback_url": "https://example.com/sales-webhook",
  "analytics_enabled": true,
  "additional_settings": {
    "greeting": "Hello! How can I assist you with your purchase today?",
    "farewell": "Thank you for your interest. Have a great day!"
  },
  "created_by": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "Talent Spark configuration created successfully",
  "data": {
    "id": 2,
    "branch_id": 1,
    "name": "Sales Assistant",
    "title": "Sales AI Assistant",
    "overview": "AI assistant for handling sales inquiries",
    "system_prompt": "You are a helpful sales assistant...",
    "model": "fixie-ai/ultravox-70B",
    "voice": "en-US-Neural2-M",
    "api_key": "sk_987654321",
    "language_hint": "en-US",
    "temperature": 0.8,
    "max_duration": "900s",
    "time_exceeded_message": "I'm sorry, but our conversation has reached its time limit...",
    "is_active": true,
    "is_default": false,
    "version": "1.0",
    "status": "draft",
    "callback_url": "https://example.com/sales-webhook",
    "analytics_enabled": true,
    "additional_settings": {
      "greeting": "Hello! How can I assist you with your purchase today?",
      "farewell": "Thank you for your interest. Have a great day!"
    },
    "created_by": 1,
    "created_at": "2023-06-02T10:00:00Z",
    "updated_at": "2023-06-02T10:00:00Z"
  }
}
```

### Update Configuration

Updates an existing Talent Spark configuration.

**URL**: `PUT /api/talent-spark-configurations/:id`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Configuration ID |

**Request Body**:

```json
{
  "title": "Updated Sales AI Assistant",
  "overview": "Updated AI assistant for handling sales inquiries",
  "system_prompt": "You are a helpful and knowledgeable sales assistant...",
  "temperature": 0.7,
  "is_default": true,
  "status": "testing",
  "updated_by": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "Talent Spark configuration updated successfully",
  "data": {
    "id": 2,
    "branch_id": 1,
    "name": "Sales Assistant",
    "title": "Updated Sales AI Assistant",
    "overview": "Updated AI assistant for handling sales inquiries",
    "system_prompt": "You are a helpful and knowledgeable sales assistant...",
    "model": "fixie-ai/ultravox-70B",
    "voice": "en-US-Neural2-M",
    "api_key": "sk_987654321",
    "language_hint": "en-US",
    "temperature": 0.7,
    "max_duration": "900s",
    "time_exceeded_message": "I'm sorry, but our conversation has reached its time limit...",
    "is_active": true,
    "is_default": true,
    "version": "1.0",
    "status": "testing",
    "callback_url": "https://example.com/sales-webhook",
    "analytics_enabled": true,
    "additional_settings": {
      "greeting": "Hello! How can I assist you with your purchase today?",
      "farewell": "Thank you for your interest. Have a great day!"
    },
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-06-02T10:00:00Z",
    "updated_at": "2023-06-02T11:00:00Z"
  }
}
```

### Delete Configuration

Deletes a Talent Spark configuration.

**URL**: `DELETE /api/talent-spark-configurations/:id`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Configuration ID |

**Response**:

```json
{
  "success": true,
  "message": "Talent Spark configuration deleted successfully"
}
```

### Update Configuration Status

Updates the status of a Talent Spark configuration.

**URL**: `PATCH /api/talent-spark-configurations/:id/status`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Configuration ID |

**Request Body**:

```json
{
  "status": "production",
  "updated_by": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "Talent Spark configuration status updated to production successfully",
  "data": {
    "id": 2,
    "status": "production",
    "updated_by": 1,
    "updated_at": "2023-06-02T12:00:00Z"
  }
}
```
