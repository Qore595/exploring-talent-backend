'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('talent_spark_configurations', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Related branch identifier',
        references: {
          model: 'branches',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Configuration name for reference'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'UI display title'
      },
      overview: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'UI display description'
      },
      
      // Core Call Configuration
      system_prompt: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Master instruction set for the LLM'
      },
      model: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'LLM identifier (e.g., fixie-ai/ultravox-70B)'
      },
      voice: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'TTS voice ID'
      },
      api_key: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'API key for authentication with the voice/LLM service'
      },
      language_hint: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'en-US',
        comment: 'Primary language for STT (e.g., en-US, es-MX)'
      },
      temperature: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0.70,
        comment: 'LLM randomness/creativity (0.0-2.0)'
      },
      max_duration: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: '600s',
        comment: 'Maximum call duration (e.g., 600s, 10m)'
      },
      time_exceeded_message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Message when max duration is reached'
      },
      
      // Status
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether configuration is active'
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this is the default configuration'
      },
      version: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: '1.0',
        comment: 'Configuration version'
      },
      status: {
        type: Sequelize.ENUM('draft', 'testing', 'production', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Current status'
      },
      
      // Additional Settings
      callback_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Optional webhook for call events'
      },
      analytics_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether to collect analytics'
      },
      additional_settings: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Any additional configuration options'
      },
      
      // Audit
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User who created the configuration'
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User who last updated the configuration'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Creation timestamp'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Update timestamp'
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB',
      comment: 'Created by BollineniRohith123 on 2025-05-12 09:01:43'
    });

    // Add unique constraint
    await queryInterface.addConstraint('talent_spark_configurations', {
      fields: ['branch_id', 'name'],
      type: 'unique',
      name: 'branch_name_unique'
    });

    // Add indexes
    await queryInterface.addIndex('talent_spark_configurations', ['branch_id'], { name: 'branch_id_idx' });
    await queryInterface.addIndex('talent_spark_configurations', ['is_active'], { name: 'is_active_idx' });
    await queryInterface.addIndex('talent_spark_configurations', ['is_default'], { name: 'is_default_idx' });
    await queryInterface.addIndex('talent_spark_configurations', ['status'], { name: 'status_idx' });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('talent_spark_configurations');
  }
};
