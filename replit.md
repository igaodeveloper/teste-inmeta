# CardMarket - Trading Card Marketplace

## Overview

CardMarket is a professional single-page application (SPA) built for trading card marketplace functionality. The application features a modern React 18+ frontend with TypeScript, backed by an Express.js server using PostgreSQL for data persistence. The architecture follows clean code principles with feature-based organization and comprehensive UI components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript (strict mode enabled)
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for global state with persistence
- **UI Framework**: TailwindCSS with Radix UI components (shadcn/ui)
- **Build Tool**: Vite with development optimizations
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Storage**: In-memory storage for development, designed for easy PostgreSQL migration
- **Validation**: Shared Zod schemas between client and server

### Database Schema
The application uses four main entities:
- **Users**: Authentication and profile data
- **Cards**: Trading card catalog with rarity and set information
- **UserCards**: User's card collection with quantities
- **Trades**: Trading posts with offered/wanted cards stored as JSON

## Key Components

### Authentication System
- JWT token-based authentication
- Persistent login state using Zustand with localStorage
- Protected routes with AuthGuard component
- Registration and login forms with validation

### Card Management
- Card catalog with search and filtering capabilities
- User collection management
- Card rarity system (common, rare, epic, legendary)
- Image handling with fallback placeholders

### Trading System
- Create trading posts with offered and wanted cards
- Browse active trades from other users
- Trade ownership management and deletion
- Real-time trade status tracking

### UI/UX Features
- Dark/light theme toggle with system preference detection
- Responsive design with mobile navigation
- Loading states and skeleton components
- Toast notifications for user feedback
- Accessible components using Radix UI primitives

## Data Flow

1. **Authentication Flow**: User credentials → JWT token → Persistent store → API authorization
2. **Card Browsing**: API fetch → React Query cache → Component rendering → User interactions
3. **Trade Creation**: Form validation → API request → Cache invalidation → UI update
4. **State Management**: Local actions → Zustand store → Component re-renders

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: TailwindCSS with CSS variables for theming
- **Date Handling**: date-fns for time formatting
- **Icons**: Lucide React for consistent iconography
- **Carousel**: Embla Carousel for card displays

### Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **Password Security**: bcrypt for hashing
- **Token Management**: jsonwebtoken for authentication

### Development Tools
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint and Prettier (configured)
- **Build Process**: Vite with development server
- **Database Management**: Drizzle Kit for migrations

## Deployment Strategy

The application is configured for production deployment with:
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Environment Variables**: DATABASE_URL for PostgreSQL connection
- **Development Mode**: Hot reload with Vite middleware
- **Production Mode**: Static file serving with Express
- **Database Migration**: Drizzle push for schema updates

The architecture supports easy migration from in-memory storage to full PostgreSQL deployment, with all database schemas and queries already configured for production use.