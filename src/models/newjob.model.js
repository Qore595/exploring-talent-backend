const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let NewJob;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const newJobSchema = new Schema({
    job_id: {
      type: Number,
      required: true,
      unique: true
    },
    job_title: {
      type: String,
      required: true,
      trim: true
    },
    job_description: {
      type: String,
      required: true,
      trim: true
    },
    department_id: {
      type: Number,
      required: true,
      ref: 'Department'
    },
    status: {
      type: String,
      default: 'Draft',
      trim: true
    },
    priority: {
      type: String,
      default: 'Medium',
      trim: true
    },
    assigned_to_employee_id: {
      type: Number,
      default: null,
      ref: 'Employee'
    },
    min_salary: {
      type: Number,
      default: null
    },
    max_salary: {
      type: Number,
      default: null
    },
    employment_type: {
      type: String,
      required: true,
      trim: true
    },
    application_deadline: {
      type: Date,
      default: null
    },
    is_remote: {
      type: Boolean,
      default: false
    },
    
    // Profit optimization fields
    client_budget_hourly: {
      type: Number,
      default: null
    },
    internal_budget_hourly: {
      type: Number,
      default: null
    },
    candidate_split_percentage: {
      type: Number,
      default: null
    },
    company_split_percentage: {
      type: Number,
      default: null
    },
    
    // Job details
    requirements: {
      type: String,
      trim: true,
      default: null
    },
    responsibilities: {
      type: String,
      trim: true,
      default: null
    },
    benefits: {
      type: String,
      trim: true,
      default: null
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'newjobtables'
  });
  
  NewJob = mongoose.model('NewJob', newJobSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  NewJob = sequelize.define('newjobtable', {
    job_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Unique identifier for the job'
    },
    job_title: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Title of the job position'
    },
    job_description: {
      type: Sequelize.TEXT,
      allowNull: false,
      comment: 'Detailed description of the job'
    },    department_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'Department this job belongs to',
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.STRING(50),
      defaultValue: 'Draft',
      comment: 'Current status of the job (e.g., Draft, Published, Filled)'
    },
    priority: {
      type: Sequelize.STRING(50),
      defaultValue: 'Medium',
      comment: 'Priority level of filling this position'
    },    assigned_to_employee_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Employee responsible for this job posting',
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    min_salary: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Minimum salary offered for this position'
    },
    max_salary: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Maximum salary offered for this position'
    },
    employment_type: {
      type: Sequelize.STRING(50),
      allowNull: false,
      comment: 'Type of employment (e.g., Full-time, Part-time, Contract)'
    },
    application_deadline: {
      type: Sequelize.DATEONLY,
      allowNull: true,
      comment: 'Deadline for submitting job applications'
    },
    is_remote: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: 'Whether the job can be performed remotely'
    },
    client_budget_hourly: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Hourly budget from client for profit optimization'
    },
    internal_budget_hourly: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Internal hourly budget for profit optimization'
    },
    candidate_split_percentage: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Percentage of profit allocated to candidate'
    },
    company_split_percentage: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Percentage of profit allocated to company'
    },
    requirements: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Specific requirements for the job'
    },
    responsibilities: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Key responsibilities for the job'
    },
    benefits: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Benefits offered with the position'
    },    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Timestamp of when the record was created'
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Timestamp of when the record was last updated'
    }
  }, {
    tableName: 'newjobtables',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['department_id'], name: 'idx_newjobtable_department' },
      { fields: ['assigned_to_employee_id'], name: 'idx_newjobtable_assigned_to' },
      { fields: ['status'], name: 'idx_newjobtable_status' }
    ]  });
}

module.exports = NewJob;
