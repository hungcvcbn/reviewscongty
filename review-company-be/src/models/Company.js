const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { COMPANY_STATUS } = require('../config/constants');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(COMPANY_STATUS)),
    defaultValue: COMPANY_STATUS.PENDING,
    allowNull: false,
  },
  avg_rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'companies',
  indexes: [
    { fields: ['status'] },
    { fields: ['name'] },
    { fields: ['avg_rating'] },
  ],
});

module.exports = Company;
