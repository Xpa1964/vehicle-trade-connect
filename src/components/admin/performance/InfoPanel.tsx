import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const InfoPanel: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  {t('performance.info.title')}
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Métricas */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                {t('performance.info.metrics.title')}
              </h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <p className="text-sm">{t('performance.info.metrics.activeUsers')}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <p className="text-sm">{t('performance.info.metrics.activeQueries')}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <p className="text-sm">{t('performance.info.metrics.realtimeChannels')}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <p className="text-sm">{t('performance.info.metrics.memoryUsage')}</p>
                </div>
              </div>
            </div>

            {/* Fases */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                {t('performance.info.phases.title')}
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-yellow-700">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-yellow-700">
                      {t('performance.info.phases.phase1')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('performance.info.phases.phase1.desc')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-red-700">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-red-700">
                      {t('performance.info.phases.phase2')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('performance.info.phases.phase2.desc')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-700">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-700">
                      {t('performance.info.phases.phase3')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('performance.info.phases.phase3.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                {t('performance.info.controls.title')}
              </h3>
              <div className="grid gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span>{t('performance.info.controls.apply')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span>{t('performance.info.controls.disable')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span>{t('performance.info.controls.rollback')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span>{t('performance.info.controls.monitoring')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-primary">•</span>
                  <span>{t('performance.info.controls.sync')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default InfoPanel;