# Ranker's Log

A cyberpunk-themed tracking HUD for anime, manga, games, and novels. Built with React + Vite + Tailwind CSS + Supabase.

## 🚀 MVP Status: COMPLETE

All 54 Stitch screens have been converted to React pages and wired to Supabase.

## Tech Stack

- **Frontend**: React 19 + Vite 7 + Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Routing**: React Router 6
- **Styling**: Tailwind CSS with custom theme tokens
- **Icons**: Material Symbols Outlined

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone and install:
```bash
cd rankers-log
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Add Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up database:
```bash
# In Supabase SQL Editor, run in order:
supabase/schema.sql
supabase/migrations/002_additional_tables.sql
```

5. Start dev server:
```bash
npm run dev
```

6. Open http://localhost:5173

## Project Structure

```
src/
├── components/        # Reusable UI components
├── hooks/             # Custom hooks (useAuth)
├── layouts/           # AppShell layout
├── lib/               # Supabase client
├── pages/             # 40+ page components
│   ├── legal/         # Legal pages
│   └── settings/      # Settings sub-pages
├── routes/            # Router config
└── styles/            # Global styles
```

## ✅ Implemented Features (40+ Routes)

### Authentication
- Login/Signup/Forgot password
- Protected routes with auth guard
- Session persistence
- Onboarding flow

### Core Features
- **Home Feed** - Create/read posts, optimistic UI
- **Profile** - View/edit own profile, stats
- **Public Profile** - View other users (`/u/:username`)
- **Notifications** - Mark read, type-based styling
- **Leaderboard** - Rankings display
- **Search** - Users and posts search

### Content & Library
- **Title Details** - Media info, user logs, progress tracking
- **Comments** - CRUD on posts
- **Library** - User content inventory
- **Collections** - Custom shelves/vaults
- **Saved Content** - Bookmarked posts
- **Drafts** - Resume unfinished logs
- **Marketplace** - Cosmetic shop

### Social
- **DM Inbox** - Thread list, unread counts
- **DM Chat** - Real-time messaging
- **Message Requests** - Accept/decline
- **Friends** - Following/followers/mutuals
- **Activity History** - User timeline

### Guilds
- **Guild List** - Browse guilds
- **Guild Profile** - Guild details, join/leave
- **Guild Hub** - Operations center
- **Guild Chat** - Guild messaging
- **Guild Settings** - Admin management

### Progression
- **Quests** - Quest board, claim rewards
- **Streaks** - Daily check-in, streak tracking
- **Skill Tree** - Cosmetic progression
- **System Appraisal** - Hunter class quiz
- **Hunter License** - Shareable profile card

### Settings
- **Main Settings** - Navigation hub
- **Account Security** - Password, 2FA
- **Privacy Controls** - Visibility settings
- **Blocked Users** - Block/unblock

### Safety & Legal
- **Safety Center** - Help resources
- **Reports** - Submit reports
- **Appeals** - Dispute form
- **Takedown** - DMCA requests
- **Terms/Privacy/Guidelines** - Legal docs

### Admin
- **Admin Panel** - Debug console (role-protected)

## Database Schema

See `supabase/schema.sql` and `supabase/migrations/002_additional_tables.sql`

Key tables:
- `profiles` - User data
- `posts` - Activity logs
- `comments`, `likes`, `saves` - Interactions
- `follows` - Social graph
- `dm_threads`, `dm_messages` - Messaging
- `notifications` - User notifications
- `guilds`, `guild_members`, `guild_messages` - Guild system
- `quests`, `user_quests` - Quest system
- `streaks` - Daily check-ins
- `collections`, `collection_items` - User shelves
- `reports`, `appeals`, `takedown_requests` - Safety
- `appraisals` - Hunter licenses
- `drafts` - Saved drafts

## Design System

UI matches Stitch exports exactly:

- **Primary**: `#258cf4` (Neon Blue)
- **Background**: `#050505` (Void Dark)
- **Rank Gold**: `#FFD700`
- **Rank Cyan**: `#00FFFF`
- **Fonts**: Space Grotesk, Noto Sans
- **Icons**: Material Symbols Outlined

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint
```

## QA Checklist

### Auth Flow
- [ ] `/` - Landing loads, CTAs work
- [ ] `/auth/signup` - Create account
- [ ] `/auth/login` - Login works
- [ ] `/auth/forgot` - Reset email sent
- [ ] Logout works from settings

### Core
- [ ] `/feed` - Posts load, create works
- [ ] `/profile` - Profile loads, edit works
- [ ] `/u/:username` - Public profile loads
- [ ] `/messages` - DM inbox works
- [ ] `/notifications` - Notifications work

### Content
- [ ] `/title/:id` - Title details load
- [ ] `/search` - Search works
- [ ] `/library` - Library loads
- [ ] `/library/collections` - Collections work

### Social
- [ ] `/friends` - Friends list works
- [ ] `/leaderboard` - Rankings load
- [ ] Follow/unfollow functional

### Guilds
- [ ] `/guilds` - Guild list loads
- [ ] `/guilds/:id` - Guild profile works
- [ ] Join/leave functional

### Progression
- [ ] `/quests` - Quest board loads
- [ ] `/streaks` - Check-in works
- [ ] `/skill-tree` - Tree displays
- [ ] `/appraisal` - Quiz works

### Settings
- [ ] All settings pages accessible
- [ ] Block/unblock works
- [ ] Privacy toggles work

## Documentation

See `docs/ROUTES_AND_SCREENS.md` for complete route mapping.

## License

All rights reserved. Design assets from Google Stitch.
