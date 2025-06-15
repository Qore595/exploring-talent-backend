'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Employee ID'
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Hashed password'
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      photo: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'branches',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'departments',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      designation_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'designations',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      position: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      qualification: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      work_experience: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      hire_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      date_of_leaving: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      employment_status: {
        type: Sequelize.ENUM('full-time', 'part-time', 'contract', 'intern', 'terminated'),
        defaultValue: 'full-time',
        allowNull: true
      },
      contract_type: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      work_shift: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      current_location: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      reporting_to: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      emergency_contact: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      emergency_contact_relation: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      marital_status: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      father_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      mother_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      local_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      permanent_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      bank_account_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      bank_account_no: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      bank_branch: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      ifsc_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      basic_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      facebook: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      twitter: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      linkedin: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      instagram: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      resume: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      joining_letter: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      other_documents: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_superadmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Superadmin has access to all branches'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Add indexes
    await queryInterface.addIndex('employees', ['employee_id']);
    await queryInterface.addIndex('employees', ['email']);
    await queryInterface.addIndex('employees', ['branch_id']);
    await queryInterface.addIndex('employees', ['department_id']);
    await queryInterface.addIndex('employees', ['designation_id']);
    await queryInterface.addIndex('employees', ['reporting_to']);
    await queryInterface.addIndex('employees', ['employment_status']);
    await queryInterface.addIndex('employees', ['is_active']);
    await queryInterface.addIndex('employees', ['is_superadmin']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};
