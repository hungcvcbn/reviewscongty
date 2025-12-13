const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { 
  authenticate, 
  optionalAuth,
  isAdmin, 
  isAdminOrManager, 
  validate,
  uploadLogo,
  handleUploadError,
} = require('../middleware');
const {
  createCompanyValidator,
  updateCompanyValidator,
  companyIdValidator,
  rejectCompanyValidator,
  listCompanyValidator,
} = require('../validators');

// Public routes (with optional auth for admin view)
router.get('/', optionalAuth, validate(listCompanyValidator), companyController.getCompanies);
router.get('/pending', authenticate, isAdmin, companyController.getPendingCompanies);
router.get('/my-companies', authenticate, companyController.getMyCompanies);
router.get('/:id', optionalAuth, validate(companyIdValidator), companyController.getCompany);
router.get('/:id/statistics', validate(companyIdValidator), companyController.getCompanyStatistics);

// Protected routes
router.post('/', authenticate, isAdminOrManager, validate(createCompanyValidator), companyController.createCompany);
router.put('/:id', authenticate, validate(updateCompanyValidator), companyController.updateCompany);
router.delete('/:id', authenticate, isAdmin, validate(companyIdValidator), companyController.deleteCompany);

// Approval workflow
router.put('/:id/approve', authenticate, isAdmin, validate(companyIdValidator), companyController.approveCompany);
router.put('/:id/reject', authenticate, isAdmin, validate(rejectCompanyValidator), companyController.rejectCompany);
router.put('/:id/activate', authenticate, validate(companyIdValidator), companyController.activateCompany);
router.put('/:id/deactivate', authenticate, validate(companyIdValidator), companyController.deactivateCompany);

// Logo upload
router.put('/:id/logo', authenticate, uploadLogo, handleUploadError, companyController.uploadLogo);

module.exports = router;
