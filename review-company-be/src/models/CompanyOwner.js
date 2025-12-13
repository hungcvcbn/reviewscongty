const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CompanyOwner = sequelize.define('CompanyOwner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
}, {
  tableName: 'company_owners',
  indexes: [
    { fields: ['company_id'] },
    { fields: ['user_id'] },
    { unique: true, fields: ['company_id', 'user_id'] },
  ],
});

module.exports = CompanyOwner;
