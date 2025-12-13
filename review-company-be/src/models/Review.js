const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { REVIEW_STATUS, MAX_REVIEW_EDIT_COUNT } = require('../config/constants');

const Review = sequelize.define('Review', {
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
  title: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  overall_rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  status: {
    type: DataTypes.ENUM(...Object.values(REVIEW_STATUS)),
    defaultValue: REVIEW_STATUS.PUBLISHED,
    allowNull: false,
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  edit_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      max: MAX_REVIEW_EDIT_COUNT,
    },
  },
}, {
  tableName: 'reviews',
  indexes: [
    { fields: ['company_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['overall_rating'] },
  ],
});

// Instance method to check if can edit
Review.prototype.canEdit = function () {
  return this.edit_count < MAX_REVIEW_EDIT_COUNT && this.status !== REVIEW_STATUS.DELETED;
};

module.exports = Review;
