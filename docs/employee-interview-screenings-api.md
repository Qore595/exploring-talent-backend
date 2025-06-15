# Employee Interview Screenings API 🎯

## Overview

The Employee Interview Screenings API is a comprehensive solution for managing interview screening sessions within the TalentSpark recruitment platform. This API enables organizations to create, track, and manage virtual interview screening sessions with candidates, providing essential functionality for modern recruitment workflows.

### Key Features

- 🔗 **Session Management**: Create and manage interview screening sessions with unique identifiers
- 👥 **User Tracking**: Associate screenings with specific user IDs for participant management
- 🌐 **Join URL Management**: Handle secure join URLs for virtual interview sessions
- 📊 **Advanced Filtering**: Search and filter screenings with multiple criteria
- 📈 **Pagination Support**: Efficient data retrieval with customizable pagination
- 🔍 **Multi-Database Support**: Compatible with both MongoDB and SQL databases

## Base URL

All API endpoints are relative to: `http://localhost:3000/api/employee-interview-screenings`

## Authentication

All endpoints require authentication. Include the authentication token in the request header:

```
Authorization: Bearer {your_token}
```

## Data Model

### Employee Interview Screening Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer/String | Auto-generated | Unique identifier for the screening record |
| `callid` | String (100) | Optional | Unique call identifier for the screening session |
| `userid` | String (100) | Optional | User identifier for the screening participant |
| `joinurl` | Text | Optional | URL for joining the screening session |
| `job_id` | Integer | Optional | Reference to the job this screening is associated with |
| `status` | Enum | Default: 'pending' | Status of the interview (pending, in_progress, completed, cancelled, no_show) |
| `created` | DateTime | Auto-generated | Timestamp when the record was created |
| `updated` | DateTime | Auto-generated | Timestamp when the record was last updated |

### Database Indexes

For optimal performance, the following indexes are automatically created:
- Index on `callid` for fast call-based lookups
- Index on `userid` for user-specific queries
- Index on `created` for chronological sorting

---

## API Endpoints

### 1. Get All Screenings 📋

Retrieve a paginated list of all interview screenings with advanced filtering capabilities.

**Endpoint:** `GET /api/employee-interview-screenings`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 1 | Page number for pagination |
| `limit` | Integer | 10 | Number of records per page (max: 100) |
| `callid` | String | - | Filter by specific call ID |
| `userid` | String | - | Filter by specific user ID |
| `job_id` | Integer | - | Filter by specific job ID |
| `status` | String | - | Filter by screening status (pending, in_progress, completed, cancelled, no_show) |
| `search` | String | - | Search across callid, userid, and status fields |

**Example Request:**
```bash
GET /api/employee-interview-screenings?page=1&limit=20&search=john&callid=call_123
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "callid": "call_123_john_doe",
      "userid": "user_456",
      "joinurl": "https://meet.talentspark.com/screening/call_123_john_doe",
      "created": "2025-06-02T10:30:00.000Z",
      "updated": "2025-06-02T10:30:00.000Z"
    },
    {
      "id": 2,
      "callid": "call_124_jane_smith",
      "userid": "user_789",
      "joinurl": "https://meet.talentspark.com/screening/call_124_jane_smith",
      "created": "2025-06-02T11:00:00.000Z",
      "updated": "2025-06-02T11:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "pages": 2
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to fetch screenings",
  "error": "Database connection error"
}
```

---

### 2. Get Screening by ID 🎯

Retrieve a specific interview screening by its unique identifier.

**Endpoint:** `GET /api/employee-interview-screenings/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Integer/String | Yes | Unique identifier of the screening |

**Example Request:**
```bash
GET /api/employee-interview-screenings/1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "callid": "call_123_john_doe",
    "userid": "user_456",
    "joinurl": "https://meet.talentspark.com/screening/call_123_john_doe",
    "created": "2025-06-02T10:30:00.000Z",
    "updated": "2025-06-02T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Screening not found"
}
```

---

### 3. Create New Screening ✨

Create a new interview screening session or update an existing one if the userid already exists.

**Endpoint:** `POST /api/employee-interview-screenings`

**Behavior:**
- If both `userid` and `job_id` are provided and match an existing record: **Updates the existing record**
- If only `userid` is provided and matches an existing record: **Updates the existing record**
- If `userid` is provided but no match is found: **Creates a new record**
- If `userid` is not provided: **Always creates a new record**

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `callid` | String | Optional* | Unique call identifier |
| `userid` | String | Optional* | User identifier (triggers upsert behavior) |
| `joinurl` | String | Optional* | Join URL for the session |
| `job_id` | Integer | Optional | Reference to the job this screening is associated with |
| `status` | String | Optional | Status of the interview (pending, in_progress, completed, cancelled, no_show) |

*At least one field is required.

**Example Request (New Record):**
```bash
POST /api/employee-interview-screenings
Content-Type: application/json

{
  "callid": "call_125_alex_johnson",
  "userid": "user_890",
  "joinurl": "https://meet.talentspark.com/screening/call_125_alex_johnson",
  "job_id": 42,
  "status": "pending"
}
```

**Example Request (Update Existing):**
```bash
POST /api/employee-interview-screenings
Content-Type: application/json

{
  "callid": "call_125_alex_johnson_updated",
  "userid": "user_890",
  "joinurl": "https://meet.talentspark.com/screening/call_125_alex_johnson_updated",
  "job_id": 42, 
  "status": "in_progress"
}
```

**Success Response - New Record (201):**
```json
{
  "success": true,
  "message": "Screening created successfully",  "data": {
    "id": 3,
    "callid": "call_125_alex_johnson",
    "userid": "user_890",
    "joinurl": "https://meet.talentspark.com/screening/call_125_alex_johnson",
    "job_id": 42,
    "status": "pending",
    "created": "2025-06-02T12:00:00.000Z",
    "updated": "2025-06-02T12:00:00.000Z"
  },
  "action": "created"
}
```

**Success Response - Updated Record (200):**
```json
{
  "success": true,
  "message": "Screening updated successfully",  "data": {
    "id": 3,
    "callid": "call_125_alex_johnson_updated",
    "userid": "user_890",
    "joinurl": "https://meet.talentspark.com/screening/call_125_alex_johnson_updated",
    "job_id": 42,
    "status": "in_progress",
    "created": "2025-06-02T12:00:00.000Z",
    "updated": "2025-06-02T12:30:00.000Z"
  },
  "action": "updated"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "At least one field (callid, userid, or joinurl) is required"
}
```

---

### 4. Update Screening 🔄

Update an existing interview screening.

**Endpoint:** `PUT /api/employee-interview-screenings/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Integer/String | Yes | Unique identifier of the screening |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `callid` | String | Optional | Updated call identifier |
| `userid` | String | Optional | Updated user identifier |
| `joinurl` | String | Optional | Updated join URL |
| `job_id` | Integer | Optional | Updated job reference |
| `status` | String | Optional | Updated interview status |

**Example Request:**
```bash
PUT /api/employee-interview-screenings/3
Content-Type: application/json

{  "callid": "call_125_alex_johnson_updated",
  "joinurl": "https://meet.talentspark.com/screening/call_125_alex_johnson_updated",
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Screening updated successfully",
  "data": {
    "id": 3,
    "callid": "call_125_alex_johnson_updated",
    "userid": "user_890",
    "joinurl": "https://meet.talentspark.com/screening/call_125_alex_johnson_updated",
    "created": "2025-06-02T12:00:00.000Z",
    "updated": "2025-06-02T12:15:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Screening not found"
}
```

---

### 5. Delete Screening 🗑️

Delete an interview screening permanently.

**Endpoint:** `DELETE /api/employee-interview-screenings/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Integer/String | Yes | Unique identifier of the screening |

**Example Request:**
```bash
DELETE /api/employee-interview-screenings/3
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Screening deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Screening not found"
}
```

---

### 6. Get Screenings by Call ID 📞

Retrieve all screenings associated with a specific call ID.

**Endpoint:** `GET /api/employee-interview-screenings/call/:callid`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `callid` | String | Yes | Call identifier to search for |

**Example Request:**
```bash
GET /api/employee-interview-screenings/call/call_123_john_doe
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "callid": "call_123_john_doe",
      "userid": "user_456",
      "joinurl": "https://meet.talentspark.com/screening/call_123_john_doe",
      "created": "2025-06-02T10:30:00.000Z",
      "updated": "2025-06-02T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**No Results Response (200):**
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

---

### 7. Get Screenings by User ID 👤

Retrieve all screenings associated with a specific user ID.

**Endpoint:** `GET /api/employee-interview-screenings/user/:userid`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userid` | String | Yes | User identifier to search for |

**Example Request:**
```bash
GET /api/employee-interview-screenings/user/user_456
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "callid": "call_123_john_doe",
      "userid": "user_456",
      "joinurl": "https://meet.talentspark.com/screening/call_123_john_doe",
      "created": "2025-06-02T10:30:00.000Z",
      "updated": "2025-06-02T10:30:00.000Z"
    },
    {
      "id": 4,
      "callid": "call_126_john_doe_followup",
      "userid": "user_456",
      "joinurl": "https://meet.talentspark.com/screening/call_126_john_doe_followup",
      "created": "2025-06-02T14:00:00.000Z",
      "updated": "2025-06-02T14:00:00.000Z"
    }
  ],
  "count": 2
}
```

---

### 8. Get Screenings with Employee Details 👥

Retrieve all interview screenings with detailed employee information.

**Endpoint:** `GET /api/employee-interview-screenings/with-employee/all`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 1 | Page number for pagination |
| `limit` | Integer | 10 | Number of records per page (max: 100) |
| `callid` | String | - | Filter by specific call ID |
| `userid` | String | - | Filter by specific user ID |
| `job_id` | Integer | - | Filter by specific job ID |
| `status` | String | - | Filter by screening status |
| `search` | String | - | Search across all fields |

**Example Request:**
```bash
GET /api/employee-interview-screenings/with-employee/all?page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "callid": "call_123_john_doe",
      "userid": "EMP003",
      "joinurl": "https://meet.talentspark.com/screening/call_123",
      "job_id": 42,
      "status": "pending",
      "created": "2025-06-02T10:30:00.000Z",
      "updated": "2025-06-02T10:30:00.000Z",      "employee": {
        "id": 3,
        "employee_id": "EMP003",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@talentspark.com",
        "phone": "+1-123-456-7892",
        "gender": "female",
        "branch_id": 1,
        "department_id": 2,
        "designation_id": 7,
        "position": "Staff",
        "hire_date": "2022-03-15T00:00:00.000Z",
        "employment_status": "full-time",
        "work_experience": "5 years in HR",
        "bank_account_name": "Jane Smith",
        "bank_account_no": "9876543210",
        "bank_name": "First National Bank",
        "Branch": {
          "id": 1,
          "name": "Head Office",
          "code": "HO",
          "address": "123 Main Street",
          "city": "New York",
          "state": "NY",
          "country": "USA"
        },
        "Department": {
          "id": 2,
          "name": "Human Resources",
          "short_code": "HR",
          "description": "Human Resources Department"
        },
        "Designation": {
          "id": 7,
          "name": "HR Associate",
          "short_code": "HRA",
          "description": "Human Resources Associate"
        },
        "is_active": true,
        "// All employee fields are now returned": "..."
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### 9. Get Screening with Employee Details by ID 👤🔍

Retrieve a specific screening with detailed employee information.

**Endpoint:** `GET /api/employee-interview-screenings/with-employee/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Integer/String | Yes | Unique identifier of the screening |

**Example Request:**
```bash
GET /api/employee-interview-screenings/with-employee/1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "callid": "call_123_john_doe",
    "userid": "EMP003",
    "joinurl": "https://meet.talentspark.com/screening/call_123",
    "job_id": 42,
    "status": "pending",
    "created": "2025-06-02T10:30:00.000Z",
    "updated": "2025-06-02T10:30:00.000Z",      "employee": {
      "id": 3,
      "employee_id": "EMP003",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@talentspark.com",
      "phone": "+1-123-456-7892",
      "gender": "female",
      "branch_id": 1,
      "department_id": 2,
      "designation_id": 7,
      "position": "Staff",
      "hire_date": "2022-03-15T00:00:00.000Z",
      "employment_status": "full-time",
      "work_experience": "5 years in HR",
      "qualification": "MBA in Human Resources",
      "emergency_contact": "+1-555-123-4567",
      "bank_account_name": "Jane Smith",
      "bank_account_no": "9876543210",
      "bank_name": "First National Bank",
      "Branch": {
        "id": 1,
        "name": "Head Office",
        "code": "HO",
        "address": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "country": "USA"
      },
      "Department": {
        "id": 2,
        "name": "Human Resources",
        "short_code": "HR",
        "description": "Human Resources Department"
      },
      "Designation": {
        "id": 7,
        "name": "HR Associate",
        "short_code": "HRA",
        "description": "Human Resources Associate"
      },
      "is_active": true,
      "// All employee fields are now returned": "..."
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Screening not found"
}
```

---

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages:

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid request data |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error - Server error |

### Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Detailed technical error information"
}
```

---

## Usage Examples

### JavaScript/Node.js

```javascript
// Get all screenings with pagination
const response = await fetch('/api/employee-interview-screenings?page=1&limit=20', {
  headers: {
    'Authorization': 'Bearer your_token_here'
  }
});
const data = await response.json();

// Create a new screening (or update if userid exists)
const newScreening = await fetch('/api/employee-interview-screenings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here'
  },
  body: JSON.stringify({
    callid: 'call_interview_2025',
    userid: 'candidate_123',
    joinurl: 'https://meet.talentspark.com/screening/call_interview_2025',
    job_id: 123,
    status: 'pending'
  })
});

const result = await newScreening.json();
console.log(`Screening ${result.action}: ${result.data.id}`); // Shows "created" or "updated"
```

### cURL

```bash
# Get all screenings
curl -X GET "http://localhost:3000/api/employee-interview-screenings?page=1&limit=10" \
  -H "Authorization: Bearer your_token_here"

# Create new screening (or update if userid exists)
curl -X POST "http://localhost:3000/api/employee-interview-screenings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \  -d '{
    "callid": "call_interview_2025",
    "userid": "candidate_123",
    "joinurl": "https://meet.talentspark.com/screening/call_interview_2025",
    "job_id": 123,
    "status": "pending"
  }'

# Update screening
curl -X PUT "http://localhost:3000/api/employee-interview-screenings/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "joinurl": "https://meet.talentspark.com/screening/updated_link"
  }'
```

### Python

```python
import requests

# Configuration
base_url = "http://localhost:3000/api/employee-interview-screenings"
headers = {
    "Authorization": "Bearer your_token_here",
    "Content-Type": "application/json"
}

# Get all screenings
response = requests.get(f"{base_url}?page=1&limit=20", headers=headers)
screenings = response.json()

# Create new screening (or update if userid exists)
new_screening_data = {
    "callid": "call_python_test",
    "userid": "user_python",
    "joinurl": "https://meet.talentspark.com/screening/python_test",
    "job_id": 456,
    "status": "pending"
}
response = requests.post(base_url, json=new_screening_data, headers=headers)
created_screening = response.json()
print(f"Screening {created_screening['action']}: {created_screening['data']['id']}")
```

---

## Performance Considerations

### Pagination Best Practices

- **Default Limit**: Use the default limit of 10 records for general queries
- **Maximum Limit**: The system accepts up to 100 records per page
- **Large Datasets**: For large datasets, consider using smaller page sizes and implementing client-side caching

### Query Optimization

- **Indexed Fields**: Queries on `callid`, `userid`, and `created` fields are automatically optimized
- **Search Performance**: The search functionality uses optimized patterns for both MongoDB and SQL databases
- **Filtering**: Use specific filters (`callid`, `userid`) instead of general search when possible

### Caching Recommendations

- **GET Requests**: Consider caching GET requests for frequently accessed data
- **Cache Duration**: Recommended cache duration: 5-15 minutes for list endpoints
- **Cache Invalidation**: Invalidate cache after POST, PUT, or DELETE operations

---

## Security Considerations

### Data Protection

- All endpoints require proper authentication
- Sensitive data is not exposed in error messages
- Input validation is performed on all user inputs

### Best Practices

- Always use HTTPS in production environments
- Implement rate limiting for API calls
- Validate and sanitize all input data
- Use parameterized queries to prevent SQL injection

---

## Integration Guide

### Setting Up the API

1. **Install Dependencies**: Ensure all required packages are installed
2. **Database Setup**: Run the migration to create the necessary tables/collections
3. **Environment Configuration**: Set up your database connection and authentication
4. **Testing**: Use the provided examples to test the API endpoints

### Common Integration Patterns

#### Workflow Integration
```javascript
// Example: Complete screening workflow with upsert functionality
async function createAndManageScreening(candidateData) {
  // 1. Create screening session (or update if userid exists)
  const screening = await createScreening({
    callid: `call_${candidateData.id}_${Date.now()}`,
    userid: candidateData.userId,
    joinurl: generateJoinUrl(candidateData)
  });
  
  // 2. Check if it was created or updated
  if (screening.action === 'updated') {
    console.log('Updated existing screening for user:', candidateData.userId);
  } else {
    console.log('Created new screening for user:', candidateData.userId);
  }
  
  // 3. Send invitation to candidate
  await sendInvitation(candidateData.email, screening.data.joinurl);
  
  // 4. Track screening completion
  return screening.data.id;
}
```

#### Upsert Pattern
```javascript
// Example: Smart screening management with upsert
async function manageScreeningByUser(userid, screeningData) {
  try {
    // This will automatically create or update based on userid
    const response = await fetch('/api/employee-interview-screenings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token_here'
      },
      body: JSON.stringify({
        userid: userid,
        ...screeningData
      })
    });
    
    const result = await response.json();
    
    if (result.action === 'updated') {
      console.log(`Updated existing screening for user ${userid}`);
    } else {
      console.log(`Created new screening for user ${userid}`);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error managing screening:', error);
    throw error;
  }
}
```

#### Batch Operations
```javascript
// Example: Bulk screening creation
async function createBulkScreenings(candidates) {
  const results = await Promise.all(
    candidates.map(candidate => 
      createScreening({
        callid: `bulk_${candidate.id}`,
        userid: candidate.userId,
        joinurl: generateBulkJoinUrl(candidate)
      })
    )
  );
  return results;
}
```

---

## Changelog

### Version 1.0.0 (2025-06-02)
- Initial release of Employee Interview Screenings API
- Support for MongoDB and SQL databases
- Complete CRUD operations
- Advanced filtering and search capabilities
- Comprehensive documentation and examples

---

## Support

For technical support or questions about this API:

- **Documentation**: Review this comprehensive guide
- **Examples**: Use the provided code examples
- **Testing**: Test endpoints using the cURL commands or provided scripts

---

## License

This API is part of the TalentSpark recruitment platform. All rights reserved.

---

*This documentation was last updated on June 2, 2025. For the most current information, please refer to the latest version of this document.*
