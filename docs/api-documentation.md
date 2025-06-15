# API Documentation

This document provides an overview of all available APIs in the Talent Spark backend system.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most API endpoints require authentication. The system supports both user and employee authentication.

### User Authentication

Users can authenticate using the `/api/users/login` endpoint.

### Employee Authentication

Employees can authenticate using the `/api/employee-auth/login` endpoint. An employee login page is available at `/employee-login.html`.

## Available APIs

| API | Description | Documentation |
|-----|-------------|---------------|
| Branches API | API for managing branch locations | [Branches API Documentation](./branches-api.md) |
| Roles API | API for managing user roles | [Roles API Documentation](./roles-api.md) |
| Departments API | API for managing departments | [Departments API Documentation](./departments-api.md) |
| Designations API | API for managing job designations | [Designations API Documentation](./designations-api.md) |
| Employees API | API for managing employees | [Employees API Documentation](./employees-api.md) |
| Permission Groups API | API for managing permission groups | [Permission Groups API Documentation](./permission-groups-api.md) |
| Permission Categories API | API for managing permission categories | [Permission Categories API Documentation](./permission-categories-api.md) |
| Role Permissions API | API for managing role permissions | [Role Permissions API Documentation](./role-permissions-api.md) |
| Sidebar Menus API | API for managing sidebar navigation menus | [Sidebar Menus API Documentation](./sidebar-menus-api.md) |
| Sidebar Sub-Menus API | API for managing sidebar sub-menus | [Sidebar Sub-Menus API Documentation](./sidebar-sub-menus-api.md) |
| Employee Roles API | API for managing employee role assignments | [Employee Roles API Documentation](./employee-roles-api.md) |
| Users API | API for user authentication and management | [Users API Documentation](./users-api.md) |
| SMS Configurations API | API for managing SMS gateway configurations | [SMS Configurations API Documentation](./sms-configurations-api.md) |
| SMS Templates API | API for managing SMS message templates | [SMS Templates API Documentation](./sms-templates-api.md) |
| Payment Configurations API | API for managing payment gateway configurations | [Payment Configurations API Documentation](./payment-configurations-api.md) |
| Social Media Links API | API for managing social media links | [Social Media Links API Documentation](./social-media-links-api.md) |
| General Settings API | API for managing system-wide general settings | [General Settings API Documentation](./general-settings-api.md) |
| Jobs API | API for managing job listings | [Jobs API Documentation](./jobs-api.md) |
| Email Configurations API | API for managing email configurations | [Email Configurations API Documentation](./email-config-api.md) |
| Email Templates API | API for managing email templates | [Email Templates API Documentation](./email-template-api.md) |
| User Skills API | API for managing user skills | [User Skills API Documentation](./user-skills-api.md) |
| Employee Skills API | API for managing employee skills | [Employee Skills API Documentation](./employee-skills-api.md) |
| Employee Authentication API | API for employee authentication | [Employee Authentication API Documentation](./employee-auth-api.md) |

## Error Handling

All APIs follow a consistent error handling pattern. Error responses include:

- `success`: Boolean indicating if the request was successful (always `false` for errors)
- `message`: A human-readable error message
- `error`: (Optional) Detailed error information

Example error response:

```json
{
  "success": false,
  "message": "Resource not found",
  "error": "The requested resource with ID 123 does not exist"
}
```

## Common Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - The request has succeeded |
| 201 | Created - The request has been fulfilled and a new resource has been created |
| 400 | Bad Request - The request could not be understood or was missing required parameters |
| 401 | Unauthorized - Authentication failed or user does not have permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Something went wrong on the server |

## Pagination

APIs that return collections of resources support pagination through the following query parameters:

- `page`: The page number (default: 1)
- `limit`: Number of items per page (default: 10)

Paginated responses include a `pagination` object with the following properties:

- `total`: Total number of items
- `page`: Current page number
- `limit`: Number of items per page
- `pages`: Total number of pages

Example paginated response:

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## Database Support

The API is designed to work with multiple database types:

- MySQL
- PostgreSQL
- MongoDB

The database type can be configured in the `.env` file by setting the `DB_TYPE` variable.

## API Versioning

Currently, all APIs are at version 1 and do not require a version prefix in the URL. Future versions may use a prefix like `/api/v2/`.

## Rate Limiting

API requests are subject to rate limiting to prevent abuse. The current limits are:

- 100 requests per minute per IP address
- 1000 requests per hour per IP address

When rate limits are exceeded, the API will return a 429 Too Many Requests status code.

## Further Documentation

For detailed information about specific API endpoints, including request and response formats, refer to the individual API documentation files linked in the Available APIs section.
