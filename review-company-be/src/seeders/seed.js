/**
 * Database Seeder
 * Run with: node src/seeders/seed.js
 */

require('dotenv').config();

require('../config/database');
const {
  User,
  Company,
  CompanyOwner,
  CompanyCategory,
  Review,
  RatingCategory,
  Rating,
  Comment,
  CompanyResponse,
  syncDatabase,
} = require('../models');
const { COMPANY_STATUS, REVIEW_STATUS, USER_ROLES, RATING_CATEGORIES, RATING_CATEGORY_NAMES } = require('../config/constants');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database (force recreate in development)
    await syncDatabase({ force: true });

    console.log('📦 Creating users...');
    
    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = await User.create({
      email: 'admin@reviewcompany.com',
      password: hashedPassword,
      name: 'Admin User',
      role: USER_ROLES.ADMIN,
    });

    const managerUser = await User.create({
      email: 'manager@reviewcompany.com',
      password: hashedPassword,
      name: 'Manager User',
      role: USER_ROLES.MANAGER,
    });

    const ownerUser1 = await User.create({
      email: 'owner1@company.com',
      password: hashedPassword,
      name: 'Nguyễn Văn Owner',
      role: USER_ROLES.COMPANY_OWNER,
    });

    const ownerUser2 = await User.create({
      email: 'owner2@company.com',
      password: hashedPassword,
      name: 'Trần Thị Owner',
      role: USER_ROLES.COMPANY_OWNER,
    });

    const regularUser1 = await User.create({
      email: 'user1@gmail.com',
      password: hashedPassword,
      name: 'Lê Minh User',
      role: USER_ROLES.USER,
    });

    const regularUser2 = await User.create({
      email: 'user2@gmail.com',
      password: hashedPassword,
      name: 'Phạm Thị User',
      role: USER_ROLES.USER,
    });

    const regularUser3 = await User.create({
      email: 'user3@gmail.com',
      password: hashedPassword,
      name: 'Hoàng Văn User',
      role: USER_ROLES.USER,
    });

    console.log('📦 Creating rating categories...');

    // Create rating categories
    const ratingCategories = await RatingCategory.bulkCreate([
      {
        name: RATING_CATEGORIES.WORK_ENVIRONMENT,
        display_name: RATING_CATEGORY_NAMES.WORK_ENVIRONMENT,
        description: 'Đánh giá về môi trường làm việc, văn phòng, thiết bị',
        display_order: 1,
      },
      {
        name: RATING_CATEGORIES.SALARY_BENEFITS,
        display_name: RATING_CATEGORY_NAMES.SALARY_BENEFITS,
        description: 'Đánh giá về lương, thưởng, và các phúc lợi',
        display_order: 2,
      },
      {
        name: RATING_CATEGORIES.COMPANY_CULTURE,
        display_name: RATING_CATEGORY_NAMES.COMPANY_CULTURE,
        description: 'Đánh giá về văn hóa công ty, đồng nghiệp',
        display_order: 3,
      },
      {
        name: RATING_CATEGORIES.GROWTH_OPPORTUNITIES,
        display_name: RATING_CATEGORY_NAMES.GROWTH_OPPORTUNITIES,
        description: 'Đánh giá về cơ hội thăng tiến, học hỏi',
        display_order: 4,
      },
    ]);

    console.log('📦 Creating companies...');

    // Create companies
    const company1 = await Company.create({
      name: 'FPT Software',
      address: '17 Duy Tân, Cầu Giấy, Hà Nội',
      description: 'FPT Software là công ty phát triển phần mềm hàng đầu Việt Nam, thuộc Tập đoàn FPT. Công ty cung cấp các dịch vụ phần mềm và giải pháp công nghệ cho khách hàng toàn cầu.',
      email: 'contact@fpt-software.com',
      phone: '024-7300-7300',
      website: 'https://www.fpt-software.com',
      logo_url: 'https://fpt-software.com/logo.png',
      status: COMPANY_STATUS.ACTIVE,
      avg_rating: 4.2,
      total_reviews: 2,
      created_by: adminUser.id,
    });

    const company2 = await Company.create({
      name: 'VNG Corporation',
      address: 'Z06 Đường số 13, KCX Tân Thuận, Quận 7, TP.HCM',
      description: 'VNG là công ty công nghệ hàng đầu Việt Nam, nổi tiếng với các sản phẩm như Zalo, ZaloPay và các game online.',
      email: 'contact@vng.com.vn',
      phone: '028-7306-6999',
      website: 'https://www.vng.com.vn',
      logo_url: 'https://vng.com.vn/logo.png',
      status: COMPANY_STATUS.ACTIVE,
      avg_rating: 4.5,
      total_reviews: 1,
      created_by: adminUser.id,
    });

    const company3 = await Company.create({
      name: 'Tiki Corporation',
      address: '52 Út Tịch, Phường 4, Quận Tân Bình, TP.HCM',
      description: 'Tiki là sàn thương mại điện tử hàng đầu Việt Nam với dịch vụ giao hàng nhanh TikiNOW.',
      email: 'contact@tiki.vn',
      phone: '1900-6035',
      website: 'https://tiki.vn',
      logo_url: 'https://tiki.vn/logo.png',
      status: COMPANY_STATUS.ACTIVE,
      avg_rating: 4.0,
      total_reviews: 1,
      created_by: managerUser.id,
    });

    const company4 = await Company.create({
      name: 'Momo',
      address: '284 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM',
      description: 'MoMo là ví điện tử hàng đầu Việt Nam với hơn 31 triệu người dùng.',
      email: 'support@momo.vn',
      phone: '1900-5454-41',
      website: 'https://momo.vn',
      logo_url: 'https://momo.vn/logo.png',
      status: COMPANY_STATUS.PENDING,
      created_by: managerUser.id,
    });

    const company5 = await Company.create({
      name: 'Shopee Vietnam',
      address: 'Tầng 26, 28-34 Phạm Hùng, Quận 8, TP.HCM',
      description: 'Shopee là sàn thương mại điện tử thuộc Sea Group, Singapore.',
      email: 'support@shopee.vn',
      phone: '1900-1221',
      website: 'https://shopee.vn',
      logo_url: 'https://shopee.vn/logo.png',
      status: COMPANY_STATUS.ACTIVE,
      avg_rating: 3.8,
      total_reviews: 1,
      created_by: adminUser.id,
    });

    console.log('📦 Creating company categories...');

    // Create company categories
    await CompanyCategory.bulkCreate([
      { company_id: company1.id, category_name: 'Công nghệ' },
      { company_id: company1.id, category_name: 'Phần mềm' },
      { company_id: company1.id, category_name: 'Outsourcing' },
      { company_id: company2.id, category_name: 'Công nghệ' },
      { company_id: company2.id, category_name: 'Game' },
      { company_id: company2.id, category_name: 'Fintech' },
      { company_id: company3.id, category_name: 'E-commerce' },
      { company_id: company3.id, category_name: 'Logistics' },
      { company_id: company4.id, category_name: 'Fintech' },
      { company_id: company4.id, category_name: 'Thanh toán điện tử' },
      { company_id: company5.id, category_name: 'E-commerce' },
    ]);

    console.log('📦 Creating company owners...');

    // Create company owners
    await CompanyOwner.bulkCreate([
      { company_id: company1.id, user_id: ownerUser1.id },
      { company_id: company2.id, user_id: ownerUser2.id },
    ]);

    console.log('📦 Creating reviews...');

    // Create reviews
    const review1 = await Review.create({
      company_id: company1.id,
      user_id: regularUser1.id,
      title: 'Môi trường làm việc tuyệt vời',
      content: 'FPT Software là một nơi làm việc tuyệt vời cho người mới vào nghề. Môi trường làm việc chuyên nghiệp, đồng nghiệp thân thiện. Có nhiều cơ hội được đào tạo và phát triển kỹ năng. Lương thưởng cạnh tranh với thị trường. Tuy nhiên, đôi khi phải OT nhiều khi dự án gấp.',
      overall_rating: 4,
      status: REVIEW_STATUS.PUBLISHED,
      is_anonymous: false,
    });

    const review2 = await Review.create({
      company_id: company1.id,
      user_id: regularUser2.id,
      title: 'Công ty lớn nhưng còn nhiều điểm cần cải thiện',
      content: 'Đây là công ty phần mềm lớn nhất Việt Nam. Quy trình làm việc bài bản, có nhiều dự án hay để học hỏi. Tuy nhiên, lương ở mức trung bình so với thị trường và thủ tục hành chính khá rườm rà. Văn hóa công ty tốt, nhiều hoạt động team building.',
      overall_rating: 4,
      status: REVIEW_STATUS.PUBLISHED,
      is_anonymous: true,
    });

    const review3 = await Review.create({
      company_id: company2.id,
      user_id: regularUser1.id,
      title: 'VNG - Nơi làm việc mơ ước',
      content: 'VNG là một trong những công ty công nghệ tốt nhất để làm việc tại Việt Nam. Văn hóa công ty rất trẻ trung và năng động. Lương thưởng rất cao, phúc lợi tuyệt vời. Được làm việc với những sản phẩm có hàng triệu người dùng. Highly recommend!',
      overall_rating: 5,
      status: REVIEW_STATUS.PUBLISHED,
      is_anonymous: false,
    });

    const review4 = await Review.create({
      company_id: company3.id,
      user_id: regularUser3.id,
      title: 'Tiki - Startup năng động',
      content: 'Môi trường startup năng động, được tiếp xúc với nhiều công nghệ mới. Team rất trẻ và nhiệt huyết. Tuy nhiên, áp lực công việc khá cao và thường xuyên thay đổi yêu cầu. Lương ổn nhưng không cao bằng các công ty nước ngoài.',
      overall_rating: 4,
      status: REVIEW_STATUS.PUBLISHED,
      is_anonymous: false,
    });

    const review5 = await Review.create({
      company_id: company5.id,
      user_id: regularUser2.id,
      title: 'Shopee - Áp lực cao nhưng học được nhiều',
      content: 'Làm việc tại Shopee rất áp lực, OT liên tục nhất là những dịp sale lớn. Tuy nhiên, được học hỏi rất nhiều từ quy trình làm việc của công ty Singapore. Lương khá cao nhưng work-life balance không tốt lắm.',
      overall_rating: 4,
      status: REVIEW_STATUS.PUBLISHED,
      is_anonymous: false,
    });

    console.log('📦 Creating ratings...');

    // Create ratings for reviews
    const ratingsData = [
      // Review 1
      { review_id: review1.id, category_id: ratingCategories[0].id, rating_value: 5 },
      { review_id: review1.id, category_id: ratingCategories[1].id, rating_value: 4 },
      { review_id: review1.id, category_id: ratingCategories[2].id, rating_value: 4 },
      { review_id: review1.id, category_id: ratingCategories[3].id, rating_value: 4 },
      // Review 2
      { review_id: review2.id, category_id: ratingCategories[0].id, rating_value: 4 },
      { review_id: review2.id, category_id: ratingCategories[1].id, rating_value: 3 },
      { review_id: review2.id, category_id: ratingCategories[2].id, rating_value: 4 },
      { review_id: review2.id, category_id: ratingCategories[3].id, rating_value: 4 },
      // Review 3
      { review_id: review3.id, category_id: ratingCategories[0].id, rating_value: 5 },
      { review_id: review3.id, category_id: ratingCategories[1].id, rating_value: 5 },
      { review_id: review3.id, category_id: ratingCategories[2].id, rating_value: 5 },
      { review_id: review3.id, category_id: ratingCategories[3].id, rating_value: 5 },
      // Review 4
      { review_id: review4.id, category_id: ratingCategories[0].id, rating_value: 4 },
      { review_id: review4.id, category_id: ratingCategories[1].id, rating_value: 3 },
      { review_id: review4.id, category_id: ratingCategories[2].id, rating_value: 4 },
      { review_id: review4.id, category_id: ratingCategories[3].id, rating_value: 4 },
      // Review 5
      { review_id: review5.id, category_id: ratingCategories[0].id, rating_value: 4 },
      { review_id: review5.id, category_id: ratingCategories[1].id, rating_value: 4 },
      { review_id: review5.id, category_id: ratingCategories[2].id, rating_value: 3 },
      { review_id: review5.id, category_id: ratingCategories[3].id, rating_value: 4 },
    ];

    await Rating.bulkCreate(ratingsData);

    console.log('📦 Creating comments...');

    // Create comments
    const comment1 = await Comment.create({
      review_id: review1.id,
      user_id: regularUser2.id,
      content: 'Cảm ơn bạn đã chia sẻ. Mình cũng đang xem xét apply vào FPT!',
    });

    await Comment.create({
      review_id: review1.id,
      user_id: regularUser1.id,
      parent_comment_id: comment1.id,
      content: 'Chúc bạn may mắn nhé! Có gì cứ hỏi mình.',
    });

    await Comment.create({
      review_id: review3.id,
      user_id: regularUser3.id,
      content: 'Review rất chi tiết! VNG có hiring không bạn?',
    });

    console.log('📦 Creating company responses...');

    // Create company responses
    await CompanyResponse.create({
      review_id: review1.id,
      company_id: company1.id,
      user_id: ownerUser1.id,
      content: 'Cảm ơn bạn đã dành thời gian chia sẻ trải nghiệm tại FPT Software. Chúng tôi luôn lắng nghe và cải thiện để mang đến môi trường làm việc tốt nhất cho nhân viên.',
    });

    await CompanyResponse.create({
      review_id: review3.id,
      company_id: company2.id,
      user_id: ownerUser2.id,
      content: 'Xin cảm ơn những lời nhận xét tích cực! VNG luôn chào đón các tài năng công nghệ. Bạn có thể tìm hiểu các vị trí đang tuyển dụng tại careers.vng.com.vn',
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('   Admin:    admin@reviewcompany.com / password123');
    console.log('   Manager:  manager@reviewcompany.com / password123');
    console.log('   Owner 1:  owner1@company.com / password123');
    console.log('   Owner 2:  owner2@company.com / password123');
    console.log('   User 1:   user1@gmail.com / password123');
    console.log('   User 2:   user2@gmail.com / password123');
    console.log('   User 3:   user3@gmail.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
