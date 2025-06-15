const UserSkill = require('../models/user_skill.model');
const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all skills for a specific user
exports.getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, skill_name, proficiency_level, years_experience } = req.query;
    const offset = (page - 1) * limit;
    
    // Validate user exists
    let user;
    if (dbType === 'mongodb') {
      user = await User.findById(userId);
    } else {
      user = await User.findByPk(userId);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Build filter
    const filter = { user_id: userId };
    
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
      total = await UserSkill.countDocuments(filter);
      skills = await UserSkill.find(filter)
        .skip(offset)
        .limit(parseInt(limit))
        .sort({ 'skill_data.skill_name': 1 });
    } else {
      // SQL implementation
      const whereClause = { user_id: userId };
      
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
      
      const result = await UserSkill.findAndCountAll({
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
    console.error('Error fetching user skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user skills',
      error: error.message
    });
  }
};

// Get a specific skill by ID
exports.getUserSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let skill;
    
    if (dbType === 'mongodb') {
      skill = await UserSkill.findById(id);
    } else {
      skill = await UserSkill.findByPk(id, {
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
    console.error('Error fetching user skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user skill',
      error: error.message
    });
  }
};

// Create a new skill for a user
exports.createUserSkill = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skill_data, created_by } = req.body;
    
    // Validate user exists
    let user;
    if (dbType === 'mongodb') {
      user = await User.findById(userId);
    } else {
      user = await User.findByPk(userId);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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
      newSkill = new UserSkill({
        user_id: userId,
        skill_data,
        created_by
      });
      
      await newSkill.save();
    } else {
      newSkill = await UserSkill.create({
        user_id: userId,
        skill_data,
        created_by
      });
      
      // Fetch with associations
      newSkill = await UserSkill.findByPk(newSkill.id, {
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
    console.error('Error creating user skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user skill',
      error: error.message
    });
  }
};

// Update a skill
exports.updateUserSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skill_data, updated_by } = req.body;
    
    // Find skill
    let skill;
    if (dbType === 'mongodb') {
      skill = await UserSkill.findById(id);
    } else {
      skill = await UserSkill.findByPk(id);
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
      skill = await UserSkill.findByIdAndUpdate(
        id,
        { 
          skill_data,
          updated_by
        },
        { new: true }
      );
    } else {
      await UserSkill.update(
        { 
          skill_data,
          updated_by
        },
        { where: { id } }
      );
      
      // Fetch updated record
      skill = await UserSkill.findByPk(id, {
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
    console.error('Error updating user skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user skill',
      error: error.message
    });
  }
};

// Delete a skill
exports.deleteUserSkill = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find skill
    let skill;
    if (dbType === 'mongodb') {
      skill = await UserSkill.findById(id);
    } else {
      skill = await UserSkill.findByPk(id);
    }
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    // Delete skill
    if (dbType === 'mongodb') {
      await UserSkill.findByIdAndDelete(id);
    } else {
      await skill.destroy();
    }
    
    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user skill',
      error: error.message
    });
  }
};
