

# Plan: Gestion de imagenes API con reemplazo limpio

## Resumen

Dos cambios precisos sobre el plan original aprobado, sin modificar nada mas.

## Cambio 1: Migracion de base de datos

Anadir columna `source` a `vehicle_images` **sin valor por defecto**:

```text
ALTER TABLE vehicle_images ADD COLUMN source text;
```

Las imagenes existentes quedaran con `source = NULL`. Solo las imagenes insertadas desde la sincronizacion API recibiran `source = 'api'`.

## Cambio 2: Modificar `processImages` en la edge function

En `supabase/functions/api-sync-vehicles/index.ts`, funcion `processImages` (linea 472):

**Paso nuevo antes de insertar** (sin tocar storage):

```text
DELETE FROM vehicle_images
WHERE vehicle_id = vehicleId AND source = 'api'
```

**Al insertar cada imagen**, anadir `source: 'api'` al objeto:

```text
await supabase.from('vehicle_images').insert({
  vehicle_id: vehicleId,
  image_url: publicUrl,
  display_order: i,
  is_primary: i === 0,
  source: 'api'        // <-- nuevo campo
});
```

**No se eliminan archivos del bucket de storage.** Solo registros en base de datos.

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| Nueva migracion SQL | `ALTER TABLE vehicle_images ADD COLUMN source text;` |
| `supabase/functions/api-sync-vehicles/index.ts` | Agregar DELETE previo y campo `source: 'api'` en insert |

## Lo que NO se toca

- Subida manual de imagenes
- Componentes de UI
- Bucket de storage (sin eliminar archivos fisicos)
- RLS policies de `vehicle_images`
- Ningun otro endpoint ni servicio

