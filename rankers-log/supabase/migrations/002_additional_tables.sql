-- Migration: Additional tables for MVP completion
-- Run this after the initial schema.sql

-- ============================================
-- STREAKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_check_in TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- COLLECTIONS (SHELVES) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create collections"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COLLECTION ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  title_name TEXT NOT NULL,
  title_type TEXT, -- 'anime', 'manga', 'game', etc.
  cover_url TEXT,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planned', -- 'planned', 'in_progress', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collection items they own"
  ON collection_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_items.collection_id
      AND (collections.user_id = auth.uid() OR collections.is_public = true)
    )
  );

CREATE POLICY "Users can manage own collection items"
  ON collection_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_items.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- ============================================
-- BLOCKED USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, blocked_user_id)
);

ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blocked list"
  ON blocked_users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can block others"
  ON blocked_users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unblock others"
  ON blocked_users FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- APPRAISALS (HUNTER LICENSE) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appraisals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  hunter_class TEXT NOT NULL,
  rank TEXT NOT NULL,
  stats JSONB,
  share_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appraisals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Appraisals are viewable by share_id"
  ON appraisals FOR SELECT
  USING (true);

CREATE POLICY "Users can create own appraisals"
  ON appraisals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DRAFTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title_name TEXT,
  media_type TEXT,
  content TEXT,
  progress INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own drafts"
  ON drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create drafts"
  ON drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON drafts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- QUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'special'
  xp_reward INTEGER DEFAULT 50,
  requirements JSONB,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quests are viewable by everyone"
  ON quests FOR SELECT
  USING (is_active = true);

-- ============================================
-- USER QUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quest progress"
  ON user_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quest progress"
  ON user_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quest progress"
  ON user_quests FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TAKEDOWN REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS takedown_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_url TEXT NOT NULL,
  original_work TEXT NOT NULL,
  ownership_proof TEXT,
  contact_email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'denied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE takedown_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create takedown requests"
  ON takedown_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own takedown requests"
  ON takedown_requests FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- ADD COLUMNS TO EXISTING TABLES
-- ============================================

-- Add title_name to posts for title reference
ALTER TABLE posts ADD COLUMN IF NOT EXISTS title_name TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS rating INTEGER;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- Add additional profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unlocked_skills TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS favorite_genres TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add status to dm_threads for message requests
ALTER TABLE dm_threads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'accepted';
ALTER TABLE dm_threads ADD COLUMN IF NOT EXISTS user1_id UUID REFERENCES profiles(id);
ALTER TABLE dm_threads ADD COLUMN IF NOT EXISTS user2_id UUID REFERENCES profiles(id);

-- Add level and xp to guilds
ALTER TABLE guilds ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE guilds ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE guilds ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE guilds ADD COLUMN IF NOT EXISTS allow_invites BOOLEAN DEFAULT true;
ALTER TABLE guilds ADD COLUMN IF NOT EXISTS min_level INTEGER DEFAULT 1;

-- Update reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS report_type TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS details TEXT;

-- Update appeals table
ALTER TABLE appeals ADD COLUMN IF NOT EXISTS appeal_type TEXT;
ALTER TABLE appeals ADD COLUMN IF NOT EXISTS evidence TEXT;

-- ============================================
-- ADDITIONAL INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_appraisals_share_id ON appraisals(share_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_user_id ON blocked_users(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON user_quests(user_id);

-- ============================================
-- INSERT DEFAULT QUESTS
-- ============================================
INSERT INTO quests (name, description, type, xp_reward) VALUES
  ('Daily Check-in', 'Log in to the app today', 'daily', 10),
  ('Log Progress', 'Update your progress on any title', 'daily', 25),
  ('Read 3 Chapters', 'Read 3 chapters of any manga', 'daily', 50),
  ('Weekly Review', 'Write a detailed review of a title', 'weekly', 150),
  ('Social Butterfly', 'Follow 5 new users this week', 'weekly', 100),
  ('Guild Activity', 'Participate in guild chat', 'weekly', 75)
ON CONFLICT DO NOTHING;
