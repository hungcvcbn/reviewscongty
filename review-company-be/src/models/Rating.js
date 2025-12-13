const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  review_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'reviews',
      key: 'id',
    },
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'rating_categories',
      key: 'id',
    },
  },
  rating_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  tableName: 'ratings',
  indexes: [
    { fields: ['review_id'] },
    { fields: ['category_id'] },
    { unique: true, fields: ['review_id', 'category_id'] },
  ],
});

module.exports = Rating;
