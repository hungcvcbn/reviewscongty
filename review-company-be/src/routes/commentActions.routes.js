const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authenticate, validate } = require('../middleware');
const { updateCommentValidator, commentIdValidator } = require('../validators');

// Routes for /api/comments/:id
router.put('/:id', authenticate, validate(updateCommentValidator), commentController.updateComment);
router.delete('/:id', authenticate, validate(commentIdValidator), commentController.deleteComment);
router.post('/:id/like', authenticate, validate(commentIdValidator), commentController.toggleLike);
router.get('/:id/replies', validate(commentIdValidator), commentController.getReplies);

module.exports = router;
