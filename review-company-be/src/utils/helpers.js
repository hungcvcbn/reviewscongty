const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
};

// Parse pagination parameters
const getPagination = (page, limit) => {
  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = Math.min(parseInt(limit, 10) || 10, 100);
  const offset = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset,
  };
};

// Create pagination response
const getPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Format error response
const formatError = (message, errors = null) => {
  return {
    success: false,
    message,
    errors,
  };
};

// Format success response
const formatSuccess = (data, message = 'Thành công') => {
  return {
    success: true,
    message,
    data,
  };
};

// Calculate average rating
const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return null;
  const sum = ratings.reduce((acc, r) => acc + r.overall_rating, 0);
  return Math.round((sum / ratings.length) * 100) / 100;
};

// Slugify string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Check if user owns the resource
const isOwner = (userId, resourceUserId) => {
  return userId === resourceUserId;
};

// Remove undefined/null values from object
const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null),
  );
};

module.exports = {
  generateToken,
  getPagination,
  getPaginationResponse,
  formatError,
  formatSuccess,
  calculateAverageRating,
  slugify,
  isOwner,
  cleanObject,
};
