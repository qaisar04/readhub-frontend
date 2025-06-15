import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  Star, 
  Download, 
  Heart,
  Calendar,
  User,
  Tag,
  Globe,
  FileText,
  Hash,
  Building
} from 'lucide-react';
import { Button } from './ui/Button';
import { BookStatus } from './BookStatus';
import type { BookCardData } from '../types/api';
import { format } from 'date-fns';
import clsx from 'clsx';

interface BookDetailsModalProps {
  book: BookCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onRead?: (book: BookCardData) => void;
  onBookmark?: (book: BookCardData) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  isOpen,
  onClose,
  onRead,
  onBookmark,
}) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!book) return null;

  const {
    title,
    description,
    authors,
    categories,
    language,
    publisher,
    isbn,
    pageCount,
    publicationDate,
    averageRating,
    reviewCount,
    downloadCount,
    coverUrl,
    status,
    createdAt,
    readingProgress = 0,
    isBookmarked = false,
  } = book;

  const primaryAuthor = authors[0]?.name || 'Unknown Author';
  const publishDate = publicationDate 
    ? format(new Date(publicationDate), 'MMMM d, yyyy')
    : format(new Date(createdAt), 'MMMM d, yyyy');

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={onClose}
        >
          {/* Premium Liquid Glass Background */}
          <div className="min-h-screen px-4 text-center">
            {/* Background with subtle liquid glass effect */}
            <div className="fixed inset-0 liquid-glass-bg">
              {/* Minimal glass overlay for better visibility */}
              <div className="absolute inset-0 backdrop-blur-sm bg-black/5 backdrop-saturate-120" />
            </div>

            {/* Modal positioning */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 400,
                duration: 0.2
              }}
              className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative glass-modal rounded-3xl">
                {/* Close button */}
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Close button clicked'); // Debug log
                    onClose();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border border-white/40 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-neutral-700" />
                </motion.button>

                <div className="flex flex-col lg:flex-row overflow-hidden rounded-3xl">
                  {/* Left section - Book cover and quick actions */}
                  <div className="lg:w-1/3 p-8 bg-gradient-to-br from-neutral-50/50 to-white/70 backdrop-blur-sm relative overflow-hidden">
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary-500/10 to-accent-500/5"></div>
                    <div className="text-center relative z-10">
                      {/* Book cover */}
                      <motion.div 
                        className="relative mx-auto mb-6 w-48 h-72"
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {coverUrl ? (
                          <motion.img
                            src={coverUrl}
                            alt={title}
                            className="w-full h-full object-cover rounded-2xl shadow-xl"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          />
                        ) : (
                          <div className={clsx(
                            "w-full h-full rounded-2xl shadow-xl flex flex-col items-center justify-center text-white relative overflow-hidden",
                            categories.includes('Programming') || categories.includes('Java') 
                              ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
                              : categories.includes('Fiction') 
                              ? "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500"
                              : categories.includes('Science') 
                              ? "bg-gradient-to-br from-green-400 via-blue-500 to-indigo-600"
                              : "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600"
                          )}>
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                            <BookOpen className="w-20 h-20 opacity-90 drop-shadow-lg mb-4" />
                            <h4 className="text-lg font-bold text-center px-4 line-clamp-3 drop-shadow-lg">
                              {title}
                            </h4>
                          </div>
                        )}
                        
                        {/* Status badge */}
                        <div className="absolute top-3 left-3">
                          <BookStatus status={status} size="sm" />
                        </div>

                        {/* Reading progress */}
                        {readingProgress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 rounded-b-2xl overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-accent-400 to-accent-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${readingProgress * 100}%` }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                          </div>
                        )}
                      </motion.div>

                      {/* Quick stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {averageRating > 0 && (
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{averageRating.toFixed(1)}</span>
                            </div>
                            <div className="text-xs text-neutral-600">{reviewCount} reviews</div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Download className="w-4 h-4 text-neutral-600" />
                            <span className="font-semibold">{downloadCount}</span>
                          </div>
                          <div className="text-xs text-neutral-600">downloads</div>
                        </div>

                        {pageCount && (
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <FileText className="w-4 h-4 text-neutral-600" />
                              <span className="font-semibold">{pageCount}</span>
                            </div>
                            <div className="text-xs text-neutral-600">pages</div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-3 relative z-10">
                        <motion.div
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.1 }}
                        >
                          <Button
                            variant="primary"
                            fullWidth
                            className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 hover:from-primary-600 hover:via-primary-700 hover:to-accent-600 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                            onClick={() => onRead?.(book)}
                          >
                            {readingProgress > 0 ? `Continue Reading (${Math.round(readingProgress * 100)}%)` : 'Start Reading'}
                          </Button>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ y: -1, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.1 }}
                        >
                          <Button
                            variant={isBookmarked ? "accent" : "ghost"}
                            fullWidth
                            icon={<Heart className={clsx("w-4 h-4", isBookmarked && "fill-current")} />}
                            className={clsx(
                              "transition-all duration-300 backdrop-blur-sm",
                              isBookmarked 
                                ? "bg-red-50/80 text-red-600 border-red-200 hover:bg-red-100/90 shadow-md hover:shadow-lg" 
                                : "border-neutral-200/50 hover:border-red-300 hover:bg-red-50/80 hover:text-red-600 shadow-sm hover:shadow-md"
                            )}
                            onClick={() => onBookmark?.(book)}
                          >
                            {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Right section - Book details */}
                  <div className="lg:w-2/3 p-8 relative">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-[0.02] bg-gradient-to-br from-accent-500/20 to-primary-500/10"></div>
                    {/* Header */}
                    <motion.div 
                      className="mb-6 relative z-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <motion.h1 
                        className="text-3xl font-bold text-neutral-900 mb-2 leading-tight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                      >
                        {title}
                      </motion.h1>
                      <motion.p 
                        className="text-lg text-neutral-600 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        by {primaryAuthor}
                      </motion.p>
                      
                      {/* Categories */}
                      {categories.length > 0 && (
                        <motion.div 
                          className="flex flex-wrap gap-2 mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.3 }}
                        >
                          {categories.map((category, index) => (
                            <motion.span
                              key={category}
                              className="px-3 py-1 bg-primary-100/80 text-primary-700 text-sm font-medium rounded-full border border-primary-200/50 backdrop-blur-sm hover:bg-primary-200/80 transition-all duration-200 cursor-default"
                              initial={{ opacity: 0, scale: 0.8, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.05, duration: 0.2 }}
                              whileHover={{ scale: 1.05, y: -1 }}
                            >
                              {category}
                            </motion.span>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">Description</h3>
                      <p className="text-neutral-700 leading-relaxed">
                        {description || 'No description available for this book.'}
                      </p>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-neutral-900">Book Details</h3>
                        
                        {authors.length > 0 && (
                          <div className="flex items-start space-x-3">
                            <User className="w-5 h-5 text-neutral-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-neutral-900">Authors</div>
                              <div className="text-neutral-600">
                                {authors.map(author => author.name).join(', ')}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start space-x-3">
                          <Globe className="w-5 h-5 text-neutral-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-neutral-900">Language</div>
                            <div className="text-neutral-600">{language}</div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-neutral-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-neutral-900">Published</div>
                            <div className="text-neutral-600">{publishDate}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-neutral-900">Publication Info</h3>
                        
                        {publisher && (
                          <div className="flex items-start space-x-3">
                            <Building className="w-5 h-5 text-neutral-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-neutral-900">Publisher</div>
                              <div className="text-neutral-600">{publisher}</div>
                            </div>
                          </div>
                        )}

                        {isbn && (
                          <div className="flex items-start space-x-3">
                            <Hash className="w-5 h-5 text-neutral-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-neutral-900">ISBN</div>
                              <div className="text-neutral-600 font-mono">{isbn}</div>
                            </div>
                          </div>
                        )}

                        {categories.length > 0 && (
                          <div className="flex items-start space-x-3">
                            <Tag className="w-5 h-5 text-neutral-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-neutral-900">Categories</div>
                              <div className="text-neutral-600">{categories.join(', ')}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};