# Sidebar Menus with Sub-Menus API Documentation

This document provides details on the Sidebar Menus with Sub-Menus API endpoints available in the Talent Spark backend system. This API allows you to manage sidebar menus and their sub-menus together in a single request.

## Base URL

```
http://localhost:3001/api/sidebar-menus-with-sub-menus
```

## Authentication

All API endpoints require authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## API Endpoints

### 1. Get All Sidebar Menus with Sub-Menus

Retrieves a paginated list of all sidebar menus with their sub-menus.

**URL:** `GET /api/sidebar-menus-with-sub-menus`

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `is_active` (optional): Filter by active status (true/false)
- `sidebar_display` (optional): Filter by sidebar display status (true/false)
- `is_system` (optional): Filter by system menu status (true/false)
- `permission_group_id` (optional): Filter by permission group ID
- `level` (optional): Filter by menu level
- `system_level` (optional): Filter by system level
- `search` (optional): Search term for menu name or language key

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
      "created_at": "2023-06-01T10:00:00.000Z",
      "updated_at": "2023-06-01T10:00:00.000Z",
      "deleted_at": null,
      "PermissionGroup": {
        "id": 1,
        "name": "Dashboard",
        "short_code": "dashboard"
      },
      "sub_menus": []
    },
    {
      "id": 2,
      "permission_group_id": 2,
      "icon": "fa-users",
      "menu": "User Management",
      "activate_menu": "user_management",
      "url": "/users",
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
      "created_at": "2023-06-01T10:00:00.000Z",
      "updated_at": "2023-06-01T10:00:00.000Z",
      "deleted_at": null,
      "PermissionGroup": {
        "id": 2,
        "name": "User Management",
        "short_code": "user_management"
      },
      "sub_menus": [
        {
          "id": 1,
          "sidebar_menu_id": 2,
          "permission_category_id": 1,
          "icon": "fa-user-list",
          "sub_menu": "User List",
          "activate_menu": "user_list",
          "url": "/users/list",
          "lang_key": "user_list",
          "system_level": 0,
          "level": 1,
          "display_order": 1,
          "sidebar_display": true,
          "access_permissions": null,
          "is_active": true,
          "is_system": true,
          "created_by": 1,
          "updated_by": null,
          "created_at": "2023-06-01T10:00:00.000Z",
          "updated_at": "2023-06-01T10:00:00.000Z",
          "deleted_at": null,
          "PermissionCategory": {
            "id": 1,
            "name": "View Users",
            "short_code": "view_users"
          }
        },
        {
          "id": 2,
          "sidebar_menu_id": 2,
          "permission_category_id": 2,
          "icon": "fa-user-plus",
          "sub_menu": "Add User",
          "activate_menu": "add_user",
          "url": "/users/add",
          "lang_key": "add_user",
          "system_level": 0,
          "level": 1,
          "display_order": 2,
          "sidebar_display": true,
          "access_permissions": null,
          "is_active": true,
          "is_system": true,
          "created_by": 1,
          "updated_by": null,
          "created_at": "2023-06-01T10:00:00.000Z",
          "updated_at": "2023-06-01T10:00:00.000Z",
          "deleted_at": null,
          "PermissionCategory": {
            "id": 2,
            "name": "Add Users",
            "short_code": "add_users"
          }
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

### 2. Get Sidebar Menu with Sub-Menus by ID

Retrieves a single sidebar menu with all its sub-menus by ID.

**URL:** `GET /api/sidebar-menus-with-sub-menus/:id`

**Example:** `GET /api/sidebar-menus-with-sub-menus/2`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "permission_group_id": 2,
    "icon": "fa-users",
    "menu": "User Management",
    "activate_menu": "user_management",
    "url": "/users",
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
    "created_at": "2023-06-01T10:00:00.000Z",
    "updated_at": "2023-06-01T10:00:00.000Z",
    "deleted_at": null,
    "PermissionGroup": {
      "id": 2,
      "name": "User Management",
      "short_code": "user_management"
    },
    "sub_menus": [
      {
        "id": 1,
        "sidebar_menu_id": 2,
        "permission_category_id": 1,
        "icon": "fa-user-list",
        "sub_menu": "User List",
        "activate_menu": "user_list",
        "url": "/users/list",
        "lang_key": "user_list",
        "system_level": 0,
        "level": 1,
        "display_order": 1,
        "sidebar_display": true,
        "access_permissions": null,
        "is_active": true,
        "is_system": true,
        "created_by": 1,
        "updated_by": null,
        "created_at": "2023-06-01T10:00:00.000Z",
        "updated_at": "2023-06-01T10:00:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 1,
          "name": "View Users",
          "short_code": "view_users"
        }
      },
      {
        "id": 2,
        "sidebar_menu_id": 2,
        "permission_category_id": 2,
        "icon": "fa-user-plus",
        "sub_menu": "Add User",
        "activate_menu": "add_user",
        "url": "/users/add",
        "lang_key": "add_user",
        "system_level": 0,
        "level": 1,
        "display_order": 2,
        "sidebar_display": true,
        "access_permissions": null,
        "is_active": true,
        "is_system": true,
        "created_by": 1,
        "updated_by": null,
        "created_at": "2023-06-01T10:00:00.000Z",
        "updated_at": "2023-06-01T10:00:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 2,
          "name": "Add Users",
          "short_code": "add_users"
        }
      }
    ]
  }
}
```

### 3. Create Sidebar Menu with Sub-Menus

Creates a new sidebar menu with optional sub-menus.

**URL:** `POST /api/sidebar-menus-with-sub-menus`

**Payload:**
```json
{
  "menu_data": {
    "permission_group_id": 3,
    "icon": "fa-cog",
    "menu": "Settings",
    "activate_menu": "settings",
    "url": "/settings",
    "lang_key": "settings",
    "system_level": 0,
    "level": 0,
    "display_order": 10,
    "sidebar_display": true,
    "access_permissions": null,
    "is_active": true,
    "is_system": false,
    "created_by": 1
  },
  "sub_menus": [
    {
      "permission_category_id": 5,
      "icon": "fa-user-cog",
      "sub_menu": "User Settings",
      "activate_menu": "user_settings",
      "url": "/settings/user",
      "lang_key": "user_settings",
      "system_level": 0,
      "level": 1,
      "display_order": 1,
      "sidebar_display": true,
      "access_permissions": null,
      "is_active": true,
      "is_system": false,
      "created_by": 1
    },
    {
      "permission_category_id": 6,
      "icon": "fa-globe",
      "sub_menu": "System Settings",
      "activate_menu": "system_settings",
      "url": "/settings/system",
      "lang_key": "system_settings",
      "system_level": 0,
      "level": 1,
      "display_order": 2,
      "sidebar_display": true,
      "access_permissions": null,
      "is_active": true,
      "is_system": false,
      "created_by": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sidebar menu with sub-menus created successfully",
  "data": {
    "id": 5,
    "permission_group_id": 3,
    "icon": "fa-cog",
    "menu": "Settings",
    "activate_menu": "settings",
    "url": "/settings",
    "lang_key": "settings",
    "system_level": 0,
    "level": 0,
    "display_order": 10,
    "sidebar_display": true,
    "access_permissions": null,
    "is_active": true,
    "is_system": false,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-06-15T14:30:00.000Z",
    "updated_at": "2023-06-15T14:30:00.000Z",
    "deleted_at": null,
    "PermissionGroup": {
      "id": 3,
      "name": "Settings",
      "short_code": "settings"
    },
    "sub_menus": [
      {
        "id": 10,
        "sidebar_menu_id": 5,
        "permission_category_id": 5,
        "icon": "fa-user-cog",
        "sub_menu": "User Settings",
        "activate_menu": "user_settings",
        "url": "/settings/user",
        "lang_key": "user_settings",
        "system_level": 0,
        "level": 1,
        "display_order": 1,
        "sidebar_display": true,
        "access_permissions": null,
        "is_active": true,
        "is_system": false,
        "created_by": 1,
        "updated_by": null,
        "created_at": "2023-06-15T14:30:00.000Z",
        "updated_at": "2023-06-15T14:30:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 5,
          "name": "Manage User Settings",
          "short_code": "manage_user_settings"
        }
      },
      {
        "id": 11,
        "sidebar_menu_id": 5,
        "permission_category_id": 6,
        "icon": "fa-globe",
        "sub_menu": "System Settings",
        "activate_menu": "system_settings",
        "url": "/settings/system",
        "lang_key": "system_settings",
        "system_level": 0,
        "level": 1,
        "display_order": 2,
        "sidebar_display": true,
        "access_permissions": null,
        "is_active": true,
        "is_system": false,
        "created_by": 1,
        "updated_by": null,
        "created_at": "2023-06-15T14:30:00.000Z",
        "updated_at": "2023-06-15T14:30:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 6,
          "name": "Manage System Settings",
          "short_code": "manage_system_settings"
        }
      }
    ]
  }
}
```

### 4. Update Sidebar Menu with Sub-Menus

Updates an existing sidebar menu and manages its sub-menus (add new ones, update existing ones, or delete some).

**URL:** `PUT /api/sidebar-menus-with-sub-menus/:id`

**Example:** `PUT /api/sidebar-menus-with-sub-menus/5`

**Payload:**
```json
{
  "menu_data": {
    "permission_group_id": 3,
    "icon": "fa-cogs",
    "menu": "System Settings",
    "activate_menu": "system_settings",
    "url": "/system-settings",
    "lang_key": "system_settings",
    "system_level": 0,
    "level": 0,
    "display_order": 10,
    "sidebar_display": true,
    "access_permissions": null,
    "is_active": true,
    "is_system": false,
    "updated_by": 1
  },
  "sub_menus_to_add": [
    {
      "permission_category_id": 7,
      "icon": "fa-envelope",
      "sub_menu": "Email Settings",
      "activate_menu": "email_settings",
      "url": "/system-settings/email",
      "lang_key": "email_settings",
      "system_level": 0,
      "level": 1,
      "display_order": 3,
      "sidebar_display": true,
      "access_permissions": null,
      "is_active": true,
      "is_system": false,
      "created_by": 1
    }
  ],
  "sub_menus_to_update": [
    {
      "id": 10,
      "permission_category_id": 5,
      "icon": "fa-user-cog",
      "sub_menu": "User Preferences",
      "activate_menu": "user_preferences",
      "url": "/system-settings/user-preferences",
      "lang_key": "user_preferences",
      "system_level": 0,
      "level": 1,
      "display_order": 1,
      "sidebar_display": true,
      "access_permissions": null,
      "is_active": true,
      "is_system": false,
      "updated_by": 1
    }
  ],
  "sub_menus_to_delete": [11]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sidebar menu with sub-menus updated successfully",
  "data": {
    "id": 5,
    "permission_group_id": 3,
    "icon": "fa-cogs",
    "menu": "System Settings",
    "activate_menu": "system_settings",
    "url": "/system-settings",
    "lang_key": "system_settings",
    "system_level": 0,
    "level": 0,
    "display_order": 10,
    "sidebar_display": true,
    "access_permissions": null,
    "is_active": true,
    "is_system": false,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-06-15T14:30:00.000Z",
    "updated_at": "2023-06-15T15:45:00.000Z",
    "deleted_at": null,
    "PermissionGroup": {
      "id": 3,
      "name": "Settings",
      "short_code": "settings"
    },
    "sub_menus": [
      {
        "id": 10,
        "sidebar_menu_id": 5,
        "permission_category_id": 5,
        "icon": "fa-user-cog",
        "sub_menu": "User Preferences",
        "activate_menu": "user_preferences",
        "url": "/system-settings/user-preferences",
        "lang_key": "user_preferences",
        "system_level": 0,
        "level": 1,
        "display_order": 1,
        "sidebar_display": true,
        "access_permissions": null,
        "is_active": true,
        "is_system": false,
        "created_by": 1,
        "updated_by": 1,
        "created_at": "2023-06-15T14:30:00.000Z",
        "updated_at": "2023-06-15T15:45:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 5,
          "name": "Manage User Settings",
          "short_code": "manage_user_settings"
        }
      },
      {
        "id": 12,
        "sidebar_menu_id": 5,
        "permission_category_id": 7,
        "icon": "fa-envelope",
        "sub_menu": "Email Settings",
        "activate_menu": "email_settings",
        "url": "/system-settings/email",
        "lang_key": "email_settings",
        "system_level": 0,
        "level": 1,
        "display_order": 3,
        "sidebar_display": true,
        "access_permissions": null,
        "is_active": true,
        "is_system": false,
        "created_by": 1,
        "updated_by": null,
        "created_at": "2023-06-15T15:45:00.000Z",
        "updated_at": "2023-06-15T15:45:00.000Z",
        "deleted_at": null,
        "PermissionCategory": {
          "id": 7,
          "name": "Manage Email Settings",
          "short_code": "manage_email_settings"
        }
      }
    ]
  }
}
```

### 5. Delete Sidebar Menu with Sub-Menus

Deletes a sidebar menu along with all its sub-menus (soft delete).

**URL:** `DELETE /api/sidebar-menus-with-sub-menus/:id`

**Example:** `DELETE /api/sidebar-menus-with-sub-menus/5`

**Response:**
```json
{
  "success": true,
  "message": "Sidebar menu with all sub-menus deleted successfully"
}
```

## Notes

1. System menus and sub-menus (where `is_system` is `true`) cannot be modified or deleted.
2. When creating or updating sub-menus, the following fields are required:
   - `sub_menu`: The name of the sub-menu
   - `url`: The URL path for the sub-menu
   - `lang_key`: The language key for internationalization
3. The API supports both MongoDB and SQL databases (MySQL/PostgreSQL) through a unified interface.
4. All delete operations are soft deletes, meaning the records are marked as deleted but not actually removed from the database.
5. The `sidebar_display` field determines whether the menu/sub-menu should be displayed in the sidebar navigation.
6. The `level` and `system_level` fields are used for hierarchical menu structures.
7. The `display_order` field determines the order in which menus and sub-menus are displayed.




