'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_skills', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'Foreign key to users table'
      },
      skill_data: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'JSON containing skill information'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User who created the record'
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'User who last updated the record'
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
    await queryInterface.addIndex('user_skills', ['user_id'], {
      name: 'user_id_idx'
    });

    // Add JSON indexes
    // Note: These will only work in MySQL 5.7+ or MariaDB 10.2.3+
    try {
      await queryInterface.sequelize.query(`
        ALTER TABLE user_skills
        ADD INDEX skill_name_idx ((CAST(JSON_EXTRACT(skill_data, '$.skill_name') AS CHAR(100))))
      `);

      await queryInterface.sequelize.query(`
        ALTER TABLE user_skills
        ADD INDEX proficiency_idx ((CAST(JSON_EXTRACT(skill_data, '$.proficiency_level') AS CHAR(20))))
      `);

      await queryInterface.sequelize.query(`
        ALTER TABLE user_skills
        ADD INDEX years_idx ((CAST(JSON_EXTRACT(skill_data, '$.years_experience') AS DECIMAL(3,1))))
      `);
    } catch (error) {
      console.warn('Warning: Could not create JSON indexes. This is expected if your database does not support JSON indexing.');
      console.warn(error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_skills');
  }
};
