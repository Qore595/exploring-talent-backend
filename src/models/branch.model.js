const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let Branch;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const branchSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    address: String,
    landmark: String,
    city: String,
    district: String,
    state: String,
    country: String,
    postal_code: String,
    phone: String,
    alt_phone: String,
    email: String,
    fax: String,
    manager_id: Number,
    description: String,
    location_lat: Number,
    location_lng: Number,
    google_maps_url: String,
    working_hours: String,
    timezone: String,
    logo_url: String,
    website_url: String,
    support_email: String,
    support_phone: String,
    branch_type: {
      type: String,
      enum: ['head_office', 'regional', 'franchise', 'warehouse'],
      default: 'regional'
    },
    opening_date: Date,
    last_renovated: Date,
    monthly_rent: Number,
    owned_or_rented: {
      type: String,
      enum: ['owned', 'rented'],
      default: 'owned'
    },
    no_of_employees: {
      type: Number,
      default: 0
    },
    fire_safety_certified: {
      type: Boolean,
      default: false
    },
    is_default: {
      type: Boolean,
      default: false,
      required: true
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true
    },
    created_by: {
      type: Number,
      required: true
    },
    deleted_at: Date
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'branches'
  });
  
  // Add indexes
  branchSchema.index({ is_active: 1 });
  branchSchema.index({ is_default: 1 });
  branchSchema.index({ city: 1 });
  branchSchema.index({ state: 1 });
  branchSchema.index({ country: 1 });
  branchSchema.index({ branch_type: 1 });
  
  Branch = mongoose.model('Branch', branchSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  Branch = sequelize.define('Branch', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.DataTypes.STRING(200),
      allowNull: false
    },
    code: {
      type: Sequelize.DataTypes.STRING(50),
      unique: true,
      allowNull: true
    },
    slug: {
      type: Sequelize.DataTypes.STRING(100),
      unique: true,
      allowNull: true
    },
    address: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    landmark: {
      type: Sequelize.DataTypes.STRING(200),
      allowNull: true
    },
    city: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    district: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    country: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    postal_code: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    phone: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    alt_phone: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    fax: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true
    },
    manager_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    location_lat: {
      type: Sequelize.DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    location_lng: {
      type: Sequelize.DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    google_maps_url: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    working_hours: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    timezone: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    logo_url: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    website_url: {
      type: Sequelize.DataTypes.STRING(200),
      allowNull: true
    },
    support_email: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    support_phone: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: true
    },
    branch_type: {
      type: Sequelize.DataTypes.ENUM('head_office', 'regional', 'franchise', 'warehouse'),
      defaultValue: 'regional',
      allowNull: true
    },
    opening_date: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true
    },
    last_renovated: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true
    },
    monthly_rent: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    owned_or_rented: {
      type: Sequelize.DataTypes.ENUM('owned', 'rented'),
      defaultValue: 'owned',
      allowNull: true
    },
    no_of_employees: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    fire_safety_certified: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    is_default: {
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
      allowNull: false
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
    },
    deleted_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'branches',
    timestamps: false,
    indexes: [
      { fields: ['is_active'] },
      { fields: ['is_default'] },
      { fields: ['city'] },
      { fields: ['state'] },
      { fields: ['country'] },
      { fields: ['branch_type'] }
    ]
  });
}

module.exports = Branch;
