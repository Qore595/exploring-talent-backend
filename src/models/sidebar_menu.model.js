const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let SidebarMenu;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const sidebarMenuSchema = new Schema({
    permission_group_id: {
      type: Number,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    menu: {
      type: String,
      default: null
    },
    activate_menu: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    lang_key: {
      type: String,
      required: true
    },
    system_level: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: null
    },
    display_order: {
      type: Number,
      default: 0,
      required: true
    },
    sidebar_display: {
      type: Boolean,
      default: false
    },
    access_permissions: {
      type: String,
      default: null
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true
    },
    is_system: {
      type: Boolean,
      default: false,
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
    deleted_at: Date
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'sidebar_menus'
  });
  
  // Add indexes
  sidebarMenuSchema.index({ permission_group_id: 1 });
  sidebarMenuSchema.index({ is_active: 1 });
  sidebarMenuSchema.index({ is_system: 1 });
  sidebarMenuSchema.index({ display_order: 1 });
  sidebarMenuSchema.index({ level: 1 });
  sidebarMenuSchema.index({ system_level: 1 });
  sidebarMenuSchema.index({ sidebar_display: 1 });
  sidebarMenuSchema.index({ lang_key: 1 });
  
  SidebarMenu = mongoose.model('SidebarMenu', sidebarMenuSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  SidebarMenu = sequelize.define('SidebarMenu', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    permission_group_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    icon: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    menu: {
      type: Sequelize.DataTypes.STRING(500),
      allowNull: true
    },
    activate_menu: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    url: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
    lang_key: {
      type: Sequelize.DataTypes.STRING(250),
      allowNull: false
    },
    system_level: {
      type: Sequelize.DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: true
    },
    level: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    display_order: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    sidebar_display: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    access_permissions: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    is_system: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'System menus cannot be modified'
    },
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    updated_by: {
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
    },
    deleted_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'sidebar_menus',
    timestamps: false,
    indexes: [
      { fields: ['permission_group_id'] },
      { fields: ['is_active'] },
      { fields: ['is_system'] },
      { fields: ['display_order'] },
      { fields: ['level'] },
      { fields: ['system_level'] },
      { fields: ['sidebar_display'] },
      { fields: ['lang_key'] }
    ]
  });
}

module.exports = SidebarMenu;
