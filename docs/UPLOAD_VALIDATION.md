# Upload Validation System

## Sistema Centralizado de Validación de Uploads

### Ubicación
`src/utils/uploadValidator.ts`

### Características

✅ **MIME Whitelist estricta** - Solo tipos permitidos explícitamente
✅ **Validación de coherencia MIME-extensión** - Previene ataques de renombrado
✅ **Límites de tamaño por categoría** - Evita uploads masivos
✅ **Límites de cantidad de archivos** - Control de batch uploads
✅ **Detección de archivos duplicados** - Advertencias automáticas
✅ **Validación multi-capa** - Extensión → MIME → Coherencia → Tamaño

## MIME Whitelists por Categoría

### Imágenes
```typescript
allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif']
maxSize: 10MB
maxFiles: 25
```

### Videos
```typescript
allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
extensions: ['mp4', 'webm', 'mov', 'avi']
maxSize: 100MB
maxFiles: 5
```

### Documentos
```typescript
allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ...]
extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv']
maxSize: 20MB
maxFiles: 10
```

### Audio
```typescript
allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']
extensions: ['mp3', 'wav', 'ogg', 'm4a']
maxSize: 50MB
maxFiles: 5
```

## Uso

### 1. Validar Imágenes (caso más común)

```typescript
import { imageUploadValidator } from '@/utils/uploadValidator';

const handleImageUpload = (files: FileList) => {
  const result = imageUploadValidator.validateFiles(files);
  
  if (!result.isValid) {
    result.errors.forEach(error => {
      toast.error(error);
    });
    return;
  }
  
  // Mostrar advertencias
  result.warnings.forEach(warning => {
    toast.warning(warning);
  });
  
  // Proceder con archivos válidos
  uploadToServer(result.validFiles);
};
```

### 2. Validar Videos

```typescript
import { videoUploadValidator } from '@/utils/uploadValidator';

const handleVideoUpload = (files: FileList) => {
  const result = videoUploadValidator.validateFiles(files);
  
  if (!result.isValid) {
    console.error('Validation failed:', result.errors);
    return;
  }
  
  processVideos(result.validFiles);
};
```

### 3. Validar Documentos

```typescript
import { documentUploadValidator } from '@/utils/uploadValidator';

const handleDocumentUpload = (files: FileList) => {
  const result = documentUploadValidator.validateFiles(files);
  
  if (!result.isValid) {
    showErrorModal(result.errors);
    return;
  }
  
  uploadDocuments(result.validFiles);
};
```

### 4. Validar Audio

```typescript
import { audioUploadValidator } from '@/utils/uploadValidator';

const handleAudioUpload = (file: File) => {
  const result = audioUploadValidator.validateFile(file);
  
  if (!result.isValid) {
    alert(result.errors.join('\n'));
    return;
  }
  
  processAudio(file);
};
```

### 5. Validador Personalizado

```typescript
import { UploadValidator } from '@/utils/uploadValidator';

const customValidator = new UploadValidator({
  category: 'mixed',
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
  maxFilesPerUpload: 10,
  allowedMimeTypes: ['image/png', 'application/pdf'],
  allowedExtensions: ['png', 'pdf']
});

const result = customValidator.validateFiles(files);
```

## Seguridad

### Ataques Prevenidos

#### 1. File Extension Spoofing
```
malware.exe.jpg ❌ BLOQUEADO
- Extensión: .jpg ✓
- MIME: application/x-msdownload ❌
- Coherencia MIME-extensión: FALLA
```

#### 2. MIME Type Forgery
```
virus.pdf (renombrado de .exe) ❌ BLOQUEADO
- Extensión: .pdf ✓
- MIME: application/x-msdownload ❌
- No está en whitelist
```

#### 3. Oversized Uploads
```
huge-image.png (50MB) ❌ BLOQUEADO
- Excede límite de 10MB para imágenes
```

#### 4. Batch Flooding
```
100 imágenes simultáneas ❌ BLOQUEADO
- Excede límite de 25 imágenes por upload
```

### Validación Multi-Capa

```
1. Extensión → Verifica .jpg, .png, etc.
2. MIME Type → Verifica image/jpeg, image/png
3. Coherencia → .jpg debe ser image/jpeg
4. Tamaño → < 10MB
5. Cantidad → < 25 archivos
```

## Testing

### Test Cases

```typescript
// Test 1: Archivo válido
const validFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
const result1 = imageUploadValidator.validateFile(validFile);
expect(result1.isValid).toBe(true);

// Test 2: MIME incorrecto
const invalidMime = new File(['content'], 'image.jpg', { type: 'application/exe' });
const result2 = imageUploadValidator.validateFile(invalidMime);
expect(result2.isValid).toBe(false);

// Test 3: Extensión incorrecta
const invalidExt = new File(['content'], 'image.exe', { type: 'image/jpeg' });
const result3 = imageUploadValidator.validateFile(invalidExt);
expect(result3.isValid).toBe(false);

// Test 4: Archivo muy grande
const oversized = new File([new ArrayBuffer(20 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
const result4 = imageUploadValidator.validateFile(oversized);
expect(result4.isValid).toBe(false);
```

## Integración con Componentes Existentes

### MultipleImageUpload.tsx
```typescript
import { imageUploadValidator } from '@/utils/uploadValidator';

const handleFileSelect = (files: FileList) => {
  const result = imageUploadValidator.validateFiles(files);
  
  if (!result.isValid) {
    result.errors.forEach(error => toast.error(error));
    return;
  }
  
  onImagesUpload(result.validFiles);
};
```

### FileInputs.tsx
```typescript
import { documentUploadValidator } from '@/utils/uploadValidator';

const handleDocumentUpload = (files: FileList) => {
  const result = documentUploadValidator.validateFiles(files);
  
  if (!result.isValid) {
    result.errors.forEach(error => toast.error(error));
    return;
  }
  
  processDocuments(result.validFiles);
};
```

## Migración desde imageValidation.ts

El nuevo sistema es compatible con `imageValidation.ts` pero proporciona:
- ✅ Validación MIME más estricta
- ✅ Coherencia extensión-MIME
- ✅ Soporte multi-categoría
- ✅ Mejor manejo de errores

**Recomendación:** Migrar gradualmente a `uploadValidator.ts` para nueva funcionalidad.

## Impacto Funcional

✅ **Mejora seguridad frontend**
✅ **Previene uploads maliciosos**
✅ **Mejor UX con mensajes claros**
❌ **Cero impacto en funcionalidad existente**

## Backend Validation

⚠️ **CRÍTICO:** Esta validación es solo frontend (primera línea de defensa).

**Siempre validar en backend:**
- Verificar MIME type real (magic bytes)
- Escanear virus/malware
- Validar dimensiones de imagen
- Sanitizar nombres de archivo

## Recursos

- [OWASP File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- [MIME Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
