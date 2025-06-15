# User Interview Schedules API

This API allows you to manage interview schedules for users.

## Base URL

```
/api/user-interview-schedules
```

## Authentication

All endpoints require authentication. Use a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Endpoints

### Get All User Interview Schedules

Retrieves a paginated list of user interview schedules with optional filtering.

**URL**: `GET /api/user-interview-schedules`

**Access**: Staff or Admin

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Number | Page number (default: 1) |
| limit | Number | Items per page (default: 10) |
| user_id | Number | Filter by user ID |
| job_id | Number | Filter by job ID |
| status | String | Filter by status (scheduled, confirmed, rescheduled, completed, canceled, no_show) |
| decision | String | Filter by decision (pending, successful, requires_followup, canceled, rescheduled, no_decision) |
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
      "user_id": 5,
      "job_id": 3,
      "title": "Initial Interview",
      "round": 1,
      "interview_type": "onboarding",
      "scheduled_date": "2023-06-15",
      "start_time": "10:00:00",
      "end_time": "11:00:00",
      "duration_minutes": 60,
      "timezone": "UTC",
      "is_virtual": true,
      "meeting_link": "https://zoom.us/j/123456789",
      "status": "scheduled",
      "user_confirmed": false,
      "is_active": true,
      "decision": "pending",
      "created_at": "2023-06-01T12:00:00Z",
      "updated_at": "2023-06-01T12:00:00Z",
      "user": {
        "id": 5,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
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

### Get User Interview Schedule by ID

Retrieves a specific user interview schedule by its ID.

**URL**: `GET /api/user-interview-schedules/:id`

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
    "user_id": 5,
    "job_id": 3,
    "title": "Initial Interview",
    "round": 1,
    "interview_type": "onboarding",
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
    "user_confirmed": false,
    "confirmation_date": null,
    "is_active": true,
    "preparation_instructions": "Please prepare your portfolio and resume.",
    "interviewer_instructions": "Focus on technical skills and experience.",
    "assessment_criteria": "Technical knowledge, problem-solving, communication.",
    "notes": "This is the first interview for this candidate.",
    "decision": "pending",
    "decision_reason": null,
    "next_steps": null,
    "reminder_sent": false,
    "reminder_sent_at": null,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-01T12:00:00Z",
    "user": {
      "id": 5,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    },
    "job": {
      "id": 3,
      "job_title": "Senior Developer"
    }
  }
}
```

### Get Interview Schedules by User ID

Retrieves all interview schedules for a specific user.

**URL**: `GET /api/user-interview-schedules/user/:userId`

**Access**: Staff or Admin

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| userId | Number | User ID |

**Query Parameters**: Same as "Get All User Interview Schedules"

**Response**: Same format as "Get All User Interview Schedules"

### Create User Interview Schedule

Creates a new interview schedule for a user.

**URL**: `POST /api/user-interview-schedules`

**Access**: Admin only

**Request Body**:

```json
{
  "user_id": 5,
  "job_id": 3,
  "title": "Initial Interview",
  "round": 1,
  "interview_type": "onboarding",
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
  "user_confirmed": false,
  "is_active": true,
  "preparation_instructions": "Please prepare your portfolio and resume.",
  "interviewer_instructions": "Focus on technical skills and experience.",
  "assessment_criteria": "Technical knowledge, problem-solving, communication.",
  "notes": "This is the first interview for this candidate.",
  "created_by": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "User interview schedule created successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "job_id": 3,
    "title": "Initial Interview",
    "round": 1,
    "interview_type": "onboarding",
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
    "user_confirmed": false,
    "is_active": true,
    "preparation_instructions": "Please prepare your portfolio and resume.",
    "interviewer_instructions": "Focus on technical skills and experience.",
    "assessment_criteria": "Technical knowledge, problem-solving, communication.",
    "notes": "This is the first interview for this candidate.",
    "decision": "pending",
    "created_by": 1,
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-01T12:00:00Z"
  }
}
```

### Update User Interview Schedule

Updates an existing user interview schedule.

**URL**: `PUT /api/user-interview-schedules/:id`

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
  "message": "User interview schedule updated successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "job_id": 3,
    "title": "Updated Initial Interview",
    "round": 1,
    "interview_type": "onboarding",
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
    "user_confirmed": false,
    "is_active": true,
    "preparation_instructions": "Please prepare your portfolio and resume.",
    "interviewer_instructions": "Focus on technical skills and experience.",
    "assessment_criteria": "Technical knowledge, problem-solving, communication.",
    "notes": "This is the first interview for this candidate.",
    "decision": "pending",
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-06-01T12:00:00Z",
    "updated_at": "2023-06-02T10:00:00Z"
  }
}
```

### Delete User Interview Schedule

Soft deletes a user interview schedule.

**URL**: `DELETE /api/user-interview-schedules/:id`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Interview schedule ID |

**Response**:

```json
{
  "success": true,
  "message": "User interview schedule deleted successfully"
}
```

### Change User Interview Schedule Status

Updates the status of a user interview schedule.

**URL**: `PATCH /api/user-interview-schedules/:id/status`

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
  "message": "User interview schedule status changed to confirmed successfully",
  "data": {
    "id": 1,
    "status": "confirmed",
    "updated_by": 1,
    "updated_at": "2023-06-02T10:00:00Z"
  }
}
```

### Update User Interview Schedule Decision

Updates the decision for a user interview schedule.

**URL**: `PATCH /api/user-interview-schedules/:id/decision`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Interview schedule ID |

**Request Body**:

```json
{
  "decision": "successful",
  "decision_reason": "Strong technical skills and good cultural fit.",
  "next_steps": "Schedule second interview with team lead.",
  "updated_by": 1
}
```

**Response**:

```json
{
  "success": true,
  "message": "User interview schedule decision updated to successful successfully",
  "data": {
    "id": 1,
    "decision": "successful",
    "decision_reason": "Strong technical skills and good cultural fit.",
    "next_steps": "Schedule second interview with team lead.",
    "updated_by": 1,
    "updated_at": "2023-06-02T10:00:00Z"
  }
}
```
