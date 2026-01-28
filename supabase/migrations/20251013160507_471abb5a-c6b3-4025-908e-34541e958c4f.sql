-- Función para obtener contactos de usuarios interesados en un vehículo
-- Solo devuelve usuarios que han iniciado conversaciones sobre el vehículo
-- Excluye al propietario del vehículo
CREATE OR REPLACE FUNCTION public.get_vehicle_interested_contacts(p_vehicle_id UUID)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  email TEXT,
  contact_phone TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner_id UUID;
BEGIN
  -- Obtener el ID del propietario del vehículo
  SELECT user_id INTO v_owner_id
  FROM vehicles
  WHERE id = p_vehicle_id;
  
  -- Retornar contactos de usuarios interesados (excluye al propietario)
  RETURN QUERY
  SELECT DISTINCT 
    p.id,
    COALESCE(p.full_name, 'Usuario sin nombre'),
    p.email,
    COALESCE(p.contact_phone, 'Sin teléfono')
  FROM conversations c
  JOIN profiles p ON (
    CASE 
      WHEN c.seller_id = v_owner_id THEN p.id = c.buyer_id
      WHEN c.buyer_id = v_owner_id THEN p.id = c.seller_id
      ELSE false
    END
  )
  WHERE c.vehicle_id = p_vehicle_id
    AND p.id != v_owner_id
    AND c.status = 'active';
END;
$$;