const { execSync } = require('child_process');
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function runSeeders() {
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

  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    console.log('Running seeders...');
    execSync('npx sequelize-cli db:seed:all --env development', {
      stdio: 'inherit'
    });
    
    console.log('Re-enabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Seeding completed successfully!');
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

runSeeders();
