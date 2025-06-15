const Employee = require('../models/employee.model');
const Branch = require('../models/branch.model');
const Department = require('../models/department.model');
const Designation = require('../models/designation.model');
const EmployeeRole = require('../models/employee_role.model');
const Role = require('../models/role.model');
const RolePermission = require('../models/role_permission.model');
const PermissionCategory = require('../models/permission_category.model');
const PermissionGroup = require('../models/permission_group.model');
const SidebarMenu = require('../models/sidebar_menu.model');
const SidebarSubMenu = require('../models/sidebar_sub_menu.model');
const { dbType, Sequelize, sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

// Get all employees with pagination and filtering
exports.getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = {};
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.branch_id) {
      filters.branch_id = parseInt(req.query.branch_id);
    }
    if (req.query.department_id) {
      filters.department_id = parseInt(req.query.department_id);
    }
    if (req.query.designation_id) {
      filters.designation_id = parseInt(req.query.designation_id);
    }
    if (req.query.employment_status) {
      filters.employment_status = req.query.employment_status;
    }

    // Search by name, employee_id, or email
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.$or = [
          { first_name: { $regex: req.query.search, $options: 'i' } },
          { last_name: { $regex: req.query.search, $options: 'i' } },
          { employee_id: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ];
      } else {
        // For SQL databases, we'll handle this in the query options
      }
    }

    let employees;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await Employee.countDocuments(filters);
      employees = await Employee.find(filters)
        .select('-password') // Exclude password field
        .sort({ first_name: 1, last_name: 1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['first_name', 'ASC'], ['last_name', 'ASC']],
        attributes: { exclude: ['password'] }, // Exclude password field
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        const Op = Sequelize.Op;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { first_name: { [Op.like]: `%${req.query.search}%` } },
            { last_name: { [Op.like]: `%${req.query.search}%` } },
            { employee_id: { [Op.like]: `%${req.query.search}%` } },
            { email: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }

      const result = await Employee.findAndCountAll(queryOptions);
      employees = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    let employee;

    if (dbType === 'mongodb') {
      employee = await Employee.findById(id).select('-password');
    } else {
      employee = await Employee.findByPk(parseInt(id), {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          },
          {
            model: Employee,
            as: 'Subordinates',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message
    });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      employee_id, first_name, last_name, email, phone, password,
      gender, dob, photo, branch_id, department_id, designation_id,
      position, qualification, work_experience, hire_date,
      employment_status, contract_type, work_shift, current_location,
      reporting_to, emergency_contact, emergency_contact_relation,
      marital_status, father_name, mother_name, local_address,
      permanent_address, bank_account_name, bank_account_no,
      bank_name, bank_branch, ifsc_code, basic_salary,
      facebook, twitter, linkedin, instagram, resume,
      joining_letter, other_documents, notes, is_superadmin,
      is_active, created_by
    } = req.body;

    // Validate required fields
    if (!employee_id || !first_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, first name, and password are required'
      });
    }

    // Check if employee with same employee_id or email already exists
    let existingEmployee;
    if (dbType === 'mongodb') {
      existingEmployee = await Employee.findOne({
        $or: [
          { employee_id },
          { email: email || '' }
        ]
      });
    } else {
      const Op = Sequelize.Op;
      existingEmployee = await Employee.findOne({
        where: {
          [Op.or]: [
            { employee_id },
            { email: email || '' }
          ]
        }
      });
    }

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this employee ID or email already exists'
      });
    }

    // Check if branch exists if branch_id is provided
    if (branch_id) {
      const branch = await Branch.findByPk(branch_id);
      if (!branch) {
        return res.status(400).json({
          success: false,
          message: 'Branch not found'
        });
      }
    }

    // Check if department exists if department_id is provided
    if (department_id) {
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    // Check if designation exists if designation_id is provided
    if (designation_id) {
      const designation = await Designation.findByPk(designation_id);
      if (!designation) {
        return res.status(400).json({
          success: false,
          message: 'Designation not found'
        });
      }
    }

    // Check if reporting manager exists if reporting_to is provided
    if (reporting_to) {
      const manager = await Employee.findByPk(reporting_to);
      if (!manager) {
        return res.status(400).json({
          success: false,
          message: 'Reporting manager not found'
        });
      }
    }

    // Hash password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    let newEmployee;

    if (dbType === 'mongodb') {
      newEmployee = new Employee({
        employee_id, first_name, last_name, email, phone, password: hashedPassword,
        gender, dob, photo, branch_id, department_id, designation_id,
        position, qualification, work_experience, hire_date,
        employment_status, contract_type, work_shift, current_location,
        reporting_to, emergency_contact, emergency_contact_relation,
        marital_status, father_name, mother_name, local_address,
        permanent_address, bank_account_name, bank_account_no,
        bank_name, bank_branch, ifsc_code, basic_salary,
        facebook, twitter, linkedin, instagram, resume,
        joining_letter, other_documents, notes, is_superadmin,
        is_active, created_by
      });
      await newEmployee.save();

      // Remove password from response
      newEmployee = newEmployee.toObject();
      delete newEmployee.password;
    } else {
      try {
        // Create employee data object without id field to let the database handle auto-increment
        const employeeData = {
          employee_id, first_name, last_name, email, phone, password: hashedPassword,
          gender, dob, photo, branch_id, department_id, designation_id,
          position, qualification, work_experience, hire_date,
          employment_status, contract_type, work_shift, current_location,
          reporting_to, emergency_contact, emergency_contact_relation,
          marital_status, father_name, mother_name, local_address,
          permanent_address, bank_account_name, bank_account_no,
          bank_name, bank_branch, ifsc_code, basic_salary,
          facebook, twitter, linkedin, instagram, resume,
          joining_letter, other_documents, notes, is_superadmin,
          is_active, created_by
        };

        // Explicitly ensure id is not included
        delete employeeData.id;

        // For MySQL, use a direct approach to ensure auto-increment works
        if (dbType === 'mysql') {
          // First, check if the table exists and has the correct auto-increment setup
          await sequelize.query(`
            ALTER TABLE employees MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY
          `).catch(err => {
            console.log('Auto-increment already set up or table structure cannot be modified:', err.message);
          });

          // Use standard Sequelize create for MySQL as well
          newEmployee = await Employee.create(employeeData);
        } else {
          // Use Sequelize create for other database types
          newEmployee = await Employee.create(employeeData);
        }
      } catch (error) {
        console.error('Error creating employee:', error);
        // Re-throw the error to be caught by the outer try-catch
        throw error;
      }

      // Fetch the employee with relations but without password
      newEmployee = await Employee.findByPk(newEmployee.id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          }
        ]
      });
    }

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_by;
    delete updateData.created_at;

    let employee;
    let updatedEmployee;

    if (dbType === 'mongodb') {
      employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee_id or email is being changed and if it already exists
      if (updateData.employee_id || updateData.email) {
        const existingEmployee = await Employee.findOne({
          $or: [
            { employee_id: updateData.employee_id || '', _id: { $ne: id } },
            { email: updateData.email || '', _id: { $ne: id } }
          ]
        });

        if (existingEmployee) {
          return res.status(400).json({
            success: false,
            message: 'Employee with this employee ID or email already exists'
          });
        }
      }

      // If password is being updated, hash it
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Return the updated document
      ).select('-password');
    } else {
      employee = await Employee.findByPk(parseInt(id));

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee_id or email is being changed and if it already exists
      if (updateData.employee_id || updateData.email) {
        const Op = Sequelize.Op;
        const existingEmployee = await Employee.findOne({
          where: {
            [Op.or]: [
              { employee_id: updateData.employee_id || '' },
              { email: updateData.email || '' }
            ],
            id: { [Op.ne]: parseInt(id) }
          }
        });

        if (existingEmployee) {
          return res.status(400).json({
            success: false,
            message: 'Employee with this employee ID or email already exists'
          });
        }
      }

      await employee.update(updateData);
      updatedEmployee = await Employee.findByPk(parseInt(id), {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Branch,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message
    });
  }
};

// Delete employee (soft delete by setting is_active to false)
exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    let employee;

    if (dbType === 'mongodb') {
      employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee has subordinates
      const hasSubordinates = await Employee.findOne({ reporting_to: id });
      if (hasSubordinates) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete employee with subordinates. Please reassign subordinates first.'
        });
      }

      // Soft delete by setting is_active to false
      await Employee.findByIdAndUpdate(id, {
        is_active: false,
        date_of_leaving: new Date()
      });
    } else {
      employee = await Employee.findByPk(parseInt(id));

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee has subordinates
      const subordinates = await Employee.count({
        where: { reporting_to: parseInt(id) }
      });

      if (subordinates > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete employee with subordinates. Please reassign subordinates first.'
        });
      }

      // Soft delete by setting is_active to false
      await employee.update({
        is_active: false,
        date_of_leaving: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message
    });
  }
};

// Get comprehensive employee profile with filtered sidebar menus based on permissions
exports.getEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (dbType === 'mongodb') {      // MongoDB implementation with filtered structure
      const employee = await Employee.findById(id);
      
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee is superadmin - if yes, return all data without role restrictions
      if (employee.is_superadmin) {
        // Get branch details
        const branch = employee.branch_id ? await Branch.findById(employee.branch_id) : null;
        
        // Get all roles and permission categories for superadmin
        const allRoles = await Role.find({ is_active: true });
        const allPermissionCategories = await PermissionCategory.find({ is_active: true });
        const allSidebarMenus = await SidebarMenu.find({ 
          is_active: true, 
          sidebar_display: true 
        });
        const allSidebarSubMenus = await SidebarSubMenu.find({ 
          is_active: true, 
          sidebar_display: true 
        });

        // Structure superadmin data with filtered sidebar menus
        const menuMap = new Map();
        
        allSidebarMenus.forEach(menu => {
          const relatedSubMenus = allSidebarSubMenus.filter(subMenu => 
            subMenu.sidebar_menu_id.toString() === menu._id.toString()
          );
          
          if (relatedSubMenus.length > 0) {
            const subMenusData = relatedSubMenus.map(subMenu => {
              // Find related permission categories for this sub-menu
              const relatedPermCategories = allPermissionCategories.filter(permCategory => 
                permCategory._id.toString() === subMenu.permission_category_id.toString()
              );
              
              // Filter permission categories - superadmin has view access to all
              const permissionCategories = relatedPermCategories.filter(permCategory => true).map(permCategory => ({
                id: permCategory._id.toString(),
                name: permCategory.name,
                short_code: permCategory.short_code,
                description: permCategory.description,
                can_view: true,
                can_add: true,
                can_edit: true,
                can_delete: true
              }));
              
              // Only include sub-menu if it has viewable permission categories
              if (permissionCategories.length > 0) {
                return {
                  id: subMenu._id.toString(),
                  sub_menu: subMenu.sub_menu,
                  icon: subMenu.icon,
                  url: subMenu.url,
                  lang_key: subMenu.lang_key,
                  display_order: subMenu.display_order,
                  level: subMenu.level,
                  is_active: subMenu.is_active,
                  permission_categories: permissionCategories
                };
              }
              return null;
            }).filter(subMenu => subMenu !== null).sort((a, b) => a.display_order - b.display_order);
            
            // Only include menu if it has viewable sub-menus
            if (subMenusData.length > 0) {
              menuMap.set(menu._id.toString(), {
                id: menu._id.toString(),
                menu: menu.menu,
                icon: menu.icon,
                url: menu.url,
                lang_key: menu.lang_key,
                display_order: menu.display_order,
                level: menu.level,
                sub_menus: subMenusData
              });
            }
          }
        });

        const superadminRoleData = allRoles.map(role => ({
          employee_role_id: 'superadmin',
          role_id: role._id.toString(),
          branch_id: null,
          is_primary: true,
          is_active: true,
          assigned_date: employee.created_at,
          role_details: {
            id: role._id.toString(),
            name: role.name,
            slug: role.slug,
            description: role.description,
            priority: role.priority,
            is_system: role.is_system
          },
          branch_details: null
        }));

        // Clean up employee object
        const employeeDetails = employee.toObject();
        
        // Transform for branch - format match with SQL implementation
        let branchDetails = null;
        if (branch) {
          branchDetails = {
            id: branch._id.toString(),
            name: branch.name,
            code: branch.code,
            address: branch.address,
            city: branch.city,
            state: branch.state,
            country: branch.country,
            phone: branch.phone,
            email: branch.email
          };
        }

        // Filter sidebar menus to only include those with can_view: true (all are true for superadmin)
        const filteredSidebarMenus = Array.from(menuMap.values())
          .sort((a, b) => a.display_order - b.display_order);

        const profileData = {
          employee_details: employeeDetails,
          branch_details: branchDetails,
          role_details: superadminRoleData,
          sidebar_menus: filteredSidebarMenus
        };

        return res.status(200).json({
          success: true,
          message: 'Superadmin employee profile retrieved successfully',
          data: profileData
        });
      }      // Get branch details
      const branch = employee.branch_id ? await Branch.findById(employee.branch_id) : null;

      // Get employee roles with complete nesting
      const employeeRoles = await EmployeeRole.find({
        employee_id: id,
        is_active: true,
        deleted_at: null
      });

      const rolesData = [];
      const globalMenuMap = new Map();
      
      for (const empRole of employeeRoles) {
        const role = await Role.findById(empRole.role_id);
        if (!role) continue;

        // Get role permissions
        const rolePermissions = await RolePermission.find({
          role_id: empRole.role_id,
          is_active: true
        });

        // Build sidebar menu structure for filtering
        for (const rolePerm of rolePermissions) {
          // Only process permissions with view access
          if (!rolePerm.can_view) continue;
          
          const permCategory = await PermissionCategory.findById(rolePerm.perm_cat_id);
          if (!permCategory) continue;

          // Get sidebar submenus for this permission category
          const sidebarSubMenus = await SidebarSubMenu.find({
            permission_category_id: permCategory._id,
            is_active: true,
            sidebar_display: true
          }).sort({ display_order: 1, level: 1 });

          for (const subMenu of sidebarSubMenus) {
            const parentMenu = await SidebarMenu.findById(subMenu.sidebar_menu_id);
            if (!parentMenu || !parentMenu.is_active || !parentMenu.sidebar_display) continue;

            const menuId = parentMenu._id.toString();
            
            if (!globalMenuMap.has(menuId)) {
              globalMenuMap.set(menuId, {
                id: parentMenu._id.toString(),
                menu: parentMenu.menu,
                icon: parentMenu.icon,
                url: parentMenu.url,
                lang_key: parentMenu.lang_key,
                display_order: parentMenu.display_order,
                level: parentMenu.level,
                sub_menus: new Map()
              });
            }

            const subMenuId = subMenu._id.toString();
            if (!globalMenuMap.get(menuId).sub_menus.has(subMenuId)) {
              globalMenuMap.get(menuId).sub_menus.set(subMenuId, {
                id: subMenu._id.toString(),
                sub_menu: subMenu.sub_menu,
                icon: subMenu.icon,
                url: subMenu.url,
                lang_key: subMenu.lang_key,
                display_order: subMenu.display_order,
                level: subMenu.level,
                is_active: subMenu.is_active,
                permission_categories: []
              });
            }

            // Add permission category to this sub-menu (only if can_view is true)
            globalMenuMap.get(menuId).sub_menus.get(subMenuId).permission_categories.push({
              id: permCategory._id.toString(),
              name: permCategory.name,
              short_code: permCategory.short_code,
              description: permCategory.description,
              can_view: rolePerm.can_view,
              can_add: rolePerm.can_add,
              can_edit: rolePerm.can_edit,
              can_delete: rolePerm.can_delete
            });
          }
        }

        // Format role data to match the API documentation structure
        rolesData.push({
          employee_role_id: empRole._id.toString(),
          role_id: empRole.role_id.toString(),
          branch_id: empRole.branch_id ? empRole.branch_id.toString() : null,
          is_primary: empRole.is_primary,
          is_active: empRole.is_active,
          assigned_date: empRole.created_at,
          role_details: {
            id: role._id.toString(),
            name: role.name,
            slug: role.slug,
            description: role.description,
            priority: role.priority,
            is_system: role.is_system
          },
          branch_details: branch ? {
            id: branch._id.toString(),
            name: branch.name,
            code: branch.code,
            city: branch.city,
            state: branch.state,
            country: branch.country
          } : null
        });
      }

      // Convert maps to arrays and sort, filtering out empty sub-menus
      // Only include sub-menus with can_view: true permission categories
      const filteredSidebarMenus = Array.from(globalMenuMap.values()).map(menu => ({
        ...menu,
        sub_menus: Array.from(menu.sub_menus.values())
          .filter(subMenu => subMenu.permission_categories.some(pc => pc.can_view === true))
          .sort((a, b) => a.display_order - b.display_order)
      })).filter(menu => menu.sub_menus.length > 0)
        .sort((a, b) => a.display_order - b.display_order);

      const profileData = {
        employee_details: employee.toObject(),
        branch_details: branch ? branch.toObject() : null,
        role_details: rolesData,
        sidebar_menus: filteredSidebarMenus
      };

      res.status(200).json({
        success: true,
        message: 'Employee profile retrieved successfully',
        data: profileData
      });

    } else {
      // Sequelize implementation with proper joins including EmployeeRole
      // First check if employee exists and is superadmin
      const employee = await Employee.findByPk(parseInt(id), {
        attributes: { exclude: ['password'] }
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee is superadmin - if yes, return all data without role restrictions
      if (employee.is_superadmin) {
        // Get basic employee details with relationships
        const employeeWithDetails = await Employee.findByPk(parseInt(id), {
          attributes: { exclude: ['password'] },
          include: [
            {
              model: Branch,
              attributes: ['id', 'name', 'code', 'address', 'city', 'state', 'country', 'phone', 'email'],
              required: false
            },
            {
              model: Department,
              attributes: ['id', 'name', 'short_code', 'description'],
              required: false
            },
            {
              model: Designation,
              attributes: ['id', 'name', 'short_code', 'description'],
              required: false
            },
            {
              model: Employee,
              as: 'Manager',
              attributes: ['id', 'employee_id', 'first_name', 'last_name', 'email'],
              include: [
                {
                  model: Designation,
                  attributes: ['name'],
                  required: false
                }
              ],
              required: false
            }
          ]
        });

        // Get all roles, permission categories, and sidebar menus for superadmin
        const allRoles = await Role.findAll({
          where: { is_active: true },
          attributes: ['id', 'name', 'slug', 'description', 'priority', 'is_system']
        });

        const allSidebarMenus = await SidebarMenu.findAll({
          where: { 
            is_active: true,
            sidebar_display: true 
          },
          attributes: ['id', 'menu', 'icon', 'url', 'lang_key', 'display_order', 'level'],
          order: [['display_order', 'ASC']]
        });

        const allSidebarSubMenus = await SidebarSubMenu.findAll({
          where: { 
            is_active: true,
            sidebar_display: true 
          },
          attributes: ['id', 'sub_menu', 'icon', 'url', 'lang_key', 'display_order', 'level', 'sidebar_menu_id', 'permission_category_id', 'is_active'],
          include: [
            {
              model: PermissionCategory,
              as: 'PermissionCategory',
              attributes: ['id', 'name', 'short_code', 'description'],
              required: false
            }
          ],
          order: [['display_order', 'ASC']]
        });

        // Structure superadmin data with filtered sidebar menus
        const menuMap = new Map();
        
        allSidebarMenus.forEach(menu => {
          const relatedSubMenus = allSidebarSubMenus.filter(subMenu => 
            subMenu.sidebar_menu_id === menu.id
          );
          
          if (relatedSubMenus.length > 0) {
            const subMenusData = relatedSubMenus.map(subMenu => {
              const permissionCategories = [];
              
              // Add permission category if it exists for this sub-menu (superadmin has all permissions)
              if (subMenu.PermissionCategory) {
                permissionCategories.push({
                  id: subMenu.PermissionCategory.id,
                  name: subMenu.PermissionCategory.name,
                  short_code: subMenu.PermissionCategory.short_code,
                  description: subMenu.PermissionCategory.description,
                  can_view: true,
                  can_add: true,
                  can_edit: true,
                  can_delete: true
                });
              }
              
              // Only include sub-menu if it has permission categories
              if (permissionCategories.length > 0) {
                return {
                  id: subMenu.id,
                  sub_menu: subMenu.sub_menu,
                  icon: subMenu.icon,
                  url: subMenu.url,
                  lang_key: subMenu.lang_key,
                  display_order: subMenu.display_order,
                  level: subMenu.level,
                  is_active: subMenu.is_active,
                  permission_categories: permissionCategories
                };
              }
              return null;
            }).filter(subMenu => subMenu !== null).sort((a, b) => a.display_order - b.display_order);
            
            // Only include menu if it has viewable sub-menus
            if (subMenusData.length > 0) {
              menuMap.set(menu.id, {
                id: menu.id,
                menu: menu.menu,
                icon: menu.icon,
                url: menu.url,
                lang_key: menu.lang_key,
                display_order: menu.display_order,
                level: menu.level,
                sub_menus: subMenusData
              });
            }
          }
        });

        const superadminRoleData = allRoles.map(role => ({
          employee_role_id: 'superadmin',
          role_id: role.id,
          branch_id: null,
          is_primary: true,
          is_active: true,
          assigned_date: employeeWithDetails.created_at,
          role_details: {
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            priority: role.priority,
            is_system: role.is_system
          },
          branch_details: null
        }));        // Filter sidebar menus to only include those with can_view: true (all are true for superadmin)
        const filteredSidebarMenus = Array.from(menuMap.values())
          .sort((a, b) => a.display_order - b.display_order);

        const profileData = {
          employee_details: employeeWithDetails.toJSON(),
          branch_details: employeeWithDetails.Branch ? employeeWithDetails.Branch.toJSON() : null,
          role_details: superadminRoleData,
          sidebar_menus: filteredSidebarMenus
        };

        return res.status(200).json({
          success: true,
          message: 'Superadmin employee profile retrieved successfully',
          data: profileData
        });
      }      // Regular employee - proceed with role-based joins
      const employeeWithRoles = await Employee.findByPk(parseInt(id), {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Branch,
            attributes: ['id', 'name', 'code', 'address', 'city', 'state', 'country', 'phone', 'email'],
            required: false
          },
          {
            model: Department,
            attributes: ['id', 'name', 'short_code', 'description'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code', 'description'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'employee_id', 'first_name', 'last_name', 'email'],
            include: [
              {
                model: Designation,
                attributes: ['name'],
                required: false
              }
            ],
            required: false
          },
          {
            model: EmployeeRole,
            as: 'EmployeeRoles',
            where: {
              is_active: true,
              deleted_at: null
            },
            include: [
              {
                model: Role,
                as: 'Role',
                attributes: ['id', 'name', 'slug', 'description', 'priority', 'is_system'],
                include: [
                  {
                    model: RolePermission,
                    as: 'RolePermissions',
                    where: { 
                      is_active: true
                    },
                    include: [
                      {
                        model: PermissionCategory,
                        as: 'PermissionCategory',
                        attributes: ['id', 'name', 'short_code', 'description'],
                        include: [
                          {
                            model: SidebarSubMenu,
                            as: 'SidebarSubMenus',
                            where: { 
                              is_active: true,
                              sidebar_display: true 
                            },
                            include: [
                              {
                                model: SidebarMenu,
                                as: 'ParentMenu',
                                attributes: ['id', 'menu', 'icon', 'url', 'lang_key', 'display_order', 'level'],
                                where: {
                                  is_active: true,
                                  sidebar_display: true
                                },
                                required: false
                              }
                            ],
                            required: false
                          }
                        ],
                        required: false
                      }
                    ],
                    required: false
                  }
                ],
                required: false
              },
              {
                model: Branch,
                as: 'Branch',
                attributes: ['id', 'name', 'code', 'city', 'state', 'country'],
                required: false
              }
            ],
            required: false,
            order: [['is_primary', 'DESC'], ['created_at', 'ASC']]
          }
        ]
      });

      if (!employeeWithRoles) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Structure the role data and extract filtered sidebar menus
      const rolesData = [];
      const globalMenuMap = new Map();

      employeeWithRoles.EmployeeRoles.forEach(empRole => {
        const roleData = {
          employee_role_id: empRole.id,
          role_id: empRole.role_id,
          branch_id: empRole.branch_id,
          is_primary: empRole.is_primary,
          is_active: empRole.is_active,
          assigned_date: empRole.created_at,
          role_details: empRole.Role ? {
            id: empRole.Role.id,
            name: empRole.Role.name,
            slug: empRole.Role.slug,
            description: empRole.Role.description,
            priority: empRole.Role.priority,
            is_system: empRole.Role.is_system
          } : null,
          branch_details: empRole.Branch ? {
            id: empRole.Branch.id,
            name: empRole.Branch.name,
            code: empRole.Branch.code,
            city: empRole.Branch.city,
            state: empRole.Branch.state,
            country: empRole.Branch.country
          } : null
        };

        // Group permissions by sidebar menus and sub-menus for global sidebar
        if (empRole.Role && empRole.Role.RolePermissions) {
          empRole.Role.RolePermissions.forEach(rolePerm => {
            if (!rolePerm.PermissionCategory || !rolePerm.PermissionCategory.SidebarSubMenus) return;
            
            rolePerm.PermissionCategory.SidebarSubMenus.forEach(subMenu => {
              if (!subMenu.ParentMenu) return;
              
              const menuId = subMenu.ParentMenu.id;
              
              if (!globalMenuMap.has(menuId)) {
                globalMenuMap.set(menuId, {
                  id: subMenu.ParentMenu.id,
                  menu: subMenu.ParentMenu.menu,
                  icon: subMenu.ParentMenu.icon,
                  url: subMenu.ParentMenu.url,
                  lang_key: subMenu.ParentMenu.lang_key,
                  display_order: subMenu.ParentMenu.display_order,
                  level: subMenu.ParentMenu.level,
                  sub_menus: new Map()
                });
              }
              
              const subMenuId = subMenu.id;
              if (!globalMenuMap.get(menuId).sub_menus.has(subMenuId)) {
                globalMenuMap.get(menuId).sub_menus.set(subMenuId, {
                  id: subMenu.id,
                  sub_menu: subMenu.sub_menu,
                  icon: subMenu.icon,
                  url: subMenu.url,
                  lang_key: subMenu.lang_key,
                  display_order: subMenu.display_order,
                  level: subMenu.level,
                  is_active: subMenu.is_active,
                  permission_categories: []
                });
              }
              
              // Add permission category with CRUD permissions to this sub-menu 
              globalMenuMap.get(menuId).sub_menus.get(subMenuId).permission_categories.push({
                id: rolePerm.PermissionCategory.id,
                name: rolePerm.PermissionCategory.name,
                short_code: rolePerm.PermissionCategory.short_code,
                description: rolePerm.PermissionCategory.description,
                can_view: rolePerm.can_view,
                can_add: rolePerm.can_add,
                can_edit: rolePerm.can_edit,
                can_delete: rolePerm.can_delete
              });
            });
          });
        }

        rolesData.push(roleData);
      });

      // Convert maps to arrays and sort, filtering out empty sub-menus
      // Only include sub-menus with can_view: true permission categories
      const filteredSidebarMenus = Array.from(globalMenuMap.values()).map(menu => ({
        ...menu,
        sub_menus: Array.from(menu.sub_menus.values())
          .filter(subMenu => subMenu.permission_categories.some(pc => pc.can_view === true))
          .sort((a, b) => a.display_order - b.display_order)
      })).filter(menu => menu.sub_menus.length > 0)
        .sort((a, b) => a.display_order - b.display_order);
      
      // Clean employee details by removing nested EmployeeRoles to avoid duplication
      const cleanEmployeeDetails = { ...employeeWithRoles.toJSON() };
      delete cleanEmployeeDetails.EmployeeRoles; // Remove the nested structure

      const profileData = {
        employee_details: cleanEmployeeDetails,
        branch_details: employeeWithRoles.Branch ? employeeWithRoles.Branch.toJSON() : null,
        role_details: rolesData,
        sidebar_menus: filteredSidebarMenus
      };

      res.status(200).json({
        success: true,
        message: 'Employee profile retrieved successfully',
        data: profileData
      });
    }
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee profile',
      error: error.message
    });  }
};

// Get employees organized by branch
exports.getEmployeesByBranch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // First, get all branches
    let branches;
    if (dbType === 'mongodb') {
      branches = await Branch.find({}).sort({ name: 1 });
    } else {
      branches = await Branch.findAll({
        order: [['name', 'ASC']]
      });
    }

    // Filter options for employees
    const employeeFilters = {};
    if (req.query.is_active !== undefined) {
      employeeFilters.is_active = req.query.is_active === 'true';
    }
    if (req.query.department_id) {
      employeeFilters.department_id = parseInt(req.query.department_id);
    }
    if (req.query.designation_id) {
      employeeFilters.designation_id = parseInt(req.query.designation_id);
    }
    if (req.query.employment_status) {
      employeeFilters.employment_status = req.query.employment_status;
    }

    // Search by name, employee_id, or email
    let searchCondition = {};
    if (req.query.search) {
      if (dbType === 'mongodb') {
        searchCondition = {
          $or: [
            { first_name: { $regex: req.query.search, $options: 'i' } },
            { last_name: { $regex: req.query.search, $options: 'i' } },
            { employee_id: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        };
      } else {
        const Op = Sequelize.Op;
        searchCondition = {
          [Op.or]: [
            { first_name: { [Op.like]: `%${req.query.search}%` } },
            { last_name: { [Op.like]: `%${req.query.search}%` } },
            { employee_id: { [Op.like]: `%${req.query.search}%` } },
            { email: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }
    }

    let branchesWithEmployees = [];
    let totalEmployeesCount = 0;

    if (dbType === 'mongodb') {
      // For MongoDB
      for (const branch of branches) {
        const branchEmployees = await Employee.find({
          ...employeeFilters,
          ...searchCondition,
          branch_id: branch.id
        })
          .select('-password')
          .sort({ first_name: 1, last_name: 1 })
          .skip(offset)
          .limit(limit);
        
        const employeeCount = await Employee.countDocuments({
          ...employeeFilters,
          ...searchCondition,
          branch_id: branch.id
        });

        totalEmployeesCount += employeeCount;

        if (branchEmployees.length > 0) {
          branchesWithEmployees.push({
            branch: {
              id: branch.id,
              name: branch.name,
              code: branch.code,
              location: branch.city
            },
            employees: branchEmployees,
            employeeCount
          });
        }
      }
    } else {
      // For SQL databases
      // Handle employees with no branch separately
      const Op = Sequelize.Op;
      const queryOptions = {
        where: {
          ...employeeFilters,
          ...searchCondition
        },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ],
        order: [['first_name', 'ASC'], ['last_name', 'ASC']]
      };

      // First, create a map of branch ids to branch data
      const branchMap = new Map();
      branches.forEach(branch => {
        branchMap.set(branch.id, {
          branch: {
            id: branch.id,
            name: branch.name,
            code: branch.code,
            location: branch.city
          },
          employees: [],
          employeeCount: 0
        });
      });

      // Add a special entry for employees with no branch
      branchMap.set(null, {
        branch: {
          id: null,
          name: "No Branch Assigned",
          code: "N/A",
          location: ""
        },
        employees: [],
        employeeCount: 0
      });

      // Now get all employees and count by branch
      const counts = await Employee.findAll({
        where: {
          ...employeeFilters,
          ...searchCondition
        },
        attributes: [
          'branch_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['branch_id']
      });

      // Add counts to branch data
      counts.forEach(countItem => {
        const branchId = countItem.branch_id;
        if (branchMap.has(branchId)) {
          branchMap.get(branchId).employeeCount = parseInt(countItem.get('count'));
          totalEmployeesCount += parseInt(countItem.get('count'));
        }
      });

      // Now get the paginated employees for each branch
      for (const [branchId, branchData] of branchMap.entries()) {
        if (branchData.employeeCount > 0) {
          const branchEmployees = await Employee.findAll({
            ...queryOptions,
            where: {
              ...queryOptions.where,
              branch_id: branchId
            },
            limit,
            offset
          });

          if (branchEmployees.length > 0) {
            branchData.employees = branchEmployees;
            branchesWithEmployees.push(branchData);
          }
        }
      }
    }

    // Sort branches by name
    branchesWithEmployees.sort((a, b) => {
      if (a.branch.id === null) return 1; // Move "No Branch Assigned" to the end
      if (b.branch.id === null) return -1;
      return a.branch.name.localeCompare(b.branch.name);
    });

    res.status(200).json({
      success: true,
      data: branchesWithEmployees,
      pagination: {
        total: totalEmployeesCount,
        page,
        limit,
        pages: Math.ceil(totalEmployeesCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees by branch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees by branch',
      error: error.message
    });
  }
};

// Get employees for a specific branch ID
exports.getEmployeesByBranchId = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    
    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: 'Branch ID is required'
      });
    }

    // Check if branch exists
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filter options
    const filters = { branch_id: branchId };
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true';
    }
    if (req.query.department_id) {
      filters.department_id = parseInt(req.query.department_id);
    }
    if (req.query.designation_id) {
      filters.designation_id = parseInt(req.query.designation_id);
    }
    if (req.query.employment_status) {
      filters.employment_status = req.query.employment_status;
    }

    // Search by name, employee_id, or email
    if (req.query.search) {
      if (dbType === 'mongodb') {
        filters.$or = [
          { first_name: { $regex: req.query.search, $options: 'i' } },
          { last_name: { $regex: req.query.search, $options: 'i' } },
          { employee_id: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ];
      } else {
        // For SQL databases, we'll handle this in the query options
      }
    }

    let employees;
    let total;

    if (dbType === 'mongodb') {
      // MongoDB query
      total = await Employee.countDocuments(filters);
      employees = await Employee.find(filters)
        .select('-password') // Exclude password field
        .sort({ first_name: 1, last_name: 1 })
        .skip(offset)
        .limit(limit);
    } else {
      // Sequelize query (MySQL or PostgreSQL)
      const queryOptions = {
        where: filters,
        limit,
        offset,
        order: [['first_name', 'ASC'], ['last_name', 'ASC']],
        attributes: { exclude: ['password'] }, // Exclude password field
        include: [
          {
            model: Department,
            attributes: ['id', 'name'],
            required: false
          },
          {
            model: Designation,
            attributes: ['id', 'name', 'short_code'],
            required: false
          },
          {
            model: Employee,
            as: 'Manager',
            attributes: ['id', 'first_name', 'last_name', 'employee_id'],
            required: false
          }
        ]
      };

      // Add search functionality for SQL databases
      if (req.query.search) {
        const Op = Sequelize.Op;
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { first_name: { [Op.like]: `%${req.query.search}%` } },
            { last_name: { [Op.like]: `%${req.query.search}%` } },
            { employee_id: { [Op.like]: `%${req.query.search}%` } },
            { email: { [Op.like]: `%${req.query.search}%` } }
          ]
        };
      }

      const result = await Employee.findAndCountAll(queryOptions);
      employees = result.rows;
      total = result.count;
    }

    res.status(200).json({
      success: true,
      data: {
        branch: {
          id: branch.id,
          name: branch.name,
          code: branch.code,
          location: branch.city
        },
        employees,
        employeeCount: total
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees for branch:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees for branch',
      error: error.message
    });
  }
};
