-- Fix critical security vulnerability in announcements and announcement_attachments tables
-- Remove dangerous public access policies and implement proper authentication

-- Fix announcements table policies
-- Drop the dangerous public select policy
DROP POLICY "announcements_select_all" ON public.announcements;

-- Drop the overly permissive policy on announcement_attachments
DROP POLICY "allow_all" ON public.announcement_attachments;
DROP POLICY "attachments_select_all" ON public.announcement_attachments;

-- Create new secure policies for announcements table
-- Only authenticated users can view announcements (business networking platform)
CREATE POLICY "Authenticated users can view announcements" 
ON public.announcements 
FOR SELECT 
TO authenticated
USING (true);

-- Create new secure policies for announcement_attachments table
-- Only authenticated users can view announcement attachments
CREATE POLICY "Authenticated users can view announcement attachments" 
ON public.announcement_attachments 
FOR SELECT 
TO authenticated
USING (true);

-- Only authenticated users can create their own announcement attachments
CREATE POLICY "Authenticated users can create their own announcement attachments" 
ON public.announcement_attachments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only owners can update their announcement attachments
CREATE POLICY "Owners can update their announcement attachments" 
ON public.announcement_attachments 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Admin policy for announcements - admins can manage all announcements
CREATE POLICY "Admins can manage all announcements"
ON public.announcements
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'::app_role
  )
);

-- Admin policy for announcement attachments - admins can manage all attachments
CREATE POLICY "Admins can manage all announcement attachments"
ON public.announcement_attachments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'::app_role
  )
);