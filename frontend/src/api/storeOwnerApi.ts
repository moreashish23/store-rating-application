import api from "./axios";
import type{ ApiResponse, StoreOwnerDashboard } from "../types";

export const getStoreOwnerDashboardApi =
  async (): Promise<ApiResponse<StoreOwnerDashboard>> => {
    const res = await api.get("/store-owner/dashboard");
    return res.data;
  };