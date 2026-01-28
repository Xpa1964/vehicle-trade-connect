-- Create conversations for existing notifications using the admin user
DO $$
DECLARE
    notification_record RECORD;
    v_conversation_id UUID;
    v_message_id UUID;
    v_admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT user_id INTO v_admin_user_id 
    FROM user_roles 
    WHERE role = 'admin'::app_role 
    LIMIT 1;
    
    -- Only proceed if we have an admin user
    IF v_admin_user_id IS NOT NULL THEN
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
            -- Create conversation for this notification
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
                v_admin_user_id,
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
            
            -- Create the message
            INSERT INTO public.messages (
                conversation_id,
                sender_id,
                content,
                original_language,
                created_at
            ) VALUES (
                v_conversation_id,
                v_admin_user_id,
                notification_record.content,
                'es',
                notification_record.created_at
            );
            
        END LOOP;
    END IF;
END $$;