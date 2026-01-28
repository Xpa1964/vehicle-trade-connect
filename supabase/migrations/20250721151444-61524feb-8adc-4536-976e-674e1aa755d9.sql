
-- Agregar columna email a la tabla profiles
ALTER TABLE public.profiles 
ADD COLUMN email text;

-- Actualizar los emails existentes desde auth.users
UPDATE public.profiles 
SET email = auth_users.email
FROM auth.users 
WHERE profiles.id = auth_users.id;

-- Hacer que el email sea requerido para nuevos registros
ALTER TABLE public.profiles 
ALTER COLUMN email SET NOT NULL;

-- Crear un trigger para mantener sincronizado el email cuando se actualice en auth.users
CREATE OR REPLACE FUNCTION sync_profile_email()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles 
  SET email = NEW.email, updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar el trigger
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION sync_profile_email();
