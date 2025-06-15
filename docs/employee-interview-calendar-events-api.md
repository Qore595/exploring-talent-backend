# Employee Interview Calendar Events API

This API allows you to manage calendar events for employee interviews.

## Base URL

```
/api/employee-interview-calendar-events
```

## Authentication

All endpoints require authentication. Use a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Endpoints

### Get All Calendar Events

Retrieves a paginated list of calendar events with optional filtering.

**URL**: `GET /api/employee-interview-calendar-events`

**Access**: Staff or Admin

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Number | Page number (default: 1) |
| limit | Number | Items per page (default: 10) |
| interview_id | Number | Filter by interview ID |
| calendar_type | String | Filter by calendar type (google, outlook, ical, other) |
| sync_status | String | Filter by sync status (synced, out_of_sync, failed) |
| is_active | Boolean | Filter by active status |

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "interview_id": 5,
      "calendar_type": "google",
      "event_id": "abc123xyz456",
      "organizer_id": 3,
      "event_url": "https://calendar.google.com/event?id=abc123xyz456",
      "sync_status": "synced",
      "is_active": true,
      "last_synced_at": "2023-06-01T12:00:00Z",
      "created_at": "2023-06-01T10:00:00Z",
      "updated_at": "2023-06-01T12:00:00Z",
      "interview": {
        "id": 5,
        "title": "Performance Review Q2",
        "scheduled_date": "2023-06-15",
        "start_time": "10:00:00",
        "end_time": "11:00:00"
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

### Get Calendar Event by ID

Retrieves a specific calendar event by its ID.

**URL**: `GET /api/employee-interview-calendar-events/:id`

**Access**: Staff or Admin

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Calendar event ID |

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "interview_id": 5,
    "calendar_type": "google",
    "event_id": "abc123xyz456",
    "organizer_id": 3,
    "event_url": "https://calendar.google.com/event?id=abc123xyz456",
    "sync_status": "synced",
    "is_active": true,
    "last_synced_at": "2023-06-01T12:00:00Z",
    "created_at": "2023-06-01T10:00:00Z",
    "updated_at": "2023-06-01T12:00:00Z",
    "interview": {
      "id": 5,
      "title": "Performance Review Q2",
      "scheduled_date": "2023-06-15",
      "start_time": "10:00:00",
      "end_time": "11:00:00",
      "employee": {
        "id": 3,
        "first_name": "Jane",
        "last_name": "Smith"
      }
    }
  }
}
```

### Get Calendar Events by Interview ID

Retrieves all calendar events for a specific interview.

**URL**: `GET /api/employee-interview-calendar-events/interview/:interviewId`

**Access**: Staff or Admin

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| interviewId | Number | Interview ID |

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "interview_id": 5,
      "calendar_type": "google",
      "event_id": "abc123xyz456",
      "organizer_id": 3,
      "event_url": "https://calendar.google.com/event?id=abc123xyz456",
      "sync_status": "synced",
      "is_active": true,
      "last_synced_at": "2023-06-01T12:00:00Z",
      "created_at": "2023-06-01T10:00:00Z",
      "updated_at": "2023-06-01T12:00:00Z"
    },
    {
      "id": 2,
      "interview_id": 5,
      "calendar_type": "outlook",
      "event_id": "def456ghi789",
      "organizer_id": 3,
      "event_url": "https://outlook.office.com/calendar/event/def456ghi789",
      "sync_status": "synced",
      "is_active": true,
      "last_synced_at": "2023-06-01T12:05:00Z",
      "created_at": "2023-06-01T10:05:00Z",
      "updated_at": "2023-06-01T12:05:00Z"
    }
  ]
}
```

### Create Calendar Event

Creates a new calendar event for an interview.

**URL**: `POST /api/employee-interview-calendar-events`

**Access**: Admin only

**Request Body**:

```json
{
  "interview_id": 5,
  "calendar_type": "google",
  "event_id": "abc123xyz456",
  "organizer_id": 3,
  "event_url": "https://calendar.google.com/event?id=abc123xyz456",
  "sync_status": "synced",
  "is_active": true,
  "last_synced_at": "2023-06-01T12:00:00Z"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Calendar event created successfully",
  "data": {
    "id": 1,
    "interview_id": 5,
    "calendar_type": "google",
    "event_id": "abc123xyz456",
    "organizer_id": 3,
    "event_url": "https://calendar.google.com/event?id=abc123xyz456",
    "sync_status": "synced",
    "is_active": true,
    "last_synced_at": "2023-06-01T12:00:00Z",
    "created_at": "2023-06-01T10:00:00Z",
    "updated_at": "2023-06-01T10:00:00Z"
  }
}
```

### Update Calendar Event

Updates an existing calendar event.

**URL**: `PUT /api/employee-interview-calendar-events/:id`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Calendar event ID |

**Request Body**:

```json
{
  "event_id": "updated_abc123xyz456",
  "event_url": "https://calendar.google.com/event?id=updated_abc123xyz456",
  "sync_status": "out_of_sync",
  "is_active": true
}
```

**Response**:

```json
{
  "success": true,
  "message": "Calendar event updated successfully",
  "data": {
    "id": 1,
    "interview_id": 5,
    "calendar_type": "google",
    "event_id": "updated_abc123xyz456",
    "organizer_id": 3,
    "event_url": "https://calendar.google.com/event?id=updated_abc123xyz456",
    "sync_status": "out_of_sync",
    "is_active": true,
    "last_synced_at": "2023-06-01T12:00:00Z",
    "created_at": "2023-06-01T10:00:00Z",
    "updated_at": "2023-06-01T14:00:00Z"
  }
}
```

### Delete Calendar Event

Deletes a calendar event.

**URL**: `DELETE /api/employee-interview-calendar-events/:id`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Calendar event ID |

**Response**:

```json
{
  "success": true,
  "message": "Calendar event deleted successfully"
}
```

### Update Sync Status

Updates the sync status of a calendar event.

**URL**: `PATCH /api/employee-interview-calendar-events/:id/sync-status`

**Access**: Admin only

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Number | Calendar event ID |

**Request Body**:

```json
{
  "sync_status": "synced"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Calendar event sync status updated to synced successfully",
  "data": {
    "id": 1,
    "sync_status": "synced",
    "last_synced_at": "2023-06-01T16:00:00Z",
    "updated_at": "2023-06-01T16:00:00Z"
  }
}
```
