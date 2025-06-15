const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { testConnection, syncDatabase, dbType } = require('./src/config/database');

// Import routes
const branchRoutes = require('./src/routes/branch.routes');
const roleRoutes = require('./src/routes/role.routes');
const departmentRoutes = require('./src/routes/department.routes');
const designationRoutes = require('./src/routes/designation.routes');
const employeeRoutes = require('./src/routes/employee.routes');
const newJobRoutes = require('./src/routes/newjob.routes');
const employeeAuthRoutes = require('./src/routes/employee_auth.routes');
const permissionGroupRoutes = require('./src/routes/permission_group.routes');
const permissionCategoryRoutes = require('./src/routes/permission_category.routes');
const permissionGroupWithCategoriesRoutes = require('./src/routes/permission_group_with_categories.routes');
const rolePermissionRoutes = require('./src/routes/role_permission.routes');
const sidebarMenuRoutes = require('./src/routes/sidebar_menu.routes');
const sidebarSubMenuRoutes = require('./src/routes/sidebar_sub_menu.routes');
const sidebarMenuWithSubMenusRoutes = require('./src/routes/sidebar_menu_with_sub_menus.routes');
const employeeRoleRoutes = require('./src/routes/employee_role.routes');
const userRoutes = require('./src/routes/user.routes');
const smsConfigurationRoutes = require('./src/routes/sms_configuration.routes');
const smsTemplateRoutes = require('./src/routes/sms_template.routes');
const paymentConfigurationRoutes = require('./src/routes/payment_configuration.routes');
const socialMediaLinkRoutes = require('./src/routes/social_media_link.routes');
const generalSettingRoutes = require('./src/routes/general_setting.routes');
const jobRoutes = require('./src/routes/job.routes');
const emailConfigRoutes = require('./src/routes/email_config.routes');
const emailTemplateRoutes = require('./src/routes/email_template.routes');
const userSkillRoutes = require('./src/routes/user_skill.routes');
const employeeSkillRoutes = require('./src/routes/employee_skill.routes');
const employeeInterviewScheduleRoutes = require('./src/routes/employee_interview_schedule.routes');
const userInterviewScheduleRoutes = require('./src/routes/user_interview_schedule.routes');
const employeeInterviewCalendarEventRoutes = require('./src/routes/employee_interview_calendar_event.routes');
const userInterviewCalendarEventRoutes = require('./src/routes/user_interview_calendar_event.routes');
const employeeInterviewScreeningRoutes = require('./src/routes/employee_interview_screening.routes');
const talentSparkConfigurationRoutes = require('./src/routes/talent_spark_configuration.routes');
const branchDataRoutes = require('./src/routes/branch_data.routes');
const qoreaiRoutes = require('./src/routes/qoreai.routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Talent Spark API' });
});

// API routes
app.use('/api/branches', branchRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-auth', employeeAuthRoutes);
app.use('/api/permission-groups', permissionGroupRoutes);
app.use('/api/permission-categories', permissionCategoryRoutes);
app.use('/api/permission-groups-with-categories', permissionGroupWithCategoriesRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/sidebar-menus', sidebarMenuRoutes);
app.use('/api/sidebar-sub-menus', sidebarSubMenuRoutes);
app.use('/api/sidebar-menus-with-sub-menus', sidebarMenuWithSubMenusRoutes);
app.use('/api/employee-roles', employeeRoleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sms-configurations', smsConfigurationRoutes);
app.use('/api/sms-templates', smsTemplateRoutes);
app.use('/api/payment-configurations', paymentConfigurationRoutes);
app.use('/api/social-media-links', socialMediaLinkRoutes);
app.use('/api/general-settings', generalSettingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/email-configs', emailConfigRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/user-skills', userSkillRoutes);
app.use('/api/employee-skills', employeeSkillRoutes);
app.use('/api/employee-interview-schedules', employeeInterviewScheduleRoutes);
app.use('/api/user-interview-schedules', userInterviewScheduleRoutes);
app.use('/api/employee-interview-calendar-events', employeeInterviewCalendarEventRoutes);
app.use('/api/user-interview-calendar-events', userInterviewCalendarEventRoutes);
app.use('/api/employee-interview-screenings', employeeInterviewScreeningRoutes);
app.use('/api/talent-spark-configurations', talentSparkConfigurationRoutes);
app.use('/api/newjobs', newJobRoutes);
app.use('/api/qoreai', qoreaiRoutes);
app.use('/api', branchDataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Connect to database and start server
testConnection()
  .then(connected => {
    if (connected) {
      // Sync database models (only for SQL databases)
      // Use force:false, alter:false to avoid modifying existing tables
      // This prevents issues with virtual fields and other complex column types
      return syncDatabase({ force: false, alter: false });
    } else {
      throw new Error(`Failed to connect to the ${dbType} database`);
    }
  })
  .then(() => {
    if (dbType !== 'mongodb') {
      console.log('Database synchronized successfully');
    }
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} with ${dbType.toUpperCase()} database`);
    });
  })
  .catch(err => {
    console.error('Error starting server:', err);
  });

module.exports = app; // For testing purposes




