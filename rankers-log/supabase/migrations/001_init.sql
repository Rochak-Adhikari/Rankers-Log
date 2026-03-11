-- ============================================
-- RANKER'S LOG - AUTHORITATIVE DATABASE SCHEMA
-- ============================================
-- This is the CANONICAL schema file. Run this first in Supabase SQL Editor.
-- All policies are idempotent (DROP IF EXISTS before CREATE)
-- Version: 3.0 - Stabilization Release
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
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
  privacy_settings JSONB DEFAULT '{"dm_policy": "everyone", "profile_visible": true, "show_activity": true}'::jsonb,
  unlocked_skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  favorite_genres TEXT[] DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
  media_type TEXT,
  media_title TEXT,
  media_cover_url TEXT,
  title_name TEXT,
  progress_type TEXT,
  progress_value INTEGER,
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 10)),
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

DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create own posts" ON posts;
CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON comments;
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Likes are viewable by everyone" ON likes;
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like posts" ON likes;
CREATE POLICY "Users can like posts"
  ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike posts" ON likes;
CREATE POLICY "Users can unlike posts"
  ON likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMMENT LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON comment_likes;
CREATE POLICY "Comment likes are viewable by everyone"
  ON comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like comments" ON comment_likes;
CREATE POLICY "Users can like comments"
  ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike comments" ON comment_likes;
CREATE POLICY "Users can unlike comments"
  ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- SAVES (BOOKMARKS) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saves" ON saves;
CREATE POLICY "Users can view own saves"
  ON saves FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save posts" ON saves;
CREATE POLICY "Users can save posts"
  ON saves FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave posts" ON saves;
CREATE POLICY "Users can unsave posts"
  ON saves FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FOLLOWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Follows are viewable by everyone" ON follows;
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON follows;
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow others" ON follows;
CREATE POLICY "Users can unfollow others"
  ON follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================
-- DM THREADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dm_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'accepted', -- 'accepted', 'pending', 'declined'
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dm_threads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view threads they are members of" ON dm_threads;
CREATE POLICY "Users can view threads they are members of"
  ON dm_threads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dm_members
      WHERE dm_members.thread_id = dm_threads.id
      AND dm_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create dm threads" ON dm_threads;
CREATE POLICY "Users can create dm threads"
  ON dm_threads FOR INSERT
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

DROP POLICY IF EXISTS "Thread members can update thread status" ON dm_threads;
CREATE POLICY "Thread members can update thread status"
  ON dm_threads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM dm_members
      WHERE dm_members.thread_id = dm_threads.id
      AND dm_members.user_id = auth.uid()
    )
  );

-- ============================================
-- DM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dm_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES dm_threads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

ALTER TABLE dm_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own memberships" ON dm_members;
CREATE POLICY "Users can view own memberships"
  ON dm_members FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all members in their threads" ON dm_members;
CREATE POLICY "Users can view all members in their threads"
  ON dm_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dm_members m2
      WHERE m2.thread_id = dm_members.thread_id
      AND m2.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can join threads" ON dm_members;
CREATE POLICY "Users can join threads"
  ON dm_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Thread creator can add members" ON dm_members;
CREATE POLICY "Thread creator can add members"
  ON dm_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dm_threads
      WHERE dm_threads.id = thread_id
      AND dm_threads.created_by = auth.uid()
    )
  );

-- ============================================
-- DM MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dm_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES dm_threads(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dm_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in their threads" ON dm_messages;
CREATE POLICY "Users can view messages in their threads"
  ON dm_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dm_members
      WHERE dm_members.thread_id = dm_messages.thread_id
      AND dm_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can send messages to their threads" ON dm_messages;
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

DROP POLICY IF EXISTS "Users can update own message read status" ON dm_messages;
CREATE POLICY "Users can update own message read status"
  ON dm_messages FOR UPDATE
  USING (
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
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  message TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert notifications for others" ON notifications;
CREATE POLICY "Users can insert notifications for others"
  ON notifications FOR INSERT WITH CHECK (auth.uid() = actor_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- GUILDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guilds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  banner_url TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'public',
  category TEXT DEFAULT 'general',
  rank TEXT DEFAULT 'E',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guilds are viewable by everyone" ON guilds;
CREATE POLICY "Guilds are viewable by everyone"
  ON guilds FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create guilds" ON guilds;
CREATE POLICY "Users can create guilds"
  ON guilds FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Guild owners can update their guild" ON guilds;
CREATE POLICY "Guild owners can update their guild"
  ON guilds FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Guild owners can delete their guild" ON guilds;
CREATE POLICY "Guild owners can delete their guild"
  ON guilds FOR DELETE USING (auth.uid() = owner_id);

-- ============================================
-- GUILD MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guild_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guild_id, user_id)
);

ALTER TABLE guild_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guild members are viewable by everyone" ON guild_members;
CREATE POLICY "Guild members are viewable by everyone"
  ON guild_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join guilds" ON guild_members;
CREATE POLICY "Users can join guilds"
  ON guild_members FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave guilds or owners can remove" ON guild_members;
CREATE POLICY "Users can leave guilds or owners can remove"
  ON guild_members FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM guilds
      WHERE guilds.id = guild_members.guild_id
      AND guilds.owner_id = auth.uid()
    )
  );

-- ============================================
-- GUILD MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guild_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE guild_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guild members can view messages" ON guild_messages;
CREATE POLICY "Guild members can view messages"
  ON guild_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guild_members
      WHERE guild_members.guild_id = guild_messages.guild_id
      AND guild_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Guild members can send messages" ON guild_messages;
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
-- REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create reports" ON reports;
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view own reports" ON reports;
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- ============================================
-- APPEALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appeals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create appeals" ON appeals;
CREATE POLICY "Users can create appeals"
  ON appeals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own appeals" ON appeals;
CREATE POLICY "Users can view own appeals"
  ON appeals FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- TRACKING LIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tracking_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title_name TEXT NOT NULL,
  title_type TEXT,
  cover_url TEXT,
  status TEXT DEFAULT 'planned',
  progress INTEGER DEFAULT 0,
  total INTEGER,
  rating INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tracking_list ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tracking list" ON tracking_list;
CREATE POLICY "Users can view own tracking list"
  ON tracking_list FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own tracking list" ON tracking_list;
CREATE POLICY "Users can manage own tracking list"
  ON tracking_list FOR ALL USING (auth.uid() = user_id);

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

DROP POLICY IF EXISTS "Users can view own streaks" ON streaks;
CREATE POLICY "Users can view own streaks"
  ON streaks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own streaks" ON streaks;
CREATE POLICY "Users can manage own streaks"
  ON streaks FOR ALL USING (auth.uid() = user_id);

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

DROP POLICY IF EXISTS "Users can view own blocked list" ON blocked_users;
CREATE POLICY "Users can view own blocked list"
  ON blocked_users FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can block others" ON blocked_users;
CREATE POLICY "Users can block others"
  ON blocked_users FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unblock others" ON blocked_users;
CREATE POLICY "Users can unblock others"
  ON blocked_users FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'username', 'Hunter'),
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: Update likes_count on posts
-- ============================================
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON likes;
CREATE TRIGGER trigger_update_post_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- ============================================
-- FUNCTION: Update comments_count on posts
-- ============================================
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = COALESCE(comments_count, 0) + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON comments;
CREATE TRIGGER trigger_update_post_comments_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- ============================================
-- FUNCTION: Update likes_count on comments
-- ============================================
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0) WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_comment_likes_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_likes_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- ============================================
-- FUNCTION: Update followers_count on profiles
-- ============================================
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET followers_count = COALESCE(followers_count, 0) + 1 WHERE id = NEW.following_id;
    UPDATE profiles SET following_count = COALESCE(following_count, 0) + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET followers_count = GREATEST(COALESCE(followers_count, 0) - 1, 0) WHERE id = OLD.following_id;
    UPDATE profiles SET following_count = GREATEST(COALESCE(following_count, 0) - 1, 0) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_follow_counts ON follows;
CREATE TRIGGER trigger_update_follow_counts
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- ============================================
-- FUNCTION: Update guild member_count
-- ============================================
CREATE OR REPLACE FUNCTION update_guild_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guilds SET member_count = COALESCE(member_count, 0) + 1 WHERE id = NEW.guild_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guilds SET member_count = GREATEST(COALESCE(member_count, 0) - 1, 0) WHERE id = OLD.guild_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_guild_member_count ON guild_members;
CREATE TRIGGER trigger_update_guild_member_count
  AFTER INSERT OR DELETE ON guild_members
  FOR EACH ROW EXECUTE FUNCTION update_guild_member_count();

-- ============================================
-- FUNCTION: Create notification on follow
-- ============================================
CREATE OR REPLACE FUNCTION notify_on_follow()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, actor_id, message)
  VALUES (NEW.following_id, 'follow', NEW.follower_id, 'started following you');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_on_follow ON follows;
CREATE TRIGGER trigger_notify_on_follow
  AFTER INSERT ON follows
  FOR EACH ROW EXECUTE FUNCTION notify_on_follow();

-- ============================================
-- FUNCTION: Create notification on like
-- ============================================
CREATE OR REPLACE FUNCTION notify_on_like()
RETURNS TRIGGER AS $$
DECLARE
  post_owner_id UUID;
BEGIN
  SELECT user_id INTO post_owner_id FROM posts WHERE id = NEW.post_id;
  IF post_owner_id IS NOT NULL AND post_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, type, actor_id, post_id, message)
    VALUES (post_owner_id, 'like', NEW.user_id, NEW.post_id, 'liked your post');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_on_like ON likes;
CREATE TRIGGER trigger_notify_on_like
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION notify_on_like();

-- ============================================
-- FUNCTION: Create notification on comment
-- ============================================
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_owner_id UUID;
BEGIN
  SELECT user_id INTO post_owner_id FROM posts WHERE id = NEW.post_id;
  IF post_owner_id IS NOT NULL AND post_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, type, actor_id, post_id, comment_id, message)
    VALUES (post_owner_id, 'comment', NEW.user_id, NEW.post_id, NEW.id, 'commented on your post');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_on_comment ON comments;
CREATE TRIGGER trigger_notify_on_comment
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION notify_on_comment();

-- ============================================
-- FUNCTION: Get or create DM thread
-- ============================================
CREATE OR REPLACE FUNCTION get_or_create_dm_thread(user1 UUID, user2 UUID)
RETURNS UUID AS $$
DECLARE
  existing_thread UUID;
  new_thread UUID;
BEGIN
  SELECT t.id INTO existing_thread
  FROM dm_threads t
  JOIN dm_members m1 ON t.id = m1.thread_id AND m1.user_id = user1
  JOIN dm_members m2 ON t.id = m2.thread_id AND m2.user_id = user2
  LIMIT 1;
  
  IF existing_thread IS NOT NULL THEN
    UPDATE dm_threads SET status = 'accepted' WHERE id = existing_thread AND status = 'pending';
    RETURN existing_thread;
  END IF;
  
  INSERT INTO dm_threads (status, created_by) VALUES ('accepted', user1) RETURNING id INTO new_thread;
  INSERT INTO dm_members (thread_id, user_id) VALUES (new_thread, user1);
  INSERT INTO dm_members (thread_id, user_id) VALUES (new_thread, user2);
  
  RETURN new_thread;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Check mutual follow
-- ============================================
CREATE OR REPLACE FUNCTION check_mutual_follow(user1 UUID, user2 UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM follows f1
    JOIN follows f2 ON f1.follower_id = f2.following_id AND f1.following_id = f2.follower_id
    WHERE f1.follower_id = user1 AND f1.following_id = user2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_dm_threads_status ON dm_threads(status);
CREATE INDEX IF NOT EXISTS idx_dm_members_thread_id ON dm_members(thread_id);
CREATE INDEX IF NOT EXISTS idx_dm_members_user_id ON dm_members(user_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_thread_id ON dm_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_created_at ON dm_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON guild_members(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_user_id ON guild_members(user_id);
CREATE INDEX IF NOT EXISTS idx_guild_messages_guild_id ON guild_messages(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_messages_created_at ON guild_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_list_user_id ON tracking_list(user_id);

-- ============================================
-- END OF AUTHORITATIVE SCHEMA
-- ============================================
