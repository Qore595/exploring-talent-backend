'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Administrator',
        slug: 'administrator',
        description: 'System administrator with full access',
        branch_id: null,
        is_system: true,
        priority: 100,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Branch Manager',
        slug: 'branch-manager',
        description: 'Manager of a specific branch',
        branch_id: 1,
        is_system: false,
        priority: 50,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Staff Member',
        slug: 'staff-member',
        description: 'Regular staff member with limited access',
        branch_id: 1,
        is_system: false,
        priority: 10,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
