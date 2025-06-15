const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

// Get the environment from command line or default to development
const env = process.argv[2] || process.env.NODE_ENV || 'development';

console.log(`Running seeders for environment: ${env}`);

try {
  // Run the seeders with force flag to overwrite existing data
  execSync(`npx sequelize-cli db:seed:all --env ${env} --force`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  console.log('Seeders completed successfully!');
} catch (error) {
  console.error('Seeding failed:', error.message);
  process.exit(1);
}
