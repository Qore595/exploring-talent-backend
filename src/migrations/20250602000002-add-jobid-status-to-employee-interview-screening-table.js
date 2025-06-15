'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add jobID column (INTEGER with foreign key reference to jobs table)    await queryInterface.addColumn('employee_interview_screenings', 'job_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Reference to the job this screening is associated with'
      // Removing the foreign key constraint for now
      // references: {
      //   model: 'jobs',
      //   key: 'id'
      // },
      // onUpdate: 'CASCADE',
      // onDelete: 'SET NULL'
    });

    // Add status column with enumerated values
    await queryInterface.addColumn('employee_interview_screenings', 'status', {
      type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'cancelled', 'no_show'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Current status of the interview screening'
    });

    // Add index on job_id for better query performance
    await queryInterface.addIndex('employee_interview_screenings', ['job_id'], {
      name: 'idx_employee_interview_screening_job_id'
    });
    
    // Add index on status for better query performance
    await queryInterface.addIndex('employee_interview_screenings', ['status'], {
      name: 'idx_employee_interview_screening_status'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indices
    await queryInterface.removeIndex('employee_interview_screenings', 'idx_employee_interview_screening_job_id');
    await queryInterface.removeIndex('employee_interview_screenings', 'idx_employee_interview_screening_status');
    
    // Remove columns
    await queryInterface.removeColumn('employee_interview_screenings', 'job_id');
    await queryInterface.removeColumn('employee_interview_screenings', 'status');

    // Drop the enum type after removing the column
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_employee_interview_screenings_status;');
  }
};
