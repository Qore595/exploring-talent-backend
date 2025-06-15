# User Skills API Documentation

This document provides details on the User Skills API endpoints available in the Talent Spark backend system.

## Base URL

```
http://localhost:3001/api/user-skills
```

## Authentication

All API endpoints require authentication with staff or admin privileges. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## API Endpoints

### Get All Skills for a User

Retrieves a list of all skills for a specific user with pagination and filtering options.

- **URL**: `/api/user-skills/user/:userId`
- **Method**: `GET`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `userId`: ID of the user
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
      "user_id": 5,
      "skill_data": {
        "skill_name": "JavaScript",
        "proficiency_level": "advanced",
        "years_experience": 5,
        "last_used": "2023-05-01",
        "certifications": ["JavaScript Developer Certification"],
        "description": "Proficient in modern JavaScript including ES6+ features"
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

- **URL**: `/api/user-skills/:id`
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
    "user_id": 5,
    "skill_data": {
      "skill_name": "JavaScript",
      "proficiency_level": "advanced",
      "years_experience": 5,
      "last_used": "2023-05-01",
      "certifications": ["JavaScript Developer Certification"],
      "description": "Proficient in modern JavaScript including ES6+ features"
    },
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-05-15T10:30:00.000Z",
    "updated_at": "2023-05-15T10:30:00.000Z"
  }
}
```

### Create Skill for User

Creates a new skill for a specific user.

- **URL**: `/api/user-skills/user/:userId`
- **Method**: `POST`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `userId`: ID of the user
- **Request Body**:

```json
{
  "skill_data": {
    "skill_name": "React",
    "proficiency_level": "intermediate",
    "years_experience": 2,
    "last_used": "2023-05-01",
    "certifications": [],
    "description": "Experience with React hooks and context API"
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
    "user_id": 5,
    "skill_data": {
      "skill_name": "React",
      "proficiency_level": "intermediate",
      "years_experience": 2,
      "last_used": "2023-05-01",
      "certifications": [],
      "description": "Experience with React hooks and context API"
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

- **URL**: `/api/user-skills/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Staff or Admin)
- **URL Parameters**:
  - `id`: ID of the skill to update
- **Request Body**:

```json
{
  "skill_data": {
    "skill_name": "React",
    "proficiency_level": "advanced",
    "years_experience": 3,
    "last_used": "2023-05-01",
    "certifications": ["React Developer Certification"],
    "description": "Advanced knowledge of React, including hooks, context API, and Redux"
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
    "user_id": 5,
    "skill_data": {
      "skill_name": "React",
      "proficiency_level": "advanced",
      "years_experience": 3,
      "last_used": "2023-05-01",
      "certifications": ["React Developer Certification"],
      "description": "Advanced knowledge of React, including hooks, context API, and Redux"
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

- **URL**: `/api/user-skills/:id`
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
  "message": "User not found"
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
  "message": "Failed to fetch user skills",
  "error": "Error details"
}
```

## Example Skill Data Structure

The `skill_data` field is a JSON object that can contain various properties related to a skill. Here's an example of what it might contain:

```json
{
  "skill_name": "JavaScript",
  "proficiency_level": "advanced",
  "years_experience": 5,
  "last_used": "2023-05-01",
  "certifications": ["JavaScript Developer Certification"],
  "description": "Proficient in modern JavaScript including ES6+ features",
  "projects": [
    {
      "name": "E-commerce Website",
      "description": "Developed frontend using React and JavaScript"
    }
  ],
  "is_primary": true,
  "category": "programming",
  "subcategory": "frontend",
  "self_rating": 9,
  "verified": true,
  "verified_by": "Technical Assessment",
  "verified_date": "2023-04-15"
}
```

The structure is flexible and can be adapted to your specific requirements.
