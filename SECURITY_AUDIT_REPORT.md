# 🔒 REPORTE DE AUDITORÍA DE SEGURIDAD
**Fecha:** 2025-10-26  
**Proyecto:** KONTACT VO  
**Scope:** Paso 1-2 - Análisis de Security Definer Views y Políticas RLS

---

## 📊 RESUMEN EJECUTIVO

| Métrica | Cantidad | Severidad |
|---------|----------|-----------|
| **Total Issues** | 63 | ⚠️ |
| **Security Definer Views** | 1 | 🔴 ERROR |
| **Function Search Path Issues** | 2 | ⚠️ WARN |
| **Anonymous Access Policies** | 57 | ⚠️ WARN |
| **Extension in Public Schema** | 1 | ⚠️ WARN |
| **Leaked Password Protection** | 1 | ⚠️ WARN |
| **Postgres Version Outdated** | 1 | ⚠️ WARN |

---

## 🔴 ISSUE 1: SECURITY DEFINER VIEW (CRÍTICO)

**Nivel:** ERROR  
**Descripción:** Se detectó una view definida con `SECURITY DEFINER`. Esta configuración hace que la view ejecute con los permisos del creador en lugar del usuario que consulta, lo cual puede resultar en escalación de privilegios.

**Referencia:** [Documentación Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view)

**Acción Requerida:**
1. Identificar la view específica (requiere consulta adicional)
2. Evaluar si realmente necesita `SECURITY DEFINER`
3. Reemplazar con función `SECURITY DEFINER` bien documentada o eliminar el flag

**Prioridad:** 🔴 P0 - Crítica

---

## ⚠️ ISSUE 2-3: FUNCTION SEARCH PATH MUTABLE

**Nivel:** WARN  
**Descripción:** Se detectaron 2 funciones donde el parámetro `search_path` no está configurado. Esto puede permitir ataques de inyección de esquema.

**Referencia:** [Documentación Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)

**Funciones Afectadas:** (Requiere identificación específica)

**Acción Requerida:**
```sql
-- Agregar SET search_path a todas las funciones SECURITY DEFINER
ALTER FUNCTION function_name() SET search_path = public;
```

**Prioridad:** 🟡 P1 - Alta

---

## ⚠️ ISSUE 4: EXTENSION IN PUBLIC SCHEMA

**Nivel:** WARN  
**Descripción:** Se detectó una extensión instalada en el esquema `public`, lo cual puede causar conflictos de naming y vulnerabilidades.

**Referencia:** [Documentación Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public)

**Acción Requerida:**
```sql
-- Mover extensión a esquema dedicado
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION extension_name SET SCHEMA extensions;
```

**Prioridad:** 🟢 P2 - Media

---

## 🚨 ISSUE 5-61: ANONYMOUS ACCESS POLICIES (57 TABLAS)

**Nivel:** WARN  
**Descripción:** Se detectaron 57 tablas con políticas RLS que permiten acceso al rol `public` (anónimo). Esto representa el **90% de los issues de seguridad**.

### 📋 CATEGORIZACIÓN DE POLÍTICAS

#### 🔴 **CRÍTICAS - Requieren acción inmediata (12 tablas)**

| # | Tabla | Políticas Problemáticas | Riesgo | Acción |
|---|-------|-------------------------|---------|--------|
| 1 | `admin_bulk_messages` | "Admin users can view bulk messages" | 🔴 Alto | Eliminar acceso público completamente |
| 2 | `admin_config` | "Only admins can manage admin config" | 🔴 Alto | Eliminar acceso público completamente |
| 3 | `user_roles` | "Users can read their own roles", "Prevent admin self-modification" | 🔴 Alto | Restringir a `authenticated` |
| 4 | `notification_recipients` | "Admin can manage notification recipients" | 🔴 Alto | Restringir a `authenticated` admin |
| 5 | `notification_templates` | "Admin can manage notification templates" | 🔴 Alto | Restringir a `authenticated` admin |
| 6 | `notification_history` | "Admins can manage notification history" | 🔴 Alto | Restringir a `authenticated` admin |
| 7 | `api_key_requests` | "Users can view their own requests" | 🔴 Alto | Restringir a `authenticated` |
| 8 | `api_sync_logs` | "Users can view their own sync logs" | 🔴 Alto | Restringir a `authenticated` |
| 9 | `partner_api_keys` | "Users can view their own API keys" | 🔴 Alto | Restringir a `authenticated` |
| 10 | `auction_audit_log` | "Only admins can view all audit logs" | 🔴 Alto | Restringir a `authenticated` admin |
| 11 | `performance_metrics` | "Only admins can view performance metrics" | 🔴 Alto | Restringir a `authenticated` admin |
| 12 | `optimization_log` | "Only admins can view optimization log" | 🔴 Alto | Restringir a `authenticated` admin |

**Impacto:** Usuario anónimo puede potencialmente ver o manipular datos administrativos sensibles.

---

#### 🟡 **MODERADAS - Requieren revisión (25 tablas)**

| # | Tabla | Políticas | Riesgo | Acción Sugerida |
|---|-------|-----------|---------|-----------------|
| 13 | `profiles` | "Users can view profiles with direct interactions" | 🟡 Medio | Revisar lógica, restringir a `authenticated` |
| 14 | `conversations` | "Users can view conversations they are part of" | 🟡 Medio | Restringir a `authenticated` |
| 15 | `messages` | "Users can view messages for conversations" | 🟡 Medio | Restringir a `authenticated` |
| 16 | `auctions` | "Authenticated users can view auctions" | 🟡 Medio | Política dice "authenticated" pero aplica a `public` |
| 17 | `bids` | "Bidders can view their own bids" | 🟡 Medio | Restringir a `authenticated` |
| 18 | `dispute_cases` | "Users can view disputes they are involved in" | 🟡 Medio | Restringir a `authenticated` |
| 19 | `dispute_messages` | "Users can view messages of their disputes" | 🟡 Medio | Restringir a `authenticated` |
| 20 | `dispute_evidence` | "Users can view evidence of their disputes" | 🟡 Medio | Restringir a `authenticated` |
| 21 | `dispute_authorization_documents` | "Users can view authorization documents" | 🟡 Medio | Restringir a `authenticated` |
| 22 | `exchanges` | "Users can view exchanges they're involved in" | 🟡 Medio | Restringir a `authenticated` |
| 23 | `transactions` | "Users can view transactions they're involved in" | 🟡 Medio | Restringir a `authenticated` |
| 24 | `user_notifications` | "Users can view their own notifications" | 🟡 Medio | Restringir a `authenticated` |
| 25 | `user_vehicle_visits` | "Users can view their own visits" | 🟡 Medio | Restringir a `authenticated` |
| 26 | `vehicle_damages` | "Users can view damages of their vehicles" | 🟡 Medio | Restringir a `authenticated` |
| 27 | `vehicle_damage_images` | "Users can view damage images" | 🟡 Medio | Restringir a `authenticated` |
| 28 | `vehicle_documents` | "Users can view documents for accessible vehicles" | 🟡 Medio | Revisar criterio "accessible" |
| 29 | `vehicle_images` | "Authenticated users can view available vehicle images" | 🟡 Medio | Política dice "authenticated" pero aplica a `public` |
| 30 | `vehicle_information` | "Users can view vehicle info for vehicles involved" | 🟡 Medio | Restringir a `authenticated` |
| 31 | `vehicle_metadata` | "Users can view their own vehicle metadata" | 🟡 Medio | Restringir a `authenticated` |
| 32 | `vehicle_report_deliveries` | "Users can view deliveries for their requests" | 🟡 Medio | Restringir a `authenticated` |
| 33 | `vehicle_report_payments` | "Users can view their own payments" | 🟡 Medio | Restringir a `authenticated` |
| 34 | `vehicle_report_requests` | "Users can view their own report requests" | 🟡 Medio | Restringir a `authenticated` |
| 35 | `transport_quotes` | "Users can view their own transport quotes" | 🟡 Medio | Restringir a `authenticated` |
| 36 | `transport_quote_responses` | "Users can view responses to their quotes" | 🟡 Medio | Restringir a `authenticated` |
| 37 | `announcement_attachments` | "Authenticated users can view attachments" | 🟡 Medio | Política dice "authenticated" pero aplica a `public` |

**Impacto:** Usuario anónimo puede acceder a datos que conceptualmente requieren autenticación.

---

#### 🟢 **BAJAS - Pueden justificarse (20 tablas)**

| # | Tabla | Políticas | Justificación Posible | Acción Recomendada |
|---|-------|-----------|----------------------|---------------------|
| 38 | `announcements` | "Authenticated users can view announcements" | Contenido público | Revisar si realmente debe ser público |
| 39 | `auction_policies` | "Everyone can view auction policies" | Políticas públicas | ✅ Justificable - Documentar |
| 40 | `blog_posts` | "Anyone can view published blog posts" | Contenido público | ✅ Justificable - Documentar |
| 41 | `equipment_categories` | "Allow public read access" | Catálogo público | ✅ Justificable - Documentar |
| 42 | `equipment_items` | "Allow public read access" | Catálogo público | ✅ Justificable - Documentar |
| 43 | `ratings` | "Anyone can view ratings" | Reputación pública | ✅ Justificable - Documentar |
| 44 | `vehicles` | "Users can view all vehicles" | Catálogo público | ✅ Justificable - Documentar (SELECT only) |
| 45 | `vehicle_equipment` | "Allow public read access" | Información pública | ✅ Justificable - Documentar |
| 46 | `dispute_system_config` | "Authenticated users can view system config" | Config pública | Revisar si debe ser público |
| 47 | `translation_cache` | "Allow read access for all authenticated" | Cache público | Revisar necesidad |
| 48 | `recommendation_cache` | "Users can view their own recommendations" | Sistema de recomendaciones | Restringir a `authenticated` |
| 49 | `registration_requests` | "Admins can manage registration requests" | Permite INSERT de anon | ⚠️ REVISAR - ¿Realmente debe permitir anon INSERT? |
| 50-57 | `storage.objects` (varias políticas) | Múltiples políticas de lectura pública | Archivos públicos | ✅ Parcialmente justificable - Revisar cada caso |

---

### 🎯 **POLÍTICAS ESPECÍFICAS CON PROBLEMAS LÓGICOS**

#### 🚨 **Políticas que dicen "authenticated" pero aplican a `public`**

**Problema:** Muchas políticas tienen nombres como "Authenticated users can..." pero están asignadas al rol `public`, lo cual permite acceso anónimo.

**Tablas afectadas:**
- `announcements` - "Authenticated users can view announcements"
- `announcement_attachments` - "Authenticated users can view announcement attachments"
- `auctions` - "Authenticated users can view auctions"
- `vehicle_images` - "Authenticated users can view available vehicle images"
- `dispute_system_config` - "Authenticated users can view system config"

**Acción Requerida:**
```sql
-- Ejemplo de corrección para auctions
DROP POLICY "Authenticated users can view auctions" ON public.auctions;
CREATE POLICY "Authenticated users can view auctions" ON public.auctions
FOR SELECT TO authenticated  -- ← Cambiar de 'public' a 'authenticated'
USING (true);
```

---

#### 🚨 **Políticas con `with_check:true` en INSERT público**

**Problema:** Varias políticas permiten que **cualquiera** (incluso anónimos) inserte datos con `with_check:true`.

**Tablas afectadas:**
- `auction_audit_log` - "System can create audit logs" - `with_check:true`
- `auction_notifications` - "System can create notifications" - `with_check:true`
- `performance_metrics` - "System can insert performance metrics" - `with_check:true`
- `optimization_log` - "System can create optimization log" - `with_check:true`
- `recommendation_cache` - "System can manage recommendation cache" - `with_check:true`

**Acción Requerida:**
```sql
-- Estas políticas deben restringirse a un role específico del sistema
-- Opción 1: Usar service_role en backend
-- Opción 2: Crear función SECURITY DEFINER controlada
-- Opción 3: Restringir a authenticated con validación adicional

-- Ejemplo:
DROP POLICY "System can create audit logs" ON public.auction_audit_log;
-- No crear nueva política pública - usar service_role desde backend
```

---

#### 🚨 **CRON Jobs con acceso público**

**Tablas afectadas:**
- `cron.job` - "cron_job_policy" - Acceso a `public`
- `cron.job_run_details` - "cron_job_run_details_policy" - Acceso a `public`

**Acción Requerida:**
```sql
-- Los CRON jobs NO deben tener políticas RLS públicas
-- Deben ejecutarse con service_role desde Supabase
DROP POLICY "cron_job_policy" ON cron.job;
DROP POLICY "cron_job_run_details_policy" ON cron.job_run_details;
```

---

## ⚠️ ISSUE 62: LEAKED PASSWORD PROTECTION DISABLED

**Nivel:** WARN  
**Descripción:** La protección contra contraseñas filtradas está deshabilitada en el sistema de autenticación.

**Referencia:** [Password Security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

**Acción Requerida:**
1. Habilitar "Leaked password protection" en Auth Settings de Supabase
2. Configurar strength requirements mínimos

**Prioridad:** 🟡 P1 - Alta

---

## ⚠️ ISSUE 63: POSTGRES VERSION OUTDATED

**Nivel:** WARN  
**Descripción:** La versión actual de Postgres tiene parches de seguridad disponibles.

**Referencia:** [Platform Upgrading](https://supabase.com/docs/guides/platform/upgrading)

**Acción Requerida:**
1. Programar ventana de mantenimiento
2. Actualizar Postgres a la última versión estable
3. Probar aplicación post-upgrade

**Prioridad:** 🟢 P2 - Media (pero urgente)

---

## 📋 DESGLOSE COMPLETO DE POLÍTICAS POR TABLA

### **Tablas con acceso público (rol: `public`)**

<details>
<summary>Ver lista completa de 103 políticas (Click para expandir)</summary>

#### ADMIN TABLES (12 políticas críticas)
1. **admin_bulk_messages** (2 políticas)
   - ❌ INSERT: "Admin users can create bulk messages" - `with_check:(auth.uid() = admin_user_id)`
   - ❌ SELECT: "Admin users can view bulk messages" - `qual:(auth.uid() = admin_user_id)`

2. **admin_config** (1 política)
   - ❌ ALL: "Only admins can manage admin config" - Usa EXISTS con user_roles

3. **announcement_attachments** (4 políticas)
   - ❌ ALL: "Admins can manage all announcement attachments"
   - ⚠️ SELECT: "Authenticated users can view announcement attachments" (nombre engañoso)
   - ⚠️ UPDATE: "Owners can update their announcement attachments"
   - ⚠️ DELETE: "attachments_delete_owner"

4. **announcements** (4 políticas)
   - ❌ ALL: "Admins can manage all announcements"
   - ⚠️ SELECT: "Authenticated users can view announcements" (nombre engañoso)
   - ⚠️ DELETE: "announcements_delete_owner"
   - ⚠️ UPDATE: "announcements_update_owner"

5. **api_key_requests** (4 políticas)
   - ❌ SELECT: "Admins can view all requests"
   - ❌ SELECT: "Users can view their own requests"
   - ❌ INSERT: "Users can create requests"
   - ❌ UPDATE: "Admins can update requests"

6. **api_sync_logs** (2 políticas)
   - ❌ SELECT: "Admins can view all sync logs"
   - ❌ SELECT: "Users can view their own sync logs"

7. **auction_audit_log** (2 políticas)
   - ❌ SELECT: "Only admins can view all audit logs"
   - 🚨 INSERT: "System can create audit logs" - `with_check:true` ← PELIGROSO

8. **auction_notifications** (3 políticas)
   - ⚠️ SELECT: "Users can view their own notifications"
   - ⚠️ UPDATE: "Users can update their own notifications"
   - 🚨 INSERT: "System can create notifications" - `with_check:true`

9. **auction_policies** (2 políticas)
   - ✅ SELECT: "Everyone can view auction policies" - `qual:true` (JUSTIFICABLE)
   - ❌ ALL: "Only admins can manage auction policies"

10. **auctions** (2 políticas)
    - ❌ ALL: "Auction creators can manage their auctions"
    - ⚠️ SELECT: "Authenticated users can view auctions" (rol público, nombre engañoso)

... (continúa para todas las 57 tablas)

</details>

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### **FASE 1: CORRECCIONES CRÍTICAS (P0) - 1-2 días**

#### Migración 1: Eliminar acceso anónimo a tablas administrativas
```sql
-- ADMIN TABLES - Revocar acceso público completamente
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

-- Recrear políticas restringidas a 'authenticated'
DROP POLICY IF EXISTS "Admin users can view bulk messages" ON public.admin_bulk_messages;
CREATE POLICY "Authenticated admins only - view bulk messages" 
ON public.admin_bulk_messages
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = admin_user_id);

DROP POLICY IF EXISTS "Admin users can create bulk messages" ON public.admin_bulk_messages;
CREATE POLICY "Authenticated admins only - create bulk messages" 
ON public.admin_bulk_messages
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = admin_user_id);

-- Repetir para todas las tablas críticas...
```

#### Migración 2: Eliminar políticas "System can..." con `with_check:true`
```sql
-- Estas políticas son PELIGROSAS - cualquiera puede insertar
DROP POLICY "System can create audit logs" ON public.auction_audit_log;
DROP POLICY "System can create notifications" ON public.auction_notifications;
DROP POLICY "System can insert performance metrics" ON public.performance_metrics;
DROP POLICY "System can create optimization log" ON public.optimization_log;
DROP POLICY "System can manage recommendation cache" ON public.recommendation_cache;

-- NO crear nuevas políticas públicas
-- Usar service_role desde edge functions o backend
```

#### Migración 3: Eliminar CRON policies públicas
```sql
DROP POLICY "cron_job_policy" ON cron.job;
DROP POLICY "cron_job_run_details_policy" ON cron.job_run_details;
-- CRON debe ejecutarse con service_role
```

---

### **FASE 2: CORRECCIONES MODERADAS (P1) - 2-3 días**

#### Migración 4: Corregir políticas "authenticated" con rol público
```sql
-- Auctions
DROP POLICY "Authenticated users can view auctions" ON public.auctions;
CREATE POLICY "Authenticated users can view auctions" ON public.auctions
FOR SELECT TO authenticated  -- ← Cambio de 'public' a 'authenticated'
USING (true);

-- Announcements
DROP POLICY "Authenticated users can view announcements" ON public.announcements;
CREATE POLICY "Authenticated users can view announcements" ON public.announcements
FOR SELECT TO authenticated
USING (true);

-- Announcement Attachments
DROP POLICY "Authenticated users can view announcement attachments" ON public.announcement_attachments;
CREATE POLICY "Authenticated users can view announcement attachments" ON public.announcement_attachments
FOR SELECT TO authenticated
USING (true);

-- Vehicle Images
DROP POLICY "Authenticated users can view available vehicle images" ON public.vehicle_images;
CREATE POLICY "Authenticated users can view available vehicle images" ON public.vehicle_images
FOR SELECT TO authenticated
USING (true);

-- Dispute System Config
DROP POLICY "Authenticated users can view system config" ON public.dispute_system_config;
CREATE POLICY "Authenticated users can view system config" ON public.dispute_system_config
FOR SELECT TO authenticated
USING (true);

-- Repetir para todas las políticas con este problema...
```

#### Migración 5: Restringir acceso a datos personales
```sql
-- Profiles - Solo authenticated pueden ver perfiles
REVOKE SELECT ON public.profiles FROM anon, public;
GRANT SELECT ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "Users can view profiles with direct interactions" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles with interactions" ON public.profiles
FOR SELECT TO authenticated
USING (
  auth.uid() = id OR  -- Own profile
  has_role(auth.uid(), 'admin'::app_role) OR  -- Admins
  EXISTS (  -- Has exchanged vehicles
    SELECT 1 FROM exchanges e
    WHERE (e.initiator_id = auth.uid() AND e.target_vehicle_id IN (
      SELECT id FROM vehicles WHERE user_id = profiles.id
    ))
  )
);

-- Conversations - Solo authenticated
REVOKE ALL ON public.conversations FROM anon, public;
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;

DROP POLICY IF EXISTS "Users can view conversations they are part of" ON public.conversations;
CREATE POLICY "Authenticated users can view their conversations" ON public.conversations
FOR SELECT TO authenticated
USING ((auth.uid() = seller_id) OR (auth.uid() = buyer_id));

-- Messages - Solo authenticated
REVOKE ALL ON public.messages FROM anon, public;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;

-- Repetir para: disputes, transactions, user_notifications, etc.
```

---

### **FASE 3: DOCUMENTAR EXCEPCIONES (P2) - 1 día**

Crear archivo `SECURITY_EXCEPTIONS.md`:
```markdown
## Políticas RLS con Acceso Público Justificado

### 1. Contenido Público de Lectura

#### blog_posts (SELECT)
- **Política:** "Anyone can view published blog posts"
- **Justificación:** Contenido del blog es público por diseño
- **Condición:** `status = 'published'`
- **Riesgo:** Bajo - Solo lectura de contenido publicado

#### auction_policies (SELECT)
- **Política:** "Everyone can view auction policies"
- **Justificación:** Términos y condiciones públicos
- **Condición:** Sin filtro (todo público)
- **Riesgo:** Bajo - Información legal debe ser accesible

#### vehicles (SELECT)
- **Política:** "Users can view all vehicles"
- **Justificación:** Catálogo público de vehículos disponibles
- **Condición:** Ninguna (por revisar - sugerir filtrar por status='available')
- **Riesgo:** Medio - Expone todos los vehículos, incluso privados

#### equipment_categories, equipment_items (SELECT)
- **Política:** "Allow public read access"
- **Justificación:** Catálogo de equipamiento público
- **Condición:** Sin filtro
- **Riesgo:** Bajo - Datos de referencia

### 2. Archivos Públicos en Storage

#### storage.objects (SELECT)
- **Políticas:** Múltiples políticas de lectura pública
- **Justificación:** Imágenes de vehículos, logos, attachments públicos
- **Buckets afectados:** 
  - vehicle-images
  - company_logos
  - announcement_attachments
- **Riesgo:** Medio - Si bucket contiene archivos privados, se exponen

**Acción Requerida:** Revisar cada bucket individualmente y segregar archivos públicos de privados.

### 3. Registration Requests (INSERT anon)

#### registration_requests (INSERT)
- **Política:** "Allow public to insert registration requests with email check"
- **Justificación:** Formulario de registro debe ser accesible antes de login
- **Condición:** `(email IS NOT NULL) AND (email <> '')`
- **Riesgo:** Alto - Puede usarse para spam, DDoS

**Medidas de Mitigación:**
- Agregar rate limiting
- Implementar CAPTCHA
- Validar formato de email
- Agregar honeypot field
```

---

### **FASE 4: SEGURIDAD ADICIONAL (P2-P3) - 1-2 días**

#### Migración 6: Corregir Functions sin search_path
```sql
-- Identificar funciones sin SET search_path
SELECT 
  n.nspname as schema,
  p.proname as function_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prosecdef = true  -- SECURITY DEFINER
  AND NOT EXISTS (
    SELECT 1 FROM pg_proc_config pc
    WHERE pc.oid = p.oid
      AND pc.setconfig @> ARRAY['search_path']
  );

-- Agregar search_path a todas las funciones SECURITY DEFINER
ALTER FUNCTION has_role(uuid, app_role) SET search_path = public;
ALTER FUNCTION generate_case_number() SET search_path = public;
-- ... repetir para todas las funciones identificadas
```

#### Migración 7: Mover extensión del esquema public
```sql
-- Identificar extensión en public
SELECT * FROM pg_extension WHERE extname NOT IN ('plpgsql');

-- Mover a esquema dedicado
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION <extension_name> SET SCHEMA extensions;
```

#### Migración 8: Habilitar Leaked Password Protection
```bash
# Desde Supabase Dashboard:
# 1. Ir a Authentication > Settings
# 2. Habilitar "Leaked password protection"
# 3. Configurar "Minimum password strength": Strong
```

#### Migración 9: Actualizar Postgres
```bash
# Desde Supabase Dashboard:
# 1. Ir a Database > Settings
# 2. Ver versión actual y patches disponibles
# 3. Programar upgrade durante ventana de mantenimiento
# 4. Hacer backup antes de actualizar
```

---

## 📊 MÉTRICAS DE ÉXITO

### Antes de Correcciones
- ❌ Security Definer Views: 1
- ❌ Anonymous Access Policies: 57 tablas (103 políticas)
- ❌ Function Search Path Issues: 2
- ❌ Extension in Public: 1
- ❌ Leaked Password Protection: Disabled
- ❌ Postgres: Outdated

### Después de Correcciones (Esperado)
- ✅ Security Definer Views: 0
- ✅ Anonymous Access Policies: ~10-15 justificadas (documentadas)
- ✅ Function Search Path Issues: 0
- ✅ Extension in Public: 0
- ✅ Leaked Password Protection: Enabled
- ✅ Postgres: Updated

### Reducción de Issues
- **Antes:** 63 issues
- **Después:** ~15-20 issues (solo excepciones justificadas)
- **Reducción:** ~70% de issues eliminados

---

## ⚠️ ADVERTENCIAS IMPORTANTES

### 1. **Breaking Changes**
Las correcciones propuestas son **BREAKING CHANGES** que afectarán:
- 🔴 Formularios de registro (si dependen de políticas anónimas)
- 🔴 Páginas públicas que consultan datos (vehicles, blog_posts)
- 🔴 API endpoints públicos
- 🔴 Integraciones externas

**Acción Requerida ANTES de aplicar:**
1. ✅ Auditar TODAS las páginas públicas de la app
2. ✅ Identificar qué funcionalidades requieren acceso anónimo
3. ✅ Probar en ambiente staging primero
4. ✅ Comunicar cambios al equipo de frontend

### 2. **Testing Requerido**
Después de cada migración, probar:
- ✅ Login/Logout
- ✅ Registro de nuevos usuarios
- ✅ Páginas públicas (home, blog, catálogo)
- ✅ Dashboard admin
- ✅ API endpoints
- ✅ Formularios de contacto

### 3. **Rollback Plan**
Tener preparado:
- ✅ Backup de base de datos antes de cada migración
- ✅ Scripts de rollback para cada política modificada
- ✅ Monitoreo de errores 401/403 en producción

---

## 📝 SIGUIENTE PASO SUGERIDO

**Opción 1: Implementación gradual (RECOMENDADO)**
1. Aplicar FASE 1 (Críticas) en staging
2. Probar exhaustivamente
3. Mover a producción
4. Esperar 24-48h monitoreando
5. Continuar con FASE 2

**Opción 2: Implementación completa**
1. Aplicar todas las fases en staging
2. Testing completo (1-2 semanas)
3. Mover todo a producción de una vez

---

## 🤝 ¿CONTINUAR CON PASO 3?

**Opciones disponibles:**

A) ✅ **Generar Migraciones SQL completas** - Crear archivos SQL listos para ejecutar
B) ✅ **Implementar FASE 1 primero** - Correcciones críticas inmediatas
C) ✅ **Auditar impacto en Frontend** - Identificar qué páginas se romperán
D) ✅ **Crear Scripts de Testing** - Automatizar verificación post-migración

---

**Auditoría completada. ¿Qué acción deseas tomar?**
