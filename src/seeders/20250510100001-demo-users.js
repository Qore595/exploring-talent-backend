'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash passwords for demo users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);
    
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('users', [
      // Admin user
      {
        employee_id: 1, // Assuming employee with ID 1 exists
        username: 'admin',
        email: 'admin@talentspark.com',
        password: adminPassword,
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1-123-456-7890',
        auth_type: 'password',
        user_type: 'admin',
        default_branch_id: 1,
        email_verified: true,
        is_active: true,
        is_system: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Staff user
      {
        employee_id: 2, // Assuming employee with ID 2 exists
        username: 'staff',
        email: 'staff@talentspark.com',
        password: staffPassword,
        first_name: 'Staff',
        last_name: 'User',
        phone: '+1-123-456-7891',
        auth_type: 'password',
        user_type: 'staff',
        default_branch_id: 1,
        email_verified: true,
        is_active: true,
        is_system: false,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Customer user
      {
        employee_id: null,
        username: 'customer',
        email: 'customer@example.com',
        password: customerPassword,
        first_name: 'Customer',
        last_name: 'User',
        phone: '+1-123-456-7892',
        auth_type: 'password',
        user_type: 'customer',
        default_branch_id: null,
        email_verified: true,
        is_active: true,
        is_system: false,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    
    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
