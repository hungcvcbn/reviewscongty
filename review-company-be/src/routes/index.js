const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
const companyRoutes = require('./company.routes');
const reviewRoutes = require('./review.routes');
const commentRoutes = require('./comment.routes');
const commentActionsRoutes = require('./commentActions.routes');
const companyResponseRoutes = require('./companyResponse.routes');
const ratingCategoryRoutes = require('./ratingCategory.routes');
const statisticsRoutes = require('./statistics.routes');
const reviewController = require('../controllers/review.controller');
const ratingCategoryController = require('../controllers/ratingCategory.controller');
const { validate, optionalAuth } = require('../middleware');
const { listReviewValidator } = require('../validators');

// Mount routes
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/reviews', reviewRoutes);
router.use('/reviews/:reviewId/comments', commentRoutes);
router.use('/reviews', companyResponseRoutes);
router.use('/comments', commentActionsRoutes);
router.use('/company-responses', companyResponseRoutes);
router.use('/rating-categories', ratingCategoryRoutes);
router.use('/statistics', statisticsRoutes);

// Additional routes
router.get('/companies/:companyId/reviews', optionalAuth, validate(listReviewValidator), reviewController.getCompanyReviews);
router.get('/companies/:companyId/category-ratings', ratingCategoryController.getCompanyCategoryRatings);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
