import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, Car, MessageSquare, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { AuditData } from '@/utils/auditDataGenerator';

interface MetricsSectionProps {
  data: AuditData;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ data }) => {
  const radarData = [
    { subject: 'Seguridad', A: data.scores.security, fullMark: 100 },
    { subject: 'UI/UX', A: data.scores.uiux, fullMark: 100 },
    { subject: 'QA', A: data.scores.qa, fullMark: 100 },
    { subject: 'Accesibilidad', A: data.scores.accessibility, fullMark: 100 },
  ];

  const barData = [
    { name: 'Seguridad', actual: data.scores.security, objetivo: 90 },
    { name: 'UI/UX', actual: data.scores.uiux, objetivo: 85 },
    { name: 'QA', actual: data.scores.qa, objetivo: 80 },
    { name: 'Accesibilidad', actual: data.scores.accessibility, objetivo: 90 },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold">Métricas y KPIs</h2>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-2">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Usuarios Totales</h3>
          </div>
          <p className="text-3xl font-bold">{data.metrics.totalUsers}</p>
        </Card>
        <Card className="p-4 border-2">
          <div className="flex items-center gap-3 mb-2">
            <Car className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-sm">Vehículos</h3>
          </div>
          <p className="text-3xl font-bold">{data.metrics.totalVehicles}</p>
        </Card>
        <Card className="p-4 border-2">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-sm">Conversaciones</h3>
          </div>
          <p className="text-3xl font-bold">{data.metrics.totalConversations}</p>
        </Card>
        <Card className="p-4 border-2">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-sm">Tiempo Respuesta</h3>
          </div>
          <p className="text-3xl font-bold">{data.metrics.responseTime}h</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Puntuaciones vs Objetivos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              <Bar dataKey="objetivo" fill="#10b981" name="Objetivo" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Vista General (Radar)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Puntuación" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Card>
  );
};
