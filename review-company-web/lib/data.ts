import companiesData from './data/companies.json';
import reviewsData from './data/reviews.json';
import usersData from './data/users.json';
import commentsData from './data/comments.json';
import ratingCategoriesData from './data/rating_categories.json';
import ratingsData from './data/ratings.json';
import companyResponsesData from './data/company_responses.json';
import {
  Company,
  Review,
  User,
  Comment,
  RatingCategory,
  Rating,
  CompanyResponse,
  ReviewWithDetails,
  CommentWithUser,
  CategoryRating,
} from './types';

// Type assertions for imported data
const companies = companiesData as Company[];
const reviews = reviewsData as Review[];
const users = usersData as User[];
const comments = commentsData as Comment[];
const ratingCategories = ratingCategoriesData as RatingCategory[];
const ratings = ratingsData as Rating[];
const companyResponses = companyResponsesData as CompanyResponse[];

// Get all active companies
export function getActiveCompanies(): Company[] {
  return companies.filter((c) => c.status === 'ACTIVE');
}

// Get company by ID
export function getCompanyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

// Get top rated companies
export function getTopRatedCompanies(limit: number = 6): Company[] {
  return getActiveCompanies()
    .filter((c) => c.avg_rating !== null)
    .sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
    .slice(0, limit);
}

// Search companies by name
export function searchCompanies(query: string): Company[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return getActiveCompanies();
  
  return getActiveCompanies().filter((c) =>
    c.name.toLowerCase().includes(normalizedQuery) ||
    c.description?.toLowerCase().includes(normalizedQuery)
  );
}

// Filter companies by rating
export function filterCompaniesByRating(minRating: number): Company[] {
  return getActiveCompanies().filter(
    (c) => c.avg_rating !== null && c.avg_rating >= minRating
  );
}

// Sort companies
export type SortOption = 'rating' | 'newest' | 'reviews';

export function sortCompanies(companies: Company[], sortBy: SortOption): Company[] {
  const sorted = [...companies];
  
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'reviews':
      return sorted.sort((a, b) => b.total_reviews - a.total_reviews);
    default:
      return sorted;
  }
}

// Get user by ID
export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

// Get reviews for a company
export function getReviewsForCompany(companyId: string): Review[] {
  return reviews.filter(
    (r) => r.company_id === companyId && r.status === 'PUBLISHED'
  );
}

// Get reviews with details for a company
export function getReviewsWithDetailsForCompany(companyId: string): ReviewWithDetails[] {
  const companyReviews = getReviewsForCompany(companyId);
  
  return companyReviews.map((review) => {
    const user = review.is_anonymous ? null : getUserById(review.user_id);
    const reviewRatings = ratings.filter((r) => r.review_id === review.id);
    const reviewComments = getCommentsForReview(review.id);
    const response = companyResponses.find((cr) => cr.review_id === review.id);
    
    return {
      ...review,
      user: user || null,
      ratings: reviewRatings,
      comments: reviewComments,
      companyResponse: response || null,
    };
  });
}

// Get comments for a review with nested structure
export function getCommentsForReview(reviewId: string): CommentWithUser[] {
  const reviewComments = comments.filter((c) => c.review_id === reviewId);
  
  // Get root comments (no parent)
  const rootComments = reviewComments.filter((c) => c.parent_comment_id === null);
  
  // Build nested structure
  const buildNestedComments = (comment: Comment): CommentWithUser => {
    const user = getUserById(comment.user_id);
    const replies = reviewComments
      .filter((c) => c.parent_comment_id === comment.id)
      .map((reply) => buildNestedComments(reply));
    
    return {
      ...comment,
      user: user || null,
      replies: replies.length > 0 ? replies : undefined,
    };
  };
  
  return rootComments.map((c) => buildNestedComments(c));
}

// Get rating categories
export function getRatingCategories(): RatingCategory[] {
  return ratingCategories;
}

// Calculate category ratings for a company
export function getCategoryRatingsForCompany(companyId: string): CategoryRating[] {
  const companyReviews = getReviewsForCompany(companyId);
  const reviewIds = companyReviews.map((r) => r.id);
  const relevantRatings = ratings.filter((r) => reviewIds.includes(r.review_id));
  
  return ratingCategories.map((category) => {
    const categoryRatings = relevantRatings.filter(
      (r) => r.category_id === category.id
    );
    const count = categoryRatings.length;
    const sum = categoryRatings.reduce((acc, r) => acc + r.rating_value, 0);
    const averageRating = count > 0 ? sum / count : 0;
    
    return {
      category,
      averageRating,
      count,
    };
  });
}

// Get statistics
export function getStatistics() {
  const activeCompanies = getActiveCompanies();
  const publishedReviews = reviews.filter((r) => r.status === 'PUBLISHED');
  const totalRating = activeCompanies.reduce(
    (acc, c) => acc + (c.avg_rating || 0),
    0
  );
  const avgRating =
    activeCompanies.length > 0
      ? totalRating / activeCompanies.filter((c) => c.avg_rating !== null).length
      : 0;
  
  return {
    totalCompanies: activeCompanies.length,
    totalReviews: publishedReviews.length,
    averageRating: Math.round(avgRating * 10) / 10,
  };
}

// Get category name in Vietnamese
export function getCategoryNameVi(categoryName: string): string {
  const names: Record<string, string> = {
    WORK_ENVIRONMENT: 'Môi trường làm việc',
    SALARY_BENEFITS: 'Lương thưởng',
    COMPANY_CULTURE: 'Văn hóa công ty',
    GROWTH_OPPORTUNITIES: 'Cơ hội phát triển',
  };
  return names[categoryName] || categoryName;
}
