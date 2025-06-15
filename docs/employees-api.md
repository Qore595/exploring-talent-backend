# Employees API

## Overview

The Employees API provides endpoints to manage employee data in the TalentSpark system. It supports creating, retrieving, updating, and deleting employee records with comprehensive personal, professional, and financial information.

## Base URL

All API endpoints are relative to: `http://localhost:3001/api/employees`

## Authentication

All endpoints require authentication. Include the authentication token in the request header:

```
Authorization: Bearer {your_token}
```

## API Endpoints

### 1. Get All Employees

**URL:** `GET /employees`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Integer | Page number for pagination (default: 1) |
| limit | Integer | Number of records per page (default: 10) |
| is_active | Boolean | Filter by active status (true/false) |
| branch_id | Integer | Filter by branch ID |
| department_id | Integer | Filter by department ID |
| designation_id | Integer | Filter by designation ID |
| employment_status | String | Filter by employment status (full-time, part-time, contract, intern, terminated) |
| search | String | Search by first name, last name, employee ID, or email |

**Example Request:**
```
GET http://localhost:3001/api/employees?page=1&limit=10&is_active=true&branch_id=1&department_id=2&search=john
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_id": "EMP001",
      "first_name": "Admin",
      "last_name": "User",
      "email": "admin@talentspark.com",
      "phone": "+1-123-456-7890",
      "gender": "male",
      "dob": "1985-01-15",
      "photo": null,
      "branch_id": 1,
      "department_id": null,
      "designation_id": 1,
      "Designation": {
        "id": 1,
        "name": "CEO",
        "short_code": "CEO"
      },
      "position": "Admin",
      "employment_status": "full-time",
      "is_superadmin": true,
      "is_active": true,
      "created_at": "2023-05-10T10:00:00.000Z",
      "updated_at": "2023-05-10T10:00:00.000Z",
      "Branch": {
        "id": 1,
        "name": "Head Office"
      },
      "Department": null,
      "Manager": null
    },
    {
      "id": 2,
      "employee_id": "EMP002",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@talentspark.com",
      "phone": "+1-123-456-7891",
      "gender": "male",
      "dob": "1980-05-20",
      "photo": null,
      "branch_id": 1,
      "department_id": 1,
      "designation_id": 3,
      "Designation": {
        "id": 3,
        "name": "HR Manager",
        "short_code": "HRM"
      },
      "position": "Manager",
      "employment_status": "full-time",
      "is_superadmin": false,
      "is_active": true,
      "created_at": "2023-05-10T10:05:00.000Z",
      "updated_at": "2023-05-10T10:05:00.000Z",
      "Branch": {
        "id": 1,
        "name": "Head Office"
      },
      "Department": {
        "id": 1,
        "name": "Human Resources"
      },
      "Manager": {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User"
      }
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

### 2. Get Employees By Branch

**URL:** `GET /employees/by-branch`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Integer | Page number for pagination (default: 1) |
| limit | Integer | Number of records per page (default: 10) |
| is_active | Boolean | Filter by active status (true/false) |
| department_id | Integer | Filter by department ID |
| designation_id | Integer | Filter by designation ID |
| employment_status | String | Filter by employment status (full-time, part-time, contract, intern, terminated) |
| search | String | Search by first name, last name, employee ID, or email |

**Example Request:**
```
GET http://localhost:3001/api/employees/by-branch?page=1&limit=10&is_active=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "branch": {
        "id": 1,
        "name": "Head Office",
        "code": "HO",
        "location": "New York"
      },
      "employees": [
        {
          "id": 1,
          "employee_id": "EMP001",
          "first_name": "Admin",
          "last_name": "User",
          "email": "admin@talentspark.com",
          "phone": "+1-123-456-7890",
          "gender": "male",
          "dob": "1985-01-15",
          "photo": null,
          "department_id": null,
          "designation_id": 1,
          "Designation": {
            "id": 1,
            "name": "CEO",
            "short_code": "CEO"
          },
          "position": "Admin",
          "employment_status": "full-time",
          "is_superadmin": true,
          "is_active": true
        },
        {
          "id": 2,
          "employee_id": "EMP002",
          "first_name": "John",
          "last_name": "Doe",
          "email": "john.doe@talentspark.com",
          "phone": "+1-123-456-7891",
          "gender": "male",
          "dob": "1980-05-20",
          "photo": null,
          "department_id": 1,
          "designation_id": 3,
          "Designation": {
            "id": 3,
            "name": "HR Manager",
            "short_code": "HRM"
          },
          "position": "Manager",
          "employment_status": "full-time",
          "is_superadmin": false,
          "is_active": true
        }
      ],
      "employeeCount": 2
    },
    {
      "branch": {
        "id": 2,
        "name": "Regional Office - West",
        "code": "ROW",
        "location": "San Francisco"
      },
      "employees": [
        {
          "id": 3,
          "employee_id": "EMP003",
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane.smith@talentspark.com",
          "phone": "+1-123-456-7892",
          "gender": "female",
          "dob": "1990-08-15",
          "photo": null,
          "department_id": 2,
          "designation_id": 4,
          "Designation": {
            "id": 4,
            "name": "Sales Executive",
            "short_code": "SE"
          },
          "position": "Executive",
          "employment_status": "full-time",
          "is_superadmin": false,
          "is_active": true
        }
      ],
      "employeeCount": 1
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

### 3. Get Employees For Specific Branch

**URL:** `GET /employees/branch/:branchId`

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| branchId | Integer | Branch ID (required) |

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Integer | Page number for pagination (default: 1) |
| limit | Integer | Number of records per page (default: 10) |
| is_active | Boolean | Filter by active status (true/false) |
| department_id | Integer | Filter by department ID |
| designation_id | Integer | Filter by designation ID |
| employment_status | String | Filter by employment status (full-time, part-time, contract, intern, terminated) |
| search | String | Search by first name, last name, employee ID, or email |

**Example Request:**
```
GET http://localhost:3001/api/employees/branch/1?page=1&limit=10&is_active=true&department_id=2
```

**Response:**
```json
{
  "success": true,
  "data": {
    "branch": {
      "id": 1,
      "name": "Head Office",
      "code": "HO",
      "location": "New York"
    },
    "employees": [
      {
        "id": 1,
        "employee_id": "EMP001",
        "first_name": "Admin",
        "last_name": "User",
        "email": "admin@talentspark.com",
        "phone": "+1-123-456-7890",
        "gender": "male",
        "dob": "1985-01-15",
        "photo": null,
        "branch_id": 1,
        "department_id": 1,
        "designation_id": 1,
        "Designation": {
          "id": 1,
          "name": "CEO",
          "short_code": "CEO"
        },
        "position": "Admin",
        "employment_status": "full-time",
        "is_superadmin": true,
        "is_active": true,
        "created_at": "2023-05-10T10:00:00.000Z",
        "updated_at": "2023-05-10T10:00:00.000Z",
        "Department": {
          "id": 1,
          "name": "Human Resources"
        }
      },
      {
        "id": 2,
        "employee_id": "EMP002",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@talentspark.com",
        "phone": "+1-123-456-7891",
        "gender": "male",
        "dob": "1980-05-20",
        "photo": null,
        "branch_id": 1,
        "department_id": 1,
        "designation_id": 3,
        "Designation": {
          "id": 3,
          "name": "HR Manager",
          "short_code": "HRM"
        },
        "position": "Manager",
        "employment_status": "full-time",
        "is_superadmin": false,
        "is_active": true,
        "created_at": "2023-05-10T10:05:00.000Z",
        "updated_at": "2023-05-10T10:05:00.000Z",
        "Department": {
          "id": 1,
          "name": "Human Resources"
        }
      }
    ],
    "employeeCount": 2
  },
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

**Error Responses:**

- **400 Bad Request** - If branch ID is not provided:
```json
{
  "success": false,
  "message": "Branch ID is required"
}
```

- **404 Not Found** - If branch with the specified ID does not exist:
```json
{
  "success": false,
  "message": "Branch not found"
}
```

### 4. Get Employee by ID

**URL:** `GET /employees/:id`

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Employee ID (required) |

**Example Request:**
```
GET http://localhost:3001/api/employees/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": "EMP001",
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@talentspark.com",
    "phone": "+1-123-456-7890",
    "gender": "male",
    "dob": "1985-01-15",
    "photo": null,
    "branch_id": 1,
    "department_id": null,
    "designation_id": 1,
    "Designation": {
      "id": 1,
      "name": "CEO",
      "short_code": "CEO"
    },
    "position": "Admin",
    "qualification": null,
    "work_experience": null,
    "hire_date": "2020-01-01",
    "date_of_leaving": null,
    "employment_status": "full-time",
    "contract_type": null,
    "work_shift": null,
    "current_location": null,
    "reporting_to": null,
    "emergency_contact": null,
    "emergency_contact_relation": null,
    "marital_status": null,
    "father_name": null,
    "mother_name": null,
    "local_address": null,
    "permanent_address": null,
    "bank_account_name": null,
    "bank_account_no": null,
    "bank_name": null,
    "bank_branch": null,
    "ifsc_code": null,
    "basic_salary": null,
    "facebook": null,
    "twitter": null,
    "linkedin": null,
    "instagram": null,
    "resume": null,
    "joining_letter": null,
    "other_documents": null,
    "notes": null,
    "is_superadmin": true,
    "is_active": true,
    "created_by": null,
    "created_at": "2023-05-10T10:00:00.000Z",
    "updated_at": "2023-05-10T10:00:00.000Z",
    "Branch": {
      "id": 1,
      "name": "Head Office"
    },
    "Department": null,
    "Manager": null,
    "Subordinates": [
      {
        "id": 2,
        "employee_id": "EMP002",
        "first_name": "John",
        "last_name": "Doe"
      }
    ]
  }
}
```

**Error Responses:**

- **404 Not Found** - If employee with the specified ID does not exist:
```json
{
  "success": false,
  "message": "Employee not found"
}
```

### 5. Create Employee

**URL:** `POST /employees`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| employee_id | String | Yes | Unique identifier for the employee |
| first_name | String | Yes | Employee's first name |
| last_name | String | No | Employee's last name |
| email | String | No | Employee's email address (must be unique) |
| phone | String | No | Employee's phone number |
| password | String | Yes | Employee's password (will be hashed) |
| gender | String | No | Employee's gender (male, female, other) |
| dob | Date | No | Date of birth (YYYY-MM-DD) |
| photo | String | No | URL or path to employee's photo |
| branch_id | Integer | No | ID of the branch employee belongs to |
| department_id | Integer | No | ID of the department employee belongs to |
| designation_id | Integer | No | ID of the employee's designation |
| position | String | No | Employee's position title |
| qualification | String | No | Employee's educational qualifications |
| work_experience | String | No | Employee's previous work experience |
| hire_date | Date | No | Date of hiring (YYYY-MM-DD) |
| employment_status | String | No | Employment status (full-time, part-time, contract, intern, terminated) |
| contract_type | String | No | Type of employment contract |
| work_shift | String | No | Employee's work shift details |
| current_location | String | No | Employee's current work location |
| reporting_to | Integer | No | ID of the employee's manager |
| emergency_contact | String | No | Emergency contact number |
| emergency_contact_relation | String | No | Relationship with emergency contact |
| marital_status | String | No | Employee's marital status |
| father_name | String | No | Employee's father's name |
| mother_name | String | No | Employee's mother's name |
| local_address | String | No | Employee's local address |
| permanent_address | String | No | Employee's permanent address |
| bank_account_name | String | No | Name on bank account |
| bank_account_no | String | No | Bank account number |
| bank_name | String | No | Name of the bank |
| bank_branch | String | No | Bank branch name |
| ifsc_code | String | No | IFSC code for bank transfers |
| basic_salary | Number | No | Employee's basic salary |
| facebook | String | No | Facebook profile URL |
| twitter | String | No | Twitter profile URL |
| linkedin | String | No | LinkedIn profile URL |
| instagram | String | No | Instagram profile URL |
| resume | String | No | URL or path to employee's resume |
| joining_letter | String | No | URL or path to joining letter |
| other_documents | String | No | URLs or paths to other documents |
| notes | String | No | Additional notes about the employee |
| is_superadmin | Boolean | No | Whether employee is a superadmin (default: false) |
| is_active | Boolean | No | Whether employee is active (default: true) |
| created_by | Integer | No | ID of the user who created this record |

**Example Request:**
```json
{
  "employee_id": "EMP004",
  "first_name": "Robert",
  "last_name": "Johnson",
  "email": "robert.johnson@talentspark.com",
  "phone": "+1-123-456-7893",
  "password": "employee123",
  "gender": "male",
  "dob": "1988-11-25",
  "branch_id": 1,
  "department_id": 3,
  "designation_id": 4,
  "position": "Staff",
  "employment_status": "full-time",
  "hire_date": "2023-05-10",
  "reporting_to": 2,
  "is_active": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 4,
    "employee_id": "EMP004",
    "first_name": "Robert",
    "last_name": "Johnson",
    "email": "robert.johnson@talentspark.com",
    "phone": "+1-123-456-7893",
    "gender": "male",
    "dob": "1988-11-25",
    "branch_id": 1,
    "department_id": 3,
    "designation_id": 4,
    "Designation": {
      "id": 4,
      "name": "Software Engineer",
      "short_code": "SE"
    },
    "position": "Staff",
    "employment_status": "full-time",
    "hire_date": "2023-05-10",
    "reporting_to": 2,
    "is_superadmin": false,
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-10T10:15:00.000Z",
    "updated_at": "2023-05-10T10:15:00.000Z",
    "Branch": {
      "id": 1,
      "name": "Head Office"
    },
    "Department": {
      "id": 3,
      "name": "Information Technology"
    }
  }
}
```

**Error Responses:**

- **400 Bad Request** - If required fields are missing:
```json
{
  "success": false,
  "message": "Employee ID, first name, and password are required"
}
```

- **400 Bad Request** - If employee with same ID or email already exists:
```json
{
  "success": false,
  "message": "Employee with this employee ID or email already exists"
}
```

### 6. Update Employee

**URL:** `PUT /employees/:id`

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Employee ID (required) |

**Request Body:**

Any of the fields listed in the Create Employee endpoint can be included in the update request. Only the fields that are included will be updated.

**Example Request:**
```json
{
  "designation_id": 5,
  "position": "Team Lead",
  "basic_salary": 75000.00,
  "work_shift": "9 AM - 6 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": 4,
    "employee_id": "EMP004",
    "first_name": "Robert",
    "last_name": "Johnson",
    "email": "robert.johnson@talentspark.com",
    "phone": "+1-123-456-7893",
    "gender": "male",
    "dob": "1988-11-25",
    "branch_id": 1,
    "department_id": 3,
    "designation_id": 5,
    "Designation": {
      "id": 5,
      "name": "Senior Software Engineer",
      "short_code": "SSE"
    },
    "position": "Team Lead",
    "employment_status": "full-time",
    "work_shift": "9 AM - 6 PM",
    "basic_salary": 75000.00,
    "reporting_to": 2,
    "is_superadmin": false,
    "is_active": true,
    "created_by": 1,
    "created_at": "2023-05-10T10:15:00.000Z",
    "updated_at": "2023-05-10T10:20:00.000Z",
    "Branch": {
      "id": 1,
      "name": "Head Office"
    },
    "Department": {
      "id": 3,
      "name": "Information Technology"
    },
    "Manager": {
      "id": 2,
      "employee_id": "EMP002",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

**Error Responses:**

- **404 Not Found** - If employee with the specified ID does not exist:
```json
{
  "success": false,
  "message": "Employee not found"
}
```

- **400 Bad Request** - If employee with same ID or email already exists:
```json
{
  "success": false,
  "message": "Employee with this employee ID or email already exists"
}
```

### 7. Delete Employee

**URL:** `DELETE /employees/:id`

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Employee ID (required) |

**Example Request:**
```
DELETE http://localhost:3001/api/employees/4
```

**Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

**Error Responses:**

- **404 Not Found** - If employee with the specified ID does not exist:
```json
{
  "success": false,
  "message": "Employee not found"
}
```

- **400 Bad Request** - If employee has subordinates:
```json
{
  "success": false,
  "message": "Cannot delete employee with subordinates. Please reassign subordinates first."
}
```

## Related APIs

### Employee Skills API

For managing employee skills, use the Employee Skills API:
- `GET /employee-skills/employee/:employeeId` - Get all skills for a specific employee
- `GET /employee-skills/:id` - Get a specific skill by ID
- `POST /employee-skills/employee/:employeeId` - Create a new skill for an employee
- `PUT /employee-skills/:id` - Update an employee skill
- `DELETE /employee-skills/:id` - Delete an employee skill

### Employee Roles API

For managing employee roles, use the Employee Roles API:
- `GET /employee-roles` - Get all employee roles
- `GET /employee-roles/employee/:employeeId` - Get roles by employee ID
- `GET /employee-roles/role/:roleId` - Get employees by role ID
- `GET /employee-roles/:id` - Get employee role by ID
- `POST /employee-roles` - Create new employee role
- `PUT /employee-roles/:id` - Update employee role
- `DELETE /employee-roles/:id` - Delete employee role

### Employee Interview Schedules API

For managing employee interview schedules, use the Employee Interview Schedules API:
- `GET /employee-interview-schedules` - Get all employee interview schedules
- `GET /employee-interview-schedules/:id` - Get employee interview schedule by ID
- `GET /employee-interview-schedules/employee/:employeeId` - Get interview schedules by employee ID
- `POST /employee-interview-schedules` - Create new employee interview schedule
- `PUT /employee-interview-schedules/:id` - Update employee interview schedule
- `DELETE /employee-interview-schedules/:id` - Delete employee interview schedule

## Data Model

### Employee Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | Integer | Auto | Auto | Primary key |
| employee_id | String | Yes | - | Unique identifier for the employee |
| first_name | String | Yes | - | Employee's first name |
| last_name | String | No | null | Employee's last name |
| email | String | No | null | Employee's email address (unique) |
| phone | String | No | null | Employee's phone number |
| password | String | Yes | - | Employee's password (hashed) |
| gender | Enum | No | null | 'male', 'female', 'other' |
| dob | Date | No | null | Date of birth |
| photo | String | No | null | URL or path to employee's photo |
| branch_id | Integer | No | null | Foreign key to branches table |
| department_id | Integer | No | null | Foreign key to departments table |
| designation_id | Integer | No | null | Foreign key to designations table |
| position | String | No | null | Employee's position title |
| qualification | String | No | null | Educational qualifications |
| work_experience | String | No | null | Previous work experience |
| hire_date | Date | No | null | Date of hiring |
| date_of_leaving | Date | No | null | Date of leaving (for ex-employees) |
| employment_status | Enum | No | 'full-time' | 'full-time', 'part-time', 'contract', 'intern', 'terminated' |
| contract_type | String | No | null | Type of employment contract |
| work_shift | String | No | null | Work shift details |
| current_location | String | No | null | Current work location |
| reporting_to | Integer | No | null | Foreign key to employees table (manager) |
| emergency_contact | String | No | null | Emergency contact number |
| emergency_contact_relation | String | No | null | Relationship with emergency contact |
| marital_status | String | No | null | Marital status |
| father_name | String | No | null | Father's name |
| mother_name | String | No | null | Mother's name |
| local_address | String | No | null | Local address |
| permanent_address | String | No | null | Permanent address |
| bank_account_name | String | No | null | Name on bank account |
| bank_account_no | String | No | null | Bank account number |
| bank_name | String | No | null | Name of the bank |
| bank_branch | String | No | null | Bank branch name |
| ifsc_code | String | No | null | IFSC code for bank transfers |
| basic_salary | Number | No | null | Basic salary |
| facebook | String | No | null | Facebook profile URL |
| twitter | String | No | null | Twitter profile URL |
| linkedin | String | No | null | LinkedIn profile URL |
| instagram | String | No | null | Instagram profile URL |
| resume | String | No | null | URL or path to resume |
| joining_letter | String | No | null | URL or path to joining letter |
| other_documents | String | No | null | URLs or paths to other documents |
| notes | String | No | null | Additional notes |
| is_superadmin | Boolean | Yes | false | Whether employee is a superadmin |
| is_active | Boolean | Yes | true | Whether employee is active |
| created_by | Integer | No | null | ID of the user who created this record |
| created_at | DateTime | Auto | Current | Record creation timestamp |
| updated_at | DateTime | Auto | Current | Record update timestamp |

## Notes

1. **Password Handling**: Passwords are automatically hashed before storing in the database.
2. **Unique Constraints**: Employee ID and email must be unique.
3. **Relationships**:
   - Employees belong to a branch (optional)
   - Employees belong to a department (optional)
   - Employees belong to a designation (optional)
   - Employees can have a reporting manager (optional)
   - Employees can have subordinates
   - Employees can have multiple skills
   - Employees can have multiple roles
   - Employees can have multiple interview schedules
4. **Soft Delete**: When an employee is deleted, they are not removed from the database but marked as inactive by setting `is_active` to false and setting the `date_of_leaving` field.
5. **Validation**: An employee cannot be deleted if they have subordinates reporting to them.
6. **Superadmin**: Employees with `is_superadmin` set to true have access to all branches.
7. **Search**: You can search for employees by first name, last name, employee ID, or email using the `search` query parameter.
8. **Pagination**: The API supports pagination with `page` and `limit` query parameters.
9. **Filtering**: You can filter employees by `is_active`, `branch_id`, `department_id`, `designation_id`, and `employment_status`.