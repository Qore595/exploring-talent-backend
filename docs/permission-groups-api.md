# Permission Groups API

## API URLs and Payloads

### 1. Get All Permission Groups

**URL:** `GET http://localhost:3001/api/permission-groups`

**Query Parameters:** `page`, `limit`, `is_active`, `is_system`, `search`

**Example:** `GET http://localhost:3001/api/permission-groups?page=1&limit=10&is_active=true&is_system=false`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "System Administration",
      "short_code": "SYS_ADMIN",
      "description": "System administration permissions",
      "is_system": true,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "CreatedBy": {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User"
      },
      "UpdatedBy": null
    },
    {
      "id": 2,
      "name": "User Management",
      "short_code": "USER_MGMT",
      "description": "User management permissions",
      "is_system": false,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:35:00.000Z",
      "updated_at": "2023-07-15T10:35:00.000Z",
      "deleted_at": null,
      "CreatedBy": {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User"
      },
      "UpdatedBy": null
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Permission Group by ID

**URL:** `GET http://localhost:3001/api/permission-groups/:id`

**Example:** `GET http://localhost:3001/api/permission-groups/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "System Administration",
    "short_code": "SYS_ADMIN",
    "description": "System administration permissions",
    "is_system": true,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T10:30:00.000Z",
    "updated_at": "2023-07-15T10:30:00.000Z",
    "deleted_at": null,
    "CreatedBy": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    },
    "UpdatedBy": null
  }
}
```

### 3. Create Permission Group

**URL:** `POST http://localhost:3001/api/permission-groups`

**Payload:**
```json
{
  "name": "Report Access",
  "short_code": "REPORT_ACCESS",
  "description": "Access to various reports",
  "is_system": false,
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission group created successfully",
  "data": {
    "id": 3,
    "name": "Report Access",
    "short_code": "REPORT_ACCESS",
    "description": "Access to various reports",
    "is_system": false,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T11:30:00.000Z",
    "deleted_at": null,
    "CreatedBy": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    }
  }
}
```

### 4. Update Permission Group

**URL:** `PUT http://localhost:3001/api/permission-groups/:id`

**Example:** `PUT http://localhost:3001/api/permission-groups/3`

**Payload:**
```json
{
  "name": "Financial Reports Access",
  "description": "Access to financial reports and data",
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission group updated successfully",
  "data": {
    "id": 3,
    "name": "Financial Reports Access",
    "short_code": "REPORT_ACCESS",
    "description": "Access to financial reports and data",
    "is_system": false,
    "is_active": true,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T12:15:00.000Z",
    "deleted_at": null,
    "CreatedBy": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    },
    "UpdatedBy": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    }
  }
}
```

### 5. Delete Permission Group

**URL:** `DELETE http://localhost:3001/api/permission-groups/:id`

**Example:** `DELETE http://localhost:3001/api/permission-groups/3`

**Response:**
```json
{
  "success": true,
  "message": "Permission group deleted successfully"
}
```

## Notes

1. **System Groups**: Permission groups with `is_system` set to true cannot be modified or deleted.
2. **Short Code**: The `short_code` field must be unique across all permission groups.
3. **Soft Delete**: When a permission group is deleted, it is not removed from the database. Instead, the `deleted_at` field is set to the current timestamp and `is_active` is set to false.
4. **Search**: You can search for permission groups by name or short_code using the `search` query parameter.
5. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
6. **Filtering**: You can filter permission groups by `is_active` and `is_system`.

## Required Fields for Creating a Permission Group

- `name`: Name of the permission group
- `short_code`: Unique identifier for the permission group
- `created_by`: ID of the employee who created the permission group

## Optional Fields

- `description`: Description of the permission group
- `is_system`: Whether the permission group is a system group (default: false)
- `is_active`: Whether the permission group is active (default: true)
