-- Check if notification tables exist and create them if missing
-- This ensures the Supabase types will be properly generated

-- Create user_notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    notification_history_id UUID,
    created_at TIMESTAMP DEFAULT now()
);

-- Create notification_templates table if it doesn't exist  
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    variables TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create notification_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notification_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id TEXT,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    recipient_count INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    sent_at TIMESTAMP
);

-- Create notification_recipients table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notification_recipients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_history_id UUID,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT now(),
    sent_at TIMESTAMP
);

-- Enable RLS on notification tables
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.user_notifications;
CREATE POLICY "Users can view their own notifications" 
ON public.user_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.user_notifications;
CREATE POLICY "Users can update their own notifications" 
ON public.user_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage all user notifications" ON public.user_notifications;
CREATE POLICY "Admin can manage all user notifications" 
ON public.user_notifications 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create RLS policies for notification_templates
DROP POLICY IF EXISTS "Admin can manage notification templates" ON public.notification_templates;
CREATE POLICY "Admin can manage notification templates" 
ON public.notification_templates 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create RLS policies for notification_history
DROP POLICY IF EXISTS "Admin can manage notification history" ON public.notification_history;
CREATE POLICY "Admin can manage notification history" 
ON public.notification_history 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create RLS policies for notification_recipients
DROP POLICY IF EXISTS "Admin can manage notification recipients" ON public.notification_recipients;
CREATE POLICY "Admin can manage notification recipients" 
ON public.notification_recipients 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);