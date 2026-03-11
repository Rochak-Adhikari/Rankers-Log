-- Migration: Social Systems Architecture Fix
-- Ensures proper comments, DMs, search, and avatar consistency

-- ============================================
-- COMMENTS SYSTEM FIX
-- ============================================

-- Ensure comments table has proper structure
ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Function to increment post comments count on new comment
CREATE OR REPLACE FUNCTION increment_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = COALESCE(comments_count, 0) + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement post comments count on delete
CREATE OR REPLACE FUNCTION decrement_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_comment_insert ON comments;
DROP TRIGGER IF EXISTS on_comment_delete ON comments;

-- Create triggers
CREATE TRIGGER on_comment_insert
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_comments_count();

CREATE TRIGGER on_comment_delete
  AFTER DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_post_comments_count();

-- Function to create notification on new comment
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_owner_id UUID;
BEGIN
  SELECT user_id INTO post_owner_id FROM posts WHERE id = NEW.post_id;
  
  -- Don't notify if commenting on own post
  IF post_owner_id IS NOT NULL AND post_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, type, actor_id, post_id, comment_id, message)
    VALUES (
      post_owner_id,
      'comment',
      NEW.user_id,
      NEW.post_id,
      NEW.id,
      'commented on your post'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_notify ON comments;
CREATE TRIGGER on_comment_notify
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_comment();

-- ============================================
-- COMMENT LIKES TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Function to update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_like_change ON comment_likes;
CREATE TRIGGER on_comment_like_change
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_likes_count();

-- RLS for comment_likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all comment likes" ON comment_likes;
CREATE POLICY "Users can view all comment likes" ON comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like comments" ON comment_likes;
CREATE POLICY "Users can like comments" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike their own likes" ON comment_likes;
CREATE POLICY "Users can unlike their own likes" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- DM PERMISSIONS BASED ON PRIVACY SETTINGS
-- ============================================

-- Function to check if user can send DM based on privacy settings
CREATE OR REPLACE FUNCTION can_send_dm(sender_id UUID, recipient_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  recipient_policy TEXT;
  is_following BOOLEAN;
  is_mutual BOOLEAN;
BEGIN
  -- Get recipient's DM policy
  SELECT COALESCE(privacy_settings->>'dm_policy', 'everyone') INTO recipient_policy
  FROM profiles WHERE id = recipient_id;
  
  -- Everyone can message
  IF recipient_policy = 'everyone' THEN
    RETURN TRUE;
  END IF;
  
  -- No one can message
  IF recipient_policy = 'no_one' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if sender follows recipient
  SELECT EXISTS(SELECT 1 FROM follows WHERE follower_id = sender_id AND following_id = recipient_id) INTO is_following;
  
  -- Followers only
  IF recipient_policy = 'followers' THEN
    -- Sender must be followed BY recipient (recipient follows sender)
    SELECT EXISTS(SELECT 1 FROM follows WHERE follower_id = recipient_id AND following_id = sender_id) INTO is_following;
    RETURN is_following;
  END IF;
  
  -- Mutuals only
  IF recipient_policy = 'mutuals' THEN
    SELECT EXISTS(
      SELECT 1 FROM follows f1 
      JOIN follows f2 ON f1.follower_id = f2.following_id AND f1.following_id = f2.follower_id
      WHERE f1.follower_id = sender_id AND f1.following_id = recipient_id
    ) INTO is_mutual;
    RETURN is_mutual;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create DM thread between two users
CREATE OR REPLACE FUNCTION get_or_create_dm_thread(user1 UUID, user2 UUID)
RETURNS UUID AS $$
DECLARE
  existing_thread_id UUID;
  new_thread_id UUID;
BEGIN
  -- Find existing thread between these two users
  SELECT dm.thread_id INTO existing_thread_id
  FROM dm_members dm
  WHERE dm.user_id = user1
  AND dm.thread_id IN (
    SELECT thread_id FROM dm_members WHERE user_id = user2
  )
  LIMIT 1;
  
  IF existing_thread_id IS NOT NULL THEN
    -- Update status to accepted if it was pending
    UPDATE dm_threads SET status = 'accepted' WHERE id = existing_thread_id AND status = 'pending';
    RETURN existing_thread_id;
  END IF;
  
  -- Create new thread
  INSERT INTO dm_threads (status, created_by) VALUES ('accepted', user1) RETURNING id INTO new_thread_id;
  
  -- Add both users as members
  INSERT INTO dm_members (thread_id, user_id) VALUES (new_thread_id, user1), (new_thread_id, user2);
  
  RETURN new_thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTIFICATIONS TABLE (ensure exists)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  message TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(user_id, read_at);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_thread_id ON dm_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_dm_members_user_id ON dm_members(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
