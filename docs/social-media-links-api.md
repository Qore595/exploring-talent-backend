# Social Media Links API

This API allows you to manage social media links for the system.

## API URLs and Payloads

### 1. Get All Social Media Links

**URL:** `GET http://localhost:3001/api/social-media-links?page=1&limit=10&is_active=true&search=facebook`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 10)
- `is_active`: Filter by active status (true/false)
- `platform_code`: Filter by platform code
- `search`: Search term for platform name, code, or URL

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "platform_name": "Facebook",
      "platform_code": "facebook",
      "url": "https://facebook.com/talentspark",
      "is_active": true,
      "open_in_new_tab": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T10:30:45.000Z",
      "CreatedBy": {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User"
      }
    },
    {
      "id": 2,
      "platform_name": "Twitter",
      "platform_code": "twitter",
      "url": "https://twitter.com/talentspark",
      "is_active": true,
      "open_in_new_tab": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T10:30:45.000Z",
      "CreatedBy": {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User"
      }
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Social Media Link by ID

**URL:** `GET http://localhost:3001/api/social-media-links/1`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "platform_name": "Facebook",
    "platform_code": "facebook",
    "url": "https://facebook.com/talentspark",
    "is_active": true,
    "open_in_new_tab": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T10:30:45.000Z",
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

### 3. Create Social Media Link

**URL:** `POST http://localhost:3001/api/social-media-links`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Payload:**
```json
{
  "platform_name": "Pinterest",
  "platform_code": "pinterest",
  "url": "https://pinterest.com/talentspark",
  "is_active": true,
  "open_in_new_tab": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Social media link created successfully",
  "data": {
    "id": 6,
    "platform_name": "Pinterest",
    "platform_code": "pinterest",
    "url": "https://pinterest.com/talentspark",
    "is_active": true,
    "open_in_new_tab": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T11:30:45.000Z",
    "updated_at": "2023-07-15T11:30:45.000Z",
    "CreatedBy": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    }
  }
}
```

### 4. Update Social Media Link

**URL:** `PUT http://localhost:3001/api/social-media-links/1`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Payload:**
```json
{
  "platform_name": "Facebook Page",
  "url": "https://facebook.com/talentspark_official",
  "is_active": true,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Social media link updated successfully",
  "data": {
    "id": 1,
    "platform_name": "Facebook Page",
    "platform_code": "facebook",
    "url": "https://facebook.com/talentspark_official",
    "is_active": true,
    "open_in_new_tab": true,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T11:45:22.000Z",
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

### 5. Delete Social Media Link

**URL:** `DELETE http://localhost:3001/api/social-media-links/6`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "Social media link deleted successfully"
}
```
