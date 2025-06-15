'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Disable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.bulkInsert('user_interview_schedules', [
      {
        // Initial Job Interview
        user_id: 1, // Assuming user ID 1 exists
        job_id: 1,
        title: 'Initial Interview for Senior Developer Position',
        round: 1,
        interview_type: 'onboarding',
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
        user_confirmed: false,
        is_active: true,
        preparation_instructions: 'Please prepare your portfolio and be ready to discuss your experience with React and Node.js.',
        interviewer_instructions: 'Focus on technical skills and experience with our tech stack.',
        assessment_criteria: 'Technical knowledge, problem-solving, communication, cultural fit.',
        notes: 'This is the first interview for this candidate.',
        decision: 'pending',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Technical Assessment
        user_id: 2, // Assuming user ID 2 exists
        job_id: 1,
        title: 'Technical Assessment for Full Stack Developer',
        round: 2,
        interview_type: 'onboarding',
        scheduled_date: '2025-06-20',
        start_time: '14:00:00',
        end_time: '16:00:00',
        timezone: 'America/New_York',
        is_virtual: true,
        meeting_link: 'https://zoom.us/j/987654321',
        meeting_id: '987654321',
        meeting_password: '654321',
        meeting_provider: 'Zoom',
        status: 'scheduled',
        user_confirmed: true,
        confirmation_date: new Date('2025-06-15'),
        is_active: true,
        preparation_instructions: 'Please be prepared to complete a coding exercise during the interview.',
        interviewer_instructions: 'Assess coding skills, problem-solving approach, and code quality.',
        assessment_criteria: 'Code structure, algorithm efficiency, error handling, testing approach.',
        notes: 'Second round technical assessment after successful initial interview.',
        decision: 'pending',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Client Meeting
        user_id: 3, // Assuming user ID 3 exists
        job_id: 2,
        title: 'Project Requirements Discussion with Client',
        round: 1,
        interview_type: 'client_meeting',
        scheduled_date: '2025-07-05',
        start_time: '09:00:00',
        end_time: '10:30:00',
        timezone: 'America/New_York',
        is_virtual: true,
        meeting_link: 'https://teams.microsoft.com/l/meetup-join/123456789',
        meeting_id: '987654321',
        meeting_password: 'client123',
        meeting_provider: 'Microsoft Teams',
        status: 'scheduled',
        user_confirmed: false,
        is_active: true,
        preparation_instructions: 'Please review the project brief and prepare questions about requirements.',
        interviewer_instructions: 'Gather detailed requirements and establish project scope.',
        assessment_criteria: 'Understanding of client needs, communication clarity, requirement gathering.',
        notes: 'Initial meeting with client to discuss project requirements.',
        decision: 'pending',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        // Completed Interview with Successful Decision
        user_id: 4, // Assuming user ID 4 exists
        job_id: 1,
        title: 'Final Interview for UX Designer Position',
        round: 3,
        interview_type: 'onboarding',
        scheduled_date: '2025-05-10',
        start_time: '11:00:00',
        end_time: '12:00:00',
        timezone: 'America/New_York',
        is_virtual: false,
        location: 'Conference Room B, Head Office',
        status: 'completed',
        user_confirmed: true,
        confirmation_date: new Date('2025-05-05'),
        is_active: true,
        preparation_instructions: 'Please bring your portfolio and be prepared to discuss your design process.',
        interviewer_instructions: 'Assess design skills, process, and cultural fit.',
        assessment_criteria: 'Design portfolio, UX methodology, collaboration skills, communication.',
        notes: 'Final interview after successful technical assessment.',
        decision: 'successful',
        decision_reason: 'Strong portfolio and excellent cultural fit.',
        next_steps: 'Proceed with offer letter.',
        reminder_sent: true,
        reminder_sent_at: new Date('2025-05-09T10:00:00'),
        created_by: 1,
        created_at: new Date('2025-05-01'),
        updated_at: new Date('2025-05-11')
      },
      {
        // Rescheduled Interview
        user_id: 5, // Assuming user ID 5 exists
        job_id: 2,
        title: 'Product Demo for Potential Client',
        round: 1,
        interview_type: 'demo',
        scheduled_date: '2025-05-25',
        start_time: '15:00:00',
        end_time: '16:00:00',
        timezone: 'America/New_York',
        is_virtual: true,
        meeting_link: 'https://zoom.us/j/111222333',
        meeting_id: '111222333',
        meeting_password: '123123',
        meeting_provider: 'Zoom',
        status: 'rescheduled',
        user_confirmed: false,
        is_active: true,
        preparation_instructions: 'Please prepare a demo of our product focusing on the new features.',
        interviewer_instructions: 'Showcase product capabilities and address client questions.',
        assessment_criteria: 'Product knowledge, presentation skills, handling of questions.',
        notes: 'Demo for potential enterprise client. Originally scheduled for May 20.',
        decision: 'pending',
        next_steps: 'Follow up after the rescheduled demo.',
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
    await queryInterface.bulkDelete('user_interview_schedules', null, {});
  }
};
