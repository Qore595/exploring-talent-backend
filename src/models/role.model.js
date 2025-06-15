const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let Role;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;

  const roleSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    branch_id: {
      type: Number,
      default: null
    },
    is_system: {
      type: Boolean,
      default: false,
      required: true
    },
    priority: {
      type: Number,
      default: 0
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
    collection: 'roles'
  });

  // Add indexes
  roleSchema.index({ is_active: 1 });
  roleSchema.index({ is_system: 1 });
  roleSchema.index({ branch_id: 1 });
  roleSchema.index({ priority: 1 });

  Role = mongoose.model('Role', roleSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  Role = sequelize.define('Role', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    slug: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    branch_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    is_system: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    priority: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
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
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // Enable soft deletes
    indexes: [
      { fields: ['is_active'] },
      { fields: ['is_system'] },
      { fields: ['branch_id'] },
      { fields: ['priority'] }
    ]
  });
}

module.exports = Role;





