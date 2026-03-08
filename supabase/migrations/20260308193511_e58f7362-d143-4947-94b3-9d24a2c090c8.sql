-- Secure public profile lookup by either profile.id or profile.user_id
-- Returns only non-sensitive fields and respects privacy toggles for optional contact/location info.
CREATE OR REPLACE FUNCTION public.get_public_profile_by_identifier(p_identifier uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(profile_data)
  FROM (
    SELECT
      p.id,
      p.user_id,
      p.company_name,
      p.full_name,
      p.business_type,
      p.trader_type,
      p.country,
      p.city,
      p.company_logo,
      p.avatar_url,
      p.registration_date,
      p.created_at,
      p.updated_at,
      COALESCE(p.show_business_stats, false) AS show_business_stats,
      COALESCE(p.show_contact_details, false) AS show_contact_details,
      COALESCE(p.show_location_details, false) AS show_location_details,
      CASE
        WHEN COALESCE(p.show_business_stats, false) THEN p.total_operations
        ELSE NULL
      END AS total_operations,
      CASE
        WHEN COALESCE(p.show_business_stats, false) THEN p.operations_breakdown
        ELSE NULL
      END AS operations_breakdown,
      CASE
        WHEN COALESCE(p.show_contact_details, false) THEN p.email
        ELSE NULL
      END AS email,
      CASE
        WHEN COALESCE(p.show_contact_details, false) THEN p.contact_phone
        ELSE NULL
      END AS contact_phone,
      CASE
        WHEN COALESCE(p.show_location_details, false) THEN p.address
        ELSE NULL
      END AS address
    FROM public.profiles p
    WHERE p.id = p_identifier OR p.user_id = p_identifier
    LIMIT 1
  ) AS profile_data;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile_by_identifier(uuid) TO anon, authenticated;