const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let SocialMediaLink;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const socialMediaLinkSchema = new Schema({
    platform_name: {
      type: String,
      required: true,
      trim: true
    },
    platform_code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    url: {
      type: String,
      trim: true,
      default: null
    },
    is_active: {
      type: Boolean,
      default: true
    },
    open_in_new_tab: {
      type: Boolean,
      default: true
    },
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
    collection: 'social_media_links'
  });

  // Add indexes
  socialMediaLinkSchema.index({ platform_code: 1 }, { unique: true });
  socialMediaLinkSchema.index({ is_active: 1 });

  SocialMediaLink = mongoose.model('SocialMediaLink', socialMediaLinkSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  SocialMediaLink = sequelize.define('SocialMediaLink', {
    id: {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    platform_name: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      comment: 'Name of social media platform'
    },
    platform_code: {
      type: Sequelize.DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Unique code for the platform'
    },
    url: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'Full URL to social media profile'
    },
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether to display this social media link'
    },
    open_in_new_tab: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether to open link in new tab'
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
    }
  }, {
    tableName: 'social_media_links',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['platform_code'],
        name: 'platform_code_unique'
      },
      {
        fields: ['is_active'],
        name: 'is_active_idx'
      }
    ]
  });
}

module.exports = SocialMediaLink;
