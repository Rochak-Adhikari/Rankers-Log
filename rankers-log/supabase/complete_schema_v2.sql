-- ============================================
-- DEPRECATED: Use /supabase/migrations/001_init.sql instead
-- This file is kept for reference only. Do NOT run this file.
-- ============================================
-- RANKER'S LOG - COMPLETE DATABASE SCHEMA V2 (OLD)
-- ============================================
-- CRITICAL: Run this entire file in your Supabase SQL Editor
-- This schema includes ALL tables used in the application
-- Version: 2.1 - Fixed Foreign Key Issues
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES TABLE (MUST BE FIRST)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  title TEXT DEFAULT 'Newcomer',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'E',
  role TEXT DEFAULT 'user',
  unlocked_skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  favorite_genres TEXT[] DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  location TEXT,
  website TEXT,
  discord TEXT,
  twitter TEXT,
  twitch TEXT,
  profile_visibility BOOLEAN DEFAULT true,
  online_status BOOLEAN DEFAULT true,
  notification_settings JSONB DEFAULT '{"likes": true, "comments": true, "follows": true, "messages": true}'::jsonb,
  privacy_settings JSONB DEFAULT '{"profile_visible": true, "show_activity": true}'::jsonb,
  linked_accounts JSONB DEFAULT '{}'::jsonb,
  sync_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  image_url TEXT,
  media_type TEXT,
  media_title TEXT,
  media_cover_url TEXT,
  title_name TEXT,
  progress_type TEXT,
  progress_value INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  tags TEXT[] DEFAULT '{}',
  achievement_type TEXT,
  xp_earned INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SAVES (BOOKMARKS) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saves"
  ON saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save posts"
  ON saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave posts"
  ON saves FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FOLLOWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- DM THREADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dm_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'accepted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dm_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view threads they are part of"
  ON dm_threads FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create dm threads"
  ON dm_threads FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ============================================
-- DM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dm_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES dm_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

ALTER TABLE dm_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view threads they are members of"
  ON dm_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join threads"
  ON dm_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DM MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dm_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES dm_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dm_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their threads"
  ON dm_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dm_members
      WHERE dm_members.thread_id = dm_messages.thread_id
      AND dm_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their threads"
  ON dm_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM dm_members
      WHERE dm_members.thread_id = dm_messages.thread_id
      AND dm_members.user_id = auth.uid()
    )
  );

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  reference_id UUID,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- ============================================
-- GUILDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guilds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  banner_url TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'public',
  category TEXT DEFAULT 'general',
  rank TEXT DEFAULT 'E',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT true,
  allow_invites BOOLEAN DEFAULT true,
  min_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guilds are viewable by everyone"
  ON guilds FOR SELECT
  USING (true);

CREATE POLICY "Users can create guilds"
  ON guilds FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Guild owners can update their guild"
  ON guilds FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Guild owners can delete their guild"
  ON guilds FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- GUILD MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guild_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guild_id, user_id)
);

ALTER TABLE guild_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guild members are viewable by everyone"
  ON guild_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join guilds"
  ON guild_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave guilds"
  ON guild_members FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GUILD MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guild_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE guild_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guild members can view messages"
  ON guild_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guild_members
      WHERE guild_members.guild_id = guild_messages.guild_id
      AND guild_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Guild members can send messages"
  ON guild_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM guild_members
      WHERE guild_members.guild_id = guild_messages.guild_id
      AND guild_members.user_id = auth.uid()
    )
  );

-- ============================================
-- STREAKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
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
-- COLLECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  title_name TEXT NOT NULL,
  title_type TEXT,
  cover_url TEXT,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planned',
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
-- TRACKING LIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tracking_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'watching',
  progress INTEGER DEFAULT 0,
  total INTEGER,
  cover TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tracking_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tracking list"
  ON tracking_list FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tracking list"
  ON tracking_list FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- HIGHLIGHTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'star',
  post_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Highlights are viewable by everyone"
  ON highlights FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own highlights"
  ON highlights FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- BLOCKED USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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
-- APPRAISALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appraisals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  player_class TEXT NOT NULL,
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
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title_name TEXT,
  media_type TEXT,
  content TEXT,
  image_url TEXT,
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
  type TEXT DEFAULT 'daily',
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
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
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
-- REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  report_type TEXT,
  reason TEXT NOT NULL,
  description TEXT,
  details TEXT,
  target_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = reporter_id);

-- ============================================
-- APPEALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appeals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  appeal_type TEXT,
  reason TEXT NOT NULL,
  description TEXT,
  details TEXT,
  evidence TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create appeals"
  ON appeals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own appeals"
  ON appeals FOR SELECT
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
  status TEXT DEFAULT 'pending',
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
-- LEGAL ACCEPTANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS legal_acceptance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  terms_accepted_at TIMESTAMPTZ,
  privacy_accepted_at TIMESTAMPTZ,
  terms_version TEXT,
  privacy_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE legal_acceptance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own legal acceptance"
  ON legal_acceptance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own legal acceptance"
  ON legal_acceptance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own legal acceptance"
  ON legal_acceptance FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- ACTIVITY HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON activity_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can log activity"
  ON activity_history FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Create profile on signup (CRITICAL)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', 'Player'),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaWmABVJXA2jsgAaK0-A6KfaQdF1oWID-5yztCv3l5U4qlYJDSTECr6S60s6aBycW6BghIvBQ1xOa8-DhAwvTEzDPpjRcZd0K45p4r0ZfOwdKum9Qnyac1EEnvjyeO_Kq60P6BMi4UkW9vs35XyjWPzLq4wVuhV3rWwCt6UUEUAj6mnAT-RhULGMZ8cxGGp7Uc_F5TTib0U2w_QW5cFL4wkdzQUMu-AH7iLWkIVuNlTrz5B5RRSt_BDGQakh-x3VtiqhU72W8jV3j'
    )
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Increment user XP
CREATE OR REPLACE FUNCTION increment_user_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS void AS $$
DECLARE
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  UPDATE profiles
  SET xp = xp + xp_amount,
      updated_at = NOW()
  WHERE id = user_uuid
  RETURNING xp INTO new_xp;
  
  -- Calculate new level (every 100 XP = 1 level)
  new_level := FLOOR(new_xp / 100) + 1;
  
  UPDATE profiles
  SET level = new_level
  WHERE id = user_uuid AND level < new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'likes' THEN
      UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_TABLE_NAME = 'comments' THEN
      UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'likes' THEN
      UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    ELSIF TG_TABLE_NAME = 'comments' THEN
      UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for post counts
DROP TRIGGER IF EXISTS update_likes_count ON likes;
CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_post_counts();

DROP TRIGGER IF EXISTS update_comments_count ON comments;
CREATE TRIGGER update_comments_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Function: Update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for follower counts
DROP TRIGGER IF EXISTS update_follow_counts ON follows;
CREATE TRIGGER update_follow_counts
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follower_counts();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_media_type ON posts(media_type);
CREATE INDEX IF NOT EXISTS idx_posts_archived ON posts(is_archived);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_saves_user_id ON saves(user_id);
CREATE INDEX IF NOT EXISTS idx_saves_post_id ON saves(post_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_dm_messages_thread_id ON dm_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_created ON dm_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guild_messages_guild_id ON guild_messages(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_messages_created ON guild_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON guild_members(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_user_id ON guild_members(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_appraisals_share_id ON appraisals(share_id);
CREATE INDEX IF NOT EXISTS idx_appraisals_user_id ON appraisals(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_user_id ON blocked_users(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_list_user_id ON tracking_list(user_id);
CREATE INDEX IF NOT EXISTS idx_highlights_user_id ON highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_history_user_id ON activity_history(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ============================================
-- SEED DATA - DEFAULT QUESTS
-- ============================================
INSERT INTO quests (name, description, type, xp_reward) VALUES
  ('Daily Check-in', 'Log in to the app today', 'daily', 10),
  ('Log Progress', 'Update your progress on any title', 'daily', 25),
  ('Read 3 Chapters', 'Read 3 chapters of any manga', 'daily', 50),
  ('Watch an Episode', 'Watch an episode of any anime', 'daily', 30),
  ('Weekly Review', 'Write a detailed review of a title', 'weekly', 150),
  ('Social Butterfly', 'Follow 5 new users this week', 'weekly', 100),
  ('Guild Activity', 'Participate in guild chat', 'weekly', 75),
  ('Achievement Hunter', 'Complete any achievement', 'daily', 40),
  ('Content Creator', 'Create 3 posts this week', 'weekly', 120),
  ('Community Helper', 'Comment on 10 posts', 'weekly', 80)
ON CONFLICT DO NOTHING;

-- ============================================
-- STORAGE BUCKETS SETUP
-- ============================================
-- Run these commands in Supabase Dashboard > Storage:
-- 1. Create bucket: "media" (public)
-- 2. Create bucket: "avatars" (public) 
-- 3. Create bucket: "banners" (public)

-- Or run this SQL to create buckets programmatically:
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('media', 'media', true),
  ('avatars', 'avatars', true),
  ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('media', 'avatars', 'banners') );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('media', 'avatars', 'banners') 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING ( auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING ( auth.uid()::text = (storage.foldername(name))[1] );

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
-- Schema creation complete!
-- 
-- CRITICAL: The handle_new_user() trigger will automatically create
-- a profile for every new user that signs up. This prevents the
-- "foreign key constraint violation" error.
--
-- Next steps:
-- 1. Verify storage buckets are created
-- 2. Test user signup to ensure profile is created
-- 3. Try creating a post - it should work now!
-- ============================================
