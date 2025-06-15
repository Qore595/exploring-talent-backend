'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('permission_groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      is_system: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'System groups cannot be modified'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
        // We'll add the foreign key constraint after the table is created
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true
        // We'll add the foreign key constraint after the table is created
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
    await queryInterface.addIndex('permission_groups', ['is_active']);
    await queryInterface.addIndex('permission_groups', ['is_system']);
    await queryInterface.addIndex('permission_groups', ['short_code'], { unique: true });

    // Check if employees table exists before adding foreign key constraints
    const tables = await queryInterface.showAllTables();
    if (tables.includes('employees')) {
      // Add foreign key constraints
      await queryInterface.addConstraint('permission_groups', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_permission_groups_created_by',
        references: {
          table: 'employees',
          field: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      await queryInterface.addConstraint('permission_groups', {
        fields: ['updated_by'],
        type: 'foreign key',
        name: 'fk_permission_groups_updated_by',
        references: {
          table: 'employees',
          field: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // Remove foreign key constraints if they exist
    try {
      await queryInterface.removeConstraint('permission_groups', 'fk_permission_groups_created_by');
      await queryInterface.removeConstraint('permission_groups', 'fk_permission_groups_updated_by');
    } catch (error) {
      console.log('Foreign key constraints might not exist:', error.message);
    }

    await queryInterface.dropTable('permission_groups');
  }
};


