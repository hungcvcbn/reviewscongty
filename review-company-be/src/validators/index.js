const authValidator = require('./auth.validator');
const companyValidator = require('./company.validator');
const reviewValidator = require('./review.validator');
const commentValidator = require('./comment.validator');
const companyResponseValidator = require('./companyResponse.validator');

module.exports = {
  ...authValidator,
  ...companyValidator,
  ...reviewValidator,
  ...commentValidator,
  ...companyResponseValidator,
};
