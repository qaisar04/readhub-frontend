import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Star, 
  Download, 
  Heart,
  MoreHorizontal,
  Info
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BookStatus } from './BookStatus';
import type { BookCardData } from '../types/api';
import clsx from 'clsx';

interface BookCardProps {
  book: BookCardData;
  onRead?: (book: BookCardData) => void;
  onBookmark?: (book: BookCardData) => void;
  onMoreOptions?: (book: BookCardData) => void;
  onViewDetails?: (book: BookCardData) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onRead,
  onBookmark,
  onMoreOptions,
  onViewDetails,
  variant = 'default',
}) => {
  const {
    title,
    description,
    authors,
    categories,
    averageRating,
    downloadCount,
    pageCount,
    coverUrl,
    status,
    readingProgress = 0,
    isBookmarked = false,
  } = book;

  const primaryAuthor = authors[0]?.name || 'Unknown Author';

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="card-interactive p-4"
        onClick={() => onRead?.(book)}
      >
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BookOpen className="w-6 h-6 text-white" />
              )}
            </div>
            {readingProgress > 0 && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-neutral-900 truncate">{title}</h3>
              <BookStatus status={status} size="sm" showLabel={false} />
            </div>
            <p className="text-sm text-neutral-600 truncate">{primaryAuthor}</p>
            <div className="flex items-center space-x-3 mt-1">
              {averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-neutral-500">{averageRating.toFixed(1)}</span>
                </div>
              )}
              {pageCount && (
                <span className="text-xs text-neutral-500">{pageCount}p</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group cursor-pointer"
        onClick={() => onRead?.(book)}
      >
        <Card interactive className="overflow-hidden bg-gradient-to-br from-white to-neutral-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="relative">
            {/* Enhanced book cover with 3D effect */}
            <div className="aspect-[4/3] relative overflow-hidden">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="relative w-full h-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                  <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"white\" fill-opacity=\"0.1\"><circle cx=\"12\" cy=\"12\" r=\"2\"/></g></g></svg>')"}}></div>
                  
                  {/* Book icon with glow effect */}
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <div className="relative">
                      <BookOpen className="w-20 h-20 opacity-90 drop-shadow-lg" />
                      <div className="absolute inset-0 bg-white/20 blur-xl rounded-full transform scale-150"></div>
                    </div>
                    <div className="mt-4 text-center px-4">
                      <h4 className="text-lg font-bold mb-1 line-clamp-2">{title}</h4>
                      <p className="text-sm opacity-80">{primaryAuthor}</p>
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  {categories.length > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30">
                        {categories[0]}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Gradient overlay for better text readability */}
              {!coverUrl && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              )}
            </div>
            
            {/* Floating action buttons */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark?.(book);
                }}
                className="p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl border border-white/20"
              >
                <Heart
                  className={clsx(
                    'w-4 h-4 transition-colors',
                    isBookmarked ? 'text-red-500 fill-current' : 'text-neutral-600 hover:text-red-400'
                  )}
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreOptions?.(book);
                }}
                className="p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl border border-white/20"
              >
                <MoreHorizontal className="w-4 h-4 text-neutral-600 hover:text-neutral-800" />
              </motion.button>
            </div>

            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <BookStatus status={status} size="sm" showLabel={false} />
            </div>

            {/* Reading progress */}
            {readingProgress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-400 to-accent-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${readingProgress * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1 line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-neutral-600">{primaryAuthor}</p>
            </div>
          </div>

          <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
            {description || 'No description available.'}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-xs text-neutral-500">
              {averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{averageRating.toFixed(1)}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{downloadCount.toLocaleString()}</span>
              </div>
              
              {pageCount && (
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{pageCount}p</span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={() => onRead?.(book)}
          >
            {readingProgress > 0 ? `Continue Reading (${Math.round(readingProgress * 100)}%)` : 'Start Reading'}
          </Button>
        </div>
        </Card>
      </motion.div>
    );
  }

  // Default variant - Enhanced design
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={() => onRead?.(book)}
    >
      <Card interactive className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <div className="aspect-[2/3] relative overflow-hidden">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className={clsx(
                "w-full h-full relative",
                categories.includes('Programming') || categories.includes('Java') 
                  ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
                  : categories.includes('Fiction') 
                  ? "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500"
                  : categories.includes('Science') 
                  ? "bg-gradient-to-br from-green-400 via-blue-500 to-indigo-600"
                  : "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <BookOpen className="w-16 h-16 opacity-90 drop-shadow-lg mb-3" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-sm font-bold text-white line-clamp-2 drop-shadow-lg">
                      {title}
                    </h4>
                  </div>
                </div>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              <BookStatus status={status} size="sm" showLabel={false} />
              {categories.length > 0 && (
                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs font-medium rounded-md shadow-sm">
                  {categories[0]}
                </span>
              )}
            </div>

            {/* Heart button */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark?.(book);
                }}
                className="p-2 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl border border-white/20"
              >
                <Heart
                  className={clsx(
                    'w-3.5 h-3.5 transition-colors',
                    isBookmarked ? 'text-red-500 fill-current' : 'text-neutral-600 hover:text-red-400'
                  )}
                />
              </motion.button>
            </div>

            {/* Progress bar */}
            {readingProgress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-400 to-accent-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${readingProgress * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3">
            <h3 className="font-semibold text-neutral-900 text-base line-clamp-2 leading-tight mb-1">
              {title}
            </h3>
            <p className="text-sm text-neutral-600 truncate">{primaryAuthor}</p>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-neutral-600">{averageRating.toFixed(1)}</span>
                </div>
              )}
              {pageCount && (
                <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">
                  {pageCount}p
                </span>
              )}
            </div>
            
            {downloadCount > 0 && (
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3 text-neutral-400" />
                <span className="text-xs text-neutral-500">{downloadCount}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onRead?.(book);
              }}
            >
              {readingProgress > 0 ? 'Continue Reading' : 'Start Reading'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-3 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(book);
              }}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};