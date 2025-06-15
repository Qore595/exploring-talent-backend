const { sequelize } = require('./src/config/database');

async function markMigrationCompleted() {
  try {
    await sequelize.query('INSERT INTO SequelizeMeta (name) VALUES (?)', {
      replacements: ['20250602000001-create-employee-interview-screening-table.js']
    });
    console.log('Migration marked as completed successfully');
  } catch (err) {
    if (err.message.includes('Duplicate entry')) {
      console.log('Migration was already marked as completed');
    } else {
      console.log('Error:', err.message);
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

markMigrationCompleted();
