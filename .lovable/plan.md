

## Plan: Reemplazar botones de audio por videos YouTube embebidos

### Resumen
Eliminar los botones de audio circular y reemplazarlos por botones de **video** (icono Play) que abren un modal con el video de YouTube embebido directamente en la página. Solo 4 idiomas tendrán video activo ahora; el resto mostrará un mensaje "Próximamente".

### YouTube IDs extraídos
- ES: `OEF7aAISxF8`
- EN: `4MW9r-kb_Lw`
- FR: `Yjjo4qjHQrY`
- IT: `BIbIpsJCmHg`
- Resto (PT, DE, NL, PL, DK): `null` (próximamente)

### Cambios

**1. `VideoPlayerModal.tsx`** — Soporte YouTube iframe
- Detectar si la URL es de YouTube (contiene `youtube.com/embed`)
- Si es YouTube: renderizar `<iframe>` con `autoplay=1`, `allowFullScreen`
- Si no: mantener el `<video>` tag actual como fallback
- Eliminar botón "Pantalla Completa" (el iframe de YouTube ya lo incluye)

**2. `AudioPresentationSection.tsx`** — Reemplazar audio por video
- Eliminar `audioLinks`, `audioLabels`, `useAudioSession`, import de `Headphones`
- Crear mapa `videoIds` con los YouTube IDs por idioma
- Cambiar icono de `Headphones` a `Play` (lucide-react) en los botones circulares
- Al hacer click: si tiene videoId → abrir modal con URL `https://www.youtube.com/embed/{ID}?autoplay=1`; si no → toast "Próximamente"
- Título dinámico del modal según idioma (ej: "Presentación en Español")
- Actualizar textos/traducciones del slogan si es necesario (cambiar "Listen" por "Watch")

**3. Traducciones** — Actualizar claves
- `home.promoDescription`: cambiar referencia de "escuchar" a "ver" en es/en/fr/it
- Añadir `home.videoComingSoon` para el mensaje de próximamente

### Archivos a modificar
| Archivo | Acción |
|---------|--------|
| `src/components/home/VideoPlayerModal.tsx` | Añadir soporte iframe YouTube |
| `src/components/home/AudioPresentationSection.tsx` | Reemplazar audio por video |
| `src/translations/es-modules/home.ts` | Actualizar textos |
| `src/translations/en-modules/home.ts` | Actualizar textos |
| `src/translations/modules/home.ts` | Actualizar fallback EN |
| `src/translations/it-modules/home.ts` | Actualizar textos |
| `src/translations/fr-modules/home.ts` | Actualizar textos |

