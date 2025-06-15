'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
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
      is_system: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System roles cannot be modified'
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });    // Add indexes conditionally - handle case where indexes might already exist
    try {
      // Try to create the indexes, if they already exist, this will fail but we'll catch it
      await queryInterface.addIndex('roles', ['is_active'], { name: 'roles_is_active_new' });
      await queryInterface.addIndex('roles', ['is_system'], { name: 'roles_is_system_new' });
      await queryInterface.addIndex('roles', ['branch_id'], { name: 'roles_branch_id_new' });
      await queryInterface.addIndex('roles', ['priority'], { name: 'roles_priority_new' });
    } catch (error) {
      console.log('Some indexes may already exist, continuing with migration:', error.message);
    }
  },
  async down (queryInterface, Sequelize) {
    // Try to remove the indexes first, if they exist
    try {
      await queryInterface.removeIndex('roles', 'roles_is_active_new');
      await queryInterface.removeIndex('roles', 'roles_is_system_new');
      await queryInterface.removeIndex('roles', 'roles_branch_id_new');
      await queryInterface.removeIndex('roles', 'roles_priority_new');
    } catch (error) {
      console.log('Some indexes might not exist, continuing with table drop:', error.message);
    }
    
    await queryInterface.dropTable('roles');
  }
};
