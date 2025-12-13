const { RatingCategory, Rating, Review, sequelize } = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { formatSuccess } = require('../utils');
const { REVIEW_STATUS } = require('../config/constants');

// @desc    Get all rating categories
// @route   GET /api/rating-categories
// @access  Public
const getRatingCategories = asyncHandler(async (req, res) => {
  const categories = await RatingCategory.findAll({
    order: [['display_order', 'ASC'], ['name', 'ASC']],
  });

  res.json(formatSuccess(categories));
});

// @desc    Get category ratings for a company
// @route   GET /api/companies/:companyId/category-ratings
// @access  Public
const getCompanyCategoryRatings = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const categories = await RatingCategory.findAll({
    order: [['display_order', 'ASC']],
  });

  // Get average rating for each category
  const categoryRatings = await Promise.all(
    categories.map(async (category) => {
      const result = await Rating.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating_value')), 'average'],
          [sequelize.fn('COUNT', sequelize.col('Rating.id')), 'count'],
        ],
        include: [{
          model: Review,
          as: 'review',
          attributes: [],
          where: {
            company_id: companyId,
            status: REVIEW_STATUS.PUBLISHED,
          },
        }],
        where: { category_id: category.id },
        raw: true,
      });

      return {
        category: {
          id: category.id,
          name: category.name,
          display_name: category.display_name,
        },
        averageRating: result.average ? parseFloat(result.average).toFixed(2) : null,
        count: parseInt(result.count, 10) || 0,
      };
    }),
  );

  res.json(formatSuccess(categoryRatings));
});

// @desc    Create rating category (Admin)
// @route   POST /api/rating-categories
// @access  Private/Admin
const createRatingCategory = asyncHandler(async (req, res) => {
  const { name, description, display_name, display_order } = req.body;

  // Check if category already exists
  const existing = await RatingCategory.findOne({ where: { name } });
  if (existing) {
    throw new ApiError(409, 'Hạng mục đánh giá đã tồn tại');
  }

  const category = await RatingCategory.create({
    name,
    description,
    display_name,
    display_order: display_order || 0,
  });

  res.status(201).json(formatSuccess(category, 'Tạo hạng mục đánh giá thành công'));
});

// @desc    Update rating category (Admin)
// @route   PUT /api/rating-categories/:id
// @access  Private/Admin
const updateRatingCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, display_name, display_order } = req.body;

  const category = await RatingCategory.findByPk(id);

  if (!category) {
    throw new ApiError(404, 'Không tìm thấy hạng mục đánh giá');
  }

  // Check unique name
  if (name && name !== category.name) {
    const existing = await RatingCategory.findOne({ where: { name } });
    if (existing) {
      throw new ApiError(409, 'Tên hạng mục đã tồn tại');
    }
  }

  await category.update({
    name: name || category.name,
    description: description !== undefined ? description : category.description,
    display_name: display_name !== undefined ? display_name : category.display_name,
    display_order: display_order !== undefined ? display_order : category.display_order,
  });

  res.json(formatSuccess(category, 'Cập nhật hạng mục đánh giá thành công'));
});

// @desc    Delete rating category (Admin)
// @route   DELETE /api/rating-categories/:id
// @access  Private/Admin
const deleteRatingCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await RatingCategory.findByPk(id);

  if (!category) {
    throw new ApiError(404, 'Không tìm thấy hạng mục đánh giá');
  }

  // Check if category is being used
  const usedCount = await Rating.count({ where: { category_id: id } });
  if (usedCount > 0) {
    throw new ApiError(400, 'Không thể xóa hạng mục đang được sử dụng');
  }

  await category.destroy();

  res.json(formatSuccess(null, 'Xóa hạng mục đánh giá thành công'));
});

module.exports = {
  getRatingCategories,
  getCompanyCategoryRatings,
  createRatingCategory,
  updateRatingCategory,
  deleteRatingCategory,
};
