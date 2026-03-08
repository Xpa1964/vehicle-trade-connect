export default {
  // API Management
  'api.management.title': 'Gestion des API',
  'api.management.subtitle': 'Gérez vos clés API et accédez à la documentation complète',
  'api.management.backToPanel': 'Retour au Panneau de Contrôle',
  
  // Statistics
  'api.stats.totalKeys': 'Total des Clés',
  'api.stats.activeKeys': 'Clés Actives',
  'api.stats.totalUsers': 'Total Utilisateurs',
  'api.stats.totalRequests': 'Total Requêtes',
  
  // API Keys List
  'api.keysList.title': 'Mes Clés API',
  'api.keysList.description': 'Gérez vos clés API et leurs permissions',
  'api.keysList.name': 'Nom',
  'api.keysList.key': 'Clé',
  'api.keysList.created': 'Créée le',
  'api.keysList.lastUsed': 'Dernière utilisation',
  'api.keysList.status': 'Statut',
  'api.keysList.actions': 'Actions',
  
  // Status
  'api.status.active': 'Active',
  'api.status.inactive': 'Inactive',
  
  // Key Row
  'api.keyRow.never': 'Jamais',
  'api.keyRow.copy': 'Copier',
  'api.keyRow.copied': 'Copié !',
  'api.keyRow.deactivate': 'Désactiver',
  
  // Actions
  'api.actions.createNew': 'Créer Nouvelle Clé',
  'api.actions.view': 'Voir',
  'api.actions.edit': 'Modifier',
  'api.actions.delete': 'Supprimer',
  'api.actions.viewDocs': 'Voir Documentation',
  'api.actions.testAPI': 'Tester API',
  
  // Details
  'api.details.title': 'Détails de la Clé API',
  'api.details.keyId': 'ID de Clé',
  'api.details.keyName': 'Nom de la Clé',
  'api.details.createdAt': 'Créée le',
  'api.details.lastUsed': 'Dernière utilisation',
  'api.details.requests': 'Requêtes ce mois',
  'api.details.status': 'Statut',
  'api.details.permissions': 'Permissions',
  'api.details.readVehicles': 'Lire Véhicules',
  'api.details.writeVehicles': 'Écrire Véhicules',
  
  // API Card
  'api.card.title': 'API KONTACT VO',
  'api.card.description': 'Intégrez vos systèmes avec notre API RESTful',
  'api.card.endpoint': 'Endpoint',
  'api.card.documentation': 'Documentation Complète',
  'api.card.authentification': 'Authentification',
  'api.card.authDescription': 'Utilisez votre clé API dans l\'en-tête Authorization',
  'api.card.rateLimit': 'Limite de Taux',
  'api.card.rateLimitDescription': '1000 requêtes/heure',
  
  // Integration Guide
  'api.integration.title': 'Guide d\'Intégration',
  'api.integration.step1': 'Créez une clé API depuis le tableau de bord',
  'api.integration.step2': 'Incluez la clé dans vos en-têtes de requête',
  'api.integration.step3': 'Commencez à envoyer des requêtes à nos endpoints',
  
  // API Key Creation
  'api.create.title': 'Créer une Nouvelle Clé API',
  'api.create.name': 'Nom de la Clé',
  'api.create.namePlaceholder': 'Mon Intégration API',
  'api.create.description': 'Description (optionnel)',
  'api.create.descriptionPlaceholder': 'Description de cette clé API...',
  'api.create.permissions': 'Permissions',
  'api.create.readVehicles': 'Lire Véhicules',
  'api.create.writeVehicles': 'Écrire Véhicules',
  'api.create.readUsers': 'Lire Utilisateurs',
  'api.create.cancel': 'Annuler',
  'api.create.create': 'Créer Clé',
  'api.create.success': 'Clé API créée avec succès',
  
  // Documentation Sections
  'api.docs.title': 'Documentation API',
  'api.docs.process': 'Processus de Requête',
  'api.docs.format': 'Format des Données',
  'api.docs.integration': 'Intégration Technique',
  'api.docs.normalization': 'Normalisation Multi-langue',
  'api.docs.reference': 'Référence Rapide',
  
  // Request Process
  'api.docs.process.title': 'Processus de Requête API',
  'api.docs.process.step1': '1. Authentification',
  'api.docs.process.step1Desc': 'Incluez votre clé API dans l\'en-tête Authorization',
  'api.docs.process.step2': '2. Envoi des Données',
  'api.docs.process.step2Desc': 'Envoyez les informations du véhicule au format JSON',
  'api.docs.process.step3': '3. Normalisation',
  'api.docs.process.step3Desc': 'Nos systèmes normalisent automatiquement les champs multi-langues',
  'api.docs.process.step4': '4. Réponse',
  'api.docs.process.step4Desc': 'Recevez la confirmation avec l\'ID du véhicule créé',
  
  // Data Format
  'api.docs.format.title': 'Format des Données pour Publication de Véhicule',
  'api.docs.format.required': 'Champs Obligatoires',
  'api.docs.format.requiredDesc': 'Ces champs sont indispensables pour créer un véhicule',
  'api.docs.format.optional': 'Champs Optionnels - Données Directes',
  'api.docs.format.optionalDesc': 'Ces champs s\'enregistrent directement sans transformation',
  'api.docs.format.normalized': 'Champs Optionnels - Nécessitent Normalisation',
  'api.docs.format.normalizedDesc': 'Ces champs seront normalisés automatiquement dans toutes les langues',
  'api.docs.format.validation': 'Validations',
  'api.docs.format.validationDesc': 'Règles de validation pour les champs',
  'api.docs.format.example': 'Exemple de Requête Complète',
  'api.docs.format.exampleDesc': 'Exemple JSON avec tous les champs disponibles',
  
  // Field Descriptions - Required
  'api.docs.format.makeDesc': 'Marque du véhicule (ex: "BMW", "Mercedes-Benz")',
  'api.docs.format.modelDesc': 'Modèle du véhicule (ex: "Serie 3", "Classe C")',
  'api.docs.format.yearDesc': 'Année de fabrication (doit être >= 1900)',
  'api.docs.format.priceDesc': 'Prix du véhicule en euros (doit être > 0)',
  
  // Field Descriptions - Direct Optional
  'api.docs.format.mileageDesc': 'Kilométrage en km. Important pour l\'évaluation',
  'api.docs.format.vinDesc': 'Numéro VIN. Identifiant unique du véhicule',
  'api.docs.format.licensePlateDesc': 'Plaque d\'immatriculation',
  'api.docs.format.descriptionDesc': 'Description détaillée du véhicule (max 5000 caractères)',
  'api.docs.format.imagesDesc': 'Tableau d\'URLs d\'images (max 25 images)',
  'api.docs.format.videosDesc': 'Tableau d\'URLs de vidéos (optionnel)',
  
  // Field Descriptions - Normalized
  'api.docs.format.statusDesc': 'Statut du véhicule (sera normalisé dans toutes les langues)',
  'api.docs.format.iva_statusDesc': 'Statut TVA (sera normalisé)',
  'api.docs.format.fuel_typeDesc': 'Type de carburant (sera normalisé)',
  'api.docs.format.transmissionDesc': 'Type de transmission (sera normalisé)',
  'api.docs.format.body_typeDesc': 'Type de carrosserie (sera normalisé)',
  'api.docs.format.colorDesc': 'Couleur extérieure (sera normalisée)',
  'api.docs.format.interior_colorDesc': 'Couleur intérieure (sera normalisée)',
  'api.docs.format.doorsDesc': 'Nombre de portes (sera normalisé)',
  'api.docs.format.seatsDesc': 'Nombre de sièges (sera normalisé)',
  
  // Validation Rules
  'api.docs.format.yearValidation': 'Doit être >= 1900',
  'api.docs.format.priceValidation': 'Doit être > 0',
  'api.docs.format.mileageValidation': 'Doit être >= 0',
  'api.docs.format.vinValidation': '17 caractères alphanumériques',
  'api.docs.format.imagesValidation': 'Maximum 25 images',
  'api.docs.format.descriptionValidation': 'Maximum 5000 caractères',
  
  // Technical Integration
  'api.docs.integration.title': 'Intégration Technique',
  'api.docs.integration.endpoint': 'Endpoint',
  'api.docs.integration.method': 'Méthode',
  'api.docs.integration.headers': 'En-têtes Requis',
  'api.docs.integration.curlExample': 'Exemple cURL',
  'api.docs.integration.jsExample': 'Exemple JavaScript',
  'api.docs.integration.pythonExample': 'Exemple Python',
  'api.docs.integration.response': 'Réponse Attendue',
  
  // Normalization
  'api.docs.normalization.title': 'Normalisation Multi-langue Automatique',
  'api.docs.normalization.description': 'Notre système normalise automatiquement certains champs dans toutes les langues supportées (ES, EN, FR, IT, DE, NL, PT, PL, DK)',
  'api.docs.normalization.process': 'Processus de Normalisation',
  'api.docs.normalization.step1': '1. Vous envoyez le champ dans votre langue (ex: "Diesel")',
  'api.docs.normalization.step2': '2. Notre système le détecte et normalise automatiquement',
  'api.docs.normalization.step3': '3. Le véhicule s\'affiche correctement dans toutes les langues',
  'api.docs.normalization.fields': 'Champs Normalisables',
  'api.docs.normalization.status': 'Statut',
  'api.docs.normalization.iva': 'TVA',
  'api.docs.normalization.fuel': 'Carburant',
  'api.docs.normalization.transmission': 'Transmission',
  'api.docs.normalization.bodyType': 'Carrosserie',
  'api.docs.normalization.colors': 'Couleurs',
  'api.docs.normalization.note': 'Note: Vous pouvez envoyer ces champs dans n\'importe quelle langue supportée',
  
  // Quick Reference
  'api.docs.reference.title': 'Référence Rapide des Champs',
  'api.docs.reference.field': 'Champ',
  'api.docs.reference.type': 'Type',
  'api.docs.reference.mandatory': 'Obligatoire',
  'api.docs.reference.normalized': 'Normalisé',
  'api.docs.reference.example': 'Exemple',
  'api.docs.reference.yes': 'Oui',
  'api.docs.reference.no': 'Non',
  'api.docs.reference.number': 'Nombre',
  'api.docs.reference.string': 'Texte',
  'api.docs.reference.array': 'Tableau'
};
