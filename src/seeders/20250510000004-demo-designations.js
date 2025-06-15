'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('designations', [
      {
        name: 'CEO',
        branch_id: 1,
        short_code: 'CEO',
        description: 'Chief Executive Officer',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'CTO',
        branch_id: 1,
        short_code: 'CTO',
        description: 'Chief Technology Officer',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'HR Manager',
        branch_id: 1,
        short_code: 'HRM',
        description: 'Human Resources Manager',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Software Engineer',
        branch_id: 1,
        short_code: 'SE',
        description: 'Software Engineer',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Senior Software Engineer',
        branch_id: 1,
        short_code: 'SSE',
        description: 'Senior Software Engineer',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Project Manager',
        branch_id: 1,
        short_code: 'PM',
        description: 'Project Manager',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Accountant',
        branch_id: 1,
        short_code: 'ACC',
        description: 'Accountant',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('designations', null, {});
  }
};
