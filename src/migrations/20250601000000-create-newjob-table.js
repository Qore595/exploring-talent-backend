'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('newjobtables', {
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
      },      department_id: {
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
      },      assigned_to_employee_id: {
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
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp of when the record was created'
      },      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp of when the record was last updated'
      }
    });

    // Add indices for better query performance
    await queryInterface.addIndex('newjobtables', ['department_id'], {
      name: 'idx_newjobtable_department'
    });
    
    await queryInterface.addIndex('newjobtables', ['assigned_to_employee_id'], {
      name: 'idx_newjobtable_assigned_to'
    });
    
    await queryInterface.addIndex('newjobtables', ['status'], {
      name: 'idx_newjobtable_status'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('newjobtables');
  }
};
