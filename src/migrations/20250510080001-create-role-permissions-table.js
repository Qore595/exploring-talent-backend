'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      perm_cat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permission_categories',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      can_view: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      can_add: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      can_edit: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      can_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'RESTRICT'
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
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'branches',
          key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'Specific branch ID if permission is branch-specific'
      },
      custom_attributes: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional custom permission attributes'
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
      engine: 'InnoDB',
      uniqueKeys: {
        unique_role_perm: {
          fields: ['role_id', 'perm_cat_id', 'branch_id']
        }
      }
    });

    // Add indexes
    await queryInterface.addIndex('role_permissions', ['role_id']);
    await queryInterface.addIndex('role_permissions', ['perm_cat_id']);
    await queryInterface.addIndex('role_permissions', ['branch_id']);
    await queryInterface.addIndex('role_permissions', ['is_active']);
    await queryInterface.addIndex('role_permissions', ['created_by']);
    await queryInterface.addIndex('role_permissions', ['updated_by']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions');
  }
};
