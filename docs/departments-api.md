# Departments API

## API URLs and Payloads

### 1. Get All Departments

**URL:** `GET http://localhost:3001/api/departments`

**Query Parameters:** `page`, `limit`, `is_active`, `branch_id`, `search`

**Example:** `GET http://localhost:3001/api/departments?page=1&limit=10&is_active=true&branch_id=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Human Resources",
      "branch_id": 1,
      "short_code": "HR",
      "description": "Human Resources department for employee management",
      "is_active": true,
      "created_by": 1,
      "created_at": "2023-05-10T10:00:00.000Z",
      "updated_at": "2023-05-10T10:00:00.000Z",
      "Branch": {
        "id": 1,
        "name": "Head Office"
      }
    },
    {
      "id": 2,
      "name": "Finance",
      "branch_id": 1,
      "short_code": "FIN",
      "description": "Finance department for financial management",
      "is_active": true,
      "created_by": 1,
      "created_at": "2023-05-10T10:05:00.000Z",
      "updated_at": "2023-05-10T10:05:00.000Z",
      "Branch": {
        "id": 1,
        "name": "Head Office"
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

### 2. Get Departments by Branch ID

**URL:** `GET http://localhost:3001/api/departments/branch/:branchId`

**Query Parameters:** `page`, `limit`, `is_active`, `search`

**Example:** `GET http://localhost:3001/api/departments/branch/1?page=1&limit=10&is_active=true`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Human Resources",
      "branch_id": 1,
      "short_code": "HR",
      "description": "Human Resources department for employee management",
      "is_active": true,
      "created_by": 1,
      "created_at": "2023-05-10T10:00:00.000Z",
      "updated_at": "2023-05-10T10:00:00.000Z",
      "Branch": {
        "id": 1,
        "name": "Head Office"
      }
    },
    {
      "id": 2,
      "name": "Finance",
      "branch_id": 1,
      "short_code": "FIN",
      "description": "Finance department for financial management",
      "is_active": true,
      "created_by": 1,
      "created_at": "2023-05-10T10:05:00.000Z",
      "updated_at": "2023-05-10T10:05:00.000Z",
      "Branch": {
        "id": 1,
        "name": "Head Office"
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

### 3. Get Department by ID

**URL:** `GET http://localhost:3001/api/departments/:id`

**Example:** `GET http://localhost:3001/api/departments/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Human Resources",
    "branch_id": 1,
    "short_code": "HR",
    "description": "Human Resources department for employee management",
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-10T10:00:00.000Z",
    "updated_at": "2023-05-10T10:00:00.000Z",
    "Branch": {
      "id": 1,
      "name": "Head Office"
    }
  }
}
```

### 4. Create Department

**URL:** `POST http://localhost:3001/api/departments`

**Payload:**
```json
{
  "name": "Information Technology",
  "branch_id": 1,
  "short_code": "IT",
  "description": "IT department for technology management",
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "id": 3,
    "name": "Information Technology",
    "branch_id": 1,
    "short_code": "IT",
    "description": "IT department for technology management",
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-10T10:10:00.000Z",
    "updated_at": "2023-05-10T10:10:00.000Z"
  }
}
```

### 5. Update Department

**URL:** `PUT http://localhost:3001/api/departments/:id`

**Example:** `PUT http://localhost:3001/api/departments/3`

**Payload:**
```json
{
  "name": "Information Technology & Systems",
  "description": "IT department for technology and systems management",
  "short_code": "ITS"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Department updated successfully",
  "data": {
    "id": 3,
    "name": "Information Technology & Systems",
    "branch_id": 1,
    "short_code": "ITS",
    "description": "IT department for technology and systems management",
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-10T10:10:00.000Z",
    "updated_at": "2023-05-10T10:15:00.000Z",
    "Branch": {
      "id": 1,
      "name": "Head Office"
    }
  }
}
```

### 6. Delete Department

**URL:** `DELETE http://localhost:3001/api/departments/:id`

**Example:** `DELETE http://localhost:3001/api/departments/3`

**Response:**
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

## Full Payload Fields

**Department Create/Update Payload Fields:**
```json
{
  "name": "Department Name",
  "branch_id": 1,
  "short_code": "DEPT",
  "description": "Department description text",
  "is_active": true,
  "created_by": 1
}
```

## Notes

1. **Branch Association**: Departments are associated with a specific branch by setting the `branch_id` field.
2. **Unique Constraint**: Department names must be unique within a branch. The same department name can exist in different branches.
3. **Short Code**: The `short_code` field is optional but can be used for quick reference.
4. **Deletion**: When a branch is deleted, all associated departments are also deleted (CASCADE).
5. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
6. **Filtering**: You can filter departments by `is_active` and `branch_id`.
7. **Search**: You can search for departments by name or short_code using the `search` query parameter.
