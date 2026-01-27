# MovieStream - Frontend Detailed Design (Next.js)

> **Purpose**: Tài liệu chi tiết để triển khai Next.js Frontend cho MovieStream MVP.1
>
> **Tech Stack**: Next.js 15 + App Router + shadcn/ui + TailwindCSS
>
> **Target**: AI có thể code trực tiếp từ tài liệu này

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| React | React | 19.x |
| UI Library | shadcn/ui + Radix UI | Latest |
| Styling | TailwindCSS | 4.x |
| State Management | Zustand | 5.x |
| Data Fetching | TanStack Query (React Query) | 5.x |
| Video Player | HLS.js | 1.x |
| Forms | React Hook Form + Zod | Latest |
| Icons | Lucide React | Latest |
| Charts | Recharts | 2.x |
| Upload | tus-js-client | 4.x |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group
│   │   ├── page.tsx              # Home page
│   │   ├── movies/
│   │   │   ├── page.tsx          # Movie listing
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx      # Movie detail
│   │   │   │   └── watch/
│   │   │   │       └── [episodeNum]/
│   │   │   │           └── page.tsx  # Video player
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx   # Category movies
│   │   ├── tags/
│   │   │   └── [slug]/page.tsx   # Tag movies
│   │   └── search/page.tsx       # Search results
│   │
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx            # Auth layout (centered)
│   │
│   ├── (protected)/              # Protected routes group
│   │   ├── profile/page.tsx      # User profile
│   │   ├── history/page.tsx      # Watch history
│   │   ├── favorites/page.tsx    # Favorites
│   │   ├── subscription/
│   │   │   ├── page.tsx          # Current subscription
│   │   │   ├── plans/page.tsx    # Plan selection
│   │   │   └── history/page.tsx  # Payment history
│   │   └── layout.tsx            # Auth check layout
│   │
│   ├── (admin)/                  # Admin routes group
│   │   ├── admin/
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── movies/
│   │   │   │   ├── page.tsx      # Movie list
│   │   │   │   ├── new/page.tsx  # Create movie
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  # Edit movie
│   │   │   │       └── episodes/page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx      # User list
│   │   │   │   └── [id]/page.tsx # User detail
│   │   │   ├── payments/page.tsx # Payment list
│   │   │   └── subscriptions/page.tsx
│   │   └── layout.tsx            # Admin layout + role check
│   │
│   ├── payment/                  # Payment callbacks
│   │   ├── success/page.tsx
│   │   └── failed/page.tsx
│   │
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Global loading
│   ├── error.tsx                 # Global error
│   └── not-found.tsx             # 404 page
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── tabs.tsx
│   │   ├── progress.tsx
│   │   ├── slider.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── header.tsx            # Main header + nav
│   │   ├── footer.tsx            # Footer
│   │   ├── sidebar.tsx           # Admin sidebar
│   │   └── mobile-nav.tsx        # Mobile navigation
│   │
│   ├── movie/
│   │   ├── movie-card.tsx        # Movie poster card
│   │   ├── movie-grid.tsx        # Grid layout
│   │   ├── movie-carousel.tsx    # Horizontal scroll
│   │   ├── episode-list.tsx      # Episode selector
│   │   ├── movie-info.tsx        # Detail page info
│   │   └── related-movies.tsx    # Related movies
│   │
│   ├── video/
│   │   ├── video-player.tsx      # HLS video player
│   │   ├── video-controls.tsx    # Custom controls
│   │   ├── video-watermark.tsx   # Watermark overlay
│   │   ├── quality-selector.tsx  # Quality picker
│   │   └── speed-selector.tsx    # Speed control
│   │
│   ├── review/
│   │   ├── review-list.tsx       # Reviews list
│   │   ├── review-card.tsx       # Single review
│   │   ├── review-form.tsx       # Write review
│   │   ├── rating-stars.tsx      # Star rating
│   │   └── rating-summary.tsx    # Rating distribution
│   │
│   ├── subscription/
│   │   ├── plan-card.tsx         # Plan card
│   │   ├── plan-comparison.tsx   # Compare plans
│   │   └── subscription-badge.tsx # Status badge
│   │
│   ├── admin/
│   │   ├── dashboard-stats.tsx   # Stats cards
│   │   ├── revenue-chart.tsx     # Revenue chart
│   │   ├── user-chart.tsx        # User growth chart
│   │   ├── data-table.tsx        # Generic data table
│   │   ├── video-uploader.tsx    # TUS upload component
│   │   └── movie-form.tsx        # Movie create/edit form
│   │
│   └── common/
│       ├── search-bar.tsx        # Global search
│       ├── pagination.tsx        # Pagination
│       ├── loading-spinner.tsx   # Loading states
│       ├── empty-state.tsx       # Empty states
│       └── error-boundary.tsx    # Error handling
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # API client (fetch wrapper)
│   │   ├── auth.ts               # Auth API calls
│   │   ├── movies.ts             # Movie API calls
│   │   ├── streaming.ts          # Streaming API calls
│   │   ├── subscription.ts       # Subscription API calls
│   │   ├── user.ts               # User API calls
│   │   ├── review.ts             # Review API calls
│   │   └── admin.ts              # Admin API calls
│   │
│   ├── hooks/
│   │   ├── use-auth.ts           # Auth state hook
│   │   ├── use-movies.ts         # Movies query hooks
│   │   ├── use-streaming.ts      # Streaming hooks
│   │   ├── use-subscription.ts   # Subscription hooks
│   │   ├── use-user.ts           # User hooks
│   │   ├── use-reviews.ts        # Review hooks
│   │   ├── use-device-id.ts      # Device ID hook
│   │   └── use-debounce.ts       # Utility hooks
│   │
│   ├── stores/
│   │   ├── auth-store.ts         # Auth state (Zustand)
│   │   ├── player-store.ts       # Video player state
│   │   └── ui-store.ts           # UI state (modals, etc)
│   │
│   ├── utils/
│   │   ├── format.ts             # Formatters (date, currency)
│   │   ├── validation.ts         # Zod schemas
│   │   └── helpers.ts            # Misc helpers
│   │
│   └── constants.ts              # App constants
│
├── types/
│   ├── api.ts                    # API response types
│   ├── movie.ts                  # Movie types
│   ├── user.ts                   # User types
│   ├── subscription.ts           # Subscription types
│   └── admin.ts                  # Admin types
│
└── styles/
    └── globals.css               # Global styles + Tailwind
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server-side only
API_URL=http://localhost:3001/api/v1
```

---

## API Client Setup

### File: `lib/api/client.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null) {
    this.accessToken = token;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include' // For refresh token cookie
    });

    // Handle 401 - try refresh token
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include'
        });
        const retryData = await retryResponse.json();
        if (!retryData.success) {
          throw new ApiError(retryData.error.code, retryData.error.message);
        }
        return retryData.data;
      }
      throw new AuthError('Session expired');
    }

    const data = await response.json();

    if (!data.success) {
      throw new ApiError(data.error.code, data.error.message);
    }

    return data.data;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        this.accessToken = data.data.accessToken;
        return true;
      }
    } catch {
      // Refresh failed
    }
    return false;
  }
}

export const apiClient = new ApiClient();
```

---

## Auth State Management

### File: `lib/stores/auth-store.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  subscription?: {
    status: 'ACTIVE' | 'EXPIRED' | null;
    plan?: string;
    expiresAt?: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isInitialized: false,

      login: async (email, password, rememberMe = false) => {
        set({ isLoading: true });
        try {
          const data = await apiClient.fetch<{
            user: User;
            accessToken: string;
            expiresIn: number;
          }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, rememberMe })
          });
          set({ user: data.user, accessToken: data.accessToken });
          apiClient.setToken(data.accessToken);
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const result = await apiClient.fetch<{
            user: User;
            accessToken: string;
            expiresIn: number;
          }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
          });
          set({ user: result.user, accessToken: result.accessToken });
          apiClient.setToken(result.accessToken);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await apiClient.fetch('/auth/logout', { method: 'POST' });
        } catch {
          // Ignore errors on logout
        }
        set({ user: null, accessToken: null });
        apiClient.setToken(null);
      },

      initialize: async () => {
        const { accessToken } = get();
        if (accessToken) {
          apiClient.setToken(accessToken);
          try {
            const user = await apiClient.fetch<User>('/auth/me');
            set({ user, isInitialized: true });
          } catch {
            set({ user: null, accessToken: null, isInitialized: true });
            apiClient.setToken(null);
          }
        } else {
          set({ isInitialized: true });
        }
      },

      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ accessToken: token });
        apiClient.setToken(token);
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken
      })
    }
  )
);

// Custom hook for easier access
export function useAuth() {
  const store = useAuthStore();
  return {
    user: store.user,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    isAuthenticated: !!store.user,
    isAdmin: store.user?.role === 'ADMIN',
    hasActiveSubscription: store.user?.subscription?.status === 'ACTIVE',
    login: store.login,
    register: store.register,
    logout: store.logout,
    initialize: store.initialize
  };
}
```

---

## React Query Setup

### File: `lib/hooks/use-movies.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Movie, MovieSummary, MovieFilters, PaginatedResponse } from '@/types/movie';

// List movies with filters
export function useMovies(filters: MovieFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.category) params.set('category', filters.category);
  if (filters.tag) params.set('tag', filters.tag);
  if (filters.year) params.set('year', filters.year.toString());
  if (filters.sort) params.set('sort', filters.sort);

  return useQuery({
    queryKey: ['movies', filters],
    queryFn: () => apiClient.fetch<PaginatedResponse<MovieSummary>>(
      `/movies?${params.toString()}`
    ),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

// Movie detail
export function useMovie(slug: string) {
  return useQuery({
    queryKey: ['movies', slug],
    queryFn: () => apiClient.fetch<Movie>(`/movies/${slug}`),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug
  });
}

// Search movies (with debounce handling in component)
export function useMovieSearch(query: string) {
  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => apiClient.fetch<MovieSummary[]>(
      `/movies/search?q=${encodeURIComponent(query)}`
    ),
    enabled: query.length >= 2,
    staleTime: 30 * 1000 // 30 seconds
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.fetch<Array<{
      id: string;
      name: string;
      slug: string;
      sortOrder: number;
    }>>('/categories'),
    staleTime: 60 * 60 * 1000 // 1 hour
  });
}

// Tags
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.fetch<Array<{
      id: string;
      name: string;
      slug: string;
      color: string;
    }>>('/tags'),
    staleTime: 60 * 60 * 1000 // 1 hour
  });
}
```

### File: `lib/hooks/use-user.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { WatchHistory, Favorite, PaginatedResponse } from '@/types/user';

// Watch history
export function useWatchHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['user', 'history', page, limit],
    queryFn: () => apiClient.fetch<PaginatedResponse<WatchHistory>>(
      `/user/history?page=${page}&limit=${limit}`
    )
  });
}

// Continue watching
export function useContinueWatching(limit = 10) {
  return useQuery({
    queryKey: ['user', 'continue-watching', limit],
    queryFn: () => apiClient.fetch<WatchHistory[]>(
      `/user/continue-watching?limit=${limit}`
    )
  });
}

// Favorites
export function useFavorites(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['user', 'favorites', page, limit],
    queryFn: () => apiClient.fetch<PaginatedResponse<Favorite>>(
      `/user/favorites?page=${page}&limit=${limit}`
    )
  });
}

// Add to favorites
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) =>
      apiClient.fetch(`/user/favorites/${movieId}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'favorites'] });
    }
  });
}

// Remove from favorites
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) =>
      apiClient.fetch(`/user/favorites/${movieId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'favorites'] });
    }
  });
}

// Save watch progress
export function useSaveProgress() {
  return useMutation({
    mutationFn: (data: { episodeId: string; progress: number; duration: number }) =>
      apiClient.fetch('/user/history', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  });
}

// Clear history
export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.fetch('/user/history', { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'continue-watching'] });
    }
  });
}
```

### File: `lib/hooks/use-streaming.ts`

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { StreamData } from '@/types/streaming';

// Get stream URL
export function useStreamUrl(episodeId: string, deviceId: string) {
  return useQuery({
    queryKey: ['stream', episodeId, deviceId],
    queryFn: () => apiClient.fetch<StreamData>(`/stream/${episodeId}`, {
      headers: { 'X-Device-ID': deviceId }
    }),
    enabled: !!episodeId && !!deviceId,
    staleTime: 0, // Always refetch
    gcTime: 0 // Don't cache
  });
}

// Stream heartbeat
export function useStreamHeartbeat() {
  return useMutation({
    mutationFn: (data: { episodeId: string; deviceId: string; progress: number }) =>
      apiClient.fetch('/stream/heartbeat', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  });
}

// End stream
export function useEndStream() {
  return useMutation({
    mutationFn: (data: { episodeId: string; deviceId: string; finalProgress: number }) =>
      apiClient.fetch('/stream/end', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  });
}
```

### File: `lib/hooks/use-device-id.ts`

```typescript
import { useState, useEffect } from 'react';

const DEVICE_ID_KEY = 'ms_device_id';

function generateDeviceId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateDeviceId();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    setDeviceId(id);
  }, []);

  return deviceId;
}
```

---

## TypeScript Types

### File: `types/movie.ts`

```typescript
export interface MovieSummary {
  id: string;
  title: string;
  slug: string;
  poster: string;
  year: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isPremium: boolean;
  totalEpisodes: number;
  currentEpisodes: number;
  viewCount: number;
  rating: number;
  categories: Array<{ id: string; name: string; slug: string }>;
  tags: Array<{ id: string; name: string; slug: string; color: string }>;
}

export interface Movie extends MovieSummary {
  description: string;
  trailer?: string;
  reviewCount: number;
  episodes: Episode[];
  relatedMovies: MovieSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNum: number;
  duration: number;
  isPremium: boolean;
  isReady: boolean;
  createdAt: string;
}

export interface MovieFilters {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  year?: number;
  sort?: 'newest' | 'popular' | 'rating';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### File: `types/user.ts`

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  subscription?: SubscriptionStatus;
  createdAt: string;
}

export interface SubscriptionStatus {
  status: 'ACTIVE' | 'EXPIRED' | null;
  plan?: string;
  expiresAt?: string;
}

export interface WatchHistory {
  id: string;
  episode: {
    id: string;
    title: string;
    episodeNum: number;
    movie: {
      id: string;
      title: string;
      slug: string;
      poster: string;
    };
  };
  progress: number;
  duration: number;
  progressPercent: number;
  watchedAt: string;
}

export interface Favorite {
  movie: {
    id: string;
    title: string;
    slug: string;
    poster: string;
    year: number;
    rating: number;
    totalEpisodes: number;
    status: string;
  };
  addedAt: string;
}
```

### File: `types/streaming.ts`

```typescript
export interface StreamData {
  streamUrl: string;
  episode: {
    id: string;
    title: string;
    episodeNum: number;
    duration: number;
    movie: {
      id: string;
      title: string;
    };
  };
  resumeAt: number;
  watermark: {
    text: string;
    position: string;
  };
  nextEpisode?: {
    id: string;
    title: string;
    episodeNum: number;
  };
  expiresAt: string;
}
```

### File: `types/subscription.ts`

```typescript
export interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceFormatted: string;
  duration: string;
  durationDays: number;
  features: string[];
  maxQuality: '720p' | '1080p';
  canWatchPremium: boolean;
  popular: boolean;
}

export interface Subscription {
  id: string;
  plan: Plan;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  isExpiringSoon: boolean;
}

export interface Payment {
  id: string;
  plan: { id: string; name: string };
  amount: number;
  amountFormatted: string;
  method: 'VNPAY' | 'MOMO';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionId?: string;
  createdAt: string;
  processedAt?: string;
}
```

---

## Page Specifications

### 1. Home Page (`/`)

**File**: `app/(public)/page.tsx`

**Sections**:
1. Hero banner (featured movie/promotion)
2. Continue Watching carousel (if logged in)
3. New Releases carousel
4. Popular Movies carousel
5. Movies by Category (multiple carousels)

```typescript
// app/(public)/page.tsx
import { Suspense } from 'react';
import { HeroBanner } from '@/components/movie/hero-banner';
import { MovieCarousel, MovieCarouselSkeleton } from '@/components/movie/movie-carousel';
import { ContinueWatchingSection } from '@/components/movie/continue-watching-section';
import { apiClient } from '@/lib/api/client';

async function getHomeData() {
  const [newMovies, popularMovies, categories] = await Promise.all([
    apiClient.fetch('/movies?sort=newest&limit=12'),
    apiClient.fetch('/movies?sort=popular&limit=12'),
    apiClient.fetch('/categories')
  ]);
  return { newMovies, popularMovies, categories };
}

export default async function HomePage() {
  const { newMovies, popularMovies, categories } = await getHomeData();

  return (
    <main className="min-h-screen">
      <HeroBanner />

      {/* Client component - checks auth */}
      <Suspense fallback={null}>
        <ContinueWatchingSection />
      </Suspense>

      <section className="container py-8">
        <Suspense fallback={<MovieCarouselSkeleton />}>
          <MovieCarousel title="Mới cập nhật" movies={newMovies.items} />
        </Suspense>

        <Suspense fallback={<MovieCarouselSkeleton />}>
          <MovieCarousel title="Phim hot" movies={popularMovies.items} />
        </Suspense>

        {categories.slice(0, 4).map((category) => (
          <Suspense key={category.id} fallback={<MovieCarouselSkeleton />}>
            <CategoryMoviesSection category={category} />
          </Suspense>
        ))}
      </section>
    </main>
  );
}
```

---

### 2. Movie Detail Page (`/movies/[slug]`)

**File**: `app/(public)/movies/[slug]/page.tsx`

```typescript
// app/(public)/movies/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MovieHeader } from '@/components/movie/movie-header';
import { EpisodeList } from '@/components/movie/episode-list';
import { ReviewSection } from '@/components/review/review-section';
import { RelatedMovies } from '@/components/movie/related-movies';
import { apiClient } from '@/lib/api/client';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const movie = await apiClient.fetch(`/movies/${params.slug}`);
    return {
      title: `${movie.title} - MovieStream`,
      description: movie.description?.slice(0, 160),
      openGraph: {
        title: movie.title,
        description: movie.description,
        images: [movie.poster]
      }
    };
  } catch {
    return { title: 'Movie Not Found' };
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  let movie;
  try {
    movie = await apiClient.fetch(`/movies/${params.slug}`);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <MovieHeader movie={movie} />

      <div className="container py-8">
        {/* Description */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Nội dung phim</h2>
          <p className="text-muted-foreground">{movie.description}</p>
        </section>

        {/* Episodes */}
        {movie.episodes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Danh sách tập</h2>
            <EpisodeList
              episodes={movie.episodes}
              movieSlug={movie.slug}
            />
          </section>
        )}

        {/* Reviews - Client Component */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Đánh giá ({movie.reviewCount})
          </h2>
          <ReviewSection movieId={movie.id} />
        </section>

        {/* Related Movies */}
        {movie.relatedMovies.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Phim liên quan</h2>
            <RelatedMovies movies={movie.relatedMovies} />
          </section>
        )}
      </div>
    </main>
  );
}
```

---

### 3. Video Player Page (`/movies/[slug]/watch/[episodeNum]`)

**File**: `app/(public)/movies/[slug]/watch/[episodeNum]/page.tsx`

```typescript
// app/(public)/movies/[slug]/watch/[episodeNum]/page.tsx
'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/video/video-player';
import { EpisodeNav } from '@/components/video/episode-nav';
import { useAuth } from '@/lib/stores/auth-store';
import { useDeviceId } from '@/lib/hooks/use-device-id';
import { useStreamUrl, useStreamHeartbeat, useEndStream } from '@/lib/hooks/use-streaming';
import { useSaveProgress } from '@/lib/hooks/use-user';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: { slug: string; episodeNum: string };
}

export default function WatchPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const deviceId = useDeviceId();

  // Parse episode ID from URL params (would need to fetch movie first)
  const episodeId = params.episodeNum; // Simplified - actual impl needs movie lookup

  const { data: streamData, error, isLoading, refetch } = useStreamUrl(
    episodeId,
    deviceId
  );

  const heartbeat = useStreamHeartbeat();
  const endStream = useEndStream();
  const saveProgress = useSaveProgress();

  // Heartbeat every 30 seconds
  useEffect(() => {
    if (!streamData || !deviceId) return;

    const interval = setInterval(() => {
      const video = document.querySelector('video');
      if (video) {
        heartbeat.mutate({
          episodeId,
          deviceId,
          progress: Math.floor(video.currentTime)
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [streamData, deviceId, episodeId, heartbeat]);

  // Handle stream end
  const handleStreamEnd = useCallback(async () => {
    const video = document.querySelector('video');
    if (video && deviceId) {
      await endStream.mutateAsync({
        episodeId,
        deviceId,
        finalProgress: Math.floor(video.currentTime)
      });
    }
  }, [deviceId, episodeId, endStream]);

  // Handle progress save
  const handleProgress = useCallback((seconds: number, duration: number) => {
    saveProgress.mutate({
      episodeId,
      progress: seconds,
      duration
    });
  }, [episodeId, saveProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleStreamEnd();
    };
  }, [handleStreamEnd]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert>
          <AlertDescription>
            Vui lòng đăng nhập để xem phim
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/login')} className="mt-4">
          Đăng nhập
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading || !deviceId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error handling
  if (error) {
    const errorCode = (error as any)?.code;

    if (errorCode === 'STREAM_SUBSCRIPTION_REQUIRED') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Alert variant="destructive">
            <AlertDescription>
              Nội dung này yêu cầu subscription Premium
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/subscription/plans')} className="mt-4">
            Xem các gói subscription
          </Button>
        </div>
      );
    }

    if (errorCode === 'STREAM_CONCURRENT_LIMIT') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Alert variant="destructive">
            <AlertDescription>
              Bạn đang xem trên quá nhiều thiết bị. Vui lòng đóng video trên thiết bị khác.
            </AlertDescription>
          </Alert>
          <Button onClick={() => refetch()} className="mt-4">
            Thử lại
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Có lỗi xảy ra. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  if (!streamData) return null;

  return (
    <div className="min-h-screen bg-black">
      <VideoPlayer
        src={streamData.streamUrl}
        resumeAt={streamData.resumeAt}
        watermark={streamData.watermark}
        onProgress={handleProgress}
        onEnded={() => {
          handleStreamEnd();
          // Auto-play next episode
          if (streamData.nextEpisode) {
            router.push(`/movies/${params.slug}/watch/${streamData.nextEpisode.episodeNum}`);
          }
        }}
      />

      <div className="container py-4">
        <h1 className="text-xl font-semibold mb-2">
          {streamData.episode.movie.title} - {streamData.episode.title}
        </h1>

        <EpisodeNav
          movieSlug={params.slug}
          currentEpisode={parseInt(params.episodeNum)}
          nextEpisode={streamData.nextEpisode}
        />
      </div>
    </div>
  );
}
```

---

### 4. Login Page (`/login`)

**File**: `app/(auth)/login/page.tsx`

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  rememberMe: z.boolean().optional()
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get('redirect') || '/';

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data.email, data.password, data.rememberMe);
      router.push(redirectTo);
    } catch (err: any) {
      const errorCode = err?.code;
      if (errorCode === 'AUTH_INVALID_CREDENTIALS') {
        setError('Email hoặc mật khẩu không đúng');
      } else if (errorCode === 'AUTH_ACCOUNT_DISABLED') {
        setError('Tài khoản đã bị vô hiệu hóa');
      } else if (errorCode === 'AUTH_RATE_LIMITED') {
        setError('Quá nhiều lần thử, vui lòng đợi 30 phút');
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="text-muted-foreground mt-2">
            Đăng nhập vào tài khoản MovieStream của bạn
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">
                    Ghi nhớ đăng nhập
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng nhập
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
```

---

### 5. Register Page (`/register`)

**File**: `app/(auth)/register/page.tsx`

```typescript
// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên tối đa 100 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/[a-zA-Z]/, 'Mật khẩu phải có ít nhất 1 chữ cái')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword']
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password
      });
      router.push('/');
    } catch (err: any) {
      const errorCode = err?.code;
      if (errorCode === 'AUTH_EMAIL_EXISTS') {
        setError('Email đã được sử dụng');
      } else if (errorCode === 'AUTH_PASSWORD_WEAK') {
        setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số');
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Đăng ký</h1>
          <p className="text-muted-foreground mt-2">
            Tạo tài khoản MovieStream mới
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hiển thị</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng ký
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
```

---

### 6. Subscription Plans Page (`/subscription/plans`)

**File**: `app/(protected)/subscription/plans/page.tsx`

```typescript
// app/(protected)/subscription/plans/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/lib/stores/auth-store';
import { PlanCard } from '@/components/subscription/plan-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { Plan } from '@/types/subscription';

export default function SubscriptionPlansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => apiClient.fetch<Plan[]>('/subscription/plans')
  });

  const purchaseMutation = useMutation({
    mutationFn: (planId: string) =>
      apiClient.fetch<{ paymentId: string; paymentUrl: string }>(
        '/subscription/purchase',
        {
          method: 'POST',
          body: JSON.stringify({ planId, paymentMethod: 'VNPAY' })
        }
      ),
    onSuccess: (data) => {
      // Redirect to VNPay
      window.location.href = data.paymentUrl;
    }
  });

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId);
    purchaseMutation.mutate(planId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Chọn gói Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Xem phim không giới hạn với các gói subscription của chúng tôi
        </p>
      </div>

      {purchaseMutation.isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans?.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            popular={plan.popular}
            isCurrentPlan={user?.subscription?.plan === plan.name}
            onSelect={() => handlePurchase(plan.id)}
            isLoading={purchaseMutation.isPending && selectedPlan === plan.id}
          />
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Thanh toán an toàn qua VNPay</p>
        <p>Bạn có thể hủy bất cứ lúc nào</p>
      </div>
    </div>
  );
}
```

---

### 7. Admin Dashboard (`/admin`)

**File**: `app/(admin)/admin/page.tsx`

```typescript
// app/(admin)/admin/page.tsx
import { Suspense } from 'react';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { UserChart } from '@/components/admin/user-chart';
import { TopMoviesTable } from '@/components/admin/top-movies-table';
import { apiClient } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/skeleton';

async function getDashboardData() {
  return apiClient.fetch('/admin/dashboard');
}

export default async function AdminDashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardStats
          title="Tổng Users"
          value={dashboard.overview.totalUsers}
          change={`+${dashboard.overview.newUsersToday} hôm nay`}
        />
        <DashboardStats
          title="Doanh thu tháng"
          value={formatCurrency(dashboard.revenue.thisMonth)}
          change={`${dashboard.revenue.growth > 0 ? '+' : ''}${dashboard.revenue.growth}%`}
        />
        <DashboardStats
          title="Subscribers"
          value={dashboard.overview.activeSubscribers}
          change={`${dashboard.overview.subscriberGrowth}% tăng trưởng`}
        />
        <DashboardStats
          title="Phim"
          value={dashboard.content.totalMovies}
          subtext={`${dashboard.content.publishedMovies} đã xuất bản`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Suspense fallback={<Skeleton className="h-[300px]" />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[300px]" />}>
          <UserChart />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TopMoviesTable movies={dashboard.engagement.topMovies} />
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}
```

---

## Component Specifications

### VideoPlayer Component

**File**: `components/video/video-player.tsx`

```typescript
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { VideoControls } from './video-controls';
import { VideoWatermark } from './video-watermark';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  resumeAt?: number;
  watermark: { text: string; position: string };
  onProgress: (seconds: number, duration: number) => void;
  onEnded: () => void;
}

export function VideoPlayer({
  src,
  resumeAt = 0,
  watermark,
  onProgress,
  onEnded
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState<number>(-1); // -1 = auto
  const [availableQualities, setAvailableQualities] = useState<number[]>([]);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        startLevel: -1, // Auto quality
        capLevelToPlayerSize: true
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setAvailableQualities(data.levels.map((l) => l.height));

        // Resume playback
        if (resumeAt > 0) {
          video.currentTime = resumeAt;
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setQuality(data.level);
      });

      hlsRef.current = hls;

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = src;
      if (resumeAt > 0) {
        video.currentTime = resumeAt;
      }
    }
  }, [src, resumeAt]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Update buffered
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  // Progress callback
  useEffect(() => {
    if (currentTime > 0 && duration > 0) {
      onProgress(Math.floor(currentTime), Math.floor(duration));
    }
  }, [currentTime, duration, onProgress]);

  // Control handlers
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
    }
  }, []);

  const handleVolumeChange = useCallback((value: number) => {
    const video = videoRef.current;
    if (video) {
      video.volume = value;
      setVolume(value);
      setIsMuted(value === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      container.requestFullscreen();
      setIsFullscreen(true);
    }
  }, []);

  const handleQualityChange = useCallback((level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setQuality(level);
    }
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackRate(speed);
    }
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeout);
      };
    }
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black aspect-video',
        isFullscreen && 'fixed inset-0 z-50'
      )}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onClick={togglePlay}
        playsInline
      />

      <VideoWatermark text={watermark.text} />

      <VideoControls
        show={showControls}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        buffered={buffered}
        volume={volume}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        quality={quality}
        availableQualities={availableQualities}
        playbackRate={playbackRate}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullscreen}
        onQualityChange={handleQualityChange}
        onSpeedChange={handleSpeedChange}
      />
    </div>
  );
}
```

### VideoWatermark Component

**File**: `components/video/video-watermark.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

interface VideoWatermarkProps {
  text: string;
}

export function VideoWatermark({ text }: VideoWatermarkProps) {
  const [position, setPosition] = useState({ x: 10, y: 10 });

  useEffect(() => {
    // Change position every 30 seconds
    const updatePosition = () => {
      setPosition({
        x: 10 + Math.random() * 70, // 10-80%
        y: 10 + Math.random() * 70  // 10-80%
      });
    };

    updatePosition();
    const interval = setInterval(updatePosition, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none select-none z-10 text-white/30 text-sm font-mono"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}
    >
      {text}
    </div>
  );
}
```

### MovieCard Component

**File**: `components/movie/movie-card.tsx`

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MovieSummary } from '@/types/movie';

interface MovieCardProps {
  movie: MovieSummary;
  showRating?: boolean;
  progress?: number; // 0-100 for continue watching
  className?: string;
}

export function MovieCard({
  movie,
  showRating = true,
  progress,
  className
}: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.slug}`}>
      <Card className={cn('group overflow-hidden', className)}>
        <div className="relative aspect-[2/3]">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

          {movie.isPremium && (
            <Badge className="absolute top-2 left-2 bg-yellow-500">
              Premium
            </Badge>
          )}

          {movie.tags?.some(t => t.name === 'Hot') && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              Hot
            </Badge>
          )}

          {typeof progress === 'number' && (
            <Progress
              value={progress}
              className="absolute bottom-0 left-0 right-0 h-1 rounded-none"
            />
          )}
        </div>

        <CardContent className="p-3">
          <h3 className="font-medium line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>{movie.year}</span>
            {showRating && movie.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {movie.rating.toFixed(1)}
              </span>
            )}
            {movie.totalEpisodes > 1 && (
              <span>{movie.currentEpisodes}/{movie.totalEpisodes} tập</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

### PlanCard Component

**File**: `components/subscription/plan-card.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/subscription';

interface PlanCardProps {
  plan: Plan;
  popular?: boolean;
  isCurrentPlan?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

export function PlanCard({
  plan,
  popular,
  isCurrentPlan,
  onSelect,
  isLoading
}: PlanCardProps) {
  return (
    <Card className={cn(
      'relative',
      popular && 'border-primary shadow-lg'
    )}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Phổ biến nhất
        </Badge>
      )}

      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.duration}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold mb-4">
          {plan.priceFormatted}
          <span className="text-sm font-normal text-muted-foreground">
            /{plan.durationDays > 30 ? 'năm' : 'tháng'}
          </span>
        </div>

        <ul className="space-y-2">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={popular ? 'default' : 'outline'}
          onClick={onSelect}
          disabled={isLoading || isCurrentPlan}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isCurrentPlan ? (
            'Gói hiện tại'
          ) : (
            'Chọn gói này'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## Middleware (Route Protection)

**File**: `middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/profile', '/history', '/favorites', '/subscription'];
const adminPaths = ['/admin'];
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookie or header
  const authStorage = request.cookies.get('auth-storage');
  let isAuthenticated = false;

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage.value);
      isAuthenticated = !!parsed.state?.accessToken;
    } catch {
      // Invalid cookie
    }
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.some(p => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to login
  if (protectedPaths.some(p => pathname.startsWith(p)) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes - basic check, full role verification in layout
  if (adminPaths.some(p => pathname.startsWith(p)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/history',
    '/favorites',
    '/subscription/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
};
```

---

## Providers Setup

**File**: `app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1
          }
        }
      })
  );

  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## Root Layout

**File**: `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'MovieStream - Xem phim trực tuyến',
  description: 'Xem phim HD chất lượng cao, cập nhật nhanh nhất'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

---

## Verification & Testing

### E2E Flow Tests

1. **User Flow**: Registration → Login → Browse → Subscribe → Watch Premium
2. **Admin Flow**: Login → Create Movie → Upload Video → Publish → View Dashboard

### Component Tests

- VideoPlayer handles HLS streams correctly
- Auth flow with token refresh works
- Payment redirect flow to VNPay works

### Manual Verification

- Test on mobile viewport (responsive)
- Test video playback on Safari (native HLS)
- Test concurrent stream limit (2 devices)
- Test watermark position changes

---

## Summary

| Category | Count |
|----------|-------|
| Pages | 18 |
| Components | ~40 |
| API Hooks | 20+ |
| TypeScript Types | 5 files |
| Stores (Zustand) | 3 |

---

*Document Version: 1.0*
*Created: January 2026*
