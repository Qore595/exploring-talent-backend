const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let Job;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const jobSchema = new Schema({
    // Basic Job Information
    job_title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    job_type: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'temporary', 'internship', 'remote', 'freelance'],
      default: 'full_time'
    },
    job_level: {
      type: String,
      enum: ['entry', 'associate', 'mid_level', 'senior', 'executive', 'management'],
      default: null
    },
    
    // Company Information (Direct)
    company_name: {
      type: String,
      required: true,
      trim: true
    },
    company_logo: {
      type: String,
      trim: true
    },
    company_website: {
      type: String,
      trim: true
    },
    company_about: {
      type: String,
      trim: true
    },
    company_industry: {
      type: String,
      trim: true
    },
    company_size: {
      type: String,
      trim: true
    },
    
    // Job Details
    description: {
      type: String,
      required: true,
      trim: true
    },
    responsibilities: {
      type: String,
      trim: true
    },
    requirements: {
      type: String,
      trim: true
    },
    preferred_skills: {
      type: String,
      trim: true
    },
    qualification_summary: {
      type: String,
      trim: true
    },
    technical_requirements: {
      type: String,
      trim: true
    },
    min_experience: {
      type: Number,
      default: null
    },
    max_experience: {
      type: Number,
      default: null
    },
    education_level: {
      type: String,
      trim: true
    },
    certification_requirements: {
      type: String,
      trim: true
    },
    
    // Department & Reporting
    department: {
      type: String,
      trim: true
    },
    reports_to: {
      type: String,
      trim: true
    },
    direct_reports: {
      type: Number,
      default: 0
    },
    team_size: {
      type: Number,
      default: null
    },
    
    // Compensation & Benefits
    min_salary: {
      type: Number,
      default: null
    },
    max_salary: {
      type: Number,
      default: null
    },
    salary_currency: {
      type: String,
      default: 'USD',
      trim: true
    },
    salary_period: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'annually'],
      default: 'annually'
    },
    is_salary_visible: {
      type: Boolean,
      default: false
    },
    has_benefits: {
      type: Boolean,
      default: true
    },
    benefits_summary: {
      type: String,
      trim: true
    },
    healthcare: {
      type: Boolean,
      default: null
    },
    dental_vision: {
      type: Boolean,
      default: null
    },
    retirement_plan: {
      type: Boolean,
      default: null
    },
    paid_time_off: {
      type: String,
      trim: true
    },
    equity: {
      type: Boolean,
      default: null
    },
    equity_details: {
      type: String,
      trim: true
    },
    bonus_structure: {
      type: String,
      trim: true
    },
    
    // Work Environment
    work_schedule: {
      type: String,
      trim: true
    },
    weekly_hours: {
      type: Number,
      default: 40
    },
    is_remote: {
      type: Boolean,
      default: false
    },
    remote_type: {
      type: String,
      enum: ['fully_remote', 'hybrid', 'temporary_remote'],
      default: null
    },
    remote_regions_allowed: {
      type: String,
      trim: true
    },
    workspace_type: {
      type: String,
      enum: ['office', 'coworking', 'field', 'home'],
      default: 'office'
    },
    travel_required: {
      type: String,
      trim: true
    },
    relocation_assistance: {
      type: Boolean,
      default: false
    },
    work_environment: {
      type: String,
      trim: true
    },
    dress_code: {
      type: String,
      trim: true
    },
    is_flexible_hours: {
      type: Boolean,
      default: false
    },
    
    // Location
    location_city: {
      type: String,
      trim: true
    },
    location_state: {
      type: String,
      trim: true
    },
    location_country: {
      type: String,
      trim: true
    },
    location_postal_code: {
      type: String,
      trim: true
    },
    location_address: {
      type: String,
      trim: true
    },
    is_multiple_locations: {
      type: Boolean,
      default: false
    },
    
    // Application Process
    openings: {
      type: Number,
      default: 1
    },
    deadline: {
      type: Date,
      default: null
    },
    application_instructions: {
      type: String,
      trim: true
    },
    apply_type: {
      type: String,
      enum: ['direct', 'external', 'email'],
      default: 'direct'
    },
    external_apply_url: {
      type: String,
      trim: true
    },
    apply_email: {
      type: String,
      trim: true
    },
    screening_questions_count: {
      type: Number,
      default: 0
    },
    has_assessment: {
      type: Boolean,
      default: false
    },
    assessment_details: {
      type: String,
      trim: true
    },
    interview_process: {
      type: String,
      trim: true
    },
    estimated_hiring_timeline: {
      type: String,
      trim: true
    },
    
    // Diversity & Inclusion
    is_equal_opportunity: {
      type: Boolean,
      default: true
    },
    diversity_commitment: {
      type: String,
      trim: true
    },
    accommodations: {
      type: String,
      trim: true
    },
    is_visa_sponsored: {
      type: Boolean,
      default: false
    },
    is_veteran_friendly: {
      type: Boolean,
      default: false
    },
    
    // Contact Information
    contact_name: {
      type: String,
      trim: true
    },
    contact_title: {
      type: String,
      trim: true
    },
    contact_email: {
      type: String,
      trim: true
    },
    contact_phone: {
      type: String,
      trim: true
    },
    contact_availability: {
      type: String,
      trim: true
    },
    
    // Job Posting Metadata
    status: {
      type: String,
      enum: ['draft', 'published', 'filled', 'expired', 'canceled'],
      default: 'draft'
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    is_confidential: {
      type: Boolean,
      default: false
    },
    is_urgent: {
      type: Boolean,
      default: false
    },
    is_internal: {
      type: Boolean,
      default: false
    },
    internal_job_id: {
      type: String,
      trim: true
    },
    reference_code: {
      type: String,
      trim: true
    },
    repost_count: {
      type: Number,
      default: 0
    },
    original_post_date: {
      type: Date,
      default: null
    },
    
    // SEO & Marketing
    meta_title: {
      type: String,
      trim: true
    },
    meta_description: {
      type: String,
      trim: true
    },
    meta_keywords: {
      type: String,
      trim: true
    },
    seo_canonical_url: {
      type: String,
      trim: true
    },
    social_share_image: {
      type: String,
      trim: true
    },
    promotional_text: {
      type: String,
      trim: true
    },
    
    // Analytics & Tracking
    views_count: {
      type: Number,
      default: 0
    },
    applications_count: {
      type: Number,
      default: 0
    },
    qualified_applications_count: {
      type: Number,
      default: 0
    },
    shares_count: {
      type: Number,
      default: 0
    },
    referral_source: {
      type: String,
      trim: true
    },
    tracking_pixel: {
      type: String,
      trim: true
    },
    utm_source: {
      type: String,
      trim: true
    },
    utm_medium: {
      type: String,
      trim: true
    },
    utm_campaign: {
      type: String,
      trim: true
    },
    
    // Audit Information
    created_by: {
      type: Number,
      default: null
    },
    updated_by: {
      type: Number,
      default: null
    },
    published_at: {
      type: Date,
      default: null
    },
    expires_at: {
      type: Date,
      default: null
    },
    deleted_at: {
      type: Date,
      default: null
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'jobs'
  });
  
  Job = mongoose.model('Job', jobSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  Job = sequelize.define('job', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    // Basic Job Information
    job_title: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Job position title'
    },
    slug: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'URL-friendly job title'
    },
    job_type: {
      type: Sequelize.ENUM('full_time', 'part_time', 'contract', 'temporary', 'internship', 'remote', 'freelance'),
      allowNull: false,
      defaultValue: 'full_time',
      comment: 'Type of employment'
    },
    job_level: {
      type: Sequelize.ENUM('entry', 'associate', 'mid_level', 'senior', 'executive', 'management'),
      allowNull: true,
      comment: 'Experience level'
    },
    
    // Company Information (Direct)
    company_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Name of hiring company'
    },
    company_logo: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Path to company logo'
    },
    company_website: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Company website URL'
    },
    company_about: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Brief description of the company'
    },
    company_industry: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Industry of the company'
    },
    company_size: {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Size of the company (e.g., 1-10, 11-50, etc.)'
    },
    
    // Job Details
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      comment: 'Full job description'
    },
    responsibilities: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Job responsibilities'
    },
    requirements: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Job requirements'
    },
    preferred_skills: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Preferred but not required skills'
    },
    qualification_summary: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Summary of ideal qualifications'
    },
    technical_requirements: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Technical skills and tools required'
    },
    min_experience: {
      type: Sequelize.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Minimum years of experience'
    },
    max_experience: {
      type: Sequelize.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Maximum years of experience'
    },
    education_level: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Required education level'
    },
    certification_requirements: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Required professional certifications'
    },
    
    // Department & Reporting
    department: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Department this position belongs to'
    },
    reports_to: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Position this role reports to'
    },
    direct_reports: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Number of direct reports for this position'
    },
    team_size: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Size of team this position is part of'
    },
    
    // Compensation & Benefits
    min_salary: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Minimum salary offered'
    },
    max_salary: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Maximum salary offered'
    },
    salary_currency: {
      type: Sequelize.STRING(3),
      allowNull: true,
      defaultValue: 'USD',
      comment: 'Currency code for salary'
    },
    salary_period: {
      type: Sequelize.ENUM('hourly', 'daily', 'weekly', 'monthly', 'annually'),
      allowNull: true,
      defaultValue: 'annually',
      comment: 'Salary period'
    },
    is_salary_visible: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether salary is visible to applicants'
    },
    has_benefits: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: 'Whether position includes benefits'
    },
    benefits_summary: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Summary of benefits offered'
    },
    healthcare: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: 'Provides healthcare benefits'
    },
    dental_vision: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: 'Provides dental/vision benefits'
    },
    retirement_plan: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: 'Provides retirement plan'
    },
    paid_time_off: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'PTO policy summary'
    },
    equity: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      comment: 'Includes equity compensation'
    },
    equity_details: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Details about equity offering'
    },
    bonus_structure: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Information about bonuses or incentives'
    },
    
    // Work Environment
    work_schedule: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Work schedule details'
    },
    weekly_hours: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 40,
      comment: 'Expected weekly hours'
    },
    is_remote: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether job allows remote work'
    },
    remote_type: {
      type: Sequelize.ENUM('fully_remote', 'hybrid', 'temporary_remote'),
      allowNull: true,
      comment: 'Type of remote work'
    },
    remote_regions_allowed: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Regions eligible for remote work'
    },
    workspace_type: {
      type: Sequelize.ENUM('office', 'coworking', 'field', 'home'),
      allowNull: true,
      defaultValue: 'office',
      comment: 'Primary workspace type'
    },
    travel_required: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Travel expectations (e.g., 10%, quarterly)'
    },
    relocation_assistance: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether relocation assistance is provided'
    },
    work_environment: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Description of work environment'
    },
    dress_code: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Dress code policy'
    },
    is_flexible_hours: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether flexible hours are allowed'
    },
    
    // Location
    location_city: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'City of job location'
    },
    location_state: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'State/province of job location'
    },
    location_country: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Country of job location'
    },
    location_postal_code: {
      type: Sequelize.STRING(20),
      allowNull: true,
      comment: 'Postal/ZIP code of job location'
    },
    location_address: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Full address of job location'
    },
    is_multiple_locations: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether job is available in multiple locations'
    },
    
    // Application Process
    openings: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: 'Number of positions available'
    },
    deadline: {
      type: Sequelize.DATEONLY,
      allowNull: true,
      comment: 'Application deadline'
    },
    application_instructions: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Special instructions for applicants'
    },
    apply_type: {
      type: Sequelize.ENUM('direct', 'external', 'email'),
      allowNull: false,
      defaultValue: 'direct',
      comment: 'How to apply for the job'
    },
    external_apply_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'External application URL'
    },
    apply_email: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Email to send applications to'
    },
    screening_questions_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Number of screening questions'
    },
    has_assessment: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether job requires skills assessment'
    },
    assessment_details: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Information about skills assessment'
    },
    interview_process: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Description of interview process'
    },
    estimated_hiring_timeline: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Expected time to fill position'
    },
    
    // Diversity & Inclusion
    is_equal_opportunity: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: 'Is an equal opportunity employer'
    },
    diversity_commitment: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Statement on diversity and inclusion'
    },
    accommodations: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Information about workplace accommodations'
    },
    is_visa_sponsored: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether visa sponsorship is available'
    },
    is_veteran_friendly: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether veterans are encouraged to apply'
    },
    
    // Contact Information
    contact_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Name of contact person'
    },
    contact_title: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Title of contact person'
    },
    contact_email: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Email of contact person'
    },
    contact_phone: {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Phone of contact person'
    },
    contact_availability: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'When contact person is available'
    },
    
    // Job Posting Metadata
    status: {
      type: Sequelize.ENUM('draft', 'published', 'filled', 'expired', 'canceled'),
      allowNull: false,
      defaultValue: 'draft',
      comment: 'Job posting status'
    },
    is_featured: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether job is featured/highlighted'
    },
    is_confidential: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether company name is hidden'
    },
    is_urgent: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether position is urgent to fill'
    },
    is_internal: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether job is for internal applicants only'
    },
    internal_job_id: {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Internal reference number'
    },
    reference_code: {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'External reference code'
    },
    repost_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Number of times job has been reposted'
    },
    original_post_date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
      comment: 'Date job was first posted'
    },
    
    // SEO & Marketing
    meta_title: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Custom meta title for SEO'
    },
    meta_description: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Custom meta description for SEO'
    },
    meta_keywords: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Custom meta keywords for SEO'
    },
    seo_canonical_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Canonical URL for SEO'
    },
    social_share_image: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Image for social sharing'
    },
    promotional_text: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Special promotional message'
    },
    
    // Analytics & Tracking
    views_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of job views'
    },
    applications_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of applications received'
    },
    qualified_applications_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Number of qualified applications'
    },
    shares_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Number of social shares'
    },
    referral_source: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'How job was sourced'
    },
    tracking_pixel: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Tracking code for analytics'
    },
    utm_source: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'UTM source parameter'
    },
    utm_medium: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'UTM medium parameter'
    },
    utm_campaign: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'UTM campaign parameter'
    },
    
    // Audit Information
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'User who created the job'
    },
    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'User who last updated the job'
    },
    published_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'When job was published'
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'When job automatically expires'
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Record creation timestamp'
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      comment: 'Record last update timestamp'
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp'
    }
  }, {
    tableName: 'jobs',
    timestamps: false,
    indexes: [
      { fields: ['status'] },
      { fields: ['job_type'] },
      { fields: ['is_featured'] },
      { fields: ['created_at'] },
      { fields: ['deadline'] },
      { fields: ['location_city', 'location_state', 'location_country'] },
      { fields: ['company_name'] },
      { fields: ['is_remote'] },
      { fields: ['education_level'] },
      { fields: ['min_experience', 'max_experience'] }
    ]
  });
}

module.exports = Job;
