

## Plan: Pantalla post-video con CTA "OK, me interesa" + envío de email

### Problema
Cuando el video de YouTube termina, aparece la interfaz nativa de YouTube (videos recomendados, etc.) — poco profesional.

### Solución
Usar el parámetro `rel=0` de YouTube para minimizar sugerencias, y **detectar el fin del video** mediante la YouTube IFrame API. Al terminar, **ocultar el iframe** y mostrar una pantalla de overlay dentro del mismo modal con:
- Fondo oscuro semi-transparente sobre el último frame
- Mensaje traducido en el idioma del video (ej: "¿Te interesa? ¡Contáctanos!")
- Botón grande "OK, me interesa"
- Al hacer click → abrir `mailto:info@kontactvo.com` con asunto pre-rellenado en el idioma del video

### Cambios técnicos

**1. `VideoPlayerModal.tsx`** — Añadir estado post-video
- Añadir parámetro `language` a las props del modal
- Cargar la YouTube IFrame API (`YT.Player`) para detectar el evento `onStateChange` → `YT.PlayerState.ENDED`
- Cuando el video termina: mostrar overlay con mensaje + botón CTA
- El iframe se mantiene (último frame visible) pero se superpone el overlay
- Añadir `rel=0&modestbranding=1` a la URL del embed para reducir branding YouTube
- Botón "OK, me interesa" → `window.location.href = 'mailto:info@kontactvo.com?subject=...'`
- Mensajes traducidos por idioma directamente en el componente (mapa estático, sin necesidad de claves i18n complejas)

**2. `AudioPresentationSection.tsx`** — Pasar idioma al modal
- Pasar la prop `language` al `VideoPlayerModal` para que sepa en qué idioma mostrar el mensaje post-video

**3. Traducciones** — Añadir claves para el CTA post-video
- `home.videoEndedMessage`: "¿Te interesa? ¡Contáctanos!" (en cada idioma)
- `home.videoInterestedButton`: "OK, me interesa" (en cada idioma)

### Archivos a modificar
| Archivo | Cambio |
|---------|--------|
| `VideoPlayerModal.tsx` | YouTube IFrame API + overlay post-video + mailto CTA |
| `AudioPresentationSection.tsx` | Pasar prop `language` al modal |
| Traducciones (es/en/fr/it/pt/de/nl/pl) | Añadir 2 claves nuevas |

### Nota sobre `mailto:`
Se usa `mailto:` porque es la forma más directa y no requiere infraestructura de email backend. El usuario hace click y se abre su cliente de email con el destinatario y asunto pre-rellenados.

