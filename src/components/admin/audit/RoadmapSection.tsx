import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { AuditData } from '@/utils/auditDataGenerator';

interface RoadmapSectionProps {
  data: AuditData;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({ data }) => {
  const getPhaseStyle = (priority: 'urgent' | 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'urgent':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'high':
        return {
          icon: Clock,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'medium':
        return {
          icon: Calendar,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold">Roadmap de Mejoras</h2>
        <Badge variant="outline">
          Basado en {data.scores.qa}% coverage actual
        </Badge>
      </div>

      <div className="space-y-6">
        {data.roadmap.map((phase, phaseIndex) => {
          const style = getPhaseStyle(phase.priority);
          const Icon = style.icon;
          
          return (
            <Card key={phaseIndex} className={`p-5 border-2 ${style.borderColor} ${style.bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${style.color}`} />
                  <h3 className="text-lg font-semibold">{phase.title}</h3>
                </div>
                <Badge variant="outline" className="font-semibold">
                  {phase.timeframe}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {phase.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-start gap-3 bg-white/60 p-3 rounded-lg">
                    <Checkbox id={`task-${phaseIndex}-${taskIndex}`} className="mt-1" />
                    <label
                      htmlFor={`task-${phaseIndex}-${taskIndex}`}
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      {task}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Roadmap Dinámico</h3>
        <p className="text-sm text-blue-800">
          Este roadmap se genera automáticamente basado en el estado actual del proyecto 
          (Coverage: {data.scores.qa}%). Las fases se actualizan conforme avanza el progreso.
        </p>
      </div>
    </Card>
  );
};
