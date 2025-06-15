// A simple test script to call the employees by branch API
const axios = require('axios');

async function testEmployeesByBranch() {
  try {
    // Replace with your actual auth token
    const token = 'your_auth_token_here';
    
    const response = await axios.get('http://localhost:3001/api/employees/by-branch', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: 1,
        limit: 10,
        is_active: true
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error.response ? error.response.data : error.message);
  }
}

testEmployeesByBranch();
