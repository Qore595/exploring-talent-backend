'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'Link to employee if user is staff'
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Null if using only social/OTP auth'
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      profile_image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      // Authentication Methods
      auth_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'password',
        comment: 'Comma-separated list of auth types: password,google,phone_otp'
      },

      // Google Auth Fields
      google_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true
      },
      google_avatar: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      google_refresh_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      // Phone Authentication
      phone_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      phone_verification_code: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      phone_verification_sent_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      phone_verification_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      // Email Verification
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      email_verification_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      email_verification_sent_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      // Security
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      login_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      login_locked_until: {
        type: Sequelize.DATE,
        allowNull: true
      },
      password_reset_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      password_reset_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      remember_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      two_factor_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      two_factor_secret: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      // User Settings
      user_type: {
        type: Sequelize.ENUM('admin', 'staff', 'customer', 'vendor', 'system'),
        allowNull: false,
        defaultValue: 'staff'
      },
      default_branch_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'branches',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      language: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'en'
      },
      timezone: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'UTC'
      },

      // Status
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System users cannot be modified'
      },
      must_change_password: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      // Audit
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Add indexes
    await queryInterface.addIndex('users', ['employee_id']);
    await queryInterface.addIndex('users', ['username']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['google_id']);
    await queryInterface.addIndex('users', ['user_type']);
    await queryInterface.addIndex('users', ['default_branch_id']);
    await queryInterface.addIndex('users', ['is_active']);
    await queryInterface.addIndex('users', ['is_system']);
    await queryInterface.addIndex('users', ['created_by']);
    await queryInterface.addIndex('users', ['updated_by']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
