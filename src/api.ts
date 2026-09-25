import axios, { type AxiosResponse, type AxiosRequestConfig } from "axios";

import { API_URL } from "./constants";

const apiClient = axios.create({
  baseURL: API_URL,
});

export async function del<T = void>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.delete<T>(url, config);
  return response.data;
}

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.get<T>(url, config);
  return response.data;
}

export async function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.post<T>(url, body, config);
  return response.data;
}
