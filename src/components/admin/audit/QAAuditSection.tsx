import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestTube, CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AuditData } from '@/utils/auditDataGenerator';

interface QAAuditSectionProps {
  data: AuditData;
}

export const QAAuditSection: React.FC<QAAuditSectionProps> = ({ data }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <TestTube className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold">Análisis QA (Quality Assurance)</h2>
        <Badge variant="outline">{data.scores.qa}/100</Badge>
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
              <TableHead>Herramienta/Práctica</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.qa.strengths.map((strength, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{strength.area}</TableCell>
                <TableCell>{strength.tool}</TableCell>
                <TableCell>{strength.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Debilidades CRÍTICAS */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-600" />
          Debilidades Críticas
        </h3>
        {data.scores.qa < 50 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold">
              ⚠️ CRÍTICO: La aplicación tiene {data.scores.qa}% de cobertura de tests
            </p>
            <p className="text-red-700 text-sm mt-2">
              Esto representa un riesgo muy alto para la estabilidad y mantenibilidad del sistema
            </p>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prioridad</TableHead>
              <TableHead>Problema</TableHead>
              <TableHead>Impacto</TableHead>
              <TableHead>Cobertura Actual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.qa.weaknesses.map((weakness, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant={weakness.priority.includes('P0') ? 'destructive' : 'secondary'}>
                    {weakness.priority}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{weakness.problem}</TableCell>
                <TableCell>
                  <Badge variant={weakness.impact === 'Muy Alto' ? 'destructive' : 'default'}>
                    {weakness.impact}
                  </Badge>
                </TableCell>
                <TableCell>{weakness.coverage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Testing Strategy Recomendada */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Testing Strategy Recomendada</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Prioridad Inmediata */}
          {data.qa.testingStrategy.immediate.items.length > 0 && (
            <Card className="p-4 border-2 border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">{data.qa.testingStrategy.immediate.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{data.qa.testingStrategy.immediate.subtitle}</p>
              <ul className="text-xs space-y-1">
                {data.qa.testingStrategy.immediate.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </Card>
          )}
          
          {/* Prioridad Alta */}
          {data.qa.testingStrategy.high.items.length > 0 && (
            <Card className="p-4 border-2 border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">{data.qa.testingStrategy.high.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{data.qa.testingStrategy.high.subtitle}</p>
              <ul className="text-xs space-y-1">
                {data.qa.testingStrategy.high.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </Card>
          )}
          
          {/* Prioridad Media */}
          {data.qa.testingStrategy.medium.items.length > 0 && (
            <Card className="p-4 border-2 border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">{data.qa.testingStrategy.medium.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{data.qa.testingStrategy.medium.subtitle}</p>
              <ul className="text-xs space-y-1">
                {data.qa.testingStrategy.medium.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </Card>
          )}
          
          {/* Si no hay items, mostrar mensaje de éxito */}
          {data.qa.testingStrategy.immediate.items.length === 0 && 
           data.qa.testingStrategy.high.items.length === 0 && 
           data.qa.testingStrategy.medium.items.length === 0 && (
            <Card className="p-4 border-2 border-green-200 col-span-3">
              <p className="text-green-800 font-semibold text-center">
                ✅ Excelente! Todos los niveles de testing están implementados
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Recomendaciones */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recomendaciones QA</h3>
        <div className="space-y-2">
          {data.qa.recommendations.map((rec, index) => (
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
