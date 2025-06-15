import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookAPI, createSearchDto, handleApiError } from '../lib/api';
import type {
  BookCreateDto,
  BookUpdateDto,
  BookSearchDto,
  PaginationDto,
} from '../types/api';
import { toast } from 'react-hot-toast';

// Query keys
export const bookQueryKeys = {
  all: ['books'] as const,
  lists: () => [...bookQueryKeys.all, 'list'] as const,
  list: (params: Partial<PaginationDto>) => [...bookQueryKeys.lists(), params] as const,
  details: () => [...bookQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookQueryKeys.details(), id] as const,
  search: (searchDto: BookSearchDto) => [...bookQueryKeys.all, 'search', searchDto] as const,
  count: () => [...bookQueryKeys.all, 'count'] as const,
};

// Get all books with pagination
export const useBooks = (params: Partial<PaginationDto> = {}) => {
  return useQuery({
    queryKey: bookQueryKeys.list(params),
    queryFn: () => BookAPI.getAllBooks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single book by ID
export const useBook = (id: string, enabled = true) => {
  return useQuery({
    queryKey: bookQueryKeys.detail(id),
    queryFn: () => BookAPI.getBookById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search books
export const useBookSearch = (searchDto: BookSearchDto, enabled = true) => {
  return useQuery({
    queryKey: bookQueryKeys.search(searchDto),
    queryFn: () => BookAPI.searchBooks(searchDto),
    enabled: enabled && (!!searchDto.filters.searchQuery || Object.keys(searchDto.filters).length > 0),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search by category (using the correct route: /search/by-category)
export const useBooksByCategory = (categories: string[], pagination: Partial<PaginationDto> = {}) => {
  return useQuery({
    queryKey: ['books', 'by-category', categories, pagination],
    queryFn: () => BookAPI.searchByCategory(categories, pagination),
    enabled: categories.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Search by language
export const useBooksByLanguage = (language: string, pagination: Partial<PaginationDto> = {}) => {
  return useQuery({
    queryKey: ['books', 'by-language', language, pagination],
    queryFn: () => BookAPI.searchByLanguage(language, pagination),
    enabled: !!language,
    staleTime: 5 * 60 * 1000,
  });
};

// Get total count
export const useBookCount = () => {
  return useQuery({
    queryKey: bookQueryKeys.count(),
    queryFn: () => BookAPI.getTotalCount(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Check if book exists
export const useBookExists = (id: string) => {
  return useQuery({
    queryKey: ['books', 'exists', id],
    queryFn: () => BookAPI.bookExists(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Mutations
export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookCreateDto) => BookAPI.createBook(data),
    onSuccess: (newBook) => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.count() });
      
      // Add the new book to cache
      queryClient.setQueryData(bookQueryKeys.detail(newBook.id), newBook);
      
      toast.success('Book created successfully!');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookUpdateDto }) =>
      BookAPI.updateBook(id, data),
    onSuccess: (updatedBook, { id }) => {
      // Update the book in cache
      queryClient.setQueryData(bookQueryKeys.detail(id), updatedBook);
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.lists() });
      
      toast.success('Book updated successfully!');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BookAPI.deleteBook(id),
    onSuccess: (_, id) => {
      // Remove book from cache
      queryClient.removeQueries({ queryKey: bookQueryKeys.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.count() });
      
      toast.success('Book deleted successfully!');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

// Custom hook for infinite scroll (using regular useQuery for now)
export const useInfiniteBooks = (filters: BookSearchDto['filters'] = {}) => {
  const searchDto = createSearchDto(filters, { page: 0, size: 20 });
  return useQuery({
    queryKey: ['books', 'infinite', filters],
    queryFn: () => BookAPI.searchBooks(searchDto),
    staleTime: 5 * 60 * 1000,
  });
};

// Helper hook for popular books (high rating + high download count)
export const usePopularBooks = (limit = 10) => {
  const searchDto = createSearchDto(
    { minRating: 4.0 },
    { page: 0, size: limit, sortBy: 'downloadCount', sortDirection: 'desc' }
  );

  return useQuery({
    queryKey: ['books', 'popular', limit],
    queryFn: () => BookAPI.searchBooks(searchDto),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Helper hook for recent books
export const useRecentBooks = (limit = 10) => {
  return useBooks({
    page: 0,
    size: limit,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });
};