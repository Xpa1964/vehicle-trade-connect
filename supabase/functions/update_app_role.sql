
-- Update app_role enum to include all needed roles
DO $$
BEGIN
    -- Check if the enum already has these values
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'moderator' AND 
                  enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
        -- Add needed values to the enum
        ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'moderator';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'support' AND 
                  enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
        ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'support';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'content_manager' AND 
                  enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
        ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'content_manager';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'analyst' AND 
                  enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
        ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'analyst';
    END IF;
    
    -- Add other roles as needed
END
$$;
