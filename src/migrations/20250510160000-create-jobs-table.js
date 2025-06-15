'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
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
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'User who created the job'
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'SET NULL',
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record last update timestamp'
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp'
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Add indexes
    await queryInterface.addIndex('jobs', ['status'], { name: 'jobs_status_idx' });
    await queryInterface.addIndex('jobs', ['job_type'], { name: 'jobs_job_type_idx' });
    await queryInterface.addIndex('jobs', ['is_featured'], { name: 'jobs_is_featured_idx' });
    await queryInterface.addIndex('jobs', ['created_at'], { name: 'jobs_created_at_idx' });
    await queryInterface.addIndex('jobs', ['deadline'], { name: 'jobs_deadline_idx' });
    await queryInterface.addIndex('jobs', ['location_city', 'location_state', 'location_country'], { name: 'jobs_location_idx' });
    await queryInterface.addIndex('jobs', ['company_name'], { name: 'jobs_company_name_idx' });
    await queryInterface.addIndex('jobs', ['is_remote'], { name: 'jobs_is_remote_idx' });
    await queryInterface.addIndex('jobs', ['education_level'], { name: 'jobs_education_level_idx' });
    await queryInterface.addIndex('jobs', ['min_experience', 'max_experience'], { name: 'jobs_experience_idx' });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('jobs');
  }
};
