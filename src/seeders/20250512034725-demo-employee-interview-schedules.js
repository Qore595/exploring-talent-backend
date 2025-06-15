'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('employee_interview_schedules', [
      {
        // Performance Review Interview
        employee_id: 3, // Jane Smith
        job_id: 1,
        title: 'Q2 Performance Review',
        round: 1,
        interview_type: 'performance_review',
        scheduled_date: '2025-06-15',
        start_time: '10:00:00',
        end_time: '11:00:00',
        timezone: 'America/New_York',
        is_virtual: true,
        meeting_link: 'https://zoom.us/j/123456789',
        meeting_id: '123456789',
        meeting_password: '123456',
        meeting_provider: 'Zoom',
        status: 'scheduled',
        employee_confirmed: false,
        is_active: true,
        preparation_instructions: 'Please prepare a summary of your Q2 achievements and challenges.',
        interviewer_instructions: 'Focus on performance metrics and growth areas.',
        assessment_criteria: 'Project delivery, code quality, teamwork, communication.',
        notes: 'This is a regular quarterly performance review.',
        decision: 'pending',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Promotion Interview
        employee_id: 2, // John Doe
        job_id: 1,
        title: 'Senior Manager Promotion Interview',
        round: 1,
        interview_type: 'promotion',
        scheduled_date: '2025-06-20',
        start_time: '14:00:00',
        end_time: '15:30:00',
        timezone: 'America/New_York',
        is_virtual: false,
        location: 'Conference Room A, Head Office',
        status: 'scheduled',
        employee_confirmed: true,
        confirmation_date: new Date('2025-06-10'),
        is_active: true,
        preparation_instructions: 'Please prepare a presentation on your vision for the department.',
        interviewer_instructions: 'Evaluate leadership skills and strategic thinking.',
        assessment_criteria: 'Leadership, strategic vision, team management, business acumen.',
        notes: 'Potential promotion to Senior Manager position.',
        decision: 'pending',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Training Interview
        employee_id: 3, // Jane Smith
        job_id: 1,
        title: 'New Accounting Software Training',
        round: 1,
        interview_type: 'training',
        scheduled_date: '2025-07-05',
        start_time: '09:00:00',
        end_time: '12:00:00',
        timezone: 'America/New_York',
        is_virtual: true,
        meeting_link: 'https://teams.microsoft.com/l/meetup-join/123456789',
        meeting_id: '987654321',
        meeting_password: 'training123',
        meeting_provider: 'Microsoft Teams',
        status: 'scheduled',
        employee_confirmed: false,
        is_active: true,
        preparation_instructions: 'Please review the training materials sent via email.',
        interviewer_instructions: 'Cover all modules of the new accounting software.',
        assessment_criteria: 'Understanding of software features, ability to perform basic tasks.',
        notes: 'Training session for the new accounting software being implemented.',
        decision: 'pending',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Completed Interview with Positive Decision
        employee_id: 2, // John Doe
        job_id: 1,
        title: 'Project Management Skills Assessment',
        round: 1,
        interview_type: 'one_on_one',
        scheduled_date: '2025-05-10',
        start_time: '11:00:00',
        end_time: '12:00:00',
        timezone: 'America/New_York',
        is_virtual: true,
        meeting_link: 'https://zoom.us/j/987654321',
        meeting_id: '987654321',
        meeting_password: '654321',
        meeting_provider: 'Zoom',
        status: 'completed',
        employee_confirmed: true,
        confirmation_date: new Date('2025-05-05'),
        is_active: true,
        preparation_instructions: 'Please bring examples of projects you have managed.',
        interviewer_instructions: 'Assess project management methodologies and experience.',
        assessment_criteria: 'Project planning, resource allocation, risk management, stakeholder communication.',
        notes: 'Assessment for potential assignment to the new product launch project.',
        decision: 'positive',
        decision_reason: 'Demonstrated excellent project management skills and experience.',
        next_steps: 'Assign to the new product launch project as Project Lead.',
        reminder_sent: true,
        reminder_sent_at: new Date('2025-05-09T10:00:00'),
        created_by: 1,
        created_at: new Date('2025-05-01'),
        updated_at: new Date('2025-05-11')
      },
      {
        // Canceled Interview
        employee_id: 3, // Jane Smith
        job_id: 1,
        title: 'Budget Planning Discussion',
        round: 1,
        interview_type: 'one_on_one',
        scheduled_date: '2025-05-20',
        start_time: '15:00:00',
        end_time: '16:00:00',
        timezone: 'America/New_York',
        is_virtual: true,
        meeting_link: 'https://zoom.us/j/111222333',
        meeting_id: '111222333',
        meeting_password: '123123',
        meeting_provider: 'Zoom',
        status: 'canceled',
        employee_confirmed: true,
        confirmation_date: new Date('2025-05-15'),
        is_active: false,
        preparation_instructions: 'Please prepare Q3 budget projections.',
        interviewer_instructions: 'Review budget allocations and discuss potential adjustments.',
        assessment_criteria: 'Budget accuracy, financial planning, cost management.',
        notes: 'Quarterly budget planning meeting.',
        decision: 'no_decision',
        decision_reason: 'Meeting canceled due to scheduling conflict.',
        next_steps: 'Reschedule for next week.',
        reminder_sent: true,
        reminder_sent_at: new Date('2025-05-19T15:00:00'),
        created_by: 1,
        created_at: new Date('2025-05-10'),
        updated_at: new Date('2025-05-19')
      }
    ], {});

    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee_interview_schedules', null, {});
  }
};
