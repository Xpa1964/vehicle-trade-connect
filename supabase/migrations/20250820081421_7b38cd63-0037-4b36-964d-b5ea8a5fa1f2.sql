-- Ensure notification_history and notification_recipients tables have all needed columns
-- Add missing columns if they don't exist

-- Check and update notification_history table
ALTER TABLE public.notification_history 
ADD COLUMN IF NOT EXISTS template_id text,
ADD COLUMN IF NOT EXISTS created_by uuid,
ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone DEFAULT now();

-- Add recipient_details column as jsonb for tracking
ALTER TABLE public.notification_history 
ADD COLUMN IF NOT EXISTS recipient_details jsonb DEFAULT '{"total": 0, "sent": 0, "failed": 0, "pending": 0}'::jsonb;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notification_history_status ON public.notification_history(status);
CREATE INDEX IF NOT EXISTS idx_notification_history_created_at ON public.notification_history(created_at DESC);

-- Ensure RLS is enabled and policies are correct
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Admin can manage notification history" ON public.notification_history;

-- Create comprehensive admin policy
CREATE POLICY "Admins can manage notification history" 
ON public.notification_history 
FOR ALL 
USING (has_role('admin'::text))
WITH CHECK (has_role('admin'::text));

-- Add a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notification_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_notification_history_updated_at_trigger ON public.notification_history;
CREATE TRIGGER update_notification_history_updated_at_trigger
  BEFORE UPDATE ON public.notification_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notification_history_updated_at();