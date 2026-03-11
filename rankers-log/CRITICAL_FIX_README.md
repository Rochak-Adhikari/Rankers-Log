# 🚨 CRITICAL FIX FOR FOREIGN KEY ERROR

## Problem
`Failed to create post: insert or update on table "posts" violates foreign key constraint "posts_user_id_fkey"`

This error occurs because the user's profile doesn't exist in the `profiles` table when they try to create a post.

## Root Cause
The Supabase trigger `handle_new_user()` that should automatically create profiles on signup is either:
1. Not installed in your database
2. Not firing correctly
3. Failing silently

## Solution Applied

### 1. Application-Level Fixes (DONE ✅)

**Updated Files:**
- `src/hooks/useAuth.jsx` - Added profile creation fallback in `signUp()` and `signIn()`
- `src/components/PostCreatorModal.jsx` - Added profile check before creating posts

**What These Do:**
- Check if profile exists before any operation
- Automatically create profile if missing
- Prevent foreign key constraint errors

### 2. Database-Level Fix (YOU MUST DO THIS)

**CRITICAL: Run this SQL in Supabase SQL Editor NOW:**

```sql
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the profile auto-creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', 'Player'),
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaWmABVJXA2jsgAaK0-A6KfaQdF1oWID-5yztCv3l5U4qlYJDSTECr6S60s6aBycW6BghIvBQ1xOa8-DhAwvTEzDPpjRcZd0K45p4r0ZfOwdKum9Qnyac1EEnvjyeO_Kq60P6BMi4UkW9vs35XyjWPzLq4wVuhV3rWwCt6UUEUAj6mnAT-RhULGMZ8cxGGp7Uc_F5TTib0U2w_QW5cFL4wkdzQUMu-AH7iLWkIVuNlTrz5B5RRSt_BDGQakh-x3VtiqhU72W8jV3j'
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix existing users without profiles
INSERT INTO public.profiles (id, username, display_name, avatar_url)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'username', 'user_' || substr(au.id::text, 1, 8)),
  COALESCE(au.raw_user_meta_data->>'display_name', au.raw_user_meta_data->>'username', 'Player'),
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaWmABVJXA2jsgAaK0-A6KfaQdF1oWID-5yztCv3l5U4qlYJDSTECr6S60s6aBycW6BghIvBQ1xOa8-DhAwvTEzDPpjRcZd0K45p4r0ZfOwdKum9Qnyac1EEnvjyeO_Kq60P6BMi4UkW9vs35XyjWPzLq4wVuhV3rWwCt6UUEUAj6mnAT-RhULGMZ8cxGGp7Uc_F5TTib0U2w_QW5cFL4wkdzQUMu-AH7iLWkIVuNlTrz5B5RRSt_BDGQakh-x3VtiqhU72W8jV3j'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
```

### 3. Verify the Fix

After running the SQL above:

1. **Check if trigger exists:**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. **Check if your profile exists:**
```sql
SELECT id, username, display_name FROM profiles WHERE id = auth.uid();
```

3. **Test post creation** - Should work now!

## Why This Happened

The `complete_schema_v2.sql` file includes the trigger, but:
- You may not have run it yet
- Or it was run but the trigger didn't install correctly
- Or RLS policies are blocking the trigger

## Next Steps

1. ✅ Code changes are already applied
2. ⚠️ **RUN THE SQL ABOVE** in Supabase SQL Editor
3. ✅ Refresh your app and try creating a post
4. ✅ It should work!

## If Still Not Working

Run this to manually create your profile:
```sql
INSERT INTO public.profiles (id, username, display_name, avatar_url)
VALUES (
  auth.uid(),
  'your_username',
  'Your Display Name',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaWmABVJXA2jsgAaK0-A6KfaQdF1oWID-5yztCv3l5U4qlYJDSTECr6S60s6aBycW6BghIvBQ1xOa8-DhAwvTEzDPpjRcZd0K45p4r0ZfOwdKum9Qnyac1EEnvjyeO_Kq60P6BMi4UkW9vs35XyjWPzLq4wVuhV3rWwCt6UUEUAj6mnAT-RhULGMZ8cxGGp7Uc_F5TTib0U2w_QW5cFL4wkdzQUMu-AH7iLWkIVuNlTrz5B5RRSt_BDGQakh-x3VtiqhU72W8jV3j'
);
```

Replace `'your_username'` and `'Your Display Name'` with your actual values.
