-- Clean up script for RepOrder users
-- Run this in your Supabase SQL Editor to start fresh

-- Delete all users from the custom users table
DELETE FROM public.users;

-- Delete auth users (this will cascade to remove all user data)
-- Note: Run this in the Supabase SQL Editor
-- You may need to delete from auth.users directly in the dashboard
SELECT auth.uid() as current_user_id; -- Shows your current user ID

-- To delete all auth users except your own, you can run:
-- DELETE FROM auth.users WHERE id != auth.uid();

-- Or to delete ALL users (including yourself - be careful!):
-- DELETE FROM auth.users;

-- Reset any auto-increment sequences if needed
-- SELECT setval('users_id_seq', 1, false); 