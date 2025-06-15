// A simple test script to call the employees by specific branch ID API
const axios = require('axios');

async function testEmployeesBySpecificBranch() {
  try {
    // Replace with your actual auth token
    const token = 'your_auth_token_here';
    
    // Replace with an actual branch ID from your database
    const branchId = 1;
    
    const response = await axios.get(`http://localhost:3001/api/employees/branch/${branchId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: 1,
        limit: 10,
        is_active: true,
        department_id: 1 // Optional parameter to filter by department
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error.response ? error.response.data : error.message);
  }
}

testEmployeesBySpecificBranch();
