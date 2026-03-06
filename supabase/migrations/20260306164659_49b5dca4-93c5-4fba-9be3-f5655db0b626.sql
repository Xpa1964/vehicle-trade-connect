-- A5: UPDATE policy for conversations - participants only, restricted columns
-- Uses a security definer function to validate only allowed columns are changed

CREATE OR REPLACE FUNCTION public.conversations_update_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent changing participants
  IF NEW.seller_id IS DISTINCT FROM OLD.seller_id THEN
    RAISE EXCEPTION 'Cannot change seller_id of a conversation';
  END IF;
  IF NEW.buyer_id IS DISTINCT FROM OLD.buyer_id THEN
    RAISE EXCEPTION 'Cannot change buyer_id of a conversation';
  END IF;
  -- Prevent changing vehicle_id
  IF NEW.vehicle_id IS DISTINCT FROM OLD.vehicle_id THEN
    RAISE EXCEPTION 'Cannot change vehicle_id of a conversation';
  END IF;
  -- Prevent changing source fields
  IF NEW.source_id IS DISTINCT FROM OLD.source_id THEN
    RAISE EXCEPTION 'Cannot change source_id of a conversation';
  END IF;
  IF NEW.source_type IS DISTINCT FROM OLD.source_type THEN
    RAISE EXCEPTION 'Cannot change source_type of a conversation';
  END IF;
  IF NEW.source_title IS DISTINCT FROM OLD.source_title THEN
    RAISE EXCEPTION 'Cannot change source_title of a conversation';
  END IF;
  IF NEW.is_admin_conversation IS DISTINCT FROM OLD.is_admin_conversation THEN
    RAISE EXCEPTION 'Cannot change is_admin_conversation';
  END IF;
  IF NEW.admin_sender_name IS DISTINCT FROM OLD.admin_sender_name THEN
    RAISE EXCEPTION 'Cannot change admin_sender_name';
  END IF;
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Cannot change created_at of a conversation';
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to enforce column restrictions
CREATE TRIGGER conversations_restrict_update
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.conversations_update_check();

-- Add UPDATE policy: only participants can update
CREATE POLICY "Participants can update conversations"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid() OR buyer_id = auth.uid())
  WITH CHECK (seller_id = auth.uid() OR buyer_id = auth.uid());