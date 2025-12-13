const { CompanyResponse, Review, Company, CompanyOwner, User } = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { formatSuccess } = require('../utils');
const { USER_ROLES, REVIEW_STATUS } = require('../config/constants');

// Helper: Check if user is owner of the company
const isCompanyOwner = async (userId, companyId) => {
  const owner = await CompanyOwner.findOne({
    where: {
      user_id: userId,
      company_id: companyId,
    },
  });
  return !!owner;
};

// @desc    Create company response to a review
// @route   POST /api/reviews/:reviewId/response
// @access  Private/Owner
const createResponse = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { content } = req.body;

  // Check review exists
  const review = await Review.findByPk(reviewId, {
    include: [{ model: Company, as: 'company' }],
  });

  if (!review || review.status === REVIEW_STATUS.DELETED) {
    throw new ApiError(404, 'Không tìm thấy review');
  }

  // Check if user is owner of the company or admin
  const isOwner = await isCompanyOwner(req.user.id, review.company_id);
  if (!isOwner && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Chỉ chủ công ty mới có quyền phản hồi review này');
  }

  // Check if response already exists
  const existingResponse = await CompanyResponse.findOne({
    where: { review_id: reviewId },
  });

  if (existingResponse) {
    throw new ApiError(400, 'Review này đã có phản hồi từ công ty');
  }

  const response = await CompanyResponse.create({
    review_id: reviewId,
    company_id: review.company_id,
    user_id: req.user.id,
    content,
  });

  // Fetch with user data
  const createdResponse = await CompanyResponse.findByPk(response.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name'],
    }],
  });

  res.status(201).json(formatSuccess(createdResponse, 'Phản hồi thành công'));
});

// @desc    Update company response
// @route   PUT /api/company-responses/:id
// @access  Private/Owner
const updateResponse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const response = await CompanyResponse.findByPk(id);

  if (!response) {
    throw new ApiError(404, 'Không tìm thấy phản hồi');
  }

  // Check ownership
  const isOwner = await isCompanyOwner(req.user.id, response.company_id);
  if (!isOwner && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Bạn không có quyền chỉnh sửa phản hồi này');
  }

  await response.update({ content });

  // Fetch with user data
  const updatedResponse = await CompanyResponse.findByPk(id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name'],
    }],
  });

  res.json(formatSuccess(updatedResponse, 'Cập nhật phản hồi thành công'));
});

// @desc    Delete company response
// @route   DELETE /api/company-responses/:id
// @access  Private/Owner/Admin
const deleteResponse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const response = await CompanyResponse.findByPk(id);

  if (!response) {
    throw new ApiError(404, 'Không tìm thấy phản hồi');
  }

  // Check ownership or admin
  const isOwner = await isCompanyOwner(req.user.id, response.company_id);
  if (!isOwner && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Bạn không có quyền xóa phản hồi này');
  }

  await response.destroy();

  res.json(formatSuccess(null, 'Xóa phản hồi thành công'));
});

// @desc    Get company response for a review
// @route   GET /api/reviews/:reviewId/response
// @access  Public
const getResponse = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const response = await CompanyResponse.findOne({
    where: { review_id: reviewId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name'],
    }],
  });

  if (!response) {
    throw new ApiError(404, 'Không tìm thấy phản hồi');
  }

  res.json(formatSuccess(response));
});

module.exports = {
  createResponse,
  updateResponse,
  deleteResponse,
  getResponse,
};
