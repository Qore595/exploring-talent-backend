/**
 * This script ensures that environment variables are loaded
 * before running Sequelize CLI commands
 */
require('dotenv').config();

console.log('Environment variables loaded');
console.log('Database Type:', process.env.DB_TYPE || 'mysql');
console.log('Database Host:', process.env.DB_HOST || '127.0.0.1');
console.log('Database Name:', process.env.DB_DATABASE || 'talent_spark_dev');
console.log('Environment:', process.env.NODE_ENV || 'development');
