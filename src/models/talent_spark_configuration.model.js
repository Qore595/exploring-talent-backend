const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let TalentSparkConfiguration;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const talentSparkConfigurationSchema = new Schema({
    branch_id: {
      type: Number,
      required: true,
      ref: 'Branch'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    overview: {
      type: String
    },
    
    // Core Call Configuration
    system_prompt: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    voice: {
      type: String,
      required: true,
      trim: true
    },
    api_key: {
      type: String,
      trim: true
    },
    language_hint: {
      type: String,
      default: 'en-US',
      trim: true
    },
    temperature: {
      type: Number,
      default: 0.70
    },
    max_duration: {
      type: String,
      default: '600s',
      trim: true
    },
    time_exceeded_message: {
      type: String
    },
    
    // Status
    is_active: {
      type: Boolean,
      default: true
    },
    is_default: {
      type: Boolean,
      default: false
    },
    version: {
      type: String,
      default: '1.0',
      trim: true
    },
    status: {
      type: String,
      enum: ['draft', 'testing', 'production', 'archived'],
      default: 'draft'
    },
    
    // Additional Settings
    callback_url: {
      type: String,
      trim: true
    },
    analytics_enabled: {
      type: Boolean,
      default: true
    },
    additional_settings: {
      type: Object,
      default: null
    },
    
    // Audit
    created_by: {
      type: Number,
      default: null
    },
    updated_by: {
      type: Number,
      default: null
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'talent_spark_configurations'
  });
  
  // Add indexes
  talentSparkConfigurationSchema.index({ branch_id: 1, name: 1 }, { unique: true });
  talentSparkConfigurationSchema.index({ branch_id: 1 });
  talentSparkConfigurationSchema.index({ is_active: 1 });
  talentSparkConfigurationSchema.index({ is_default: 1 });
  talentSparkConfigurationSchema.index({ status: 1 });
  
  TalentSparkConfiguration = mongoose.model('TalentSparkConfiguration', talentSparkConfigurationSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  TalentSparkConfiguration = sequelize.define('talent_spark_configuration', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    branch_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Related branch identifier',
      references: {
        model: 'branches',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'Configuration name for reference'
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'UI display title'
    },
    overview: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'UI display description'
    },
    
    // Core Call Configuration
    system_prompt: {
      type: Sequelize.TEXT,
      allowNull: false,
      comment: 'Master instruction set for the LLM'
    },
    model: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'LLM identifier (e.g., fixie-ai/ultravox-70B)'
    },
    voice: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'TTS voice ID'
    },
    api_key: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'API key for authentication with the voice/LLM service'
    },
    language_hint: {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: 'en-US',
      comment: 'Primary language for STT (e.g., en-US, es-MX)'
    },
    temperature: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.70,
      comment: 'LLM randomness/creativity (0.0-2.0)'
    },
    max_duration: {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: '600s',
      comment: 'Maximum call duration (e.g., 600s, 10m)'
    },
    time_exceeded_message: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Message when max duration is reached'
    },
    
    // Status
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether configuration is active'
    },
    is_default: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is the default configuration'
    },
    version: {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: '1.0',
      comment: 'Configuration version'
    },
    status: {
      type: Sequelize.ENUM('draft', 'testing', 'production', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
      comment: 'Current status'
    },
    
    // Additional Settings
    callback_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Optional webhook for call events'
    },
    analytics_enabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether to collect analytics'
    },
    additional_settings: {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Any additional configuration options'
    },
    
    // Audit
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'User who created the configuration'
    },
    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'User who last updated the configuration'
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Creation timestamp'
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Update timestamp'
    }
  }, {
    tableName: 'talent_spark_configurations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['branch_id', 'name'],
        name: 'branch_name_unique'
      },
      {
        fields: ['branch_id'],
        name: 'branch_id_idx'
      },
      {
        fields: ['is_active'],
        name: 'is_active_idx'
      },
      {
        fields: ['is_default'],
        name: 'is_default_idx'
      },
      {
        fields: ['status'],
        name: 'status_idx'
      }
    ]
  });
}

module.exports = TalentSparkConfiguration;
