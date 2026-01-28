-- Add new budget-related statuses to the report_request_status enum
ALTER TYPE report_request_status ADD VALUE IF NOT EXISTS 'budgeted';
ALTER TYPE report_request_status ADD VALUE IF NOT EXISTS 'budget_accepted';
ALTER TYPE report_request_status ADD VALUE IF NOT EXISTS 'budget_rejected';

-- Add new columns to vehicle_report_requests for budget management
ALTER TABLE vehicle_report_requests 
ADD COLUMN IF NOT EXISTS budget_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS budget_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS budget_notes TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget_accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget_rejected_at TIMESTAMP WITH TIME ZONE;