const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RatingCategory = sequelize.define('RatingCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  display_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'rating_categories',
});

module.exports = RatingCategory;
