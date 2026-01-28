-- Agregar columna email a la tabla profiles
ALTER TABLE public.profiles 
ADD COLUMN email text;

-- Actualizar los emails existentes desde auth.users
UPDATE public.profiles 
SET email = (
  SELECT email 
  FROM auth.users 
  WHERE auth.users.id = profiles.id
);

-- Hacer que el email sea requerido para nuevos registros
ALTER TABLE public.profiles 
ALTER COLUMN email SET NOT NULL;

-- Actualizar también la función de sincronización para nuevos usuarios
CREATE OR REPLACE FUNCTION public.create_profile_from_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Only proceed if the status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Get the user ID from the email (assuming user was already created)
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = NEW.email;
    
    -- If user exists, create/update their profile
    IF v_user_id IS NOT NULL THEN
      INSERT INTO public.profiles (
        id,
        company_name,
        full_name,
        contact_phone,
        country,
        business_type,
        trader_type,
        company_logo,
        email,
        created_at,
        updated_at,
        registration_date
      ) VALUES (
        v_user_id,
        NEW.company_name,
        NEW.contact_person,
        NEW.phone,
        NEW.country,
        NEW.business_type,
        NEW.trader_type,
        NEW.company_logo,
        NEW.email,
        NOW(),
        NOW(),
        NEW.created_at
      )
      ON CONFLICT (id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        full_name = EXCLUDED.full_name,
        contact_phone = EXCLUDED.contact_phone,
        country = EXCLUDED.country,
        business_type = EXCLUDED.business_type,
        trader_type = EXCLUDED.trader_type,
        company_logo = EXCLUDED.company_logo,
        email = EXCLUDED.email,
        updated_at = NOW();
        
      -- Log the automatic profile creation
      INSERT INTO public.activity_logs (
        user_id,
        action_type,
        entity_type,
        entity_id,
        details,
        severity
      ) VALUES (
        v_user_id,
        'auto_create_profile',
        'profile',
        v_user_id::text,
        jsonb_build_object(
          'source', 'registration_approval',
          'registration_id', NEW.id,
          'company_name', NEW.company_name
        ),
        'info'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;