const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');
const { USER_ROLES } = require('../config/constants');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực. Vui lòng đăng nhập.',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret);

      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Người dùng không tồn tại.',
        });
      }

      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa.',
        });
      }

      req.user = user.toSafeObject();
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token đã hết hạn. Vui lòng đăng nhập lại.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực.',
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findByPk(decoded.id);

      if (user && user.is_active) {
        req.user = user.toSafeObject();
      }
    } catch {
      // Ignore token errors for optional auth
    }

    next();
  } catch (error) {
    next();
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này.',
      });
    }

    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Admin mới có quyền thực hiện hành động này.',
    });
  }
  next();
};

// Check if user is admin or manager
const isAdminOrManager = (req, res, next) => {
  if (!req.user || ![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Admin hoặc Manager mới có quyền thực hiện hành động này.',
    });
  }
  next();
};

// Check if user is company owner
const isCompanyOwner = (req, res, next) => {
  if (!req.user || ![USER_ROLES.ADMIN, USER_ROLES.COMPANY_OWNER].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Company Owner mới có quyền thực hiện hành động này.',
    });
  }
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isAdminOrManager,
  isCompanyOwner,
};
