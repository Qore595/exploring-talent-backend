# Role Permissions API

## API URLs and Payloads

### 1. Get All Role Permissions

**URL:** `GET http://localhost:3001/api/role-permissions`

**Query Parameters:** `page`, `limit`, `is_active`, `role_id`, `perm_cat_id`, `branch_id`

**Example:** `GET http://localhost:3001/api/role-permissions?page=1&limit=10&role_id=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "role_id": 1,
      "perm_cat_id": 1,
      "can_view": true,
      "can_add": true,
      "can_edit": true,
      "can_delete": true,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "branch_id": null,
      "custom_attributes": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "Role": {
        "id": 1,
        "name": "Administrator",
        "slug": "administrator"
      },
      "PermissionCategory": {
        "id": 1,
        "name": "User Management",
        "short_code": "USER_MGMT"
      },
      "Branch": null,
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
      "role_id": 1,
      "perm_cat_id": 2,
      "can_view": true,
      "can_add": true,
      "can_edit": true,
      "can_delete": false,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "branch_id": null,
      "custom_attributes": null,
      "created_at": "2023-07-15T10:35:00.000Z",
      "updated_at": "2023-07-15T10:35:00.000Z",
      "deleted_at": null,
      "Role": {
        "id": 1,
        "name": "Administrator",
        "slug": "administrator"
      },
      "PermissionCategory": {
        "id": 2,
        "name": "Role Management",
        "short_code": "ROLE_MGMT"
      },
      "Branch": null,
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

### 2. Get Role Permission by ID

**URL:** `GET http://localhost:3001/api/role-permissions/:id`

**Example:** `GET http://localhost:3001/api/role-permissions/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "role_id": 1,
    "perm_cat_id": 1,
    "can_view": true,
    "can_add": true,
    "can_edit": true,
    "can_delete": true,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "branch_id": null,
    "custom_attributes": null,
    "created_at": "2023-07-15T10:30:00.000Z",
    "updated_at": "2023-07-15T10:30:00.000Z",
    "deleted_at": null,
    "Role": {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator"
    },
    "PermissionCategory": {
      "id": 1,
      "name": "User Management",
      "short_code": "USER_MGMT"
    },
    "Branch": null,
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

### 3. Get Role Permissions by Role ID

**URL:** `GET http://localhost:3001/api/role-permissions/role/:roleId`

**Example:** `GET http://localhost:3001/api/role-permissions/role/1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "role_id": 1,
      "perm_cat_id": 1,
      "can_view": true,
      "can_add": true,
      "can_edit": true,
      "can_delete": true,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "branch_id": null,
      "custom_attributes": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "PermissionCategory": {
        "id": 1,
        "name": "User Management",
        "short_code": "USER_MGMT"
      },
      "Branch": null
    },
    {
      "id": 2,
      "role_id": 1,
      "perm_cat_id": 2,
      "can_view": true,
      "can_add": true,
      "can_edit": true,
      "can_delete": false,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "branch_id": null,
      "custom_attributes": null,
      "created_at": "2023-07-15T10:35:00.000Z",
      "updated_at": "2023-07-15T10:35:00.000Z",
      "deleted_at": null,
      "PermissionCategory": {
        "id": 2,
        "name": "Role Management",
        "short_code": "ROLE_MGMT"
      },
      "Branch": null
    }
  ]
}
```

### 4. Create Role Permission

**URL:** `POST http://localhost:3001/api/role-permissions`

**Payload:**
```json
{
  "role_id": 2,
  "perm_cat_id": 1,
  "can_view": true,
  "can_add": false,
  "can_edit": false,
  "can_delete": false,
  "is_active": true,
  "created_by": 1,
  "branch_id": null,
  "custom_attributes": {
    "restricted_fields": ["salary", "personal_info"]
  }
}


```

**Response:**
```json
{
  "success": true,
  "message": "Role permission created successfully",
  "data": {
    "id": 3,
    "role_id": 2,
    "perm_cat_id": 1,
    "can_view": true,
    "can_add": false,
    "can_edit": false,
    "can_delete": false,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "branch_id": null,
    "custom_attributes": {
      "restricted_fields": ["salary", "personal_info"]
    },
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T11:30:00.000Z",
    "deleted_at": null,
    "Role": {
      "id": 2,
      "name": "Manager",
      "short_code": "MGR"
    },
    "PermissionCategory": {
      "id": 1,
      "name": "User Management",
      "short_code": "USER_MGMT"
    },
    "Branch": null,
    "CreatedBy": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    }
  }
}
```

### 5. Batch Create or Update Role Permissions

**URL:** `POST http://localhost:3001/api/role-permissions/batch`

**Payload:**
```json
{
  "role_id": 2,
  "created_by": 1,
  "updated_by": 1,
  "permissions": [
    {
      "perm_cat_id": 1,
      "can_view": true,
      "can_add": false,
      "can_edit": false,
      "can_delete": false,
      "branch_id": 1
    },
    {
      "perm_cat_id": 2,
      "can_view": true,
      "can_add": true,
      "can_edit": false,
      "can_delete": false,
      "branch_id": 1
    },
    {
      "perm_cat_id": 3,
      "can_view": true,
      "can_add": false,
      "can_edit": false,
      "can_delete": false,
      "branch_id": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch operation completed",
  "results": [
    {
      "id": 3,
      "perm_cat_id": 1,
      "branch_id": null,
      "success": true,
      "message": "Role permission updated successfully",
      "data": {
        "id": 3,
        "role_id": 2,
        "perm_cat_id": 1,
        "can_view": true,
        "can_add": false,
        "can_edit": false,
        "can_delete": false,
        "is_active": true,
        "created_by": 1,
        "updated_by": 1,
        "branch_id": 1,
        "custom_attributes": {
          "restricted_fields": ["salary", "personal_info"]
        },
        "created_at": "2023-07-15T11:30:00.000Z",
        "updated_at": "2023-07-15T12:15:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 1,
          "name": "User Management",
          "short_code": "USER_MGMT"
        },
        "Branch": null
      }
    },
    {
      "id": 4,
      "perm_cat_id": 2,
      "branch_id": null,
      "success": true,
      "message": "Role permission created successfully",
      "data": {
        "id": 4,
        "role_id": 2,
        "perm_cat_id": 2,
        "can_view": true,
        "can_add": true,
        "can_edit": false,
        "can_delete": false,
        "is_active": true,
        "created_by": 1,
        "updated_by": null,
        "branch_id": 1,
        "custom_attributes": null,
        "created_at": "2023-07-15T12:15:00.000Z",
        "updated_at": "2023-07-15T12:15:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 2,
          "name": "Role Management",
          "short_code": "ROLE_MGMT"
        },
        "Branch": null
      }
    },
    {
      "id": 5,
      "perm_cat_id": 3,
      "branch_id": 1,
      "success": true,
      "message": "Role permission created successfully",
      "data": {
        "id": 5,
        "role_id": 2,
        "perm_cat_id": 3,
        "can_view": true,
        "can_add": false,
        "can_edit": false,
        "can_delete": false,
        "is_active": true,
        "created_by": 1,
        "updated_by": null,
        "branch_id": 1,
        "custom_attributes": null,
        "created_at": "2023-07-15T12:15:00.000Z",
        "updated_at": "2023-07-15T12:15:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 3,
          "name": "Permission Management",
          "short_code": "PERM_MGMT"
        },
        "Branch": {
          "id": 1,
          "name": "Head Office",
          "code": "HO"
        }
      }
    }
  ]
}
```



### 6. Update Role Permission

**URL:** `PUT http://localhost:3001/api/role-permissions/:id`

**Example:** `PUT http://localhost:3001/api/role-permissions/3`

**Payload:**
```json
{
  "can_edit": true,
  "updated_by": 1,
  "custom_attributes": {
    "restricted_fields": ["salary"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role permission updated successfully",
  "data": {
    "id": 3,
    "role_id": 2,
    "perm_cat_id": 1,
    "can_view": true,
    "can_add": false,
    "can_edit": true,
    "can_delete": false,
    "is_active": true,
    "created_by": 1,
    "updated_by": 1,
    "branch_id": null,
    "custom_attributes": {
      "restricted_fields": ["salary"]
    },
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T12:30:00.000Z",
    "deleted_at": null,
    "Role": {
      "id": 2,
      "name": "Manager",
      "short_code": "MGR"
    },
    "PermissionCategory": {
      "id": 1,
      "name": "User Management",
      "short_code": "USER_MGMT"
    },
    "Branch": null,
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

### 7. Delete Role Permission

**URL:** `DELETE http://localhost:3001/api/role-permissions/:id`

**Example:** `DELETE http://localhost:3001/api/role-permissions/3`

**Response:**
```json
{
  "success": true,
  "message": "Role permission deleted successfully"
}
```

## Notes

1. **Unique Constraint**: Each combination of `role_id`, `perm_cat_id`, and `branch_id` must be unique.
2. **Branch-Specific Permissions**: If `branch_id` is provided, the permission applies only to that branch. If `branch_id` is null, the permission applies globally.
3. **Custom Attributes**: The `custom_attributes` field can be used to store additional permission-specific data in JSON format.
4. **Batch Operations**: The batch endpoint allows creating or updating multiple permissions for a role in a single API call.
5. **Soft Delete**: When a role permission is deleted, it is not removed from the database. Instead, the `deleted_at` field is set to the current timestamp and `is_active` is set to false.
6. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
7. **Filtering**: You can filter role permissions by `is_active`, `role_id`, `perm_cat_id`, and `branch_id`.

## Required Fields for Creating a Role Permission

- `role_id`: ID of the role
- `perm_cat_id`: ID of the permission category
- `created_by`: ID of the employee who created the role permission

## Optional Fields

- `can_view`: Whether viewing is enabled for this permission (default: false)
- `can_add`: Whether adding is enabled for this permission (default: false)
- `can_edit`: Whether editing is enabled for this permission (default: false)
- `can_delete`: Whether deleting is enabled for this permission (default: false)
- `is_active`: Whether the role permission is active (default: true)
- `branch_id`: ID of the branch if the permission is branch-specific (default: null)
- `custom_attributes`: Additional custom permission attributes in JSON format (default: null)
