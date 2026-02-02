

# Plan de Rediseno: Panel de Control Premium (Actualizado)

## Resumen de Ajustes Solicitados

1. **Perfil**: Mantener pais y valoraciones (no simplificar en exceso)
2. **Messaging**: Icono mas prominente (aumentar tamano visual)
3. **Cards del Panel**: Anadida calculadora de comisiones y blog
4. **Duplicados**: Eliminar duplicacion de "Informe de vehiculos"
5. **Imagenes**: Reutilizar las mismas imagenes del Home en el Panel de Control

---

## Mapeo de Imagenes: Home Services a Dashboard

Las imagenes del Home se utilizaran directamente en el Panel de Control para mantener coherencia visual:

| Servicio Home (Registry ID) | Card Dashboard | Destino Registry ID |
|------------------------------|----------------|---------------------|
| `services.showroom` | Vehiculos | `dashboard.vehicles` |
| `services.auctions` | Subastas | `dashboard.auctions` |
| `services.exchanges` | Intercambios | `dashboard.exchanges` |
| `services.bulletin` | Tablon de Anuncios | `dashboard.bulletin` |
| `services.transport` | Transporte Expres | `dashboard.transport` |
| `services.inspection` | Informes de Vehiculos | `dashboard.reports` |
| `services.calculator` | Calculadora Importacion | `dashboard.import.calculator` |
| `services.blog` | Blog | `dashboard.blog` |
| (Nuevo) | Calculadora Comisiones | `dashboard.commission.calculator` |

---

## Estructura del Nuevo Dashboard

```text
+------------------------------------------------------------------+
|  [Logo] [Home] [Menu]                     [Metics] [Bell] [6]    |
+------------------------------------------------------------------+
|  [Vehiculos 256] [Auctions 12] [Exchanges 8] [Ads 19] [Messages] |
+------------------------------------------------------------------+
|  +-----------------------------------+   +----------------------+ |
|  |  [Avatar] Perfil Compacto         |   | [ICONO PROMINENTE]   | |
|  |  Simmons Autos | Dealer Premium   |   | Mensajeria           | |
|  |  [Bandera] Espana | 4.5 (12 val)  |   | 5 mensajes sin leer  | |
|  |  [Config] [Usuarios] [API]        |   | [Ir a Mensajes ->]   | |
|  +-----------------------------------+   +----------------------+ |
+------------------------------------------------------------------+
|  +---------------+  +---------------+  +------------+  +--------+ |
|  | Vehiculos     |  | Subastas      |  | Intercamb  |  | Tablon | |
|  | [Ver] [Pub]   |  | [Ir] [Pub]    |  | [Ver][Pub] |  | [Ver]  | |
|  +---------------+  +---------------+  +------------+  +--------+ |
|                                                                   |
|  +---------------+  +---------------+  +------------+  +--------+ |
|  | Transporte    |  | Informes Veh  |  | Calc Import|  | Calc C | |
|  | [Ver] [Sol]   |  | [Ver] [Sol]   |  | [Abrir]    |  |[Abrir] | |
|  +---------------+  +---------------+  +------------+  +--------+ |
|                                                                   |
|  +---------------+                                                |
|  | Blog          |                                                |
|  | [Ver] [Nuevo] |                                                |
|  +---------------+                                                |
+------------------------------------------------------------------+
```

---

## Fases de Implementacion

### FASE 1: StatsBar Horizontal

**Nuevo archivo**: `src/components/dashboard/StatsBar.tsx`

Barra horizontal con 5 estadisticas principales:
- Vehiculos (total publicados)
- Subastas (activas)
- Intercambios (activos)
- Anuncios (publicados)
- Mensajes (sin leer)

Cada stat card:
```typescript
<div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 min-w-[140px]">
  <div className="p-3 bg-primary/10 rounded-full">
    <Icon className="h-5 w-5 text-primary" />
  </div>
  <div>
    <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
</div>
```

Mobile: scroll horizontal con `overflow-x-auto scrollbar-hide`

---

### FASE 2: Profile Card Compacta (Con Pais y Valoraciones)

**Modificar**: `src/components/dashboard/DashboardProfile.tsx`

Reducir altura pero MANTENER:
- Avatar/Logo empresa
- Nombre empresa + Badge rol
- Pais con bandera
- Valoraciones (estrellas + numero)
- 3 botones inline: Configuracion, Usuarios, API

Layout horizontal compacto:
```typescript
<Card className="bg-card border-border/50">
  <CardContent className="p-4 flex items-center gap-4">
    {/* Columna: Avatar */}
    <Avatar className="h-16 w-16 border-2" />
    
    {/* Columna: Info */}
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">{companyName}</h3>
        <Badge variant="outline">{dealerType}</Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <FlagImage /> {country}
        </span>
        <span className="flex items-center gap-1">
          <StarRating rating={4.5} size={14} />
          <span>4.5 (12)</span>
        </span>
      </div>
    </div>
    
    {/* Columna: Botones */}
    <div className="flex gap-2">
      <Button size="sm" variant="ghost"><Settings size={16} /></Button>
      <Button size="sm" variant="ghost"><Users size={16} /></Button>
      <Button size="sm" variant="ghost"><Key size={16} /></Button>
    </div>
  </CardContent>
</Card>
```

---

### FASE 3: Messaging Card con Icono Prominente

**Modificar**: `src/components/dashboard/DashboardMessaging.tsx`

Icono grande y llamativo (60x60px minimo), con contador de mensajes sin leer:

```typescript
<Card className="bg-card border-border/50 h-full">
  <CardContent className="p-4 flex items-center justify-between h-full">
    <div className="flex items-center gap-4">
      {/* Icono prominente */}
      <div className="relative">
        <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        {/* Badge contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="font-semibold text-lg">Mensajeria</h3>
        <p className="text-sm text-muted-foreground">
          {unreadCount} mensajes sin leer
        </p>
      </div>
    </div>
    
    <Button className="gap-2">
      Ir a Mensajes
      <ArrowRight size={16} />
    </Button>
  </CardContent>
</Card>
```

---

### FASE 4: Service Cards con Imagen de Fondo

**Nuevo componente**: `src/components/dashboard/DashboardServiceCard.tsx`

Card con imagen de fondo completa, overlay gradiente y 2 botones de accion:

```typescript
interface DashboardServiceCardProps {
  imageId: string;
  title: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

const DashboardServiceCard: React.FC<DashboardServiceCardProps> = ({
  imageId,
  title,
  primaryAction,
  secondaryAction
}) => {
  const { src } = useStaticImage(imageId);
  
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 aspect-video">
      {/* Background Image */}
      <img 
        src={src} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Overlay Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Contenido */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        <div className="flex gap-2">
          <Link to={primaryAction.href}>
            <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30">
              {primaryAction.label}
            </Button>
          </Link>
          {secondaryAction && (
            <Link to={secondaryAction.href}>
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                {secondaryAction.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### FASE 5: Nuevo ControlPanel con Grid de 9 Cards

**Reestructurar**: `src/components/dashboard/ControlPanel.tsx`

Grid de 9 cards (4 columnas en desktop, adaptativo en mobile):

| Posicion | Card | Imagen Registry | Accion 1 | Accion 2 |
|----------|------|-----------------|----------|----------|
| 1 | Vehiculos | services.showroom | Ver vehiculos | Publicar |
| 2 | Subastas | services.auctions | Ir a subastas | Publicar |
| 3 | Intercambios | services.exchanges | Ver intercambios | Publicar |
| 4 | Tablon de Anuncios | services.bulletin | Ver anuncios | Publicar |
| 5 | Transporte Expres | services.transport | Ver transportes | Solicitar |
| 6 | Informes de Vehiculos | services.inspection | Ver informes | Solicitar |
| 7 | Calculadora Importacion | services.calculator | Abrir | - |
| 8 | Calculadora Comisiones | dashboard.commission.calculator | Abrir | - |
| 9 | Blog | services.blog | Ver blog | Nuevo post |

Estructura del grid:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {serviceCards.map((card) => (
    <DashboardServiceCard key={card.id} {...card} />
  ))}
</div>
```

---

### FASE 6: Nuevo Layout Principal

**Modificar**: `src/pages/DashboardMainPage.tsx`

Estructura reorganizada:
1. StatsBar (5 stats horizontal)
2. Fila Perfil (2/3) + Messaging (1/3)
3. Grid de Service Cards (4 columnas)

```typescript
return (
  <div className="min-h-screen bg-background w-full">
    <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6">
      {/* Stats Bar */}
      <StatsBar />
      
      {/* Profile + Messaging Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <DashboardProfile user={user} />
        </div>
        <div className="lg:col-span-1">
          <DashboardMessaging />
        </div>
      </div>
      
      {/* Service Cards Grid */}
      <ControlPanel />
    </div>
  </div>
);
```

---

### FASE 7: Responsive y Ajustes Finales

**Breakpoints**:
- **Desktop (lg+)**: Grid 4 columnas, Stats inline
- **Tablet (md)**: Grid 2 columnas
- **Mobile (sm)**: Grid 1 columna, Stats scroll horizontal

**Mobile optimizations**:
```typescript
// Stats Bar
<div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible">

// Service Cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## Archivos a Crear/Modificar

| Archivo | Accion |
|---------|--------|
| `src/components/dashboard/StatsBar.tsx` | **Crear** - Nueva barra de estadisticas |
| `src/components/dashboard/DashboardServiceCard.tsx` | **Crear** - Card con imagen de fondo |
| `src/components/dashboard/DashboardProfile.tsx` | **Modificar** - Compactar manteniendo pais/valoraciones |
| `src/components/dashboard/DashboardMessaging.tsx` | **Modificar** - Icono prominente + contador |
| `src/components/dashboard/ControlPanel.tsx` | **Reestructurar** - Grid de 9 service cards |
| `src/pages/DashboardMainPage.tsx` | **Modificar** - Nuevo layout con StatsBar |
| `src/components/dashboard/StatsSection.tsx` | **Deprecar** - Reemplazado por StatsBar |
| `src/components/dashboard/DashboardHeader.tsx` | **Deprecar** - Eliminado (sin imagen hero grande) |

---

## Imagenes Requeridas en Image Control Center

Para que las cards del dashboard funcionen correctamente, estas imagenes deben estar disponibles (muchas ya existen en `services.*`):

| Registry ID | Estado | Accion |
|-------------|--------|--------|
| services.showroom | Existente | Copiar a dashboard.vehicles si necesario |
| services.auctions | Existente | Copiar a dashboard.auctions si necesario |
| services.exchanges | Existente | Copiar a dashboard.exchanges si necesario |
| services.bulletin | Existente | Copiar a dashboard.bulletin si necesario |
| services.transport | Existente | Copiar a dashboard.transport si necesario |
| services.inspection | Existente | Copiar a dashboard.reports si necesario |
| services.calculator | Existente | Copiar a dashboard.import.calculator si necesario |
| services.blog | Existente | Copiar a dashboard.blog si necesario |
| dashboard.commission.calculator | Pendiente | Generar nueva o copiar de services.calculator |

El sistema de "Copiar de..." del Image Control Center permite reutilizar cualquier imagen existente en nuevos slots del registry.

---

## Resultado Esperado

Un panel de control con:
1. Barra de estadisticas prominente y horizontal
2. Perfil compacto con pais, bandera y valoraciones visibles
3. Card de mensajeria con icono grande y contador de no leidos
4. Grid visual de 9 servicios con imagenes de alta calidad
5. Acceso dual (ver + publicar/solicitar) para cada servicio
6. Imagenes consistentes con la seccion de servicios del Home
7. Totalmente responsive (mobile-first)
8. Estetica premium tipo dashboard automotriz profesional

