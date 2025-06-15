'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('employee_roles', [
      // Admin user with Administrator role
      {
        employee_id: 1, // Admin user
        role_id: 1, // Administrator role
        branch_id: null, // Global role
        is_primary: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Manager with Manager role
      {
        employee_id: 2, // Manager user
        role_id: 2, // Manager role
        branch_id: 1, // Head Office
        is_primary: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Staff with Staff role
      {
        employee_id: 3, // Staff user
        role_id: 3, // Staff role
        branch_id: 2, // Branch Office
        is_primary: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Staff with additional role
      {
        employee_id: 3, // Staff user
        role_id: 4, // Another role
        branch_id: 2, // Branch Office
        is_primary: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
    
    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee_roles', null, {});
  }
};
