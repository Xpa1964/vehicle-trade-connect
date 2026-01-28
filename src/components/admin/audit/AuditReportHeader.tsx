import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { AuditData } from '@/utils/auditDataGenerator';

interface AuditReportHeaderProps {
  data: AuditData;
}

export const AuditReportHeader: React.FC<AuditReportHeaderProps> = ({ data }) => {
  const getStatusIcon = () => {
    if (data.scores.total >= 80) return <CheckCircle className="h-8 w-8 text-green-500" />;
    if (data.scores.total >= 60) return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    return <Shield className="h-8 w-8 text-red-500" />;
  };

  const getStatusColor = () => {
    if (data.scores.total >= 80) return 'bg-green-500';
    if (data.scores.total >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-8 mb-8 border-2">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          {getStatusIcon()}
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Auditoría de Seguridad, QA y UI/UX
          </h1>
          <p className="text-xl text-muted-foreground">KONTACT VO</p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="outline" className="text-sm">
            Fecha: {new Date(data.metadata.generatedAt).toLocaleDateString('es-ES')}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Versión: {data.metadata.version}
          </Badge>
          <Badge className={`${getStatusColor()} text-white`}>
            Estado: {data.metadata.status}
          </Badge>
        </div>

        <div className="pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${data.scores.security >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                {data.scores.security}
              </div>
              <div className="text-sm text-muted-foreground">Seguridad</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${data.scores.uiux >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                {data.scores.uiux}
              </div>
              <div className="text-sm text-muted-foreground">UI/UX</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${data.scores.qa >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {data.scores.qa}
              </div>
              <div className="text-sm text-muted-foreground">QA</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${data.scores.accessibility >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                {data.scores.accessibility}
              </div>
              <div className="text-sm text-muted-foreground">Accesibilidad</div>
            </div>
            <div className="text-center border-l-2">
              <div className={`text-3xl font-bold ${data.scores.total >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                {data.scores.total}
              </div>
              <div className="text-sm text-muted-foreground font-semibold">TOTAL</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
