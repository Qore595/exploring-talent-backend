'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('role_permissions', [
      // Administrator Role (ID: 1) - Full access to all permission categories
      // System Administration Group
      {
        role_id: 1,
        perm_cat_id: 1, // User Management
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 2, // Role Management
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 3, // Permission Management
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 4, // System Settings
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // User Management Group
      {
        role_id: 1,
        perm_cat_id: 5, // User Profiles
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 6, // User Permissions
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Employee Management Group
      {
        role_id: 1,
        perm_cat_id: 7, // Employee Records
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 8, // Employee Attendance
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 9, // Employee Leave
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Branch, Department, Designation, Role Management Groups
      {
        role_id: 1,
        perm_cat_id: 10, // Branch Operations
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 11, // Department Operations
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 12, // Designation Operations
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 13, // Role Operations
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Report Access Group
      {
        role_id: 1,
        perm_cat_id: 14, // Employee Reports
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 1,
        perm_cat_id: 15, // Financial Reports
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: true,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Manager Role (ID: 2) - Limited access
      // System Administration Group - View only
      {
        role_id: 2,
        perm_cat_id: 1, // User Management
        can_view: true,
        can_add: false,
        can_edit: false,
        can_delete: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Employee Management Group - Full access
      {
        role_id: 2,
        perm_cat_id: 7, // Employee Records
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 2,
        perm_cat_id: 8, // Employee Attendance
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 2,
        perm_cat_id: 9, // Employee Leave
        can_view: true,
        can_add: true,
        can_edit: true,
        can_delete: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Department and Designation Operations - View and Edit
      {
        role_id: 2,
        perm_cat_id: 11, // Department Operations
        can_view: true,
        can_add: false,
        can_edit: true,
        can_delete: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 2,
        perm_cat_id: 12, // Designation Operations
        can_view: true,
        can_add: false,
        can_edit: true,
        can_delete: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Report Access Group - View only
      {
        role_id: 2,
        perm_cat_id: 14, // Employee Reports
        can_view: true,
        can_add: false,
        can_edit: false,
        can_delete: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Employee Role (ID: 3) - Very limited access
      // Employee Management Group - View only for Employee Records, Full access for own attendance and leave
      {
        role_id: 3,
        perm_cat_id: 7, // Employee Records
        can_view: true,
        can_add: false,
        can_edit: false,
        can_delete: false,
        is_active: true,
        created_by: 1,
        custom_attributes: JSON.stringify({
          "view_restrictions": ["only_self", "no_salary_info"]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 3,
        perm_cat_id: 8, // Employee Attendance
        can_view: true,
        can_add: true,
        can_edit: false,
        can_delete: false,
        is_active: true,
        created_by: 1,
        custom_attributes: JSON.stringify({
          "view_restrictions": ["only_self"],
          "add_restrictions": ["only_self"]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 3,
        perm_cat_id: 9, // Employee Leave
        can_view: true,
        can_add: true,
        can_edit: false,
        can_delete: false,
        is_active: true,
        created_by: 1,
        custom_attributes: JSON.stringify({
          "view_restrictions": ["only_self"],
          "add_restrictions": ["only_self"]
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
    
    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
