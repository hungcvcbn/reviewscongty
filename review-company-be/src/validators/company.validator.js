const { body, param, query } = require('express-validator');
const { COMPANY_STATUS, SORT_OPTIONS } = require('../config/constants');

const createCompanyValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Tên công ty phải từ 2-255 ký tự'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Địa chỉ phải từ 5-500 ký tự'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('phone')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Số điện thoại phải từ 8-20 ký tự'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Mô tả tối đa 5000 ký tự'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website không hợp lệ'),
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories phải là mảng'),
  body('owner_user_id')
    .optional()
    .isUUID()
    .withMessage('Owner ID không hợp lệ'),
];

const updateCompanyValidator = [
  param('id')
    .isUUID()
    .withMessage('ID công ty không hợp lệ'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Tên công ty phải từ 2-255 ký tự'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Địa chỉ phải từ 5-500 ký tự'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Số điện thoại phải từ 8-20 ký tự'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Mô tả tối đa 5000 ký tự'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website không hợp lệ'),
];

const companyIdValidator = [
  param('id')
    .isUUID()
    .withMessage('ID công ty không hợp lệ'),
];

const rejectCompanyValidator = [
  param('id')
    .isUUID()
    .withMessage('ID công ty không hợp lệ'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Lý do từ chối phải từ 10-1000 ký tự'),
];

const listCompanyValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page phải là số nguyên dương'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit phải từ 1-100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search tối đa 255 ký tự'),
  query('status')
    .optional()
    .isIn(Object.values(COMPANY_STATUS))
    .withMessage('Status không hợp lệ'),
  query('minRating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Min rating phải từ 1-5'),
  query('sort')
    .optional()
    .isIn(Object.values(SORT_OPTIONS))
    .withMessage('Sort option không hợp lệ'),
];

module.exports = {
  createCompanyValidator,
  updateCompanyValidator,
  companyIdValidator,
  rejectCompanyValidator,
  listCompanyValidator,
};
