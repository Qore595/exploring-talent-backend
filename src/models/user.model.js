const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

let User;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;

  const userSchema = new Schema({
    employee_id: {
      type: Number,
      default: null
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      trim: true
    },
    first_name: {
      type: String,
      trim: true
    },
    last_name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    profile_image: {
      type: String,
      trim: true
    },

    // Authentication Methods
    auth_type: {
      type: [String],
      enum: ['password', 'google', 'phone_otp'],
      default: ['password']
    },

    // Google Auth Fields
    google_id: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    google_avatar: {
      type: String,
      trim: true
    },
    google_refresh_token: {
      type: String,
      trim: true
    },

    // Phone Authentication
    phone_verified: {
      type: Boolean,
      default: false
    },
    phone_verification_code: {
      type: String,
      trim: true
    },
    phone_verification_sent_at: Date,
    phone_verification_attempts: {
      type: Number,
      default: 0
    },

    // Email Verification
    email_verified: {
      type: Boolean,
      default: false
    },
    email_verification_token: {
      type: String,
      trim: true
    },
    email_verification_sent_at: Date,

    // Security
    last_login: Date,
    login_attempts: {
      type: Number,
      default: 0
    },
    login_locked_until: Date,
    password_reset_token: {
      type: String,
      trim: true
    },
    password_reset_expires: Date,
    remember_token: {
      type: String,
      trim: true
    },
    two_factor_enabled: {
      type: Boolean,
      default: false
    },
    two_factor_secret: {
      type: String,
      trim: true
    },

    // User Settings
    user_type: {
      type: String,
      enum: ['admin', 'staff', 'customer', 'vendor', 'system'],
      default: 'staff'
    },
    default_branch_id: Number,
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },

    // Status
    is_active: {
      type: Boolean,
      default: true
    },
    is_system: {
      type: Boolean,
      default: false
    },
    must_change_password: {
      type: Boolean,
      default: false
    },

    // Audit
    created_by: Number,
    updated_by: Number,
    deleted_at: Date
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'users'
  });

  // Add indexes
  userSchema.index({ employee_id: 1 });
  userSchema.index({ username: 1 }, { unique: true, sparse: true });
  userSchema.index({ email: 1 }, { unique: true });
  userSchema.index({ google_id: 1 }, { unique: true, sparse: true });
  userSchema.index({ user_type: 1 });
  userSchema.index({ is_active: 1 });

  // Hash password before saving
  userSchema.pre('save', async function(next) {
    if (this.isModified('password') && this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

  // Method to compare password
  userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User = mongoose.model('User', userSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  User = sequelize.define('User', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employee_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Employees',
        key: 'id'
      }
    },
    username: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    email: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'Null if using only social/OTP auth'
    },
    first_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    last_name: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    profile_image: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },

    // Authentication Methods
    auth_type: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'password',
      comment: 'Comma-separated list of auth types: password,google,phone_otp'
    },

    // Google Auth Fields
    google_id: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    google_avatar: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    google_refresh_token: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },

    // Phone Authentication
    phone_verified: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    phone_verification_code: {
      type: Sequelize.DataTypes.STRING(10),
      allowNull: true
    },
    phone_verification_sent_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    phone_verification_attempts: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    // Email Verification
    email_verified: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    email_verification_token: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    email_verification_sent_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },

    // Security
    last_login: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    login_attempts: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    login_locked_until: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    password_reset_token: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_expires: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    remember_token: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    two_factor_enabled: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    two_factor_secret: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },

    // User Settings
    user_type: {
      type: Sequelize.DataTypes.ENUM('admin', 'staff', 'customer', 'vendor', 'system'),
      allowNull: false,
      defaultValue: 'staff'
    },
    default_branch_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Branches',
        key: 'id'
      }
    },
    language: {
      type: Sequelize.DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en'
    },
    timezone: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'UTC'
    },

    // Status
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_system: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'System users cannot be modified'
    },
    must_change_password: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    // Audit
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Employees',
        key: 'id'
      }
    },
    updated_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Employees',
        key: 'id'
      }
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // Soft deletes
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  // Instance method to compare password
  User.prototype.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  };
}

module.exports = User;
