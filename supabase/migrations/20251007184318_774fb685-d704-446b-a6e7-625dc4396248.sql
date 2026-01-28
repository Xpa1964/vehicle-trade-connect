-- Fase 1: Agregar nuevos campos para el flujo de presupuestos premium

-- Agregar campos para presupuestos personalizados
ALTER TABLE vehicle_report_requests 
ADD COLUMN IF NOT EXISTS budget_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS budget_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS budget_notes TEXT,
ADD COLUMN IF NOT EXISTS budget_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget_accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget_rejected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- Agregar campos para cálculo de presupuesto
ALTER TABLE vehicle_report_requests
ADD COLUMN IF NOT EXISTS vehicle_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS urgency_level TEXT DEFAULT 'normal' CHECK (urgency_level IN ('normal', 'urgent', 'very_urgent'));

-- Agregar campo para categoría de archivos en deliveries
ALTER TABLE vehicle_report_deliveries
ADD COLUMN IF NOT EXISTS file_category TEXT DEFAULT 'main_report' CHECK (file_category IN ('main_report', 'audio', 'photo', 'supplementary'));

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_report_requests_status ON vehicle_report_requests(status);
CREATE INDEX IF NOT EXISTS idx_report_deliveries_category ON vehicle_report_deliveries(file_category);