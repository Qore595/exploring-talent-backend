const { Sequelize } = require('sequelize');
require('dotenv').config();

async function resetDatabase() {
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

    console.log('Dropping all tables...');
    
    // Disable foreign key checks first
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Get all table names
    const [tables] = await sequelize.query('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    
    // Drop each table
    for (const tableName of tableNames) {
      console.log(`Dropping table: ${tableName}`);
      await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    }
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Database reset complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    
    // Always re-enable foreign key checks, even if reset fails
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Foreign key checks re-enabled.');
    } catch (e) {
      console.error('Failed to re-enable foreign key checks:', e.message);
    }
    
    process.exit(1);
  }
}

resetDatabase();
