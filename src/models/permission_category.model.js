const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let PermissionCategory;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const permissionCategorySchema = new Schema({
    perm_group_id: {
      type: Number,
      required: true
    },
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
    enable_view: {
      type: Boolean,
      default: false,
      required: true
    },
    enable_add: {
      type: Boolean,
      default: false,
      required: true
    },
    enable_edit: {
      type: Boolean,
      default: false,
      required: true
    },
    enable_delete: {
      type: Boolean,
      default: false,
      required: true
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
    display_order: {
      type: Number,
      default: 0,
      required: true
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'permission_categories'
  });
  
  // Add indexes
  permissionCategorySchema.index({ perm_group_id: 1 });
  permissionCategorySchema.index({ is_active: 1 });
  permissionCategorySchema.index({ is_system: 1 });
  permissionCategorySchema.index({ short_code: 1 }, { unique: true });
  permissionCategorySchema.index({ display_order: 1 });
  
  PermissionCategory = mongoose.model('PermissionCategory', permissionCategorySchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  PermissionCategory = sequelize.define('PermissionCategory', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    perm_group_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
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
    enable_view: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    enable_add: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    enable_edit: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    enable_delete: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_system: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'System permissions cannot be modified'
    },
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    display_order: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
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
    }
  }, {
    tableName: 'permission_categories',
    timestamps: false,
    indexes: [
      { fields: ['perm_group_id'] },
      { fields: ['is_active'] },
      { fields: ['is_system'] },
      { fields: ['short_code'], unique: true },
      { fields: ['display_order'] }
    ]
  });
}

module.exports = PermissionCategory;
