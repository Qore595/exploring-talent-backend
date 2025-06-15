# Jobs API

This API allows you to manage job listings in the system.

## API URLs and Payloads

### 1. Get All Jobs (Public)

**URL:** `GET http://localhost:3001/api/jobs/public?page=1&limit=10&status=published&job_type=full_time&is_remote=true&sort_by=created_at&sort_order=desc`

**Query Parameters:**
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 10)
- `status`: Filter by job status (draft, published, filled, expired, canceled)
- `job_type`: Filter by job type (full_time, part_time, contract, temporary, internship, remote, freelance)
- `job_level`: Filter by job level (entry, associate, mid_level, senior, executive, management)
- `is_remote`: Filter by remote work option (true/false)
- `is_featured`: Filter by featured status (true/false)
- `company_name`: Filter by company name
- `location_city`: Filter by city
- `location_state`: Filter by state/province
- `location_country`: Filter by country
- `min_salary`: Filter by minimum salary
- `max_salary`: Filter by maximum salary
- `education_level`: Filter by education level
- `min_experience`: Filter by minimum years of experience
- `max_experience`: Filter by maximum years of experience
- `search`: Search term for job title, description, company name, or location
- `sort_by`: Field to sort by (default: created_at)
- `sort_order`: Sort direction (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "job_title": "Senior Software Engineer",
      "slug": "senior-software-engineer",
      "job_type": "full_time",
      "job_level": "senior",
      "company_name": "Tech Innovations Inc.",
      "company_logo": "/uploads/logos/tech-innovations.png",
      "company_website": "https://techinnovations.example.com",
      "company_about": "Leading technology company specializing in innovative solutions.",
      "company_industry": "Information Technology",
      "company_size": "51-200",
      "description": "We are looking for a Senior Software Engineer to join our team...",
      "responsibilities": "Design and develop high-quality software solutions...",
      "requirements": "5+ years of experience in software development...",
      "preferred_skills": "Experience with cloud platforms (AWS, Azure, GCP)...",
      "qualification_summary": "Strong background in software engineering with expertise in...",
      "technical_requirements": "Proficiency in JavaScript, TypeScript, React, Node.js...",
      "min_experience": 5,
      "max_experience": 10,
      "education_level": "Bachelor's degree in Computer Science or related field",
      "certification_requirements": "AWS Certified Developer preferred",
      "department": "Engineering",
      "reports_to": "Engineering Manager",
      "direct_reports": 2,
      "team_size": 8,
      "min_salary": 120000,
      "max_salary": 150000,
      "salary_currency": "USD",
      "salary_period": "annually",
      "is_salary_visible": true,
      "has_benefits": true,
      "benefits_summary": "Comprehensive benefits package including health insurance, 401(k)...",
      "healthcare": true,
      "dental_vision": true,
      "retirement_plan": true,
      "paid_time_off": "Unlimited PTO",
      "equity": true,
      "equity_details": "Stock options available",
      "bonus_structure": "Annual performance bonus up to 15% of base salary",
      "work_schedule": "Monday to Friday, 9am-5pm",
      "weekly_hours": 40,
      "is_remote": true,
      "remote_type": "fully_remote",
      "remote_regions_allowed": "United States, Canada",
      "workspace_type": "home",
      "travel_required": "10%",
      "relocation_assistance": true,
      "work_environment": "Fast-paced, collaborative environment with focus on innovation",
      "dress_code": "Casual",
      "is_flexible_hours": true,
      "location_city": "San Francisco",
      "location_state": "California",
      "location_country": "USA",
      "location_postal_code": "94105",
      "location_address": "123 Tech Street, San Francisco, CA 94105",
      "is_multiple_locations": false,
      "openings": 2,
      "deadline": "2023-12-31",
      "application_instructions": "Please submit your resume and a cover letter...",
      "apply_type": "direct",
      "external_apply_url": null,
      "apply_email": null,
      "screening_questions_count": 5,
      "has_assessment": true,
      "assessment_details": "Technical coding assessment and system design exercise",
      "interview_process": "Initial screening, technical assessment, panel interview, final interview",
      "estimated_hiring_timeline": "4-6 weeks",
      "is_equal_opportunity": true,
      "diversity_commitment": "We are committed to diversity and inclusion in our workplace...",
      "accommodations": "Reasonable accommodations available for candidates with disabilities",
      "is_visa_sponsored": true,
      "is_veteran_friendly": true,
      "contact_name": "Jane Smith",
      "contact_title": "Talent Acquisition Specialist",
      "contact_email": "jobs@techinnovations.example.com",
      "contact_phone": "+1-555-123-4567",
      "contact_availability": "Monday to Friday, 9am-5pm PST",
      "status": "published",
      "is_featured": true,
      "is_confidential": false,
      "is_urgent": true,
      "is_internal": false,
      "internal_job_id": "ENG-2023-42",
      "reference_code": "SR-ENG-SF-2023",
      "repost_count": 0,
      "original_post_date": "2023-10-15",
      "meta_title": "Senior Software Engineer Job at Tech Innovations Inc.",
      "meta_description": "Join our team as a Senior Software Engineer and work on cutting-edge technology projects.",
      "meta_keywords": "software engineer, senior developer, tech jobs, remote work",
      "seo_canonical_url": "https://careers.techinnovations.example.com/jobs/senior-software-engineer",
      "social_share_image": "/uploads/social/senior-engineer-job.jpg",
      "promotional_text": "Join one of the fastest-growing tech companies in the Bay Area!",
      "views_count": 1250,
      "applications_count": 78,
      "qualified_applications_count": 42,
      "shares_count": 35,
      "referral_source": "LinkedIn",
      "tracking_pixel": null,
      "utm_source": "linkedin",
      "utm_medium": "social",
      "utm_campaign": "engineering-jobs-q4",
      "created_by": 1,
      "updated_by": 1,
      "published_at": "2023-10-15T09:30:00.000Z",
      "expires_at": "2023-12-31T23:59:59.000Z",
      "created_at": "2023-10-14T16:45:22.000Z",
      "updated_at": "2023-10-15T09:30:00.000Z",
      "deleted_at": null
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### 2. Get Job by ID (Public)

**URL:** `GET http://localhost:3001/api/jobs/public/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "job_title": "Senior Software Engineer",
    "slug": "senior-software-engineer",
    "job_type": "full_time",
    "job_level": "senior",
    "company_name": "Tech Innovations Inc.",
    "company_logo": "/uploads/logos/tech-innovations.png",
    "company_website": "https://techinnovations.example.com",
    "company_about": "Leading technology company specializing in innovative solutions.",
    "company_industry": "Information Technology",
    "company_size": "51-200",
    "description": "We are looking for a Senior Software Engineer to join our team...",
    "responsibilities": "Design and develop high-quality software solutions...",
    "requirements": "5+ years of experience in software development...",
    "preferred_skills": "Experience with cloud platforms (AWS, Azure, GCP)...",
    "qualification_summary": "Strong background in software engineering with expertise in...",
    "technical_requirements": "Proficiency in JavaScript, TypeScript, React, Node.js...",
    "min_experience": 5,
    "max_experience": 10,
    "education_level": "Bachelor's degree in Computer Science or related field",
    "certification_requirements": "AWS Certified Developer preferred",
    "department": "Engineering",
    "reports_to": "Engineering Manager",
    "direct_reports": 2,
    "team_size": 8,
    "min_salary": 120000,
    "max_salary": 150000,
    "salary_currency": "USD",
    "salary_period": "annually",
    "is_salary_visible": true,
    "has_benefits": true,
    "benefits_summary": "Comprehensive benefits package including health insurance, 401(k)...",
    "healthcare": true,
    "dental_vision": true,
    "retirement_plan": true,
    "paid_time_off": "Unlimited PTO",
    "equity": true,
    "equity_details": "Stock options available",
    "bonus_structure": "Annual performance bonus up to 15% of base salary",
    "work_schedule": "Monday to Friday, 9am-5pm",
    "weekly_hours": 40,
    "is_remote": true,
    "remote_type": "fully_remote",
    "remote_regions_allowed": "United States, Canada",
    "workspace_type": "home",
    "travel_required": "10%",
    "relocation_assistance": true,
    "work_environment": "Fast-paced, collaborative environment with focus on innovation",
    "dress_code": "Casual",
    "is_flexible_hours": true,
    "location_city": "San Francisco",
    "location_state": "California",
    "location_country": "USA",
    "location_postal_code": "94105",
    "location_address": "123 Tech Street, San Francisco, CA 94105",
    "is_multiple_locations": false,
    "openings": 2,
    "deadline": "2023-12-31",
    "application_instructions": "Please submit your resume and a cover letter...",
    "apply_type": "direct",
    "external_apply_url": null,
    "apply_email": null,
    "screening_questions_count": 5,
    "has_assessment": true,
    "assessment_details": "Technical coding assessment and system design exercise",
    "interview_process": "Initial screening, technical assessment, panel interview, final interview",
    "estimated_hiring_timeline": "4-6 weeks",
    "is_equal_opportunity": true,
    "diversity_commitment": "We are committed to diversity and inclusion in our workplace...",
    "accommodations": "Reasonable accommodations available for candidates with disabilities",
    "is_visa_sponsored": true,
    "is_veteran_friendly": true,
    "contact_name": "Jane Smith",
    "contact_title": "Talent Acquisition Specialist",
    "contact_email": "jobs@techinnovations.example.com",
    "contact_phone": "+1-555-123-4567",
    "contact_availability": "Monday to Friday, 9am-5pm PST",
    "status": "published",
    "is_featured": true,
    "is_confidential": false,
    "is_urgent": true,
    "is_internal": false,
    "internal_job_id": "ENG-2023-42",
    "reference_code": "SR-ENG-SF-2023",
    "repost_count": 0,
    "original_post_date": "2023-10-15",
    "meta_title": "Senior Software Engineer Job at Tech Innovations Inc.",
    "meta_description": "Join our team as a Senior Software Engineer and work on cutting-edge technology projects.",
    "meta_keywords": "software engineer, senior developer, tech jobs, remote work",
    "seo_canonical_url": "https://careers.techinnovations.example.com/jobs/senior-software-engineer",
    "social_share_image": "/uploads/social/senior-engineer-job.jpg",
    "promotional_text": "Join one of the fastest-growing tech companies in the Bay Area!",
    "views_count": 1251,
    "applications_count": 78,
    "qualified_applications_count": 42,
    "shares_count": 35,
    "referral_source": "LinkedIn",
    "tracking_pixel": null,
    "utm_source": "linkedin",
    "utm_medium": "social",
    "utm_campaign": "engineering-jobs-q4",
    "created_by": 1,
    "updated_by": 1,
    "published_at": "2023-10-15T09:30:00.000Z",
    "expires_at": "2023-12-31T23:59:59.000Z",
    "created_at": "2023-10-14T16:45:22.000Z",
    "updated_at": "2023-10-15T09:30:00.000Z",
    "deleted_at": null
  }
}
```

### 3. Get Job by Slug (Public)

**URL:** `GET http://localhost:3001/api/jobs/public/slug/senior-software-engineer`

**Response:** Same as Get Job by ID

### 4. Increment Application Count

**URL:** `POST http://localhost:3001/api/jobs/public/1/apply`

**Response:**
```json
{
  "success": true,
  "message": "Application count incremented successfully",
  "data": {
    "applications_count": 79
  }
}
```

### 5. Create New Job (Admin Only)

**URL:** `POST http://localhost:3001/api/jobs`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Payload:**
```json
{
  "job_title": "Frontend Developer",
  "job_type": "full_time",
  "job_level": "mid_level",
  "company_name": "Tech Innovations Inc.",
  "company_logo": "/uploads/logos/tech-innovations.png",
  "company_website": "https://techinnovations.example.com",
  "company_about": "Leading technology company specializing in innovative solutions.",
  "company_industry": "Information Technology",
  "company_size": "51-200",
  "description": "We are looking for a Frontend Developer to join our team...",
  "responsibilities": "Design and develop user interfaces...",
  "requirements": "3+ years of experience in frontend development...",
  "preferred_skills": "Experience with React, Vue, or Angular...",
  "min_experience": 3,
  "max_experience": 5,
  "education_level": "Bachelor's degree in Computer Science or related field",
  "department": "Engineering",
  "reports_to": "Frontend Lead",
  "team_size": 6,
  "min_salary": 90000,
  "max_salary": 110000,
  "salary_currency": "USD",
  "salary_period": "annually",
  "is_salary_visible": true,
  "has_benefits": true,
  "benefits_summary": "Comprehensive benefits package including health insurance, 401(k)...",
  "healthcare": true,
  "dental_vision": true,
  "retirement_plan": true,
  "paid_time_off": "20 days per year",
  "work_schedule": "Monday to Friday, 9am-5pm",
  "weekly_hours": 40,
  "is_remote": true,
  "remote_type": "hybrid",
  "remote_regions_allowed": "United States",
  "workspace_type": "office",
  "location_city": "San Francisco",
  "location_state": "California",
  "location_country": "USA",
  "location_postal_code": "94105",
  "location_address": "123 Tech Street, San Francisco, CA 94105",
  "openings": 1,
  "deadline": "2023-12-15",
  "apply_type": "direct",
  "status": "published",
  "is_featured": false,
  "is_equal_opportunity": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "id": 2,
    "job_title": "Frontend Developer",
    "slug": "frontend-developer",
    "job_type": "full_time",
    "job_level": "mid_level",
    "company_name": "Tech Innovations Inc.",
    "company_logo": "/uploads/logos/tech-innovations.png",
    "company_website": "https://techinnovations.example.com",
    "company_about": "Leading technology company specializing in innovative solutions.",
    "company_industry": "Information Technology",
    "company_size": "51-200",
    "description": "We are looking for a Frontend Developer to join our team...",
    "responsibilities": "Design and develop user interfaces...",
    "requirements": "3+ years of experience in frontend development...",
    "preferred_skills": "Experience with React, Vue, or Angular...",
    "min_experience": 3,
    "max_experience": 5,
    "education_level": "Bachelor's degree in Computer Science or related field",
    "department": "Engineering",
    "reports_to": "Frontend Lead",
    "team_size": 6,
    "min_salary": 90000,
    "max_salary": 110000,
    "salary_currency": "USD",
    "salary_period": "annually",
    "is_salary_visible": true,
    "has_benefits": true,
    "benefits_summary": "Comprehensive benefits package including health insurance, 401(k)...",
    "healthcare": true,
    "dental_vision": true,
    "retirement_plan": true,
    "paid_time_off": "20 days per year",
    "work_schedule": "Monday to Friday, 9am-5pm",
    "weekly_hours": 40,
    "is_remote": true,
    "remote_type": "hybrid",
    "remote_regions_allowed": "United States",
    "workspace_type": "office",
    "location_city": "San Francisco",
    "location_state": "California",
    "location_country": "USA",
    "location_postal_code": "94105",
    "location_address": "123 Tech Street, San Francisco, CA 94105",
    "openings": 1,
    "deadline": "2023-12-15",
    "apply_type": "direct",
    "status": "published",
    "is_featured": false,
    "is_equal_opportunity": true,
    "created_by": 1,
    "published_at": "2023-10-20T14:25:30.000Z",
    "created_at": "2023-10-20T14:25:30.000Z",
    "updated_at": "2023-10-20T14:25:30.000Z"
  }
}
```

### 6. Update Job (Admin Only)

**URL:** `PUT http://localhost:3001/api/jobs/2`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Payload:**
```json
{
  "job_title": "Senior Frontend Developer",
  "job_level": "senior",
  "min_experience": 5,
  "max_experience": 8,
  "min_salary": 110000,
  "max_salary": 130000,
  "is_featured": true,
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "id": 2,
    "job_title": "Senior Frontend Developer",
    "slug": "senior-frontend-developer",
    "job_level": "senior",
    "min_experience": 5,
    "max_experience": 8,
    "min_salary": 110000,
    "max_salary": 130000,
    "is_featured": true,
    "updated_by": 1,
    "updated_at": "2023-10-21T10:15:45.000Z",
    // ... other fields remain unchanged
  }
}
```

### 7. Change Job Status (Admin Only)

**URL:** `PATCH http://localhost:3001/api/jobs/2/status`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Payload:**
```json
{
  "status": "filled",
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job status changed to filled successfully",
  "data": {
    "id": 2,
    "job_title": "Senior Frontend Developer",
    "status": "filled",
    "updated_by": 1,
    "updated_at": "2023-10-25T16:30:22.000Z",
    // ... other fields remain unchanged
  }
}
```

### 8. Delete Job (Admin Only)

**URL:** `DELETE http://localhost:3001/api/jobs/2`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```
