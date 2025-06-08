# ReadHub Frontend

A Duolingo-style reading application built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Duolingo-inspired UI** - Clean, modern interface with vibrant colors and engaging interactions
- 📚 **Article Management** - Browse, search, and filter articles by difficulty level
- 📊 **Progress Tracking** - Track reading progress, streaks, and daily goals
- 🏆 **Gamification** - XP system, achievements, and progress indicators
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎯 **Daily Challenges** - Maintain reading streaks and complete daily goals

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Heroicons
- **State Management**: React Hooks
- **Backend Integration**: RESTful API services

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://127.0.0.1:8084` (or configure custom URL)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/qaisar04/readhub-frontend.git
cd readhub-frontend/readhub-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env to set your API base URL if different from default
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── ProgressBar.tsx # Progress tracking component
│   ├── ArticleCard.tsx # Article display component
│   ├── Header.tsx      # Main navigation header
│   └── Sidebar.tsx     # Side navigation
├── pages/              # Page components
│   ├── HomePage.tsx    # Dashboard/home page
│   └── ArticlesPage.tsx # Article listing page
├── services/           # API service layer
│   └── api.ts         # Backend API integration
├── hooks/             # Custom React hooks
│   └── useArticles.ts # Article data management
└── App.tsx           # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The app is designed to work with the ReadHub backend API. Key endpoints:

### Core Book Operations
- `POST /books` - Create a new book
- `GET /books` - Get all books with pagination
- `GET /books/{id}` - Get book by ID
- `PUT /books/{id}` - Update book by ID
- `DELETE /books/{id}` - Delete book by ID

### Search Operations
- `POST /search` - General book search
- `POST /search/by-category` - Search books by category
- `POST /search/by-language` - Search books by language
- `POST /search/by-uploader` - Search books by uploader

### Meta Operations
- `GET /books/count` - Get total book count
- `GET /books/{id}/exists` - Check if book exists

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
