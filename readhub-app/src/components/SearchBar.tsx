import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Hash, BookOpen, Globe } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useBookSearch, useBook, useBooksByCategory, useBooksByLanguage } from '../hooks/useBooks';
import { createSearchDto } from '../lib/api';
import type { BookCardData } from '../types/api';
import { BookCard } from './BookCard';
import clsx from 'clsx';

type SearchMode = 'text' | 'id' | 'category' | 'language';

interface SearchBarProps {
  onSearchResults?: (results: BookCardData[]) => void;
  placeholder?: string;
  showFilters?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const searchModes: { key: SearchMode; label: string; icon: React.ReactNode; placeholder: string }[] = [
  { key: 'text', label: 'Text Search', icon: <Search className="w-4 h-4" />, placeholder: 'Search books by title, description...' },
  { key: 'id', label: 'Book ID', icon: <Hash className="w-4 h-4" />, placeholder: 'Enter book ID (e.g., 64a1b2c3d4e5f6789abc123)' },
  { key: 'category', label: 'Category', icon: <BookOpen className="w-4 h-4" />, placeholder: 'Search by categories (e.g., Fiction, Drama)' },
  { key: 'language', label: 'Language', icon: <Globe className="w-4 h-4" />, placeholder: 'Search by language (e.g., en, ru, es)' },
];


export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchResults,
  placeholder,
  showFilters = true,
  autoFocus = false,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('text');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentMode = searchModes.find(mode => mode.key === searchMode)!;
  const currentPlaceholder = placeholder || currentMode.placeholder;

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  // Check if query looks like a book ID (24 character hex string)
  const isBookId = /^[0-9a-fA-F]{24}$/.test(debouncedQuery.trim());
  
  // Search by ID - direct book fetch
  const { data: bookById, isLoading: isLoadingById } = useBook(
    debouncedQuery.trim(),
    searchMode === 'id' && isBookId
  );
  
  // Text search
  const textSearchDto = createSearchDto(
    { searchQuery: debouncedQuery },
    { page: 0, size: 8 }
  );
  
  const { data: textSearchResults, isLoading: isLoadingText } = useBookSearch(
    textSearchDto,
    searchMode === 'text' && debouncedQuery.length >= 2
  );
  
  // Category search
  const categories = debouncedQuery.split(',').map(c => c.trim()).filter(Boolean);
  const { data: categoryResults, isLoading: isLoadingCategory } = useBooksByCategory(
    searchMode === 'category' ? categories : [],
    { page: 0, size: 8 }
  );
  
  // Language search  
  const { data: languageResults, isLoading: isLoadingLanguage } = useBooksByLanguage(
    searchMode === 'language' ? debouncedQuery.trim() : '',
    { page: 0, size: 8 }
  );
  
  // Determine current results and loading state
  const searchResults = useMemo(() => {
    if (searchMode === 'id' && bookById) {
      return { content: [bookById], totalElements: 1, totalPages: 1, size: 1, number: 0, first: true, last: true, numberOfElements: 1, empty: false };
    }
    if (searchMode === 'text') return textSearchResults;
    if (searchMode === 'category') return categoryResults;
    if (searchMode === 'language') return languageResults;
    return null;
  }, [searchMode, bookById, textSearchResults, categoryResults, languageResults]);
    
  const isLoading = searchMode === 'id' ? isLoadingById
    : searchMode === 'text' ? isLoadingText
    : searchMode === 'category' ? isLoadingCategory
    : searchMode === 'language' ? isLoadingLanguage
    : false;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsExpanded(false);
        setShowModeSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
    
    // Only expand when user has typed something
    setIsExpanded(value.length > 0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setShowResults(false);
    setIsExpanded(false);
    inputRef.current?.focus();
  }, []);
  
  const handleModeChange = useCallback((mode: SearchMode) => {
    setSearchMode(mode);
    setShowModeSelector(false);
    setQuery('');
    setDebouncedQuery('');
    setShowResults(false);
    inputRef.current?.focus();
  }, []);


  const handleBookSelect = useCallback((book: BookCardData) => {
    setShowResults(false);
    setIsExpanded(false);
    // Handle book selection (navigate to book page, etc.)
    console.log('Selected book:', book);
  }, []);

  useEffect(() => {
    if (searchResults?.content) {
      onSearchResults?.(searchResults.content as BookCardData[]);
    }
  }, [searchResults, onSearchResults]);

  return (
    <div ref={searchRef} className={clsx('relative w-full max-w-2xl mx-auto', className)}>
      <motion.div
        layout
        className="relative"
        initial={false}
        animate={{ 
          scale: isExpanded ? 1.02 : 1,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {currentMode.icon}
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              // Only expand on focus if there's already text
              if (query.length > 0) {
                setIsExpanded(true);
                setShowResults(true);
              }
            }}
            placeholder={currentPlaceholder}
            autoFocus={autoFocus}
            className={clsx(
              'pl-12 pr-20 py-2.5 text-sm rounded-xl transition-all duration-300',
              isExpanded 
                ? 'glass-search border-primary-300' 
                : 'bg-neutral-50 border-neutral-200 hover:bg-white hover:border-neutral-300'
            )}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClearSearch}
                className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </motion.button>
            )}
            
            {showFilters && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Filter className="w-4 h-4" />}
                  onClick={() => setShowModeSelector(!showModeSelector)}
                  className={clsx(
                    'px-3 py-2',
                    showModeSelector && 'text-primary-600 bg-primary-50'
                  )}
                >
                  {currentMode.label}
                </Button>
                
                <AnimatePresence>
                  {showModeSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50"
                    >
                      <div className="p-2">
                        {searchModes.map((mode) => (
                          <button
                            key={mode.key}
                            onClick={() => handleModeChange(mode.key)}
                            className={clsx(
                              'w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors text-left',
                              searchMode === mode.key
                                ? 'bg-primary-50 text-primary-700'
                                : 'hover:bg-neutral-50 text-neutral-700'
                            )}
                          >
                            {mode.icon}
                            <span>{mode.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showResults && query.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <Card padding="none" className="max-h-96 overflow-hidden">
                {/* Loading state */}
                {isLoading && (
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-150" />
                    </div>
                    <p className="text-sm text-neutral-500 mt-2">Searching...</p>
                  </div>
                )}

                {/* Search results */}
                {searchResults?.content && searchResults.content.length > 0 && (
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                      <p className="text-xs font-medium text-neutral-500 mb-3 px-4">
                        {searchMode === 'id' ? 'Book found' : `Found ${searchResults.totalElements} results`} • {currentMode.label}
                      </p>
                      <div className="space-y-1">
                        {searchResults.content.map((book) => (
                          <BookCard
                            key={book.id}
                            book={book as BookCardData}
                            variant="compact"
                            onRead={handleBookSelect}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* No results */}
                {((searchMode === 'text' && debouncedQuery.length >= 2) || 
                  (searchMode === 'id' && debouncedQuery.length > 0) ||
                  (searchMode === 'category' && debouncedQuery.length > 0) ||
                  (searchMode === 'language' && debouncedQuery.length >= 2)) &&
                 searchResults?.content?.length === 0 && !isLoading && (
                  <div className="p-6 text-center">
                    <div className="w-8 h-8 text-neutral-300 mx-auto mb-2">{currentMode.icon}</div>
                    <p className="text-sm text-neutral-500">
                      {searchMode === 'id' ? 'Book not found with ID' : 'No books found for'} "{debouncedQuery}"
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {searchMode === 'id' && 'Make sure the ID is correct (24 character hex string)'}
                      {searchMode === 'category' && 'Try separating multiple categories with commas'}
                      {searchMode === 'language' && 'Use language codes like "en", "ru", "es"'}
                    </p>
                  </div>
                )}

                {/* Show search instructions when query is too short */}
                {query.length > 0 && query.length < 2 && (
                  <div className="p-4 text-center">
                    <p className="text-sm text-neutral-500">
                      {searchMode === 'text' && 'Type at least 2 characters to search'}
                      {searchMode === 'id' && 'Enter a 24-character book ID'}
                      {searchMode === 'category' && 'Enter category names (e.g., Fiction, Programming)'}
                      {searchMode === 'language' && 'Enter language code (e.g., en, ru, es)'}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Search mode indicator */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-6 left-4 text-xs text-neutral-400"
          >
            Searching by {currentMode.label.toLowerCase()}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};