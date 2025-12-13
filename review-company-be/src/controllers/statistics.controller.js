const { Company, Review, User, Comment } = require('../models');
const { asyncHandler } = require('../middleware');
const { formatSuccess } = require('../utils');
const { COMPANY_STATUS, REVIEW_STATUS } = require('../config/constants');
const { Op } = require('sequelize');

// @desc    Get overall statistics
// @route   GET /api/statistics
// @access  Public
const getStatistics = asyncHandler(async (req, res) => {
  // Get counts
  const [
    totalCompanies,
    totalReviews,
    totalUsers,
    totalComments,
  ] = await Promise.all([
    Company.count({ where: { status: COMPANY_STATUS.ACTIVE } }),
    Review.count({ where: { status: REVIEW_STATUS.PUBLISHED } }),
    User.count({ where: { is_active: true } }),
    Comment.count({ where: { is_deleted: false } }),
  ]);

  // Get average rating across all companies
  const companiesWithRating = await Company.findAll({
    where: {
      status: COMPANY_STATUS.ACTIVE,
      avg_rating: { [Op.ne]: null },
    },
    attributes: ['avg_rating'],
  });

  const averageRating = companiesWithRating.length > 0
    ? Math.round(
        (companiesWithRating.reduce((sum, c) => sum + parseFloat(c.avg_rating), 0) / 
        companiesWithRating.length) * 100,
      ) / 100
    : 0;

  res.json(formatSuccess({
    totalCompanies,
    totalReviews,
    totalUsers,
    totalComments,
    averageRating,
  }));
});

// @desc    Get admin statistics
// @route   GET /api/statistics/admin
// @access  Private/Admin
const getAdminStatistics = asyncHandler(async (req, res) => {
  // Get company counts by status
  const [
    pendingCompanies,
    activeCompanies,
    inactiveCompanies,
    rejectedCompanies,
  ] = await Promise.all([
    Company.count({ where: { status: COMPANY_STATUS.PENDING } }),
    Company.count({ where: { status: COMPANY_STATUS.ACTIVE } }),
    Company.count({ where: { status: COMPANY_STATUS.INACTIVE } }),
    Company.count({ where: { status: COMPANY_STATUS.REJECTED } }),
  ]);

  // Get review counts by status
  const [
    publishedReviews,
    draftReviews,
    deletedReviews,
  ] = await Promise.all([
    Review.count({ where: { status: REVIEW_STATUS.PUBLISHED } }),
    Review.count({ where: { status: REVIEW_STATUS.DRAFT } }),
    Review.count({ where: { status: REVIEW_STATUS.DELETED } }),
  ]);

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    recentCompanies,
    recentReviews,
    recentUsers,
  ] = await Promise.all([
    Company.count({ where: { created_at: { [Op.gte]: sevenDaysAgo } } }),
    Review.count({ where: { created_at: { [Op.gte]: sevenDaysAgo } } }),
    User.count({ where: { created_at: { [Op.gte]: sevenDaysAgo } } }),
  ]);

  res.json(formatSuccess({
    companies: {
      pending: pendingCompanies,
      active: activeCompanies,
      inactive: inactiveCompanies,
      rejected: rejectedCompanies,
      total: pendingCompanies + activeCompanies + inactiveCompanies,
    },
    reviews: {
      published: publishedReviews,
      draft: draftReviews,
      deleted: deletedReviews,
      total: publishedReviews + draftReviews,
    },
    recentActivity: {
      companies: recentCompanies,
      reviews: recentReviews,
      users: recentUsers,
    },
  }));
});

module.exports = {
  getStatistics,
  getAdminStatistics,
};
