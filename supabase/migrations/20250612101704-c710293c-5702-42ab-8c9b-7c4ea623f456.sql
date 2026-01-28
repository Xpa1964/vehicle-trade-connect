
-- Crear el perfil faltante para el usuario que está causando el error "Perfil no encontrado"
INSERT INTO public.profiles (
  id,
  full_name,
  company_name,
  country,
  business_type,
  trader_type,
  created_at,
  updated_at,
  registration_date,
  total_operations,
  operations_breakdown,
  show_contact_details,
  show_location_details,
  show_business_stats
) VALUES (
  'cf3d54fe-ca8a-4bb1-aecc-0df1a128e432',
  'Usuario',
  'Empresa',
  'España',
  'other',
  'buyer_seller',
  NOW(),
  NOW(),
  NOW(),
  0,
  '{"buys": 0, "sells": 0, "exchanges": 0}'::jsonb,
  true,
  false,
  true
)
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Verificar si hay otros usuarios con vehículos pero sin perfil y crearlos
INSERT INTO public.profiles (
  id,
  full_name,
  company_name,
  country,
  business_type,
  trader_type,
  created_at,
  updated_at,
  registration_date,
  total_operations,
  operations_breakdown,
  show_contact_details,
  show_location_details,
  show_business_stats
)
SELECT DISTINCT 
  v.user_id,
  'Usuario',
  'Empresa',
  'España',
  'other',
  'buyer_seller',
  NOW(),
  NOW(),
  NOW(),
  0,
  '{"buys": 0, "sells": 0, "exchanges": 0}'::jsonb,
  true,
  false,
  true
FROM public.vehicles v
LEFT JOIN public.profiles p ON v.user_id = p.id
WHERE v.user_id IS NOT NULL 
  AND p.id IS NULL
ON CONFLICT (id) DO NOTHING;
