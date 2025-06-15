// Import routes to be added to src/index.js

// Add this line to the imports section:
const newJobRoutes = require('./routes/newjob.routes');

// Add this line where routes are registered:
// Note: This newjobs API does not require authentication
app.use('/api/newjobs', newJobRoutes);

/*
Note: This file is for reference only - you should add these lines to your 
existing index.js file in the appropriate places. Do not create a new index.js
file with just these lines.
*/
