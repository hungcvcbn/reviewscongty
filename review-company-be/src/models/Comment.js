const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
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
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  parent_comment_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  likes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'comments',
  indexes: [
    { fields: ['review_id'] },
    { fields: ['user_id'] },
    { fields: ['parent_comment_id'] },
  ],
});

module.exports = Comment;
