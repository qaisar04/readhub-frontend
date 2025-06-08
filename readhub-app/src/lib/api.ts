import axios, { type AxiosResponse } from 'axios';
import type {
  Book,
  BookCreateDto,
  BookUpdateDto,
  BookSearchDto,
  PaginatedResponse,
  PaginationDto,
  ApiError
} from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8084';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class BookAPI {
  // Core book operations (handled by coreRoutes - /books)
  static async createBook(data: BookCreateDto): Promise<Book> {
    const response: AxiosResponse<Book> = await apiClient.post('/books', data);
    return response.data;
  }

  static async getAllBooks(params: Partial<PaginationDto> = {}): Promise<PaginatedResponse<Book>> {
    const queryParams = {
      page: 0,
      size: 20,
      sortBy: 'createdAt',
      sortDirection: 'desc',
      ...params,
    };
    
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.get('/books', {
      params: queryParams,
    });
    return response.data;
  }

  static async getBookById(id: string): Promise<Book> {
    const response: AxiosResponse<Book> = await apiClient.get(`/books/${id}`);
    return response.data;
  }

  static async updateBook(id: string, data: BookUpdateDto): Promise<Book> {
    const response: AxiosResponse<Book> = await apiClient.put(`/books/${id}`, data);
    return response.data;
  }

  static async deleteBook(id: string): Promise<void> {
    await apiClient.delete(`/books/${id}`);
  }

  // Search operations (handled by searchRoutes - /search)
  static async searchBooks(searchDto: BookSearchDto): Promise<PaginatedResponse<Book>> {
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.post('/search', searchDto);
    return response.data;
  }

  static async searchByCategory(searchDto: BookSearchDto): Promise<PaginatedResponse<Book>> {
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.post('/search/by-category', searchDto);
    return response.data;
  }

  static async searchByLanguage(searchDto: BookSearchDto): Promise<PaginatedResponse<Book>> {
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.post('/search/by-language', searchDto);
    return response.data;
  }

  static async searchByUploader(searchDto: BookSearchDto): Promise<PaginatedResponse<Book>> {
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.post('/search/by-uploader', searchDto);
    return response.data;
  }

  // Meta operations (handled by metaRoutes)
  static async getTotalCount(): Promise<number> {
    const response: AxiosResponse<number> = await apiClient.get('/books/count');
    return response.data;
  }

  static async bookExists(id: string): Promise<boolean> {
    const response: AxiosResponse<boolean> = await apiClient.get(`/books/${id}/exists`);
    return response.data;
  }
}

// Helper function to create search dto with defaults
export const createSearchDto = (
  filters: Partial<BookSearchDto['filters']> = {},
  pagination: Partial<PaginationDto> = {}
): BookSearchDto => ({
  pagination: {
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    ...pagination,
  },
  filters: {
    ...filters,
  },
  includeDeleted: false,
  includeAuthors: true,
  includeMetrics: true,
  userId: getCurrentUserId(),
  requestId: generateRequestId(),
});

// Utility functions
const getCurrentUserId = (): string => {
  return localStorage.getItem('userId') || 'anonymous';
};

const generateRequestId = (): string => {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Error handler helper
export const handleApiError = (error: any): ApiError => {
  if (error.response?.data) {
    return error.response.data as ApiError;
  }
  
  return {
    statusCode: error.response?.status || 500,
    timestamp: new Date().toISOString(),
    message: error.message || 'An unexpected error occurred',
    description: 'Please try again later',
  };
};

export default apiClient;