-- 6. Límite de tamaño del bucket (5 MiB) - Punto opcional del diagnóstico
-- Nota: El bucket ya es público, mantenerlo así según configuración actual

-- 7. Autenticación en Edge Function: Ya está configurado para usar JWT en config.toml

-- Verificar que todos los puntos están aplicados
SELECT 
  'Política RLS bucket' as item,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload announcement files'
  ) THEN '✅ Aplicado' ELSE '❌ Falta' END as status
UNION ALL
SELECT 
  'user_id NOT NULL' as item,
  CASE WHEN NOT attnotnull THEN '❌ Falta' ELSE '✅ Aplicado' END as status
FROM pg_attribute 
WHERE attrelid = 'public.announcements'::regclass 
AND attname = 'user_id'
UNION ALL
SELECT 
  'Constraint URL válida' as item,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_attachment_url'
  ) THEN '✅ Aplicado' ELSE '❌ Falta' END as status
UNION ALL
SELECT 
  'Índice user_id' as item,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_announcements_user_id'
  ) THEN '✅ Aplicado' ELSE '❌ Falta' END as status
UNION ALL
SELECT 
  'Trigger borrado archivo' as item,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'delete_announcement_file_trigger'
  ) THEN '✅ Aplicado' ELSE '❌ Falta' END as status;