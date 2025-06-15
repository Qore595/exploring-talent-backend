const { dbType, sequelize, mongoose, Sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

let PaymentConfiguration;

if (dbType === 'mongodb') {
  // MongoDB Schema
  const Schema = mongoose.Schema;
  
  const paymentConfigurationSchema = new Schema({
    _id: {
      type: String,
      default: () => uuidv4()
    },
    gateway_name: {
      type: String,
      required: true,
      trim: true
    },
    gateway_code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    live_values: {
      type: Object,
      default: null
    },
    test_values: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      enum: ['live', 'test'],
      default: 'test'
    },
    is_active: {
      type: Boolean,
      default: false
    },
    priority: {
      type: Number,
      default: 0
    },
    gateway_image: {
      type: String,
      trim: true,
      default: null
    },
    supports_recurring: {
      type: Boolean,
      default: false
    },
    supports_refunds: {
      type: Boolean,
      default: false
    },
    webhook_url: {
      type: String,
      trim: true,
      default: null
    },
    webhook_secret: {
      type: String,
      trim: true,
      default: null
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
    collection: 'payment_configurations'
  });

  // Add indexes
  paymentConfigurationSchema.index({ gateway_code: 1 }, { unique: true });
  paymentConfigurationSchema.index({ is_active: 1, priority: 1 });

  PaymentConfiguration = mongoose.model('PaymentConfiguration', paymentConfigurationSchema);
} else {
  // Sequelize Model (MySQL or PostgreSQL)
  PaymentConfiguration = sequelize.define('PaymentConfiguration', {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    gateway_name: {
      type: Sequelize.DataTypes.STRING(191),
      allowNull: false,
      comment: 'Friendly name of the payment gateway'
    },
    gateway_code: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Unique code identifier for the gateway (stripe, paypal, etc.)'
    },
    live_values: {
      type: Sequelize.DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'JSON configuration for live environment',
      get() {
        const rawValue = this.getDataValue('live_values');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('live_values', value ? JSON.stringify(value) : null);
      }
    },
    test_values: {
      type: Sequelize.DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'JSON configuration for test environment',
      get() {
        const rawValue = this.getDataValue('test_values');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('test_values', value ? JSON.stringify(value) : null);
      }
    },
    mode: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'test',
      comment: 'Current operation mode (live/test)'
    },
    is_active: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this gateway is active'
    },
    priority: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Sorting order for multiple active gateways'
    },
    gateway_image: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'Path to gateway logo'
    },
    supports_recurring: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether gateway supports recurring payments'
    },
    supports_refunds: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether gateway supports refunds'
    },
    webhook_url: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'Webhook URL for payment notifications'
    },
    webhook_secret: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      comment: 'Secret for webhook verification'
    },
    created_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    updated_by: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
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
      allowNull: true,
      comment: 'Soft delete timestamp'
    }
  }, {
    tableName: 'payment_configurations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // Enables soft deletes
    indexes: [
      {
        unique: true,
        fields: ['gateway_code'],
        name: 'gateway_code_unique'
      },
      {
        fields: ['is_active', 'priority'],
        name: 'is_active_priority_idx'
      }
    ]
  });
}

module.exports = PaymentConfiguration;
