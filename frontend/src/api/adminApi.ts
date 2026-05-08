import api from "./axios";
import type{
  ApiResponse,
  User,
  Store,
  AdminStats,
  CreateUserPayload,
  CreateStorePayload,
  QueryParams,
} from "../types";

export const getAdminStatsApi = async (): Promise<ApiResponse<AdminStats>> => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export const createUserApi = async (
  payload: CreateUserPayload
): Promise<ApiResponse<User>> => {
  const res = await api.post("/admin/users", payload);
  return res.data;
};

export const createStoreApi = async (
  payload: CreateStorePayload
): Promise<ApiResponse<Store>> => {
  const res = await api.post("/admin/stores", payload);
  return res.data;
};

export const getAdminUsersApi = async (
  params: QueryParams
): Promise<ApiResponse<User[]>> => {
  const res = await api.get("/admin/users", { params });
  return res.data;
};

export const getAdminUserByIdApi = async (
  id: string
): Promise<ApiResponse<User>> => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const getAdminStoresApi = async (
  params: QueryParams
): Promise<ApiResponse<Store[]>> => {
  const res = await api.get("/admin/stores", { params });
  return res.data;
};