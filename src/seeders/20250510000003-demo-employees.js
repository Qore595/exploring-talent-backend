'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Hash the passwords
    const hashedPassword1 = await bcrypt.hash('admin123', 10);
    const hashedPassword2 = await bcrypt.hash('manager123', 10);
    const hashedPassword3 = await bcrypt.hash('employee123', 10);
    const rohithPassword = await bcrypt.hash('password123', 10);
    const hashedPassword4 = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('employees', [
      {
        // CEO - Rohith
        employee_id: 'EMP000',
        first_name: 'Rohith',
        last_name: 'Kumar',
        email: 'rohith@qore.com',
        phone: '+91-9876543210',
        password: rohithPassword,
        gender: 'male',
        dob: '1990-01-01',
        branch_id: 1,
        department_id: null,
        designation_id: 1, // CEO
        position: 'CEO',
        employment_status: 'full-time',
        hire_date: '2025-05-29',
        is_superadmin: true,
        is_active: true,
        created_by: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Admin user
        employee_id: 'EMP001',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@talentspark.com',
        phone: '+1-123-456-7890',
        password: hashedPassword1,
        gender: 'male',
        dob: '1985-01-15',
        branch_id: 1,
        department_id: null,
        designation_id: 1, // CEO
        position: 'Admin',
        employment_status: 'full-time',
        hire_date: '2020-01-01',
        is_superadmin: true,
        is_active: true,
        created_by: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Branch Manager
        employee_id: 'EMP002',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@talentspark.com',
        phone: '+1-123-456-7891',
        password: hashedPassword2,
        gender: 'male',
        dob: '1980-05-20',
        branch_id: 1,
        department_id: 1, // HR Department
        designation_id: 3, // HR Manager
        position: 'Manager',
        employment_status: 'full-time',
        hire_date: '2020-02-01',
        reporting_to: 1, // Reports to Admin
        is_superadmin: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Regular Employee
        employee_id: 'EMP003',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@talentspark.com',
        phone: '+1-123-456-7892',
        password: hashedPassword3,
        gender: 'female',
        dob: '1990-08-10',
        branch_id: 1,
        department_id: 2, // Finance Department
        designation_id: 7, // Accountant
        position: 'Staff',
        employment_status: 'full-time',
        hire_date: '2020-03-01',
        reporting_to: 2, // Reports to John Doe
        is_superadmin: false,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Rohith - CEO
        employee_id: 'EMP000',
        first_name: 'Rohith',
        last_name: 'Kumar',
        email: 'rohith@qore.com',
        phone: '+91-9876543210',
        password: hashedPassword4,
        gender: 'male',
        dob: '1990-01-01',
        branch_id: 1,
        department_id: null,
        designation_id: 1, // CEO
        position: 'CEO',
        employment_status: 'full-time',
        hire_date: '2025-05-29',
        is_superadmin: true,
        is_active: true,
        created_by: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {});
  }
};
