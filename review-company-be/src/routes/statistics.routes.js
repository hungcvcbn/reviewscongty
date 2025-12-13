const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');
const { authenticate, isAdmin } = require('../middleware');

// Public routes
router.get('/', statisticsController.getStatistics);

// Admin routes
router.get('/admin', authenticate, isAdmin, statisticsController.getAdminStatistics);

module.exports = router;
