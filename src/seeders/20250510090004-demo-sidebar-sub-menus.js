'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('sidebar_sub_menus', [
      // User Management > Users - Submenu
      {
        sidebar_menu_id: 2, // User Management menu
        permission_category_id: 3, // User Management permission category
        icon: 'fa-users',
        sub_menu: 'Users',
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
        sidebar_menu_id: 2, // User Management menu
        permission_category_id: 4, // Roles permission category
        icon: 'fa-key',
        sub_menu: 'Roles',
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
        sidebar_menu_id: 2, // User Management menu
        permission_category_id: 5, // Permissions permission category
        icon: 'fa-lock',
        sub_menu: 'Permissions',
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
      
      // Settings > General Settings - Submenu
      {
        sidebar_menu_id: 5, // Settings menu
        permission_category_id: 6, // Settings permission category
        icon: 'fa-cog',
        sub_menu: 'General Settings',
        activate_menu: 'general_settings',
        url: '/settings/general',
        lang_key: 'general_settings',
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
        sidebar_menu_id: 5, // Settings menu
        permission_category_id: 6, // Settings permission category
        icon: 'fa-bars',
        sub_menu: 'Menu Settings',
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
    await queryInterface.bulkDelete('sidebar_sub_menus', null, {});
  }
};
