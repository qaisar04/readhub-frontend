// API Types based on ReadHub backend documentation

export interface Author {
  name: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
}

export const BookStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  DELETED: "DELETED"
} as const;

export type BookStatus = typeof BookStatus[keyof typeof BookStatus];

export interface Book {
  id: string;
  title: string;
  description: string;
  authors: Author[];
  categories: string[];
  language: string;
  filePath?: string;
  tags: string[];
  coverUrl?: string;
  fileSize?: number;
  isbn?: string;
  publisher?: string;
  pageCount?: number;
  publicationDate?: string;
  userId?: string;
  requestId?: string;
  averageRating: number;
  reviewCount: number;
  downloadCount: number;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface BookCreateDto {
  title: string;
  description: string;
  authors: Author[];
  categories: string[];
  language: string;
  filePath?: string;
  tags: string[];
  coverUrl?: string;
  fileSize?: number;
  isbn?: string;
  publisher?: string;
  pageCount?: number;
  publicationDate?: string;
  userId?: string;
  requestId?: string;
}

export interface BookUpdateDto {
  title?: string;
  description?: string;
  averageRating?: number;
  reviewCount?: number;
  downloadCount?: number;
  status?: BookStatus;
}

export interface PaginationDto {
  page: number;
  size: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface FilterDto {
  searchQuery?: string;
  title?: string;
  authorName?: string;
  language?: string;
  publisher?: string;
  isbn?: string;
  status?: BookStatus;
  tags?: string[];
  categories?: string[];
  publicationDateFrom?: string;
  publicationDateTo?: string;
  minRating?: number;
  maxRating?: number;
  minPageCount?: number;
  maxPageCount?: number;
  uploadedBy?: string;
}

export interface BookSearchDto {
  pagination: PaginationDto;
  filters: FilterDto;
  includeDeleted?: boolean;
  includeAuthors?: boolean;
  includeMetrics?: boolean;
  userId?: string;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiError {
  statusCode: number;
  timestamp: string;
  message: string;
  description: string;
}

// UI-specific types
export interface BookCardData extends Book {
  isBookmarked?: boolean;
  readingProgress?: number;
  lastReadAt?: string;
}

export interface SearchFilters {
  query: string;
  categories: string[];
  languages: string[];
  status: BookStatus[];
  rating: [number, number];
  pageCount: [number, number];
  dateRange: [string, string];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  booksPerPage: number;
  defaultSortBy: string;
  defaultSortDirection: 'asc' | 'desc';
}