'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await queryInterface.bulkInsert('permission_groups', [
      {
        name: 'System Administration',
        short_code: 'SYS_ADMIN',
        description: 'System administration permissions',
        is_system: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'User Management',
        short_code: 'USER_MGMT',
        description: 'User management permissions',
        is_system: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Employee Management',
        short_code: 'EMP_MGMT',
        description: 'Employee management permissions',
        is_system: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Branch Management',
        short_code: 'BRANCH_MGMT',
        description: 'Branch management permissions',
        is_system: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Department Management',
        short_code: 'DEPT_MGMT',
        description: 'Department management permissions',
        is_system: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Designation Management',
        short_code: 'DESIG_MGMT',
        description: 'Designation management permissions',
        is_system: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Role Management',
        short_code: 'ROLE_MGMT',
        description: 'Role management permissions',
        is_system: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Permission Management',
        short_code: 'PERM_MGMT',
        description: 'Permission management permissions',
        is_system: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Report Access',
        short_code: 'REPORT_ACCESS',
        description: 'Access to various reports',
        is_system: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Financial Management',
        short_code: 'FIN_MGMT',
        description: 'Financial management permissions',
        is_system: false,
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
    await queryInterface.bulkDelete('permission_groups', null, {});
  }
};
