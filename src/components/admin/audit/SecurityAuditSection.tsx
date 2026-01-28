import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AuditData } from '@/utils/auditDataGenerator';

interface SecurityAuditSectionProps {
  data: AuditData;
}

export const SecurityAuditSection: React.FC<SecurityAuditSectionProps> = ({ data }) => {
  const getPriorityColor = (priority: string) => {
    if (priority.includes('P0')) return 'destructive';
    if (priority.includes('P1')) return 'default';
    if (priority.includes('P2')) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Análisis de Seguridad</h2>
        <Badge variant="outline">{data.scores.security}/100</Badge>
      </div>

      {/* Fortalezas */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Fortalezas Identificadas
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Área</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Impacto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.security.strengths.map((strength, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{strength.area}</TableCell>
                <TableCell>{strength.description}</TableCell>
                <TableCell>
                  <Badge variant={strength.impact === 'Alto' ? 'default' : 'secondary'}>
                    {strength.impact}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vulnerabilidades */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Vulnerabilidades Detectadas
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prioridad</TableHead>
              <TableHead>Hallazgo</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Riesgo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.security.vulnerabilities.map((vuln, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant={getPriorityColor(vuln.priority)}>
                    {vuln.priority}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{vuln.finding}</TableCell>
                <TableCell>{vuln.location}</TableCell>
                <TableCell>
                  <Badge variant={vuln.risk === 'Alto' ? 'destructive' : 'secondary'}>
                    {vuln.risk}
                  </Badge>
                </TableCell>
                <TableCell>{vuln.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Recomendaciones */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recomendaciones de Seguridad</h3>
        <div className="space-y-2">
          {data.security.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">{index + 1}.</span>
              <span className="text-sm">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
