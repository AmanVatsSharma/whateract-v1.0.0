import axios, { AxiosError, AxiosInstance } from "axios";
import { createLogger } from "@/lib/logger";

export interface ApiClientOptions {
  baseURL?: string;
  headers?: Record<string, string>;
}

export class ApiClient {
  private axios: AxiosInstance;
  private logger = createLogger("api");

  constructor(options: ApiClientOptions = {}) {
    const baseURL =
      options.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

    this.axios = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    this.axios.interceptors.request.use((config) => {
      this.logger.debug("→", config.method?.toUpperCase(), config.url, config);
      return config;
    });

    this.axios.interceptors.response.use(
      (response) => {
        this.logger.debug("←", response.status, response.config.url, response);
        return response;
      },
      (error: AxiosError) => {
        this.logger.error("✖", error.message, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.axios;
  }
}

export const apiClient = new ApiClient({
}).instance;
