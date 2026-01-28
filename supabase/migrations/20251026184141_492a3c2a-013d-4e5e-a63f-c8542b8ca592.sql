-- ============================================================================
-- MIGRATION: FASE 1 - Correcciones Críticas de Seguridad (P0) - FINAL
-- Fecha: 2025-10-26
-- Descripción: Elimina acceso anónimo a tablas admin y políticas peligrosas
-- ============================================================================

-- ============================================================================
-- PARTE 1: REVOCAR ACCESO PÚBLICO A TABLAS ADMINISTRATIVAS
-- ============================================================================

-- Revocar permisos de roles anon y public en tablas críticas
REVOKE ALL ON public.admin_bulk_messages FROM anon, public;
REVOKE ALL ON public.admin_config FROM anon, public;
REVOKE ALL ON public.user_roles FROM anon, public;
REVOKE ALL ON public.notification_history FROM anon, public;
REVOKE ALL ON public.notification_recipients FROM anon, public;
REVOKE ALL ON public.notification_templates FROM anon, public;
REVOKE ALL ON public.api_key_requests FROM anon, public;
REVOKE ALL ON public.api_sync_logs FROM anon, public;
REVOKE ALL ON public.partner_api_keys FROM anon, public;
REVOKE ALL ON public.auction_audit_log FROM anon, public;
REVOKE ALL ON public.performance_metrics FROM anon, public;
REVOKE ALL ON public.performance_alerts FROM anon, public;
REVOKE ALL ON public.performance_optimizations FROM anon, public;
REVOKE ALL ON public.optimization_log FROM anon, public;
REVOKE ALL ON public.premium_report_batches FROM anon, public;

-- ============================================================================
-- PARTE 2: RECREAR POLÍTICAS CON ROL 'authenticated'
-- ============================================================================

-- ADMIN BULK MESSAGES
DROP POLICY IF EXISTS "Admin users can view bulk messages" ON public.admin_bulk_messages;
DROP POLICY IF EXISTS "Admin users can create bulk messages" ON public.admin_bulk_messages;

CREATE POLICY "Authenticated admins can view bulk messages" 
ON public.admin_bulk_messages
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = admin_user_id);

CREATE POLICY "Authenticated admins can create bulk messages" 
ON public.admin_bulk_messages
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = admin_user_id);

-- ADMIN CONFIG
DROP POLICY IF EXISTS "Only admins can manage admin config" ON public.admin_config;

CREATE POLICY "Authenticated admins only - manage config" 
ON public.admin_config
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- USER ROLES
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Prevent admin self-modification" ON public.user_roles;

CREATE POLICY "Authenticated users can read their own roles" 
ON public.user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated admins can manage roles" 
ON public.user_roles
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins cannot modify themselves" 
ON public.user_roles
FOR UPDATE TO authenticated
USING (NOT (user_id = auth.uid() AND role = 'admin'::app_role))
WITH CHECK (NOT (user_id = auth.uid() AND role = 'admin'::app_role));

-- NOTIFICATION HISTORY
DROP POLICY IF EXISTS "Admins can manage notification history" ON public.notification_history;

CREATE POLICY "Authenticated admins manage notification history" 
ON public.notification_history
FOR ALL TO authenticated
USING (has_role('admin'))
WITH CHECK (has_role('admin'));

-- NOTIFICATION RECIPIENTS
DROP POLICY IF EXISTS "Admin can manage notification recipients" ON public.notification_recipients;

CREATE POLICY "Authenticated admins manage notification recipients" 
ON public.notification_recipients
FOR ALL TO authenticated
USING (has_role('admin'))
WITH CHECK (has_role('admin'));

-- NOTIFICATION TEMPLATES
DROP POLICY IF EXISTS "Admin can manage notification templates" ON public.notification_templates;

CREATE POLICY "Authenticated admins manage notification templates" 
ON public.notification_templates
FOR ALL TO authenticated
USING (has_role('admin'))
WITH CHECK (has_role('admin'));

-- API KEY REQUESTS
DROP POLICY IF EXISTS "Users can view their own requests" ON public.api_key_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.api_key_requests;
DROP POLICY IF EXISTS "Users can create requests" ON public.api_key_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.api_key_requests;

CREATE POLICY "Authenticated users view their own API key requests" 
ON public.api_key_requests
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated admins view all API key requests" 
ON public.api_key_requests
FOR SELECT TO authenticated
USING (has_role('admin'));

CREATE POLICY "Authenticated users create API key requests" 
ON public.api_key_requests
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated admins update API key requests" 
ON public.api_key_requests
FOR UPDATE TO authenticated
USING (has_role('admin'))
WITH CHECK (has_role('admin'));

-- API SYNC LOGS
DROP POLICY IF EXISTS "Users can view their own sync logs" ON public.api_sync_logs;
DROP POLICY IF EXISTS "Admins can view all sync logs" ON public.api_sync_logs;

CREATE POLICY "Authenticated users view their own sync logs" 
ON public.api_sync_logs
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated admins view all sync logs" 
ON public.api_sync_logs
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- PARTNER API KEYS
DROP POLICY IF EXISTS "Users can view their own API keys" ON public.partner_api_keys;
DROP POLICY IF EXISTS "Users can create their own API keys" ON public.partner_api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON public.partner_api_keys;
DROP POLICY IF EXISTS "Users can delete their own API keys" ON public.partner_api_keys;
DROP POLICY IF EXISTS "Admins can view all API keys" ON public.partner_api_keys;

CREATE POLICY "Authenticated users view their own API keys" 
ON public.partner_api_keys
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users create their own API keys" 
ON public.partner_api_keys
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users update their own API keys" 
ON public.partner_api_keys
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users delete their own API keys" 
ON public.partner_api_keys
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated admins view all API keys" 
ON public.partner_api_keys
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- AUCTION AUDIT LOG
DROP POLICY IF EXISTS "Only admins can view all audit logs" ON public.auction_audit_log;

CREATE POLICY "Authenticated admins view audit logs" 
ON public.auction_audit_log
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- PERFORMANCE METRICS
DROP POLICY IF EXISTS "Only admins can view performance metrics" ON public.performance_metrics;

CREATE POLICY "Authenticated admins view performance metrics" 
ON public.performance_metrics
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- PERFORMANCE ALERTS
DROP POLICY IF EXISTS "Only admins can manage performance alerts" ON public.performance_alerts;

CREATE POLICY "Authenticated admins manage performance alerts" 
ON public.performance_alerts
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- PERFORMANCE OPTIMIZATIONS
DROP POLICY IF EXISTS "Admins can view optimizations" ON public.performance_optimizations;
DROP POLICY IF EXISTS "Admins can manage optimizations" ON public.performance_optimizations;

CREATE POLICY "Authenticated admins view optimizations" 
ON public.performance_optimizations
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated admins manage optimizations" 
ON public.performance_optimizations
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- OPTIMIZATION LOG
DROP POLICY IF EXISTS "Only admins can view optimization log" ON public.optimization_log;

CREATE POLICY "Authenticated admins view optimization log" 
ON public.optimization_log
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- PREMIUM REPORT BATCHES
DROP POLICY IF EXISTS "Admins can manage premium batches" ON public.premium_report_batches;

CREATE POLICY "Authenticated admins manage premium batches" 
ON public.premium_report_batches
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- PARTE 3: ELIMINAR POLÍTICAS PELIGROSAS "System can..."
-- ============================================================================

-- Estas políticas permiten INSERT anónimo ilimitado - PELIGROSAS
-- Las eliminamos completamente. Backend debe usar service_role.

DROP POLICY IF EXISTS "System can create audit logs" ON public.auction_audit_log;
DROP POLICY IF EXISTS "System can create notifications" ON public.auction_notifications;
DROP POLICY IF EXISTS "System can insert performance metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "System can create optimization log" ON public.optimization_log;
DROP POLICY IF EXISTS "System can manage recommendation cache" ON public.recommendation_cache;

-- ============================================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ============================================================================

-- Verificar que no queden políticas con rol 'public' o 'anon' en tablas críticas
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN (
      'admin_bulk_messages', 'admin_config', 'user_roles',
      'notification_history', 'notification_recipients', 'notification_templates',
      'api_key_requests', 'api_sync_logs', 'partner_api_keys',
      'auction_audit_log', 'performance_metrics', 'performance_alerts',
      'performance_optimizations', 'optimization_log', 'premium_report_batches'
    )
    AND ('public' = ANY(roles) OR 'anon' = ANY(roles));
  
  IF policy_count > 0 THEN
    RAISE WARNING 'Still % policies with public/anon access on critical tables', policy_count;
  ELSE
    RAISE NOTICE 'SUCCESS: All critical tables now require authentication';
  END IF;
END $$;