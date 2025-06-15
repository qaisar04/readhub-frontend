import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  User, 
  Menu,
  Bookmark,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchBar } from '../SearchBar';
import type { BookCardData } from '../../types/api';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  onAddBook?: () => void;
  onSearchResults?: (results: BookCardData[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMobileMenuToggle,
  onAddBook,
  onSearchResults,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  const userMenuItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Bookmark, label: 'My Library', href: '/library' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LogOut, label: 'Sign Out', action: 'logout' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-neutral-600" />
              </button>

              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-8 h-8 instagram-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="hidden sm:block text-xl font-bold gradient-text">
                  ReadHub
                </span>
              </motion.div>
            </div>

            {/* Center section - Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              {onSearchResults && (
                <SearchBar 
                  onSearchResults={onSearchResults}
                  placeholder="Search books..."
                />
              )}
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2">

              {/* Add book button */}
              <Button
                variant="accent"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                className="hidden sm:flex"
                onClick={onAddBook}
              >
                Add Book
              </Button>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                  <Bell className="w-5 h-5 text-neutral-600" />
                  {notifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {notifications > 9 ? '9+' : notifications}
                    </motion.span>
                  )}
                </button>
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JD</span>
                  </div>
                </button>

                {/* User dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 glass-dropdown rounded-xl py-2"
                  >
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-semibold text-neutral-900">John Doe</p>
                      <p className="text-sm text-neutral-500">john@example.com</p>
                    </div>
                    
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
};