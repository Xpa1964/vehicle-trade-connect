
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Building2, BarChart3 } from 'lucide-react';

interface Recipient {
  id: string;
  full_name?: string;
  company_name?: string;
  business_type?: string;
  country?: string;
}

interface RecipientsSummaryProps {
  recipients: Recipient[];
  className?: string;
}

const RecipientsSummary: React.FC<RecipientsSummaryProps> = ({
  recipients,
  className = ''
}) => {
  // Análisis de destinatarios
  const getCountryStats = () => {
    const countryCount: Record<string, number> = {};
    recipients.forEach(recipient => {
      if (recipient.country) {
        countryCount[recipient.country] = (countryCount[recipient.country] || 0) + 1;
      }
    });
    return Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getBusinessTypeStats = () => {
    const businessTypes: Record<string, number> = {};
    recipients.forEach(recipient => {
      if (recipient.business_type) {
        businessTypes[recipient.business_type] = (businessTypes[recipient.business_type] || 0) + 1;
      }
    });
    return Object.entries(businessTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const businessTypeLabels: Record<string, string> = {
    'dealer': 'Concesionario',
    'multibrand_used': 'Multimarca VO',
    'buy_sell': 'Compraventa',
    'rent_a_car': 'Rent a Car',
    'renting': 'Renting',
    'workshop': 'Taller',
    'importer': 'Importador',
    'exporter': 'Exportador',
    'trader': 'Comerciante',
    'other': 'Otro'
  };

  const countryStats = getCountryStats();
  const businessTypeStats = getBusinessTypeStats();

  if (recipients.length === 0) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No hay destinatarios seleccionados</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5" />
        <h3 className="font-medium">Análisis de Destinatarios</h3>
      </div>

      {/* Resumen general */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Resumen General
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{recipients.length}</div>
              <div className="text-sm text-gray-500">Total destinatarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{countryStats.length}</div>
              <div className="text-sm text-gray-500">Países diferentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{businessTypeStats.length}</div>
              <div className="text-sm text-gray-500">Tipos de negocio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribución geográfica */}
      {countryStats.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Distribución Geográfica
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {countryStats.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 rounded-full h-2 w-20 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(count / recipients.length) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs min-w-[40px] justify-center">
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tipos de negocio */}
      {businessTypeStats.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Tipos de Negocio
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {businessTypeStats.map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {businessTypeLabels[type] || type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 rounded-full h-2 w-20 overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(count / recipients.length) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs min-w-[40px] justify-center">
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de destinatarios (muestra solo algunos) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Destinatarios Seleccionados</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {recipients.slice(0, 10).map((recipient) => (
              <div key={recipient.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div>
                  <span className="font-medium">
                    {recipient.company_name || recipient.full_name || 'Usuario'}
                  </span>
                  {recipient.country && (
                    <span className="text-gray-500 ml-2">• {recipient.country}</span>
                  )}
                </div>
                {recipient.business_type && (
                  <Badge variant="outline" className="text-xs">
                    {businessTypeLabels[recipient.business_type] || recipient.business_type}
                  </Badge>
                )}
              </div>
            ))}
            
            {recipients.length > 10 && (
              <div className="text-center p-2 text-sm text-gray-500">
                ... y {recipients.length - 10} más
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipientsSummary;
