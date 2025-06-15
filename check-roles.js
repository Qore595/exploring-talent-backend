require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkRolesTable() {
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'talent_spark'
    });
    
    console.log('Connected to MySQL database');
    
    // Check if roles table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'roles'"
    );
    
    if (tables.length === 0) {
      console.log('The roles table does not exist!');
      await connection.end();
      return;
    }
    
    console.log('The roles table exists');
    
    // Check table structure
    const [columns] = await connection.execute(
      "DESCRIBE roles"
    );
    
    console.log('Table structure:');
    columns.forEach(column => {
      console.log(`${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${column.Key} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });
    
    // Count records
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as count FROM roles"
    );
    
    console.log(`\nTotal records in roles table: ${countResult[0].count}`);
    
    // Get all records
    const [roles] = await connection.execute(
      "SELECT * FROM roles"
    );
    
    console.log('\nAll roles:');
    console.log(JSON.stringify(roles, null, 2));
    
    // Close the connection
    await connection.end();
    
  } catch (error) {
    console.error('Error checking roles table:', error);
  }
}

checkRolesTable();
