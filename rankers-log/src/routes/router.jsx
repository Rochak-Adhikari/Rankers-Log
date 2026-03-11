import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../layouts/AppShell'
import { ProtectedRoute } from '../components/ProtectedRoute'

// Public pages
import { LandingPage } from '../pages/LandingPage'
import { AuthPage } from '../pages/AuthPage'
import { TermsPage } from '../pages/legal/TermsPage'
import { PrivacyPage } from '../pages/legal/PrivacyPage'
import { GuidelinesPage } from '../pages/legal/GuidelinesPage'
import { CopyrightPage } from '../pages/legal/CopyrightPage'
import { PublicProfilePage } from '../pages/PublicProfilePage'
import { PublicLicensePage } from '../pages/PublicLicensePage'
import { OnboardingPage } from '../pages/OnboardingPage'

// Protected pages - Core
import { HomeFeedPage } from '../pages/HomeFeedPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ProfileEditPage } from '../pages/ProfileEditPage'
import { ProfileOptionsPage } from '../pages/ProfileOptionsPage'
import { ArchivedPostsPage } from '../pages/ArchivedPostsPage'
import { HighlightsPage } from '../pages/HighlightsPage'
import { DMInboxPage } from '../pages/DMInboxPage'
import { ConversationPage } from '../pages/ConversationPage'
import { NewMessagePage } from '../pages/NewMessagePage'
import { NotificationsPage } from '../pages/NotificationsPage'
import { LeaderboardPage } from '../pages/LeaderboardPage'
import { LibraryPage } from '../pages/LibraryPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SearchPage } from '../pages/SearchPage'
import { GuildsPage } from '../pages/GuildsPage'
import { QuestsPage } from '../pages/QuestsPage'
import { AchievementsPage } from '../pages/AchievementsPage'

// Protected pages - Content
import { TitleDetailsPage } from '../pages/TitleDetailsPage'
import { CommentsPage } from '../pages/CommentsPage'
import { CollectionsPage } from '../pages/CollectionsPage'
import { SavedContentPage } from '../pages/SavedContentPage'
import { DraftsPage } from '../pages/DraftsPage'
import { MarketplacePage } from '../pages/MarketplacePage'

// Protected pages - Social
import { FriendsPage } from '../pages/FriendsPage'
import { MessageRequestsPage } from '../pages/MessageRequestsPage'
import { ActivityHistoryPage } from '../pages/ActivityHistoryPage'

// Protected pages - Guilds
import { GuildProfilePage } from '../pages/GuildProfilePage'
import { GuildHubPage } from '../pages/GuildHubPage'
import { GuildChatPage } from '../pages/GuildChatPage'
import { GuildSettingsPage } from '../pages/GuildSettingsPage'
import { CreateGuildPage } from '../pages/CreateGuildPage'

// Protected pages - Progression
import { StreaksPage } from '../pages/StreaksPage'
import { SkillTreePage } from '../pages/SkillTreePage'
import { AppraisalPage } from '../pages/AppraisalPage'

// Protected pages - Settings
import { AccountSecurityPage } from '../pages/settings/AccountSecurityPage'
import { PrivacyControlsPage } from '../pages/settings/PrivacyControlsPage'
import { BlockedUsersPage } from '../pages/settings/BlockedUsersPage'
import { NotificationSettingsPage } from '../pages/settings/NotificationSettingsPage'
import { LinkedAccountsPage } from '../pages/settings/LinkedAccountsPage'

// Protected pages - Safety
import { SafetyCenterPage } from '../pages/SafetyCenterPage'
import { ReportsPage } from '../pages/ReportsPage'
import { AppealPage } from '../pages/AppealPage'
import { TakedownPage } from '../pages/TakedownPage'

// Protected pages - Admin
import { AdminPage } from '../pages/AdminPage'

// Dev pages (only in development)
import { DevRoutesPage } from '../pages/DevRoutesPage'
import { DevQAPage } from '../pages/DevQAPage'

// Error pages
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  // Public routes (no App Shell)
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/auth/login',
    element: <AuthPage />
  },
  {
    path: '/auth/signup',
    element: <AuthPage />
  },
  {
    path: '/auth/forgot',
    element: <AuthPage />
  },
  {
    path: '/legal/terms',
    element: <TermsPage />
  },
  {
    path: '/legal/privacy',
    element: <PrivacyPage />
  },
  {
    path: '/legal/guidelines',
    element: <GuidelinesPage />
  },
  {
    path: '/legal/copyright',
    element: <CopyrightPage />
  },
  {
    path: '/u/:username',
    element: <PublicProfilePage />
  },
  {
    path: '/license/:shareId',
    element: <PublicLicensePage />
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />
  },

  // Protected routes (with App Shell)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      // Core
      { path: 'feed', element: <HomeFeedPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/edit', element: <ProfileEditPage /> },
      { path: 'profile/options', element: <ProfileOptionsPage /> },
      { path: 'profile/archive', element: <ArchivedPostsPage /> },
      { path: 'profile/highlights', element: <HighlightsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'quests', element: <QuestsPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      
      // Library
      { path: 'library', element: <LibraryPage /> },
      { path: 'library/collections', element: <CollectionsPage /> },
      { path: 'library/saved', element: <SavedContentPage /> },
      { path: 'library/drafts', element: <DraftsPage /> },
      // Shortcut paths for library sub-pages
      { path: 'collections', element: <CollectionsPage /> },
      { path: 'saved', element: <SavedContentPage /> },
      { path: 'drafts', element: <DraftsPage /> },
      
      // Content
      { path: 'title/:titleId', element: <TitleDetailsPage /> },
      { path: 'post/:postId', element: <CommentsPage /> },
      { path: 'comments/:postId', element: <CommentsPage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      
      // Messaging
      { path: 'messages', element: <DMInboxPage /> },
      { path: 'messages/new', element: <NewMessagePage /> },
      { path: 'messages/requests', element: <MessageRequestsPage /> },
      { path: 'messages/:conversationId', element: <ConversationPage /> },
      
      // Social
      { path: 'friends', element: <FriendsPage /> },
      { path: 'activity', element: <ActivityHistoryPage /> },
      
      // Guilds
      { path: 'guilds', element: <GuildsPage /> },
      { path: 'guilds/create', element: <CreateGuildPage /> },
      { path: 'guilds/:guildId', element: <GuildProfilePage /> },
      { path: 'guilds/:guildId/hub', element: <GuildHubPage /> },
      { path: 'guilds/:guildId/chat', element: <GuildChatPage /> },
      { path: 'guilds/:guildId/settings', element: <GuildSettingsPage /> },
      
      // Progression
      { path: 'streaks', element: <StreaksPage /> },
      { path: 'skill-tree', element: <SkillTreePage /> },
      { path: 'appraisal', element: <AppraisalPage /> },
      
      // Settings
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/account', element: <AccountSecurityPage /> },
      { path: 'settings/account-security', element: <AccountSecurityPage /> },
      { path: 'settings/privacy', element: <PrivacyControlsPage /> },
      { path: 'settings/blocked', element: <BlockedUsersPage /> },
      { path: 'settings/notifications', element: <NotificationSettingsPage /> },
      { path: 'settings/linked-accounts', element: <LinkedAccountsPage /> },
      
      // Safety
      { path: 'safety', element: <SafetyCenterPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'appeal', element: <AppealPage /> },
      { path: 'takedown', element: <TakedownPage /> },
      
      // Admin
      { path: 'admin', element: <AdminPage /> },
      
      // Dev (only shows in development)
      ...(import.meta.env.DEV ? [
        { path: 'dev/routes', element: <DevRoutesPage /> },
        { path: 'dev/qa', element: <DevQAPage /> }
      ] : []),
      
      // Catch-all for 404 within app
      { path: '*', element: <NotFoundPage /> }
    ]
  },
  
  // Global 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />
  }
])
