const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CompanyCategory = sequelize.define('CompanyCategory', {
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
  category_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'company_categories',
  indexes: [
    { fields: ['company_id'] },
    { fields: ['category_name'] },
  ],
});

module.exports = CompanyCategory;
