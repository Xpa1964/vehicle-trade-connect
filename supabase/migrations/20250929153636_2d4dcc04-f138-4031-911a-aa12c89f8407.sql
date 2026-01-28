-- Create performance monitoring tables
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  active_users INTEGER NOT NULL DEFAULT 0,
  active_queries INTEGER NOT NULL DEFAULT 0,
  realtime_channels INTEGER NOT NULL DEFAULT 0,
  average_response_time NUMERIC NOT NULL DEFAULT 0,
  db_queries_per_minute INTEGER NOT NULL DEFAULT 0,
  memory_usage NUMERIC NOT NULL DEFAULT 0,
  cpu_usage NUMERIC NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance alerts table
CREATE TABLE public.performance_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- 'yellow', 'red', 'critical'
  threshold_value INTEGER NOT NULL,
  current_value INTEGER NOT NULL,
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system optimization log
CREATE TABLE public.optimization_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  optimization_type TEXT NOT NULL, -- 'react_query', 'realtime', 'database'
  action TEXT NOT NULL, -- 'enable', 'disable', 'modify'
  configuration JSONB NOT NULL DEFAULT '{}',
  trigger_reason TEXT NOT NULL,
  user_count INTEGER NOT NULL,
  is_automatic BOOLEAN NOT NULL DEFAULT true,
  rollback_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rolled_back_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimization_log ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Only admins can view performance metrics" ON public.performance_metrics
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "System can insert performance metrics" ON public.performance_metrics
FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can manage performance alerts" ON public.performance_alerts
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Only admins can view optimization log" ON public.optimization_log
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "System can create optimization log" ON public.optimization_log
FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_performance_metrics_timestamp ON public.performance_metrics(timestamp DESC);
CREATE INDEX idx_performance_alerts_active ON public.performance_alerts(is_active, created_at);
CREATE INDEX idx_optimization_log_type ON public.optimization_log(optimization_type, created_at);

-- Create function to clean old metrics (keep only last 7 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_metrics()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.performance_metrics 
  WHERE created_at < (NOW() - INTERVAL '7 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;