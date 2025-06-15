'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('email_configs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      email_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Type: SMTP, API, etc.'
      },
      smtp_server: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      smtp_port: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      smtp_username: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      smtp_password: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      ssl_tls: {
        type: Sequelize.ENUM('none', 'ssl', 'tls'),
        defaultValue: 'tls'
      },
      smtp_auth: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      api_key: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      api_secret: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      region: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      from_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      from_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      reply_to_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        }
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        }
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
        allowNull: true,
        comment: 'Soft delete timestamp'
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Add indexes
    await queryInterface.addIndex('email_configs', ['is_active', 'is_default'], {
      name: 'is_active_default_idx'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('email_configs');
  }
};
