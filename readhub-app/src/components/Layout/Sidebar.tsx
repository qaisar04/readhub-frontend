import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home,
  Search,
  Bookmark,
  TrendingUp,
  Settings,
  Plus,
  Library,
  Star,
  Clock,
  Download
} from 'lucide-react';
import { Button } from '../ui/Button';
import clsx from 'clsx';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onAddBook?: () => void;
  className?: string;
}

const mainNavItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Search },
  { id: 'library', label: 'My Library', icon: Library },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

const quickAccess = [
  { id: 'recent', label: 'Recently Read', icon: Clock },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'favorites', label: 'Favorites', icon: Star },
];

const categories = [
  'Programming',
  'Fiction',
  'Science',
  'History',
  'Philosophy',
  'Art & Design',
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen = true,
  onClose,
  onAddBook,
  className,
}) => {
  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    onClose?.(); // Close mobile sidebar
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -320,
          opacity: isOpen ? 1 : 0.95
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={clsx(
          'fixed left-0 top-16 bottom-0 z-50 w-80 bg-white border-r border-neutral-150 shadow-soft overflow-y-auto custom-scrollbar lg:static lg:translate-x-0 lg:opacity-100 lg:shadow-none',
          className
        )}
      >
        <div className="p-6 space-y-8">
          {/* Create button */}
          <Button
            variant="primary"
            fullWidth
            icon={<Plus className="w-5 h-5" />}
            className="h-12 rounded-xl"
            onClick={onAddBook}
          >
            Add New Book
          </Button>

          {/* Main Navigation */}
          <nav className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-soft'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  )}
                >
                  <Icon 
                    className={clsx(
                      'w-5 h-5 flex-shrink-0',
                      isActive ? 'text-primary-600' : 'text-neutral-400'
                    )} 
                  />
                  <span className="font-medium">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Quick Access */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Quick Access
            </h3>
            {quickAccess.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-4 px-4 py-2.5 rounded-lg text-left transition-all duration-200',
                    isActive
                      ? 'bg-accent-50 text-accent-700'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  )}
                >
                  <Icon 
                    className={clsx(
                      'w-4 h-4 flex-shrink-0',
                      isActive ? 'text-accent-600' : 'text-neutral-400'
                    )} 
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(`category-${category.toLowerCase()}`)}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-all duration-200"
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Reading Stats */}
          <div className="glass-stats rounded-xl p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Reading Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Books Read</span>
                <span className="text-sm font-semibold text-primary-700">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Reading Streak</span>
                <span className="text-sm font-semibold text-accent-700">5 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Total Pages</span>
                <span className="text-sm font-semibold text-neutral-700">2,341</span>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-neutral-600">Monthly Goal</span>
                  <span className="text-xs text-neutral-600">12/15</span>
                </div>
                <div className="progress-bar h-2">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="pt-4 border-t border-neutral-150">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick('settings')}
              className="w-full flex items-center space-x-4 px-4 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-all duration-200"
            >
              <Settings className="w-5 h-5 text-neutral-400" />
              <span className="font-medium">Settings</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};