require('dotenv').config();
const mysql = require('mysql2/promise');

async function createNewRole() {
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'talent_spark'
    });
    
    console.log('Connected to MySQL database');
    
    // Create a new role
    const [result] = await connection.execute(
      `INSERT INTO roles 
       (name, slug, description, branch_id, is_system, priority, is_active, created_by, created_at, updated_at) 
       VALUES 
       (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        'Administrator', 
        'administrator', 
        'System administrator with full access', 
        null, 
        true, 
        100, 
        true, 
        1
      ]
    );
    
    console.log('New role created with ID:', result.insertId);
    
    // Get the newly created role
    const [roles] = await connection.execute(
      "SELECT * FROM roles WHERE id = ?",
      [result.insertId]
    );
    
    console.log('\nNewly created role:');
    console.log(JSON.stringify(roles[0], null, 2));
    
    // Close the connection
    await connection.end();
    
  } catch (error) {
    console.error('Error creating new role:', error);
  }
}

createNewRole();
