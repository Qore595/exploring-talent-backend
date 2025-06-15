const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let PermissionGroup;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const permissionGroupSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    short_code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    is_system: {
      type: Boolean,
      default: false,
      required: true
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true
    },
    created_by: {
      type: Number,
      default: null
    },
    updated_by: {
      type: Number,
      default: null
    },
    deleted_at: Date
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'permission_groups'
  });
  
  // Add indexes
  permissionGroupSchema.index({ is_active: 1 });
  permissionGroupSchema.index({ is_system: 1 });
  permissionGroupSchema.index({ short_code: 1 }, { unique: true });
  
  PermissionGroup = mongoose.model('PermissionGroup', permissionGroupSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  PermissionGroup = sequelize.define('PermissionGroup', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    short_code: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    is_system: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'System groups cannot be modified'
    },
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    updated_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    deleted_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'permission_groups',
    timestamps: false,
    indexes: [
      { fields: ['is_active'] },
      { fields: ['is_system'] },
      { fields: ['short_code'], unique: true }
    ]
  });
}

module.exports = PermissionGroup;
