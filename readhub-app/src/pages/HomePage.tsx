import React, { useState } from 'react';
import { BookCard } from '../components/BookCard';
import { BookDetailsModal } from '../components/BookDetailsModal';
import { Button } from '../components/ui/Button';
import { useBooks, useBookCount } from '../hooks/useBooks';
import { RefreshCw, AlertCircle } from 'lucide-react';
import type { BookCardData } from '../types/api';

interface HomePageProps {
  searchResults?: BookCardData[] | null;
  onClearSearch?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  searchResults: externalSearchResults,
  onClearSearch 
}) => {
  // Use external search results from header if available, otherwise use local state
  const searchResults = externalSearchResults;
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedBook, setSelectedBook] = useState<BookCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 18; // Show more books per page
  
  const { data: booksData, isLoading, error, refetch } = useBooks({ 
    page: currentPage, 
    size: pageSize,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });
  const { data: totalBooks } = useBookCount();


  const handleRetry = () => {
    refetch();
  };

  const handleNextPage = () => {
    if (booksData && currentPage < booksData.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewDetails = (book: BookCardData) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleBookmark = (book: BookCardData) => {
    console.log('Bookmarked:', book.title);
    // TODO: Implement bookmark functionality
  };

  const displayBooks = searchResults || booksData?.content || [];
  const isSearching = searchResults !== null;
  const hasNextPage = booksData && currentPage < booksData.totalPages - 1;
  const hasPrevPage = currentPage > 0;

  if (isLoading && !isSearching) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error && !isSearching) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral-900 mb-8">
            Welcome to ReadHub 📚
          </h1>
          
          
          <div className="bg-white rounded-xl p-8 shadow-card text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Cannot Connect to Backend</h3>
            <p className="text-neutral-600 mb-4">Failed to load books from the server</p>
            <p className="text-sm text-neutral-500 mb-6">
              Make sure the backend is running on <code className="bg-neutral-100 px-2 py-1 rounded text-xs">http://127.0.0.1:8084</code>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={handleRetry}
              >
                Retry Connection
              </Button>
              <p className="text-sm text-neutral-400 self-center">
                You can still use the search functionality above
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          Welcome to ReadHub 📚
        </h1>
        
        
        {/* Statistics Dashboard */}
        <div className="bg-white rounded-xl p-8 shadow-card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Reading Dashboard</h2>
          <p className="text-neutral-600 mb-6">
            Discover, read, and track your favorite books in a beautiful, modern interface.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary-600">{totalBooks || 0}</div>
              <div className="text-sm text-neutral-600">Total Books</div>
            </div>
            <div className="bg-accent-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-accent-600">{displayBooks.length || 0}</div>
              <div className="text-sm text-neutral-600">{isSearching ? 'Search Results' : 'Recent Books'}</div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{booksData?.totalPages || 0}</div>
              <div className="text-sm text-neutral-600">Total Pages</div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="bg-white rounded-xl shadow-card">
          {/* Header */}
          <div className="p-8 pb-4 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-neutral-900">
                  {isSearching ? 'Search Results' : 'Available Books'}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {isSearching 
                    ? `${displayBooks.length} books found` 
                    : booksData 
                      ? `Showing ${booksData.numberOfElements} of ${booksData.totalElements} books (Page ${currentPage + 1} of ${booksData.totalPages})`
                      : 'Loading books from server...'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {isSearching && (
                  <button
                    onClick={onClearSearch}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear Search
                  </button>
                )}
                {!isSearching && booksData && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={handleRetry}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {displayBooks.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {displayBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book as BookCardData}
                      variant="default"
                      onRead={(book) => console.log('Reading book:', book.title)}
                      onBookmark={handleBookmark}
                      onMoreOptions={(book) => console.log('More options:', book.title)}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
                
                {/* Pagination - only show for non-search results */}
                {!isSearching && booksData && booksData.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                    <div className="text-sm text-neutral-500">
                      Page {currentPage + 1} of {booksData.totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={!hasPrevPage || isLoading}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!hasNextPage || isLoading}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-neutral-500 mb-2">
                  {isSearching ? 'No books found for your search' : 'No books available'}
                </p>
                <p className="text-sm text-neutral-400">
                  {isSearching 
                    ? 'Try a different search term or change search mode' 
                    : 'The library is empty. Add some books to get started!'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRead={(book) => {
          console.log('Reading book:', book.title);
          handleCloseModal();
        }}
        onBookmark={handleBookmark}
      />
    </div>
  );
};