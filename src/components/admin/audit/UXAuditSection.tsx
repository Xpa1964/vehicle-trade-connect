import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AuditData } from '@/utils/auditDataGenerator';

interface UXAuditSectionProps {
  data: AuditData;
}

export const UXAuditSection: React.FC<UXAuditSectionProps> = ({ data }) => {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 inline ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Análisis UI/UX</h2>
        <Badge variant="outline">{data.scores.uiux}/100</Badge>
      </div>

      {/* Fortalezas */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Fortalezas Identificadas</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Área</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Calificación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.uiux.strengths.map((strength, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{strength.area}</TableCell>
                <TableCell>{strength.description}</TableCell>
                <TableCell>{renderStars(strength.rating)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Debilidades */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Debilidades Detectadas</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prioridad</TableHead>
              <TableHead>Problema</TableHead>
              <TableHead>Componente Afectado</TableHead>
              <TableHead>Impacto UX</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.uiux.weaknesses.map((weakness, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant={weakness.priority.includes('P1') ? 'destructive' : 'secondary'}>
                    {weakness.priority}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{weakness.problem}</TableCell>
                <TableCell>{weakness.component}</TableCell>
                <TableCell>
                  <Badge variant="outline">{weakness.impact}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Recomendaciones */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recomendaciones UI/UX</h3>
        <div className="space-y-2">
          {data.uiux.recommendations.map((rec, index) => (
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
