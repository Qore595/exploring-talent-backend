const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let GeneralSetting;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const generalSettingSchema = new Schema({
    // Core Business Information
    company_name: {
      type: String,
      trim: true
    },
    tagline: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    zip_code: {
      type: String,
      trim: true
    },
    registration_number: {
      type: String,
      trim: true
    },
    tax_id: {
      type: String,
      trim: true
    },
    
    // System Settings
    date_format: {
      type: String,
      default: 'Y-m-d',
      required: true
    },
    time_format: {
      type: String,
      default: 'H:i:s',
      required: true
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    currency: {
      type: String,
      default: 'USD',
      required: true
    },
    currency_symbol: {
      type: String,
      default: '$',
      required: true
    },
    currency_position: {
      type: String,
      default: 'before',
      required: true
    },
    decimal_separator: {
      type: String,
      default: '.',
      trim: true
    },
    thousand_separator: {
      type: String,
      default: ',',
      trim: true
    },
    decimals: {
      type: Number,
      default: 2
    },
    default_language: {
      type: String,
      default: 'en'
    },
    
    // Appearance & Branding
    logo: {
      type: String,
      trim: true
    },
    logo_small: {
      type: String,
      trim: true
    },
    favicon: {
      type: String,
      trim: true
    },
    admin_logo: {
      type: String,
      trim: true
    },
    login_background: {
      type: String,
      trim: true
    },
    primary_color: {
      type: String,
      default: '#3498db'
    },
    secondary_color: {
      type: String,
      default: '#2c3e50'
    },
    accent_color: {
      type: String,
      default: '#e74c3c'
    },
    text_color: {
      type: String,
      default: '#333333'
    },
    bg_color: {
      type: String,
      default: '#ffffff'
    },
    
    // Contact Information
    contact_email: {
      type: String,
      trim: true
    },
    support_email: {
      type: String,
      trim: true
    },
    sales_email: {
      type: String,
      trim: true
    },
    inquiry_email: {
      type: String,
      trim: true
    },
    contact_phone: {
      type: String,
      trim: true
    },
    support_phone: {
      type: String,
      trim: true
    },
    fax: {
      type: String,
      trim: true
    },
    office_hours: {
      type: String,
      trim: true
    },
    
    // Legal Information
    copyright_text: {
      type: String,
      trim: true
    },
    cookie_notice: {
      type: String,
      trim: true
    },
    cookie_button_text: {
      type: String,
      default: 'Accept'
    },
    show_cookie_notice: {
      type: Boolean,
      default: true
    },
    privacy_policy_link: {
      type: String,
      trim: true
    },
    terms_link: {
      type: String,
      trim: true
    },
    
    // SEO & Analytics
    site_title: {
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
    google_analytics: {
      type: String,
      trim: true
    },
    google_tag_manager: {
      type: String,
      trim: true
    },
    facebook_pixel: {
      type: String,
      trim: true
    },
    
    // Location Settings
    google_maps_key: {
      type: String,
      trim: true
    },
    latitude: {
      type: String,
      trim: true
    },
    longitude: {
      type: String,
      trim: true
    },
    show_map: {
      type: Boolean,
      default: true
    },
    
    // System Status
    maintenance_mode: {
      type: Boolean,
      default: false
    },
    maintenance_message: {
      type: String,
      trim: true
    },
    enable_registration: {
      type: Boolean,
      default: true
    },
    enable_user_login: {
      type: Boolean,
      default: true
    },
    
    // Audit Information
    created_by: {
      type: Number,
      default: null
    },
    updated_by: {
      type: Number,
      default: null
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'general_settings'
  });
  
  GeneralSetting = mongoose.model('GeneralSetting', generalSettingSchema);
} else {
  // Sequelize Model
  GeneralSetting = sequelize.define('general_setting', {
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
      comment: 'User who created the record'
    },
    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      comment: 'Record last update timestamp'
    }
  }, {
    tableName: 'general_settings',
    timestamps: false
  });
}

module.exports = GeneralSetting;
