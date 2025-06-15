const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const { config, dbType } = require('./db.config');

// Get the environment from NODE_ENV or default to development
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize connections
let sequelize = null;
let connection = null;

// Initialize Sequelize for SQL databases
if (dbType !== 'mongodb') {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging !== undefined ? dbConfig.logging : console.log,
      pool: dbConfig.pool || {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test the connection
const testConnection = async () => {
  try {
    if (dbType === 'mongodb') {
      // MongoDB connection
      await mongoose.connect(dbConfig.url, dbConfig.options);
      console.log('MongoDB connection has been established successfully.');
      connection = mongoose.connection;
      return true;
    } else {
      // Sequelize connection (MySQL or PostgreSQL)
      await sequelize.authenticate();
      console.log(`${dbConfig.dialect.toUpperCase()} connection has been established successfully.`);
      return true;
    }
  } catch (error) {
    console.error(`Unable to connect to the ${dbType} database:`, error);
    return false;
  }
};

// Get the appropriate database connection
const getDbConnection = () => {
  if (dbType === 'mongodb') {
    return connection;
  } else {
    return sequelize;
  }
};

// Sync database (only for Sequelize)
const syncDatabase = async (options = {}) => {
  if (dbType !== 'mongodb' && sequelize) {
    // Default to not altering tables to avoid issues with virtual fields
    // and other complex column types
    const syncOptions = {
      ...options,
      force: options.force !== undefined ? options.force : false,
      alter: options.alter !== undefined ? options.alter : false
    };
    return sequelize.sync(syncOptions);
  }
  return Promise.resolve();
};

module.exports = {
  sequelize: dbType !== 'mongodb' ? sequelize : null,
  mongoose: dbType === 'mongodb' ? mongoose : null,
  connection: getDbConnection,
  testConnection,
  syncDatabase,
  Sequelize: dbType !== 'mongodb' ? Sequelize : null,
  dbType
};


