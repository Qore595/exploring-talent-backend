const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let EmployeeInterviewSchedule;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const employeeInterviewScheduleSchema = new Schema({
    employee_id: {
      type: Number,
      required: true,
      ref: 'Employee'
    },
    job_id: {
      type: Number,
      required: true,
      ref: 'Job'
    },
    
    // Interview Details
    title: {
      type: String,
      required: true,
      trim: true
    },
    round: {
      type: Number,
      default: 1
    },
    interview_type: {
      type: String,
      enum: ['performance_review', 'promotion', 'disciplinary', 'one_on_one', 'team_review', 'exit', 'training', 'mentorship', 'project_review', 'hr_meeting'],
      required: true
    },
    
    // Scheduling Information
    scheduled_date: {
      type: Date,
      required: true
    },
    start_time: {
      type: String,
      required: true
    },
    end_time: {
      type: String,
      required: true
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    
    // Location
    is_virtual: {
      type: Boolean,
      default: true
    },
    location: {
      type: String,
      default: null
    },
    meeting_link: {
      type: String,
      default: null
    },
    meeting_id: {
      type: String,
      default: null
    },
    meeting_password: {
      type: String,
      default: null
    },
    meeting_provider: {
      type: String,
      default: null
    },
    
    // Status
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'rescheduled', 'completed', 'canceled', 'no_show'],
      default: 'scheduled'
    },
    employee_confirmed: {
      type: Boolean,
      default: false
    },
    confirmation_date: {
      type: Date,
      default: null
    },
    is_active: {
      type: Boolean,
      default: true
    },
    
    // Interview Details
    preparation_instructions: {
      type: String,
      default: null
    },
    interviewer_instructions: {
      type: String,
      default: null
    },
    assessment_criteria: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: null
    },
    
    // Outcome
    decision: {
      type: String,
      enum: ['pending', 'positive', 'negative', 'action_required', 'follow_up_needed', 'no_decision'],
      default: 'pending'
    },
    decision_reason: {
      type: String,
      default: null
    },
    next_steps: {
      type: String,
      default: null
    },
    
    // Reminders
    reminder_sent: {
      type: Boolean,
      default: false
    },
    reminder_sent_at: {
      type: Date,
      default: null
    },
    
    // Audit
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
    collection: 'employee_interview_schedules'
  });
  
  // Add indexes
  employeeInterviewScheduleSchema.index({ employee_id: 1 });
  employeeInterviewScheduleSchema.index({ job_id: 1 });
  employeeInterviewScheduleSchema.index({ scheduled_date: 1 });
  employeeInterviewScheduleSchema.index({ status: 1 });
  employeeInterviewScheduleSchema.index({ decision: 1 });
  employeeInterviewScheduleSchema.index({ round: 1 });
  employeeInterviewScheduleSchema.index({ interview_type: 1 });
  employeeInterviewScheduleSchema.index({ is_active: 1 });
  
  EmployeeInterviewSchedule = mongoose.model('EmployeeInterviewSchedule', employeeInterviewScheduleSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  EmployeeInterviewSchedule = sequelize.define('employee_interview_schedule', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    employee_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Related employee'
    },
    job_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Job position'
    },
    
    // Interview Details
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Interview title/purpose'
    },
    round: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Interview round number'
    },
    interview_type: {
      type: Sequelize.ENUM('performance_review', 'promotion', 'disciplinary', 'one_on_one', 'team_review', 'exit', 'training', 'mentorship', 'project_review', 'hr_meeting'),
      allowNull: false,
      comment: 'Type of interview'
    },
    
    // Scheduling Information
    scheduled_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      comment: 'Interview date'
    },
    start_time: {
      type: Sequelize.TIME,
      allowNull: false,
      comment: 'Start time'
    },
    end_time: {
      type: Sequelize.TIME,
      allowNull: false,
      comment: 'End time'
    },
    duration_minutes: {
      type: Sequelize.VIRTUAL,
      get() {
        const start = new Date(`${this.scheduled_date}T${this.start_time}`);
        const end = new Date(`${this.scheduled_date}T${this.end_time}`);
        return Math.round((end - start) / 60000);
      }
    },
    timezone: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'UTC',
      comment: 'Interview timezone'
    },
    
    // Location
    is_virtual: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Virtual or in-person'
    },
    location: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Physical location if in-person'
    },
    meeting_link: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Virtual meeting URL'
    },
    meeting_id: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Virtual meeting ID'
    },
    meeting_password: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Meeting password/pin'
    },
    meeting_provider: {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Provider (Zoom, Teams, etc.)'
    },
    
    // Status
    status: {
      type: Sequelize.ENUM('scheduled', 'confirmed', 'rescheduled', 'completed', 'canceled', 'no_show'),
      allowNull: false,
      defaultValue: 'scheduled',
      comment: 'Current status'
    },
    employee_confirmed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Employee confirmed attendance'
    },
    confirmation_date: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'When employee confirmed'
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether interview is active in the system'
    },
    
    // Interview Details
    preparation_instructions: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Instructions for employee'
    },
    interviewer_instructions: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Instructions for interviewers'
    },
    assessment_criteria: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Criteria to evaluate'
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'General notes'
    },
    
    // Outcome
    decision: {
      type: Sequelize.ENUM('pending', 'positive', 'negative', 'action_required', 'follow_up_needed', 'no_decision'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Final decision'
    },
    decision_reason: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Reasoning for decision'
    },
    next_steps: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Next steps if any'
    },
    
    // Reminders
    reminder_sent: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Reminder has been sent'
    },
    reminder_sent_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'When reminder was sent'
    },
    
    // Audit
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'User who created the interview'
    },
    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'User who last updated the interview'
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Created timestamp'
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Updated timestamp'
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp'
    }
  }, {
    tableName: 'employee_interview_schedules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // Enables soft deletes
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['job_id'] },
      { fields: ['scheduled_date'] },
      { fields: ['status'] },
      { fields: ['decision'] },
      { fields: ['round'] },
      { fields: ['interview_type'] },
      { fields: ['is_active'] }
    ]
  });
}

module.exports = EmployeeInterviewSchedule;
