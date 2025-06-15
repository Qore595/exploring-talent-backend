const { sequelize } = require('./src/config/database');

async function checkTableStructure() {
  try {
    // Check if the departments table exists and its structure
    const [departmentsInfo] = await sequelize.query(`
      DESCRIBE departments;
    `);
    console.log('Departments table structure:');
    console.log(departmentsInfo);

    // Check if the employees table exists and its structure
    const [employeesInfo] = await sequelize.query(`
      DESCRIBE employees;
    `);
    console.log('\nEmployees table structure:');
    console.log(employeesInfo);

    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Error checking table structure:', error);
  }
}

checkTableStructure();
