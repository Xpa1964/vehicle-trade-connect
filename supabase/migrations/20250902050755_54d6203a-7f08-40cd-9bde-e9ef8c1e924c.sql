-- Drop all existing RLS policies for announcements table
DROP POLICY IF EXISTS "Users can create their own announcements" ON public.announcements;
DROP POLICY IF EXISTS "Users can delete their own announcements" ON public.announcements;
DROP POLICY IF EXISTS "Users can update their own announcements" ON public.announcements;
DROP POLICY IF EXISTS "Users can view all announcements" ON public.announcements;

-- Ensure user_id column is NOT NULL for proper RLS enforcement
ALTER TABLE public.announcements ALTER COLUMN user_id SET NOT NULL;

-- Create clean, optimized RLS policies for announcements

-- Allow everyone to view all announcements
CREATE POLICY "Allow viewing all announcements" 
ON public.announcements 
FOR SELECT 
USING (true);

-- Allow authenticated users to create announcements with their user_id
CREATE POLICY "Allow users to create their own announcements" 
ON public.announcements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own announcements
CREATE POLICY "Allow users to update their own announcements" 
ON public.announcements 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete only their own announcements
CREATE POLICY "Allow users to delete their own announcements" 
ON public.announcements 
FOR DELETE 
USING (auth.uid() = user_id);