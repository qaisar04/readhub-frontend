import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Star, 
  Download, 
  Heart,
  MoreHorizontal,
  Calendar
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { BookCardData } from '../types/api';
import { format } from 'date-fns';
import clsx from 'clsx';

interface BookCardProps {
  book: BookCardData;
  onRead?: (book: BookCardData) => void;
  onBookmark?: (book: BookCardData) => void;
  onMoreOptions?: (book: BookCardData) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onRead,
  onBookmark,
  onMoreOptions,
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
    createdAt,
    readingProgress = 0,
    isBookmarked = false,
  } = book;

  const primaryAuthor = authors[0]?.name || 'Unknown Author';
  const publishDate = format(new Date(createdAt), 'MMM yyyy');

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
            <h3 className="font-semibold text-neutral-900 truncate">{title}</h3>
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
      <Card interactive hover className="overflow-hidden">
        <div className="relative">
          <div className="aspect-[3/2] bg-gradient-to-br from-primary-400 via-primary-500 to-accent-500">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="w-16 h-16 text-white opacity-80" />
              </div>
            )}
          </div>
          
          <div className="absolute top-4 right-4 flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.(book);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft"
            >
              <Heart
                className={clsx(
                  'w-4 h-4',
                  isBookmarked ? 'text-red-500 fill-current' : 'text-neutral-600'
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
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft"
            >
              <MoreHorizontal className="w-4 h-4 text-neutral-600" />
            </motion.button>
          </div>

          {readingProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <motion.div
                className="h-full bg-accent-400"
                initial={{ width: 0 }}
                animate={{ width: `${readingProgress * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
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
            {description}
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
    );
  }

  // Default variant
  return (
    <Card interactive hover className="overflow-hidden" onClick={() => onRead?.(book)}>
      <div className="relative">
        <div className="aspect-[2/3] bg-gradient-to-br from-primary-400 to-accent-500">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="w-12 h-12 text-white opacity-80" />
            </div>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.(book);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft"
          >
            <Heart
              className={clsx(
                'w-4 h-4',
                isBookmarked ? 'text-red-500 fill-current' : 'text-neutral-600'
              )}
            />
          </motion.button>
        </div>

        {readingProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <motion.div
              className="h-full bg-accent-400"
              initial={{ width: 0 }}
              animate={{ width: `${readingProgress * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-sm text-neutral-600 mb-2">{primaryAuthor}</p>
        
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
          {averageRating > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{averageRating.toFixed(1)}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{publishDate}</span>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-md"
              >
                {category}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-md">
                +{categories.length - 2}
              </span>
            )}
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onRead?.(book);
          }}
        >
          {readingProgress > 0 ? 'Continue' : 'Read'}
        </Button>
      </div>
    </Card>
  );
};