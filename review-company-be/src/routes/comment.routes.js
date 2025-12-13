const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/comment.controller');
const { authenticate, validate } = require('../middleware');
const {
  createCommentValidator,
  reviewIdValidator,
} = require('../validators');

// Routes for /api/reviews/:reviewId/comments
router.get('/', validate(reviewIdValidator), commentController.getComments);
router.post('/', authenticate, validate(createCommentValidator), commentController.createComment);

module.exports = router;
