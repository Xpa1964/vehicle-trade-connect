-- Add email tracking columns to notification_history table
ALTER TABLE notification_history 
ADD COLUMN IF NOT EXISTS send_via_email boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_sent_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS email_failed_count integer DEFAULT 0;