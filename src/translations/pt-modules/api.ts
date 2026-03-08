export default {
  // API Management
  'api.management.title': 'Gestão de API',
  'api.management.subtitle': 'Gerencie suas chaves de API e acesse a documentação completa',
  'api.management.backToPanel': 'Voltar ao Painel de Controle',
  
  // Statistics
  'api.stats.totalKeys': 'Total de Chaves',
  'api.stats.activeKeys': 'Chaves Ativas',
  'api.stats.totalUsers': 'Total de Usuários',
  'api.stats.totalRequests': 'Total de Requisições',
  
  // API Keys List
  'api.keysList.title': 'Minhas Chaves de API',
  'api.keysList.description': 'Gerencie suas chaves de API e suas permissões',
  'api.keysList.name': 'Nome',
  'api.keysList.key': 'Chave',
  'api.keysList.created': 'Criada em',
  'api.keysList.lastUsed': 'Último uso',
  'api.keysList.status': 'Status',
  'api.keysList.actions': 'Ações',
  
  // Status
  'api.status.active': 'Ativa',
  'api.status.inactive': 'Inativa',
  
  // Key Row
  'api.keyRow.never': 'Nunca',
  'api.keyRow.copy': 'Copiar',
  'api.keyRow.copied': 'Copiado!',
  'api.keyRow.deactivate': 'Desativar',
  
  // Actions
  'api.actions.createNew': 'Criar Nova Chave',
  'api.actions.view': 'Ver',
  'api.actions.edit': 'Editar',
  'api.actions.delete': 'Excluir',
  'api.actions.viewDocs': 'Ver Documentação',
  'api.actions.testAPI': 'Testar API',
  
  // Details
  'api.details.title': 'Detalhes da Chave de API',
  'api.details.keyId': 'ID da Chave',
  'api.details.keyName': 'Nome da Chave',
  'api.details.createdAt': 'Criada em',
  'api.details.lastUsed': 'Último uso',
  'api.details.requests': 'Requisições este mês',
  'api.details.status': 'Status',
  'api.details.permissions': 'Permissões',
  'api.details.readVehicles': 'Ler Veículos',
  'api.details.writeVehicles': 'Escrever Veículos',
  
  // API Card
  'api.card.title': 'API KONTACT VO',
  'api.card.description': 'Integre seus sistemas com nossa API RESTful',
  'api.card.endpoint': 'Endpoint',
  'api.card.documentation': 'Documentação Completa',
  'api.card.authentification': 'Autenticação',
  'api.card.authDescription': 'Use sua chave de API no cabeçalho Authorization',
  'api.card.rateLimit': 'Limite de Taxa',
  'api.card.rateLimitDescription': '1000 requisições/hora',
  
  // Integration Guide
  'api.integration.title': 'Guia de Integração',
  'api.integration.step1': 'Crie uma chave de API no painel',
  'api.integration.step2': 'Inclua a chave nos cabeçalhos de requisição',
  'api.integration.step3': 'Comece a enviar requisições para nossos endpoints',
  
  // API Key Creation
  'api.create.title': 'Criar Nova Chave de API',
  'api.create.name': 'Nome da Chave',
  'api.create.namePlaceholder': 'Minha Integração de API',
  'api.create.description': 'Descrição (opcional)',
  'api.create.descriptionPlaceholder': 'Descrição desta chave de API...',
  'api.create.permissions': 'Permissões',
  'api.create.readVehicles': 'Ler Veículos',
  'api.create.writeVehicles': 'Escrever Veículos',
  'api.create.readUsers': 'Ler Usuários',
  'api.create.cancel': 'Cancelar',
  'api.create.create': 'Criar Chave',
  'api.create.success': 'Chave de API criada com sucesso',
  
  // Documentation Sections
  'api.docs.title': 'Documentação da API',
  'api.docs.process': 'Processo de Requisição',
  'api.docs.format': 'Formato de Dados',
  'api.docs.integration': 'Integração Técnica',
  'api.docs.normalization': 'Normalização Multi-idioma',
  'api.docs.reference': 'Referência Rápida',
  
  // Request Process
  'api.docs.process.title': 'Processo de Requisição da API',
  'api.docs.process.step1': '1. Autenticação',
  'api.docs.process.step1Desc': 'Inclua sua chave de API no cabeçalho Authorization',
  'api.docs.process.step2': '2. Envio de Dados',
  'api.docs.process.step2Desc': 'Envie as informações do veículo no formato JSON',
  'api.docs.process.step3': '3. Normalização',
  'api.docs.process.step3Desc': 'Nossos sistemas normalizam automaticamente os campos multi-idioma',
  'api.docs.process.step4': '4. Resposta',
  'api.docs.process.step4Desc': 'Receba a confirmação com o ID do veículo criado',
  
  // Data Format
  'api.docs.format.title': 'Formato de Dados para Publicação de Veículo',
  'api.docs.format.required': 'Campos Obrigatórios',
  'api.docs.format.requiredDesc': 'Estes campos são indispensáveis para criar um veículo',
  'api.docs.format.optional': 'Campos Opcionais - Dados Diretos',
  'api.docs.format.optionalDesc': 'Estes campos são salvos diretamente sem transformação',
  'api.docs.format.normalized': 'Campos Opcionais - Requerem Normalização',
  'api.docs.format.normalizedDesc': 'Estes campos serão normalizados automaticamente em todos os idiomas',
  'api.docs.format.validation': 'Validações',
  'api.docs.format.validationDesc': 'Regras de validação para os campos',
  'api.docs.format.example': 'Exemplo de Requisição Completa',
  'api.docs.format.exampleDesc': 'Exemplo JSON com todos os campos disponíveis',
  
  // Field Descriptions - Required
  'api.docs.format.makeDesc': 'Marca do veículo (ex: "BMW", "Mercedes-Benz")',
  'api.docs.format.modelDesc': 'Modelo do veículo (ex: "Série 3", "Classe C")',
  'api.docs.format.yearDesc': 'Ano de fabricação (deve ser >= 1900)',
  'api.docs.format.priceDesc': 'Preço do veículo em euros (deve ser > 0)',
  
  // Field Descriptions - Direct Optional
  'api.docs.format.mileageDesc': 'Quilometragem em km. Importante para avaliação',
  'api.docs.format.vinDesc': 'Número VIN. Identificação única do veículo',
  'api.docs.format.licensePlateDesc': 'Placa de licença',
  'api.docs.format.descriptionDesc': 'Descrição detalhada do veículo (máx. 5000 caracteres)',
  'api.docs.format.imagesDesc': 'Array de URLs de imagens (máx. 25 imagens)',
  'api.docs.format.videosDesc': 'Array de URLs de vídeos (opcional)',
  
  // Field Descriptions - Normalized
  'api.docs.format.statusDesc': 'Status do veículo (será normalizado em todos os idiomas)',
  'api.docs.format.iva_statusDesc': 'Status do IVA (será normalizado)',
  'api.docs.format.fuel_typeDesc': 'Tipo de combustível (será normalizado)',
  'api.docs.format.transmissionDesc': 'Tipo de transmissão (será normalizado)',
  'api.docs.format.body_typeDesc': 'Tipo de carroceria (será normalizado)',
  'api.docs.format.colorDesc': 'Cor externa (será normalizada)',
  'api.docs.format.interior_colorDesc': 'Cor interna (será normalizada)',
  'api.docs.format.doorsDesc': 'Número de portas (será normalizado)',
  'api.docs.format.seatsDesc': 'Número de assentos (será normalizado)',
  
  // Validation Rules
  'api.docs.format.yearValidation': 'Deve ser >= 1900',
  'api.docs.format.priceValidation': 'Deve ser > 0',
  'api.docs.format.mileageValidation': 'Deve ser >= 0',
  'api.docs.format.vinValidation': '17 caracteres alfanuméricos',
  'api.docs.format.imagesValidation': 'Máximo de 20 imagens',
  'api.docs.format.descriptionValidation': 'Máximo de 5000 caracteres',
  
  // Technical Integration
  'api.docs.integration.title': 'Integração Técnica',
  'api.docs.integration.endpoint': 'Endpoint',
  'api.docs.integration.method': 'Método',
  'api.docs.integration.headers': 'Cabeçalhos Obrigatórios',
  'api.docs.integration.curlExample': 'Exemplo cURL',
  'api.docs.integration.jsExample': 'Exemplo JavaScript',
  'api.docs.integration.pythonExample': 'Exemplo Python',
  'api.docs.integration.response': 'Resposta Esperada',
  
  // Normalization
  'api.docs.normalization.title': 'Normalização Multi-idioma Automática',
  'api.docs.normalization.description': 'Nosso sistema normaliza automaticamente alguns campos em todos os idiomas suportados (ES, EN, FR, IT, DE, NL, PT, PL, DK)',
  'api.docs.normalization.process': 'Processo de Normalização',
  'api.docs.normalization.step1': '1. Você envia o campo no seu idioma (ex: "Diesel")',
  'api.docs.normalization.step2': '2. Nosso sistema o detecta e normaliza automaticamente',
  'api.docs.normalization.step3': '3. O veículo é exibido corretamente em todos os idiomas',
  'api.docs.normalization.fields': 'Campos Normalizáveis',
  'api.docs.normalization.status': 'Status',
  'api.docs.normalization.iva': 'IVA',
  'api.docs.normalization.fuel': 'Combustível',
  'api.docs.normalization.transmission': 'Transmissão',
  'api.docs.normalization.bodyType': 'Carroceria',
  'api.docs.normalization.colors': 'Cores',
  'api.docs.normalization.note': 'Nota: Você pode enviar esses campos em qualquer idioma suportado',
  
  // Quick Reference
  'api.docs.reference.title': 'Referência Rápida dos Campos',
  'api.docs.reference.field': 'Campo',
  'api.docs.reference.type': 'Tipo',
  'api.docs.reference.mandatory': 'Obrigatório',
  'api.docs.reference.normalized': 'Normalizado',
  'api.docs.reference.example': 'Exemplo',
  'api.docs.reference.yes': 'Sim',
  'api.docs.reference.no': 'Não',
  'api.docs.reference.number': 'Número',
  'api.docs.reference.string': 'Texto',
  'api.docs.reference.array': 'Array'
};
