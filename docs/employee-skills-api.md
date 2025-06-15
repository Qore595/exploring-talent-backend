# Employee Skills API Documentation

This document provides details on the Employee Skills API endpoints available in the Talent Spark backend system.

## Base URL

```
http://localhost:3001/api/employee-skills
```

## Authentication

All API endpoints require authentication with staff or admin privileges. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## API Endpoints

### Get All Skills for an Employee

Retrieves a list of all skills for a specific employee with pagination and filtering options.

- **URL**: `/api/employee-skills/employee/:employeeId`
- **Method**: `GET`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `employeeId`: ID of the employee
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
  - `skill_name` (optional): Filter by skill name
  - `proficiency_level` (optional): Filter by proficiency level
  - `years_experience` (optional): Filter by years of experience

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_id": 5,
      "skill_data": {
        "skill_name": "Project Management",
        "proficiency_level": "expert",
        "years_experience": 8,
        "last_used": "2023-05-01",
        "certifications": ["PMP", "PRINCE2"],
        "description": "Experienced in managing large-scale IT projects"
      },
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-05-15T10:30:00.000Z",
      "updated_at": "2023-05-15T10:30:00.000Z"
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

### Get Skill by ID

Retrieves a specific skill by its ID.

- **URL**: `/api/employee-skills/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `id`: ID of the skill

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": 5,
    "skill_data": {
      "skill_name": "Project Management",
      "proficiency_level": "expert",
      "years_experience": 8,
      "last_used": "2023-05-01",
      "certifications": ["PMP", "PRINCE2"],
      "description": "Experienced in managing large-scale IT projects"
    },
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T10:30:00.000Z",
    "updated_at": "2023-05-15T10:30:00.000Z"
  }
}
```

### Create Skill for Employee

Creates a new skill for a specific employee.

- **URL**: `/api/employee-skills/employee/:employeeId`
- **Method**: `POST`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `employeeId`: ID of the employee
- **Request Body**:

```json
{
  "skill_data": {
    "skill_name": "Team Leadership",
    "proficiency_level": "advanced",
    "years_experience": 5,
    "last_used": "2023-05-01",
    "certifications": ["Leadership Development Program"],
    "description": "Experience leading cross-functional teams of 5-10 people"
  },
  "created_by": 1
}
```

#### Success Response

- **Code**: `201 Created`
- **Content Example**:

```json
{
  "success": true,
  "message": "Skill added successfully",
  "data": {
    "id": 2,
    "employee_id": 5,
    "skill_data": {
      "skill_name": "Team Leadership",
      "proficiency_level": "advanced",
      "years_experience": 5,
      "last_used": "2023-05-01",
      "certifications": ["Leadership Development Program"],
      "description": "Experience leading cross-functional teams of 5-10 people"
    },
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T11:30:00.000Z",
    "updated_at": "2023-05-15T11:30:00.000Z"
  }
}
```

### Update Skill

Updates an existing skill.

- **URL**: `/api/employee-skills/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `id`: ID of the skill to update
- **Request Body**:

```json
{
  "skill_data": {
    "skill_name": "Team Leadership",
    "proficiency_level": "expert",
    "years_experience": 7,
    "last_used": "2023-05-01",
    "certifications": ["Leadership Development Program", "Executive Leadership Certificate"],
    "description": "Extensive experience leading cross-functional teams of 5-15 people"
  },
  "updated_by": 1
}
```

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "message": "Skill updated successfully",
  "data": {
    "id": 2,
    "employee_id": 5,
    "skill_data": {
      "skill_name": "Team Leadership",
      "proficiency_level": "expert",
      "years_experience": 7,
      "last_used": "2023-05-01",
      "certifications": ["Leadership Development Program", "Executive Leadership Certificate"],
      "description": "Extensive experience leading cross-functional teams of 5-15 people"
    },
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-05-15T11:30:00.000Z",
    "updated_at": "2023-05-15T12:15:00.000Z"
  }
}
```

### Delete Skill

Deletes a skill.

- **URL**: `/api/employee-skills/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `id`: ID of the skill to delete

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

## Error Responses

### Authentication Error

- **Code**: `401 Unauthorized`
- **Content**:

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Authorization Error

- **Code**: `403 Forbidden`
- **Content**:

```json
{
  "success": false,
  "message": "Access denied. Staff or admin privileges required."
}
```

### Not Found Error

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "success": false,
  "message": "Employee not found"
}
```

or

```json
{
  "success": false,
  "message": "Skill not found"
}
```

### Validation Error

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "Skill name is required"
}
```

### Server Error

- **Code**: `500 Internal Server Error`
- **Content**:

```json
{
  "success": false,
  "message": "Failed to fetch employee skills",
  "error": "Error details"
}
```

## Example Skill Data Structure

The `skill_data` field is a JSON object that can contain various properties related to a skill. Here's an example of what it might contain:

```json
{
  "skill_name": "Project Management",
  "proficiency_level": "expert",
  "years_experience": 8,
  "last_used": "2023-05-01",
  "certifications": ["PMP", "PRINCE2"],
  "description": "Experienced in managing large-scale IT projects",
  "projects": [
    {
      "name": "ERP Implementation",
      "description": "Led a team of 12 to implement an enterprise-wide ERP system"
    }
  ],
  "is_primary": true,
  "category": "management",
  "subcategory": "project_management",
  "self_rating": 9,
  "manager_rating": 9,
  "verified": true,
  "verified_by": "Performance Review",
  "verified_date": "2023-04-15",
  "tools": ["JIRA", "MS Project", "Asana"],
  "training": [
    {
      "name": "Advanced Project Management",
      "provider": "PMI",
      "completion_date": "2022-03-10"
    }
  ]
}
```

The structure is flexible and can be adapted to your specific requirements.




