require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkAllRoles() {
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'talent_spark'
    });
    
    console.log('Connected to MySQL database');
    
    // Get ALL roles, including deleted ones
    const [roles] = await connection.execute(
      "SELECT * FROM roles"
    );
    
    console.log(`Total roles found: ${roles.length}`);
    console.log('\nAll roles (including deleted):');
    roles.forEach(role => {
      console.log(`ID: ${role.id}, Name: ${role.name}, Active: ${role.is_active}, System: ${role.is_system}, Deleted At: ${role.deleted_at}`);
    });
    
    // Get only non-deleted roles
    const [activeRoles] = await connection.execute(
      "SELECT * FROM roles WHERE deleted_at IS NULL"
    );
    
    console.log(`\nTotal active roles (not deleted): ${activeRoles.length}`);
    console.log('\nActive roles:');
    activeRoles.forEach(role => {
      console.log(`ID: ${role.id}, Name: ${role.name}, Active: ${role.is_active}, System: ${role.is_system}`);
    });
    
    // Close the connection
    await connection.end();
    
  } catch (error) {
    console.error('Error checking roles:', error);
  }
}

checkAllRoles();
