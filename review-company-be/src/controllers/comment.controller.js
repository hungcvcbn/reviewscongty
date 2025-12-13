const { Comment, CommentLike, Review, User, sequelize } = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { formatSuccess, getPagination, getPaginationResponse } = require('../utils');
const { USER_ROLES, REVIEW_STATUS } = require('../config/constants');

// @desc    Get comments for a review
// @route   GET /api/reviews/:reviewId/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);

  // Check review exists
  const review = await Review.findByPk(reviewId);
  if (!review || review.status === REVIEW_STATUS.DELETED) {
    throw new ApiError(404, 'Không tìm thấy review');
  }

  // Get top-level comments (no parent)
  const { count, rows } = await Comment.findAndCountAll({
    where: { 
      review_id: reviewId,
      parent_comment_id: null,
      is_deleted: false,
    },
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
        order: [['created_at', 'ASC']],
      },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
    distinct: true,
  });

  res.json(formatSuccess(getPaginationResponse(rows, count, page, limit)));
});

// @desc    Create comment
// @route   POST /api/reviews/:reviewId/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { content, parent_comment_id } = req.body;

  // Check review exists
  const review = await Review.findByPk(reviewId);
  if (!review || review.status === REVIEW_STATUS.DELETED) {
    throw new ApiError(404, 'Không tìm thấy review');
  }

  // If replying to a comment, check parent exists
  if (parent_comment_id) {
    const parentComment = await Comment.findByPk(parent_comment_id);
    if (!parentComment || parentComment.is_deleted) {
      throw new ApiError(404, 'Không tìm thấy bình luận gốc');
    }
    if (parentComment.review_id !== reviewId) {
      throw new ApiError(400, 'Bình luận gốc không thuộc review này');
    }
  }

  const comment = await Comment.create({
    review_id: reviewId,
    user_id: req.user.id,
    parent_comment_id: parent_comment_id || null,
    content,
  });

  // Fetch with user data
  const createdComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'avatar_url'],
    }],
  });

  res.status(201).json(formatSuccess(createdComment, 'Thêm bình luận thành công'));
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await Comment.findByPk(id);

  if (!comment || comment.is_deleted) {
    throw new ApiError(404, 'Không tìm thấy bình luận');
  }

  // Check ownership
  if (comment.user_id !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Bạn không có quyền chỉnh sửa bình luận này');
  }

  await comment.update({ content });

  // Fetch with user data
  const updatedComment = await Comment.findByPk(id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'avatar_url'],
    }],
  });

  res.json(formatSuccess(updatedComment, 'Cập nhật bình luận thành công'));
});

// @desc    Delete comment (soft delete)
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findByPk(id);

  if (!comment || comment.is_deleted) {
    throw new ApiError(404, 'Không tìm thấy bình luận');
  }

  // Check ownership or admin
  if (comment.user_id !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Bạn không có quyền xóa bình luận này');
  }

  await comment.update({ is_deleted: true });

  res.json(formatSuccess(null, 'Xóa bình luận thành công'));
});

// @desc    Like/Unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findByPk(id);

  if (!comment || comment.is_deleted) {
    throw new ApiError(404, 'Không tìm thấy bình luận');
  }

  // Check if already liked
  const existingLike = await CommentLike.findOne({
    where: {
      comment_id: id,
      user_id: req.user.id,
    },
  });

  let liked;
  await sequelize.transaction(async (t) => {
    if (existingLike) {
      // Unlike
      await existingLike.destroy({ transaction: t });
      await comment.update({ 
        likes_count: Math.max(0, comment.likes_count - 1), 
      }, { transaction: t });
      liked = false;
    } else {
      // Like
      await CommentLike.create({
        comment_id: id,
        user_id: req.user.id,
      }, { transaction: t });
      await comment.update({ 
        likes_count: comment.likes_count + 1, 
      }, { transaction: t });
      liked = true;
    }
  });

  res.json(formatSuccess({ 
    liked, 
    likes_count: comment.likes_count + (liked ? 1 : -1), 
  }, liked ? 'Đã thích bình luận' : 'Đã bỏ thích bình luận'));
});

// @desc    Get comment replies
// @route   GET /api/comments/:id/replies
// @access  Public
const getReplies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);

  const comment = await Comment.findByPk(id);

  if (!comment || comment.is_deleted) {
    throw new ApiError(404, 'Không tìm thấy bình luận');
  }

  const { count, rows } = await Comment.findAndCountAll({
    where: {
      parent_comment_id: id,
      is_deleted: false,
    },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'avatar_url'],
    }],
    order: [['created_at', 'ASC']],
    limit,
    offset,
  });

  res.json(formatSuccess(getPaginationResponse(rows, count, page, limit)));
});

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
  getReplies,
};
