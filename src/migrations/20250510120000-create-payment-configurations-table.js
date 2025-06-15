'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payment_configurations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      gateway_name: {
        type: Sequelize.STRING(191),
        allowNull: false,
        comment: 'Friendly name of the payment gateway'
      },
      gateway_code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique code identifier for the gateway (stripe, paypal, etc.)'
      },
      live_values: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        comment: 'JSON configuration for live environment'
      },
      test_values: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        comment: 'JSON configuration for test environment'
      },
      mode: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'test',
        comment: 'Current operation mode (live/test)'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this gateway is active'
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Sorting order for multiple active gateways'
      },
      gateway_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Path to gateway logo'
      },
      supports_recurring: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether gateway supports recurring payments'
      },
      supports_refunds: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether gateway supports refunds'
      },
      webhook_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Webhook URL for payment notifications'
      },
      webhook_secret: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Secret for webhook verification'
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
    await queryInterface.addIndex('payment_configurations', ['gateway_code'], {
      name: 'gateway_code_unique',
      unique: true
    });
    await queryInterface.addIndex('payment_configurations', ['is_active', 'priority'], {
      name: 'is_active_priority_idx'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('payment_configurations');
  }
};
