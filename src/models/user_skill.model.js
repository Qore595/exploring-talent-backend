const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let UserSkill;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const userSkillSchema = new Schema({
    user_id: {
      type: String,
      required: true,
      ref: 'User'
    },
    skill_data: {
      type: Object,
      default: null,
      required: true
    },
    created_by: {
      type: Number,
      default: null
    },
    updated_by: {
      type: Number,
      default: null
    },
    deleted_at: {
      type: Date,
      default: null
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'user_skills'
  });

  // Add indexes
  userSkillSchema.index({ user_id: 1 });
  userSkillSchema.index({ 'skill_data.skill_name': 1 });
  userSkillSchema.index({ 'skill_data.proficiency_level': 1 });
  userSkillSchema.index({ 'skill_data.years_experience': 1 });

  UserSkill = mongoose.model('UserSkill', userSkillSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  UserSkill = sequelize.define('UserSkill', {
    id: {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Foreign key to users table',
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    skill_data: {
      type: Sequelize.DataTypes.JSON,
      allowNull: true,
      comment: 'JSON containing skill information'
    },
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      comment: 'User who created the record',
      references: {
        model: 'employees',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    updated_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      comment: 'User who last updated the record',
      references: {
        model: 'employees',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Creation timestamp'
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: 'Update timestamp'
    },
    deleted_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp'
    }
  }, {
    tableName: 'user_skills',
    timestamps: false,
    paranoid: true,
    deletedAt: 'deleted_at',
    indexes: [
      {
        name: 'user_id_idx',
        fields: ['user_id']
      }
    ]
  });
}

module.exports = UserSkill;
