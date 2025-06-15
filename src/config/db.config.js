require('dotenv').config();

// Common configuration for all database types
const commonConfig = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'talent_spark_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE_TEST || 'talent_spark_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    logging: false,
  }
};

// MySQL specific configuration
const mysqlConfig = {
  development: {
    ...commonConfig.development,
    dialect: 'mysql'
  },
  test: {
    ...commonConfig.test,
    dialect: 'mysql'
  },
  production: {
    ...commonConfig.production,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

// PostgreSQL specific configuration
const postgresConfig = {
  development: {
    ...commonConfig.development,
    dialect: 'postgres'
  },
  test: {
    ...commonConfig.test,
    dialect: 'postgres'
  },
  production: {
    ...commonConfig.production,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};



// MongoDB specific configuration
const mongodbConfig = {
  development: {
    url: `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 27017}/${process.env.DB_DATABASE || 'talent_spark_dev'}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  test: {
    url: `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 27017}/${process.env.DB_DATABASE_TEST || 'talent_spark_test'}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  production: {
    url: `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 27017}/${process.env.DB_DATABASE || 'talent_spark_prod'}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
};

// Determine which configuration to use based on DB_TYPE
const dbType = process.env.DB_TYPE || 'mysql';
let config;

switch (dbType.toLowerCase()) {
  case 'postgres':
    config = postgresConfig;
    break;
  case 'mongodb':
    config = mongodbConfig;
    break;
  case 'mysql':
  default:
    config = mysqlConfig;
    break;
}

module.exports = {
  config,
  dbType: dbType.toLowerCase()
};




