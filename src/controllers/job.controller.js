const db = require('../models');
const { dbType } = require('../config/database');
const Job = db.Job;
const { Op } = require('sequelize');
const slugify = require('slugify');

// Helper function to generate a unique slug
const generateUniqueSlug = async (title, id = null) => {
  let slug = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  
  let isUnique = false;
  let counter = 1;
  let uniqueSlug = slug;
  
  while (!isUnique) {
    let existingJob;
    
    if (dbType === 'mongodb') {
      const query = { slug: uniqueSlug };
      if (id) {
        query._id = { $ne: id };
      }
      existingJob = await Job.findOne(query);
    } else {
      const query = { 
        where: { 
          slug: uniqueSlug 
        } 
      };
      if (id) {
        query.where.id = { [Op.ne]: id };
      }
      existingJob = await Job.findOne(query);
    }
    
    if (!existingJob) {
      isUnique = true;
    } else {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  }
  
  return uniqueSlug;
};

// Get all jobs with filtering and pagination
exports.getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      job_type,
      job_level,
      is_remote,
      is_featured,
      company_name,
      location_city,
      location_state,
      location_country,
      min_salary,
      max_salary,
      education_level,
      min_experience,
      max_experience,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    let conditions = {};
    let mongoQuery = {};
    
    if (status) {
      if (dbType === 'mongodb') {
        mongoQuery.status = status;
      } else {
        conditions.status = status;
      }
    }
    
    if (job_type) {
      if (dbType === 'mongodb') {
        mongoQuery.job_type = job_type;
      } else {
        conditions.job_type = job_type;
      }
    }
    
    if (job_level) {
      if (dbType === 'mongodb') {
        mongoQuery.job_level = job_level;
      } else {
        conditions.job_level = job_level;
      }
    }
    
    if (is_remote !== undefined) {
      const remoteValue = is_remote === 'true' || is_remote === true;
      if (dbType === 'mongodb') {
        mongoQuery.is_remote = remoteValue;
      } else {
        conditions.is_remote = remoteValue;
      }
    }
    
    if (is_featured !== undefined) {
      const featuredValue = is_featured === 'true' || is_featured === true;
      if (dbType === 'mongodb') {
        mongoQuery.is_featured = featuredValue;
      } else {
        conditions.is_featured = featuredValue;
      }
    }
    
    if (company_name) {
      if (dbType === 'mongodb') {
        mongoQuery.company_name = { $regex: company_name, $options: 'i' };
      } else {
        conditions.company_name = { [Op.like]: `%${company_name}%` };
      }
    }
    
    if (location_city) {
      if (dbType === 'mongodb') {
        mongoQuery.location_city = { $regex: location_city, $options: 'i' };
      } else {
        conditions.location_city = { [Op.like]: `%${location_city}%` };
      }
    }
    
    if (location_state) {
      if (dbType === 'mongodb') {
        mongoQuery.location_state = { $regex: location_state, $options: 'i' };
      } else {
        conditions.location_state = { [Op.like]: `%${location_state}%` };
      }
    }
    
    if (location_country) {
      if (dbType === 'mongodb') {
        mongoQuery.location_country = { $regex: location_country, $options: 'i' };
      } else {
        conditions.location_country = { [Op.like]: `%${location_country}%` };
      }
    }
    
    if (min_salary) {
      if (dbType === 'mongodb') {
        mongoQuery.min_salary = { $gte: parseFloat(min_salary) };
      } else {
        conditions.min_salary = { [Op.gte]: parseFloat(min_salary) };
      }
    }
    
    if (max_salary) {
      if (dbType === 'mongodb') {
        mongoQuery.max_salary = { $lte: parseFloat(max_salary) };
      } else {
        conditions.max_salary = { [Op.lte]: parseFloat(max_salary) };
      }
    }
    
    if (education_level) {
      if (dbType === 'mongodb') {
        mongoQuery.education_level = { $regex: education_level, $options: 'i' };
      } else {
        conditions.education_level = { [Op.like]: `%${education_level}%` };
      }
    }
    
    if (min_experience) {
      if (dbType === 'mongodb') {
        mongoQuery.min_experience = { $gte: parseFloat(min_experience) };
      } else {
        conditions.min_experience = { [Op.gte]: parseFloat(min_experience) };
      }
    }
    
    if (max_experience) {
      if (dbType === 'mongodb') {
        mongoQuery.max_experience = { $lte: parseFloat(max_experience) };
      } else {
        conditions.max_experience = { [Op.lte]: parseFloat(max_experience) };
      }
    }
    
    if (search) {
      if (dbType === 'mongodb') {
        mongoQuery.$or = [
          { job_title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { company_name: { $regex: search, $options: 'i' } },
          { location_city: { $regex: search, $options: 'i' } },
          { location_state: { $regex: search, $options: 'i' } },
          { location_country: { $regex: search, $options: 'i' } }
        ];
      } else {
        conditions[Op.or] = [
          { job_title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { company_name: { [Op.like]: `%${search}%` } },
          { location_city: { [Op.like]: `%${search}%` } },
          { location_state: { [Op.like]: `%${search}%` } },
          { location_country: { [Op.like]: `%${search}%` } }
        ];
      }
    }
    
    // Soft delete condition
    if (dbType === 'mongodb') {
      mongoQuery.deleted_at = null;
    } else {
      conditions.deleted_at = null;
    }
    
    let jobs;
    let total = 0;
    
    // Determine sort order
    const sortDirection = sort_order.toLowerCase() === 'asc' ? 1 : -1;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      const sortOptions = {};
      sortOptions[sort_by] = sortDirection;
      
      jobs = await Job.find(mongoQuery)
        .sort(sortOptions)
        .skip(offset)
        .limit(parseInt(limit));
      
      total = await Job.countDocuments(mongoQuery);
    } else {
      // SQL implementation
      const result = await Job.findAndCountAll({
        where: conditions,
        limit: parseInt(limit),
        offset: offset,
        order: [[sort_by, sort_order.toUpperCase()]],
      });
      
      jobs = result.rows;
      total = result.count;
    }
    
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let job;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      job = await Job.findOne({ _id: id, deleted_at: null });
    } else {
      // SQL implementation
      job = await Job.findOne({
        where: {
          id,
          deleted_at: null
        }
      });
    }
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Increment views count
    if (dbType === 'mongodb') {
      await Job.updateOne(
        { _id: id },
        { $inc: { views_count: 1 } }
      );
      job.views_count += 1;
    } else {
      await job.update({
        views_count: job.views_count + 1
      });
    }
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// Get job by slug
exports.getJobBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    let job;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      job = await Job.findOne({ slug, deleted_at: null });
    } else {
      // SQL implementation
      job = await Job.findOne({
        where: {
          slug,
          deleted_at: null
        }
      });
    }
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Increment views count
    if (dbType === 'mongodb') {
      await Job.updateOne(
        { slug },
        { $inc: { views_count: 1 } }
      );
      job.views_count += 1;
    } else {
      await job.update({
        views_count: job.views_count + 1
      });
    }
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// Create new job
exports.createJob = async (req, res) => {
  try {
    const jobData = { ...req.body };
    
    // Validate required fields
    if (!jobData.job_title) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required'
      });
    }
    
    if (!jobData.company_name) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }
    
    if (!jobData.description) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required'
      });
    }
    
    // Generate slug from job title
    jobData.slug = await generateUniqueSlug(jobData.job_title);
    
    // Set original post date if not provided
    if (!jobData.original_post_date) {
      jobData.original_post_date = new Date();
    }
    
    // Set published_at if status is published
    if (jobData.status === 'published' && !jobData.published_at) {
      jobData.published_at = new Date();
    }
    
    let newJob;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      newJob = new Job(jobData);
      await newJob.save();
    } else {
      // SQL implementation
      newJob = await Job.create(jobData);
    }
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;
    delete updateData.views_count;
    delete updateData.applications_count;
    delete updateData.qualified_applications_count;
    delete updateData.shares_count;
    
    // Generate new slug if job title is updated
    if (updateData.job_title) {
      updateData.slug = await generateUniqueSlug(updateData.job_title, id);
    }
    
    // Set published_at if status is changed to published
    if (updateData.status === 'published') {
      let existingJob;
      
      if (dbType === 'mongodb') {
        existingJob = await Job.findById(id);
      } else {
        existingJob = await Job.findByPk(id);
      }
      
      if (existingJob && existingJob.status !== 'published') {
        updateData.published_at = new Date();
      }
    }
    
    let job;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      job = await Job.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await Job.update(
        updateData,
        { where: { id } }
      );
      
      job = await Job.findByPk(id);
    }
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// Delete job (soft delete)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    let result;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      result = await Job.findByIdAndUpdate(
        id,
        { deleted_at: new Date() }
      );
    } else {
      // SQL implementation
      result = await Job.update(
        { deleted_at: new Date() },
        { where: { id } }
      );
    }
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// Increment application count
exports.incrementApplicationCount = async (req, res) => {
  try {
    const { id } = req.params;
    
    let job;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      job = await Job.findByIdAndUpdate(
        id,
        { $inc: { applications_count: 1 } },
        { new: true }
      );
    } else {
      // SQL implementation
      job = await Job.findByPk(id);
      
      if (job) {
        await job.update({
          applications_count: job.applications_count + 1
        });
      }
    }
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Application count incremented successfully',
      data: {
        applications_count: job.applications_count
      }
    });
  } catch (error) {
    console.error('Error incrementing application count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to increment application count',
      error: error.message
    });
  }
};

// Change job status
exports.changeJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, updated_by } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['draft', 'published', 'filled', 'expired', 'canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    const updateData = { 
      status,
      updated_by
    };
    
    // Set published_at if status is changed to published
    if (status === 'published') {
      let existingJob;
      
      if (dbType === 'mongodb') {
        existingJob = await Job.findById(id);
      } else {
        existingJob = await Job.findByPk(id);
      }
      
      if (existingJob && existingJob.status !== 'published') {
        updateData.published_at = new Date();
      }
    }
    
    let job;
    
    if (dbType === 'mongodb') {
      // MongoDB implementation
      job = await Job.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } else {
      // SQL implementation
      await Job.update(
        updateData,
        { where: { id } }
      );
      
      job = await Job.findByPk(id);
    }
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Job status changed to ${status} successfully`,
      data: job
    });
  } catch (error) {
    console.error('Error changing job status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change job status',
      error: error.message
    });
  }
};
