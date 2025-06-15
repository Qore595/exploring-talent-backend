const db = require('../models');
const { dbType } = require('../config/database');
const GeneralSetting = db.GeneralSetting;

// Get all general settings
exports.getAllGeneralSettings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let settings;
    let total = 0;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      settings = await GeneralSetting.find()
        .skip(offset)
        .limit(parseInt(limit))
        .sort({ created_at: -1 });
      
      total = await GeneralSetting.countDocuments();
    } else {
      // SQL implementation
      const result = await GeneralSetting.findAndCountAll({
        limit: parseInt(limit),
        offset: offset,
        order: [['created_at', 'DESC']]
      });
      
      settings = result.rows;
      total = result.count;
    }
    
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: settings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching general settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch general settings',
      error: error.message
    });
  }
};

// Get general setting by ID
exports.getGeneralSettingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let setting;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      setting = await GeneralSetting.findById(id);
    } else {
      // SQL implementation
      setting = await GeneralSetting.findByPk(id);
    }
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'General setting not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error('Error fetching general setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch general setting',
      error: error.message
    });
  }
};

// Create new general setting
exports.createGeneralSetting = async (req, res) => {
  try {
    const {
      // Core Business Information
      company_name, tagline, email, phone, address, city, state, country,
      zip_code, registration_number, tax_id,
      
      // System Settings
      date_format, time_format, timezone, currency, currency_symbol,
      currency_position, decimal_separator, thousand_separator, decimals,
      default_language,
      
      // Appearance & Branding
      logo, logo_small, favicon, admin_logo, login_background,
      primary_color, secondary_color, accent_color, text_color, bg_color,
      
      // Contact Information
      contact_email, support_email, sales_email, inquiry_email,
      contact_phone, support_phone, fax, office_hours,
      
      // Legal Information
      copyright_text, cookie_notice, cookie_button_text, show_cookie_notice,
      privacy_policy_link, terms_link,
      
      // SEO & Analytics
      site_title, meta_description, meta_keywords,
      google_analytics, google_tag_manager, facebook_pixel,
      
      // Location Settings
      google_maps_key, latitude, longitude, show_map,
      
      // System Status
      maintenance_mode, maintenance_message, enable_registration, enable_user_login,
      
      // Audit Information
      created_by
    } = req.body;
    
    // Validate required fields
    if (!created_by) {
      return res.status(400).json({
        success: false,
        message: 'Created by is required'
      });
    }
    
    let newSetting;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      newSetting = new GeneralSetting({
        // Core Business Information
        company_name, tagline, email, phone, address, city, state, country,
        zip_code, registration_number, tax_id,
        
        // System Settings
        date_format, time_format, timezone, currency, currency_symbol,
        currency_position, decimal_separator, thousand_separator, decimals,
        default_language,
        
        // Appearance & Branding
        logo, logo_small, favicon, admin_logo, login_background,
        primary_color, secondary_color, accent_color, text_color, bg_color,
        
        // Contact Information
        contact_email, support_email, sales_email, inquiry_email,
        contact_phone, support_phone, fax, office_hours,
        
        // Legal Information
        copyright_text, cookie_notice, cookie_button_text, show_cookie_notice,
        privacy_policy_link, terms_link,
        
        // SEO & Analytics
        site_title, meta_description, meta_keywords,
        google_analytics, google_tag_manager, facebook_pixel,
        
        // Location Settings
        google_maps_key, latitude, longitude, show_map,
        
        // System Status
        maintenance_mode, maintenance_message, enable_registration, enable_user_login,
        
        // Audit Information
        created_by
      });
      
      await newSetting.save();
    } else {
      // SQL implementation
      newSetting = await GeneralSetting.create({
        // Core Business Information
        company_name, tagline, email, phone, address, city, state, country,
        zip_code, registration_number, tax_id,
        
        // System Settings
        date_format, time_format, timezone, currency, currency_symbol,
        currency_position, decimal_separator, thousand_separator, decimals,
        default_language,
        
        // Appearance & Branding
        logo, logo_small, favicon, admin_logo, login_background,
        primary_color, secondary_color, accent_color, text_color, bg_color,
        
        // Contact Information
        contact_email, support_email, sales_email, inquiry_email,
        contact_phone, support_phone, fax, office_hours,
        
        // Legal Information
        copyright_text, cookie_notice, cookie_button_text, show_cookie_notice,
        privacy_policy_link, terms_link,
        
        // SEO & Analytics
        site_title, meta_description, meta_keywords,
        google_analytics, google_tag_manager, facebook_pixel,
        
        // Location Settings
        google_maps_key, latitude, longitude, show_map,
        
        // System Status
        maintenance_mode, maintenance_message, enable_registration, enable_user_login,
        
        // Audit Information
        created_by
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'General setting created successfully',
      data: newSetting
    });
  } catch (error) {
    console.error('Error creating general setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create general setting',
      error: error.message
    });
  }
};

// Update general setting
exports.updateGeneralSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { updated_by, ...updateData } = req.body;
    
    // Validate required fields
    if (!updated_by) {
      return res.status(400).json({
        success: false,
        message: 'Updated by is required'
      });
    }
    
    let setting;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      setting = await GeneralSetting.findByIdAndUpdate(
        id,
        { ...updateData, updated_by },
        { new: true }
      );
    } else {
      // SQL implementation
      await GeneralSetting.update(
        { ...updateData, updated_by },
        { where: { id } }
      );
      
      setting = await GeneralSetting.findByPk(id);
    }
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'General setting not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'General setting updated successfully',
      data: setting
    });
  } catch (error) {
    console.error('Error updating general setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update general setting',
      error: error.message
    });
  }
};

// Delete general setting
exports.deleteGeneralSetting = async (req, res) => {
  try {
    const { id } = req.params;
    
    let result;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      result = await GeneralSetting.findByIdAndDelete(id);
    } else {
      // SQL implementation
      result = await GeneralSetting.destroy({ where: { id } });
    }
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'General setting not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'General setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting general setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete general setting',
      error: error.message
    });
  }
};
