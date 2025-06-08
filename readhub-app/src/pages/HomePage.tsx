import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          Welcome to ReadHub 📚
        </h1>
        
        <div className="bg-white rounded-xl p-8 shadow-card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Reading Dashboard</h2>
          <p className="text-neutral-600 mb-6">
            Discover, read, and track your favorite books in a beautiful, modern interface.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary-600">12</div>
              <div className="text-sm text-neutral-600">Books Read</div>
            </div>
            <div className="bg-accent-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-accent-600">24h</div>
              <div className="text-sm text-neutral-600">Reading Time</div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">7</div>
              <div className="text-sm text-neutral-600">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-card">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg"></div>
              <div>
                <div className="font-semibold">JavaScript: The Good Parts</div>
                <div className="text-sm text-neutral-600">by Douglas Crockford</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-16 bg-gradient-to-br from-accent-400 to-primary-500 rounded-lg"></div>
              <div>
                <div className="font-semibold">Clean Code</div>
                <div className="text-sm text-neutral-600">by Robert C. Martin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};