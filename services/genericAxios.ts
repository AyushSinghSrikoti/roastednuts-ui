import { AxiosRequestConfig } from "axios";
import { customAxios } from "@/lib/axios";
import { ApiResponse } from "@/types";

export const genericAxios = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ) =>
    customAxios.get<ApiResponse<T>>(url, config),

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    customAxios.post<ApiResponse<T>>(url, data, config),

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    customAxios.put<ApiResponse<T>>(url, data, config),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) =>
    customAxios.patch<ApiResponse<T>>(url, data, config),

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ) =>
    customAxios.delete<ApiResponse<T>>(url, config),
};