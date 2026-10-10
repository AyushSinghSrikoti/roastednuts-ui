import axios, { type InternalAxiosRequestConfig } from "axios";

import type { ApiResponse } from "@/types";
import type { RefreshResponse } from "@/types/auth";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
let refreshRequest: Promise<RefreshResponse> | null = null;

export const customAxios = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

customAxios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

customAxios.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || typeof window === "undefined") {
      return Promise.reject(error);
    }

    const request = error.config as RetryableRequestConfig | undefined;
    const refreshToken = window.localStorage.getItem("refreshToken");

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      request.url?.includes("/auth/refresh") ||
      !refreshToken
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      refreshRequest ??= axios
        .post<ApiResponse<RefreshResponse>>(`${apiBaseUrl}/auth/refresh`, {
          refreshToken,
        })
        .then((response) => response.data.data)
        .finally(() => {
          refreshRequest = null;
        });

      const tokens = await refreshRequest;
      window.localStorage.setItem("token", tokens.token);
      window.localStorage.setItem("refreshToken", tokens.refreshToken);
      request.headers.Authorization = `Bearer ${tokens.token}`;

      return customAxios(request);
    } catch (refreshError) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");
      return Promise.reject(refreshError);
    }
  },
);
