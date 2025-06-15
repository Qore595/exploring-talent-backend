# Email Template API Documentation

This document provides details on the Email Template API endpoints available in the Talent Spark backend system.

## Base URL

```
http://localhost:3001/api/email-templates
```

## Authentication

All API endpoints require authentication. Most endpoints require admin privileges, while some are accessible to staff users. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## API Endpoints

### Get All Email Templates

Retrieves a list of all email templates with pagination and filtering options.

- **URL**: `/api/email-templates`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
  - `is_active` (optional): Filter by active status (true/false)
  - `email_type` (optional): Filter by email type (e.g., "transactional", "marketing")
  - `search` (optional): Search in name, template_code, and subject fields

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "template_code": "welcome_email",
      "name": "Welcome Email",
      "subject": "Welcome to Our Platform",
      "body_html": "<h1>Welcome!</h1><p>Thank you for joining our platform, {NAME}.</p>",
      "body_text": "Welcome! Thank you for joining our platform, {NAME}.",
      "variables": "NAME",
      "email_type": "transactional",
      "description": "Sent to new users after registration",
      "is_active": true,
      "is_system": true,
      "from_name": "Support Team",
      "from_email": "support@example.com",
      "reply_to": "no-reply@example.com",
      "cc": null,
      "bcc": "records@example.com",
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

### Get Email Template by ID

Retrieves a specific email template by its ID.

- **URL**: `/api/email-templates/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **URL Parameters**:
  - `id`: ID of the email template

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "template_code": "welcome_email",
    "name": "Welcome Email",
    "subject": "Welcome to Our Platform",
    "body_html": "<h1>Welcome!</h1><p>Thank you for joining our platform, {NAME}.</p>",
    "body_text": "Welcome! Thank you for joining our platform, {NAME}.",
    "variables": "NAME",
    "email_type": "transactional",
    "description": "Sent to new users after registration",
    "is_active": true,
    "is_system": true,
    "from_name": "Support Team",
    "from_email": "support@example.com",
    "reply_to": "no-reply@example.com",
    "cc": null,
    "bcc": "records@example.com",
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T10:30:00.000Z",
    "updated_at": "2023-05-15T10:30:00.000Z"
  }
}
```

### Get Email Template by Template Code

Retrieves a specific email template by its template code. This endpoint is accessible to both staff and admin users.

- **URL**: `/api/email-templates/code/:code`
- **Method**: `GET`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `code`: Template code of the email template

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "template_code": "welcome_email",
    "name": "Welcome Email",
    "subject": "Welcome to Our Platform",
    "body_html": "<h1>Welcome!</h1><p>Thank you for joining our platform, {NAME}.</p>",
    "body_text": "Welcome! Thank you for joining our platform, {NAME}.",
    "variables": "NAME",
    "email_type": "transactional",
    "description": "Sent to new users after registration",
    "is_active": true,
    "is_system": true,
    "from_name": "Support Team",
    "from_email": "support@example.com",
    "reply_to": "no-reply@example.com",
    "cc": null,
    "bcc": "records@example.com",
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T10:30:00.000Z",
    "updated_at": "2023-05-15T10:30:00.000Z"
  }
}
```

### Create Email Template

Creates a new email template.

- **URL**: `/api/email-templates`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Request Body**:

```json
{
  "template_code": "password_reset",
  "name": "Password Reset Email",
  "subject": "Reset Your Password",
  "body_html": "<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href='{RESET_LINK}'>Reset Password</a></p><p>This link will expire in {EXPIRY} minutes.</p>",
  "body_text": "Password Reset\n\nClick the link below to reset your password:\n{RESET_LINK}\n\nThis link will expire in {EXPIRY} minutes.",
  "variables": "RESET_LINK,EXPIRY",
  "email_type": "transactional",
  "description": "Sent when a user requests a password reset",
  "is_active": true,
  "is_system": false,
  "from_name": "Security Team",
  "from_email": "security@example.com",
  "reply_to": "no-reply@example.com",
  "created_by": 1
}
```

#### Success Response

- **Code**: `201 Created`
- **Content Example**:

```json
{
  "success": true,
  "message": "Email template created successfully",
  "data": {
    "id": 2,
    "template_code": "password_reset",
    "name": "Password Reset Email",
    "subject": "Reset Your Password",
    "body_html": "<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href='{RESET_LINK}'>Reset Password</a></p><p>This link will expire in {EXPIRY} minutes.</p>",
    "body_text": "Password Reset\n\nClick the link below to reset your password:\n{RESET_LINK}\n\nThis link will expire in {EXPIRY} minutes.",
    "variables": "RESET_LINK,EXPIRY",
    "email_type": "transactional",
    "description": "Sent when a user requests a password reset",
    "is_active": true,
    "is_system": false,
    "from_name": "Security Team",
    "from_email": "security@example.com",
    "reply_to": "no-reply@example.com",
    "cc": null,
    "bcc": null,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T11:30:00.000Z",
    "updated_at": "2023-05-15T11:30:00.000Z"
  }
}
```

### Update Email Template

Updates an existing email template.

- **URL**: `/api/email-templates/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin)
- **URL Parameters**:
  - `id`: ID of the email template to update
- **Request Body**:

```json
{
  "subject": "Reset Your Password - Updated",
  "body_html": "<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href='{RESET_LINK}'>Reset Password</a></p><p>This link will expire in {EXPIRY} minutes.</p><p>If you did not request this reset, please ignore this email.</p>",
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
  "message": "Email template updated successfully",
  "data": {
    "id": 2,
    "template_code": "password_reset",
    "name": "Password Reset Email",
    "subject": "Reset Your Password - Updated",
    "body_html": "<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href='{RESET_LINK}'>Reset Password</a></p><p>This link will expire in {EXPIRY} minutes.</p><p>If you did not request this reset, please ignore this email.</p>",
    "body_text": "Password Reset\n\nClick the link below to reset your password:\n{RESET_LINK}\n\nThis link will expire in {EXPIRY} minutes.",
    "variables": "RESET_LINK,EXPIRY",
    "email_type": "transactional",
    "description": "Sent when a user requests a password reset",
    "is_active": true,
    "is_system": false,
    "from_name": "Security Team",
    "from_email": "security@example.com",
    "reply_to": "no-reply@example.com",
    "cc": null,
    "bcc": null,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-05-15T11:30:00.000Z",
    "updated_at": "2023-05-15T12:15:00.000Z"
  }
}
```

### Delete Email Template

Soft deletes an email template.

- **URL**: `/api/email-templates/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)
- **URL Parameters**:
  - `id`: ID of the email template to delete

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "message": "Email template deleted successfully"
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
  "message": "Email template not found"
}
```

### Validation Error

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "Template code, name, subject, and HTML body are required"
}
```

### System Template Error

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "Cannot delete a system template"
}
```

### Server Error

- **Code**: `500 Internal Server Error`
- **Content**:

```json
{
  "success": false,
  "message": "Failed to fetch email templates",
  "error": "Error details"
}
```
