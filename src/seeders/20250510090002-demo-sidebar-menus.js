'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('sidebar_menus', [
      // Dashboard - Top level menu
      {
        permission_group_id: 1, // Dashboard permission group
        icon: 'fa-dashboard',
        menu: 'Dashboard',
        activate_menu: 'dashboard',
        url: '/dashboard',
        lang_key: 'dashboard',
        system_level: 0,
        level: 0,
        display_order: 1,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // User Management - Top level menu
      {
        permission_group_id: 2, // User Management permission group
        icon: 'fa-users',
        menu: 'User Management',
        activate_menu: 'user_management',
        url: null,
        lang_key: 'user_management',
        system_level: 0,
        level: 0,
        display_order: 2,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // User Management > Users - Submenu
      {
        permission_group_id: 2, // User Management permission group
        icon: 'fa-user',
        menu: 'Users',
        activate_menu: 'users',
        url: '/users',
        lang_key: 'users',
        system_level: 0,
        level: 1,
        display_order: 1,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // User Management > Roles - Submenu
      {
        permission_group_id: 2, // User Management permission group
        icon: 'fa-key',
        menu: 'Roles',
        activate_menu: 'roles',
        url: '/roles',
        lang_key: 'roles',
        system_level: 0,
        level: 1,
        display_order: 2,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // User Management > Permissions - Submenu
      {
        permission_group_id: 2, // User Management permission group
        icon: 'fa-lock',
        menu: 'Permissions',
        activate_menu: 'permissions',
        url: '/permissions',
        lang_key: 'permissions',
        system_level: 0,
        level: 1,
        display_order: 3,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // HR Management - Top level menu
      {
        permission_group_id: 3, // HR Management permission group
        icon: 'fa-id-card',
        menu: 'HR Management',
        activate_menu: 'hr_management',
        url: null,
        lang_key: 'hr_management',
        system_level: 0,
        level: 0,
        display_order: 3,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // HR Management > Employees - Submenu
      {
        permission_group_id: 3, // HR Management permission group
        icon: 'fa-user-tie',
        menu: 'Employees',
        activate_menu: 'employees',
        url: '/employees',
        lang_key: 'employees',
        system_level: 0,
        level: 1,
        display_order: 1,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // HR Management > Departments - Submenu
      {
        permission_group_id: 3, // HR Management permission group
        icon: 'fa-building',
        menu: 'Departments',
        activate_menu: 'departments',
        url: '/departments',
        lang_key: 'departments',
        system_level: 0,
        level: 1,
        display_order: 2,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // HR Management > Designations - Submenu
      {
        permission_group_id: 3, // HR Management permission group
        icon: 'fa-briefcase',
        menu: 'Designations',
        activate_menu: 'designations',
        url: '/designations',
        lang_key: 'designations',
        system_level: 0,
        level: 1,
        display_order: 3,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Organization - Top level menu
      {
        permission_group_id: 4, // Organization permission group
        icon: 'fa-sitemap',
        menu: 'Organization',
        activate_menu: 'organization',
        url: null,
        lang_key: 'organization',
        system_level: 0,
        level: 0,
        display_order: 4,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Organization > Branches - Submenu
      {
        permission_group_id: 4, // Organization permission group
        icon: 'fa-code-branch',
        menu: 'Branches',
        activate_menu: 'branches',
        url: '/branches',
        lang_key: 'branches',
        system_level: 0,
        level: 1,
        display_order: 1,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Organization > Organization Chart - Submenu
      {
        permission_group_id: 4, // Organization permission group
        icon: 'fa-project-diagram',
        menu: 'Organization Chart',
        activate_menu: 'org_chart',
        url: '/organization-chart',
        lang_key: 'org_chart',
        system_level: 0,
        level: 1,
        display_order: 2,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Settings - Top level menu
      {
        permission_group_id: 5, // Settings permission group
        icon: 'fa-cogs',
        menu: 'Settings',
        activate_menu: 'settings',
        url: null,
        lang_key: 'settings',
        system_level: 0,
        level: 0,
        display_order: 5,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Settings > System Settings - Submenu
      {
        permission_group_id: 5, // Settings permission group
        icon: 'fa-wrench',
        menu: 'System Settings',
        activate_menu: 'system_settings',
        url: '/settings/system',
        lang_key: 'system_settings',
        system_level: 0,
        level: 1,
        display_order: 1,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Settings > Menu Settings - Submenu
      {
        permission_group_id: 5, // Settings permission group
        icon: 'fa-bars',
        menu: 'Menu Settings',
        activate_menu: 'menu_settings',
        url: '/settings/menus',
        lang_key: 'menu_settings',
        system_level: 0,
        level: 1,
        display_order: 2,
        sidebar_display: true,
        access_permissions: null,
        is_active: true,
        is_system: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
    
    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sidebar_menus', null, {});
  }
};
