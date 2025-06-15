# Users API

## API URLs and Payloads

### 1. User Signup

**URL:** `POST http://localhost:3001/api/users/signup`

**Payload:**
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1-555-123-4567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1-555-123-4567",
      "auth_type": "password",
      "user_type": "customer",
      "is_active": true,
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T10:30:45.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Login

**URL:** `POST http://localhost:3001/api/users/login`

**Payload:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1-555-123-4567",
      "auth_type": "password",
      "user_type": "customer",
      "is_active": true,
      "last_login": "2023-07-15T11:45:22.000Z",
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T11:45:22.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Refresh Token

**URL:** `POST http://localhost:3001/api/users/refresh-token`

**Payload:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Request Password Reset

**URL:** `POST http://localhost:3001/api/users/request-password-reset`

**Payload:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If your email is registered, you will receive a password reset link",
  "debug_token": "a1b2c3d4e5f6..." // Only in development
}
```

### 5. Reset Password

**URL:** `POST http://localhost:3001/api/users/reset-password`

**Payload:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "new_password": "newSecurePassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

### 6. Get User Profile (Authenticated)

**URL:** `GET http://localhost:3001/api/users/profile`

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
    "username": "johndoe",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-123-4567",
    "profile_image": null,
    "auth_type": "password",
    "user_type": "customer",
    "language": "en",
    "timezone": "UTC",
    "is_active": true,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T11:45:22.000Z"
  }
}
```

### 7. Update User Profile (Authenticated)

**URL:** `PUT http://localhost:3001/api/users/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Payload:**
```json
{
  "username": "johndoe_updated",
  "first_name": "Johnny",
  "last_name": "Doe",
  "phone": "+1-555-987-6543",
  "profile_image": "https://example.com/profile.jpg",
  "language": "fr",
  "timezone": "Europe/Paris"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "username": "johndoe_updated",
    "email": "john.doe@example.com",
    "first_name": "Johnny",
    "last_name": "Doe",
    "phone": "+1-555-987-6543",
    "profile_image": "https://example.com/profile.jpg",
    "auth_type": "password",
    "user_type": "customer",
    "language": "fr",
    "timezone": "Europe/Paris",
    "is_active": true,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T12:15:30.000Z"
  }
}
```

### 8. Change Password (Authenticated)

**URL:** `POST http://localhost:3001/api/users/change-password`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Payload:**
```json
{
  "current_password": "securepassword123",
  "new_password": "evenMoreSecure456!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 9. Get All Users (Admin Only)

**URL:** `GET http://localhost:3001/api/users?page=1&limit=10&is_active=true&user_type=staff&search=john`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1-555-123-4567",
      "auth_type": "password",
      "user_type": "staff",
      "is_active": true,
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T11:45:22.000Z",
      "Employee": {
        "id": 5,
        "employee_id": "EMP005",
        "first_name": "John",
        "last_name": "Doe"
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

### 10. Get User by ID (Admin Only)

**URL:** `GET http://localhost:3001/api/users/1`

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
    "username": "johndoe",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-123-4567",
    "profile_image": null,
    "auth_type": "password",
    "user_type": "staff",
    "default_branch_id": 1,
    "language": "en",
    "timezone": "UTC",
    "is_active": true,
    "is_system": false,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T11:45:22.000Z",
    "Employee": {
      "id": 5,
      "employee_id": "EMP005",
      "first_name": "John",
      "last_name": "Doe"
    },
    "DefaultBranch": {
      "id": 1,
      "name": "Headquarters"
    }
  }
}
```

### 11. Create User (Admin Only)

**URL:** `POST http://localhost:3001/api/users`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Payload:**
```json
{
  "employee_id": 5,
  "username": "janesmith",
  "email": "jane.smith@example.com",
  "password": "securepassword123",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1-555-789-0123",
  "auth_type": "password",
  "user_type": "staff",
  "default_branch_id": 1,
  "language": "en",
  "timezone": "UTC",
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "employee_id": 5,
    "username": "janesmith",
    "email": "jane.smith@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1-555-789-0123",
    "auth_type": "password",
    "user_type": "staff",
    "default_branch_id": 1,
    "language": "en",
    "timezone": "UTC",
    "is_active": true,
    "is_system": false,
    "created_by": 1,
    "created_at": "2023-07-15T14:20:10.000Z",
    "updated_at": "2023-07-15T14:20:10.000Z",
    "Employee": {
      "id": 5,
      "employee_id": "EMP005",
      "first_name": "Jane",
      "last_name": "Smith"
    },
    "DefaultBranch": {
      "id": 1,
      "name": "Headquarters"
    }
  }
}
```

### 12. Update User (Admin Only)

**URL:** `PUT http://localhost:3001/api/users/2`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Payload:**
```json
{
  "username": "janesmith_updated",
  "first_name": "Jane",
  "last_name": "Smith-Johnson",
  "phone": "+1-555-789-0123",
  "user_type": "admin",
  "is_active": true,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 2,
    "employee_id": 5,
    "username": "janesmith_updated",
    "email": "jane.smith@example.com",
    "first_name": "Jane",
    "last_name": "Smith-Johnson",
    "phone": "+1-555-789-0123",
    "auth_type": "password",
    "user_type": "admin",
    "default_branch_id": 1,
    "language": "en",
    "timezone": "UTC",
    "is_active": true,
    "is_system": false,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-07-15T14:20:10.000Z",
    "updated_at": "2023-07-15T14:35:22.000Z"
  }
}
```

### 13. Delete User (Admin Only)

**URL:** `DELETE http://localhost:3001/api/users/2`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```
