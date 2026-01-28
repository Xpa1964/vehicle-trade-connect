
import React, { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InfoCard: React.FC = memo(() => {
  const { t } = useLanguage();

  return (
    <Card className="w-full bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-foreground">
          {t('calculator.info.title', { fallback: 'Important Information' })}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p>{t('calculator.info.disclaimer', { fallback: 'Calculations are estimates and may vary. Consult with a professional for specific information.' })}</p>
          <p>{t('calculator.info.b2bOnly', { fallback: 'This calculator is designed exclusively for B2B imports (between professionals).' })}</p>
          <p>{t('calculator.info.vatInfo', { fallback: 'For intra-community B2B operations, the Spanish buyer self-assesses VAT, declaring and deducting it simultaneously.' })}</p>
        </div>
      </CardContent>
    </Card>
  );
});

InfoCard.displayName = 'InfoCard';

export default InfoCard;
