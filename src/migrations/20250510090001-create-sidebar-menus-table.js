'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sidebar_menus', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      permission_group_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'permission_groups',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      icon: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      menu: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      activate_menu: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      lang_key: {
        type: Sequelize.STRING(250),
        allowNull: false
      },
      system_level: {
        type: Sequelize.TINYINT(3),
        defaultValue: 0,
        allowNull: true
      },
      level: {
        type: Sequelize.INTEGER(5),
        allowNull: true
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      sidebar_display: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      access_permissions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'System menus cannot be modified'
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
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
    await queryInterface.addIndex('sidebar_menus', ['permission_group_id']);
    await queryInterface.addIndex('sidebar_menus', ['is_active']);
    await queryInterface.addIndex('sidebar_menus', ['is_system']);
    await queryInterface.addIndex('sidebar_menus', ['display_order']);
    await queryInterface.addIndex('sidebar_menus', ['level']);
    await queryInterface.addIndex('sidebar_menus', ['system_level']);
    await queryInterface.addIndex('sidebar_menus', ['sidebar_display']);
    await queryInterface.addIndex('sidebar_menus', ['lang_key']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sidebar_menus');
  }
};
