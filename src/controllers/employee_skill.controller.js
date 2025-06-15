const EmployeeSkill = require('../models/employee_skill.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all skills for a specific employee
exports.getEmployeeSkills = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 10, skill_name, proficiency_level, years_experience } = req.query;
    const offset = (page - 1) * limit;
    
    // Validate employee exists
    let employee;
    if (dbType === 'mongodb') {
      employee = await Employee.findById(employeeId);
    } else {
      employee = await Employee.findByPk(employeeId);
    }
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Build filter
    const filter = { employee_id: employeeId };
    
    // Add JSON field filters if provided
    if (skill_name || proficiency_level || years_experience) {
      if (dbType === 'mongodb') {
        if (skill_name) {
          filter['skill_data.skill_name'] = { $regex: skill_name, $options: 'i' };
        }
        if (proficiency_level) {
          filter['skill_data.proficiency_level'] = proficiency_level;
        }
        if (years_experience) {
          filter['skill_data.years_experience'] = parseFloat(years_experience);
        }
      }
    }
    
    let skills;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      total = await EmployeeSkill.countDocuments(filter);
      skills = await EmployeeSkill.find(filter)
        .skip(offset)
        .limit(parseInt(limit))
        .sort({ 'skill_data.skill_name': 1 });
    } else {
      // SQL implementation
      const whereClause = { employee_id: employeeId };
      
      // Handle JSON field filtering for SQL
      const jsonConditions = [];
      if (skill_name) {
        jsonConditions.push(
          sequelize.literal(`JSON_EXTRACT(skill_data, '$.skill_name') LIKE '%${skill_name}%'`)
        );
      }
      if (proficiency_level) {
        jsonConditions.push(
          sequelize.literal(`JSON_EXTRACT(skill_data, '$.proficiency_level') = '${proficiency_level}'`)
        );
      }
      if (years_experience) {
        jsonConditions.push(
          sequelize.literal(`JSON_EXTRACT(skill_data, '$.years_experience') = ${years_experience}`)
        );
      }
      
      const result = await EmployeeSkill.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [
          [sequelize.literal("JSON_EXTRACT(skill_data, '$.skill_name')"), 'ASC']
        ],
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
      
      skills = result.rows;
      total = result.count;
    }
    
    res.status(200).json({
      success: true,
      data: skills,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employee skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee skills',
      error: error.message
    });
  }
};

// Get a specific skill by ID
exports.getEmployeeSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let skill;
    
    if (dbType === 'mongodb') {
      skill = await EmployeeSkill.findById(id);
    } else {
      skill = await EmployeeSkill.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    console.error('Error fetching employee skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee skill',
      error: error.message
    });
  }
};

// Create a new skill for an employee
exports.createEmployeeSkill = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { skill_data, created_by } = req.body;
    
    // Validate employee exists
    let employee;
    if (dbType === 'mongodb') {
      employee = await Employee.findById(employeeId);
    } else {
      employee = await Employee.findByPk(employeeId);
    }
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Validate skill data
    if (!skill_data || !skill_data.skill_name) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }
    
    // Create new skill
    let newSkill;
    
    if (dbType === 'mongodb') {
      newSkill = new EmployeeSkill({
        employee_id: employeeId,
        skill_data,
        created_by
      });
      
      await newSkill.save();
    } else {
      newSkill = await EmployeeSkill.create({
        employee_id: employeeId,
        skill_data,
        created_by
      });
      
      // Fetch with associations
      newSkill = await EmployeeSkill.findByPk(newSkill.id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: newSkill
    });
  } catch (error) {
    console.error('Error creating employee skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee skill',
      error: error.message
    });
  }
};

// Update a skill
exports.updateEmployeeSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skill_data, updated_by } = req.body;
    
    // Find skill
    let skill;
    if (dbType === 'mongodb') {
      skill = await EmployeeSkill.findById(id);
    } else {
      skill = await EmployeeSkill.findByPk(id);
    }
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    // Validate skill data
    if (!skill_data || !skill_data.skill_name) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }
    
    // Update skill
    if (dbType === 'mongodb') {
      skill = await EmployeeSkill.findByIdAndUpdate(
        id,
        { 
          skill_data,
          updated_by
        },
        { new: true }
      );
    } else {
      await EmployeeSkill.update(
        { 
          skill_data,
          updated_by
        },
        { where: { id } }
      );
      
      // Fetch updated record
      skill = await EmployeeSkill.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } catch (error) {
    console.error('Error updating employee skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee skill',
      error: error.message
    });
  }
};

// Delete a skill
exports.deleteEmployeeSkill = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find skill
    let skill;
    if (dbType === 'mongodb') {
      skill = await EmployeeSkill.findById(id);
    } else {
      skill = await EmployeeSkill.findByPk(id);
    }
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    // Delete skill
    if (dbType === 'mongodb') {
      await EmployeeSkill.findByIdAndDelete(id);
    } else {
      await skill.destroy();
    }
    
    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee skill',
      error: error.message
    });
  }
};
