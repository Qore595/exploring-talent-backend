# Payment Configurations API

This API allows you to manage payment gateway configurations for the system.

## API URLs and Payloads

### 1. Get All Payment Configurations

**URL:** `GET http://localhost:3001/api/payment-configurations?page=1&limit=10&is_active=true&mode=test&supports_recurring=true&search=stripe`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 10)
- `is_active`: Filter by active status (true/false)
- `mode`: Filter by mode (live/test)
- `gateway_code`: Filter by gateway code
- `supports_recurring`: Filter by recurring payment support (true/false)
- `supports_refunds`: Filter by refund support (true/false)
- `search`: Search term for gateway name or code

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "gateway_name": "Stripe",
      "gateway_code": "stripe",
      "live_values": {
        "api_key": "sk_live_1234567890abcdef1234567890abcdef",
        "public_key": "pk_live_1234567890abcdef1234567890abcdef",
        "webhook_secret": "whsec_1234567890abcdef1234567890abcdef"
      },
      "test_values": {
        "api_key": "sk_test_1234567890abcdef1234567890abcdef",
        "public_key": "pk_test_1234567890abcdef1234567890abcdef",
        "webhook_secret": "whsec_test_1234567890abcdef1234567890abcdef"
      },
      "mode": "test",
      "is_active": true,
      "priority": 1,
      "gateway_image": "/images/gateways/stripe.png",
      "supports_recurring": true,
      "supports_refunds": true,
      "webhook_url": "https://example.com/api/webhooks/stripe",
      "webhook_secret": "whsec_1234567890abcdef1234567890abcdef",
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

### 2. Get Payment Configuration by ID

**URL:** `GET http://localhost:3001/api/payment-configurations/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "gateway_name": "Stripe",
    "gateway_code": "stripe",
    "live_values": {
      "api_key": "sk_live_1234567890abcdef1234567890abcdef",
      "public_key": "pk_live_1234567890abcdef1234567890abcdef",
      "webhook_secret": "whsec_1234567890abcdef1234567890abcdef"
    },
    "test_values": {
      "api_key": "sk_test_1234567890abcdef1234567890abcdef",
      "public_key": "pk_test_1234567890abcdef1234567890abcdef",
      "webhook_secret": "whsec_test_1234567890abcdef1234567890abcdef"
    },
    "mode": "test",
    "is_active": true,
    "priority": 1,
    "gateway_image": "/images/gateways/stripe.png",
    "supports_recurring": true,
    "supports_refunds": true,
    "webhook_url": "https://example.com/api/webhooks/stripe",
    "webhook_secret": "whsec_1234567890abcdef1234567890abcdef",
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

### 3. Create Payment Configuration

**URL:** `POST http://localhost:3001/api/payment-configurations`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Payload:**
```json
{
  "gateway_name": "Stripe",
  "gateway_code": "stripe",
  "live_values": {
    "api_key": "sk_live_1234567890abcdef1234567890abcdef",
    "public_key": "pk_live_1234567890abcdef1234567890abcdef",
    "webhook_secret": "whsec_1234567890abcdef1234567890abcdef"
  },
  "test_values": {
    "api_key": "sk_test_1234567890abcdef1234567890abcdef",
    "public_key": "pk_test_1234567890abcdef1234567890abcdef",
    "webhook_secret": "whsec_test_1234567890abcdef1234567890abcdef"
  },
  "mode": "test",
  "is_active": true,
  "priority": 1,
  "gateway_image": "/images/gateways/stripe.png",
  "supports_recurring": true,
  "supports_refunds": true,
  "webhook_url": "https://example.com/api/webhooks/stripe",
  "webhook_secret": "whsec_1234567890abcdef1234567890abcdef",
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment configuration created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "gateway_name": "Stripe",
    "gateway_code": "stripe",
    "live_values": {
      "api_key": "sk_live_1234567890abcdef1234567890abcdef",
      "public_key": "pk_live_1234567890abcdef1234567890abcdef",
      "webhook_secret": "whsec_1234567890abcdef1234567890abcdef"
    },
    "test_values": {
      "api_key": "sk_test_1234567890abcdef1234567890abcdef",
      "public_key": "pk_test_1234567890abcdef1234567890abcdef",
      "webhook_secret": "whsec_test_1234567890abcdef1234567890abcdef"
    },
    "mode": "test",
    "is_active": true,
    "priority": 1,
    "gateway_image": "/images/gateways/stripe.png",
    "supports_recurring": true,
    "supports_refunds": true,
    "webhook_url": "https://example.com/api/webhooks/stripe",
    "webhook_secret": "whsec_1234567890abcdef1234567890abcdef",
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

### 4. Update Payment Configuration

**URL:** `PUT http://localhost:3001/api/payment-configurations/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Payload:**
```json
{
  "gateway_name": "Stripe Payment Gateway",
  "live_values": {
    "api_key": "sk_live_updated1234567890abcdef1234567890abcdef",
    "public_key": "pk_live_1234567890abcdef1234567890abcdef",
    "webhook_secret": "whsec_1234567890abcdef1234567890abcdef"
  },
  "mode": "live",
  "is_active": true,
  "priority": 2,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment configuration updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "gateway_name": "Stripe Payment Gateway",
    "gateway_code": "stripe",
    "live_values": {
      "api_key": "sk_live_updated1234567890abcdef1234567890abcdef",
      "public_key": "pk_live_1234567890abcdef1234567890abcdef",
      "webhook_secret": "whsec_1234567890abcdef1234567890abcdef"
    },
    "test_values": {
      "api_key": "sk_test_1234567890abcdef1234567890abcdef",
      "public_key": "pk_test_1234567890abcdef1234567890abcdef",
      "webhook_secret": "whsec_test_1234567890abcdef1234567890abcdef"
    },
    "mode": "live",
    "is_active": true,
    "priority": 2,
    "gateway_image": "/images/gateways/stripe.png",
    "supports_recurring": true,
    "supports_refunds": true,
    "webhook_url": "https://example.com/api/webhooks/stripe",
    "webhook_secret": "whsec_1234567890abcdef1234567890abcdef",
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

### 5. Delete Payment Configuration

**URL:** `DELETE http://localhost:3001/api/payment-configurations/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "Payment configuration deleted successfully"
}
```
