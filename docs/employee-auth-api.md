# Employee Authentication API

This API provides endpoints for employee authentication in the TalentSpark system.

## Base URL

```
http://localhost:3001/api/employee-auth
```

## Authentication

Protected endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Endpoints

### 1. Employee Login

Authenticates an employee and returns a JWT token.

**URL:** `POST /api/employee-auth/login`

**Authentication Required:** No

**Payload:**
```json
{
  "email": "employee@example.com",
  "password": "password123"
}
```

> **Note:** To create a test employee with these credentials for development purposes, use the Create Test Employee endpoint described below.

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "employee": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "employee@example.com",
      "phone": "+1234567890",
      "gender": "male",
      "branch_id": 1,
      "department_id": 2,
      "designation_id": 3,
      "is_active": true,
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T10:30:45.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- **Invalid Credentials:**
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

- **Inactive Account:**
  ```json
  {
    "success": false,
    "message": "Your account is inactive. Please contact the administrator."
  }
  ```

- **Missing Fields:**
  ```json
  {
    "success": false,
    "message": "Email and password are required"
  }
  ```

### 2. Refresh Token

Refreshes an expired JWT token using a refresh token.

**URL:** `POST /api/employee-auth/refresh-token`

**Authentication Required:** No

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
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- **Invalid Refresh Token:**
  ```json
  {
    "success": false,
    "message": "Invalid refresh token"
  }
  ```

- **Missing Refresh Token:**
  ```json
  {
    "success": false,
    "message": "Refresh token is required"
  }
  ```

### 3. Check Employee Status

Checks if an employee is currently active and authenticated.

**URL:** `GET /api/employee-auth/status`

**Authentication Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Employee is active and authenticated",
  "data": {
    "employee": {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "employee@example.com",
      "is_active": true,
      "is_superadmin": false,
      "last_login": "2023-07-15T10:30:45.000Z"
    }
  }
}
```

**Error Responses:**

- **Authentication Failed:**
  ```json
  {
    "success": false,
    "message": "Authentication failed"
  }
  ```

### 4. Send Login Notification

Sends a notification about the employee's login activity.

**URL:** `POST /api/employee-auth/send-notification`

**Authentication Required:** Yes

**Payload:**
```json
{
  "notification_type": "email" // Optional, defaults to "email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login notification sent via email",
  "data": {
    "notification_id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "notification_type": "email",
    "sent_at": "2023-07-15T10:35:22.000Z"
  }
}
```

**Error Responses:**

- **Employee Not Found:**
  ```json
  {
    "success": false,
    "message": "Employee not found"
  }
  ```

### 5. Logout

Logs out the employee and updates the last logout timestamp.

**URL:** `POST /api/employee-auth/logout`

**Authentication Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**

- **Authentication Failed:**
  ```json
  {
    "success": false,
    "message": "Authentication failed"
  }
  ```

### 6. Create Test Employee (Development Only)

Creates a test employee account with the email "employee@example.com" and password "password123" for testing purposes.

**URL:** `POST /api/employee-auth/create-test-employee`

**Authentication Required:** No

**Response (New Employee):**
```json
{
  "success": true,
  "message": "Test employee created successfully",
  "data": {
    "employee": {
      "id": 1,
      "employee_id": "TEST001",
      "first_name": "Test",
      "last_name": "Employee",
      "email": "employee@example.com",
      "phone": "+1234567890",
      "gender": "male",
      "branch_id": 1,
      "department_id": 1,
      "designation_id": 1,
      "position": "Tester",
      "employment_status": "full-time",
      "is_active": true,
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T10:30:45.000Z"
    },
    "login": {
      "email": "employee@example.com",
      "password": "password123"
    }
  }
}
```

**Response (Employee Already Exists):**
```json
{
  "success": true,
  "message": "Test employee already exists",
  "data": {
    "id": 1,
    "email": "employee@example.com",
    "password": "password123"
  }
}
```

**Error Responses:**

- **Production Environment:**
  ```json
  {
    "success": false,
    "message": "This endpoint is only available in development mode"
  }
  ```

### 7. Reset Employee Password (Development Only)

Resets the password for an existing employee account. Useful for testing when you don't know the current password.

**URL:** `POST /api/employee-auth/reset-password`

**Authentication Required:** No

**Payload:**
```json
{
  "email": "pittisunilkumar3@gmail.com",
  "newPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "email": "pittisunilkumar3@gmail.com",
    "newPassword": "password123"
  }
}
```

**Error Responses:**

- **Employee Not Found:**
  ```json
  {
    "success": false,
    "message": "Employee not found"
  }
  ```

- **Missing Fields:**
  ```json
  {
    "success": false,
    "message": "Email and new password are required"
  }
  ```

- **Production Environment:**
  ```json
  {
    "success": false,
    "message": "This endpoint is only available in development mode"
  }
  ```

### 8. Test Login Credentials (Development Only)

Tests if the provided credentials would work for login without actually logging in. Useful for debugging login issues.

**URL:** `POST /api/employee-auth/test-login-credentials`

**Authentication Required:** No

**Payload:**
```json
{
  "email": "pittisunilkumar3@gmail.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Credentials are valid",
  "data": {
    "email": "pittisunilkumar3@gmail.com",
    "exists": true,
    "has_password": true,
    "password_valid": true,
    "is_active": true
  }
}
```

**Response (Invalid Password):**
```json
{
  "success": true,
  "message": "Password is incorrect",
  "data": {
    "email": "pittisunilkumar3@gmail.com",
    "exists": true,
    "has_password": true,
    "password_valid": false,
    "is_active": true
  }
}
```

**Response (User Not Found):**
```json
{
  "success": false,
  "message": "No employee found with this email",
  "data": {
    "email": "nonexistent@example.com",
    "exists": false
  }
}
```

**Error Responses:**

- **Missing Fields:**
  ```json
  {
    "success": false,
    "message": "Email and password are required"
  }
  ```

- **Production Environment:**
  ```json
  {
    "success": false,
    "message": "This endpoint is only available in development mode"
  }
  ```

## Authentication Flow

1. Client sends employee credentials to the `/api/employee-auth/login` endpoint
2. Server validates credentials and returns tokens
3. Client includes the token in the Authorization header for subsequent API requests
4. When the token expires, client uses the refresh token to get a new token via `/api/employee-auth/refresh-token`
5. Client can check if the employee is still authenticated via `/api/employee-auth/status`
6. Client can send login notifications via `/api/employee-auth/send-notification`
7. Client can log out the employee via `/api/employee-auth/logout`
