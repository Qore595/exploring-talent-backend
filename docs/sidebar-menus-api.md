# Sidebar Menus API

## API URLs and Payloads

### 1. Get All Sidebar Menus

**URL:** `GET http://localhost:3001/api/sidebar-menus`

**Query Parameters:** 
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `is_active`: Filter by active status (true/false)
- `is_system`: Filter by system menu status (true/false)
- `sidebar_display`: Filter by sidebar display status (true/false)
- `permission_group_id`: Filter by permission group ID
- `level`: Filter by menu level
- `system_level`: Filter by system level
- `search`: Search in menu name and lang_key

**Example:** `GET http://localhost:3001/api/sidebar-menus?page=1&limit=10&is_active=true&sidebar_display=true`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "permission_group_id": 1,
      "icon": "fa-dashboard",
      "menu": "Dashboard",
      "activate_menu": "dashboard",
      "url": "/dashboard",
      "lang_key": "dashboard",
      "system_level": 0,
      "level": 0,
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
      "PermissionGroup": {
        "id": 1,
        "name": "Dashboard",
        "short_code": "DASHBOARD"
      },
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
      "permission_group_id": 2,
      "icon": "fa-users",
      "menu": "User Management",
      "activate_menu": "user_management",
      "url": null,
      "lang_key": "user_management",
      "system_level": 0,
      "level": 0,
      "display_order": 2,
      "sidebar_display": true,
      "access_permissions": null,
      "is_active": true,
      "is_system": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:35:00.000Z",
      "updated_at": "2023-07-15T10:35:00.000Z",
      "deleted_at": null,
      "PermissionGroup": {
        "id": 2,
        "name": "User Management",
        "short_code": "USER_MGMT"
      },
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

### 2. Get Active Sidebar Menus for Navigation

**URL:** `GET http://localhost:3001/api/sidebar-menus/active`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "permission_group_id": 1,
      "icon": "fa-dashboard",
      "menu": "Dashboard",
      "activate_menu": "dashboard",
      "url": "/dashboard",
      "lang_key": "dashboard",
      "system_level": 0,
      "level": 0,
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
      "PermissionGroup": {
        "id": 1,
        "name": "Dashboard",
        "short_code": "DASHBOARD"
      },
      "children": []
    },
    {
      "id": 2,
      "permission_group_id": 2,
      "icon": "fa-users",
      "menu": "User Management",
      "activate_menu": "user_management",
      "url": null,
      "lang_key": "user_management",
      "system_level": 0,
      "level": 0,
      "display_order": 2,
      "sidebar_display": true,
      "access_permissions": null,
      "is_active": true,
      "is_system": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:35:00.000Z",
      "updated_at": "2023-07-15T10:35:00.000Z",
      "deleted_at": null,
      "PermissionGroup": {
        "id": 2,
        "name": "User Management",
        "short_code": "USER_MGMT"
      },
      "children": [
        {
          "id": 3,
          "permission_group_id": 2,
          "icon": "fa-user",
          "menu": "Users",
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
          "created_at": "2023-07-15T10:40:00.000Z",
          "updated_at": "2023-07-15T10:40:00.000Z",
          "deleted_at": null,
          "PermissionGroup": {
            "id": 2,
            "name": "User Management",
            "short_code": "USER_MGMT"
          },
          "children": []
        },
        {
          "id": 4,
          "permission_group_id": 2,
          "icon": "fa-key",
          "menu": "Roles",
          "activate_menu": "roles",
          "url": "/roles",
          "lang_key": "roles",
          "system_level": 0,
          "level": 1,
          "display_order": 2,
          "sidebar_display": true,
          "access_permissions": null,
          "is_active": true,
          "is_system": true,
          "created_by": 1,
          "updated_by": null,
          "created_at": "2023-07-15T10:45:00.000Z",
          "updated_at": "2023-07-15T10:45:00.000Z",
          "deleted_at": null,
          "PermissionGroup": {
            "id": 2,
            "name": "User Management",
            "short_code": "USER_MGMT"
          },
          "children": []
        }
      ]
    }
  ]
}
```

### 3. Get Sidebar Menu by ID

**URL:** `GET http://localhost:3001/api/sidebar-menus/:id`

**Example:** `GET http://localhost:3001/api/sidebar-menus/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "permission_group_id": 1,
    "icon": "fa-dashboard",
    "menu": "Dashboard",
    "activate_menu": "dashboard",
    "url": "/dashboard",
    "lang_key": "dashboard",
    "system_level": 0,
    "level": 0,
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
    "PermissionGroup": {
      "id": 1,
      "name": "Dashboard",
      "short_code": "DASHBOARD"
    },
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

### 4. Create Sidebar Menu

**URL:** `POST http://localhost:3001/api/sidebar-menus`

**Payload:**
```json
{
  "permission_group_id": 3,
  "icon": "fa-cogs",
  "menu": "Settings",
  "activate_menu": "settings",
  "url": "/settings",
  "lang_key": "settings",
  "system_level": 0,
  "level": 0,
  "display_order": 3,
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
  "message": "Sidebar menu created successfully",
  "data": {
    "id": 5,
    "permission_group_id": 3,
    "icon": "fa-cogs",
    "menu": "Settings",
    "activate_menu": "settings",
    "url": "/settings",
    "lang_key": "settings",
    "system_level": 0,
    "level": 0,
    "display_order": 3,
    "sidebar_display": true,
    "access_permissions": null,
    "is_active": true,
    "is_system": false,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T11:30:00.000Z",
    "deleted_at": null,
    "PermissionGroup": {
      "id": 3,
      "name": "Settings",
      "short_code": "SETTINGS"
    },
    "CreatedBy": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    }
  }
}
```

### 5. Update Sidebar Menu

**URL:** `PUT http://localhost:3001/api/sidebar-menus/:id`

**Example:** `PUT http://localhost:3001/api/sidebar-menus/5`

**Payload:**
```json
{
  "icon": "fa-wrench",
  "menu": "System Settings",
  "display_order": 4,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sidebar menu updated successfully",
  "data": {
    "id": 5,
    "permission_group_id": 3,
    "icon": "fa-wrench",
    "menu": "System Settings",
    "activate_menu": "settings",
    "url": "/settings",
    "lang_key": "settings",
    "system_level": 0,
    "level": 0,
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
    "PermissionGroup": {
      "id": 3,
      "name": "Settings",
      "short_code": "SETTINGS"
    },
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

### 6. Delete Sidebar Menu

**URL:** `DELETE http://localhost:3001/api/sidebar-menus/:id`

**Example:** `DELETE http://localhost:3001/api/sidebar-menus/5`

**Response:**
```json
{
  "success": true,
  "message": "Sidebar menu deleted successfully"
}
```

## Notes

1. **Menu Hierarchy**: The sidebar menus are organized in a hierarchical structure based on the `level` and `system_level` fields.
2. **System Menus**: Menus with `is_system` set to `true` cannot be modified or deleted.
3. **Sidebar Display**: Only menus with `sidebar_display` set to `true` will be included in the navigation menu.
4. **Access Permissions**: The `access_permissions` field can be used to store JSON data about which roles or permissions are required to access the menu.
5. **Soft Delete**: When a sidebar menu is deleted, it is not removed from the database. Instead, the `deleted_at` field is set to the current timestamp and `is_active` is set to false.
6. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
7. **Filtering**: You can filter sidebar menus by various fields such as `is_active`, `is_system`, `sidebar_display`, `permission_group_id`, `level`, and `system_level`.
8. **Search**: You can search for sidebar menus by their name or language key using the `search` query parameter.

## Required Fields for Creating a Sidebar Menu

- `lang_key`: A unique key for language translation

## Optional Fields

- `permission_group_id`: ID of the permission group associated with the menu
- `icon`: CSS class for the menu icon (e.g., "fa-dashboard" for Font Awesome)
- `menu`: Display name of the menu
- `activate_menu`: Key to identify which menu is active
- `url`: URL path for the menu item
- `system_level`: System level of the menu (default: 0)
- `level`: Nesting level of the menu (default: 0)
- `display_order`: Order in which the menu should be displayed (default: 0)
- `sidebar_display`: Whether the menu should be displayed in the sidebar (default: false)
- `access_permissions`: JSON string containing access permission rules
- `is_active`: Whether the menu is active (default: true)
- `is_system`: Whether the menu is a system menu that cannot be modified (default: false)
- `created_by`: ID of the employee who created the menu
