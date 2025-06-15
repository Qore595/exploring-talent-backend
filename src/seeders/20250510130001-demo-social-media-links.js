'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('social_media_links', [
      {
        platform_name: 'Facebook',
        platform_code: 'facebook',
        url: 'https://facebook.com/talentspark',
        is_active: true,
        open_in_new_tab: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        platform_name: 'Twitter',
        platform_code: 'twitter',
        url: 'https://twitter.com/talentspark',
        is_active: true,
        open_in_new_tab: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        platform_name: 'LinkedIn',
        platform_code: 'linkedin',
        url: 'https://linkedin.com/company/talentspark',
        is_active: true,
        open_in_new_tab: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        platform_name: 'Instagram',
        platform_code: 'instagram',
        url: 'https://instagram.com/talentspark',
        is_active: true,
        open_in_new_tab: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        platform_name: 'YouTube',
        platform_code: 'youtube',
        url: 'https://youtube.com/c/talentspark',
        is_active: true,
        open_in_new_tab: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    
    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('social_media_links', null, {});
  }
};
