const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let UserInterviewCalendarEvent;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const userInterviewCalendarEventSchema = new Schema({
    interview_id: {
      type: Number,
      required: true,
      ref: 'UserInterviewSchedule'
    },
    calendar_type: {
      type: String,
      enum: ['google', 'outlook', 'ical', 'other'],
      required: true
    },
    event_id: {
      type: String,
      required: true,
      trim: true
    },
    organizer_id: {
      type: Number,
      default: null
    },
    event_url: {
      type: String,
      trim: true,
      default: null
    },
    sync_status: {
      type: String,
      enum: ['synced', 'out_of_sync', 'failed'],
      default: 'synced'
    },
    is_active: {
      type: Boolean,
      default: true
    },
    last_synced_at: {
      type: Date,
      default: null
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'user_interview_calendar_events'
  });
  
  // Add indexes
  userInterviewCalendarEventSchema.index({ interview_id: 1, calendar_type: 1 }, { unique: true });
  userInterviewCalendarEventSchema.index({ event_id: 1 });
  userInterviewCalendarEventSchema.index({ sync_status: 1 });
  userInterviewCalendarEventSchema.index({ is_active: 1 });
  
  UserInterviewCalendarEvent = mongoose.model('UserInterviewCalendarEvent', userInterviewCalendarEventSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  UserInterviewCalendarEvent = sequelize.define('user_interview_calendar_event', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    interview_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Related user interview',
      references: {
        model: 'user_interview_schedules',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    calendar_type: {
      type: Sequelize.ENUM('google', 'outlook', 'ical', 'other'),
      allowNull: false,
      comment: 'Calendar provider'
    },
    event_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Event ID in external calendar'
    },
    organizer_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'User who created calendar event'
    },
    event_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'URL to calendar event'
    },
    sync_status: {
      type: Sequelize.ENUM('synced', 'out_of_sync', 'failed'),
      allowNull: false,
      defaultValue: 'synced',
      comment: 'Calendar sync status'
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether calendar event is active in the system'
    },
    last_synced_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Last successful sync time'
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Record creation timestamp'
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Record update timestamp'
    }
  }, {
    tableName: 'user_interview_calendar_events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['interview_id', 'calendar_type'],
        name: 'interview_calendar_unique'
      },
      {
        fields: ['event_id'],
        name: 'event_id_idx'
      },
      {
        fields: ['sync_status'],
        name: 'sync_status_idx'
      },
      {
        fields: ['is_active'],
        name: 'is_active_idx'
      }
    ]
  });
}

module.exports = UserInterviewCalendarEvent;
