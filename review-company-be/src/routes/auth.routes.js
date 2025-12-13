const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, isAdmin, validate } = require('../middleware');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} = require('../validators');

// Public routes
router.post('/register', validate(registerValidator), authController.register);
router.post('/login', validate(loginValidator), authController.login);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, validate(updateProfileValidator), authController.updateProfile);
router.put('/change-password', authenticate, validate(changePasswordValidator), authController.changePassword);

// Admin routes
router.get('/users', authenticate, isAdmin, authController.getUsers);
router.put('/users/:id/role', authenticate, isAdmin, authController.updateUserRole);

module.exports = router;
