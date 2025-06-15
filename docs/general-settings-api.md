# General Settings API

This API allows you to manage general settings for the system.

## API URLs and Payloads

### 1. Get All General Settings

**URL:** `GET http://localhost:3001/api/general-settings?page=1&limit=10`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters:**
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company_name": "Talent Spark",
      "tagline": "Empowering HR Solutions",
      "email": "info@talentspark.com",
      "phone": "+1-555-123-4567",
      "address": "123 Business Avenue",
      "city": "San Francisco",
      "state": "California",
      "country": "USA",
      "zip_code": "94105",
      "registration_number": "BRN12345678",
      "tax_id": "TAX987654321",
      "date_format": "Y-m-d",
      "time_format": "H:i:s",
      "timezone": "America/Los_Angeles",
      "currency": "USD",
      "currency_symbol": "$",
      "currency_position": "before",
      "decimal_separator": ".",
      "thousand_separator": ",",
      "decimals": 2,
      "default_language": "en",
      "logo": "/uploads/logo.png",
      "logo_small": "/uploads/logo-small.png",
      "favicon": "/uploads/favicon.ico",
      "admin_logo": "/uploads/admin-logo.png",
      "login_background": "/uploads/login-bg.jpg",
      "primary_color": "#3498db",
      "secondary_color": "#2c3e50",
      "accent_color": "#e74c3c",
      "text_color": "#333333",
      "bg_color": "#ffffff",
      "contact_email": "contact@talentspark.com",
      "support_email": "support@talentspark.com",
      "sales_email": "sales@talentspark.com",
      "inquiry_email": "inquiries@talentspark.com",
      "contact_phone": "+1-555-123-4567",
      "support_phone": "+1-555-987-6543",
      "fax": "+1-555-456-7890",
      "office_hours": "Monday-Friday: 9am-5pm PST",
      "copyright_text": "© 2023 Talent Spark. All rights reserved.",
      "cookie_notice": "We use cookies to enhance your experience.",
      "cookie_button_text": "Accept",
      "show_cookie_notice": true,
      "privacy_policy_link": "/privacy-policy",
      "terms_link": "/terms-of-service",
      "site_title": "Talent Spark - HR Management System",
      "meta_description": "Comprehensive HR management solution for businesses of all sizes.",
      "meta_keywords": "HR, human resources, talent management, employee management",
      "google_analytics": "UA-12345678-9",
      "google_tag_manager": "GTM-ABCDEF",
      "facebook_pixel": "123456789012345",
      "google_maps_key": "AIzaSyA_EXAMPLE_KEY",
      "latitude": "37.7749",
      "longitude": "-122.4194",
      "show_map": true,
      "maintenance_mode": false,
      "maintenance_message": "We're currently performing maintenance. Please check back soon.",
      "enable_registration": true,
      "enable_user_login": true,
      "created_by": 1,
      "updated_by": null,
      "created_at": "2023-07-15T10:30:45.000Z",
      "updated_at": "2023-07-15T10:30:45.000Z"
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

### 2. Get General Setting by ID

**URL:** `GET http://localhost:3001/api/general-settings/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "Talent Spark",
    "tagline": "Empowering HR Solutions",
    "email": "info@talentspark.com",
    "phone": "+1-555-123-4567",
    "address": "123 Business Avenue",
    "city": "San Francisco",
    "state": "California",
    "country": "USA",
    "zip_code": "94105",
    "registration_number": "BRN12345678",
    "tax_id": "TAX987654321",
    "date_format": "Y-m-d",
    "time_format": "H:i:s",
    "timezone": "America/Los_Angeles",
    "currency": "USD",
    "currency_symbol": "$",
    "currency_position": "before",
    "decimal_separator": ".",
    "thousand_separator": ",",
    "decimals": 2,
    "default_language": "en",
    "logo": "/uploads/logo.png",
    "logo_small": "/uploads/logo-small.png",
    "favicon": "/uploads/favicon.ico",
    "admin_logo": "/uploads/admin-logo.png",
    "login_background": "/uploads/login-bg.jpg",
    "primary_color": "#3498db",
    "secondary_color": "#2c3e50",
    "accent_color": "#e74c3c",
    "text_color": "#333333",
    "bg_color": "#ffffff",
    "contact_email": "contact@talentspark.com",
    "support_email": "support@talentspark.com",
    "sales_email": "sales@talentspark.com",
    "inquiry_email": "inquiries@talentspark.com",
    "contact_phone": "+1-555-123-4567",
    "support_phone": "+1-555-987-6543",
    "fax": "+1-555-456-7890",
    "office_hours": "Monday-Friday: 9am-5pm PST",
    "copyright_text": "© 2023 Talent Spark. All rights reserved.",
    "cookie_notice": "We use cookies to enhance your experience.",
    "cookie_button_text": "Accept",
    "show_cookie_notice": true,
    "privacy_policy_link": "/privacy-policy",
    "terms_link": "/terms-of-service",
    "site_title": "Talent Spark - HR Management System",
    "meta_description": "Comprehensive HR management solution for businesses of all sizes.",
    "meta_keywords": "HR, human resources, talent management, employee management",
    "google_analytics": "UA-12345678-9",
    "google_tag_manager": "GTM-ABCDEF",
    "facebook_pixel": "123456789012345",
    "google_maps_key": "AIzaSyA_EXAMPLE_KEY",
    "latitude": "37.7749",
    "longitude": "-122.4194",
    "show_map": true,
    "maintenance_mode": false,
    "maintenance_message": "We're currently performing maintenance. Please check back soon.",
    "enable_registration": true,
    "enable_user_login": true,
    "created_by": 1,
    "updated_by": null,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T10:30:45.000Z"
  }
}
```

### 3. Create General Setting

**URL:** `POST http://localhost:3001/api/general-settings`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Payload:**
```json
{
  "company_name": "Talent Spark",
  "tagline": "Empowering HR Solutions",
  "email": "info@talentspark.com",
  "phone": "+1-555-123-4567",
  "address": "123 Business Avenue",
  "city": "San Francisco",
  "state": "California",
  "country": "USA",
  "zip_code": "94105",
  "registration_number": "BRN12345678",
  "tax_id": "TAX987654321",
  "date_format": "Y-m-d",
  "time_format": "H:i:s",
  "timezone": "America/Los_Angeles",
  "currency": "USD",
  "currency_symbol": "$",
  "currency_position": "before",
  "decimal_separator": ".",
  "thousand_separator": ",",
  "decimals": 2,
  "default_language": "en",
  "logo": "/uploads/logo.png",
  "logo_small": "/uploads/logo-small.png",
  "favicon": "/uploads/favicon.ico",
  "admin_logo": "/uploads/admin-logo.png",
  "login_background": "/uploads/login-bg.jpg",
  "primary_color": "#3498db",
  "secondary_color": "#2c3e50",
  "accent_color": "#e74c3c",
  "text_color": "#333333",
  "bg_color": "#ffffff",
  "contact_email": "contact@talentspark.com",
  "support_email": "support@talentspark.com",
  "sales_email": "sales@talentspark.com",
  "inquiry_email": "inquiries@talentspark.com",
  "contact_phone": "+1-555-123-4567",
  "support_phone": "+1-555-987-6543",
  "fax": "+1-555-456-7890",
  "office_hours": "Monday-Friday: 9am-5pm PST",
  "copyright_text": "© 2023 Talent Spark. All rights reserved.",
  "cookie_notice": "We use cookies to enhance your experience.",
  "cookie_button_text": "Accept",
  "show_cookie_notice": true,
  "privacy_policy_link": "/privacy-policy",
  "terms_link": "/terms-of-service",
  "site_title": "Talent Spark - HR Management System",
  "meta_description": "Comprehensive HR management solution for businesses of all sizes.",
  "meta_keywords": "HR, human resources, talent management, employee management",
  "google_analytics": "UA-12345678-9",
  "google_tag_manager": "GTM-ABCDEF",
  "facebook_pixel": "123456789012345",
  "google_maps_key": "AIzaSyA_EXAMPLE_KEY",
  "latitude": "37.7749",
  "longitude": "-122.4194",
  "show_map": true,
  "maintenance_mode": false,
  "maintenance_message": "We're currently performing maintenance. Please check back soon.",
  "enable_registration": true,
  "enable_user_login": true,
  "created_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "General setting created successfully",
  "data": {
    "id": 1,
    "company_name": "Talent Spark",
    "tagline": "Empowering HR Solutions",
    "email": "info@talentspark.com",
    "phone": "+1-555-123-4567",
    "address": "123 Business Avenue",
    "city": "San Francisco",
    "state": "California",
    "country": "USA",
    "zip_code": "94105",
    "registration_number": "BRN12345678",
    "tax_id": "TAX987654321",
    "date_format": "Y-m-d",
    "time_format": "H:i:s",
    "timezone": "America/Los_Angeles",
    "currency": "USD",
    "currency_symbol": "$",
    "currency_position": "before",
    "decimal_separator": ".",
    "thousand_separator": ",",
    "decimals": 2,
    "default_language": "en",
    "logo": "/uploads/logo.png",
    "logo_small": "/uploads/logo-small.png",
    "favicon": "/uploads/favicon.ico",
    "admin_logo": "/uploads/admin-logo.png",
    "login_background": "/uploads/login-bg.jpg",
    "primary_color": "#3498db",
    "secondary_color": "#2c3e50",
    "accent_color": "#e74c3c",
    "text_color": "#333333",
    "bg_color": "#ffffff",
    "contact_email": "contact@talentspark.com",
    "support_email": "support@talentspark.com",
    "sales_email": "sales@talentspark.com",
    "inquiry_email": "inquiries@talentspark.com",
    "contact_phone": "+1-555-123-4567",
    "support_phone": "+1-555-987-6543",
    "fax": "+1-555-456-7890",
    "office_hours": "Monday-Friday: 9am-5pm PST",
    "copyright_text": "© 2023 Talent Spark. All rights reserved.",
    "cookie_notice": "We use cookies to enhance your experience.",
    "cookie_button_text": "Accept",
    "show_cookie_notice": true,
    "privacy_policy_link": "/privacy-policy",
    "terms_link": "/terms-of-service",
    "site_title": "Talent Spark - HR Management System",
    "meta_description": "Comprehensive HR management solution for businesses of all sizes.",
    "meta_keywords": "HR, human resources, talent management, employee management",
    "google_analytics": "UA-12345678-9",
    "google_tag_manager": "GTM-ABCDEF",
    "facebook_pixel": "123456789012345",
    "google_maps_key": "AIzaSyA_EXAMPLE_KEY",
    "latitude": "37.7749",
    "longitude": "-122.4194",
    "show_map": true,
    "maintenance_mode": false,
    "maintenance_message": "We're currently performing maintenance. Please check back soon.",
    "enable_registration": true,
    "enable_user_login": true,
    "created_by": 1,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T10:30:45.000Z"
  }
}
```

### 4. Update General Setting

**URL:** `PUT http://localhost:3001/api/general-settings/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Payload:**
```json
{
  "company_name": "Talent Spark Inc.",
  "tagline": "Empowering HR Solutions Worldwide",
  "primary_color": "#4287f5",
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "General setting updated successfully",
  "data": {
    "id": 1,
    "company_name": "Talent Spark Inc.",
    "tagline": "Empowering HR Solutions Worldwide",
    "email": "info@talentspark.com",
    "phone": "+1-555-123-4567",
    "address": "123 Business Avenue",
    "city": "San Francisco",
    "state": "California",
    "country": "USA",
    "zip_code": "94105",
    "registration_number": "BRN12345678",
    "tax_id": "TAX987654321",
    "date_format": "Y-m-d",
    "time_format": "H:i:s",
    "timezone": "America/Los_Angeles",
    "currency": "USD",
    "currency_symbol": "$",
    "currency_position": "before",
    "decimal_separator": ".",
    "thousand_separator": ",",
    "decimals": 2,
    "default_language": "en",
    "logo": "/uploads/logo.png",
    "logo_small": "/uploads/logo-small.png",
    "favicon": "/uploads/favicon.ico",
    "admin_logo": "/uploads/admin-logo.png",
    "login_background": "/uploads/login-bg.jpg",
    "primary_color": "#4287f5",
    "secondary_color": "#2c3e50",
    "accent_color": "#e74c3c",
    "text_color": "#333333",
    "bg_color": "#ffffff",
    "contact_email": "contact@talentspark.com",
    "support_email": "support@talentspark.com",
    "sales_email": "sales@talentspark.com",
    "inquiry_email": "inquiries@talentspark.com",
    "contact_phone": "+1-555-123-4567",
    "support_phone": "+1-555-987-6543",
    "fax": "+1-555-456-7890",
    "office_hours": "Monday-Friday: 9am-5pm PST",
    "copyright_text": "© 2023 Talent Spark. All rights reserved.",
    "cookie_notice": "We use cookies to enhance your experience.",
    "cookie_button_text": "Accept",
    "show_cookie_notice": true,
    "privacy_policy_link": "/privacy-policy",
    "terms_link": "/terms-of-service",
    "site_title": "Talent Spark - HR Management System",
    "meta_description": "Comprehensive HR management solution for businesses of all sizes.",
    "meta_keywords": "HR, human resources, talent management, employee management",
    "google_analytics": "UA-12345678-9",
    "google_tag_manager": "GTM-ABCDEF",
    "facebook_pixel": "123456789012345",
    "google_maps_key": "AIzaSyA_EXAMPLE_KEY",
    "latitude": "37.7749",
    "longitude": "-122.4194",
    "show_map": true,
    "maintenance_mode": false,
    "maintenance_message": "We're currently performing maintenance. Please check back soon.",
    "enable_registration": true,
    "enable_user_login": true,
    "created_by": 1,
    "updated_by": 1,
    "created_at": "2023-07-15T10:30:45.000Z",
    "updated_at": "2023-07-15T11:45:22.000Z"
  }
}
```

### 5. Delete General Setting

**URL:** `DELETE http://localhost:3001/api/general-settings/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "General setting deleted successfully"
}
```
