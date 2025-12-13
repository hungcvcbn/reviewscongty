const express = require('express');
const router = express.Router();
const ratingCategoryController = require('../controllers/ratingCategory.controller');
const { authenticate, isAdmin } = require('../middleware');

// Public routes
router.get('/', ratingCategoryController.getRatingCategories);

// Admin routes
router.post('/', authenticate, isAdmin, ratingCategoryController.createRatingCategory);
router.put('/:id', authenticate, isAdmin, ratingCategoryController.updateRatingCategory);
router.delete('/:id', authenticate, isAdmin, ratingCategoryController.deleteRatingCategory);

module.exports = router;
