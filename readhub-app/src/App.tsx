import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { AddBookModal } from './components/AddBookModal';
import type { BookCardData } from './types/api';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors except 408, 429
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
            if (axiosError.response.status === 408 || axiosError.response.status === 429) {
              return failureCount < 2;
            }
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<BookCardData[] | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            searchResults={searchResults}
            onClearSearch={() => setSearchResults(null)}
          />
        );
      case 'explore':
        return (
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Explore Books</h2>
              <p className="text-neutral-600">Discover new books and authors</p>
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">My Library</h2>
              <p className="text-neutral-600">Your personal book collection</p>
            </div>
          </div>
        );
      case 'bookmarks':
        return (
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Bookmarks</h2>
              <p className="text-neutral-600">Books you've saved for later</p>
            </div>
          </div>
        );
      case 'trending':
        return (
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Trending</h2>
              <p className="text-neutral-600">Popular books right now</p>
            </div>
          </div>
        );
      default:
        return (
          <HomePage 
            searchResults={searchResults}
            onClearSearch={() => setSearchResults(null)}
          />
        );
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleOpenAddBookModal = () => {
    setIsAddBookModalOpen(true);
  };

  const handleCloseAddBookModal = () => {
    setIsAddBookModalOpen(false);
  };

  const handleSearchResults = (results: BookCardData[]) => {
    setSearchResults(results);
    // Switch to home tab if search is performed from another tab
    if (activeTab !== 'home') {
      setActiveTab('home');
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <Header 
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
          onAddBook={handleOpenAddBookModal}
          onSearchResults={handleSearchResults}
        />
        
        {/* Main Layout */}
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onAddBook={handleOpenAddBookModal}
              className="sticky top-16"
            />
          </div>
          
          {/* Mobile Sidebar */}
          <Sidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOpen={isMobileMenuOpen}
            onClose={handleSidebarClose}
            onAddBook={handleOpenAddBookModal}
            className="lg:hidden"
          />
          
          {/* Main Content */}
          <main className="flex-1 min-h-[calc(100vh-4rem)]">
            {renderContent()}
          </main>
        </div>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#171717',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        
        {/* Add Book Modal */}
        <AddBookModal
          isOpen={isAddBookModalOpen}
          onClose={handleCloseAddBookModal}
        />
      </div>
      
      {/* React Query Devtools */}
      <ReactQueryDevtools 
        initialIsOpen={false}
      />
    </QueryClientProvider>
  );
}

export default App;