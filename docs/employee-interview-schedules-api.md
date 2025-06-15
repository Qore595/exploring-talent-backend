# Employee Interview Schedules API

This API allows you to manage interview schedules for employees.

## Base URL

```
/api/employee-interview-schedules
```

## Authentication

All endpoints require authentication. Use a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Endpoints

### Get All Employee Interview Schedules

Retrieves a paginated list of employee interview schedules with optional filtering.

**URL**: `GET /api/employee-interview-schedules`

**Access**: Staff or Admin

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Number | Page number (default: 1) |
| limit | Number | Items per page (default: 10) |
| employee_id | Number | Filter by employee ID |
| job_id | Number | Filter by job ID |
| status | String | Filter by status (scheduled, confirmed, rescheduled, completed, canceled, no_show) |
| decision | String | Filter by decision (pending, positive, negative, action_required, follow_up_needed, no_decision) |
| interview_type | String | Filter by interview type |
| scheduled_date_from | Date | Filter by scheduled date (from) |
| scheduled_date_to | Date | Filter by scheduled date (to) |
| is_active | Boolean | Filter by active status |
| round | Number | Filter by interview round |
| search | String | Search in title |

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_id": 5,
      "job_id": 3,
      "title": "Performance Review Q2",
      "round": 1,
      "interview_type": "performance_review",
      "scheduled_date": "2023-06-15",
      "start_time": "10:00:00",
      "end_time": "11:00:00",
      "duration_minutes": 60,
      "timezone": "UTC",
      "is_virtual": true,
      "meeting_link": "https://zoom.us/j/123456789",
      "status": "scheduled",
      "employee_confirmed": false,
      "is_active": true,
      "decision": "pending",
      "created_at": "2023-06-01T12:00:00Z",
      "updated_at": "2023-06-01T12:00:00Z",
      "employee": {
        "id": 5,
        "first_name": "John",
        "last_name": "Doe",
        "employee_id": "EMP-001"
      },
      "job": {
        "id": 3,
        "job_title": "Senior Developer"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "total_pages": 3
  }
}
```

### Get Employee Interview Schedule by ID

Retrieves a specific employee interview schedule by its ID.

**URL**: `GET /api/employee-interview-schedules/:id`

**Access**: Staff or Admin

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Interview schedule ID |

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": 5,
    "job_id": 3,
    "title": "Performance Review Q2",
    "round": 1,
    "interview_type": "performance_review",
    "scheduled_date": "2023-06-15",
    "start_time": "10:00:00",
    "end_time": "11:00:00",
    "duration_minutes": 60,
    "timezone": "UTC",
    "is_virtual": true,
    "location": null,
    "meeting_link": "https://zoom.us/j/123456789",
    "meeting_id": "123456789",
    "meeting_password": "123456",
    "meeting_provider": "Zoom",
    "status": "scheduled",
    "employee_confirmed": false,
    "confirmation_date": null,
    "is_active": true,
    "preparation_instructions": "Please prepare your quarterly achievements.",
    "interviewer_instructions": "Focus on performance metrics and growth areas.",
    "assessment_criteria": "Project delivery, code quality, teamwork.",
    "notes": "This is the first performance review for this employee.",
    "decision": "pending",
    "decision_reason": null,
    "next_steps": null,
    "reminder_sent": false,
    "reminder_sent_at": null,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-01T12:00:00Z",
    "employee": {
      "id": 5,
      "first_name": "John",
      "last_name": "Doe",
      "employee_id": "EMP-001"
    },
    "job": {
      "id": 3,
      "job_title": "Senior Developer"
    }
  }
}
```

### Get Interview Schedules by Employee ID

Retrieves all interview schedules for a specific employee.

**URL**: `GET /api/employee-interview-schedules/employee/:employeeId`

**Access**: Staff or Admin

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| employeeId | Number | Employee ID |

**Query Parameters**: Same as "Get All Employee Interview Schedules"

**Response**: Same format as "Get All Employee Interview Schedules"

### Create Employee Interview Schedule

Creates a new interview schedule for an employee.

**URL**: `POST /api/employee-interview-schedules`

**Access**: Admin only

**Request Body**:

```json
{
  "employee_id": 5,
  "job_id": 3,
  "title": "Performance Review Q2",
  "round": 1,
  "interview_type": "performance_review",
  "scheduled_date": "2023-06-15",
  "start_time": "10:00:00",
  "end_time": "11:00:00",
  "timezone": "UTC",
  "is_virtual": true,
  "location": null,
  "meeting_link": "https://zoom.us/j/123456789",
  "meeting_id": "123456789",
  "meeting_password": "123456",
  "meeting_provider": "Zoom",
  "status": "scheduled",
  "employee_confirmed": false,
  "is_active": true,
  "preparation_instructions": "Please prepare your quarterly achievements.",
  "interviewer_instructions": "Focus on performance metrics and growth areas.",
  "assessment_criteria": "Project delivery, code quality, teamwork.",
  "notes": "This is the first performance review for this employee.",
  "created_by": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "Employee interview schedule created successfully",
  "data": {
    "id": 1,
    "employee_id": 5,
    "job_id": 3,
    "title": "Performance Review Q2",
    "round": 1,
    "interview_type": "performance_review",
    "scheduled_date": "2023-06-15",
    "start_time": "10:00:00",
    "end_time": "11:00:00",
    "timezone": "UTC",
    "is_virtual": true,
    "location": null,
    "meeting_link": "https://zoom.us/j/123456789",
    "meeting_id": "123456789",
    "meeting_password": "123456",
    "meeting_provider": "Zoom",
    "status": "scheduled",
    "employee_confirmed": false,
    "is_active": true,
    "preparation_instructions": "Please prepare your quarterly achievements.",
    "interviewer_instructions": "Focus on performance metrics and growth areas.",
    "assessment_criteria": "Project delivery, code quality, teamwork.",
    "notes": "This is the first performance review for this employee.",
    "decision": "pending",
    "created_by": 1,
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-01T12:00:00Z"
  }
}
```

### Update Employee Interview Schedule

Updates an existing employee interview schedule.

**URL**: `PUT /api/employee-interview-schedules/:id`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Interview schedule ID |

**Request Body**: Same fields as Create (all fields optional)

**Response**:

```json
{
  "success": true,
  "message": "Employee interview schedule updated successfully",
  "data": {
    "id": 1,
    "employee_id": 5,
    "job_id": 3,
    "title": "Updated Performance Review Q2",
    "round": 1,
    "interview_type": "performance_review",
    "scheduled_date": "2023-06-16",
    "start_time": "11:00:00",
    "end_time": "12:00:00",
    "timezone": "UTC",
    "is_virtual": true,
    "location": null,
    "meeting_link": "https://zoom.us/j/123456789",
    "meeting_id": "123456789",
    "meeting_password": "123456",
    "meeting_provider": "Zoom",
    "status": "rescheduled",
    "employee_confirmed": false,
    "is_active": true,
    "preparation_instructions": "Please prepare your quarterly achievements.",
    "interviewer_instructions": "Focus on performance metrics and growth areas.",
    "assessment_criteria": "Project delivery, code quality, teamwork.",
    "notes": "This is the first performance review for this employee.",
    "decision": "pending",
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-02T10:00:00Z"
  }
}
```

### Delete Employee Interview Schedule

Soft deletes an employee interview schedule.

**URL**: `DELETE /api/employee-interview-schedules/:id`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Interview schedule ID |

**Response**:

```json
{
  "success": true,
  "message": "Employee interview schedule deleted successfully"
}
```

### Change Employee Interview Schedule Status

Updates the status of an employee interview schedule.

**URL**: `PATCH /api/employee-interview-schedules/:id/status`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Interview schedule ID |

**Request Body**:

```json
{
  "status": "confirmed",
  "updated_by": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "Employee interview schedule status changed to confirmed successfully",
  "data": {
    "id": 1,
    "status": "confirmed",
    "updated_by": 1,
    "updated_at": "2023-06-02T10:00:00Z"
  }
}
```

### Update Employee Interview Schedule Decision

Updates the decision for an employee interview schedule.

**URL**: `PATCH /api/employee-interview-schedules/:id/decision`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Interview schedule ID |

**Request Body**:

```json
{
  "decision": "positive",
  "decision_reason": "Excellent performance in all areas.",
  "next_steps": "Schedule follow-up meeting to discuss promotion.",
  "updated_by": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "Employee interview schedule decision updated to positive successfully",
  "data": {
    "id": 1,
    "decision": "positive",
    "decision_reason": "Excellent performance in all areas.",
    "next_steps": "Schedule follow-up meeting to discuss promotion.",
    "updated_by": 1,
    "updated_at": "2023-06-02T10:00:00Z"
  }
}
```
