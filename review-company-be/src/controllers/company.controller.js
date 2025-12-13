const { Op } = require('sequelize');
const { 
  Company, 
  CompanyOwner, 
  CompanyCategory, 
  Review, 
  User,
  sequelize, 
} = require('../models');
const { asyncHandler, ApiError } = require('../middleware');
const { 
  formatSuccess, 
  getPagination, 
  getPaginationResponse,
} = require('../utils');
const { COMPANY_STATUS, USER_ROLES, SORT_OPTIONS, REVIEW_STATUS } = require('../config/constants');

// @desc    Get all companies (public - only ACTIVE)
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);
  const { search, minRating, sort, status } = req.query;

  // Build where clause
  const where = {};

  // Default to ACTIVE for public access
  if (req.user && [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(req.user.role)) {
    if (status) where.status = status;
  } else {
    where.status = COMPANY_STATUS.ACTIVE;
  }

  // Search by name or address
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { address: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Filter by minimum rating
  if (minRating) {
    where.avg_rating = { [Op.gte]: parseFloat(minRating) };
  }

  // Build order clause
  let order = [['avg_rating', 'DESC NULLS LAST']];
  switch (sort) {
    case SORT_OPTIONS.RATING_ASC:
      order = [['avg_rating', 'ASC NULLS LAST']];
      break;
    case SORT_OPTIONS.NEWEST:
      order = [['created_at', 'DESC']];
      break;
    case SORT_OPTIONS.OLDEST:
      order = [['created_at', 'ASC']];
      break;
    case SORT_OPTIONS.REVIEWS_DESC:
      order = [['total_reviews', 'DESC']];
      break;
    case SORT_OPTIONS.NAME_ASC:
      order = [['name', 'ASC']];
      break;
    case SORT_OPTIONS.NAME_DESC:
      order = [['name', 'DESC']];
      break;
    default:
      break;
  }

  const { count, rows } = await Company.findAndCountAll({
    where,
    include: [
      {
        model: CompanyCategory,
        as: 'categories',
        attributes: ['id', 'category_name'],
      },
    ],
    order,
    limit,
    offset,
    distinct: true,
  });

  res.json(formatSuccess(getPaginationResponse(rows, count, page, limit)));
});

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
const getCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.findByPk(id, {
    include: [
      {
        model: CompanyCategory,
        as: 'categories',
        attributes: ['id', 'category_name'],
      },
      {
        model: CompanyOwner,
        as: 'owners',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        }],
      },
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name'],
      },
    ],
  });

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  // Only show ACTIVE companies to public
  if (!req.user && company.status !== COMPANY_STATUS.ACTIVE) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  res.json(formatSuccess(company));
});

// @desc    Create company
// @route   POST /api/companies
// @access  Private/Admin/Manager
const createCompany = asyncHandler(async (req, res) => {
  const { 
    name, 
    address, 
    description, 
    email, 
    phone, 
    website, 
    categories,
    owner_user_id, 
  } = req.body;

  // Check if company name already exists
  const existingCompany = await Company.findOne({ where: { name } });
  if (existingCompany) {
    throw new ApiError(409, 'Tên công ty đã tồn tại');
  }

  // Create company with transaction
  const result = await sequelize.transaction(async (t) => {
    const company = await Company.create({
      name,
      address,
      description,
      email,
      phone,
      website,
      status: COMPANY_STATUS.PENDING,
      created_by: req.user.id,
    }, { transaction: t });

    // Add categories
    if (categories && categories.length > 0) {
      await CompanyCategory.bulkCreate(
        categories.map((cat) => ({
          company_id: company.id,
          category_name: cat,
        })),
        { transaction: t },
      );
    }

    // Add owner if specified
    if (owner_user_id) {
      await CompanyOwner.create({
        company_id: company.id,
        user_id: owner_user_id,
      }, { transaction: t });

      // Update user role to COMPANY_OWNER
      await User.update(
        { role: USER_ROLES.COMPANY_OWNER },
        { where: { id: owner_user_id }, transaction: t },
      );
    }

    return company;
  });

  // Fetch complete company data
  const company = await Company.findByPk(result.id, {
    include: [
      { model: CompanyCategory, as: 'categories' },
      { model: CompanyOwner, as: 'owners', include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }] },
    ],
  });

  res.status(201).json(formatSuccess(company, 'Tạo công ty thành công'));
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Admin/Manager/Owner
const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address, description, email, phone, website, categories } = req.body;

  const company = await Company.findByPk(id, {
    include: [{ model: CompanyOwner, as: 'owners' }],
  });

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  // Check permission
  const isOwner = company.owners.some((o) => o.user_id === req.user.id);
  const isAdminOrManager = [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(req.user.role);

  if (!isOwner && !isAdminOrManager) {
    throw new ApiError(403, 'Bạn không có quyền chỉnh sửa công ty này');
  }

  // Check unique name
  if (name && name !== company.name) {
    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
      throw new ApiError(409, 'Tên công ty đã tồn tại');
    }
  }

  // Update company
  await sequelize.transaction(async (t) => {
    await company.update({
      name: name || company.name,
      address: address || company.address,
      description: description !== undefined ? description : company.description,
      email: email || company.email,
      phone: phone || company.phone,
      website: website !== undefined ? website : company.website,
      version: company.version + 1,
    }, { transaction: t });

    // Update categories if provided
    if (categories) {
      await CompanyCategory.destroy({ where: { company_id: id }, transaction: t });
      if (categories.length > 0) {
        await CompanyCategory.bulkCreate(
          categories.map((cat) => ({
            company_id: id,
            category_name: cat,
          })),
          { transaction: t },
        );
      }
    }
  });

  // Fetch updated company
  const updatedCompany = await Company.findByPk(id, {
    include: [{ model: CompanyCategory, as: 'categories' }],
  });

  res.json(formatSuccess(updatedCompany, 'Cập nhật công ty thành công'));
});

// @desc    Delete company (soft delete)
// @route   DELETE /api/companies/:id
// @access  Private/Admin
const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.findByPk(id);

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  await company.update({ status: COMPANY_STATUS.DELETED });

  res.json(formatSuccess(null, 'Xóa công ty thành công'));
});

// @desc    Approve company
// @route   PUT /api/companies/:id/approve
// @access  Private/Admin
const approveCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.findByPk(id);

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  if (company.status !== COMPANY_STATUS.PENDING) {
    throw new ApiError(400, 'Chỉ có thể duyệt công ty đang ở trạng thái chờ duyệt');
  }

  await company.update({ 
    status: COMPANY_STATUS.ACTIVE,
    rejection_reason: null,
  });

  res.json(formatSuccess(company, 'Duyệt công ty thành công'));
});

// @desc    Reject company
// @route   PUT /api/companies/:id/reject
// @access  Private/Admin
const rejectCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const company = await Company.findByPk(id);

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  if (company.status !== COMPANY_STATUS.PENDING) {
    throw new ApiError(400, 'Chỉ có thể từ chối công ty đang ở trạng thái chờ duyệt');
  }

  await company.update({ 
    status: COMPANY_STATUS.REJECTED,
    rejection_reason: reason,
  });

  res.json(formatSuccess(company, 'Từ chối công ty thành công'));
});

// @desc    Activate company
// @route   PUT /api/companies/:id/activate
// @access  Private/Admin/Owner
const activateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.findByPk(id, {
    include: [{ model: CompanyOwner, as: 'owners' }],
  });

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  // Check permission
  const isOwner = company.owners.some((o) => o.user_id === req.user.id);
  if (!isOwner && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Bạn không có quyền kích hoạt công ty này');
  }

  if (![COMPANY_STATUS.APPROVED, COMPANY_STATUS.INACTIVE].includes(company.status)) {
    throw new ApiError(400, 'Không thể kích hoạt công ty ở trạng thái hiện tại');
  }

  await company.update({ status: COMPANY_STATUS.ACTIVE });

  res.json(formatSuccess(company, 'Kích hoạt công ty thành công'));
});

// @desc    Deactivate company
// @route   PUT /api/companies/:id/deactivate
// @access  Private/Admin/Owner
const deactivateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.findByPk(id, {
    include: [{ model: CompanyOwner, as: 'owners' }],
  });

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  // Check permission
  const isOwner = company.owners.some((o) => o.user_id === req.user.id);
  if (!isOwner && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, 'Bạn không có quyền tạm dừng công ty này');
  }

  if (company.status !== COMPANY_STATUS.ACTIVE) {
    throw new ApiError(400, 'Chỉ có thể tạm dừng công ty đang hoạt động');
  }

  await company.update({ status: COMPANY_STATUS.INACTIVE });

  res.json(formatSuccess(company, 'Tạm dừng công ty thành công'));
});

// @desc    Get pending companies
// @route   GET /api/companies/pending
// @access  Private/Admin
const getPendingCompanies = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query.page, req.query.limit);

  const { count, rows } = await Company.findAndCountAll({
    where: { status: COMPANY_STATUS.PENDING },
    include: [
      { model: CompanyCategory, as: 'categories' },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
    ],
    order: [['created_at', 'ASC']],
    limit,
    offset,
    distinct: true,
  });

  res.json(formatSuccess(getPaginationResponse(rows, count, page, limit)));
});

// @desc    Get my companies (for company owner)
// @route   GET /api/companies/my-companies
// @access  Private
const getMyCompanies = asyncHandler(async (req, res) => {
  const companyOwners = await CompanyOwner.findAll({
    where: { user_id: req.user.id },
    include: [{
      model: Company,
      as: 'company',
      include: [{ model: CompanyCategory, as: 'categories' }],
    }],
  });

  const companies = companyOwners.map((co) => co.company);

  res.json(formatSuccess(companies));
});

// @desc    Upload company logo
// @route   PUT /api/companies/:id/logo
// @access  Private/Admin/Manager/Owner
const uploadLogo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    throw new ApiError(400, 'Vui lòng chọn file ảnh');
  }

  const company = await Company.findByPk(id, {
    include: [{ model: CompanyOwner, as: 'owners' }],
  });

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  // Check permission
  const isOwner = company.owners.some((o) => o.user_id === req.user.id);
  const isAdminOrManager = [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(req.user.role);

  if (!isOwner && !isAdminOrManager) {
    throw new ApiError(403, 'Bạn không có quyền cập nhật logo công ty này');
  }

  const logoUrl = `/uploads/${req.file.filename}`;
  await company.update({ logo_url: logoUrl });

  res.json(formatSuccess({ logo_url: logoUrl }, 'Cập nhật logo thành công'));
});

// @desc    Get company statistics
// @route   GET /api/companies/:id/statistics
// @access  Public
const getCompanyStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.findByPk(id);

  if (!company) {
    throw new ApiError(404, 'Không tìm thấy công ty');
  }

  // Get reviews with ratings distribution
  const reviews = await Review.findAll({
    where: { 
      company_id: id,
      status: REVIEW_STATUS.PUBLISHED,
    },
    attributes: ['overall_rating'],
  });

  // Calculate rating distribution
  const ratingDistribution = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  };

  reviews.forEach((review) => {
    ratingDistribution[review.overall_rating]++;
  });

  res.json(formatSuccess({
    total_reviews: company.total_reviews,
    avg_rating: company.avg_rating,
    rating_distribution: ratingDistribution,
  }));
});

module.exports = {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  approveCompany,
  rejectCompany,
  activateCompany,
  deactivateCompany,
  getPendingCompanies,
  getMyCompanies,
  uploadLogo,
  getCompanyStatistics,
};
