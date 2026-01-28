export default {
  // API Management
  'api.management.title': 'Gestión de APIs',
  'api.management.subtitle': 'Administra las API keys de partners para sincronización automática de stock',
  
  // Stats
  'api.stats.totalKeys': 'Total de Keys',
  'api.stats.activeKeys': 'Keys Activas',
  'api.stats.totalUsers': 'Usuarios con API',
  'api.stats.totalRequests': 'Peticiones Totales',
  
  // Keys List
  'api.keysList.title': 'Lista de API Keys',
  'api.keysList.createNew': 'Crear Nueva API Key',
  'api.keysList.searchPlaceholder': 'Buscar por nombre, empresa o email...',
  'api.keysList.noResults': 'No se encontraron resultados',
  'api.keysList.empty': 'No hay API keys creadas todavía',
  
  // Status
  'api.status.active': 'Activa',
  'api.status.inactive': 'Inactiva',
  
  // Key Row
  'api.keyRow.requests': 'Peticiones',
  'api.keyRow.created': 'Creada',
  'api.keyRow.lastUsed': 'Última uso',
  'api.keyRow.confirmDelete': '¿Estás seguro de que deseas eliminar esta API key?',
  
  // Actions
  'api.actions.activate': 'Activar',
  'api.actions.deactivate': 'Desactivar',
  'api.actions.delete': 'Eliminar',
  'api.actions.updated': 'API key actualizada correctamente',
  'api.actions.deleted': 'API key eliminada correctamente',
  'api.actions.error': 'Error al procesar la acción',
  
  // Details
  'api.details.status': 'Estado',
  'api.details.requests': 'Peticiones',
  'api.details.rateLimit': 'Límite por hora',
  'api.details.created': 'Fecha de creación',
  'api.details.lastUsed': 'Último uso',
  'api.details.expires': 'Expira',
  'api.details.apiKey': 'API Key',
  'api.details.syncHistory': 'Historial de Sincronizaciones',
  'api.details.noHistory': 'No hay historial de sincronizaciones',
  
  // Card
  'api.card.title': 'Gestión API Keys',
  'api.card.description': 'Administra tus claves API para sincronización automática de vehículos',
  'api.card.activeKeys': 'Keys Activas',
  'api.card.pendingRequests': 'Solicitudes Pendientes',
  'api.card.subtitle': 'Gestiona tu integración API',
  'api.card.requestNew': 'Solicitar Nueva Key',
  'api.card.recentRequests': 'Solicitudes Recientes',
  'api.card.limitReached': 'Has alcanzado el límite máximo de 5 API keys',
  
  // Integration Section
  'api.integration.title': 'Integración API',
  'api.integration.status': 'Estado de APIs',
  'api.integration.requests': 'Solicitudes',
  'api.integration.description': 'Gestiona tus API keys para sincronización automática de stock',
  'api.integration.noRequests': 'No hay solicitudes aún',
  
  // Create
  'api.create.title': 'Crear Nueva API Key',
  'api.create.description': 'Genera una nueva API key para un partner o dealer',
  'api.create.selectUser': 'Seleccionar Usuario',
  'api.create.selectUserPlaceholder': 'Selecciona un usuario...',
  'api.create.loadingUsers': 'Cargando usuarios...',
  'api.create.noUsers': 'No hay usuarios disponibles',
  'api.create.keyName': 'Nombre de la API Key',
  'api.create.keyNamePlaceholder': 'Ej: API Principal - Dealer XYZ',
  'api.create.generate': 'Generar API Key',
  'api.create.creating': 'Generando...',
  'api.create.success': '¡API Key generada correctamente!',
  'api.create.copyWarning': 'IMPORTANTE: Copia esta clave ahora. No podrás verla de nuevo.',
  'api.create.generatedKey': 'Tu nueva API Key',
  'api.create.close': 'Cerrar',
  'api.create.fillAllFields': 'Por favor completa todos los campos',
  'api.create.copied': 'API Key copiada al portapapeles',
  'api.create.successMessage': 'API key creada correctamente',
  'api.create.errorMessage': 'Error al crear la API key',
  
  // Documentación
  'api.docs.title': 'Documentación de API',
  'api.docs.process': 'Proceso de Solicitud',
  'api.docs.format': 'Formato de Datos',
  'api.docs.integration': 'Integración Técnica',
  'api.docs.normalization': 'Normalización Multiidioma',
  
  // Proceso
  'api.docs.process.title': 'Proceso de Solicitud de API Key',
  'api.docs.process.step1': 'Paso 1: Solicitar API Key',
  'api.docs.process.step1.desc': 'Completa el formulario de solicitud indicando el nombre de la key y el motivo de la solicitud',
  'api.docs.process.step2': 'Paso 2: Revisión Administrativa',
  'api.docs.process.step2.desc': 'Un administrador revisará tu solicitud en un plazo de 24-48 horas laborables',
  'api.docs.process.step3': 'Paso 3: Aprobación',
  'api.docs.process.step3.desc': 'Recibirás una notificación por email y en tu panel con tu API Key aprobada',
  'api.docs.process.step4': 'Paso 4: Configuración',
  'api.docs.process.step4.desc': 'Configura tu DMS con la API Key y comienza la sincronización automática de vehículos',
  'api.docs.process.limits': 'Límites',
  'api.docs.process.limitsDesc': 'Puedes tener hasta 5 API Keys activas simultáneamente. Límite de 250 peticiones por hora por key.',
  
  // Formato
  'api.docs.format.title': 'Formato de Datos JSON',
  'api.docs.format.description': 'Estructura esperada para la sincronización de vehículos. Todos los campos deben estar en minúsculas y seguir el formato especificado.',
  'api.docs.format.required': 'Campos Obligatorios',
  'api.docs.format.optional': 'Campos Opcionales',
  'api.docs.format.examples': 'Ejemplos',
  
  // Integración
  'api.docs.integration.title': 'Guía de Integración Técnica',
  'api.docs.integration.endpoint': 'Endpoint',
  'api.docs.integration.method': 'Método HTTP',
  'api.docs.integration.headers': 'Headers Requeridos',
  'api.docs.integration.examples': 'Ejemplos de Código',
  'api.docs.integration.testing': 'Testing',
  'api.docs.integration.rateLimit': 'Rate Limit',
  'api.docs.integration.rateLimitDesc': '250 peticiones por hora por API Key. Si excedes este límite, recibirás un error 429 con el tiempo de espera.',
  
  // Normalización
  'api.docs.normalization.title': 'Normalización Multiidioma',
  'api.docs.normalization.description': 'KONTACT soporta 9 idiomas. Puedes enviar los valores en cualquiera de estos idiomas y serán normalizados automáticamente.',
  'api.docs.normalization.normalized': 'Valor Normalizado',
  'api.docs.normalization.requiredFields': 'Campos Obligatorios',
  'api.docs.normalization.optionalFields': 'Campos Opcionales',
  'api.docs.normalization.fuelTypes': 'Tipos de Combustible',
  'api.docs.normalization.transmissions': 'Tipos de Transmisión',
  'api.docs.normalization.bodyTypes': 'Tipos de Carrocería',
  'api.docs.normalization.statuses': 'Estados del Vehículo',
  'api.docs.normalization.ivaStatuses': 'Estados del IVA',
  'api.docs.normalization.transactionTypes': 'Tipos de Transacción',
  'api.docs.normalization.euroStandards': 'Estándares de Emisiones Euro',
  'api.docs.normalization.colors': 'Colores',
  'api.docs.normalization.conditions': 'Condición del Vehículo',
  'api.docs.normalization.vehicleTypes': 'Tipos de Vehículo',
  'api.docs.normalization.note': 'Esta tabla muestra SOLO los campos que requieren normalización multiidioma. Otros campos como mileage, vin, license_plate, description e images se envían directamente sin normalización.',
  
  // Format - New sections
  'api.docs.format.requiredFieldsTitle': 'Campos Obligatorios',
  'api.docs.format.directFieldsTitle': 'Campos Opcionales - Datos Directos',
  'api.docs.format.normalizedFieldsTitle': 'Campos Opcionales - Requieren Normalización',
  'api.docs.format.validations': 'Reglas de Validación',
  'api.docs.format.completeExample': 'Ejemplo Completo',
  'api.docs.format.mandatory': 'Obligatorio',
  
  // Field descriptions - Required
  'api.docs.format.makeDesc': 'Marca del vehículo',
  'api.docs.format.modelDesc': 'Modelo del vehículo',
  'api.docs.format.yearDesc': 'Año de fabricación',
  'api.docs.format.priceDesc': 'Precio en euros',
  'api.docs.format.fuelTypeDesc': 'Tipo de combustible (ver tabla normalización)',
  'api.docs.format.transmissionDesc': 'Tipo de transmisión (ver tabla normalización)',
  'api.docs.format.bodyTypeDesc': 'Tipo de carrocería (ver tabla normalización)',
  'api.docs.format.requiredNote': 'Los campos fuel_type, transmission y body_type deben usar valores de la tabla de normalización multiidioma.',
  
  // Field descriptions - Direct optional
  'api.docs.format.directFieldsDesc': 'Estos campos se envían directamente sin necesidad de normalización multiidioma:',
  'api.docs.format.mileageDesc': 'Kilómetros recorridos (campo crítico para valoración del vehículo)',
  'api.docs.format.mileageUnitDesc': 'Unidad de medida del kilometraje: "km" o "mi"',
  'api.docs.format.vinDesc': 'Número de bastidor VIN de 17 caracteres (crítico para identificación)',
  'api.docs.format.licensePlateDesc': 'Matrícula del vehículo (crítico para identificación)',
  'api.docs.format.descriptionDesc': 'Descripción detallada del vehículo (máximo 2000 caracteres, crítico para ventas)',
  'api.docs.format.imagesDesc': 'Array de URLs de imágenes del vehículo (HTTPS recomendado, crítico para ventas)',
  'api.docs.format.doorsDesc': 'Número de puertas',
  'api.docs.format.seatsDesc': 'Número de asientos',
  'api.docs.format.engineSizeDesc': 'Cilindrada del motor (ej: "2.0L")',
  'api.docs.format.horsepowerDesc': 'Potencia en CV',
  'api.docs.format.registrationDateDesc': 'Fecha de primera matriculación (ISO 8601)',
  'api.docs.format.co2Desc': 'Emisiones de CO2 en g/km',
  'api.docs.format.warrantyDesc': 'Indica si tiene garantía vigente',
  'api.docs.format.equipmentDesc': 'Array de equipamiento adicional',
  'api.docs.format.interiorColorDesc': 'Color del interior',
  
  // Field descriptions - Normalized optional
  'api.docs.format.normalizedFieldsDesc': 'Estos campos requieren normalización multiidioma (ver pestaña "Normalización"):',
  'api.docs.format.statusDesc': 'Estado del vehículo (disponible, reservado, vendido, subasta)',
  'api.docs.format.iva_statusDesc': 'Estado del IVA (incluido, no_incluido, deducible)',
  'api.docs.format.transaction_typeDesc': 'Tipo de transacción (nacional, importacion, exportacion)',
  'api.docs.format.euro_standardDesc': 'Estándar de emisiones Euro (euro1 a euro7)',
  'api.docs.format.colorDesc': 'Color exterior del vehículo (normalizado)',
  'api.docs.format.conditionDesc': 'Condición del vehículo (nuevo, usado, seminuevo, certificado)',
  'api.docs.format.vehicle_typeDesc': 'Tipo de vehículo (turismo, furgoneta, camion, motocicleta)',
  'api.docs.format.seeNormalizationTab': 'Para ver todos los valores aceptados en cada idioma, consulta la pestaña "Normalización Multiidioma".',
  
  // Validations
  'api.docs.format.yearValidation': 'Debe estar entre 1900 y el año actual + 1',
  'api.docs.format.priceValidation': 'Debe ser un número positivo mayor que 0',
  'api.docs.format.mileageValidation': 'Debe ser un número no negativo (0 o mayor)',
  'api.docs.format.vinValidation': 'Formato estándar de 17 caracteres alfanuméricos (opcional pero altamente recomendado)',
  'api.docs.format.imagesValidation': 'Array de URLs válidas, preferiblemente HTTPS. Máximo recomendado: 20 imágenes',
  'api.docs.format.descriptionValidation': 'Texto libre con máximo 2000 caracteres',
  
  // Reference tab
  'api.docs.reference': 'Referencia Rápida',
  'api.docs.reference.title': 'Tabla de Referencia Rápida',
  'api.docs.reference.description': 'Resumen completo de todos los campos disponibles en la API:',
  'api.docs.reference.field': 'Campo',
  'api.docs.reference.type': 'Tipo',
  'api.docs.reference.status': 'Estado',
  'api.docs.reference.normalization': 'Normalización',
  'api.docs.reference.example': 'Ejemplo',
  'api.docs.reference.criticalNote': 'Campos Críticos Resaltados',
  'api.docs.reference.criticalNoteDesc': 'Los campos resaltados en amarillo (mileage, vin, license_plate, description, images) son opcionales pero altamente recomendados para maximizar la visibilidad y las posibilidades de venta del vehículo.',
};
