import api from "./axios";
import type{ ApiResponse, Store, QueryParams } from "../types";

export const getUserStoresApi = async (
  params: QueryParams
): Promise<ApiResponse<Store[]>> => {
  const res = await api.get("/user/stores", { params });
  return res.data;
};

export const submitRatingApi = async (payload: {
  storeId: string;
  value: number;
}): Promise<ApiResponse<unknown>> => {
  const res = await api.post("/user/ratings", payload);
  return res.data;
};

export const updateRatingApi = async (
  storeId: string,
  payload: { value: number }
): Promise<ApiResponse<unknown>> => {
  const res = await api.put(`/user/ratings/${storeId}`, payload);
  return res.data;
};