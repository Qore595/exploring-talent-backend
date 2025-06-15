# API Documentation

Welcome to the Talent Spark API documentation. This folder contains detailed documentation for all the APIs available in the system.

## Documentation Files

- [API Documentation Overview](./api-documentation.md) - General overview of all APIs
- [Branches API Documentation](./branches-api.md) - Documentation for the Branches API
- [Examples API Documentation](./examples-api.md) - Documentation for the Examples API
- [Roles API Documentation](./roles-api.md) - Documentation for the Roles API
- [Departments API Documentation](./departments-api.md) - Documentation for the Departments API
- [Designations API Documentation](./designations-api.md) - Documentation for the Designations API
- [Employees API Documentation](./employees-api.md) - Documentation for the Employees API
- [Employee Profile API Documentation](./employee-profile-api.md) - Documentation for the Employee Profile API with superadmin support
- [Employee Roles API Documentation](./employee-roles-api.md) - Documentation for the Employee Roles API
- [Users API Documentation](./users-api.md) - Documentation for the Users API
- [SMS Configurations API Documentation](./sms-configurations-api.md) - Documentation for the SMS Configurations API
- [SMS Templates API Documentation](./sms-templates-api.md) - Documentation for the SMS Templates API
- [Payment Configurations API Documentation](./payment-configurations-api.md) - Documentation for the Payment Configurations API
- [Social Media Links API Documentation](./social-media-links-api.md) - Documentation for the Social Media Links API
- [General Settings API Documentation](./general-settings-api.md) - Documentation for the General Settings API
- [Jobs API Documentation](./jobs-api.md) - Documentation for the Jobs API
- [Email Configurations API Documentation](./email-config-api.md) - Documentation for the Email Configurations API
- [Email Templates API Documentation](./email-template-api.md) - Documentation for the Email Templates API
- [User Skills API Documentation](./user-skills-api.md) - Documentation for the User Skills API
- [Employee Skills API Documentation](./employee-skills-api.md) - Documentation for the Employee Skills API
- [Employee Authentication API Documentation](./employee-auth-api.md) - Documentation for the Employee Authentication API

## Getting Started

To get started with the APIs, make sure you have:

1. Set up the backend server (see the main README.md file)
2. Started the server using `npm run dev`
3. Obtained an authentication token (if required)

## API Testing

You can test the APIs using tools like:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [curl](https://curl.se/) command-line tool

## Example API Request

Here's an example of how to make an API request using curl:

```bash
# Get all branches
curl -X GET http://localhost:3001/api/branches

# Get a specific branch
curl -X GET http://localhost:3001/api/branches/1

# Create a new branch
curl -X POST http://localhost:3001/api/branches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Branch",
    "city": "Chicago",
    "country": "USA",
    "created_by": 1
  }'

# Get all roles
curl -X GET http://localhost:3001/api/roles

# Create a new role
curl -X POST http://localhost:3001/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manager",
    "slug": "manager",
    "description": "Branch manager role",
    "branch_id": 1,
    "created_by": 1
  }'

# Get all departments
curl -X GET http://localhost:3001/api/departments

# Create a new department
curl -X POST http://localhost:3001/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Human Resources",
    "branch_id": 1,
    "short_code": "HR",
    "description": "Human Resources department",
    "created_by": 1
  }'

# Get all designations
curl -X GET http://localhost:3001/api/designations

# Create a new designation
curl -X POST http://localhost:3001/api/designations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Software Developer",
    "branch_id": 1,
    "short_code": "SD",
    "description": "Software Developer position",
    "created_by": 1
  }'

# Get all employees
curl -X GET http://localhost:3001/api/employees

# Create a new employee
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP004",
    "first_name": "Robert",
    "last_name": "Johnson",
    "email": "robert.johnson@talentspark.com",
    "password": "employee123",
    "branch_id": 1,
    "department_id": 3,
    "designation_id": 4,
    "created_by": 1  }'

# Get employee profile (regular employee)
curl -X GET http://localhost:3001/api/employees/profile/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get employee profile (superadmin employee)
curl -X GET http://localhost:3001/api/employees/profile/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# User signup
curl -X POST http://localhost:3001/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-123-4567"
  }'

# User login
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'

# Create SMS configuration
curl -X POST http://localhost:3001/api/sms-configurations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "gateway_name": "Twilio SMS",
    "gateway_code": "twilio",
    "live_values": {
      "account_sid": "account_sid_here",
      "auth_token": "auth_token_here",
      "from_number": "+15551234567"
    },
    "mode": "live",
    "is_active": true,
    "created_by": 1
  }'

# Create SMS template
curl -X POST http://localhost:3001/api/sms-templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "template_name": "OTP Verification",
    "template_code": "otp_verification",
    "content": "Your verification code is {OTP}. Valid for {VALIDITY} minutes.",
    "variables": "OTP,VALIDITY",
    "category": "otp",
    "is_active": true,
    "created_by": 1
  }'

# Create payment configuration
curl -X POST http://localhost:3001/api/payment-configurations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "gateway_name": "Stripe",
    "gateway_code": "stripe",
    "test_values": {
      "api_key": "sk_test_1234567890abcdef1234567890abcdef",
      "public_key": "pk_test_1234567890abcdef1234567890abcdef"
    },
    "mode": "test",
    "is_active": true,
    "supports_recurring": true,
    "supports_refunds": true,
    "created_by": 1
  }'

# Create social media link
curl -X POST http://localhost:3001/api/social-media-links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "platform_name": "LinkedIn",
    "platform_code": "linkedin",
    "url": "https://linkedin.com/company/talentspark",
    "is_active": true,
    "open_in_new_tab": true,
    "created_by": 1
  }'

# Create general setting
curl -X POST http://localhost:3001/api/general-settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "company_name": "Talent Spark",
    "tagline": "Empowering HR Solutions",
    "email": "info@talentspark.com",
    "phone": "+1-555-123-4567",
    "address": "123 Business Avenue",
    "city": "San Francisco",
    "country": "USA",
    "currency": "USD",
    "currency_symbol": "$",
    "date_format": "Y-m-d",
    "time_format": "H:i:s",
    "timezone": "America/Los_Angeles",
    "created_by": 1
  }'

# Create job
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "job_title": "Senior Software Engineer",
    "job_type": "full_time",
    "job_level": "senior",
    "company_name": "Tech Innovations Inc.",
    "description": "We are looking for a Senior Software Engineer to join our team...",
    "responsibilities": "Design and develop high-quality software solutions...",
    "requirements": "5+ years of experience in software development...",
    "min_experience": 5,
    "max_experience": 10,
    "education_level": "Bachelor's degree in Computer Science or related field",
    "min_salary": 120000,
    "max_salary": 150000,
    "salary_currency": "USD",
    "is_remote": true,
    "location_city": "San Francisco",
    "location_state": "California",
    "location_country": "USA",
    "status": "published",
    "created_by": 1
  }'

# Create email configuration
curl -X POST http://localhost:3001/api/email-configs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "email_type": "SMTP",
    "smtp_server": "smtp.example.com",
    "smtp_port": 587,
    "smtp_username": "user@example.com",
    "smtp_password": "password123",
    "ssl_tls": "tls",
    "smtp_auth": true,
    "from_email": "noreply@example.com",
    "from_name": "Example Company",
    "reply_to_email": "support@example.com",
    "is_active": true,
    "is_default": true,
    "created_by": 1
  }'

# Create email template
curl -X POST http://localhost:3001/api/email-templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "template_code": "welcome_email",
    "name": "Welcome Email",
    "subject": "Welcome to Our Platform",
    "body_html": "<h1>Welcome!</h1><p>Thank you for joining our platform, {NAME}.</p>",
    "body_text": "Welcome! Thank you for joining our platform, {NAME}.",
    "variables": "NAME",
    "email_type": "transactional",
    "description": "Sent to new users after registration",
    "is_active": true,
    "is_system": false,
    "from_name": "Support Team",
    "from_email": "support@example.com",
    "reply_to": "no-reply@example.com",
    "created_by": 1
  }'

# Create user skill
curl -X POST http://localhost:3001/api/user-skills/user/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "skill_data": {
      "skill_name": "JavaScript",
      "proficiency_level": "advanced",
      "years_experience": 5,
      "last_used": "2023-05-01",
      "certifications": ["JavaScript Developer Certification"],
      "description": "Proficient in modern JavaScript including ES6+ features"
    },
    "created_by": 1
  }'

# Create employee skill
curl -X POST http://localhost:3001/api/employee-skills/employee/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "skill_data": {
      "skill_name": "Project Management",
      "proficiency_level": "expert",
      "years_experience": 8,
      "last_used": "2023-05-01",
      "certifications": ["PMP", "PRINCE2"],
      "description": "Experienced in managing large-scale IT projects"
    },
    "created_by": 1
  }'
```

## Database Support

The API is designed to work with multiple database types:

- MySQL
- PostgreSQL
- MongoDB

The database type can be configured in the `.env` file by setting the `DB_TYPE` variable.

## Need Help?

If you need help or have questions about the API, please contact the development team.
