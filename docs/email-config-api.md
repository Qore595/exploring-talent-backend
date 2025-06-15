# Email Configuration API Documentation

This document provides details on the Email Configuration API endpoints available in the Talent Spark backend system.

## Base URL

```
http://localhost:3001/api/email-configs
```

## Authentication

All API endpoints require authentication with admin privileges. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## API Endpoints

### Get All Email Configurations

Retrieves a list of all email configurations with pagination and filtering options.

- **URL**: `/api/email-configs`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
  - `is_active` (optional): Filter by active status (true/false)
  - `is_default` (optional): Filter by default status (true/false)
  - `email_type` (optional): Filter by email type (e.g., "SMTP", "API")

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email_type": "SMTP",
      "smtp_server": "smtp.example.com",
      "smtp_port": 587,
      "smtp_username": "user@example.com",
      "smtp_password": "********",
      "ssl_tls": "tls",
      "smtp_auth": true,
      "api_key": null,
      "api_secret": null,
      "region": null,
      "from_email": "noreply@example.com",
      "from_name": "Example Company",
      "reply_to_email": "support@example.com",
      "is_active": true,
      "is_default": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-05-15T10:30:00.000Z",
      "updated_at": "2023-05-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### Get Email Configuration by ID

Retrieves a specific email configuration by its ID.

- **URL**: `/api/email-configs/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **URL Parameters**:
  - `id`: ID of the email configuration

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email_type": "SMTP",
    "smtp_server": "smtp.example.com",
    "smtp_port": 587,
    "smtp_username": "user@example.com",
    "smtp_password": "********",
    "ssl_tls": "tls",
    "smtp_auth": true,
    "api_key": null,
    "api_secret": null,
    "region": null,
    "from_email": "noreply@example.com",
    "from_name": "Example Company",
    "reply_to_email": "support@example.com",
    "is_active": true,
    "is_default": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T10:30:00.000Z",
    "updated_at": "2023-05-15T10:30:00.000Z"
  }
}
```

### Create Email Configuration

Creates a new email configuration.

- **URL**: `/api/email-configs`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Request Body**:

```json
{
  "email_type": "SMTP",
  "smtp_server": "smtp.example.com",
  "smtp_port": 587,
  "smtp_username": "user@example.com",
  "smtp_password": "password123",
  "ssl_tls": "tls",
  "smtp_auth": true,
  "from_email": "noreply@example.com",
  "from_name": "Example Company",
  "reply_to_email": "support@example.com",
  "is_active": true,
  "is_default": true,
  "created_by": 1
}
```

#### Success Response

- **Code**: `201 Created`
- **Content Example**:

```json
{
  "success": true,
  "message": "Email configuration created successfully",
  "data": {
    "id": 1,
    "email_type": "SMTP",
    "smtp_server": "smtp.example.com",
    "smtp_port": 587,
    "smtp_username": "user@example.com",
    "smtp_password": "********",
    "ssl_tls": "tls",
    "smtp_auth": true,
    "api_key": null,
    "api_secret": null,
    "region": null,
    "from_email": "noreply@example.com",
    "from_name": "Example Company",
    "reply_to_email": "support@example.com",
    "is_active": true,
    "is_default": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T10:30:00.000Z",
    "updated_at": "2023-05-15T10:30:00.000Z"
  }
}
```

### Update Email Configuration

Updates an existing email configuration.

- **URL**: `/api/email-configs/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)
- **URL Parameters**:
  - `id`: ID of the email configuration to update
- **Request Body**:

```json
{
  "smtp_server": "smtp.newserver.com",
  "smtp_port": 465,
  "ssl_tls": "ssl",
  "from_name": "Updated Company Name",
  "is_active": true,
  "updated_by": 1
}
```

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "message": "Email configuration updated successfully",
  "data": {
    "id": 1,
    "email_type": "SMTP",
    "smtp_server": "smtp.newserver.com",
    "smtp_port": 465,
    "smtp_username": "user@example.com",
    "smtp_password": "********",
    "ssl_tls": "ssl",
    "smtp_auth": true,
    "api_key": null,
    "api_secret": null,
    "region": null,
    "from_email": "noreply@example.com",
    "from_name": "Updated Company Name",
    "reply_to_email": "support@example.com",
    "is_active": true,
    "is_default": true,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-05-15T10:30:00.000Z",
    "updated_at": "2023-05-15T11:45:00.000Z"
  }
}
```

### Delete Email Configuration

Soft deletes an email configuration.

- **URL**: `/api/email-configs/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)
- **URL Parameters**:
  - `id`: ID of the email configuration to delete

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "message": "Email configuration deleted successfully"
}
```

### Set Email Configuration as Default

Sets a specific email configuration as the default.

- **URL**: `/api/email-configs/:id/set-default`
- **Method**: `PATCH`
- **Auth Required**: Yes (Admin)
- **URL Parameters**:
  - `id`: ID of the email configuration to set as default

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "message": "Email configuration set as default successfully",
  "data": {
    "id": 1,
    "email_type": "SMTP",
    "smtp_server": "smtp.example.com",
    "smtp_port": 587,
    "smtp_username": "user@example.com",
    "smtp_password": "********",
    "ssl_tls": "tls",
    "smtp_auth": true,
    "api_key": null,
    "api_secret": null,
    "region": null,
    "from_email": "noreply@example.com",
    "from_name": "Example Company",
    "reply_to_email": "support@example.com",
    "is_active": true,
    "is_default": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T10:30:00.000Z",
    "updated_at": "2023-05-15T12:15:00.000Z"
  }
}
```

## Error Responses

### Authentication Error

- **Code**: `401 Unauthorized`
- **Content**:

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Authorization Error

- **Code**: `403 Forbidden`
- **Content**:

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### Not Found Error

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "success": false,
  "message": "Email configuration not found"
}
```

### Validation Error

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "From email is required"
}
```

### Server Error

- **Code**: `500 Internal Server Error`
- **Content**:

```json
{
  "success": false,
  "message": "Failed to fetch email configurations",
  "error": "Error details"
}
```
