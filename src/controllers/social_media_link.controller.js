const SocialMediaLink = require('../models/social_media_link.model');
const Employee = require('../models/employee.model');
const { dbType } = require('../config/database');

// Get all social media links with pagination and filtering
exports.getAllSocialMediaLinks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.platform_code) {
      filters.platform_code = req.query.platform_code;
    }
    
    // Search functionality
    if (req.query.search) {
      const searchTerm = req.query.search;
      if (dbType === 'mongodb') {
        filters.$or = [
          { platform_name: { $regex: searchTerm, $options: 'i' } },
          { platform_code: { $regex: searchTerm, $options: 'i' } },
          { url: { $regex: searchTerm, $options: 'i' } }
        ];
      } else {
        const { Op } = SocialMediaLink.sequelize;
        filters[Op.or] = [
          { platform_name: { [Op.like]: `%${searchTerm}%` } },
          { platform_code: { [Op.like]: `%${searchTerm}%` } },
          { url: { [Op.like]: `%${searchTerm}%` } }
        ];
      }
    }
    
    let socialMediaLinks;
    let total;
    
    if (dbType === 'mongodb') {
      // MongoDB query
      total = await SocialMediaLink.countDocuments(filters);
      socialMediaLinks = await SocialMediaLink.find(filters)
        .sort({ platform_name: 1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['platform_name', 'ASC']],
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      };
      
      const result = await SocialMediaLink.findAndCountAll(queryOptions);
      socialMediaLinks = result.rows;
      total = result.count;
    }
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: socialMediaLinks,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching social media links:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch social media links',
      error: error.message
    });
  }
};

// Get social media link by ID
exports.getSocialMediaLinkById = async (req, res) => {
  try {
    const id = req.params.id;
    let socialMediaLink;
    
    if (dbType === 'mongodb') {
      socialMediaLink = await SocialMediaLink.findById(id);
    } else {
      socialMediaLink = await SocialMediaLink.findByPk(parseInt(id), {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    if (!socialMediaLink) {
      return res.status(404).json({ 
        success: false,
        message: 'Social media link not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: socialMediaLink
    });
  } catch (error) {
    console.error('Error fetching social media link by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch social media link',
      error: error.message 
    });
  }
};

// Create new social media link
exports.createSocialMediaLink = async (req, res) => {
  try {
    const { 
      platform_name, platform_code, url, is_active, open_in_new_tab, created_by
    } = req.body;
    
    // Validate required fields
    if (!platform_name || !platform_code) {
      return res.status(400).json({ 
        success: false,
        message: 'Platform name and code are required' 
      });
    }
    
    // Check if platform_code already exists
    let existingLink;
    if (dbType === 'mongodb') {
      existingLink = await SocialMediaLink.findOne({ platform_code });
    } else {
      existingLink = await SocialMediaLink.findOne({ where: { platform_code } });
    }
    
    if (existingLink) {
      return res.status(400).json({
        success: false,
        message: 'Social media link with this platform code already exists'
      });
    }
    
    // Create new social media link
    let newSocialMediaLink;
    
    if (dbType === 'mongodb') {
      newSocialMediaLink = new SocialMediaLink({
        platform_name, platform_code, url, is_active, open_in_new_tab, created_by
      });
      await newSocialMediaLink.save();
    } else {
      newSocialMediaLink = await SocialMediaLink.create({
        platform_name, platform_code, url, is_active, open_in_new_tab, created_by
      });
      
      // Fetch the link with relations
      newSocialMediaLink = await SocialMediaLink.findByPk(newSocialMediaLink.id, {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Social media link created successfully',
      data: newSocialMediaLink
    });
  } catch (error) {
    console.error('Error creating social media link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create social media link',
      error: error.message
    });
  }
};

// Update social media link
exports.updateSocialMediaLink = async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      platform_name, platform_code, url, is_active, open_in_new_tab, updated_by
    } = req.body;
    
    // Find social media link
    let socialMediaLink;
    if (dbType === 'mongodb') {
      socialMediaLink = await SocialMediaLink.findById(id);
    } else {
      socialMediaLink = await SocialMediaLink.findByPk(parseInt(id));
    }
    
    if (!socialMediaLink) {
      return res.status(404).json({ 
        success: false,
        message: 'Social media link not found' 
      });
    }
    
    // Check if platform_code is being changed and if it already exists
    if (platform_code && platform_code !== socialMediaLink.platform_code) {
      let existingLink;
      if (dbType === 'mongodb') {
        existingLink = await SocialMediaLink.findOne({ 
          platform_code,
          _id: { $ne: id }
        });
      } else {
        const { Op } = SocialMediaLink.sequelize;
        existingLink = await SocialMediaLink.findOne({ 
          where: { 
            platform_code,
            id: { [Op.ne]: parseInt(id) }
          }
        });
      }
      
      if (existingLink) {
        return res.status(400).json({
          success: false,
          message: 'Social media link with this platform code already exists'
        });
      }
    }
    
    // Update social media link
    if (dbType === 'mongodb') {
      socialMediaLink = await SocialMediaLink.findByIdAndUpdate(
        id,
        { 
          $set: { 
            platform_name, platform_code, url, is_active, open_in_new_tab, updated_by
          } 
        },
        { new: true }
      );
    } else {
      await SocialMediaLink.update({ 
        platform_name, platform_code, url, is_active, open_in_new_tab, updated_by
      }, {
        where: { id: parseInt(id) }
      });
      
      // Fetch updated social media link
      socialMediaLink = await SocialMediaLink.findByPk(parseInt(id), {
        include: [
          {
            model: Employee,
            as: 'CreatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          },
          {
            model: Employee,
            as: 'UpdatedBy',
            attributes: ['id', 'employee_id', 'first_name', 'last_name'],
            required: false
          }
        ]
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Social media link updated successfully',
      data: socialMediaLink
    });
  } catch (error) {
    console.error('Error updating social media link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update social media link',
      error: error.message
    });
  }
};

// Delete social media link
exports.deleteSocialMediaLink = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find social media link
    let socialMediaLink;
    if (dbType === 'mongodb') {
      socialMediaLink = await SocialMediaLink.findById(id);
    } else {
      socialMediaLink = await SocialMediaLink.findByPk(parseInt(id));
    }
    
    if (!socialMediaLink) {
      return res.status(404).json({ 
        success: false,
        message: 'Social media link not found' 
      });
    }
    
    // Delete the social media link
    if (dbType === 'mongodb') {
      await SocialMediaLink.findByIdAndDelete(id);
    } else {
      await socialMediaLink.destroy();
    }
    
    res.status(200).json({
      success: true,
      message: 'Social media link deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting social media link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete social media link',
      error: error.message
    });
  }
};
