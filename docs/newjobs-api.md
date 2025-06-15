# New Job API Documentation

## Overview
The New Job API provides endpoints to manage recruitment jobs with profit optimization features. It enables creating, retrieving, updating, and deleting job listings with detailed information about requirements, responsibilities, and financial aspects.

**Base URL**: `http://localhost:3001/api/newjobs`

---

## Endpoints

### 1. Get All Jobs

#### Request
```http
GET http://localhost:3001/api/newjobs
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number for pagination (default: 1) |
| `limit` | number | No | Number of records per page (default: 10) |
| `status` | string | No | Filter by job status (e.g., Draft, Published) |
| `department_id` | number | No | Filter by department ID |
| `priority` | string | No | Filter by priority level (e.g., High, Medium, Low) |
| `assigned_to_employee_id` | number | No | Filter by assigned employee ID |
| `is_remote` | boolean | No | Filter by remote work eligibility (true/false) |
| `employment_type` | string | No | Filter by employment type |
| `search` | string | No | Search jobs by title or description |

#### Success Response
```json
{
  "success": true,
  "data": [
    {
      "job_id": 1,
      "job_title": "Senior Software Engineer",
      "job_description": "Looking for an experienced software engineer...",
      "department_id": 5,
      "status": "Published",
      "priority": "High",
      "assigned_to_employee_id": 42,
      "min_salary": 80000.00,
      "max_salary": 120000.00,
      "employment_type": "Full-time",
      "application_deadline": "2025-08-15",
      "is_remote": true,
      "client_budget_hourly": 65.00,
      "internal_budget_hourly": 45.00,
      "candidate_split_percentage": 70,
      "company_split_percentage": 30,
      "requirements": "5+ years experience with Java...",
      "responsibilities": "Lead development of backend systems...",
      "benefits": "Healthcare, 401k, flexible work hours...",
      "created_at": "2025-06-01T08:00:00Z",
      "updated_at": "2025-06-01T08:00:00Z",
      "Department": {
        "department_id": 5,
        "name": "Engineering"
      },
      "AssignedEmployee": {
        "employee_id": 42,
        "first_name": "Jane",
        "last_name": "Smith"
      }
    }
    // More job records...
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

### 2. Get Job by ID

#### Request
```http
GET http://localhost:3001/api/newjobs/:id
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Job ID |

#### Success Response
```json
{
  "success": true,
  "data": {
    "job_id": 1,
    "job_title": "Senior Software Engineer",
    "job_description": "Looking for an experienced software engineer...",
    "department_id": 5,
    "status": "Published",
    "priority": "High",
    "assigned_to_employee_id": 42,
    "min_salary": 80000.00,
    "max_salary": 120000.00,
    "employment_type": "Full-time",
    "application_deadline": "2025-08-15",
    "is_remote": true,
    "client_budget_hourly": 65.00,
    "internal_budget_hourly": 45.00,
    "candidate_split_percentage": 70,
    "company_split_percentage": 30,
    "requirements": "5+ years experience with Java...",
    "responsibilities": "Lead development of backend systems...",
    "benefits": "Healthcare, 401k, flexible work hours...",
    "created_at": "2025-06-01T08:00:00Z",
    "updated_at": "2025-06-01T08:00:00Z",
    "Department": {
      "department_id": 5,
      "name": "Engineering"
    },
    "AssignedEmployee": {
      "employee_id": 42,
      "first_name": "Jane",
      "last_name": "Smith"
    }
  }
}
```

### 3. Create New Job

#### Request

```http
POST http://localhost:3001/api/newjobs
Content-Type: application/json
```

#### Request Body
```json
{
  "job_title": "Senior Software Engineer",
  "job_description": "Looking for an experienced software engineer...",
  "department_id": 5,
  "status": "Draft",
  "priority": "High",
  "assigned_to_employee_id": 42,
  "min_salary": 80000.00,
  "max_salary": 120000.00,
  "employment_type": "Full-time",
  "application_deadline": "2025-08-15",
  "is_remote": true,
  "client_budget_hourly": 65.00,
  "internal_budget_hourly": 45.00,
  "candidate_split_percentage": 70,
  "company_split_percentage": 30,
  "requirements": "5+ years experience with Java...",
  "responsibilities": "Lead development of backend systems...",
  "benefits": "Healthcare, 401k, flexible work hours..."
}
```

#### Required Fields
- `job_title` (string): Title of the job position
- `job_description` (string): Detailed description of the job
- `department_id` (number): ID of the department this job belongs to
- `employment_type` (string): Type of employment (e.g., Full-time, Part-time)

#### Success Response
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job_id": 1,
    "job_title": "Senior Software Engineer",
    "job_description": "Looking for an experienced software engineer...",
    "department_id": 5,
    "status": "Draft",
    "priority": "High",
    "assigned_to_employee_id": 42,
    "min_salary": 80000.00,
    "max_salary": 120000.00,
    "employment_type": "Full-time",
    "application_deadline": "2025-08-15",
    "is_remote": true,
    "client_budget_hourly": 65.00,
    "internal_budget_hourly": 45.00,
    "candidate_split_percentage": 70,
    "company_split_percentage": 30,
    "requirements": "5+ years experience with Java...",
    "responsibilities": "Lead development of backend systems...",
    "benefits": "Healthcare, 401k, flexible work hours...",
    "created_at": "2025-06-01T08:00:00Z",
    "updated_at": "2025-06-01T08:00:00Z",
    "Department": {
      "department_id": 5,
      "name": "Engineering"
    },
    "AssignedEmployee": {
      "employee_id": 42,
      "first_name": "Jane",
      "last_name": "Smith"
    }
  }
}
```

### 4. Update Job

#### Request
```http
PUT http://localhost:3001/api/newjobs/:id
Content-Type: application/json
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Job ID |

#### Request Body
```json
{
  "job_title": "Senior Software Engineer",
  "job_description": "Looking for an experienced software engineer...",
  "department_id": 2,
  "status": "Draft",
  "priority": "High",
  "assigned_to_employee_id": 1,
  "min_salary": 80000.00,
  "max_salary": 120000.00,
  "employment_type": "Full-time",
  "application_deadline": "2025-08-15",
  "is_remote": true,
  "client_budget_hourly": 65.00,
  "internal_budget_hourly": 45.00,
  "candidate_split_percentage": 70,
  "company_split_percentage": 30,
  "requirements": "Seeking a skilled Python Full Stack Developer to design and develop scalable web applications. Proficiency in Python (Django/Flask), front-end technologies (React/Angular), and database management is essential. Collaborate with cross-functional teams to deliver robust solutions.",
  "responsibilities": "Lead development of backend systems...",
  "benefits": "Healthcare, 401k, flexible work hours..."
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "job_id": 1,
    "job_title": "Senior Software Engineer",
    "job_description": "Looking for an experienced software engineer...",
    "department_id": 5,
    "status": "Published",
    "priority": "Medium",
    "assigned_to_employee_id": 43,
    "min_salary": 85000.00,
    "max_salary": 125000.00,
    "employment_type": "Full-time",
    "application_deadline": "2025-08-15",
    "is_remote": true,
    "client_budget_hourly": 65.00,
    "internal_budget_hourly": 45.00,
    "candidate_split_percentage": 70,
    "company_split_percentage": 30,
    "requirements": "Updated requirements: 6+ years experience with Java...",
    "responsibilities": "Lead development of backend systems...",
    "benefits": "Healthcare, 401k, flexible work hours...",
    "created_at": "2025-06-01T08:00:00Z",
    "updated_at": "2025-06-01T08:30:00Z",
    "Department": {
      "department_id": 5,
      "name": "Engineering"
    },
    "AssignedEmployee": {
      "employee_id": 43,
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### 5. Delete Job

#### Request
```http
DELETE http://localhost:3001/api/newjobs/:id
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Job ID |

#### Success Response
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

## Error Responses

### Not Found Error
```json
{
  "success": false,
  "message": "Job not found"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Job title, description, department ID, and employment type are required"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Failed to fetch jobs",
  "error": "Error message details"
}
```

## Profit Optimization Fields

The New Job API includes special fields for profit optimization in recruiting:

| Field | Type | Description |
|-------|------|-------------|
| `client_budget_hourly` | decimal | Client's hourly budget for the position |
| `internal_budget_hourly` | decimal | Internal hourly budget for the position |
| `candidate_split_percentage` | integer | Percentage of profit allocated to the candidate |
| `company_split_percentage` | integer | Percentage of profit allocated to the company |

These fields help recruitment agencies manage their profit margins and optimize candidate placements.
