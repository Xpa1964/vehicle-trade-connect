
/**
 * Elimina cualquier etiqueta HTML del texto, permitiendo solo saltos de línea.
 * Ideal para evitar XSS mostrando sólo texto plano.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  // Quita todo excepto saltos de línea y convierte <br> por saltos reales
  let clean = input.replace(/<br\s*\/?>/gi, '\n');
  // Elimina todas las etiquetas HTML
  clean = clean.replace(/<[^>]+>/g, '');
  // Evita código JS embebido y escapes raros (básico)
  clean = clean.replace(/javascript:/gi, '');
  return clean;
}
