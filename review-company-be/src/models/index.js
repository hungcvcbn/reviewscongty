const { sequelize } = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const CompanyOwner = require('./CompanyOwner');
const CompanyCategory = require('./CompanyCategory');
const Review = require('./Review');
const RatingCategory = require('./RatingCategory');
const Rating = require('./Rating');
const Comment = require('./Comment');
const CommentLike = require('./CommentLike');
const CompanyResponse = require('./CompanyResponse');

// ========== Associations ==========

// User - Company (Creator)
Company.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Company, { foreignKey: 'created_by', as: 'createdCompanies' });

// Company - CompanyOwner - User
Company.hasMany(CompanyOwner, { foreignKey: 'company_id', as: 'owners' });
CompanyOwner.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
User.hasMany(CompanyOwner, { foreignKey: 'user_id', as: 'ownedCompanies' });
CompanyOwner.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Company - CompanyCategory
Company.hasMany(CompanyCategory, { foreignKey: 'company_id', as: 'categories' });
CompanyCategory.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Company - Review
Company.hasMany(Review, { foreignKey: 'company_id', as: 'reviews' });
Review.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User - Review
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Review - Rating
Review.hasMany(Rating, { foreignKey: 'review_id', as: 'ratings' });
Rating.belongsTo(Review, { foreignKey: 'review_id', as: 'review' });

// RatingCategory - Rating
RatingCategory.hasMany(Rating, { foreignKey: 'category_id', as: 'ratings' });
Rating.belongsTo(RatingCategory, { foreignKey: 'category_id', as: 'category' });

// Review - Comment
Review.hasMany(Comment, { foreignKey: 'review_id', as: 'comments' });
Comment.belongsTo(Review, { foreignKey: 'review_id', as: 'review' });

// User - Comment
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Comment - Comment (Nested/Replies)
Comment.hasMany(Comment, { foreignKey: 'parent_comment_id', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parent_comment_id', as: 'parentComment' });

// Comment - CommentLike
Comment.hasMany(CommentLike, { foreignKey: 'comment_id', as: 'likes' });
CommentLike.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });
User.hasMany(CommentLike, { foreignKey: 'user_id', as: 'likedComments' });
CommentLike.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Review - CompanyResponse
Review.hasOne(CompanyResponse, { foreignKey: 'review_id', as: 'companyResponse' });
CompanyResponse.belongsTo(Review, { foreignKey: 'review_id', as: 'review' });

// Company - CompanyResponse
Company.hasMany(CompanyResponse, { foreignKey: 'company_id', as: 'responses' });
CompanyResponse.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User - CompanyResponse
User.hasMany(CompanyResponse, { foreignKey: 'user_id', as: 'companyResponses' });
CompanyResponse.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Sync all models with database
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Error syncing database:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Company,
  CompanyOwner,
  CompanyCategory,
  Review,
  RatingCategory,
  Rating,
  Comment,
  CommentLike,
  CompanyResponse,
  syncDatabase,
};
