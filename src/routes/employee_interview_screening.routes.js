const express = require('express');
const router = express.Router();
const employeeInterviewScreeningController = require('../controllers/employee_interview_screening.controller');

// GET /api/employee-interview-screenings - Get all screenings with pagination and filtering
router.get('/', employeeInterviewScreeningController.getAllScreenings);

// GET /api/employee-interview-screenings/with-employee/all - Get all screenings with employee details
router.get('/with-employee/all', employeeInterviewScreeningController.getAllScreeningsWithEmployeeDetails);

// GET /api/employee-interview-screenings/with-employee/:id - Get screening with employee details by ID
router.get('/with-employee/:id', employeeInterviewScreeningController.getScreeningWithEmployeeDetails);

// GET /api/employee-interview-screenings/call/:callid - Get screenings by call ID
router.get('/call/:callid', employeeInterviewScreeningController.getScreeningsByCallId);

// POST /api/employee-interview-screenings - Create new screening
router.post('/', employeeInterviewScreeningController.createScreening);

// PUT /api/employee-interview-screenings/:id - Update screening
router.put('/:id', employeeInterviewScreeningController.updateScreening);

// DELETE /api/employee-interview-screenings/:id - Delete screening
router.delete('/:id', employeeInterviewScreeningController.deleteScreening);

// GET /api/employee-interview-screenings/user/:userid - Get screenings by user ID
router.get('/user/:userid', employeeInterviewScreeningController.getScreeningsByUserId);

// GET /api/employee-interview-screenings/job/:job_id - Get screenings by job ID
router.get('/job/:job_id', employeeInterviewScreeningController.getScreeningsByJobId);

// GET /api/employee-interview-screenings/status/:status - Get screenings by status
router.get('/status/:status', employeeInterviewScreeningController.getScreeningsByStatus);

// GET /api/employee-interview-screenings/:id - Get screening by ID
router.get('/:id', employeeInterviewScreeningController.getScreeningById);

module.exports = router;
