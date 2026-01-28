-- First, let's drop all possible existing announcement policies with various names
DROP POLICY IF EXISTS "Users can create their own announcements" ON public.announcements;
DROP POLICY IF EXISTS "Users can delete their own announcements" ON public.announcements; 
DROP POLICY IF EXISTS "Users can update their own announcements" ON public.announcements;
DROP POLICY IF EXISTS "Users can view all announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow viewing all announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow users to create their own announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow users to update their own announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow users to delete their own announcements" ON public.announcements;

-- Ensure user_id column is NOT NULL for proper RLS enforcement
ALTER TABLE public.announcements ALTER COLUMN user_id SET NOT NULL;

-- Create clean, optimized RLS policies with unique names

-- Allow everyone to view all announcements
CREATE POLICY "announcements_select_all" 
ON public.announcements 
FOR SELECT 
USING (true);

-- Allow authenticated users to create announcements with their user_id
CREATE POLICY "announcements_insert_own" 
ON public.announcements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own announcements
CREATE POLICY "announcements_update_own" 
ON public.announcements 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete only their own announcements
CREATE POLICY "announcements_delete_own" 
ON public.announcements 
FOR DELETE 
USING (auth.uid() = user_id);