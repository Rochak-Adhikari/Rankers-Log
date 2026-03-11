# Ranker's Log - Routes and Screens Mapping

> **Last Updated**: January 2025
> **Total Routes**: 45+ routes with proper in-app navigation

## Source of Truth
All designs are from the `Final Stitch` folder (located at `../final stitch/`). Each screen folder contains:
- `code.html` - The HTML/Tailwind implementation
- `screen.png` - Visual preview

## Navigation System
The **Navigation System / App Shell** (`navigation_system_/_app_shell/`) is the SINGLE SOURCE OF TRUTH for navigation.
- **Desktop**: Left sidebar + top header
- **Mobile**: Bottom floating nav ("Command Deck")
- All other screens render CONTENT-ONLY inside the App Shell
- **Primary Nav (6 items max)**: Feed, Search, Guilds, Notifications, Profile
- **Secondary Nav**: Accessed via in-page links and settings

## Dev Testing
Visit `/dev/routes` (development only) to see all routes listed for QA testing.

---

## Complete Screen Inventory (52 Stitch Screens)

### PUBLIC ROUTES (No Auth Required)

| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 1 | `Landing-Welcome page/` | `/` | `LandingPage` | ✅ WIRED |
| 2 | `Login-Signup-Auth/` | `/auth/login` | `AuthPage` | ✅ WIRED |
| 3 | `Login-Signup-Auth/` | `/auth/signup` | `AuthPage` | ✅ WIRED |
| 4 | `Login-Signup-Auth/` | `/auth/forgot` | `AuthPage` | ✅ WIRED |
| 5 | `user_profile_view_-_social_hud/` | `/u/:username` | `PublicProfilePage` | ✅ WIRED |
| 6 | `public_share_-_hunter_license/` | `/license/:shareId` | `PublicLicensePage` | ✅ WIRED |
| 7 | `terms_of_service_-_legal_doc/` | `/legal/terms` | `TermsPage` | ✅ WIRED |
| 8 | `privacy_policy_-_data_rights/` | `/legal/privacy` | `PrivacyPage` | ✅ WIRED |
| 9 | `community_guidelines_-_code_of_conduct/` | `/legal/guidelines` | `GuidelinesPage` | ✅ WIRED |
| 10 | `copyright/` | `/legal/copyright` | `CopyrightPage` | ✅ WIRED |

### AUTH-PROTECTED ROUTES (Inside App Shell)

#### Core Navigation
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 11 | `Home Feed/` | `/feed` | `HomeFeedPage` | ✅ WIRED |
| 12 | `Leaderboard/` | `/leaderboard` | `LeaderboardPage` | ✅ WIRED |
| 13 | `my_library_(inventory)_-_cyberpunk/` | `/library` | `LibraryPage` | ✅ WIRED |
| 14 | `collections/shelves_-_custom_vaults/` | `/collections` (or `/library/collections`) | `CollectionsPage` | ✅ WIRED |
| 15 | `saved_content_-_personal_archive/` | `/saved` (or `/library/saved`) | `SavedContentPage` | ✅ WIRED |
| 16 | `draft_logs_-_data_cache/` | `/drafts` (or `/library/drafts`) | `DraftsPage` | ✅ WIRED |

#### Profile & User
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 17 | `Profile-Character Sheet/` | `/profile` | `ProfilePage` | ✅ WIRED |
| 18 | `edit_profile_-_customization_hud/` | `/profile/edit` | `EditProfilePage` | ✅ WIRED |
| 19 | `skill_tree_(cosmetic)_-_progression/` | `/skill-tree` | `SkillTreePage` | ✅ WIRED |
| 20 | `streaks/check-in_-_daily_ritual/` | `/streaks` | `StreaksPage` | ✅ WIRED |
| 21 | `activity_history_-_logbook_hud/` | `/activity` | `ActivityHistoryPage` | ✅ WIRED |
| 22 | `friends_list_-_social_grid/` | `/friends` | `FriendsPage` | ✅ WIRED |

#### Messaging
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 23 | `dm_inbox_-_comms_log/` | `/messages` | `DMInboxPage` | ✅ WIRED |
| 24 | `dm_chat_-_private_channel/` | `/messages/:threadId` | `DMChatPage` | ✅ WIRED |
| 25 | `message_requests_-_comms_filter/` | `/messages/requests` | `MessageRequestsPage` | ✅ WIRED |

#### Guilds
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 26 | `guild_list_-_faction_directory/` | `/guilds` | `GuildsPage` | ✅ WIRED |
| 27 | `guild_profile_-_faction_hub/` | `/guilds/:guildId` | `GuildProfilePage` | ✅ WIRED |
| 28 | `guild_hub_-_core_operations/` | `/guilds/:guildId/hub` | `GuildHubPage` | ✅ WIRED |
| 29 | `guild_chat_-_comms_link/` | `/guilds/:guildId/chat` | `GuildChatPage` | ✅ WIRED |
| 30 | `guild_settings_-_management_console/` | `/guilds/:guildId/settings` | `GuildSettingsPage` | ✅ WIRED |

#### Content & Discovery
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 31 | `Title Details/` | `/title/:titleId` | `TitleDetailsPage` | ✅ WIRED |
| 32 | `comments_thread_-_data_stream/` | `/post/:postId` (or `/comments/:postId`) | `CommentsPage` | ✅ WIRED |
| 33 | `search_results_-_data_console/` | `/search` | `SearchPage` | ✅ WIRED |
| 34 | `marketplace_-_supply_depot/` | `/marketplace` | `MarketplacePage` | ✅ WIRED |

#### Notifications & Quests
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 35 | `Notifcation/` | `/notifications` | `NotificationsPage` | ✅ WIRED |
| 36 | `Misson Log-Qust board/` | `/quests` | `QuestsPage` | ✅ WIRED |

#### Settings
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 37 | `Settings/` | `/settings` | `SettingsPage` | ✅ WIRED |
| 38 | `account_&_security_-_control_panel/` | `/settings/account` (or `/settings/account-security`) | `AccountSecurityPage` | ✅ WIRED |
| 39 | `privacy_controls_-_access_matrix/` | `/settings/privacy` | `PrivacyControlsPage` | ✅ WIRED |
| 40 | `blocked_users_-_security_log/` | `/settings/blocked` | `BlockedUsersPage` | ✅ WIRED |
| 41 | `download_data_-_data_export/` | `/settings/data` | — | STATIC |
| 42 | `cookie_preferences_-_data_access/` | `/settings/cookies` | — | STATIC |

#### Safety & Reports
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 43 | `safety_center_-_guardian_hub/` | `/safety` | `SafetyCenterPage` | ✅ WIRED |
| 44 | `reports/moderation_-_feedback_ui/` | `/reports` | `ReportsPage` | ✅ WIRED |
| 45 | `appeal_request_-_dispute_form/` | `/appeal` | `AppealPage` | ✅ WIRED |
| 46 | `takedown_request_-_formal_claim/` | `/takedown` | `TakedownPage` | ✅ WIRED |

#### Onboarding & System
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 47 | `onboarding_-_first_contact_hud/` | `/onboarding` | `OnboardingPage` | ✅ WIRED |
| 48 | `terms_&_privacy_-_legal_codex/` | `/onboarding/legal` | `LegalAcceptancePage` | ✅ WIRED |
| 49 | `system_appraisal_/` | `/appraisal` | `AppraisalPage` | ✅ WIRED |

#### Admin
| # | Stitch Folder | Route | Component | Status |
|---|--------------|-------|-----------|--------|
| 50 | `admin/dev_panel_-_debug_console/` | `/admin` | `AdminPage` | ✅ WIRED |

#### Utility Components
| # | Stitch Folder | Usage | Component | Status |
|---|--------------|-------|-----------|--------|
| 51 | `offline/maintenance_-_system_alert/` | Error boundary | `OfflinePage` | ✅ WIRED |
| 52 | `empty/error_states_-_system_message/` | Empty states | `EmptyState` | ✅ WIRED |
| 53 | `log_progress_-_sync_modal/` | Modal component | `LogProgressModal` | ✅ WIRED |
| 54 | `navigation_system_/_app_shell/` | Layout wrapper | `AppShell` | ✅ WIRED |

---

## Content Extraction Rules

For each Stitch HTML file:
1. **Remove**: `<head>`, `<header>` (if contains nav), bottom nav bar, any fixed navigation
2. **Keep**: Main content area only (`<main>` or primary content div)
3. **Convert**: `class` → `className`
4. **Preserve**: All Tailwind classes exactly as-is
5. **Extract**: Reusable components (cards, buttons, modals) to `src/components/`

---

## Database Tables (Supabase)

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profiles | Owner CRUD |
| `posts` | Activity logs/posts | Owner CRUD, public read |
| `comments` | Post comments | Owner CRUD, public read |
| `likes` | Post likes | Owner CRUD |
| `saves` | Saved/bookmarked posts | Owner only |
| `follows` | Follow relationships | Owner CRUD |
| `dm_threads` | DM thread metadata | Members only |
| `dm_messages` | DM messages | Members only |
| `notifications` | User notifications | Owner only |
| `guilds` | Guild metadata | Public read, admin CRUD |
| `guild_members` | Guild memberships | Members read, admin CRUD |
| `guild_messages` | Guild chat messages | Members only |
| `quests` | Available quests | Public read |
| `user_quests` | User quest progress | Owner only |
| `streaks` | Daily check-in streaks | Owner only |
| `collections` | User collections/shelves | Owner CRUD, optional public |
| `collection_items` | Items in collections | Owner only |
| `reports` | User reports | Owner create, admin read |
| `appeals` | Appeal requests | Owner create, admin read |
| `blocked_users` | Blocked user list | Owner only |
| `appraisals` | System appraisal results | Owner only, shareable |
| `drafts` | Draft logs | Owner only |

---

## QA Checklist

### Authentication Flow
- [ ] `/` - Landing page loads, CTA buttons work
- [ ] `/auth/signup` - Can create account
- [ ] `/auth/login` - Can log in
- [ ] `/auth/forgot` - Can request password reset
- [ ] Logout works from settings

### Core Features
- [ ] `/feed` - Posts load, can create new log
- [ ] `/profile` - Own profile loads, can edit
- [ ] `/u/:username` - Public profile loads
- [ ] `/messages` - DM inbox loads
- [ ] `/messages/:threadId` - Can send/receive messages
- [ ] `/notifications` - Notifications load, can mark read

### Content Features
- [ ] `/title/:titleId` - Title details load
- [ ] `/search` - Search works for users/posts
- [ ] `/library` - Library loads
- [ ] `/library/collections` - Collections work
- [ ] `/library/saved` - Saved content loads
- [ ] `/library/drafts` - Drafts work

### Social Features
- [ ] `/friends` - Following/followers lists work
- [ ] `/leaderboard` - Rankings load
- [ ] Follow/unfollow works
- [ ] Like/unlike posts works

### Guilds
- [ ] `/guilds` - Guild list loads
- [ ] `/guilds/:id` - Guild profile loads
- [ ] `/guilds/:id/hub` - Guild hub works
- [ ] `/guilds/:id/chat` - Guild chat works
- [ ] Join/leave guild works

### Progression
- [ ] `/quests` - Quest board loads
- [ ] `/streaks` - Streak check-in works
- [ ] `/skill-tree` - Skill tree displays
- [ ] `/activity` - Activity history loads

### Settings & Safety
- [ ] `/settings` - All setting pages work
- [ ] `/settings/blocked` - Block/unblock users
- [ ] `/reports` - Can submit report
- [ ] `/appeal` - Can submit appeal

### Onboarding
- [ ] `/onboarding` - Onboarding flow works
- [ ] `/appraisal` - System appraisal works
- [ ] `/license/:id` - Public share page loads

---

## In-App Navigation Entry Points

### From Profile (`/profile`)
Quick Access panel links to:
- `/activity` - Activity History
- `/friends` - Friends/Followers
- `/collections` - Collections
- `/saved` - Saved Content
- `/drafts` - Drafts
- `/streaks` - Streaks
- `/skill-tree` - Skill Tree
- `/settings` - Settings

### From Library (`/library`)
Quick Links panel provides access to:
- `/collections` - Custom shelves
- `/saved` - Bookmarked content
- `/drafts` - Unfinished logs
- `/activity` - Your timeline

### From Feed (`/feed`)
Each post links to:
- `/post/:postId` - Post details/comments
- `/u/:username` - Author's public profile

### From Messages (`/messages`)
Header links to:
- `/messages/requests` - Message Requests

### From Guilds (`/guilds`)
Each guild card links to:
- `/guilds/:id` - Guild Profile

### From Settings (`/settings`)
Navigation to all sub-pages:
- `/settings/account` - Account Security
- `/settings/privacy` - Privacy Controls
- `/settings/blocked` - Blocked Users
- `/safety` - Safety Center
- `/reports` - Report a Problem
- `/appeal` - Appeal a Decision
- Legal pages (`/legal/*`)
