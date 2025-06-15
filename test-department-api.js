// A simple test script to call the departments by branch ID API
const axios = require('axios');

async function testDepartmentsByBranchId() {
  try {
    const branchId = 1; // Replace with an actual branch ID from your database
    const response = await axios.get(`http://localhost:3001/api/departments/branch/${branchId}`);
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error.response ? error.response.data : error.message);
  }
}

testDepartmentsByBranchId();
