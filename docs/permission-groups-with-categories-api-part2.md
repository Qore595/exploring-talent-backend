# Permission Groups with Categories API Documentation (Continued)

## Authentication

All endpoints require authentication.

## API Endpoints (Continued)

### 3. Create Permission Group with Categories

Creates a new permission group with optional categories.

**URL:** `POST /api/permission-groups-with-categories`

**Payload:**
```json
{
  "group_data": {
    "name": "Content Management",
    "short_code": "content_management",
    "description": "Content management permissions",
    "is_system": false,
    "is_active": true,
    "created_by": 1
  },
  "categories": [
    {
      "name": "View Content",
      "short_code": "view_content",
      "description": "Permission to view content",
      "enable_view": true,
      "enable_add": false,
      "enable_edit": false,
      "enable_delete": false,
      "is_system": false,
      "is_active": true,
      "display_order": 1
    },
    {
      "name": "Add Content",
      "short_code": "add_content",
      "description": "Permission to add content",
      "enable_view": false,
      "enable_add": true,
      "enable_edit": false,
      "enable_delete": false,
      "is_system": false,
      "is_active": true,
      "display_order": 2
    },
    {
      "name": "Edit Content",
      "short_code": "edit_content",
      "description": "Permission to edit content",
      "enable_view": false,
      "enable_add": false,
      "enable_edit": true,
      "enable_delete": false,
      "is_system": false,
      "is_active": true,
      "display_order": 3
    },
    {
      "name": "Delete Content",
      "short_code": "delete_content",
      "description": "Permission to delete content",
      "enable_view": false,
      "enable_add": false,
      "enable_edit": false,
      "enable_delete": true,
      "is_system": false,
      "is_active": true,
      "display_order": 4
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission group with categories created successfully",
  "data": {
    "id": 5,
    "name": "Content Management",
    "short_code": "content_management",
    "description": "Content management permissions",
    "is_system": false,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-06-15T14:30:00.000Z",
    "updated_at": "2023-06-15T14:30:00.000Z",
    "deleted_at": null,
    "CreatedBy": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "employee_id": "EMP001"
    },
    "categories": [
      {
        "id": 20,
        "perm_group_id": 5,
        "name": "View Content",
        "short_code": "view_content",
        "description": "Permission to view content",
        "enable_view": true,
        "enable_add": false,
        "enable_edit": false,
        "enable_delete": false,
        "is_system": false,
        "is_active": true,
        "display_order": 1
      },
      {
        "id": 21,
        "perm_group_id": 5,
        "name": "Add Content",
        "short_code": "add_content",
        "description": "Permission to add content",
        "enable_view": false,
        "enable_add": true,
        "enable_edit": false,
        "enable_delete": false,
        "is_system": false,
        "is_active": true,
        "display_order": 2
      },
      {
        "id": 22,
        "perm_group_id": 5,
        "name": "Edit Content",
        "short_code": "edit_content",
        "description": "Permission to edit content",
        "enable_view": false,
        "enable_add": false,
        "enable_edit": true,
        "enable_delete": false,
        "is_system": false,
        "is_active": true,
        "display_order": 3
      },
      {
        "id": 23,
        "perm_group_id": 5,
        "name": "Delete Content",
        "short_code": "delete_content",
        "description": "Permission to delete content",
        "enable_view": false,
        "enable_add": false,
        "enable_edit": false,
        "enable_delete": true,
        "is_system": false,
        "is_active": true,
        "display_order": 4
      }
    ]
  }
}
```

### 4. Update Permission Group with Categories

Updates an existing permission group and manages its categories (add new ones, update existing ones, or delete some).

**URL:** `PUT /api/permission-groups-with-categories/:id`

**Example:** `PUT /api/permission-groups-with-categories/5`

**Payload:**
```json
{
  "group_data": {
    "name": "Content Management System",
    "short_code": "cms",
    "description": "Content management system permissions",
    "is_active": true,
    "is_system": false,
    "updated_by": 1
  },
  "categories_to_add": [
    {
      "name": "Publish Content",
      "short_code": "publish_content",
      "description": "Permission to publish content",
      "enable_view": false,
      "enable_add": false,
      "enable_edit": true,
      "enable_delete": false,
      "is_system": false,
      "is_active": true,
      "display_order": 5
    }
  ],
  "categories_to_update": [
    {
      "id": 20,
      "name": "View CMS Content",
      "short_code": "view_content",
      "description": "Permission to view CMS content",
      "enable_view": true,
      "enable_add": false,
      "enable_edit": false,
      "enable_delete": false,
      "is_system": false,
      "is_active": true,
      "display_order": 1
    }
  ],
  "categories_to_delete": [23]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permission group with categories updated successfully",
  "data": {
    "id": 5,
    "name": "Content Management System",
    "short_code": "cms",
    "description": "Content management system permissions",
    "is_system": false,
    "is_active": true,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-06-15T14:30:00.000Z",
    "updated_at": "2023-06-15T15:45:00.000Z",
    "deleted_at": null,
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
    },
    "categories": [
      {
        "id": 20,
        "perm_group_id": 5,
        "name": "View CMS Content",
        "short_code": "view_content",
        "description": "Permission to view CMS content",
        "enable_view": true,
        "enable_add": false,
        "enable_edit": false,
        "enable_delete": false,
        "is_system": false,
        "is_active": true,
        "display_order": 1
      },
      {
        "id": 21,
        "perm_group_id": 5,
        "name": "Add Content",
        "short_code": "add_content",
        "description": "Permission to add content",
        "enable_view": false,
        "enable_add": true,
        "enable_edit": false,
        "enable_delete": false,
        "is_system": false,
        "is_active": true,
        "display_order": 2
      },
      {
        "id": 22,
        "perm_group_id": 5,
        "name": "Edit Content",
        "short_code": "edit_content",
        "description": "Permission to edit content",
        "enable_view": false,
        "enable_add": false,
        "enable_edit": true,
        "enable_delete": false,
        "is_system": false,
        "is_active": true,
        "display_order": 3
      },
      {
        "id": 24,
        "perm_group_id": 5,
        "name": "Publish Content",
        "short_code": "publish_content",
        "description": "Permission to publish content",
        "enable_view": false,
        "enable_add": false,
        "enable_edit": true,
        "enable_delete": false,
        "is_system": false,
        "is_active": true,
        "display_order": 5
      }
    ]
  }
}
```

### 5. Delete Permission Group with Categories

Deletes a permission group along with all its categories (soft delete).

**URL:** `DELETE /api/permission-groups-with-categories/:id`

**Example:** `DELETE /api/permission-groups-with-categories/5`

**Response:**
```json
{
  "success": true,
  "message": "Permission group with all categories deleted successfully"
}
```

## Notes

1. System permission groups and categories (where `is_system` is `true`) cannot be modified or deleted.
2. When creating or updating categories, the following fields are required:
   - `name`: The name of the category
   - `short_code`: A unique identifier for the category
3. The API supports both MongoDB and SQL databases (MySQL/PostgreSQL) through a unified interface.
4. All delete operations are soft deletes, meaning the records are marked as deleted but not actually removed from the database.
5. The `enable_view`, `enable_add`, `enable_edit`, and `enable_delete` fields determine what actions are allowed for this permission category.
6. The `display_order` field determines the order in which categories are displayed.
7. Short codes must be unique across all permission groups and categories.
