'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('departments', [
      {
        name: 'Human Resources',
        branch_id: 1,
        short_code: 'HR',
        description: 'Human Resources department for employee management',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Finance',
        branch_id: 1,
        short_code: 'FIN',
        description: 'Finance department for financial management',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Information Technology',
        branch_id: 1,
        short_code: 'IT',
        description: 'IT department for technology management',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Marketing',
        branch_id: 1,
        short_code: 'MKT',
        description: 'Marketing department for brand management',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Operations',
        branch_id: 1,
        short_code: 'OPS',
        description: 'Operations department for day-to-day operations',
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, {});
  }
};
