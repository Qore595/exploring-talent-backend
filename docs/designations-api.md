# Designations API

## API URLs and Payloads

### 1. Get All Designations

**URL:** `GET http://localhost:3001/api/designations`

**Query Parameters:** `page`, `limit`, `is_active`, `branch_id`, `search`

**Example:** `GET http://localhost:3001/api/designations?page=1&limit=10&is_active=true&branch_id=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "CEO",
      "branch_id": 1,
      "short_code": "CEO",
      "description": "Chief Executive Officer",
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
      "name": "CTO",
      "branch_id": 1,
      "short_code": "CTO",
      "description": "Chief Technology Officer",
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
    "total": 7,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Designation by ID

**URL:** `GET http://localhost:3001/api/designations/:id`

**Example:** `GET http://localhost:3001/api/designations/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "CEO",
    "branch_id": 1,
    "short_code": "CEO",
    "description": "Chief Executive Officer",
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

### 3. Create Designation

**URL:** `POST http://localhost:3001/api/designations`

**Payload:**
```json
{
  "name": "Software Developer",
  "branch_id": 1,
  "short_code": "SD",
  "description": "Software Developer position",
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Designation created successfully",
  "data": {
    "id": 8,
    "name": "Software Developer",
    "branch_id": 1,
    "short_code": "SD",
    "description": "Software Developer position",
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-10T10:10:00.000Z",
    "updated_at": "2023-05-10T10:10:00.000Z"
  }
}
```

### 4. Update Designation

**URL:** `PUT http://localhost:3001/api/designations/:id`

**Example:** `PUT http://localhost:3001/api/designations/8`

**Payload:**
```json
{
  "name": "Junior Software Developer",
  "description": "Junior Software Developer position",
  "short_code": "JSD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Designation updated successfully",
  "data": {
    "id": 8,
    "name": "Junior Software Developer",
    "branch_id": 1,
    "short_code": "JSD",
    "description": "Junior Software Developer position",
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

### 5. Delete Designation

**URL:** `DELETE http://localhost:3001/api/designations/:id`

**Example:** `DELETE http://localhost:3001/api/designations/8`

**Response:**
```json
{
  "success": true,
  "message": "Designation deleted successfully"
}
```

## Full Payload Fields

**Designation Create/Update Payload Fields:**
```json
{
  "name": "Designation Name",
  "branch_id": 1,
  "short_code": "DSG",
  "description": "Designation description text",
  "is_active": true,
  "created_by": 1
}
```

## Notes

1. **Branch Association**: Designations are associated with a specific branch by setting the `branch_id` field.
2. **Unique Constraint**: Designation names must be unique within a branch. The same designation name can exist in different branches.
3. **Short Code**: The `short_code` field is optional but can be used for quick reference.
4. **Deletion**: When a branch is deleted, all associated designations are also deleted (CASCADE).
5. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
6. **Filtering**: You can filter designations by `is_active` and `branch_id`.
7. **Search**: You can search for designations by name or short_code using the `search` query parameter.
8. **Employee Relationship**: Employees are associated with designations through the `designation_id` field in the employees table.
