import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, TrendingUp } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useBookSearch } from '../hooks/useBooks';
import { createSearchDto } from '../lib/api';
import type { BookCardData } from '../types/api';
import { BookCard } from './BookCard';
import clsx from 'clsx';

interface SearchBarProps {
  onSearchResults?: (results: BookCardData[]) => void;
  placeholder?: string;
  showFilters?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const trendingSearches = [
  'JavaScript Programming',
  'React Development',
  'Machine Learning',
  'Python Basics',
  'Web Design',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchResults,
  placeholder = 'Search books, authors, categories...',
  showFilters = true,
  autoFocus = false,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedFilters] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  // Search API call
  const searchDto = createSearchDto(
    { searchQuery: debouncedQuery },
    { page: 0, size: 8 }
  );
  
  const { data: searchResults, isLoading } = useBookSearch(
    searchDto,
    debouncedQuery.length >= 2
  );

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
    
    if (value.length >= 2) {
      setIsExpanded(true);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setShowResults(false);
    setIsExpanded(false);
    inputRef.current?.focus();
  }, []);

  const handleTrendingClick = useCallback((trending: string) => {
    setQuery(trending);
    setDebouncedQuery(trending);
    setShowResults(true);
    setIsExpanded(true);
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
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={clsx(
              'pl-12 pr-20 py-4 text-base rounded-2xl border-2 transition-all duration-300',
              isExpanded
                ? 'border-primary-300 shadow-floating bg-white'
                : 'border-neutral-200 bg-neutral-50 hover:bg-white hover:border-neutral-300'
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
              <Button
                variant="ghost"
                size="sm"
                icon={<Filter className="w-4 h-4" />}
                className={clsx(
                  'px-3 py-2',
                  selectedFilters.length > 0 && 'text-primary-600 bg-primary-50'
                )}
              >
                {selectedFilters.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                    {selectedFilters.length}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {(showResults || (isExpanded && !query)) && (
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
                        Found {searchResults.totalElements} results
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
                {debouncedQuery.length >= 2 && searchResults?.content?.length === 0 && !isLoading && (
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">No books found for "{debouncedQuery}"</p>
                  </div>
                )}

                {/* Trending searches */}
                {!query && (
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-600">Trending Searches</span>
                    </div>
                    <div className="space-y-1">
                      {trendingSearches.map((trending, index) => (
                        <motion.button
                          key={trending}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleTrendingClick(trending)}
                          className="block w-full text-left px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          {trending}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};