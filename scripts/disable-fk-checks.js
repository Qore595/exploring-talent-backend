const { Sequelize } = require('sequelize');
require('dotenv').config();

async function disableFKChecks() {
  const sequelize = new Sequelize(
    process.env.DB_DATABASE || 'ts',
    process.env.DB_USERNAME || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: console.log
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('Foreign key checks disabled.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

disableFKChecks();
