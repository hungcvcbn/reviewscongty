const { User } = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { generateToken, formatSuccess } = require('../utils');
const { USER_ROLES } = require('../config/constants');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'Email đã được sử dụng');
  }

  // Create user (default role is USER, only admin can create admin/manager)
  const userRole = role && [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(role)
    ? USER_ROLES.USER // Force USER role for self-registration
    : role || USER_ROLES.USER;

  const user = await User.create({
    email,
    password,
    name,
    role: userRole,
  });

  const token = generateToken(user);

  res.status(201).json(formatSuccess({
    user: user.toSafeObject(),
    token,
  }, 'Đăng ký thành công'));
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(401, 'Email hoặc mật khẩu không đúng');
  }

  if (!user.is_active) {
    throw new ApiError(401, 'Tài khoản đã bị vô hiệu hóa');
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Email hoặc mật khẩu không đúng');
  }

  const token = generateToken(user);

  res.json(formatSuccess({
    user: user.toSafeObject(),
    token,
  }, 'Đăng nhập thành công'));
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw new ApiError(404, 'Không tìm thấy người dùng');
  }

  res.json(formatSuccess(user.toSafeObject()));
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar_url } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw new ApiError(404, 'Không tìm thấy người dùng');
  }

  // Update fields
  if (name) user.name = name;
  if (avatar_url !== undefined) user.avatar_url = avatar_url;

  await user.save();

  res.json(formatSuccess(user.toSafeObject(), 'Cập nhật profile thành công'));
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw new ApiError(404, 'Không tìm thấy người dùng');
  }

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(401, 'Mật khẩu hiện tại không đúng');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json(formatSuccess(null, 'Đổi mật khẩu thành công'));
});

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['created_at', 'DESC']],
  });

  res.json(formatSuccess(users));
});

// @desc    Update user role (Admin)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!Object.values(USER_ROLES).includes(role)) {
    throw new ApiError(400, 'Role không hợp lệ');
  }

  const user = await User.findByPk(id);

  if (!user) {
    throw new ApiError(404, 'Không tìm thấy người dùng');
  }

  // Prevent changing own role
  if (user.id === req.user.id) {
    throw new ApiError(400, 'Không thể thay đổi role của chính mình');
  }

  user.role = role;
  await user.save();

  res.json(formatSuccess(user.toSafeObject(), 'Cập nhật role thành công'));
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getUsers,
  updateUserRole,
};
