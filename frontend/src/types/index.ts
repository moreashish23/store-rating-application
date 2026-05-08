export type Role = "ADMIN" | "USER" | "STORE_OWNER";

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt?: string;
  store?: {
    id: string;
    name: string;
    ratings?: { value: number }[];
  } | null;
  storeRating?: number | null;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId?: string;
  owner?: Partial<User>;
  averageRating?: number | null;
  totalRatings?: number;
  userRating?: number | null;
  ratings?: { value: number; userId: string }[];
  createdAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface StoreOwnerDashboard {
  store: Store;
  averageRating: number | null;
  totalRatings: number;
  raters: {
    userId: string;
    name: string;
    email: string;
    rating: number;
    ratedAt: string;
  }[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: Role;
}

export interface CreateStorePayload {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}