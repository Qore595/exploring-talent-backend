const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

// Get the environment from command line or default to development
const env = process.argv[2] || process.env.NODE_ENV || 'development';

console.log(`Running migrations for environment: ${env}`);

try {
  // Run the migration
  execSync(`npx sequelize-cli db:migrate --env ${env}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  console.log('Migrations completed successfully!');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
