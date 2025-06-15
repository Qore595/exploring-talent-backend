'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('branches', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      landmark: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      postal_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      alt_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      fax: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      manager_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location_lat: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      location_lng: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      google_maps_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      working_hours: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      timezone: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      logo_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      website_url: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      support_email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      support_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      branch_type: {
        type: Sequelize.ENUM('head_office', 'regional', 'franchise', 'warehouse'),
        defaultValue: 'regional',
        allowNull: true
      },
      opening_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      last_renovated: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      monthly_rent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      owned_or_rented: {
        type: Sequelize.ENUM('owned', 'rented'),
        defaultValue: 'owned',
        allowNull: true
      },
      no_of_employees: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      fire_safety_certified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      is_default: {
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
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    });

    // Add indexes
    // Note: We're not adding indexes here because they're already defined in the table schema
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('branches');
  }
};
