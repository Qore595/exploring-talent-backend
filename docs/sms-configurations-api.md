# SMS Configurations API

This API allows you to manage SMS gateway configurations for the system.

> **Note:** All credentials shown in this documentation are placeholders. Replace them with your actual credentials when making API calls. Never commit actual credentials to your codebase.

## API URLs and Payloads

### 1. Get All SMS Configurations

**URL:** `GET http://localhost:3001/api/sms-configurations?page=1&limit=10&is_active=true&mode=live&search=twilio`

**Headers:**
```
Authorization: Bearer {YOUR_JWT_TOKEN}
```

**Query Parameters:**
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 10)
- `is_active`: Filter by active status (true/false)
- `mode`: Filter by mode (live/test)
- `gateway_code`: Filter by gateway code
- `search`: Search term for gateway name or code

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "gateway_name": "Twilio SMS",
      "gateway_code": "twilio",
      "live_values": {
        "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
        "auth_token": "{YOUR_TWILIO_AUTH_TOKEN}",
        "from_number": "+15551234567"
      },
      "test_values": {
        "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
        "auth_token": "{YOUR_TWILIO_TEST_AUTH_TOKEN}",
        "from_number": "+15551234567"
      },
      "mode": "live",
      "is_active": true,
      "priority": 1,
      "gateway_image": "/images/gateways/twilio.png",
      "retry_attempts": 3,
      "retry_interval": 60,
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

### 2. Get SMS Configuration by ID

**URL:** `GET http://localhost:3001/api/sms-configurations/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer {YOUR_JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "gateway_name": "Twilio SMS",
    "gateway_code": "twilio",
    "live_values": {
      "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
      "auth_token": "{YOUR_TWILIO_AUTH_TOKEN}",
      "from_number": "+15551234567"
    },
    "test_values": {
      "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
      "auth_token": "{YOUR_TWILIO_TEST_AUTH_TOKEN}",
      "from_number": "+15551234567"
    },
    "mode": "live",
    "is_active": true,
    "priority": 1,
    "gateway_image": "/images/gateways/twilio.png",
    "retry_attempts": 3,
    "retry_interval": 60,
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

### 3. Create SMS Configuration

**URL:** `POST http://localhost:3001/api/sms-configurations`

**Headers:**
```
Authorization: Bearer {YOUR_JWT_TOKEN}
Content-Type: application/json
```

**Payload:**
```json
{
  "gateway_name": "Twilio SMS",
  "gateway_code": "twilio",
  "live_values": {
    "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
    "auth_token": "{YOUR_TWILIO_AUTH_TOKEN}",
    "from_number": "+15551234567"
  },
  "test_values": {
    "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
    "auth_token": "{YOUR_TWILIO_TEST_AUTH_TOKEN}",
    "from_number": "+15551234567"
  },
  "mode": "live",
  "is_active": true,
  "priority": 1,
  "gateway_image": "/images/gateways/twilio.png",
  "retry_attempts": 3,
  "retry_interval": 60,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS configuration created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "gateway_name": "Twilio SMS",
    "gateway_code": "twilio",
    "live_values": {
      "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
      "auth_token": "{YOUR_TWILIO_AUTH_TOKEN}",
      "from_number": "+15551234567"
    },
    "test_values": {
      "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
      "auth_token": "{YOUR_TWILIO_TEST_AUTH_TOKEN}",
      "from_number": "+15551234567"
    },
    "mode": "live",
    "is_active": true,
    "priority": 1,
    "gateway_image": "/images/gateways/twilio.png",
    "retry_attempts": 3,
    "retry_interval": 60,
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

### 4. Update SMS Configuration

**URL:** `PUT http://localhost:3001/api/sms-configurations/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer {YOUR_JWT_TOKEN}
Content-Type: application/json
```

**Payload:**
```json
{
  "gateway_name": "Twilio SMS Gateway",
  "live_values": {
    "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
    "auth_token": "{YOUR_UPDATED_TWILIO_AUTH_TOKEN}",
    "from_number": "+15551234567"
  },
  "is_active": true,
  "priority": 2,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS configuration updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "gateway_name": "Twilio SMS Gateway",
    "gateway_code": "twilio",
    "live_values": {
      "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
      "auth_token": "{YOUR_UPDATED_TWILIO_AUTH_TOKEN}",
      "from_number": "+15551234567"
    },
    "test_values": {
      "account_sid": "{YOUR_TWILIO_ACCOUNT_SID}",
      "auth_token": "{YOUR_TWILIO_TEST_AUTH_TOKEN}",
      "from_number": "+15551234567"
    },
    "mode": "live",
    "is_active": true,
    "priority": 2,
    "gateway_image": "/images/gateways/twilio.png",
    "retry_attempts": 3,
    "retry_interval": 60,
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

### 5. Delete SMS Configuration

**URL:** `DELETE http://localhost:3001/api/sms-configurations/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer {YOUR_JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS configuration deleted successfully"
}
```
