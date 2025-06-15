const { execSync } = require('child_process');
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function runSeedersInOrder() {
  const sequelize = new Sequelize(
    process.env.DB_DATABASE || 'ts',
    process.env.DB_USERNAME || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: false
    }
  );

  const seeders = [
    // Basic structure tables
    '20250509104834-demo-branches.js',
    '20250510000001-demo-roles.js',
    '20250510000002-demo-departments.js',
    '20250510000004-demo-designations.js',
    
    // Employee related
    '20250510000005-demo-employees.js',
    
    // Permissions and roles
    '20250510060027-demo-permission-groups.js',
    '20250510070002-demo-permission-categories.js',
    '20250510080002-demo-role-permissions.js',
    '20250510090006-demo-employee-roles.js',
    
    // UI elements
    '20250510090002-demo-sidebar-menus.js',
    '20250510090004-demo-sidebar-sub-menus.js',
    
    // Other system entities
    '20250510100001-demo-users.js',
    '20250512034725-demo-employee-interview-schedules.js',
    '20250512034726-demo-user-interview-schedules.js'
  ];

  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Run each seeder in order
    for (const seeder of seeders) {
      try {
        console.log(`Running seeder: ${seeder}...`);
        execSync(`npx sequelize-cli db:seed --seed src/seeders/${seeder}`, {
          stdio: 'inherit'
        });
      } catch (seedError) {
        console.log(`Error with seeder ${seeder}, continuing with next...`);
      }
    }
    
    console.log('Re-enabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    
    // Always re-enable foreign key checks, even if seeding fails
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Foreign key checks re-enabled.');
    } catch (e) {
      console.error('Failed to re-enable foreign key checks:', e.message);
    }
    
    process.exit(1);
  }
}

runSeedersInOrder();
