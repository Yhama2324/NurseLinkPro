# CKalingaLink

## Overview

CKalingaLink is an AI-powered social learning platform designed specifically for Filipino nursing students, aspiring nurses, and graduates preparing for licensure exams (PNLE & NCLEX). The platform combines social networking features with adaptive learning tools, gamification elements, and community engagement to create a comprehensive educational ecosystem. Named from "C" (Calingacion) + "Kalinga" (Care) + "Link" (Connection), it embodies the mission of connecting care, courage, and community in nursing education.

The application features:
- **CareSpace**: A social feed where nursing students share experiences, motivation, and support
- **AI Study Tools**: Adaptive quiz generation, personalized study plans, and an AI copilot called "NurseMind"
- **Gamification**: XP systems, streaks, badges, daily challenges, and leaderboards
- **Community**: Clans (study groups) and parties (smaller study teams)
- **Marketplace**: Review centers, job opportunities, and ethical advertising (AdSpace)
- **Monetization**: Freemium subscription model with free, basic, and premium tiers

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: 
- Radix UI primitives for accessible, unstyled components
- shadcn/ui design system with "new-york" style variant
- Tailwind CSS for styling with custom design tokens
- Mobile-first responsive design (375px-428px primary viewport)

**Design Philosophy**:
- Reference-based hybrid drawing from Instagram (social feed), Duolingo (gamification), and LinkedIn (professional networking)
- Compassionate, healthcare-focused identity with clean interfaces
- Progressive disclosure to avoid overwhelming users
- Custom color palette emphasizing trust (blues) and empathy (warm accents)
- Typography: Poppins (primary) and Nunito Sans (secondary) from Google Fonts

**State Management**:
- TanStack Query (React Query) for server state management
- No global client state library (component-level state with React hooks)
- Query client configured with credentials and custom error handling

**Routing**: 
- Wouter for lightweight client-side routing
- Protected routes based on authentication status
- Main routes: Landing, Home (CareSpace), Quizzes, NurseMind (AI chat), Clans, Profile, Review Centers, Jobs, AdSpace, Subscriptions

**Key Features**:
- Splash screen with rotating motivational taglines
- Bottom navigation for mobile-first experience
- Top header with contextual actions (search, notifications)
- Real-time streak tracking and XP progress visualization
- File upload capabilities via Uppy with Google Cloud Storage integration

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**API Design**: RESTful API with credential-based session authentication

**Database ORM**: Drizzle ORM configured for PostgreSQL via Neon serverless driver

**Authentication Strategy**:
- OpenID Connect (OIDC) integration with Replit Auth
- Passport.js strategy for session management
- PostgreSQL-backed session store (connect-pg-simple)
- 7-day session TTL with secure, httpOnly cookies

**File Storage**:
- Google Cloud Storage integration via @google-cloud/storage
- Custom ACL (Access Control List) system for object permissions
- Replit sidecar endpoint for credential management
- Support for public and private object visibility

**AI Integration**:
- OpenAI API for NurseMind chatbot and content generation
- AI-powered quiz generation based on nursing curriculum topics
- Personalized study plan creation
- Multi-turn conversation support with history

**Payment Processing**:
- Stripe integration for subscription management
- Support for multiple subscription tiers (free, basic, premium)
- Customer and subscription ID tracking in user records

**BSN Curriculum Database**:
- Secure server-side storage of BSN curriculum data (31 subjects, 82 topics, 159 subtopics, 142 question tags)
- Structured curriculum covering Pre-nursing (Year 0) through Year 4
- PNLE and NCLEX blueprint mappings for each subject
- Organized by year, semester, and category (Aspirant/General Education/Major)
- Curriculum data stored in database tables, not as public JSON files
- Import script: `server/scripts/import-curriculum.ts` loads data from `server/data/bsn_curriculum.json`

**Key Route Categories**:
- `/api/auth/*` - Authentication endpoints (login, logout, user profile)
- `/api/posts/*` - Social feed CRUD operations
- `/api/quizzes/*` - Quiz generation, retrieval, and attempt tracking
- `/api/ai/*` - NurseMind conversations and study plans
- `/api/curriculum/*` - BSN curriculum data access (subjects, topics, subtopics, question tags)
- `/api/clans/*` and `/api/parties/*` - Community features
- `/api/review-centers/*`, `/api/jobs/*`, `/api/advertisements/*` - Marketplace
- `/objects/*` - Object storage access with ACL checks

### Database Schema

**Core Tables**:
- `users` - User profiles with XP, streaks, ranks, subscription data
- `posts` - CareSpace social feed content with hashtags
- `likes`, `comments` - Social engagement tracking
- `quizzes`, `questions`, `quiz_attempts` - Learning content and progress
- `clans`, `parties`, `clan_members`, `party_members` - Community structures
- `badges` - Achievement system
- `review_centers`, `jobs`, `advertisements` - Marketplace entities
- `daily_challenges`, `leaderboards` - Gamification features
- `ai_chat_conversations`, `ai_chat_messages` - AI interaction history
- `ai_study_plans` - Personalized learning paths
- `curriculum_subjects`, `curriculum_topics`, `curriculum_subtopics`, `curriculum_question_tags` - BSN curriculum database
- `sessions` - Server-side session storage

**Key Design Patterns**:
- Foreign key relationships with cascade deletes for data integrity
- JSONB fields for flexible data (hashtags, topnotchers)
- Timestamp tracking (createdAt, updatedAt) on all entities
- Serial IDs for database entities, varchar for OIDC user IDs
- Computed fields (likesCount, commentsCount) for performance

**Data Relationships**:
- Users own posts, comments, quiz attempts, and AI conversations
- Posts have many likes and comments (one-to-many)
- Quizzes contain multiple questions (one-to-many)
- Clans and parties have member relationships (many-to-many through join tables)

## External Dependencies

**Third-Party Services**:
- **Replit Auth**: OIDC-based authentication provider
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: GPT models for NurseMind AI features and content generation
- **Stripe**: Payment processing and subscription management
- **Google Cloud Storage**: Object/file storage with custom ACL system

**Major NPM Packages**:
- **Frontend**: React, TypeScript, Vite, TanStack Query, Wouter, Radix UI, Tailwind CSS, shadcn/ui components
- **Backend**: Express, Drizzle ORM, Passport.js, OpenID Client, Stripe SDK, Google Cloud Storage SDK
- **Development**: tsx for TypeScript execution, esbuild for production builds, drizzle-kit for migrations

**Configuration Files**:
- `drizzle.config.ts` - Database migration configuration pointing to PostgreSQL
- `vite.config.ts` - Frontend build configuration with path aliases (@/, @shared, @assets)
- `tailwind.config.ts` - Custom design system tokens and theme configuration
- `components.json` - shadcn/ui component configuration
- `tsconfig.json` - TypeScript compiler options with path mappings

**Environment Variables Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `OPENAI_API_KEY` - OpenAI API access
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `REPLIT_DOMAINS` - Allowed domains for OIDC
- `ISSUER_URL` - OIDC issuer endpoint (defaults to Replit)
- `REPL_ID` - Replit deployment identifier
- `PUBLIC_OBJECT_SEARCH_PATHS` - Paths for public file access