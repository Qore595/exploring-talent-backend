# Branch Data API

## Overview

The Branch Data API provides endpoints to retrieve related data for branches, such as departments and designations associated with a specific branch.

## Base URL

All API endpoints are relative to: `http://localhost:3001/api`

## Authentication

No authentication is required for these endpoints.

## API Endpoints

### 1. Get Departments and Designations by Branch ID

Retrieves all departments and designations associated with a specific branch.

**URL:** `GET /branch/:branchId/departments-designations`

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| branchId | Integer | Branch ID (required) |

**Example Request:**
```
GET http://localhost:3001/api/branch/1/departments-designations
```

**Response:**
```json
{
  "success": true,
  "data": {
    "branch": {
      "id": 1,
      "name": "Head Office",
      "code": "HO"
    },
    "departments": [
      {
        "id": 1,
        "name": "Human Resources",
        "short_code": "HR",
        "branch_id": 1,
        "description": "Human Resources Department",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Finance",
        "short_code": "FIN",
        "branch_id": 1,
        "description": "Finance Department",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      },
      {
        "id": 3,
        "name": "Information Technology",
        "short_code": "IT",
        "branch_id": 1,
        "description": "IT Department",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      }
    ],
    "designations": [
      {
        "id": 1,
        "name": "CEO",
        "short_code": "CEO",
        "branch_id": 1,
        "description": "Chief Executive Officer",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      },
      {
        "id": 3,
        "name": "HR Manager",
        "short_code": "HRM",
        "branch_id": 1,
        "description": "Human Resources Manager",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      },
      {
        "id": 4,
        "name": "Software Engineer",
        "short_code": "SE",
        "branch_id": 1,
        "description": "Software Engineer",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**

- **400 Bad Request** - If branch ID is missing:
```json
{
  "success": false,
  "message": "Branch ID is required"
}
```

- **404 Not Found** - If branch with the specified ID does not exist:
```json
{
  "success": false,
  "message": "Branch not found"
}
```

### 2. Get Branch with Related Data

Retrieves a branch by ID along with its related departments, designations, and roles.

**URL:** `GET /branch/:branchId/with-related-data`

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| branchId | Integer | Branch ID (required) |

**Example Request:**
```
GET http://localhost:3001/api/branch/1/with-related-data
```

**Response:**
```json
{
  "success": true,
  "data": {
    "branch": {
      "id": 1,
      "name": "Head Office",
      "code": "HO",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postal_code": "10001",
      "phone": "+1-123-456-7890",
      "email": "info@talentspark.com",
      "branch_type": "head_office",
      "is_active": true,
      "created_at": "2023-05-10T10:00:00.000Z",
      "updated_at": "2023-05-10T10:00:00.000Z"
    },
    "departments": [
      {
        "id": 1,
        "name": "Human Resources",
        "short_code": "HR",
        "branch_id": 1,
        "description": "Human Resources Department",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Finance",
        "short_code": "FIN",
        "branch_id": 1,
        "description": "Finance Department",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      },
      {
        "id": 3,
        "name": "Information Technology",
        "short_code": "IT",
        "branch_id": 1,
        "description": "IT Department",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      }
    ],
    "designations": [
      {
        "id": 1,
        "name": "CEO",
        "short_code": "CEO",
        "branch_id": 1,
        "description": "Chief Executive Officer",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      },
      {
        "id": 3,
        "name": "HR Manager",
        "short_code": "HRM",
        "branch_id": 1,
        "description": "Human Resources Manager",
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      }
    ],
    "roles": [
      {
        "id": 1,
        "name": "Administrator",
        "slug": "administrator",
        "branch_id": 1,
        "description": "System Administrator",
        "is_system": true,
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "HR Manager",
        "slug": "hr-manager",
        "branch_id": 1,
        "description": "Human Resources Manager",
        "is_system": false,
        "is_active": true,
        "created_by": 1,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**

- **400 Bad Request** - If branch ID is missing:
```json
{
  "success": false,
  "message": "Branch ID is required"
}
```

- **404 Not Found** - If branch with the specified ID does not exist:
```json
{
  "success": false,
  "message": "Branch not found"
}
```

## Notes

1. These APIs return only active departments, designations, and roles (where `is_active` is `true`).
2. Results are sorted alphabetically by name.
3. The response includes branch information along with the complete department, designation, and role records.
4. If a branch has no departments, designations, or roles, empty arrays will be returned for those fields.
