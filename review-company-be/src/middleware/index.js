const { authenticate, optionalAuth, authorize, isAdmin, isAdminOrManager, isCompanyOwner } = require('./auth');
const { ApiError, notFound, errorHandler, asyncHandler } = require('./errorHandler');
const { validate } = require('./validate');
const { upload, uploadLogo, handleUploadError } = require('./upload');

module.exports = {
  // Auth
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isAdminOrManager,
  isCompanyOwner,

  // Error handling
  ApiError,
  notFound,
  errorHandler,
  asyncHandler,

  // Validation
  validate,

  // Upload
  upload,
  uploadLogo,
  handleUploadError,
};
