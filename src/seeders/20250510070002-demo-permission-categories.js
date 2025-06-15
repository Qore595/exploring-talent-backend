'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('permission_categories', [
      // System Administration Group (ID: 1)
      {
        perm_group_id: 1,
        name: 'User Management',
        short_code: 'USER_MGMT',
        description: 'Manage system users',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        perm_group_id: 1,
        name: 'Role Management',
        short_code: 'ROLE_MGMT',
        description: 'Manage user roles',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        perm_group_id: 1,
        name: 'Permission Management',
        short_code: 'PERM_MGMT',
        description: 'Manage permissions',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        perm_group_id: 1,
        name: 'System Settings',
        short_code: 'SYS_SETTINGS',
        description: 'Manage system settings',
        enable_view: true,
        enable_add: false,
        enable_edit: true,
        enable_delete: false,
        is_system: true,
        is_active: true,
        display_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // User Management Group (ID: 2)
      {
        perm_group_id: 2,
        name: 'User Profiles',
        short_code: 'USER_PROFILES',
        description: 'Manage user profiles',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: false,
        is_system: true,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        perm_group_id: 2,
        name: 'User Permissions',
        short_code: 'USER_PERMS',
        description: 'Manage user permissions',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Employee Management Group (ID: 3)
      {
        perm_group_id: 3,
        name: 'Employee Records',
        short_code: 'EMP_RECORDS',
        description: 'Manage employee records',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        perm_group_id: 3,
        name: 'Employee Attendance',
        short_code: 'EMP_ATTENDANCE',
        description: 'Manage employee attendance',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: false,
        is_system: false,
        is_active: true,
        display_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        perm_group_id: 3,
        name: 'Employee Leave',
        short_code: 'EMP_LEAVE',
        description: 'Manage employee leave',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: false,
        is_system: false,
        is_active: true,
        display_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Branch Management Group (ID: 4)
      {
        perm_group_id: 4,
        name: 'Branch Operations',
        short_code: 'BRANCH_OPS',
        description: 'Manage branch operations',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Department Management Group (ID: 5)
      {
        perm_group_id: 5,
        name: 'Department Operations',
        short_code: 'DEPT_OPS',
        description: 'Manage department operations',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Designation Management Group (ID: 6)
      {
        perm_group_id: 6,
        name: 'Designation Operations',
        short_code: 'DESIG_OPS',
        description: 'Manage designation operations',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Role Management Group (ID: 7)
      {
        perm_group_id: 7,
        name: 'Role Operations',
        short_code: 'ROLE_OPS',
        description: 'Manage role operations',
        enable_view: true,
        enable_add: true,
        enable_edit: true,
        enable_delete: true,
        is_system: true,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Report Access Group (ID: 9)
      {
        perm_group_id: 9,
        name: 'Employee Reports',
        short_code: 'EMP_REPORTS',
        description: 'Access to employee reports',
        enable_view: true,
        enable_add: false,
        enable_edit: false,
        enable_delete: false,
        is_system: false,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        perm_group_id: 9,
        name: 'Financial Reports',
        short_code: 'FIN_REPORTS',
        description: 'Access to financial reports',
        enable_view: true,
        enable_add: false,
        enable_edit: false,
        enable_delete: false,
        is_system: false,
        is_active: true,
        display_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
    
    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permission_categories', null, {});
  }
};
