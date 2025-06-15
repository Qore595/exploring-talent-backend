const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let EmployeeSkill;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const employeeSkillSchema = new Schema({
    employee_id: {
      type: String,
      required: true,
      ref: 'Employee'
    },
    skill_data: {
      type: Object,
      default: null,
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
    deleted_at: {
      type: Date,
      default: null
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'employee_skills'
  });

  // Add indexes
  employeeSkillSchema.index({ employee_id: 1 });
  employeeSkillSchema.index({ 'skill_data.skill_name': 1 });
  employeeSkillSchema.index({ 'skill_data.proficiency_level': 1 });
  employeeSkillSchema.index({ 'skill_data.years_experience': 1 });

  EmployeeSkill = mongoose.model('EmployeeSkill', employeeSkillSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  EmployeeSkill = sequelize.define('EmployeeSkill', {
    id: {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    employee_id: {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Foreign key to employees table',
      references: {
        model: 'employees',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    skill_data: {
      type: Sequelize.DataTypes.JSON,
      allowNull: true,
      comment: 'JSON containing skill information'
    },
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      comment: 'User who created the record',
      references: {
        model: 'employees',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    updated_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      comment: 'User who last updated the record',
      references: {
        model: 'employees',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Record creation time'
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Record update time'
    },
    deleted_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp'
    }
  }, {
    tableName: 'employee_skills',
    timestamps: false,
    paranoid: true,
    deletedAt: 'deleted_at',
    indexes: [
      {
        name: 'employee_id_idx',
        fields: ['employee_id']
      }
    ]
  });
}

module.exports = EmployeeSkill;
