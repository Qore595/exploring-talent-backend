
# Employee Profile API Documentation

## Overview
The Employee Profile API provides a comprehensive endpoint to retrieve complete employee information including their branch details, assigned roles, permissions, and accessible sidebar menu items. This API consolidates data from multiple related entities to provide a complete user profile in a single request.

**Response Structure**: The API returns data organized as:
```
{
    employee_details,
    branch_details,
    role_details,
    sidebar_menus (only if permission_category.can_view is true)
}
```

The API implements server-side filtering to ensure that only accessible menu items are returned, based on the user's permissions. Sidebar menus and sub-menus are only included when they contain permission categories with `can_view: true`.

## Base URL
```
http://localhost:3001/api/employees
```

## Authentication
All requests require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Get Employee Profile

### Endpoint
```http
GET /api/employees/profile/:id
```

### Description
Retrieves comprehensive employee profile information including:
- Employee personal and professional details
- Branch, department, and designation information
- Manager details
- **Server-side filtered sidebar menus**: The API returns only sidebar menus and sub-menus that contain permission categories with `can_view: true`
- Role-based permissions organized by accessible sidebar menus and sub-menus
- **Special handling for superadmin employees** - returns full access to all roles and permissions

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string/number | Yes | The unique identifier of the employee |

### Request Headers
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

### Success Response

#### Response Code: `200 OK`

#### Response Variations:
The API returns different response structures based on employee type:

1. **Regular Employee Response**: Returns role-based permissions as assigned in the database
2. **Superadmin Employee Response**: Returns full access to all roles and permissions with special attributes

#### Common Response Body Structure:
```json
{
  "success": true,
  "message": "Employee profile retrieved successfully",
  "data": {
    "employee_details": {
      "id": "string/number",
      "employee_id": "string",
      "first_name": "string",
      "last_name": "string",
      "email": "string",
      "phone": "string",
      "date_of_birth": "string (YYYY-MM-DD)",
      "gender": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "postal_code": "string",
      "hire_date": "string (YYYY-MM-DD)",
      "employment_status": "string",
      "salary": "number",
      "is_active": "boolean",
      "is_superadmin": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)",
      "Department": {
        "id": "string/number",
        "name": "string",
        "short_code": "string",
        "description": "string"
      },
      "Designation": {
        "id": "string/number",
        "name": "string",
        "short_code": "string",
        "description": "string"
      },
      "Manager": {
        "id": "string/number",
        "employee_id": "string",
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "Designation": {
          "name": "string"
        }
      }
    },
    "branch_details": {
      "id": "string/number",
      "name": "string",
      "code": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "phone": "string",
      "email": "string"
    },
    "role_details": [
      {
        "employee_role_id": "string/number",
        "role_id": "string/number",
        "branch_id": "string/number",
        "is_primary": "boolean",
        "is_active": "boolean",
        "assigned_date": "string (ISO date)",
        "role_details": {
          "id": "string/number",
          "name": "string",
          "slug": "string",
          "description": "string",
          "priority": "number",
          "is_system": "boolean"
        },
        "branch_details": {
          "id": "string/number",
          "name": "string",
          "code": "string",
          "city": "string",
          "state": "string",
          "country": "string"
        }
      }
    ],
    "sidebar_menus": [
      {
        "id": "string/number",
        "menu": "string",
        "icon": "string",
        "url": "string",
        "lang_key": "string",
        "display_order": "number",
        "level": "number",
        "sub_menus": [
          {
            "id": "string/number",
            "sub_menu": "string",
            "icon": "string",
            "url": "string",
            "lang_key": "string",
            "display_order": "number",
            "level": "number",
            "is_active": "boolean",
            "permission_categories": [
              {
                "id": "string/number",
                "name": "string",
                "short_code": "string",
                "description": "string",
                "can_view": true,
                "can_add": "boolean",
                "can_edit": "boolean",
                "can_delete": "boolean"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Example Request
```http
GET /api/employees/profile/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example Success Response
```json
{
  "success": true,
  "message": "Employee profile retrieved successfully",
  "data": {
    "employee_details": {
      "id": "123",
      "employee_id": "EMP001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@company.com",
      "phone": "+1234567890",
      "date_of_birth": "1990-05-15",
      "gender": "Male",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postal_code": "10001",
      "hire_date": "2023-01-15",
      "employment_status": "Full-time",
      "salary": 75000,
      "is_active": true,
      "is_superadmin": false,
      "created_at": "2023-01-15T10:00:00Z",
      "updated_at": "2024-12-01T15:30:00Z",
      "Department": {
        "id": "5",
        "name": "Information Technology",
        "short_code": "IT",
        "description": "Technology and software development"
      },
      "Designation": {
        "id": "8",
        "name": "Senior Developer",
        "short_code": "SR_DEV",
        "description": "Senior level software developer"
      },
      "Manager": {
        "id": "45",
        "employee_id": "EMP045",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@company.com",
        "Designation": {
          "name": "Technical Lead"
        }
      }
    },
    "branch_details": {
      "id": "1",
      "name": "New York Office",
      "code": "NYC",
      "address": "456 Business Ave",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "phone": "+1234567891",
      "email": "nyc@company.com"
    },
    "role_details": [
      {
        "employee_role_id": "78",
        "role_id": "3",
        "branch_id": "1",
        "is_primary": true,
        "is_active": true,
        "assigned_date": "2023-01-15T10:00:00Z",
        "role_details": {
          "id": "3",
          "name": "Developer",
          "slug": "developer",
          "description": "Software development role",
          "priority": 3,
          "is_system": false
        },
        "branch_details": {
          "id": "1",
          "name": "New York Office",
          "code": "NYC",
          "city": "New York",
          "state": "NY",
          "country": "USA"
        }
      }
    ],
    "sidebar_menus": [
      {
        "id": "7",
        "menu": "Projects",
        "icon": "fas fa-project-diagram",
        "url": "/projects",
        "lang_key": "projects",
        "display_order": 3,
        "level": 0,
        "sub_menus": [
          {
            "id": "21",
            "sub_menu": "Active Projects",
            "icon": "fas fa-tasks",
            "url": "/projects/active",
            "lang_key": "active_projects",
            "display_order": 1,
            "level": 1,
            "is_active": true,
            "permission_categories": [
              {
                "id": "4",
                "name": "Project Management",
                "short_code": "PROJ_MGMT",
                "description": "Manage projects and tasks",
                "can_view": true,
                "can_add": true,
                "can_edit": true,
                "can_delete": false
              }
            ]
          },
          {
            "id": "22",
            "sub_menu": "Project Reports",
            "icon": "fas fa-chart-line",
            "url": "/projects/reports",
            "lang_key": "project_reports",
            "display_order": 2,
            "level": 1,
            "is_active": true,
            "permission_categories": [
              {
                "id": "4",
                "name": "Project Management",
                "short_code": "PROJ_MGMT",
                "description": "Manage projects and tasks",
                "can_view": true,
                "can_add": true,
                "can_edit": true,
                "can_delete": false
              }
            ]
          }
        ]
      },
      {
        "id": "3",
        "menu": "Employees",
        "icon": "fas fa-users",
        "url": "/employees",
        "lang_key": "employees",
        "display_order": 2,
        "level": 0,
        "sub_menus": [
          {
            "id": "8",
            "sub_menu": "My Profile",
            "icon": "fas fa-user",
            "url": "/employees/profile",
            "lang_key": "my_profile",
            "display_order": 1,
            "level": 1,
            "is_active": true,
            "permission_categories": [
              {
                "id": "7",
                "name": "Employee Records",
                "short_code": "EMP_RECORDS",
                "description": "Access to employee information",
                "can_view": true,
                "can_add": false,
                "can_edit": false,
                "can_delete": false
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Example Superadmin Response
For employees with `is_superadmin: true`, the API returns a different response structure with full access:

```json
{
  "success": true,
  "message": "Superadmin employee profile retrieved successfully",
  "data": {
    "employee_details": {
      "id": "1",
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User",
      "email": "admin@company.com",
      "phone": "+1234567890",
      "is_superadmin": true,
      "is_active": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2024-12-01T15:30:00Z",
      "Department": {
        "id": "1",
        "name": "Administration",
        "short_code": "ADMIN",
        "description": "Administrative department"
      },
      "Designation": {
        "id": "1",
        "name": "System Administrator",
        "short_code": "SYS_ADMIN",
        "description": "System administrator role"
      },
      "Manager": null
    },
    "branch_details": {
      "id": "1",
      "name": "Head Office",
      "code": "HO",
      "address": "123 Corporate Blvd",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "phone": "+1234567890",
      "email": "headoffice@company.com"
    },
    "role_details": [
      {
        "employee_role_id": "superadmin",
        "role_id": "1",
        "branch_id": null,
        "is_primary": true,
        "is_active": true,
        "assigned_date": "2023-01-01T00:00:00Z",
        "role_details": {
          "id": "1",
          "name": "Administrator",
          "slug": "administrator",
          "description": "Full system administrator",
          "priority": 1,
          "is_system": true
        },
        "branch_details": null
      }
    ],
    "sidebar_menus": [
      {
        "id": "1",
        "menu": "Users",
        "icon": "fas fa-users",
        "url": "/users",
        "lang_key": "users",
        "display_order": 1,
        "level": 0,
        "sub_menus": [
          {
            "id": "1",
            "sub_menu": "All Users",
            "icon": "fas fa-list",
            "url": "/users/all",
            "lang_key": "all_users",
            "display_order": 1,
            "level": 1,
            "is_active": true,
            "permission_categories": [
              {
                "id": "1",
                "name": "User Management",
                "short_code": "USER_MGMT",
                "description": "Manage system users",
                "can_view": true,
                "can_add": true,
                "can_edit": true,
                "can_delete": true
              }
            ]
          },
          {
            "id": "2",
            "sub_menu": "Add User",
            "icon": "fas fa-plus",
            "url": "/users/add",
            "lang_key": "add_user",
            "display_order": 2,
            "level": 1,
            "is_active": true,
            "permission_categories": [
              {
                "id": "1",
                "name": "User Management",
                "short_code": "USER_MGMT",
                "description": "Manage system users",
                "can_view": true,
                "can_add": true,
                "can_edit": true,
                "can_delete": true
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Error Responses

#### Employee Not Found
**Response Code:** `404 Not Found`
```json
{
  "success": false,
  "message": "Employee not found",
  "error": "No employee exists with the provided ID"
}
```

#### Invalid Employee ID
**Response Code:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Invalid employee ID",
  "error": "Employee ID must be a valid identifier"
}
```

#### Unauthorized Access
**Response Code:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "Valid JWT token is required to access this endpoint"
}
```

#### Forbidden Access
**Response Code:** `403 Forbidden`
```json
{
  "success": false,
  "message": "Access forbidden",
  "error": "You don't have permission to access this employee's profile"
}
```

#### Internal Server Error
**Response Code:** `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "An unexpected error occurred while retrieving employee profile"
}
```

---

## Key Features

### 1. **Permission-Based Sidebar Menu Filtering**
- **Server-Side Filtering**: All filtering happens on the server, client never receives data for menus without access
- **Visibility Control**: Only returns sidebar menus containing at least one sub-menu with `can_view: true` permission
- **Sub-Menu Filtering**: Only includes sub-menus containing at least one permission category with `can_view: true`
- **Permission Category Filtering**: All included permission categories have `can_view: true` explicitly set
- **Security Enhancement**: Prevents exposure of non-accessible menu items to client applications

### 2. **Comprehensive Data Retrieval**
- Single API call retrieves all employee-related information
- Eliminates need for multiple API requests
- Optimized database queries with proper joins

### 3. **Superadmin Support**
- **Automatic Detection**: API automatically detects superadmin employees (`is_superadmin: true`)
- **Full Access**: Superadmin employees receive access to all roles and permissions
- **Special Attributes**: Superadmin permissions include `superadmin_access: true` in custom attributes
- **Complete Sidebar**: Returns all available sidebar menus regardless of role restrictions

### 4. **Role-Based Data**
- Returns all assigned roles for the employee
- Includes branch-specific role assignments
- Shows role hierarchy and levels
- Different behavior for regular vs. superadmin employees

### 5. **Permission Management**
- Detailed CRUD permissions for each role
- Categorized permission groups
- Permission categories for better organization
- Custom attributes support for advanced permission logic

### 6. **Dynamic Menu System**
- Returns only accessible sidebar menus based on user permissions
- Hierarchical menu structure with submenus
- Menu ordering and icons for UI rendering
- **Superadmin Override**: Superadmin users see all available menus

### 7. **Database Compatibility**
- Supports both MongoDB and SQL databases
- Automatic detection of database type
- Optimized queries for each database system

---

## Filtering Logic Implementation

### Overview
The API implements server-side filtering to ensure that only accessible sidebar menus and sub-menus are returned to the client. This filtering is based on the `can_view` permission in permission categories.

### Filtering Rules

1. **Permission Category Level**: Only permission categories with `can_view: true` are included
2. **Sub-Menu Level**: Sub-menus are only included if they contain at least one permission category with `can_view: true`
3. **Sidebar Menu Level**: Sidebar menus are only included if they contain at least one accessible sub-menu

### Backend Implementation Logic

```javascript
// Pseudocode for filtering logic
const filteredSidebarMenus = sidebarMenus.map(menu => ({
  ...menu,
  sub_menus: menu.sub_menus
    .map(subMenu => ({
      ...subMenu,
      permission_categories: subMenu.permission_categories.filter(
        category => category.can_view === true
      )
    }))
    .filter(subMenu => subMenu.permission_categories.length > 0)
})).filter(menu => menu.sub_menus.length > 0);
```

### Database Query Optimization

For optimal performance, implement filtering at the database level:

```sql
-- Example SQL for filtered sidebar menus
SELECT DISTINCT sm.*, ssm.*, pc.*
FROM sidebar_menus sm
JOIN sidebar_sub_menus ssm ON sm.id = ssm.sidebar_menu_id
JOIN permission_categories pc ON ssm.permission_category_id = pc.id
JOIN role_permissions rp ON pc.id = rp.permission_category_id
JOIN employee_roles er ON rp.role_id = er.role_id
WHERE er.employee_id = ? 
  AND er.is_active = true
  AND pc.can_view = true
  AND sm.is_active = true
  AND ssm.is_active = true
ORDER BY sm.display_order, ssm.display_order;
```

### Superadmin Override

For superadmin users (`is_superadmin: true`):
- All permission categories automatically have `can_view: true`
- No filtering is applied - all active sidebar menus are returned
- This ensures superadmins have complete system access

---

## Usage Guidelines

### 1. **Authentication**
- Always include valid JWT token in Authorization header
- Token should have appropriate permissions to access employee data

### 2. **Employee ID Parameter**
- Can be numeric ID or string-based identifier
- Must correspond to existing employee record
- Case-sensitive for string-based IDs

### 3. **Response Handling**
- Always check the `success` field in response
- Handle different error codes appropriately
- Use the structured data format for UI rendering
- **Different Messages**: Regular employees get "Employee profile retrieved successfully", superadmins get "Superadmin employee profile retrieved successfully"

### 4. **Superadmin Considerations**
- Superadmin employees (`is_superadmin: true`) receive different response structure
- All permissions are set to `true` with `superadmin_access: true` in custom attributes
- `employee_role_id` is set to `"superadmin"` for superadmin responses
- All available roles, permission categories, and sidebar menus are returned

### 5. **Performance Considerations**
- API includes comprehensive data, response size may be large
- Consider caching for frequently accessed profiles
- Use pagination for role and permission lists if needed

---

## Superadmin Implementation Details

### Overview
The Employee Profile API includes special handling for superadmin employees, providing them with comprehensive access to all system resources regardless of their assigned roles.

### Superadmin Detection
The API automatically detects superadmin employees by checking the `is_superadmin` field in the employee record:
- **Field**: `is_superadmin` (Boolean)
- **Default**: `false`
- **Database Location**: `employees` table/collection

### Superadmin Response Behavior
When `is_superadmin: true`:

1. **Bypass Role Restrictions**: All role-based limitations are ignored
2. **Full Permission Access**: All permissions (`can_view`, `can_add`, `can_edit`, `can_delete`) are set to `true`
3. **Special Attributes**: Custom attributes include `superadmin_access: true`
4. **Complete Role Set**: Returns all active roles in the system
5. **All Permission Categories**: Returns all active permission categories
6. **Full Sidebar Access**: Returns all active sidebar menus and submenus
7. **Different Message**: Returns "Superadmin employee profile retrieved successfully"

### Implementation Notes
- **Database Agnostic**: Works with both MongoDB and SQL (Sequelize) implementations
- **Performance Optimized**: Separate queries for superadmin vs. regular employees
- **Consistent Structure**: Maintains same response structure with enhanced data
- **Special Role ID**: Uses `"superadmin"` as the `employee_role_id` for superadmin responses

### Security Considerations
- Superadmin status should be carefully managed in production
- Only trusted administrators should have `is_superadmin: true`
- Consider audit logging for superadmin access
- Regular review of superadmin privileges is recommended

---

## Troubleshooting

### Common Issues

#### 1. **Empty Role Details for Regular Employees**
**Symptom**: Regular employees return empty `role_details` array
**Causes**:
- Employee has no active roles assigned
- Employee roles are marked as `is_active: false`
- Employee roles have `deleted_at` timestamp set

**Solution**: 
- Check `employee_roles` table for active assignments
- Verify role permissions exist in `role_permissions` table
- Ensure permission categories are active

#### 2. **Superadmin Not Getting Full Access**
**Symptom**: Superadmin employee returns limited permissions
**Causes**:
- `is_superadmin` field is `false` or `null`
- Database connection issues
- Permission categories or roles are inactive

**Solution**:
- Verify `employees.is_superadmin = true` in database
- Check that roles and permission categories have `is_active = true`
- Verify sidebar menus have `sidebar_display = true`

#### 3. **Missing Sidebar Details**
**Symptom**: Role details return but `sidebar_menus` array is empty
**Causes**:
- Sidebar menus are inactive (`is_active: false`)
- Sidebar menus have `sidebar_display: false`
- Missing relationships between permission categories and sidebar sub-menus

**Solution**:
- Check `sidebar_menus` table for active entries
- Verify `sidebar_sub_menus` have correct `permission_category_id`
- Ensure proper foreign key relationships

#### 4. **Performance Issues**
**Symptom**: API response is slow
**Causes**:
- Large number of roles/permissions
- Missing database indexes
- Unoptimized queries

**Solution**:
- Add database indexes on frequently queried fields
- Consider pagination for large datasets
- Implement response caching for frequently accessed profiles

### Debug Steps
1. **Verify Employee Exists**: Check if employee ID exists in database
2. **Check Superadmin Status**: Verify `is_superadmin` field value
3. **Validate Role Assignments**: Confirm active employee roles exist
4. **Test Database Connections**: Ensure proper database connectivity
5. **Review Logs**: Check application logs for detailed error messages

---

## Testing Examples

### Test Case 1: Regular Employee Profile
```bash
# Test with a regular employee
curl -X GET "http://localhost:3001/api/employees/profile/2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response**:
- `message`: "Employee profile retrieved successfully"
- `role_details`: Contains actual role assignments with database permissions
- `permissions`: Reflects actual database values (may include `false` values)
- `custom_attributes`: Does not include `superadmin_access`

### Test Case 2: Superadmin Employee Profile
```bash
# Test with a superadmin employee
curl -X GET "http://localhost:3001/api/employees/profile/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response**:
- `message`: "Superadmin employee profile retrieved successfully"
- `role_details`: Contains all active roles in system
- `permissions`: All set to `true` regardless of database values
- `custom_attributes`: Includes `"superadmin_access": true`
- `employee_role_id`: Set to `"superadmin"`

### Test Case 3: Non-existent Employee
```bash
# Test with invalid employee ID
curl -X GET "http://localhost:3001/api/employees/profile/99999" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response**:
- Status Code: `404`
- `success`: `false`
- `message`: "Employee not found"

### Validation Checklist
- [ ] Regular employees receive role-based permissions
- [ ] Superadmin employees receive full access permissions
- [ ] Response messages differ between regular and superadmin employees
- [ ] Sidebar menus are properly nested with sub-menus and permission categories
- [ ] Permission categories contain CRUD permissions (can_view, can_add, can_edit, can_delete)
- [ ] Employee details exclude password field
- [ ] Related entities (branch, department, designation) are properly included
- [ ] Error handling works for invalid IDs
- [ ] Authentication is properly enforced

---

## Related APIs

- **[Employee Authentication API](./employee-auth-api.md)** - For employee login and token generation
- **[Employee Roles API](./employee-roles-api.md)** - For managing employee role assignments
- **[Sidebar Menus API](./sidebar-menus-api.md)** - For managing sidebar menu structure
- **[Role Permissions API](./role-permissions-api.md)** - For managing role-based permissions

---

## Changelog

### Version 1.3.0 (May 2025)
- **BREAKING CHANGE**: Response structure modified to move `sidebar_menus` to top level under `data`
- **View Permission Filtering**: Only includes sidebar menus/sub-menus with `can_view: true` permission categories
- **Server-Side Filtering**: Added comprehensive filtering logic to prevent exposure of non-accessible menu items
- **Performance Optimization**: Reduced response size by excluding non-viewable content
- **Security Enhancement**: Client never receives information about inaccessible features
- **Maintained Compatibility**: Superadmin functionality preserved with full access

### Version 1.2.0 (May 2025)
- **BREAKING CHANGE**: Response structure modified from `permission_categories` → `sidebar_details` to `sidebar_menus` → `sub_menus` → `permission_categories`
- **Improved organization**: Data now flows logically from menu hierarchy to permissions
- **Enhanced CRUD permissions**: Each permission category now directly contains can_view, can_add, can_edit, can_delete fields
- **Simplified structure**: Removed nested permissions object, flattened to direct CRUD fields
- **Maintained compatibility**: Both MongoDB and SQL implementations updated to use new structure

### Version 1.0.0 (December 2024)
- Initial implementation of comprehensive employee profile API
- Support for both MongoDB and SQL databases
- Complete data structure with all related entities
- Permission-based sidebar menu filtering
- **Superadmin functionality**: Special handling for employees with `is_superadmin: true`
- **Full access implementation**: Superadmin users receive all roles and permissions
- **Dual response system**: Different response structures for regular vs. superadmin employees
- **Testing completed**: Successfully tested with both regular employee (ID: 2) and superadmin employee (ID: 1)
- **Syntax error fixes**: Resolved malformed Sequelize query structures and variable naming issues
