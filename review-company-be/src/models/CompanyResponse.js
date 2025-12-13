const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CompanyResponse = sequelize.define('CompanyResponse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  review_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'reviews',
      key: 'id',
    },
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'company_responses',
  indexes: [
    { fields: ['review_id'] },
    { fields: ['company_id'] },
  ],
});

module.exports = CompanyResponse;
