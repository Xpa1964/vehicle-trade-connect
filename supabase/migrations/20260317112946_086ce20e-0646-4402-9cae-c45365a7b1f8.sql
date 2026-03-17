CREATE UNIQUE INDEX IF NOT EXISTS one_primary_per_vehicle
ON vehicle_images(vehicle_id)
WHERE is_primary = true;

CREATE UNIQUE INDEX IF NOT EXISTS unique_vehicle_image_order
ON vehicle_images(vehicle_id, display_order);