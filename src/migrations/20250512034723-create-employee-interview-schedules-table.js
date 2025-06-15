'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('employee_interview_schedules', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Related employee',
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      job_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'Job position',
        references: {
          model: 'jobs',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB',
      comment: 'Created by BollineniRohith123 on 2025-05-12 03:47:23'
    });

    // Add indexes
    await queryInterface.addIndex('employee_interview_schedules', ['employee_id'], { name: 'employee_id_idx' });
    await queryInterface.addIndex('employee_interview_schedules', ['job_id'], { name: 'job_id_idx' });
    await queryInterface.addIndex('employee_interview_schedules', ['scheduled_date'], { name: 'scheduled_date_idx' });
    await queryInterface.addIndex('employee_interview_schedules', ['status'], { name: 'status_idx' });
    await queryInterface.addIndex('employee_interview_schedules', ['decision'], { name: 'decision_idx' });
    await queryInterface.addIndex('employee_interview_schedules', ['round'], { name: 'round_idx' });
    await queryInterface.addIndex('employee_interview_schedules', ['interview_type'], { name: 'interview_type_idx' });
    await queryInterface.addIndex('employee_interview_schedules', ['is_active'], { name: 'is_active_idx' });

    // Add duration_minutes virtual column for MySQL
    if (queryInterface.sequelize.options.dialect === 'mysql') {
      await queryInterface.sequelize.query(`
        ALTER TABLE employee_interview_schedules
        ADD COLUMN duration_minutes INT GENERATED ALWAYS AS
        (TIMESTAMPDIFF(MINUTE, CONCAT(scheduled_date, ' ', start_time), CONCAT(scheduled_date, ' ', end_time))) STORED
        COMMENT 'Duration in minutes';
      `);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('employee_interview_schedules');
  }
};
