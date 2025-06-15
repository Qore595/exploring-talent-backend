const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');

let SidebarSubMenu;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const sidebarSubMenuSchema = new Schema({
    sidebar_menu_id: {
      type: Number,
      required: true
    },
    permission_category_id: {
      type: Number,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    sub_menu: {
      type: String,
      required: true
    },
    activate_menu: {
      type: String,
      default: null
    },
    url: {
      type: String,
      required: true
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
    collection: 'sidebar_sub_menus'
  });
  
  // Add indexes
  sidebarSubMenuSchema.index({ sidebar_menu_id: 1 });
  sidebarSubMenuSchema.index({ permission_category_id: 1 });
  sidebarSubMenuSchema.index({ is_active: 1 });
  sidebarSubMenuSchema.index({ is_system: 1 });
  sidebarSubMenuSchema.index({ display_order: 1 });
  sidebarSubMenuSchema.index({ level: 1 });
  sidebarSubMenuSchema.index({ system_level: 1 });
  sidebarSubMenuSchema.index({ sidebar_display: 1 });
  sidebarSubMenuSchema.index({ lang_key: 1 });
  
  SidebarSubMenu = mongoose.model('SidebarSubMenu', sidebarSubMenuSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  SidebarSubMenu = sequelize.define('SidebarSubMenu', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sidebar_menu_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    permission_category_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    icon: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    sub_menu: {
      type: Sequelize.DataTypes.STRING(500),
      allowNull: false
    },
    activate_menu: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    },
    url: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false
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
      comment: 'System sub-menus cannot be modified'
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
    tableName: 'sidebar_sub_menus',
    timestamps: false,
    indexes: [
      { fields: ['sidebar_menu_id'] },
      { fields: ['permission_category_id'] },
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

module.exports = SidebarSubMenu;
