
-- Add soft delete functionality to conversations table
ALTER TABLE conversations 
ADD COLUMN deleted_by_seller BOOLEAN DEFAULT FALSE,
ADD COLUMN deleted_by_buyer BOOLEAN DEFAULT FALSE,
ADD COLUMN seller_deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN buyer_deleted_at TIMESTAMP WITH TIME ZONE;

-- Create function to soft delete conversation for a specific user
CREATE OR REPLACE FUNCTION soft_delete_conversation(
  p_conversation_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conversation conversations;
BEGIN
  -- Get the conversation
  SELECT * INTO v_conversation 
  FROM conversations 
  WHERE id = p_conversation_id;
  
  -- Check if user has access to this conversation
  IF v_conversation.seller_id != p_user_id AND v_conversation.buyer_id != p_user_id THEN
    RETURN FALSE;
  END IF;
  
  -- Update deletion status based on user role
  IF v_conversation.seller_id = p_user_id THEN
    UPDATE conversations 
    SET deleted_by_seller = TRUE, seller_deleted_at = NOW()
    WHERE id = p_conversation_id;
  ELSIF v_conversation.buyer_id = p_user_id THEN
    UPDATE conversations 
    SET deleted_by_buyer = TRUE, buyer_deleted_at = NOW()
    WHERE id = p_conversation_id;
  END IF;
  
  RETURN TRUE;
END;
$$;
