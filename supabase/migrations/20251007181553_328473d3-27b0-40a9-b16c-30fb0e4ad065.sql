-- Add foreign key constraint to link vehicle_report_requests to profiles
ALTER TABLE vehicle_report_requests
ADD CONSTRAINT fk_vehicle_report_requests_user_id
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;