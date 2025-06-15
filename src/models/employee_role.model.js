const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let EmployeeRole;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const employeeRoleSchema = new Schema({
    employee_id: {
      type: Number,
      required: true
    },
    role_id: {
      type: Number,
      required: true
    },
    branch_id: {
      type: Number,
      default: null
    },
    is_primary: {
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
    collection: 'employee_roles'
  });
  
  // Add indexes
  employeeRoleSchema.index({ employee_id: 1 });
  employeeRoleSchema.index({ role_id: 1 });
  employeeRoleSchema.index({ branch_id: 1 });
  employeeRoleSchema.index({ is_primary: 1 });
  employeeRoleSchema.index({ is_active: 1 });
  employeeRoleSchema.index({ employee_id: 1, role_id: 1, branch_id: 1 }, { unique: true });
  
  EmployeeRole = mongoose.model('EmployeeRole', employeeRoleSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  EmployeeRole = sequelize.define('EmployeeRole', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employee_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    role_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    branch_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      comment: 'If role is limited to specific branch'
    },
    is_primary: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Primary role for this employee'
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
    tableName: 'employee_roles',
    timestamps: false,
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['role_id'] },
      { fields: ['branch_id'] },
      { fields: ['is_primary'] },
      { fields: ['is_active'] },
      { 
        fields: ['employee_id', 'role_id', 'branch_id'],
        unique: true,
        name: 'unique_employee_role_branch'
      }
    ]
  });
}

module.exports = EmployeeRole;
