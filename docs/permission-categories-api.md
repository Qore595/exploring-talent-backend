# Permission Categories API

## API URLs and Payloads

### 1. Get All Permission Categories

**URL:** `GET http://localhost:3001/api/permission-categories`

**Query Parameters:** `page`, `limit`, `is_active`, `is_system`, `perm_group_id`, `search`

**Example:** `GET http://localhost:3001/api/permission-categories?page=1&limit=10&is_active=true&perm_group_id=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "perm_group_id": 1,
      "name": "User Management",
      "short_code": "USER_MGMT",
      "description": "User management permissions",
      "enable_view": true,
      "enable_add": true,
      "enable_edit": true,
      "enable_delete": true,
      "is_system": true,
      "is_active": true,
      "display_order": 1,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "PermissionGroup": {
        "id": 1,
        "name": "System Administration",
        "short_code": "SYS_ADMIN"
      }
    },
    {
      "id": 2,
      "perm_group_id": 1,
      "name": "Role Management",
      "short_code": "ROLE_MGMT",
      "description": "Role management permissions",
      "enable_view": true,
      "enable_add": true,
      "enable_edit": true,
      "enable_delete": true,
      "is_system": true,
      "is_active": true,
      "display_order": 2,
      "created_at": "2023-07-15T10:35:00.000Z",
      "updated_at": "2023-07-15T10:35:00.000Z",
      "PermissionGroup": {
        "id": 1,
        "name": "System Administration",
        "short_code": "SYS_ADMIN"
      }
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

### 2. Get Permission Category by ID

**URL:** `GET http://localhost:3001/api/permission-categories/:id`

**Example:** `GET http://localhost:3001/api/permission-categories/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "perm_group_id": 1,
    "name": "User Management",
    "short_code": "USER_MGMT",
    "description": "User management permissions",
    "enable_view": true,
    "enable_add": true,
    "enable_edit": true,
    "enable_delete": true,
    "is_system": true,
    "is_active": true,
    "display_order": 1,
    "created_at": "2023-07-15T10:30:00.000Z",
    "updated_at": "2023-07-15T10:30:00.000Z",
    "PermissionGroup": {
      "id": 1,
      "name": "System Administration",
      "short_code": "SYS_ADMIN"
    }
  }
}
```

### 3. Create Permission Category

**URL:** `POST http://localhost:3001/api/permission-categories`

**Payload:**
```json
{
  "perm_group_id": 2,
  "name": "Employee Reports",
  "short_code": "EMP_REPORTS",
  "description": "Access to employee reports",
  "enable_view": true,
  "enable_add": false,
  "enable_edit": false,
  "enable_delete": false,
  "is_system": false,
  "is_active": true,
  "display_order": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission category created successfully",
  "data": {
    "id": 3,
    "perm_group_id": 2,
    "name": "Employee Reports",
    "short_code": "EMP_REPORTS",
    "description": "Access to employee reports",
    "enable_view": true,
    "enable_add": false,
    "enable_edit": false,
    "enable_delete": false,
    "is_system": false,
    "is_active": true,
    "display_order": 1,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T11:30:00.000Z",
    "PermissionGroup": {
      "id": 2,
      "name": "Reports",
      "short_code": "REPORTS"
    }
  }
}
```

### 4. Update Permission Category

**URL:** `PUT http://localhost:3001/api/permission-categories/:id`

**Example:** `PUT http://localhost:3001/api/permission-categories/3`

**Payload:**
```json
{
  "name": "Employee Reports Access",
  "description": "Access to employee reports and data",
  "enable_edit": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission category updated successfully",
  "data": {
    "id": 3,
    "perm_group_id": 2,
    "name": "Employee Reports Access",
    "short_code": "EMP_REPORTS",
    "description": "Access to employee reports and data",
    "enable_view": true,
    "enable_add": false,
    "enable_edit": true,
    "enable_delete": false,
    "is_system": false,
    "is_active": true,
    "display_order": 1,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T12:15:00.000Z",
    "PermissionGroup": {
      "id": 2,
      "name": "Reports",
      "short_code": "REPORTS"
    }
  }
}
```

### 5. Delete Permission Category

**URL:** `DELETE http://localhost:3001/api/permission-categories/:id`

**Example:** `DELETE http://localhost:3001/api/permission-categories/3`

**Response:**
```json
{
  "success": true,
  "message": "Permission category deleted successfully"
}
```

## Notes

1. **System Categories**: Permission categories with `is_system` set to true cannot be modified or deleted.
2. **Short Code**: The `short_code` field must be unique across all permission categories.
3. **Permission Group**: Each permission category must belong to a valid permission group.
4. **Permission Flags**: The fields `enable_view`, `enable_add`, `enable_edit`, and `enable_delete` control what actions are allowed for this permission category.
5. **Search**: You can search for permission categories by name or short_code using the `search` query parameter.
6. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
7. **Filtering**: You can filter permission categories by `is_active`, `is_system`, and `perm_group_id`.
8. **Display Order**: The `display_order` field controls the order in which permission categories are displayed in the UI.

## Required Fields for Creating a Permission Category

- `perm_group_id`: ID of the permission group this category belongs to
- `name`: Name of the permission category
- `short_code`: Unique identifier for the permission category

## Optional Fields

- `description`: Description of the permission category
- `enable_view`: Whether viewing is enabled for this permission category (default: false)
- `enable_add`: Whether adding is enabled for this permission category (default: false)
- `enable_edit`: Whether editing is enabled for this permission category (default: false)
- `enable_delete`: Whether deleting is enabled for this permission category (default: false)
- `is_system`: Whether the permission category is a system category (default: false)
- `is_active`: Whether the permission category is active (default: true)
- `display_order`: Order in which the permission category should be displayed (default: 0)
