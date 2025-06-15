'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_interview_calendar_events', {
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
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB',
      comment: 'Created by BollineniRohith123 on 2025-05-12 05:57:49'
    });

    // Add unique constraint
    await queryInterface.addConstraint('user_interview_calendar_events', {
      fields: ['interview_id', 'calendar_type'],
      type: 'unique',
      name: 'interview_calendar_unique'
    });

    // Add indexes
    await queryInterface.addIndex('user_interview_calendar_events', ['event_id'], { name: 'event_id_idx' });
    await queryInterface.addIndex('user_interview_calendar_events', ['sync_status'], { name: 'sync_status_idx' });
    await queryInterface.addIndex('user_interview_calendar_events', ['is_active'], { name: 'is_active_idx' });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_interview_calendar_events');
  }
};
