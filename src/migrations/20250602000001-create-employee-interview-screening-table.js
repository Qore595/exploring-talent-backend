'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employee_interview_screenings', {
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
      },
      updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp when the record was last updated'
      }
    });

    // Add indices for better query performance
    await queryInterface.addIndex('employee_interview_screenings', ['callid'], {
      name: 'idx_employee_interview_screening_callid'
    });
    
    await queryInterface.addIndex('employee_interview_screenings', ['userid'], {
      name: 'idx_employee_interview_screening_userid'
    });
    
    await queryInterface.addIndex('employee_interview_screenings', ['created'], {
      name: 'idx_employee_interview_screening_created'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('employee_interview_screenings');
  }
};
