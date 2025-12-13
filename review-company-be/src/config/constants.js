// Company Status
const COMPANY_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED',
  REJECTED: 'REJECTED',
};

// Review Status
const REVIEW_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  EDITED: 'EDITED',
  DELETED: 'DELETED',
};

// User Roles
const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
  COMPANY_OWNER: 'COMPANY_OWNER',
};

// Rating Categories
const RATING_CATEGORIES = {
  WORK_ENVIRONMENT: 'WORK_ENVIRONMENT',
  SALARY_BENEFITS: 'SALARY_BENEFITS',
  COMPANY_CULTURE: 'COMPANY_CULTURE',
  GROWTH_OPPORTUNITIES: 'GROWTH_OPPORTUNITIES',
};

// Rating Category Vietnamese Names
const RATING_CATEGORY_NAMES = {
  WORK_ENVIRONMENT: 'Môi trường làm việc',
  SALARY_BENEFITS: 'Lương thưởng & Phúc lợi',
  COMPANY_CULTURE: 'Văn hóa công ty',
  GROWTH_OPPORTUNITIES: 'Cơ hội phát triển',
};

// Max edit count for reviews
const MAX_REVIEW_EDIT_COUNT = 3;

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Sort options
const SORT_OPTIONS = {
  RATING_DESC: 'rating_desc',
  RATING_ASC: 'rating_asc',
  NEWEST: 'newest',
  OLDEST: 'oldest',
  REVIEWS_DESC: 'reviews_desc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
};

module.exports = {
  COMPANY_STATUS,
  REVIEW_STATUS,
  USER_ROLES,
  RATING_CATEGORIES,
  RATING_CATEGORY_NAMES,
  MAX_REVIEW_EDIT_COUNT,
  PAGINATION,
  SORT_OPTIONS,
};
