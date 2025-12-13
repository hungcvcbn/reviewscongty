const { body, param, query } = require('express-validator');
const { REVIEW_STATUS } = require('../config/constants');

const createReviewValidator = [
  body('company_id')
    .isUUID()
    .withMessage('Company ID không hợp lệ'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tiêu đề tối đa 200 ký tự'),
  body('content')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Nội dung review phải từ 50-5000 ký tự'),
  body('overall_rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating phải từ 1-5'),
  body('is_anonymous')
    .optional()
    .isBoolean()
    .withMessage('is_anonymous phải là boolean'),
  body('ratings')
    .optional()
    .isArray()
    .withMessage('Ratings phải là mảng'),
  body('ratings.*.category_id')
    .optional()
    .isUUID()
    .withMessage('Category ID không hợp lệ'),
  body('ratings.*.rating_value')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value phải từ 1-5'),
  body('status')
    .optional()
    .isIn([REVIEW_STATUS.DRAFT, REVIEW_STATUS.PUBLISHED])
    .withMessage('Status không hợp lệ'),
];

const updateReviewValidator = [
  param('id')
    .isUUID()
    .withMessage('Review ID không hợp lệ'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tiêu đề tối đa 200 ký tự'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Nội dung review phải từ 50-5000 ký tự'),
  body('overall_rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating phải từ 1-5'),
  body('ratings')
    .optional()
    .isArray()
    .withMessage('Ratings phải là mảng'),
];

const reviewIdValidator = [
  param('id')
    .isUUID()
    .withMessage('Review ID không hợp lệ'),
];

const listReviewValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page phải là số nguyên dương'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit phải từ 1-100'),
  query('company_id')
    .optional()
    .isUUID()
    .withMessage('Company ID không hợp lệ'),
  query('user_id')
    .optional()
    .isUUID()
    .withMessage('User ID không hợp lệ'),
  query('status')
    .optional()
    .isIn(Object.values(REVIEW_STATUS))
    .withMessage('Status không hợp lệ'),
  query('minRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Min rating phải từ 1-5'),
  query('maxRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Max rating phải từ 1-5'),
];

module.exports = {
  createReviewValidator,
  updateReviewValidator,
  reviewIdValidator,
  listReviewValidator,
};
