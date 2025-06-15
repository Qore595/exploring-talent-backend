'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sms_templates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      template_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      template_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'e.g., otp, order_confirmation, etc.'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Template with placeholders like {OTP}, {NAME}'
      },
      variables: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'List of variables used in template'
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'general',
        comment: 'Template category for organization'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      character_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'For SMS segment calculation'
      },
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
    await queryInterface.addIndex('sms_templates', ['template_code'], {
      name: 'template_code_unique',
      unique: true
    });
    await queryInterface.addIndex('sms_templates', ['category'], {
      name: 'category_idx'
    });
    await queryInterface.addIndex('sms_templates', ['is_active'], {
      name: 'is_active_idx'
    });

    // Add trigger for character_count calculation (MySQL specific)
    if (queryInterface.sequelize.options.dialect === 'mysql') {
      await queryInterface.sequelize.query(`
        CREATE TRIGGER before_sms_template_insert
        BEFORE INSERT ON sms_templates
        FOR EACH ROW
        SET NEW.character_count = CHAR_LENGTH(NEW.content);
      `);

      await queryInterface.sequelize.query(`
        CREATE TRIGGER before_sms_template_update
        BEFORE UPDATE ON sms_templates
        FOR EACH ROW
        SET NEW.character_count = CHAR_LENGTH(NEW.content);
      `);
    }
  },

  async down (queryInterface, Sequelize) {
    // Drop triggers if MySQL
    if (queryInterface.sequelize.options.dialect === 'mysql') {
      await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS before_sms_template_insert;`);
      await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS before_sms_template_update;`);
    }
    
    await queryInterface.dropTable('sms_templates');
  }
};
