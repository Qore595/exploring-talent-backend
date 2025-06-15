const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let EmailTemplate;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const emailTemplateSchema = new Schema({
    template_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      comment: 'Unique template identifier code'
    },
    name: {
      type: String,
      required: true,
      trim: true,
      comment: 'Template name'
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      comment: 'Email subject line'
    },
    body_html: {
      type: String,
      required: true,
      comment: 'HTML content of the email'
    },
    body_text: {
      type: String,
      trim: true,
      default: null,
      comment: 'Plain text version of email'
    },
    variables: {
      type: String,
      trim: true,
      default: null,
      comment: 'Available variables, comma separated'
    },
    email_type: {
      type: String,
      trim: true,
      default: 'transactional',
      comment: 'Email category/type'
    },
    description: {
      type: String,
      trim: true,
      default: null,
      comment: 'Template description and usage notes'
    },
    
    // Status
    is_active: {
      type: Boolean,
      default: true,
      comment: 'Whether template is active'
    },
    is_system: {
      type: Boolean,
      default: false,
      comment: 'System template (cannot be deleted)'
    },
    
    // Config Options
    from_name: {
      type: String,
      trim: true,
      default: null,
      comment: 'Custom sender name (optional)'
    },
    from_email: {
      type: String,
      trim: true,
      default: null,
      comment: 'Custom sender email (optional)'
    },
    reply_to: {
      type: String,
      trim: true,
      default: null,
      comment: 'Reply-to email address'
    },
    cc: {
      type: String,
      trim: true,
      default: null,
      comment: 'CC recipients'
    },
    bcc: {
      type: String,
      trim: true,
      default: null,
      comment: 'BCC recipients'
    },
    
    // Audit
    created_by: {
      type: Number,
      default: null
    },
    updated_by: {
      type: Number,
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
    collection: 'email_templates'
  });

  // Add indexes
  emailTemplateSchema.index({ template_code: 1 }, { unique: true });
  emailTemplateSchema.index({ is_active: 1 });
  emailTemplateSchema.index({ email_type: 1 });

  EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  EmailTemplate = sequelize.define('EmailTemplate', {
    id: {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    template_code: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Unique template identifier code'
    },
    name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      comment: 'Template name'
    },
    subject: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      comment: 'Email subject line'
    },
    body_html: {
      type: Sequelize.DataTypes.TEXT('long'),
      allowNull: false,
      comment: 'HTML content of the email'
    },
    body_text: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      comment: 'Plain text version of email'
    },
    variables: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'Available variables, comma separated'
    },
    email_type: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'transactional',
      comment: 'Email category/type'
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      comment: 'Template description and usage notes'
    },
    
    // Status
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether template is active'
    },
    is_system: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'System template (cannot be deleted)'
    },
    
    // Config Options
    from_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      comment: 'Custom sender name (optional)'
    },
    from_email: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'Custom sender email (optional)'
    },
    reply_to: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'Reply-to email address'
    },
    cc: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'CC recipients'
    },
    bcc: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'BCC recipients'
    },
    
    // Audit
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    updated_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'email_templates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // Enables soft deletes
    indexes: [
      {
        unique: true,
        fields: ['template_code'],
        name: 'template_code_unique'
      },
      {
        fields: ['is_active'],
        name: 'is_active_idx'
      },
      {
        fields: ['email_type'],
        name: 'email_type_idx'
      }
    ]
  });
}

module.exports = EmailTemplate;
