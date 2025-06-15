'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('general_settings', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      // Core Business Information
      company_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Legal company name'
      },
      tagline: {
        type: Sequelize.STRING(200),
        allowNull: true,
        comment: 'Company slogan or tagline'
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Primary email address'
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Primary phone number'
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Company address'
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Company city'
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Company state/province'
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Company country'
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Postal/zip code'
      },
      registration_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Business registration number'
      },
      tax_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Tax identification number'
      },
      
      // System Settings
      date_format: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'Y-m-d',
        comment: 'PHP date format string'
      },
      time_format: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'H:i:s',
        comment: 'PHP time format string'
      },
      timezone: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'UTC',
        comment: 'System timezone'
      },
      currency: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Default currency code'
      },
      currency_symbol: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: '$',
        comment: 'Currency symbol'
      },
      currency_position: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'before',
        comment: 'Currency symbol position (before/after)'
      },
      decimal_separator: {
        type: Sequelize.STRING(1),
        allowNull: true,
        defaultValue: '.',
        comment: 'Decimal point separator'
      },
      thousand_separator: {
        type: Sequelize.STRING(1),
        allowNull: true,
        defaultValue: ',',
        comment: 'Thousands separator'
      },
      decimals: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 2,
        comment: 'Number of decimal places'
      },
      default_language: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: 'en',
        comment: 'Default system language'
      },
      
      // Appearance & Branding
      logo: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Path to main logo'
      },
      logo_small: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Path to small/mobile logo'
      },
      favicon: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Path to favicon'
      },
      admin_logo: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Path to admin panel logo'
      },
      login_background: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Path to login page background'
      },
      primary_color: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: '#3498db',
        comment: 'Primary brand color (hex)'
      },
      secondary_color: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: '#2c3e50',
        comment: 'Secondary brand color (hex)'
      },
      accent_color: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: '#e74c3c',
        comment: 'Accent color for buttons/links (hex)'
      },
      text_color: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: '#333333',
        comment: 'Default text color (hex)'
      },
      bg_color: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: '#ffffff',
        comment: 'Default background color (hex)'
      },
      
      // Contact Information
      contact_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Public contact email'
      },
      support_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Support email address'
      },
      sales_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Sales email address'
      },
      inquiry_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'General inquiries email'
      },
      contact_phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Contact phone number'
      },
      support_phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Support phone number'
      },
      fax: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Fax number'
      },
      office_hours: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Office hours text'
      },
      
      // Legal Information
      copyright_text: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Copyright notice for footer'
      },
      cookie_notice: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Cookie consent notice text'
      },
      cookie_button_text: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'Accept',
        comment: 'Cookie accept button text'
      },
      show_cookie_notice: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Whether to show cookie notice'
      },
      privacy_policy_link: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Link to privacy policy'
      },
      terms_link: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Link to terms of service'
      },
      
      // SEO & Analytics
      site_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Default meta title'
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Default meta description'
      },
      meta_keywords: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Default meta keywords'
      },
      google_analytics: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Google Analytics ID'
      },
      google_tag_manager: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Google Tag Manager ID'
      },
      facebook_pixel: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Facebook Pixel ID'
      },
      
      // Location Settings
      google_maps_key: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Google Maps API key'
      },
      latitude: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Office latitude for map'
      },
      longitude: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Office longitude for map'
      },
      show_map: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Whether to show map on contact page'
      },
      
      // System Status
      maintenance_mode: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
        comment: 'Enable maintenance mode'
      },
      maintenance_message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Maintenance mode message'
      },
      enable_registration: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Allow new user registration'
      },
      enable_user_login: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        comment: 'Allow user login'
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
        comment: 'User who created the record'
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'User who last updated the record'
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
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('general_settings');
  }
};
