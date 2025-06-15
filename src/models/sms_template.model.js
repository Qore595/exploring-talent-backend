const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

let SmsTemplate;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;

  const smsTemplateSchema = new Schema({
    _id: {
      type: String,
      default: () => uuidv4()
    },
    template_name: {
      type: String,
      required: true,
      trim: true
    },
    template_code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    variables: {
      type: String,
      trim: true,
      default: null
    },
    category: {
      type: String,
      default: 'general',
      trim: true
    },
    is_active: {
      type: Boolean,
      default: true
    },
    character_count: {
      type: Number,
      // In MongoDB, we'll calculate this on save
    },
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
    collection: 'sms_templates'
  });

  // Add indexes
  smsTemplateSchema.index({ template_code: 1 }, { unique: true });
  smsTemplateSchema.index({ category: 1 });
  smsTemplateSchema.index({ is_active: 1 });

  // Pre-save hook to calculate character count
  smsTemplateSchema.pre('save', function(next) {
    if (this.content) {
      this.character_count = this.content.length;
    }
    next();
  });

  SmsTemplate = mongoose.model('SmsTemplate', smsTemplateSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  SmsTemplate = sequelize.define('SmsTemplate', {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    template_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    template_code: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'e.g., otp, order_confirmation, etc.'
    },
    content: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
      comment: 'Template with placeholders like {OTP}, {NAME}'
    },
    variables: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'List of variables used in template'
    },
    category: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'general',
      comment: 'Template category for organization'
    },
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    character_count: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      comment: 'For SMS segment calculation'
    },
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
      allowNull: true,
      comment: 'Soft delete timestamp'
    }
  }, {
    tableName: 'sms_templates',
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
        fields: ['category'],
        name: 'category_idx'
      },
      {
        fields: ['is_active'],
        name: 'is_active_idx'
      }
    ],
    hooks: {
      beforeCreate: (template) => {
        if (template.content) {
          template.character_count = template.content.length;
        }
      },
      beforeUpdate: (template) => {
        if (template.content) {
          template.character_count = template.content.length;
        }
      }
    }
  });
}

module.exports = SmsTemplate;
