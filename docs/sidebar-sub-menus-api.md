# Sidebar Sub-Menus API

## API URLs and Payloads

### 1. Get All Sidebar Sub-Menus

**URL:** `GET http://localhost:3001/api/sidebar-sub-menus`

**Query Parameters:** 
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `is_active`: Filter by active status (true/false)
- `is_system`: Filter by system menu status (true/false)
- `sidebar_display`: Filter by sidebar display status (true/false)
- `sidebar_menu_id`: Filter by parent sidebar menu ID
- `permission_category_id`: Filter by permission category ID
- `level`: Filter by menu level
- `system_level`: Filter by system level
- `search`: Search in sub-menu name and lang_key

**Example:** `GET http://localhost:3001/api/sidebar-sub-menus?page=1&limit=10&is_active=true&sidebar_display=true`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sidebar_menu_id": 2,
      "permission_category_id": 3,
      "icon": "fa-users",
      "sub_menu": "Users",
      "activate_menu": "users",
      "url": "/users",
      "lang_key": "users",
      "system_level": 0,
      "level": 1,
      "display_order": 1,
      "sidebar_display": true,
      "access_permissions": null,
      "is_active": true,
      "is_system": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "ParentMenu": {
        "id": 2,
        "menu": "User Management",
        "lang_key": "user_management"
      },
      "PermissionCategory": {
        "id": 3,
        "name": "User Management",
        "short_code": "USER_MGMT"
      },
      "CreatedBy": {
        "id": 1,
        "first_name": "Admin",
        "last_name": "User",
        "employee_id": "EMP001"
      }
    },
    // More sub-menus...
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Sub-Menus by Parent Menu ID

**URL:** `GET http://localhost:3001/api/sidebar-sub-menus/parent/:parentId`

**Example:** `GET http://localhost:3001/api/sidebar-sub-menus/parent/2`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sidebar_menu_id": 2,
      "permission_category_id": 3,
      "icon": "fa-users",
      "sub_menu": "Users",
      "activate_menu": "users",
      "url": "/users",
      "lang_key": "users",
      "system_level": 0,
      "level": 1,
      "display_order": 1,
      "sidebar_display": true,
      "access_permissions": null,
      "is_active": true,
      "is_system": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "PermissionCategory": {
        "id": 3,
        "name": "User Management",
        "short_code": "USER_MGMT"
      }
    },
    // More sub-menus for this parent...
  ]
}
```

### 3. Get Sidebar Sub-Menu by ID

**URL:** `GET http://localhost:3001/api/sidebar-sub-menus/:id`

**Example:** `GET http://localhost:3001/api/sidebar-sub-menus/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sidebar_menu_id": 2,
    "permission_category_id": 3,
    "icon": "fa-users",
    "sub_menu": "Users",
    "activate_menu": "users",
    "url": "/users",
    "lang_key": "users",
    "system_level": 0,
    "level": 1,
    "display_order": 1,
    "sidebar_display": true,
    "access_permissions": null,
    "is_active": true,
    "is_system": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T10:30:00.000Z",
    "updated_at": "2023-07-15T10:30:00.000Z",
    "deleted_at": null,
    "ParentMenu": {
      "id": 2,
      "menu": "User Management",
      "lang_key": "user_management"
    },
    "PermissionCategory": {
      "id": 3,
      "name": "User Management",
      "short_code": "USER_MGMT"
    },
    "CreatedBy": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "employee_id": "EMP001"
    }
  }
}
```

### 4. Create Sidebar Sub-Menu

**URL:** `POST http://localhost:3001/api/sidebar-sub-menus`

**Payload:**
```json
{
  "sidebar_menu_id": 2,
  "permission_category_id": 3,
  "icon": "fa-user-plus",
  "sub_menu": "Add User",
  "activate_menu": "add_user",
  "url": "/users/add",
  "lang_key": "add_user",
  "system_level": 0,
  "level": 1,
  "display_order": 4,
  "sidebar_display": true,
  "access_permissions": null,
  "is_active": true,
  "is_system": false,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sidebar sub-menu created successfully",
  "data": {
    "id": 6,
    "sidebar_menu_id": 2,
    "permission_category_id": 3,
    "icon": "fa-user-plus",
    "sub_menu": "Add User",
    "activate_menu": "add_user",
    "url": "/users/add",
    "lang_key": "add_user",
    "system_level": 0,
    "level": 1,
    "display_order": 4,
    "sidebar_display": true,
    "access_permissions": null,
    "is_active": true,
    "is_system": false,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T11:30:00.000Z",
    "deleted_at": null,
    "ParentMenu": {
      "id": 2,
      "menu": "User Management",
      "lang_key": "user_management"
    },
    "PermissionCategory": {
      "id": 3,
      "name": "User Management",
      "short_code": "USER_MGMT"
    },
    "CreatedBy": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "employee_id": "EMP001"
    }
  }
}
```

### 5. Update Sidebar Sub-Menu

**URL:** `PUT http://localhost:3001/api/sidebar-sub-menus/:id`

**Example:** `PUT http://localhost:3001/api/sidebar-sub-menus/6`

**Payload:**
```json
{
  "sidebar_menu_id": 2,
  "permission_category_id": 3,
  "icon": "fa-user-plus",
  "sub_menu": "Create User",
  "activate_menu": "create_user",
  "url": "/users/create",
  "lang_key": "create_user",
  "system_level": 0,
  "level": 1,
  "display_order": 4,
  "sidebar_display": true,
  "access_permissions": null,
  "is_active": true,
  "is_system": false,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sidebar sub-menu updated successfully",
  "data": {
    "id": 6,
    "sidebar_menu_id": 2,
    "permission_category_id": 3,
    "icon": "fa-user-plus",
    "sub_menu": "Create User",
    "activate_menu": "create_user",
    "url": "/users/create",
    "lang_key": "create_user",
    "system_level": 0,
    "level": 1,
    "display_order": 4,
    "sidebar_display": true,
    "access_permissions": null,
    "is_active": true,
    "is_system": false,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T12:00:00.000Z",
    "deleted_at": null,
    "ParentMenu": {
      "id": 2,
      "menu": "User Management",
      "lang_key": "user_management"
    },
    "PermissionCategory": {
      "id": 3,
      "name": "User Management",
      "short_code": "USER_MGMT"
    },
    "CreatedBy": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "employee_id": "EMP001"
    },
    "UpdatedBy": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "employee_id": "EMP001"
    }
  }
}
```

### 6. Delete Sidebar Sub-Menu

**URL:** `DELETE http://localhost:3001/api/sidebar-sub-menus/:id`

**Example:** `DELETE http://localhost:3001/api/sidebar-sub-menus/6`

**Response:**
```json
{
  "success": true,
  "message": "Sidebar sub-menu deleted successfully"
}
```

## Notes

1. **Sub-Menu Hierarchy**: The sidebar sub-menus are organized under parent sidebar menus based on the `sidebar_menu_id` field.
2. **System Sub-Menus**: Sub-menus with `is_system` set to `true` cannot be modified or deleted.
3. **Sidebar Display**: Only sub-menus with `sidebar_display` set to `true` will be included in the navigation menu.
4. **Access Permissions**: The `access_permissions` field can be used to store JSON data about which roles or permissions are required to access the sub-menu.
5. **Soft Delete**: When a sidebar sub-menu is deleted, it is not removed from the database. Instead, the `deleted_at` field is set to the current timestamp and `is_active` is set to false.
6. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
7. **Parent Menu Relationship**: Each sub-menu must be associated with a valid parent sidebar menu through the `sidebar_menu_id` field.
8. **Permission Category**: Sub-menus can be associated with a permission category through the `permission_category_id` field, which controls access to the sub-menu based on user permissions.
