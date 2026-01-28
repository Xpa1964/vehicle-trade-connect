-- FASE 3: Crear función RPC para obtener estadísticas del dashboard en una sola query
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  vehicles_count INT;
  announcements_count INT;
  conversations_count INT;
  unread_messages_count INT;
BEGIN
  -- Obtener conteo de vehículos del usuario
  SELECT COUNT(*)
  INTO vehicles_count
  FROM vehicles
  WHERE user_id = user_uuid;

  -- Obtener conteo de anuncios del usuario
  SELECT COUNT(*)
  INTO announcements_count
  FROM announcements
  WHERE user_id = user_uuid;

  -- Obtener conteo de conversaciones del usuario
  SELECT COUNT(DISTINCT c.id)
  INTO conversations_count
  FROM conversations c
  WHERE c.user1_id = user_uuid OR c.user2_id = user_uuid;

  -- Obtener conteo de mensajes no leídos del usuario
  SELECT COUNT(*)
  INTO unread_messages_count
  FROM messages m
  INNER JOIN conversations c ON m.conversation_id = c.id
  WHERE (c.user1_id = user_uuid OR c.user2_id = user_uuid)
    AND m.sender_id != user_uuid
    AND m.read = false;

  -- Construir resultado JSON
  SELECT json_build_object(
    'vehicles', json_build_object('count', vehicles_count),
    'announcements', json_build_object('count', announcements_count),
    'conversations', json_build_object('count', conversations_count),
    'messages', json_build_object('count', unread_messages_count),
    'exchanges', json_build_object('count', 0)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;