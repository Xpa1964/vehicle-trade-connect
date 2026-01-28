import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { translations, Language } from '@/translations';

export const RatingTranslationStatus = () => {
  const [isChecking, setIsChecking] = useState(false);
  
  const ratingKeys = [
    'rating.rateUser',
    'rating.rateSeller', 
    'rating.shareExperience',
    'rating.giveStars',
    'rating.clickToRate',
    'rating.currentReputation'
  ];

  const checkRatingTranslations = () => {
    setIsChecking(true);
    setTimeout(() => setIsChecking(false), 500);
  };

  const getLanguageStatus = () => {
    const results: Record<Language, { missing: string[], total: number }> = {} as any;
    
    Object.keys(translations).forEach(lang => {
      const missing = ratingKeys.filter(key => !(key in translations[lang as Language]));
      results[lang as Language] = {
        missing,
        total: ratingKeys.length
      };
    });
    
    return results;
  };

  const languageStatus = getLanguageStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Rating System Translations
          </CardTitle>
          <Button 
            onClick={checkRatingTranslations}
            variant="outline" 
            size="sm"
            disabled={isChecking}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(languageStatus).map(([lang, status]) => {
              const isComplete = status.missing.length === 0;
              const percentage = Math.round(((status.total - status.missing.length) / status.total) * 100);
              
              return (
                <div key={lang} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium uppercase">{lang}</span>
                    {isComplete ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <Badge variant={isComplete ? "default" : "destructive"}>
                    {percentage}%
                  </Badge>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Required Rating Keys:</h4>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {ratingKeys.map(key => (
                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="text-xs">{key}</code>
                  <div className="flex gap-1">
                    {Object.entries(languageStatus).map(([lang, status]) => (
                      <Badge 
                        key={lang} 
                        variant={status.missing.includes(key) ? "destructive" : "default"}
                        className="text-xs px-1"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};