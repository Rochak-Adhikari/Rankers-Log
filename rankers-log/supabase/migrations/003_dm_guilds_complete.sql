-- Migration: Complete DM & Guilds System
-- Adds privacy_settings, ensures proper RLS, removes need for fake data

-- ============================================
-- ADD PRIVACY SETTINGS TO PROFILES
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{
  "dm_policy": "everyone",
  "profile_visible": true,
  "show_activity": true
}'::jsonb;

-- ============================================
-- ENSURE DM_THREADS HAS STATUS COLUMN
-- ============================================
ALTER TABLE dm_threads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'accepted';
ALTER TABLE dm_threads ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_dm_threads_status ON dm_threads(status);
CREATE INDEX IF NOT EXISTS idx_dm_members_user_id ON dm_members(user_id);
CREATE INDEX IF NOT EXISTS idx_dm_members_thread_id ON dm_members(thread_id);

-- ============================================
-- RLS POLICIES FOR DM_MEMBERS (if missing)
-- ============================================
DROP POLICY IF EXISTS "Users can join threads" ON dm_members;
CREATE POLICY "Users can join threads"
  ON dm_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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

-- ============================================
-- GUILDS - ENSURE INSERT POLICY EXISTS
-- ============================================
DROP POLICY IF EXISTS "Users can create guilds" ON guilds;
CREATE POLICY "Users can create guilds"
  ON guilds FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Guild owners can delete their guild" ON guilds;
CREATE POLICY "Guild owners can delete their guild"
  ON guilds FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- GUILD MEMBERS - OWNER CAN REMOVE MEMBERS
-- ============================================
DROP POLICY IF EXISTS "Guild owners can remove members" ON guild_members;
CREATE POLICY "Guild owners can remove members"
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
-- FUNCTION: CHECK MUTUAL FOLLOW
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
-- FUNCTION: CHECK IF USER CAN DM
-- ============================================
CREATE OR REPLACE FUNCTION can_send_dm(sender UUID, recipient UUID)
RETURNS BOOLEAN AS $$
DECLARE
  dm_policy TEXT;
  is_following BOOLEAN;
  is_mutual BOOLEAN;
BEGIN
  -- Get recipient's DM policy
  SELECT (privacy_settings->>'dm_policy')::TEXT INTO dm_policy
  FROM profiles WHERE id = recipient;
  
  -- Default to 'everyone' if not set
  dm_policy := COALESCE(dm_policy, 'everyone');
  
  -- Check based on policy
  IF dm_policy = 'everyone' THEN
    RETURN TRUE;
  ELSIF dm_policy = 'no_one' THEN
    -- Only allow if existing accepted thread
    RETURN EXISTS (
      SELECT 1 FROM dm_threads t
      JOIN dm_members m1 ON t.id = m1.thread_id AND m1.user_id = sender
      JOIN dm_members m2 ON t.id = m2.thread_id AND m2.user_id = recipient
      WHERE t.status = 'accepted'
    );
  ELSIF dm_policy = 'followers' THEN
    -- Sender must follow recipient
    RETURN EXISTS (
      SELECT 1 FROM follows WHERE follower_id = sender AND following_id = recipient
    );
  ELSIF dm_policy = 'mutuals' THEN
    -- Must be mutual follows
    RETURN check_mutual_follow(sender, recipient);
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: GET OR CREATE DM THREAD
-- ============================================
CREATE OR REPLACE FUNCTION get_or_create_dm_thread(user1 UUID, user2 UUID)
RETURNS UUID AS $$
DECLARE
  existing_thread UUID;
  new_thread UUID;
BEGIN
  -- Check for existing thread between these users
  SELECT t.id INTO existing_thread
  FROM dm_threads t
  JOIN dm_members m1 ON t.id = m1.thread_id AND m1.user_id = user1
  JOIN dm_members m2 ON t.id = m2.thread_id AND m2.user_id = user2
  LIMIT 1;
  
  IF existing_thread IS NOT NULL THEN
    RETURN existing_thread;
  END IF;
  
  -- Create new thread
  INSERT INTO dm_threads (status, created_by) VALUES ('accepted', user1) RETURNING id INTO new_thread;
  
  -- Add both members
  INSERT INTO dm_members (thread_id, user_id) VALUES (new_thread, user1);
  INSERT INTO dm_members (thread_id, user_id) VALUES (new_thread, user2);
  
  RETURN new_thread;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: UPDATE GUILD MEMBER COUNT (TRIGGER)
-- ============================================
CREATE OR REPLACE FUNCTION update_guild_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE guilds SET member_count = member_count + 1 WHERE id = NEW.guild_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE guilds SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.guild_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for member count
DROP TRIGGER IF EXISTS trigger_update_guild_member_count ON guild_members;
CREATE TRIGGER trigger_update_guild_member_count
  AFTER INSERT OR DELETE ON guild_members
  FOR EACH ROW EXECUTE FUNCTION update_guild_member_count();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON guild_members(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_user_id ON guild_members(user_id);
CREATE INDEX IF NOT EXISTS idx_guild_messages_created_at ON guild_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dm_messages_created_at ON dm_messages(created_at DESC);
