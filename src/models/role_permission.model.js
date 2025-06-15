const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let RolePermission;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const rolePermissionSchema = new Schema({
    role_id: {
      type: Number,
      required: true
    },
    perm_cat_id: {
      type: Number,
      required: true
    },
    can_view: {
      type: Boolean,
      default: false,
      required: true
    },
    can_add: {
      type: Boolean,
      default: false,
      required: true
    },
    can_edit: {
      type: Boolean,
      default: false,
      required: true
    },
    can_delete: {
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
      required: true
    },
    updated_by: {
      type: Number,
      default: null
    },
    branch_id: {
      type: Number,
      default: null
    },
    custom_attributes: {
      type: Object,
      default: null
    },
    deleted_at: Date
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'role_permissions'
  });
  
  // Add indexes
  rolePermissionSchema.index({ role_id: 1 });
  rolePermissionSchema.index({ perm_cat_id: 1 });
  rolePermissionSchema.index({ branch_id: 1 });
  rolePermissionSchema.index({ is_active: 1 });
  rolePermissionSchema.index({ created_by: 1 });
  rolePermissionSchema.index({ updated_by: 1 });
  rolePermissionSchema.index({ role_id: 1, perm_cat_id: 1, branch_id: 1 }, { unique: true });
  
  RolePermission = mongoose.model('RolePermission', rolePermissionSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  RolePermission = sequelize.define('RolePermission', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    perm_cat_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    can_view: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    can_add: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    can_edit: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    can_delete: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    updated_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    branch_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      comment: 'Specific branch ID if permission is branch-specific'
    },
    custom_attributes: {
      type: Sequelize.DataTypes.JSON,
      allowNull: true,
      comment: 'Additional custom permission attributes'
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
    tableName: 'role_permissions',
    timestamps: false,
    indexes: [
      { fields: ['role_id'] },
      { fields: ['perm_cat_id'] },
      { fields: ['branch_id'] },
      { fields: ['is_active'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
      { fields: ['role_id', 'perm_cat_id', 'branch_id'], unique: true }
    ]
  });
}

module.exports = RolePermission;
