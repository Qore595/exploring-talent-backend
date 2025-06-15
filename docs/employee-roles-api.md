# Employee Roles API

## API URLs and Payloads

### 1. Get All Employee Roles

**URL:** `GET http://localhost:3001/api/employee-roles`

**Query Parameters:** 
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `is_active`: Filter by active status (true/false)
- `is_primary`: Filter by primary role status (true/false)
- `employee_id`: Filter by employee ID
- `role_id`: Filter by role ID
- `branch_id`: Filter by branch ID

**Example:** `GET http://localhost:3001/api/employee-roles?page=1&limit=10&is_active=true&employee_id=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_id": 1,
      "role_id": 1,
      "branch_id": null,
      "is_primary": true,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "Employee": {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User"
      },
      "Role": {
        "id": 1,
        "name": "Administrator",
        "slug": "administrator"
      },
      "Branch": null,
      "CreatedBy": {
        "id": 1,
        "first_name": "Admin",
        "last_name": "User",
        "employee_id": "EMP001"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Roles by Employee ID

**URL:** `GET http://localhost:3001/api/employee-roles/employee/:employeeId`

**Example:** `GET http://localhost:3001/api/employee-roles/employee/3`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "employee_id": 3,
      "role_id": 3,
      "branch_id": 2,
      "is_primary": true,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "Role": {
        "id": 3,
        "name": "Staff",
        "slug": "staff",
        "description": "Regular staff member",
        "priority": 10
      },
      "Branch": {
        "id": 2,
        "name": "Branch Office",
        "code": "BR001"
      }
    },
    {
      "id": 4,
      "employee_id": 3,
      "role_id": 4,
      "branch_id": 2,
      "is_primary": false,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "Role": {
        "id": 4,
        "name": "Team Lead",
        "slug": "team-lead",
        "description": "Team leader with limited management responsibilities",
        "priority": 15
      },
      "Branch": {
        "id": 2,
        "name": "Branch Office",
        "code": "BR001"
      }
    }
  ]
}
```

### 3. Get Employees by Role ID

**URL:** `GET http://localhost:3001/api/employee-roles/role/:roleId`

**Example:** `GET http://localhost:3001/api/employee-roles/role/3`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "employee_id": 3,
      "role_id": 3,
      "branch_id": 2,
      "is_primary": true,
      "is_active": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:00.000Z",
      "updated_at": "2023-07-15T10:30:00.000Z",
      "deleted_at": null,
      "Employee": {
        "id": 3,
        "employee_id": "EMP003",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@talentspark.com",
        "phone": "+1-123-456-7892",
        "designation_id": 3
      },
      "Branch": {
        "id": 2,
        "name": "Branch Office",
        "code": "BR001"
      }
    }
  ]
}
```

### 4. Get Employee Role by ID

**URL:** `GET http://localhost:3001/api/employee-roles/:id`

**Example:** `GET http://localhost:3001/api/employee-roles/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": 1,
    "role_id": 1,
    "branch_id": null,
    "is_primary": true,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T10:30:00.000Z",
    "updated_at": "2023-07-15T10:30:00.000Z",
    "deleted_at": null,
    "Employee": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    },
    "Role": {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator"
    },
    "Branch": null,
    "CreatedBy": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "User",
      "employee_id": "EMP001"
    }
  }
}
```

### 5. Create Employee Role

**URL:** `POST http://localhost:3001/api/employee-roles`

**Payload:**
```json
{
  "employee_id": 2,
  "role_id": 3,
  "branch_id": 1,
  "is_primary": false,
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee role assigned successfully",
  "data": {
    "id": 5,
    "employee_id": 2,
    "role_id": 3,
    "branch_id": 1,
    "is_primary": false,
    "is_active": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T11:30:00.000Z",
    "deleted_at": null,
    "Employee": {
      "id": 2,
      "employee_id": "EMP002",
      "first_name": "John",
      "last_name": "Doe"
    },
    "Role": {
      "id": 3,
      "name": "Staff",
      "slug": "staff"
    },
    "Branch": {
      "id": 1,
      "name": "Head Office",
      "code": "HO"
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

### 6. Update Employee Role

**URL:** `PUT http://localhost:3001/api/employee-roles/:id`

**Example:** `PUT http://localhost:3001/api/employee-roles/5`

**Payload:**
```json
{
  "is_primary": true,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee role updated successfully",
  "data": {
    "id": 5,
    "employee_id": 2,
    "role_id": 3,
    "branch_id": 1,
    "is_primary": true,
    "is_active": true,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-07-15T11:30:00.000Z",
    "updated_at": "2023-07-15T12:00:00.000Z",
    "deleted_at": null,
    "Employee": {
      "id": 2,
      "employee_id": "EMP002",
      "first_name": "John",
      "last_name": "Doe"
    },
    "Role": {
      "id": 3,
      "name": "Staff",
      "slug": "staff"
    },
    "Branch": {
      "id": 1,
      "name": "Head Office",
      "code": "HO"
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

### 7. Delete Employee Role

**URL:** `DELETE http://localhost:3001/api/employee-roles/:id`

**Example:** `DELETE http://localhost:3001/api/employee-roles/5`

**Response:**
```json
{
  "success": true,
  "message": "Employee role deleted successfully"
}
```

## Notes

1. **Primary Role**: Each employee can have multiple roles, but only one can be marked as primary (`is_primary=true`). When setting a role as primary, all other roles for that employee will automatically be set to non-primary.
2. **Branch-Specific Roles**: Roles can be assigned globally (branch_id=null) or for specific branches.
3. **Unique Constraint**: An employee cannot have the same role assigned more than once for the same branch.
4. **Soft Delete**: When an employee role is deleted, it is not removed from the database. Instead, the `deleted_at` field is set to the current timestamp and `is_active` is set to false.
5. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
6. **Filtering**: The API supports filtering by employee_id, role_id, branch_id, is_primary, and is_active.
