# Permission Groups with Categories API Documentation

This document provides details on the Permission Groups with Categories API endpoints available in the Talent Spark backend system. This API allows you to manage permission groups and their categories together in a single request.

## Base URL

```
http://localhost:3001/api/permission-groups-with-categories
```

## Authentication

All API endpoints require authentication.

## API Endpoints

### 1. Get All Permission Groups with Categories

Retrieves a paginated list of all permission groups with their categories.

**URL:** `GET /api/permission-groups-with-categories`

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `is_active` (optional): Filter by active status (true/false)
- `is_system` (optional): Filter by system group status (true/false)
- `search` (optional): Search term for group name, short code, or description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dashboard",
      "short_code": "dashboard",
      "description": "Dashboard access permissions",
      "is_system": true,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-06-01T10:00:00.000Z",
      "updated_at": "2023-06-01T10:00:00.000Z",
      "deleted_at": null,
      "CreatedBy": {
        "id": 1,
        "first_name": "Admin",
        "last_name": "User",
        "employee_id": "EMP001"
      },
      "categories": [
        {
          "id": 1,
          "perm_group_id": 1,
          "name": "View Dashboard",
          "short_code": "view_dashboard",
          "description": "Permission to view dashboard",
          "enable_view": true,
          "enable_add": false,
          "enable_edit": false,
          "enable_delete": false,
          "is_system": true,
          "is_active": true,
          "display_order": 1
        }
      ]
    },
    {
      "id": 2,
      "name": "User Management",
      "short_code": "user_management",
      "description": "User management permissions",
      "is_system": true,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-06-01T10:00:00.000Z",
      "updated_at": "2023-06-01T10:00:00.000Z",
      "deleted_at": null,
      "CreatedBy": {
        "id": 1,
        "first_name": "Admin",
        "last_name": "User",
        "employee_id": "EMP001"
      },
      "categories": [
        {
          "id": 2,
          "perm_group_id": 2,
          "name": "View Users",
          "short_code": "view_users",
          "description": "Permission to view users",
          "enable_view": true,
          "enable_add": false,
          "enable_edit": false,
          "enable_delete": false,
          "is_system": true,
          "is_active": true,
          "display_order": 1
        },
        {
          "id": 3,
          "perm_group_id": 2,
          "name": "Add Users",
          "short_code": "add_users",
          "description": "Permission to add users",
          "enable_view": false,
          "enable_add": true,
          "enable_edit": false,
          "enable_delete": false,
          "is_system": true,
          "is_active": true,
          "display_order": 2
        },
        {
          "id": 4,
          "perm_group_id": 2,
          "name": "Edit Users",
          "short_code": "edit_users",
          "description": "Permission to edit users",
          "enable_view": false,
          "enable_add": false,
          "enable_edit": true,
          "enable_delete": false,
          "is_system": true,
          "is_active": true,
          "display_order": 3
        },
        {
          "id": 5,
          "perm_group_id": 2,
          "name": "Delete Users",
          "short_code": "delete_users",
          "description": "Permission to delete users",
          "enable_view": false,
          "enable_add": false,
          "enable_edit": false,
          "enable_delete": true,
          "is_system": true,
          "is_active": true,
          "display_order": 4
        }
      ]
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Permission Group with Categories by ID

Retrieves a single permission group with all its categories by ID.

**URL:** `GET /api/permission-groups-with-categories/:id`

**Example:** `GET /api/permission-groups-with-categories/2`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "User Management",
    "short_code": "user_management",
    "description": "User management permissions",
    "is_system": true,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-06-01T10:00:00.000Z",
    "updated_at": "2023-06-01T10:00:00.000Z",
    "deleted_at": null,
    "CreatedBy": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "employee_id": "EMP001"
    },
    "categories": [
      {
        "id": 2,
        "perm_group_id": 2,
        "name": "View Users",
        "short_code": "view_users",
        "description": "Permission to view users",
        "enable_view": true,
        "enable_add": false,
        "enable_edit": false,
        "enable_delete": false,
        "is_system": true,
        "is_active": true,
        "display_order": 1
      },
      {
        "id": 3,
        "perm_group_id": 2,
        "name": "Add Users",
        "short_code": "add_users",
        "description": "Permission to add users",
        "enable_view": false,
        "enable_add": true,
        "enable_edit": false,
        "enable_delete": false,
        "is_system": true,
        "is_active": true,
        "display_order": 2
      },
      {
        "id": 4,
        "perm_group_id": 2,
        "name": "Edit Users",
        "short_code": "edit_users",
        "description": "Permission to edit users",
        "enable_view": false,
        "enable_add": false,
        "enable_edit": true,
        "enable_delete": false,
        "is_system": true,
        "is_active": true,
        "display_order": 3
      },
      {
        "id": 5,
        "perm_group_id": 2,
        "name": "Delete Users",
        "short_code": "delete_users",
        "description": "Permission to delete users",
        "enable_view": false,
        "enable_add": false,
        "enable_edit": false,
        "enable_delete": true,
        "is_system": true,
        "is_active": true,
        "display_order": 4
      }
    ]
  }
}
```

**Continued in [permission-groups-with-categories-api-part2.md](./permission-groups-with-categories-api-part2.md)**