const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let EmployeeInterviewScreening;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
    const employeeInterviewScreeningSchema = new Schema({
    callid: {
      type: String,
      trim: true,
      maxlength: 100
    },
    userid: {
      type: String,
      trim: true,
      maxlength: 100
    },
    joinurl: {
      type: String,
      trim: true
    },
    job_id: {
      type: Number,
      ref: 'Job' // Reference to Job model
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled', 'no_show'],
      default: 'pending'
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: false, // We're managing timestamps manually
    collection: 'employee_interview_screenings'
  });
    // Add indexes for MongoDB
  employeeInterviewScreeningSchema.index({ callid: 1 });
  employeeInterviewScreeningSchema.index({ userid: 1 });
  employeeInterviewScreeningSchema.index({ created: 1 });
  employeeInterviewScreeningSchema.index({ job_id: 1 });
  employeeInterviewScreeningSchema.index({ status: 1 });
  
  // Update the 'updated' field before saving
  employeeInterviewScreeningSchema.pre('save', function(next) {
    this.updated = new Date();
    next();
  });
  
  EmployeeInterviewScreening = mongoose.model('EmployeeInterviewScreening', employeeInterviewScreeningSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  EmployeeInterviewScreening = sequelize.define('EmployeeInterviewScreening', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Unique identifier for the screening record'
    },
    callid: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Unique call identifier for the screening session'
    },
    userid: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'User identifier for the screening participant'
    },
    joinurl: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'URL for joining the screening session'
    },
    created: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Timestamp when the record was created'
    },    updated: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Timestamp when the record was last updated'
    },
    job_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Reference to the job this screening is associated with',
      references: {
        model: 'jobs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'cancelled', 'no_show'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Current status of the interview screening'
    }  }, {
    tableName: 'employee_interview_screenings',
    timestamps: false, // We're managing timestamps manually
    indexes: [
      { fields: ['callid'], name: 'idx_employee_interview_screening_callid' },
      { fields: ['userid'], name: 'idx_employee_interview_screening_userid' },
      { fields: ['created'], name: 'idx_employee_interview_screening_created' },
      { fields: ['job_id'], name: 'idx_employee_interview_screening_job_id' },
      { fields: ['status'], name: 'idx_employee_interview_screening_status' }
    ],
    hooks: {
      beforeUpdate: (instance) => {
        instance.updated = new Date();
      }
    }
  });
  
  // This will be used in eager loading
  const Employee = require('./employee.model');
  
  // Define associations after model is defined
  EmployeeInterviewScreening.associate = (models) => {
    EmployeeInterviewScreening.belongsTo(models.Employee, {
      as: 'employee',
      foreignKey: 'userid',
      targetKey: 'id',  // This will match with employee.id
      constraints: false // This prevents foreign key constraint errors
    });
  };
}

module.exports = EmployeeInterviewScreening;
