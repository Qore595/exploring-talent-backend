'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('email_templates', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      template_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique template identifier code'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Template name'
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Email subject line'
      },
      body_html: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
        comment: 'HTML content of the email'
      },
      body_text: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Plain text version of email'
      },
      variables: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Available variables, comma separated'
      },
      email_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'transactional',
        comment: 'Email category/type'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Template description and usage notes'
      },
      
      // Status
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether template is active'
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System template (cannot be deleted)'
      },
      
      // Config Options
      from_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Custom sender name (optional)'
      },
      from_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Custom sender email (optional)'
      },
      reply_to: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Reply-to email address'
      },
      cc: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'CC recipients'
      },
      bcc: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'BCC recipients'
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
        allowNull: true,
        comment: 'Soft delete timestamp'
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Add indexes
    await queryInterface.addIndex('email_templates', ['template_code'], {
      name: 'template_code_unique',
      unique: true
    });
    await queryInterface.addIndex('email_templates', ['is_active'], {
      name: 'is_active_idx'
    });
    await queryInterface.addIndex('email_templates', ['email_type'], {
      name: 'email_type_idx'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('email_templates');
  }
};
