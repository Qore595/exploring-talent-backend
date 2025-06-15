# SMS Templates API

This API allows you to manage SMS message templates for the system.

## API URLs and Payloads

### 1. Get All SMS Templates

**URL:** `GET http://localhost:3001/api/sms-templates?page=1&limit=10&is_active=true&category=otp&search=verification`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 10)
- `is_active`: Filter by active status (true/false)
- `category`: Filter by template category
- `template_code`: Filter by template code
- `search`: Search term for template name, code, or content

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "template_name": "OTP Verification",
      "template_code": "otp_verification",
      "content": "Your verification code is {OTP}. Valid for {VALIDITY} minutes. Do not share this code with anyone.",
      "variables": "OTP,VALIDITY",
      "category": "otp",
      "is_active": true,
      "character_count": 92,
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T11:45:22.000Z",
      "CreatedBy": {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User"
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

### 2. Get SMS Template by ID

**URL:** `GET http://localhost:3001/api/sms-templates/550e8400-e29b-41d4-a716-446655440001`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "template_name": "OTP Verification",
    "template_code": "otp_verification",
    "content": "Your verification code is {OTP}. Valid for {VALIDITY} minutes. Do not share this code with anyone.",
    "variables": "OTP,VALIDITY",
    "category": "otp",
    "is_active": true,
    "character_count": 92,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T11:45:22.000Z",
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

### 3. Create SMS Template

**URL:** `POST http://localhost:3001/api/sms-templates`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Payload:**
```json
{
  "template_name": "OTP Verification",
  "template_code": "otp_verification",
  "content": "Your verification code is {OTP}. Valid for {VALIDITY} minutes. Do not share this code with anyone.",
  "variables": "OTP,VALIDITY",
  "category": "otp",
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS template created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "template_name": "OTP Verification",
    "template_code": "otp_verification",
    "content": "Your verification code is {OTP}. Valid for {VALIDITY} minutes. Do not share this code with anyone.",
    "variables": "OTP,VALIDITY",
    "category": "otp",
    "is_active": true,
    "character_count": 92,
    "created_by": 1,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T10:30:45.000Z",
    "CreatedBy": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User"
    }
  }
}
```

### 4. Update SMS Template

**URL:** `PUT http://localhost:3001/api/sms-templates/550e8400-e29b-41d4-a716-446655440001`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Payload:**
```json
{
  "template_name": "OTP Verification Code",
  "content": "Your verification code is {OTP}. Valid for {VALIDITY} minutes. Please do not share this code with anyone for security reasons.",
  "is_active": true,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS template updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "template_name": "OTP Verification Code",
    "template_code": "otp_verification",
    "content": "Your verification code is {OTP}. Valid for {VALIDITY} minutes. Please do not share this code with anyone for security reasons.",
    "variables": "OTP,VALIDITY",
    "category": "otp",
    "is_active": true,
    "character_count": 119,
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

### 5. Delete SMS Template

**URL:** `DELETE http://localhost:3001/api/sms-templates/550e8400-e29b-41d4-a716-446655440001`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "SMS template deleted successfully"
}
```
