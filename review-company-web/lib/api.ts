import {
  Company,
  User,
  Review,
  RatingCategory,
  Rating,
  CompanyResponse,
  CommentWithUser,
} from './types';

// API Base URL
const API_BASE_URL = 'https://api.reviewscongty.com/api';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: Pagination;
}

// Company with categories from API
export interface CompanyFromApi extends Company {
  categories?: { id: string; category_name: string }[];
  owners?: {
    id: string;
    user_id: string;
    user: { id: string; name: string; email: string };
  }[];
  creator?: { id: string; name: string };
}

// Review with details from API
export interface ReviewFromApi extends Review {
  user: { id: string; name: string; avatar_url: string | null } | null;
  company?: { id: string; name: string; logo_url: string | null };
  ratings: (Rating & { category: RatingCategory })[];
  companyResponse: CompanyResponse | null;
  comments?: CommentWithUser[];
}

// Statistics response
export interface Statistics {
  totalCompanies: number;
  totalReviews: number;
  totalUsers: number;
  totalComments: number;
  averageRating: number;
}

// Category rating from API
export interface CategoryRatingFromApi {
  category: RatingCategory;
  averageRating: number;
  count: number;
}

// Auth types
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Fetch params
export interface FetchCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  minRating?: number;
  sort?: 'rating_desc' | 'rating_asc' | 'newest' | 'oldest' | 'reviews_desc' | 'name_asc' | 'name_desc';
  status?: string;
}

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Helper function to build headers
function buildHeaders(includeAuth: boolean = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// Generic API fetch function
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...buildHeaders(includeAuth),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data;
}

// ============ Company APIs ============

export async function fetchCompanies(
  params: FetchCompaniesParams = {}
): Promise<PaginatedData<CompanyFromApi>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.minRating) searchParams.set('minRating', params.minRating.toString());
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.status) searchParams.set('status', params.status);

  const queryString = searchParams.toString();
  const endpoint = `/companies${queryString ? `?${queryString}` : ''}`;

  return apiFetch<PaginatedData<CompanyFromApi>>(endpoint);
}

export async function fetchCompanyById(id: string): Promise<CompanyFromApi> {
  return apiFetch<CompanyFromApi>(`/companies/${id}`);
}

export async function fetchCompanyReviews(
  companyId: string,
  params: { page?: number; limit?: number; minRating?: number; maxRating?: number } = {}
): Promise<PaginatedData<ReviewFromApi>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.minRating) searchParams.set('minRating', params.minRating.toString());
  if (params.maxRating) searchParams.set('maxRating', params.maxRating.toString());

  const queryString = searchParams.toString();
  const endpoint = `/companies/${companyId}/reviews${queryString ? `?${queryString}` : ''}`;

  return apiFetch<PaginatedData<ReviewFromApi>>(endpoint);
}

export async function fetchCompanyCategoryRatings(
  companyId: string
): Promise<CategoryRatingFromApi[]> {
  return apiFetch<CategoryRatingFromApi[]>(`/companies/${companyId}/category-ratings`);
}

// ============ Statistics API ============

export async function fetchStatistics(): Promise<Statistics> {
  return apiFetch<Statistics>('/statistics');
}

// ============ Rating Categories API ============

export async function fetchRatingCategories(): Promise<RatingCategory[]> {
  return apiFetch<RatingCategory[]>('/rating-categories');
}

// ============ Auth APIs ============

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: RegisterData): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchCurrentUser(): Promise<User> {
  return apiFetch<User>('/auth/me', {}, true);
}

export async function updateProfile(data: { name?: string; avatar_url?: string }): Promise<User> {
  return apiFetch<User>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }, true);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return apiFetch<void>('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  }, true);
}

// ============ Review APIs ============

export interface CreateReviewData {
  company_id: string;
  title?: string;
  content: string;
  overall_rating: number;
  is_anonymous?: boolean;
  ratings?: { category_id: string; rating_value: number }[];
  status?: 'DRAFT' | 'PUBLISHED';
}

export async function createReview(data: CreateReviewData): Promise<ReviewFromApi> {
  return apiFetch<ReviewFromApi>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export async function updateReview(
  id: string,
  data: Partial<CreateReviewData>
): Promise<ReviewFromApi> {
  return apiFetch<ReviewFromApi>(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, true);
}

export async function deleteReview(id: string): Promise<void> {
  return apiFetch<void>(`/reviews/${id}`, {
    method: 'DELETE',
  }, true);
}

export async function fetchReviewById(id: string): Promise<ReviewFromApi> {
  return apiFetch<ReviewFromApi>(`/reviews/${id}`);
}

export async function fetchMyReviews(
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedData<ReviewFromApi>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const endpoint = `/reviews/my-reviews${queryString ? `?${queryString}` : ''}`;

  return apiFetch<PaginatedData<ReviewFromApi>>(endpoint, {}, true);
}

// ============ Comment APIs ============

export interface CreateCommentData {
  content: string;
  parent_comment_id?: string;
}

export async function createComment(
  reviewId: string,
  data: CreateCommentData
): Promise<CommentWithUser> {
  return apiFetch<CommentWithUser>(`/reviews/${reviewId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
}

export async function updateComment(
  id: string,
  content: string
): Promise<CommentWithUser> {
  return apiFetch<CommentWithUser>(`/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  }, true);
}

export async function deleteComment(id: string): Promise<void> {
  return apiFetch<void>(`/comments/${id}`, {
    method: 'DELETE',
  }, true);
}

export async function likeComment(id: string): Promise<void> {
  return apiFetch<void>(`/comments/${id}/like`, {
    method: 'POST',
  }, true);
}

export async function fetchReviewComments(
  reviewId: string
): Promise<CommentWithUser[]> {
  return apiFetch<CommentWithUser[]>(`/reviews/${reviewId}/comments`);
}

// ============ Company Response APIs ============

export async function createCompanyResponse(
  reviewId: string,
  content: string
): Promise<CompanyResponse> {
  return apiFetch<CompanyResponse>(`/reviews/${reviewId}/response`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }, true);
}

export async function updateCompanyResponse(
  id: string,
  content: string
): Promise<CompanyResponse> {
  return apiFetch<CompanyResponse>(`/company-responses/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  }, true);
}

export async function deleteCompanyResponse(id: string): Promise<void> {
  return apiFetch<void>(`/company-responses/${id}`, {
    method: 'DELETE',
  }, true);
}
