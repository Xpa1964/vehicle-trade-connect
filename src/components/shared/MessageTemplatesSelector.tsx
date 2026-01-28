
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Users, Building } from 'lucide-react';

interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: 'business' | 'automotive' | 'personal' | 'announcement';
  tags: string[];
}

interface MessageTemplatesSelectorProps {
  onSelectTemplate: (template: MessageTemplate) => void;
  className?: string;
}

const MessageTemplatesSelector: React.FC<MessageTemplatesSelectorProps> = ({
  onSelectTemplate,
  className = ''
}) => {
  const templates: MessageTemplate[] = [
    {
      id: 'welcome',
      title: 'Bienvenida Profesional',
      content: 'Hola,\n\nMe pongo en contacto contigo desde **AutoConnect**. Estoy interesado en conocer más sobre tus servicios y establecer una relación comercial.\n\n¿Podrías enviarme información sobre tu catálogo de vehículos disponibles?\n\nGracias por tu tiempo.',
      category: 'business',
      tags: ['profesional', 'primer contacto']
    },
    {
      id: 'vehicle-inquiry',
      title: 'Consulta de Vehículo',
      content: 'Buenos días,\n\nHe visto tu perfil en el directorio y me interesa conocer más sobre los vehículos que tienes disponibles.\n\n• ¿Tienes vehículos en stock actualmente?\n• ¿Manejas importaciones?\n• ¿Cuáles son tus condiciones comerciales?\n\nQuedo atento a tu respuesta.',
      category: 'automotive',
      tags: ['vehículos', 'stock', 'comercial']
    },
    {
      id: 'partnership',
      title: 'Propuesta de Colaboración',
      content: 'Estimado/a compañero/a,\n\nSoy **[Tu Nombre]** de **[Tu Empresa]**. Tras revisar tu perfil, creo que podríamos establecer una **colaboración mutuamente beneficiosa**.\n\nMe gustaría proponerte:\n• Intercambio de contactos comerciales\n• Colaboración en importaciones\n• Apoyo mutuo en ventas\n\n¿Te interesaría que conversemos?',
      category: 'business',
      tags: ['colaboración', 'partnership', 'negocios']
    },
    {
      id: 'exchange-proposal',
      title: 'Propuesta de Intercambio',
      content: 'Hola,\n\nTengo un vehículo que podría interesarte para un **intercambio directo**:\n\n• Marca: [Especificar]\n• Modelo: [Especificar] \n• Año: [Especificar]\n• Estado: [Especificar]\n\n¿Tienes algo similar que te interese intercambiar? Me gustaría ver tu stock disponible.\n\nSaludos cordiales.',
      category: 'automotive',
      tags: ['intercambio', 'trueque', 'vehículos']
    },
    {
      id: 'service-inquiry',
      title: 'Consulta de Servicios',
      content: 'Buenos días,\n\nEstoy buscando un proveedor de servicios confiable para:\n\n• Transporte de vehículos\n• Gestión documental\n• Servicios de importación\n• [Otros servicios]\n\n¿Podrías enviarme información sobre tus tarifas y condiciones?\n\nGracias.',
      category: 'business',
      tags: ['servicios', 'tarifas', 'proveedor']
    },
    {
      id: 'announcement',
      title: 'Anuncio General',
      content: '📢 **Anuncio Importante**\n\nEstimados colegas del sector automotriz,\n\nQuería compartir con ustedes:\n\n• [Información relevante]\n• [Novedad del sector]\n• [Oportunidad de negocio]\n\nSi tienen alguna consulta, no duden en contactarme.\n\n¡Saludos a todos!',
      category: 'announcement',
      tags: ['anuncio', 'información', 'sector']
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return <Building className="h-4 w-4" />;
      case 'automotive': return <MessageSquare className="h-4 w-4" />;
      case 'personal': return <Users className="h-4 w-4" />;
      case 'announcement': return <FileText className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'business': return 'Negocios';
      case 'automotive': return 'Automotriz';
      case 'personal': return 'Personal';
      case 'announcement': return 'Anuncios';
      default: return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-blue-100 text-blue-800';
      case 'automotive': return 'bg-green-100 text-green-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'announcement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5" />
        <h3 className="font-medium">Plantillas de Mensajes</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {getCategoryIcon(template.category)}
                  {template.title}
                </CardTitle>
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(template.category)}`}>
                  {getCategoryLabel(template.category)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                {template.content.substring(0, 120)}...
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {template.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelectTemplate(template)}
                  className="text-xs h-7"
                >
                  Usar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-gray-500 text-center">
        💡 Puedes personalizar cualquier plantilla después de seleccionarla
      </div>
    </div>
  );
};

export default MessageTemplatesSelector;
