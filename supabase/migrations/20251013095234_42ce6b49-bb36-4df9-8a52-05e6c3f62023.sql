-- Create RLS policy to allow users to mark messages as read in their conversations
CREATE POLICY "Users can update read_at in their conversations"
ON public.messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.seller_id = auth.uid() OR conversations.buyer_id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.seller_id = auth.uid() OR conversations.buyer_id = auth.uid())
  )
);