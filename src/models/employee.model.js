const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

let Employee;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;

  const employeeSchema = new Schema({
    employee_id: {
      type: String,
      required: true,
      trim: true
    },
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    last_name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    phone: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    dob: Date,
    photo: String,

    branch_id: Number,
    department_id: Number,
    designation_id: Number,
    position: String,
    qualification: String,
    work_experience: String,
    hire_date: Date,
    date_of_leaving: Date,
    employment_status: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'intern', 'terminated'],
      default: 'full-time'
    },
    contract_type: String,
    work_shift: String,
    current_location: String,

    reporting_to: Number,
    emergency_contact: String,
    emergency_contact_relation: String,
    marital_status: String,
    father_name: String,
    mother_name: String,
    local_address: String,
    permanent_address: String,

    bank_account_name: String,
    bank_account_no: String,
    bank_name: String,
    bank_branch: String,
    ifsc_code: String,
    basic_salary: Number,

    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,

    resume: String,
    joining_letter: String,
    other_documents: String,

    notes: String,
    is_superadmin: {
      type: Boolean,
      default: false,
      required: true
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true
    },
    created_by: Number
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'employees'
  });

  // Add indexes
  employeeSchema.index({ employee_id: 1 });
  employeeSchema.index({ email: 1 }, { unique: true, sparse: true });
  employeeSchema.index({ branch_id: 1 });
  employeeSchema.index({ department_id: 1 });
  employeeSchema.index({ designation_id: 1 });
  employeeSchema.index({ reporting_to: 1 });
  employeeSchema.index({ employment_status: 1 });
  employeeSchema.index({ is_active: 1 });
  employeeSchema.index({ is_superadmin: 1 });

  // Hash password before saving
  employeeSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

  // Method to compare password
  employeeSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  Employee = mongoose.model('Employee', employeeSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  Employee = sequelize.define('Employee', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    employee_id: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false
    },
    first_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    phone: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    password: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false
    },
    gender: {
      type: Sequelize.DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    dob: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true
    },
    photo: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    branch_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    department_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    designation_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    position: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    qualification: {
      type: Sequelize.DataTypes.STRING(200),
      allowNull: true
    },
    work_experience: {
      type: Sequelize.DataTypes.STRING(200),
      allowNull: true
    },
    hire_date: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true
    },
    date_of_leaving: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true
    },
    employment_status: {
      type: Sequelize.DataTypes.ENUM('full-time', 'part-time', 'contract', 'intern', 'terminated'),
      defaultValue: 'full-time',
      allowNull: true
    },
    contract_type: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    work_shift: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true
    },
    current_location: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    reporting_to: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    emergency_contact: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    emergency_contact_relation: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true
    },
    marital_status: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    father_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    mother_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    local_address: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    permanent_address: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    bank_account_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    bank_account_no: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true
    },
    bank_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    bank_branch: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    ifsc_code: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    basic_salary: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    facebook: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    twitter: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    linkedin: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    instagram: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    resume: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    joining_letter: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    other_documents: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    is_superadmin: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    tableName: 'employees',
    timestamps: false,
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['email'], unique: true },
      { fields: ['branch_id'] },
      { fields: ['department_id'] },
      { fields: ['designation_id'] },
      { fields: ['reporting_to'] },
      { fields: ['employment_status'] },
      { fields: ['is_active'] },
      { fields: ['is_superadmin'] }
    ],
    hooks: {
      beforeCreate: async (employee) => {
        if (employee.password) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      },
      beforeUpdate: async (employee) => {
        if (employee.changed('password')) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      }
    }
  });

  // Instance method to compare password
  Employee.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
}

module.exports = Employee;
