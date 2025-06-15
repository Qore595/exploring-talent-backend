const { sequelize, mongoose, dbType, connection } = require('../config/database');
const Branch = require('./branch.model');
const Role = require('./role.model');
const Department = require('./department.model');
const Designation = require('./designation.model');
const Employee = require('./employee.model');
const PermissionGroup = require('./permission_group.model');
const PermissionCategory = require('./permission_category.model');
const RolePermission = require('./role_permission.model');
const SidebarMenu = require('./sidebar_menu.model');
const SidebarSubMenu = require('./sidebar_sub_menu.model');
const EmployeeRole = require('./employee_role.model');
const User = require('./user.model');
const SmsConfiguration = require('./sms_configuration.model');
const SmsTemplate = require('./sms_template.model');
const PaymentConfiguration = require('./payment_configuration.model');
const SocialMediaLink = require('./social_media_link.model');
const GeneralSetting = require('./general_setting.model');
const Job = require('./job.model');
const EmailConfig = require('./email_config.model');
const EmailTemplate = require('./email_template.model');
const UserSkill = require('./user_skill.model');
const EmployeeSkill = require('./employee_skill.model');
const EmployeeInterviewSchedule = require('./employee_interview_schedule.model');
const UserInterviewSchedule = require('./user_interview_schedule.model');
const EmployeeInterviewCalendarEvent = require('./employee_interview_calendar_event.model');
const UserInterviewCalendarEvent = require('./user_interview_calendar_event.model');
const TalentSparkConfiguration = require('./talent_spark_configuration.model');
const NewJob = require('./newjob.model');
const EmployeeInterviewScreening = require('./employee_interview_screening.model');

// Define relationships between models here
// Example: User.hasMany(Post);

// Define relationships between models
if (dbType !== 'mongodb') {
  // Branch and Role relationship
  Branch.hasMany(Role, { foreignKey: 'branch_id' });
  Role.belongsTo(Branch, { foreignKey: 'branch_id' });

  // Branch and Department relationship
  Branch.hasMany(Department, { foreignKey: 'branch_id', onDelete: 'CASCADE' });
  Department.belongsTo(Branch, { foreignKey: 'branch_id' });

  // Employee relationships
  Branch.hasMany(Employee, { foreignKey: 'branch_id' });
  Employee.belongsTo(Branch, { foreignKey: 'branch_id' });

  Department.hasMany(Employee, { foreignKey: 'department_id' });
  Employee.belongsTo(Department, { foreignKey: 'department_id' });

  // Branch and Designation relationship
  Branch.hasMany(Designation, { foreignKey: 'branch_id', onDelete: 'CASCADE' });
  Designation.belongsTo(Branch, { foreignKey: 'branch_id' });

  // Designation and Employee relationship
  Designation.hasMany(Employee, { foreignKey: 'designation_id' });
  Employee.belongsTo(Designation, { foreignKey: 'designation_id' });

  // Self-referencing relationship for reporting structure
  Employee.belongsTo(Employee, { as: 'Manager', foreignKey: 'reporting_to' });
  Employee.hasMany(Employee, { as: 'Subordinates', foreignKey: 'reporting_to' });

  // Permission Group relationships with Employee (created_by and updated_by)
  Employee.hasMany(PermissionGroup, { foreignKey: 'created_by', as: 'CreatedPermissionGroups' });
  PermissionGroup.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(PermissionGroup, { foreignKey: 'updated_by', as: 'UpdatedPermissionGroups' });
  PermissionGroup.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Permission Category relationships with Permission Group
  PermissionGroup.hasMany(PermissionCategory, { foreignKey: 'perm_group_id', as: 'PermissionCategories' });
  PermissionCategory.belongsTo(PermissionGroup, { foreignKey: 'perm_group_id', as: 'PermissionGroup' });

  // Role Permission relationships
  Role.hasMany(RolePermission, { foreignKey: 'role_id', as: 'RolePermissions' });
  RolePermission.belongsTo(Role, { foreignKey: 'role_id', as: 'Role' });

  PermissionCategory.hasMany(RolePermission, { foreignKey: 'perm_cat_id', as: 'RolePermissions' });
  RolePermission.belongsTo(PermissionCategory, { foreignKey: 'perm_cat_id', as: 'PermissionCategory' });

  Branch.hasMany(RolePermission, { foreignKey: 'branch_id', as: 'RolePermissions' });
  RolePermission.belongsTo(Branch, { foreignKey: 'branch_id', as: 'Branch' });

  Employee.hasMany(RolePermission, { foreignKey: 'created_by', as: 'CreatedRolePermissions' });
  RolePermission.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(RolePermission, { foreignKey: 'updated_by', as: 'UpdatedRolePermissions' });
  RolePermission.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Sidebar Menu relationships
  PermissionGroup.hasMany(SidebarMenu, { foreignKey: 'permission_group_id', as: 'SidebarMenus' });
  SidebarMenu.belongsTo(PermissionGroup, { foreignKey: 'permission_group_id', as: 'PermissionGroup' });

  Employee.hasMany(SidebarMenu, { foreignKey: 'created_by', as: 'CreatedSidebarMenus' });
  SidebarMenu.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(SidebarMenu, { foreignKey: 'updated_by', as: 'UpdatedSidebarMenus' });
  SidebarMenu.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Sidebar Sub Menu relationships
  SidebarMenu.hasMany(SidebarSubMenu, { foreignKey: 'sidebar_menu_id', as: 'SubMenus' });
  SidebarSubMenu.belongsTo(SidebarMenu, { foreignKey: 'sidebar_menu_id', as: 'ParentMenu' });

  PermissionCategory.hasMany(SidebarSubMenu, { foreignKey: 'permission_category_id', as: 'SidebarSubMenus' });
  SidebarSubMenu.belongsTo(PermissionCategory, { foreignKey: 'permission_category_id', as: 'PermissionCategory' });

  Employee.hasMany(SidebarSubMenu, { foreignKey: 'created_by', as: 'CreatedSidebarSubMenus' });
  SidebarSubMenu.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(SidebarSubMenu, { foreignKey: 'updated_by', as: 'UpdatedSidebarSubMenus' });
  SidebarSubMenu.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Employee Role relationships
  Employee.hasMany(EmployeeRole, { foreignKey: 'employee_id', as: 'EmployeeRoles' });
  EmployeeRole.belongsTo(Employee, { foreignKey: 'employee_id', as: 'Employee' });

  Role.hasMany(EmployeeRole, { foreignKey: 'role_id', as: 'EmployeeRoles' });
  EmployeeRole.belongsTo(Role, { foreignKey: 'role_id', as: 'Role' });

  Branch.hasMany(EmployeeRole, { foreignKey: 'branch_id', as: 'EmployeeRoles' });
  EmployeeRole.belongsTo(Branch, { foreignKey: 'branch_id', as: 'Branch' });

  Employee.hasMany(EmployeeRole, { foreignKey: 'created_by', as: 'CreatedEmployeeRoles' });
  EmployeeRole.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(EmployeeRole, { foreignKey: 'updated_by', as: 'UpdatedEmployeeRoles' });
  EmployeeRole.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // User relationships
  Employee.hasOne(User, { foreignKey: 'employee_id' });
  User.belongsTo(Employee, { foreignKey: 'employee_id', as: 'Employee' });

  Branch.hasMany(User, { foreignKey: 'default_branch_id' });
  User.belongsTo(Branch, { foreignKey: 'default_branch_id', as: 'DefaultBranch' });

  Employee.hasMany(User, { foreignKey: 'created_by', as: 'CreatedUsers' });
  User.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(User, { foreignKey: 'updated_by', as: 'UpdatedUsers' });
  User.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // SMS Configuration relationships
  Employee.hasMany(SmsConfiguration, { foreignKey: 'created_by', as: 'CreatedSmsConfigurations' });
  SmsConfiguration.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(SmsConfiguration, { foreignKey: 'updated_by', as: 'UpdatedSmsConfigurations' });
  SmsConfiguration.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // SMS Template relationships
  Employee.hasMany(SmsTemplate, { foreignKey: 'created_by', as: 'CreatedSmsTemplates' });
  SmsTemplate.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(SmsTemplate, { foreignKey: 'updated_by', as: 'UpdatedSmsTemplates' });
  SmsTemplate.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Payment Configuration relationships
  Employee.hasMany(PaymentConfiguration, { foreignKey: 'created_by', as: 'CreatedPaymentConfigurations' });
  PaymentConfiguration.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(PaymentConfiguration, { foreignKey: 'updated_by', as: 'UpdatedPaymentConfigurations' });
  PaymentConfiguration.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Social Media Link relationships
  Employee.hasMany(SocialMediaLink, { foreignKey: 'created_by', as: 'CreatedSocialMediaLinks' });
  SocialMediaLink.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(SocialMediaLink, { foreignKey: 'updated_by', as: 'UpdatedSocialMediaLinks' });
  SocialMediaLink.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });
  // Job relationships
  Employee.hasMany(Job, { foreignKey: 'created_by', as: 'CreatedJobs' });
  Job.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(Job, { foreignKey: 'updated_by', as: 'UpdatedJobs' });
  Job.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // NewJob relationships
  Department.hasMany(NewJob, { foreignKey: 'department_id', as: 'NewJobs' });
  NewJob.belongsTo(Department, { foreignKey: 'department_id', as: 'Department' });

  Employee.hasMany(NewJob, { foreignKey: 'assigned_to_employee_id', as: 'AssignedNewJobs' });
  NewJob.belongsTo(Employee, { foreignKey: 'assigned_to_employee_id', as: 'AssignedEmployee' });

  // Email Configuration relationships
  Employee.hasMany(EmailConfig, { foreignKey: 'created_by', as: 'CreatedEmailConfigs' });
  EmailConfig.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(EmailConfig, { foreignKey: 'updated_by', as: 'UpdatedEmailConfigs' });
  EmailConfig.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Email Template relationships
  Employee.hasMany(EmailTemplate, { foreignKey: 'created_by', as: 'CreatedEmailTemplates' });
  EmailTemplate.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(EmailTemplate, { foreignKey: 'updated_by', as: 'UpdatedEmailTemplates' });
  EmailTemplate.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // User Skill relationships
  User.hasMany(UserSkill, { foreignKey: 'user_id', as: 'Skills' });
  UserSkill.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

  Employee.hasMany(UserSkill, { foreignKey: 'created_by', as: 'CreatedUserSkills' });
  UserSkill.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(UserSkill, { foreignKey: 'updated_by', as: 'UpdatedUserSkills' });
  UserSkill.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Employee Skill relationships
  Employee.hasMany(EmployeeSkill, { foreignKey: 'employee_id', as: 'Skills' });
  EmployeeSkill.belongsTo(Employee, { foreignKey: 'employee_id', as: 'Employee' });

  Employee.hasMany(EmployeeSkill, { foreignKey: 'created_by', as: 'CreatedEmployeeSkills' });
  EmployeeSkill.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(EmployeeSkill, { foreignKey: 'updated_by', as: 'UpdatedEmployeeSkills' });
  EmployeeSkill.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Employee Interview Schedule relationships
  Employee.hasMany(EmployeeInterviewSchedule, { foreignKey: 'employee_id', as: 'InterviewSchedules' });
  EmployeeInterviewSchedule.belongsTo(Employee, { foreignKey: 'employee_id', as: 'Employee' });

  Job.hasMany(EmployeeInterviewSchedule, { foreignKey: 'job_id', as: 'EmployeeInterviews' });
  EmployeeInterviewSchedule.belongsTo(Job, { foreignKey: 'job_id', as: 'Job' });

  Employee.hasMany(EmployeeInterviewSchedule, { foreignKey: 'created_by', as: 'CreatedEmployeeInterviews' });
  EmployeeInterviewSchedule.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(EmployeeInterviewSchedule, { foreignKey: 'updated_by', as: 'UpdatedEmployeeInterviews' });
  EmployeeInterviewSchedule.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // User Interview Schedule relationships
  User.hasMany(UserInterviewSchedule, { foreignKey: 'user_id', as: 'InterviewSchedules' });
  UserInterviewSchedule.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

  Job.hasMany(UserInterviewSchedule, { foreignKey: 'job_id', as: 'UserInterviews' });
  UserInterviewSchedule.belongsTo(Job, { foreignKey: 'job_id', as: 'Job' });

  Employee.hasMany(UserInterviewSchedule, { foreignKey: 'created_by', as: 'CreatedUserInterviews' });
  UserInterviewSchedule.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(UserInterviewSchedule, { foreignKey: 'updated_by', as: 'UpdatedUserInterviews' });
  UserInterviewSchedule.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });

  // Employee Interview Calendar Event relationships
  EmployeeInterviewSchedule.hasMany(EmployeeInterviewCalendarEvent, { foreignKey: 'interview_id', as: 'CalendarEvents' });
  EmployeeInterviewCalendarEvent.belongsTo(EmployeeInterviewSchedule, { foreignKey: 'interview_id', as: 'Interview' });

  // User Interview Calendar Event relationships
  UserInterviewSchedule.hasMany(UserInterviewCalendarEvent, { foreignKey: 'interview_id', as: 'CalendarEvents' });
  UserInterviewCalendarEvent.belongsTo(UserInterviewSchedule, { foreignKey: 'interview_id', as: 'Interview' });

  // Talent Spark Configuration relationships
  Branch.hasMany(TalentSparkConfiguration, { foreignKey: 'branch_id', as: 'TalentSparkConfigurations' });
  TalentSparkConfiguration.belongsTo(Branch, { foreignKey: 'branch_id', as: 'Branch' });

  Employee.hasMany(TalentSparkConfiguration, { foreignKey: 'created_by', as: 'CreatedTalentSparkConfigurations' });
  TalentSparkConfiguration.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

  Employee.hasMany(TalentSparkConfiguration, { foreignKey: 'updated_by', as: 'UpdatedTalentSparkConfigurations' });
  TalentSparkConfiguration.belongsTo(Employee, { foreignKey: 'updated_by', as: 'UpdatedBy' });
}

const db = {
  connection: connection(),
  sequelize: dbType !== 'mongodb' ? sequelize : null,
  mongoose: dbType === 'mongodb' ? mongoose : null,
  Branch,
  Role,
  Department,
  Designation,
  Employee,
  PermissionGroup,
  PermissionCategory,
  RolePermission,
  SidebarMenu,
  SidebarSubMenu,
  EmployeeRole,
  User,
  SmsConfiguration,
  SmsTemplate,
  PaymentConfiguration,
  SocialMediaLink,
  GeneralSetting,
  Job,
  NewJob,
  EmailConfig,
  EmailTemplate,
  UserSkill,
  EmployeeSkill,
  EmployeeInterviewSchedule,
  UserInterviewSchedule,  EmployeeInterviewCalendarEvent,
  UserInterviewCalendarEvent,
  TalentSparkConfiguration,
  EmployeeInterviewScreening,
  dbType
};

module.exports = db;
