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
  // Core book operations (coreRoutes: /books paths)
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
    
    // Backend returns a simple array, not a paginated response
    const response: AxiosResponse<Book[]> = await apiClient.get('/books', {
      params: queryParams,
    });
    
    // Transform the array response into a paginated format for frontend compatibility
    const books = response.data || [];
    const page = queryParams.page;
    const size = queryParams.size;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedBooks = books.slice(startIndex, endIndex);
    
    return {
      content: paginatedBooks,
      totalPages: Math.ceil(books.length / size),
      totalElements: books.length,
      size: size,
      number: page,
      first: page === 0,
      last: endIndex >= books.length,
      numberOfElements: paginatedBooks.length,
      empty: books.length === 0,
    };
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

  // Search operations - Updated to match backend API spec
  static async searchBooks(searchDto: BookSearchDto): Promise<PaginatedResponse<Book>> {
    const { pagination, filters } = searchDto;
    
    // Use POST with request body as per backend spec
    const requestBody = {
      pagination,
      filters: {
        query: filters.searchQuery || ''
      },
      includeDeleted: searchDto.includeDeleted || false,
      includeAuthors: searchDto.includeAuthors || true,
      includeMetrics: searchDto.includeMetrics || true
    };
    
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.post('/search', requestBody);
    return response.data;
  }

  static async searchByCategory(categories: string[], pagination: Partial<PaginationDto> = {}): Promise<PaginatedResponse<Book>> {
    const queryParams = {
      categories: categories.join(','),
      page: pagination.page || 0,
      size: pagination.size || 20,
      sortBy: pagination.sortBy || 'createdAt',
      sortDirection: pagination.sortDirection || 'desc',
    };
    
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.post('/search/by-category', {}, {
      params: queryParams,
    });
    return response.data;
  }

  static async searchByLanguage(language: string, pagination: Partial<PaginationDto> = {}): Promise<PaginatedResponse<Book>> {
    const queryParams = {
      language,
      page: pagination.page || 0,
      size: pagination.size || 20,
      sortBy: pagination.sortBy || 'createdAt',
      sortDirection: pagination.sortDirection || 'desc',
    };
    
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.post('/search/by-language', {}, {
      params: queryParams,
    });
    return response.data;
  }

  static async searchByUploader(uploadedBy: string, pagination: Partial<PaginationDto> = {}): Promise<PaginatedResponse<Book>> {
    const queryParams = {
      uploadedBy,
      page: pagination.page || 0,
      size: pagination.size || 20,
      sortBy: pagination.sortBy || 'createdAt',
      sortDirection: pagination.sortDirection || 'desc',
    };
    
    const response: AxiosResponse<PaginatedResponse<Book>> = await apiClient.post('/search/by-uploader', {}, {
      params: queryParams,
    });
    return response.data;
  }

  // Meta operations (handled by metaRoutes)
  static async getTotalCount(): Promise<number> {
    try {
      const response: AxiosResponse<number> = await apiClient.get('/books/count');
      return response.data;
    } catch (error) {
      // If count endpoint doesn't exist, get count from books array
      const booksResponse: AxiosResponse<Book[]> = await apiClient.get('/books');
      return booksResponse.data?.length || 0;
    }
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
export const handleApiError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: ApiError; status?: number } };
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
    
    return {
      statusCode: axiosError.response?.status || 500,
      timestamp: new Date().toISOString(),
      message: 'message' in error && typeof error.message === 'string' ? error.message : 'An unexpected error occurred',
      description: 'Please try again later',
    };
  }
  
  return {
    statusCode: 500,
    timestamp: new Date().toISOString(),
    message: 'An unexpected error occurred',
    description: 'Please try again later',
  };
};

export default apiClient;