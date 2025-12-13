const { Op } = require('sequelize');
const { 
  Review, 
  Company, 
  User, 
  Rating, 
  RatingCategory,
  Comment,
  CompanyResponse,
  sequelize, 
} = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { 
  formatSuccess, 
  getPagination, 
  getPaginationResponse,
} = require('../utils');
const { REVIEW_STATUS, COMPANY_STATUS, USER_ROLES, MAX_REVIEW_EDIT_COUNT } = require('../config/constants');

// Helper: Update company rating after review changes
const updateCompanyRating = async (companyId, transaction) => {
  const reviews = await Review.findAll({
    where: { 
      company_id: companyId,
      status: REVIEW_STATUS.PUBLISHED,
    },
    attributes: ['overall_rating'],
    transaction,
  });

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.overall_rating, 0) / totalReviews) * 100) / 100
    : null;

  await Company.update(
    { avg_rating: avgRating, total_reviews: totalReviews },
    { where: { id: companyId }, transaction },
  );
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { company_id, user_id, status, minRating, maxRating } = req.query;

  const where = { status: REVIEW_STATUS.PUBLISHED };

  if (company_id) where.company_id = company_id;
  if (user_id) where.user_id = user_id;
  if (status && req.user) where.status = status;
  if (minRating) where.overall_rating = { ...where.overall_rating, [Op.gte]: parseInt(minRating, 10) };
  if (maxRating) where.overall_rating = { ...where.overall_rating, [Op.lte]: parseInt(maxRating, 10) };

  const { count, rows } = await Review.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'avatar_url'],
      },
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'logo_url'],
      },
      {
        model: Rating,
        as: 'ratings',
        include: [{ model: RatingCategory, as: 'category' }],
      },
      {
        model: CompanyResponse,
        as: 'companyResponse',
      },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  // Hide user info for anonymous reviews
  const processedRows = rows.map((review) => {
    const reviewData = review.toJSON();
    if (reviewData.is_anonymous) {
      reviewData.user = null;
    }
    return reviewData;
  });

  res.json(formatSuccess(getPaginationResponse(processedRows, count, page, limit)));
});

// @desc    Get reviews for a company
// @route   GET /api/companies/:companyId/reviews
// @access  Public
const getCompanyReviews = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { minRating, maxRating } = req.query;

  // Check company exists
  const company = await Company.findByPk(companyId);
  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  const where = { 
    company_id: companyId,
    status: REVIEW_STATUS.PUBLISHED,
  };

  if (minRating) where.overall_rating = { ...where.overall_rating, [Op.gte]: parseInt(minRating, 10) };
  if (maxRating) where.overall_rating = { ...where.overall_rating, [Op.lte]: parseInt(maxRating, 10) };

  const { count, rows } = await Review.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'avatar_url'],
      },
      {
        model: Rating,
        as: 'ratings',
        include: [{ model: RatingCategory, as: 'category' }],
      },
      {
        model: CompanyResponse,
        as: 'companyResponse',
      },
      {
        model: Comment,
        as: 'comments',
        where: { is_deleted: false, parent_comment_id: null },
        required: false,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar_url'],
        }],
      },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  // Hide user info for anonymous reviews
  const processedRows = rows.map((review) => {
    const reviewData = review.toJSON();
    if (reviewData.is_anonymous) {
      reviewData.user = null;
    }
    return reviewData;
  });

  res.json(formatSuccess(getPaginationResponse(processedRows, count, page, limit)));
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByPk(id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'avatar_url'],
      },
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'logo_url', 'address'],
      },
      {
        model: Rating,
        as: 'ratings',
        include: [{ model: RatingCategory, as: 'category' }],
      },
      {
        model: CompanyResponse,
        as: 'companyResponse',
      },
      {
        model: Comment,
        as: 'comments',
        where: { is_deleted: false },
        required: false,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'avatar_url'],
          },
          {
            model: Comment,
            as: 'replies',
            where: { is_deleted: false },
            required: false,
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'avatar_url'],
            }],
          },
        ],
      },
    ],
  });

  if (!review) {
    throw new ApiError(404, 'Không tìm thấy review');
  }

  // Only owner or admin can see non-published reviews
  if (review.status !== REVIEW_STATUS.PUBLISHED) {
    if (!req.user || (req.user.id !== review.user_id && req.user.role !== USER_ROLES.ADMIN)) {
      throw new ApiError(404, 'Không tìm thấy review');
    }
  }

  // Hide user info for anonymous reviews
  const reviewData = review.toJSON();
  if (reviewData.is_anonymous && (!req.user || req.user.id !== review.user_id)) {
    reviewData.user = null;
  }

  res.json(formatSuccess(reviewData));
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { 
    company_id, 
    title, 
    content, 
    overall_rating, 
    is_anonymous,
    ratings,
    status, 
  } = req.body;

  // Check company exists and is active
  const company = await Company.findByPk(company_id);
  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  if (company.status !== COMPANY_STATUS.ACTIVE) {
    throw new ApiError(400, 'Công ty chưa được kích hoạt');
  }

  // Check if user already has a published review for this company
  const existingReview = await Review.findOne({
    where: {
      company_id,
      user_id: req.user.id,
      status: { [Op.in]: [REVIEW_STATUS.PUBLISHED, REVIEW_STATUS.EDITED] },
    },
  });

  if (existingReview) {
    throw new ApiError(400, 'Bạn đã có review cho công ty này');
  }

  // Create review with transaction
  const result = await sequelize.transaction(async (t) => {
    const review = await Review.create({
      company_id,
      user_id: req.user.id,
      title,
      content,
      overall_rating,
      is_anonymous: is_anonymous || false,
      status: status || REVIEW_STATUS.PUBLISHED,
    }, { transaction: t });

    // Add category ratings
    if (ratings && ratings.length > 0) {
      await Rating.bulkCreate(
        ratings.map((r) => ({
          review_id: review.id,
          category_id: r.category_id,
          rating_value: r.rating_value,
        })),
        { transaction: t },
      );
    }

    // Update company rating if published
    if (review.status === REVIEW_STATUS.PUBLISHED) {
      await updateCompanyRating(company_id, t);
    }

    return review;
  });

  // Fetch complete review data
  const review = await Review.findByPk(result.id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'avatar_url'] },
      { model: Rating, as: 'ratings', include: [{ model: RatingCategory, as: 'category' }] },
    ],
  });

  res.status(201).json(formatSuccess(review, 'Tạo review thành công'));
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, overall_rating, ratings } = req.body;

  const review = await Review.findByPk(id);

  if (!review) {
    throw new ApiError(404, 'Không tìm thấy review');
  }

  // Check ownership
  if (review.user_id !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Bạn không có quyền chỉnh sửa review này');
  }

  // Check if can edit
  if (!review.canEdit()) {
    throw new ApiError(400, `Bạn đã chỉnh sửa tối đa ${MAX_REVIEW_EDIT_COUNT} lần`);
  }

  // Update review with transaction
  await sequelize.transaction(async (t) => {
    await review.update({
      title: title !== undefined ? title : review.title,
      content: content || review.content,
      overall_rating: overall_rating || review.overall_rating,
      status: review.status === REVIEW_STATUS.PUBLISHED ? REVIEW_STATUS.EDITED : review.status,
      edit_count: review.edit_count + 1,
    }, { transaction: t });

    // Update category ratings if provided
    if (ratings && ratings.length > 0) {
      await Rating.destroy({ where: { review_id: id }, transaction: t });
      await Rating.bulkCreate(
        ratings.map((r) => ({
          review_id: id,
          category_id: r.category_id,
          rating_value: r.rating_value,
        })),
        { transaction: t },
      );
    }

    // Update company rating
    await updateCompanyRating(review.company_id, t);
  });

  // Fetch updated review
  const updatedReview = await Review.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'avatar_url'] },
      { model: Rating, as: 'ratings', include: [{ model: RatingCategory, as: 'category' }] },
    ],
  });

  res.json(formatSuccess(updatedReview, 'Cập nhật review thành công'));
});

// @desc    Delete review (soft delete)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByPk(id);

  if (!review) {
    throw new ApiError(404, 'Không tìm thấy review');
  }

  // Check ownership or admin
  if (review.user_id !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Bạn không có quyền xóa review này');
  }

  await sequelize.transaction(async (t) => {
    await review.update({ status: REVIEW_STATUS.DELETED }, { transaction: t });
    await updateCompanyRating(review.company_id, t);
  });

  res.json(formatSuccess(null, 'Xóa review thành công'));
});

// @desc    Get my reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);

  const { count, rows } = await Review.findAndCountAll({
    where: { 
      user_id: req.user.id,
      status: { [Op.ne]: REVIEW_STATUS.DELETED },
    },
    include: [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'logo_url'],
      },
      {
        model: Rating,
        as: 'ratings',
        include: [{ model: RatingCategory, as: 'category' }],
      },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  res.json(formatSuccess(getPaginationResponse(rows, count, page, limit)));
});

// @desc    Publish draft review
// @route   PUT /api/reviews/:id/publish
// @access  Private
const publishReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByPk(id);

  if (!review) {
    throw new ApiError(404, 'Không tìm thấy review');
  }

  // Check ownership
  if (review.user_id !== req.user.id) {
    throw new ApiError(403, 'Bạn không có quyền publish review này');
  }

  if (review.status !== REVIEW_STATUS.DRAFT) {
    throw new ApiError(400, 'Chỉ có thể publish review ở trạng thái nháp');
  }

  await sequelize.transaction(async (t) => {
    await review.update({ status: REVIEW_STATUS.PUBLISHED }, { transaction: t });
    await updateCompanyRating(review.company_id, t);
  });

  res.json(formatSuccess(review, 'Publish review thành công'));
});

module.exports = {
  getReviews,
  getCompanyReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  publishReview,
};
