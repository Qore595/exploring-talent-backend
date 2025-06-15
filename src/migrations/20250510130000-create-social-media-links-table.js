'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('social_media_links', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      platform_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Name of social media platform'
      },
      platform_code: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        comment: 'Unique code for the platform'
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Full URL to social media profile'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether to display this social media link'
      },
      open_in_new_tab: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether to open link in new tab'
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
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Add indexes
    await queryInterface.addIndex('social_media_links', ['platform_code'], {
      name: 'platform_code_unique',
      unique: true
    });
    await queryInterface.addIndex('social_media_links', ['is_active'], {
      name: 'is_active_idx'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('social_media_links');
  }
};
