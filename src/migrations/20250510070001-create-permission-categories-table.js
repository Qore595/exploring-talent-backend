'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('permission_categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      perm_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permission_groups',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      short_code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      enable_view: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      enable_add: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      enable_edit: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      enable_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'System permissions cannot be modified'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
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
    await queryInterface.addIndex('permission_categories', ['perm_group_id']);
    await queryInterface.addIndex('permission_categories', ['is_active']);
    await queryInterface.addIndex('permission_categories', ['is_system']);
    await queryInterface.addIndex('permission_categories', ['short_code'], { unique: true });
    await queryInterface.addIndex('permission_categories', ['display_order']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('permission_categories');
  }
};
