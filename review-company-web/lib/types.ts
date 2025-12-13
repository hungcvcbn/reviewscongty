// Company types
export type CompanyStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'REJECTED';

export interface Company {
  id: string;
  name: string;
  address: string;
  description: string | null;
  email: string;
  phone: string;
  website: string | null;
  logo_url: string | null;
  status: CompanyStatus;
  avg_rating: number | null;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  version: number;
}

// User types
export type UserRole = 'ADMIN' | 'MANAGER' | 'USER' | 'COMPANY_OWNER';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

// Review types
export type ReviewStatus = 'DRAFT' | 'PUBLISHED' | 'EDITED' | 'DELETED';

export interface Review {
  id: string;
  company_id: string;
  user_id: string;
  title: string | null;
  content: string;
  overall_rating: number;
  status: ReviewStatus;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  edit_count: number;
}

// Rating types
export interface RatingCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Rating {
  id: string;
  review_id: string;
  category_id: string;
  rating_value: number;
  created_at: string;
}

// Comment types
export interface Comment {
  id: string;
  review_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

// Company Owner types
export interface CompanyOwner {
  id: string;
  company_id: string;
  user_id: string;
  created_at: string;
}

// Company Response types
export interface CompanyResponse {
  id: string;
  review_id: string;
  company_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Company Category types
export interface CompanyCategory {
  id: string;
  company_id: string;
  category_name: string;
  created_at: string;
}

// Aggregated types for UI
export interface ReviewWithUser extends Review {
  user: User | null;
}

export interface ReviewWithDetails extends Review {
  user: User | null;
  ratings: Rating[];
  comments: CommentWithUser[];
  companyResponse: CompanyResponse | null;
}

export interface CommentWithUser extends Comment {
  user: User | null;
  replies?: CommentWithUser[];
}

export interface CategoryRating {
  category: RatingCategory;
  averageRating: number;
  count: number;
}
