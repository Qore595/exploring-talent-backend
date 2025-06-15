const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

let EmailConfig;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const emailConfigSchema = new Schema({
    _id: {
      type: String,
      default: () => uuidv4()
    },
    email_type: {
      type: String,
      trim: true,
      comment: 'Type: SMTP, API, etc.'
    },
    smtp_server: {
      type: String,
      trim: true,
      default: null
    },
    smtp_port: {
      type: Number,
      default: null
    },
    smtp_username: {
      type: String,
      trim: true,
      default: null
    },
    smtp_password: {
      type: String,
      trim: true,
      default: null
    },
    ssl_tls: {
      type: String,
      enum: ['none', 'ssl', 'tls'],
      default: 'tls'
    },
    smtp_auth: {
      type: Boolean,
      default: true
    },
    
    // API Configuration
    api_key: {
      type: String,
      trim: true,
      default: null
    },
    api_secret: {
      type: String,
      trim: true,
      default: null
    },
    region: {
      type: String,
      trim: true,
      default: null
    },
    
    // Sender Information
    from_email: {
      type: String,
      trim: true,
      default: null
    },
    from_name: {
      type: String,
      trim: true,
      default: null
    },
    reply_to_email: {
      type: String,
      trim: true,
      default: null
    },
    
    // Status
    is_active: {
      type: Boolean,
      default: false
    },
    is_default: {
      type: Boolean,
      default: false
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
    collection: 'email_configs'
  });

  // Add indexes
  emailConfigSchema.index({ is_active: 1, is_default: 1 });

  // Hash sensitive data before saving
  emailConfigSchema.pre('save', async function(next) {
    if (this.isModified('smtp_password') && this.smtp_password) {
      this.smtp_password = await bcrypt.hash(this.smtp_password, 10);
    }
    if (this.isModified('api_secret') && this.api_secret) {
      this.api_secret = await bcrypt.hash(this.api_secret, 10);
    }
    next();
  });

  EmailConfig = mongoose.model('EmailConfig', emailConfigSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  EmailConfig = sequelize.define('EmailConfig', {
    id: {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    email_type: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      comment: 'Type: SMTP, API, etc.'
    },
    smtp_server: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    smtp_port: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    smtp_username: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    smtp_password: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    ssl_tls: {
      type: Sequelize.DataTypes.ENUM('none', 'ssl', 'tls'),
      defaultValue: 'tls'
    },
    smtp_auth: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    
    // API Configuration
    api_key: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    api_secret: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    region: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    
    // Sender Information
    from_email: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    from_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    reply_to_email: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    
    // Status
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_default: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    tableName: 'email_configs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // Enables soft deletes
    indexes: [
      {
        fields: ['is_active', 'is_default'],
        name: 'is_active_default_idx'
      }
    ],
    hooks: {
      beforeCreate: async (emailConfig) => {
        if (emailConfig.smtp_password) {
          emailConfig.smtp_password = await bcrypt.hash(emailConfig.smtp_password, 10);
        }
        if (emailConfig.api_secret) {
          emailConfig.api_secret = await bcrypt.hash(emailConfig.api_secret, 10);
        }
      },
      beforeUpdate: async (emailConfig) => {
        if (emailConfig.changed('smtp_password') && emailConfig.smtp_password) {
          emailConfig.smtp_password = await bcrypt.hash(emailConfig.smtp_password, 10);
        }
        if (emailConfig.changed('api_secret') && emailConfig.api_secret) {
          emailConfig.api_secret = await bcrypt.hash(emailConfig.api_secret, 10);
        }
      }
    }
  });
}

module.exports = EmailConfig;
