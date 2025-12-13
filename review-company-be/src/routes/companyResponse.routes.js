const express = require('express');
const router = express.Router();
const companyResponseController = require('../controllers/companyResponse.controller');
const { authenticate, validate } = require('../middleware');
const {
  createResponseValidator,
  updateResponseValidator,
  responseIdValidator,
} = require('../validators');

// Routes for /api/reviews/:reviewId/response
router.get('/:reviewId/response', companyResponseController.getResponse);
router.post('/:reviewId/response', authenticate, validate(createResponseValidator), companyResponseController.createResponse);

// Routes for /api/company-responses/:id
router.put('/:id', authenticate, validate(updateResponseValidator), companyResponseController.updateResponse);
router.delete('/:id', authenticate, validate(responseIdValidator), companyResponseController.deleteResponse);

module.exports = router;
