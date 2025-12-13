const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticate, optionalAuth, validate } = require('../middleware');
const {
  createReviewValidator,
  updateReviewValidator,
  reviewIdValidator,
  listReviewValidator,
} = require('../validators');

// Public routes
router.get('/', optionalAuth, validate(listReviewValidator), reviewController.getReviews);
router.get('/my-reviews', authenticate, reviewController.getMyReviews);
router.get('/:id', optionalAuth, validate(reviewIdValidator), reviewController.getReview);

// Protected routes
router.post('/', authenticate, validate(createReviewValidator), reviewController.createReview);
router.put('/:id', authenticate, validate(updateReviewValidator), reviewController.updateReview);
router.delete('/:id', authenticate, validate(reviewIdValidator), reviewController.deleteReview);
router.put('/:id/publish', authenticate, validate(reviewIdValidator), reviewController.publishReview);

module.exports = router;
