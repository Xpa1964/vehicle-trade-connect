import React from 'react';
import { Rocket, Shield, UserCheck, MapPin, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TransportHighlights: React.FC = () => {
  const { t } = useLanguage();

  const mainHighlights = [
    {
      icon: Rocket,
      titleKey: 'transport.express.highlight1.title',
      descKey: 'transport.express.highlight1.desc',
    },
    {
      icon: Shield,
      titleKey: 'transport.express.highlight2.title',
      descKey: 'transport.express.highlight2.desc',
    },
    {
      icon: UserCheck,
      titleKey: 'transport.express.highlight3.title',
      descKey: 'transport.express.highlight3.desc',
    },
  ];

  return (
    <>
      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
        {mainHighlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4 p-6 rounded-xl bg-secondary/5 border border-border hover:bg-secondary/10 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {t(highlight.titleKey)}
                </h3>
                <p className="text-base text-muted-foreground">
                  {t(highlight.descKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Scope - Special Highlighted Section */}
      <div className="my-8">
        <div className="relative border-2 border-amber-500 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border-2 border-amber-400">
                <MapPin className="w-16 h-16 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                <h3 className="text-xl font-extrabold text-foreground uppercase">
                  {t('transport.express.highlight4.title')}
                </h3>
              </div>
              <p className="text-base font-bold text-foreground mb-3">
                {t('transport.express.highlight4.desc')}
              </p>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-500">
                {t('transport.express.highlight4.examples')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransportHighlights;
