

## Plan: Reemplazar columna "Intereses" por 3 columnas con checkmarks

Solo se modifica `src/pages/admin/Campaigns.tsx`. No se toca ningún otro archivo.

### Cambios

1. **En `individualRows`** (línea 106): en vez de `interests: e.interests.join(', ')`, calcular 3 booleanos basados en el contenido exacto del array `interests`:
   - `wantsBuy`: el array contiene un string con "comprar"/"buying"/"acheter"/"kaufen"/"køb"/"kopen"/"comprare"/"kupno"/"compra" (pero NO "vender"/"selling"/etc en el mismo string)
   - `wantsSell`: contiene un string con "vender"/"selling"/"vendre"/"verkaufen"/"salg"/"verkopen"/"vendere"/"sprzedaż" (pero NO "comprar"/etc)
   - `wantsBoth`: contiene un string con "/" (ej: "Comprar/Vender", "Buying/Selling")

2. **En el header** (líneas 213): reemplazar `<TableHead>Intereses</TableHead>` por 3 headers:
   - `🛒 Comprar`
   - `💰 Vender`
   - `🔄 Ambos`

3. **En las celdas** (línea 233): reemplazar la celda de intereses por 3 celdas con `✅` o vacío.

4. **Actualizar `colSpan`** de "Sin datos" de 10 a 12.

### Resultado visual

```text
... | 📧 Click | 🛒 Comprar | 💰 Vender | 🔄 Ambos
... |    ✅    |     ✅     |           |    
... |    ✅    |            |     ✅    |    ✅
```

Solo cambia la visualización en el panel admin. No se altera la base de datos, la edge function, ni el popup.

