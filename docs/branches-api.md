# Branches API

## API URLs and Payloads

### 1. Get All Branches

**URL:** `GET http://localhost:3001/api/branches`

**Query Parameters:** `page`, `limit`, `is_active`, `branch_type`, `city`, `state`, `country`, `search`

**Example:** `GET http://localhost:3001/api/branches?page=1&limit=10&is_active=true&branch_type=regional`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Head Office",
      "code": "HO-001",
      "slug": "head-office",
      "address": "123 Main Street, Suite 500",
      "landmark": "Near Central Park",
      "city": "New York",
      "district": "Manhattan",
      "state": "New York",
      "country": "USA",
      "postal_code": "10001",
      "phone": "+1-212-555-1234",
      "alt_phone": "+1-212-555-5678",
      "email": "info@talentspark.com",
      "fax": "+1-212-555-9876",
      "manager_id": 1,
      "description": "Our main headquarters in New York City",
      "location_lat": "40.71280000",
      "location_lng": "-74.00600000",
      "google_maps_url": "https://goo.gl/maps/example1",
      "working_hours": "Mon-Fri: 9:00 AM - 6:00 PM",
      "timezone": "America/New_York",
      "logo_url": "https://example.com/logos/head-office.png",
      "website_url": "https://talentspark.com",
      "support_email": "support@talentspark.com",
      "support_phone": "+1-800-555-1234",
      "branch_type": "head_office",
      "opening_date": "2010-01-15",
      "last_renovated": "2020-06-30",
      "monthly_rent": "15000.00",
      "owned_or_rented": "owned",
      "no_of_employees": 120,
      "fire_safety_certified": true,
      "is_default": true,
      "is_active": true,
      "created_by": 1,
      "created_at": "2023-05-09T10:50:00.000Z",
      "updated_at": "2023-05-09T10:50:00.000Z",
      "deleted_at": null
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get Branch by ID

**URL:** `GET http://localhost:3001/api/branches/:id`

**Example:** `GET http://localhost:3001/api/branches/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Head Office",
    "code": "HO-001",
    "slug": "head-office",
    "address": "123 Main Street, Suite 500",
    "landmark": "Near Central Park",
    "city": "New York",
    "district": "Manhattan",
    "state": "New York",
    "country": "USA",
    "postal_code": "10001",
    "phone": "+1-212-555-1234",
    "alt_phone": "+1-212-555-5678",
    "email": "info@talentspark.com",
    "fax": "+1-212-555-9876",
    "manager_id": 1,
    "description": "Our main headquarters in New York City",
    "location_lat": "40.71280000",
    "location_lng": "-74.00600000",
    "google_maps_url": "https://goo.gl/maps/example1",
    "working_hours": "Mon-Fri: 9:00 AM - 6:00 PM",
    "timezone": "America/New_York",
    "logo_url": "https://example.com/logos/head-office.png",
    "website_url": "https://talentspark.com",
    "support_email": "support@talentspark.com",
    "support_phone": "+1-800-555-1234",
    "branch_type": "head_office",
    "opening_date": "2010-01-15",
    "last_renovated": "2020-06-30",
    "monthly_rent": "15000.00",
    "owned_or_rented": "owned",
    "no_of_employees": 120,
    "fire_safety_certified": true,
    "is_default": true,
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-09T10:50:00.000Z",
    "updated_at": "2023-05-09T10:50:00.000Z",
    "deleted_at": null
  }
}
```

### 3. Create Branch

**URL:** `POST http://localhost:3001/api/branches`

**Payload:**
```json
{
  "name": "Dallas Office",
  "code": "DO-001",
  "slug": "dallas-office",
  "city": "Dallas",
  "state": "Texas",
  "country": "USA",
  "branch_type": "regional",
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Branch created successfully",
  "data": {
    "id": 4,
    "name": "Dallas Office",
    "code": "DO-001",
    "slug": "dallas-office",
    "city": "Dallas",
    "state": "Texas",
    "country": "USA",
    "branch_type": "regional",
    "owned_or_rented": "owned",
    "no_of_employees": 0,
    "fire_safety_certified": false,
    "is_default": false,
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-09T10:51:33.000Z",
    "updated_at": "2023-05-09T10:51:33.000Z"
  }
}
```

### 4. Update Branch

**URL:** `PUT http://localhost:3001/api/branches/:id`

**Example:** `PUT http://localhost:3001/api/branches/4`

**Payload:**
```json
{
  "name": "Dallas Regional Office",
  "address": "123 Main St, Suite 100",
  "phone": "+1-214-555-1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Branch updated successfully",
  "data": {
    "id": 4,
    "name": "Dallas Regional Office",
    "code": "DO-001",
    "slug": "dallas-office",
    "address": "123 Main St, Suite 100",
    "city": "Dallas",
    "state": "Texas",
    "country": "USA",
    "phone": "+1-214-555-1234",
    "branch_type": "regional",
    "owned_or_rented": "owned",
    "no_of_employees": 0,
    "fire_safety_certified": false,
    "is_default": false,
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-09T10:51:33.000Z",
    "updated_at": "2023-05-09T10:51:33.000Z",
    "deleted_at": null
  }
}
```

### 5. Delete Branch

**URL:** `DELETE http://localhost:3001/api/branches/:id`

**Example:** `DELETE http://localhost:3001/api/branches/4`

**Response:**
```json
{
  "success": true,
  "message": "Branch deleted successfully"
}
```

## Full Payload Fields

**Branch Create/Update Payload Fields:**
```json



{
  "name": "Branch Name",
  "code": "BR-001",
  "slug": "branch-name",
  "address": "123 Street Address",
  "landmark": "Near Landmark",
  "city": "City Name",
  "district": "District Name",
  "state": "State Name",
  "country": "Country Name",
  "postal_code": "12345",
  "phone": "+1-123-456-7890",
  "alt_phone": "+1-123-456-7891",
  "email": "branch@example.com",
  "fax": "+1-123-456-7892",
  "manager_id": 1,
  "description": "Branch description text",
  "location_lat": 40.7128,
  "location_lng": -74.0060,
  "google_maps_url": "https://goo.gl/maps/example",
  "working_hours": "Mon-Fri: 9:00 AM - 5:00 PM",
  "timezone": "America/New_York",
  "logo_url": "https://example.com/logo.png",
  "website_url": "https://branch.example.com",
  "support_email": "support@example.com",
  "support_phone": "+1-800-123-4567",
  "branch_type": "regional",
  "opening_date": "2023-01-15",
  "last_renovated": "2023-06-30",
  "monthly_rent": 5000.00,
  "owned_or_rented": "rented",
  "no_of_employees": 25,
  "fire_safety_certified": true,
  "is_default": false,
  "is_active": true,
  "created_by": 1
}



