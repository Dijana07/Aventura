import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";

      return Promise.reject(new Error("Session expired"));
    }

    if (error.response?.status === 500) {
      return Promise.reject(
        new Error("Error with the server. Please try again later.")
      );
    }

    return Promise.reject(
      new Error(
        data?.message ||
        data?.errors?.request ||
        data?.title ||
        "Request failed"
      )
    );
  }
);

export const apiClient = async <T>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> => {
  const response = await api.request({
    url: endpoint,
    method: options.method,
    data: options.body,
    headers: options.headers,
  });

  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};