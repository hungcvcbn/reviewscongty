const { body, param } = require('express-validator');

const createResponseValidator = [
  param('reviewId')
    .isUUID()
    .withMessage('Review ID không hợp lệ'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Nội dung phản hồi phải từ 10-2000 ký tự'),
];

const updateResponseValidator = [
  param('id')
    .isUUID()
    .withMessage('Response ID không hợp lệ'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Nội dung phản hồi phải từ 10-2000 ký tự'),
];

const responseIdValidator = [
  param('id')
    .isUUID()
    .withMessage('Response ID không hợp lệ'),
];

module.exports = {
  createResponseValidator,
  updateResponseValidator,
  responseIdValidator,
};
