const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let Department;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const departmentSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    branch_id: {
      type: Number,
      default: null
    },
    short_code: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true
    },
    created_by: {
      type: Number,
      required: true
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'departments'
  });
  
  // Add indexes
  departmentSchema.index({ is_active: 1 });
  departmentSchema.index({ branch_id: 1 });
  departmentSchema.index({ short_code: 1 });
  departmentSchema.index({ name: 1, branch_id: 1 }, { unique: true });
  
  Department = mongoose.model('Department', departmentSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  Department = sequelize.define('Department', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.DataTypes.STRING(200),
      allowNull: false
    },
    branch_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    short_code: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
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
    tableName: 'departments',
    timestamps: false,
    indexes: [
      { fields: ['is_active'] },
      { fields: ['branch_id'] },
      { fields: ['short_code'] },
      { 
        fields: ['name', 'branch_id'],
        unique: true,
        name: 'unique_department_branch'
      }
    ]
  });
}

module.exports = Department;
