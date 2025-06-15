import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, BookOpen, User, Tag, Globe, Calendar } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { useCreateBook } from '../hooks/useBooks';
import type { BookCreateDto, Author } from '../types/api';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<Partial<BookCreateDto>>({
    title: '',
    description: '',
    authors: [{ name: '', biography: '' }],
    categories: [],
    language: 'en',
    tags: [],
    coverUrl: '',
    isbn: '',
    publisher: '',
    pageCount: 0,
    publicationDate: '',
  });
  
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const createBookMutation = useCreateBook();

  const handleInputChange = (field: keyof BookCreateDto, value: string | number | Author[] | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthorChange = (index: number, field: keyof Author, value: string) => {
    const updatedAuthors = [...(formData.authors || [])];
    updatedAuthors[index] = { ...updatedAuthors[index], [field]: value };
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...(prev.authors || []), { name: '', biography: '' }]
    }));
  };

  const removeAuthor = (index: number) => {
    const updatedAuthors = formData.authors?.filter((_, i) => i !== index) || [];
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories?.includes(categoryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...(prev.categories || []), categoryInput.trim()]
      }));
      setCategoryInput('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories?.filter(c => c !== category) || []
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.authors?.[0]?.name) {
      return;
    }

    try {
      await createBookMutation.mutateAsync(formData as BookCreateDto);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        authors: [{ name: '', biography: '' }],
        categories: [],
        language: 'en',
        tags: [],
        coverUrl: '',
        isbn: '',
        publisher: '',
        pageCount: 0,
        publicationDate: '',
      });
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-150">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">Add New Book</h2>
                    <p className="text-sm text-neutral-600">Fill in the book details below</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Title *"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter book title"
                      required
                    />
                    
                    <Input
                      label="ISBN"
                      value={formData.isbn || ''}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                      placeholder="978-0-123456-78-9"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Publisher"
                      value={formData.publisher || ''}
                      onChange={(e) => handleInputChange('publisher', e.target.value)}
                      placeholder="Publisher name"
                    />
                    
                    <Input
                      label="Page Count"
                      type="number"
                      value={formData.pageCount || ''}
                      onChange={(e) => handleInputChange('pageCount', parseInt(e.target.value) || 0)}
                      placeholder="Number of pages"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Language"
                      value={formData.language || ''}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      placeholder="en, es, fr, etc."
                      icon={<Globe className="w-4 h-4" />}
                    />
                    
                    <Input
                      label="Publication Date"
                      type="date"
                      value={formData.publicationDate || ''}
                      onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Book description or summary"
                      rows={4}
                      className="input-field resize-none"
                    />
                  </div>

                  <Input
                    label="Cover Image URL"
                    value={formData.coverUrl || ''}
                    onChange={(e) => handleInputChange('coverUrl', e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    icon={<Upload className="w-4 h-4" />}
                  />

                  {/* Authors */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-neutral-700">
                        Authors *
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addAuthor}
                        icon={<User className="w-4 h-4" />}
                      >
                        Add Author
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.authors?.map((author, index) => (
                        <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-neutral-900">Author {index + 1}</h4>
                            {formData.authors!.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeAuthor(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Name"
                              value={author.name}
                              onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
                              placeholder="Author name"
                              required={index === 0}
                            />
                            
                            <Input
                              label="Biography"
                              value={author.biography || ''}
                              onChange={(e) => handleAuthorChange(index, 'biography', e.target.value)}
                              placeholder="Short biography"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Categories
                    </label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        placeholder="Add category"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addCategory}
                        icon={<Tag className="w-4 h-4" />}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.categories?.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="hover:text-primary-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addTag}
                        icon={<Tag className="w-4 h-4" />}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-accent-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-150">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={createBookMutation.isPending}
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Add Book
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};