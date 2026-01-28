-- Make sender_id nullable in messages table to allow system messages
ALTER TABLE public.messages ALTER COLUMN sender_id DROP NOT NULL;