const { body, param } = require('express-validator');

const createCommentValidator = [
  param('reviewId')
    .isUUID()
    .withMessage('Review ID không hợp lệ'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Nội dung bình luận phải từ 1-500 ký tự'),
  body('parent_comment_id')
    .optional()
    .isUUID()
    .withMessage('Parent comment ID không hợp lệ'),
];

const updateCommentValidator = [
  param('id')
    .isUUID()
    .withMessage('Comment ID không hợp lệ'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Nội dung bình luận phải từ 1-500 ký tự'),
];

const commentIdValidator = [
  param('id')
    .isUUID()
    .withMessage('Comment ID không hợp lệ'),
];

const reviewIdValidator = [
  param('reviewId')
    .isUUID()
    .withMessage('Review ID không hợp lệ'),
];

module.exports = {
  createCommentValidator,
  updateCommentValidator,
  commentIdValidator,
  reviewIdValidator,
};
