import api from "./axios";
import type {
  ApiResponse,
  User,
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
} from "../types";

export const loginApi = async (
  payload: LoginPayload
): Promise<ApiResponse<{ user: User; token: string }>> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const registerApi = async (
  payload: RegisterPayload
): Promise<ApiResponse<{ user: User; token: string }>> => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const changePasswordApi = async (
  payload: ChangePasswordPayload
): Promise<ApiResponse<null>> => {
  const res = await api.post("/auth/change-password", payload);
  return res.data;
};

export const getMeApi = async (): Promise<ApiResponse<User>> => {
  const res = await api.get("/auth/me");
  return res.data;
};