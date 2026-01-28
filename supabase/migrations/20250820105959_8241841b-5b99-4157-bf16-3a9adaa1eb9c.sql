-- Migrate existing notifications to create conversations for them
DO $$
DECLARE
    notification_record RECORD;
    v_conversation_id UUID;
    v_message_id UUID;
BEGIN
    -- Process all existing notifications that don't have corresponding conversations
    FOR notification_record IN 
        SELECT DISTINCT un.user_id, un.subject, un.content, un.type, un.created_at
        FROM user_notifications un
        WHERE NOT EXISTS (
            SELECT 1 FROM conversations c 
            WHERE c.buyer_id = un.user_id 
            AND c.is_admin_conversation = true 
            AND c.source_title = un.subject
        )
        AND un.created_at > '2025-08-19'::date  -- Only recent notifications
        ORDER BY un.created_at DESC
    LOOP
        -- Create conversation for this notification (seller_id is NULL for system notifications)
        INSERT INTO public.conversations (
            seller_id,
            buyer_id,
            is_admin_conversation,
            admin_sender_name,
            source_type,
            source_title,
            status,
            created_at,
            updated_at
        ) VALUES (
            NULL,             -- NULL seller_id for system notifications
            notification_record.user_id,
            true,
            'Sistema KONTACT',
            'system_notification',
            notification_record.subject,
            'active',
            notification_record.created_at,
            notification_record.created_at
        )
        RETURNING id INTO v_conversation_id;
        
        -- Create the message (sender_id is NULL for system messages)
        INSERT INTO public.messages (
            conversation_id,
            sender_id,
            content,
            original_language,
            created_at
        ) VALUES (
            v_conversation_id,
            NULL,             -- NULL sender_id for system messages
            notification_record.content,
            'es',
            notification_record.created_at
        );
        
    END LOOP;
END $$;