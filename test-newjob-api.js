// A simple test script to test the newjob API
const axios = require('axios');

async function testNewJobAPI() {
  try {
    const jobData = {
      job_title: "Senior Software Engineer",
      job_description: "Looking for an experienced software engineer...",
      department_id: 1, // Make sure this department ID exists in your database
      employment_type: "Full-time",
      status: "Draft",
      priority: "High",
      min_salary: 80000.00,
      max_salary: 120000.00,
      application_deadline: "2025-08-15",
      is_remote: true,
      client_budget_hourly: 65.00,
      internal_budget_hourly: 45.00,
      candidate_split_percentage: 70,
      company_split_percentage: 30,
      requirements: "5+ years experience with Java...",
      responsibilities: "Lead development of backend systems...",
      benefits: "Healthcare, 401k, flexible work hours..."
    };
    
    console.log('Sending POST request to create a new job...');
    const response = await axios.post('http://localhost:3001/api/newjobs', jobData);
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error.response ? error.response.data : error.message);
    console.error('Error details:', error.response ? error.response : error);
  }
}

testNewJobAPI();
