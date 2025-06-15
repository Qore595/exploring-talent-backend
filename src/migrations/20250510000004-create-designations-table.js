'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('designations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'branches',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      short_code: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Note: We're not adding a foreign key reference to users here
        // since the users table doesn't exist in the current schema
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
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB',
      uniqueKeys: {
        unique_designation_branch: {
          fields: ['name', 'branch_id']
        }
      }
    });

    // Add indexes
    await queryInterface.addIndex('designations', ['is_active']);
    await queryInterface.addIndex('designations', ['branch_id']);
    await queryInterface.addIndex('designations', ['short_code']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('designations');
  }
};
