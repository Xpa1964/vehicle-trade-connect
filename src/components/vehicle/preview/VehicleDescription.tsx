
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Languages, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface VehicleDescriptionProps {
  description: string;
}

const VehicleDescription: React.FC<VehicleDescriptionProps> = ({ description }) => {
  const { t, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(true);
  const [hasTranslation, setHasTranslation] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Si el idioma actual es español o no hay descripción, mostrar el original
  const shouldShowOriginal = currentLanguage === 'es' || !description;

  const translateText = async (forceRefresh = false) => {
    if (!description || currentLanguage === 'es') return;
    
    setIsTranslating(true);
    setTranslationError(null);
    
    try {
      console.log(`Traduciendo descripción a ${currentLanguage}${forceRefresh ? ' (forzando actualización)' : ''}`);
      
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: JSON.stringify({
          text: description,
          sourceLanguage: 'es',
          targetLanguage: currentLanguage,
          forceRefresh: forceRefresh
        })
      });
      
      if (error) {
        console.error('Error de traducción:', error);
        setTranslationError(t('common.translationError'));
        toast.error(t('common.translationError'));
        return;
      }
      
      if (data && data.translation) {
        setTranslatedText(data.translation);
        setHasTranslation(true);
        setShowOriginal(false);
        if (data.cached && !forceRefresh) {
          toast.info(t('common.translationFromCache'), { duration: 3000 });
        }
      } else {
        throw new Error('No se recibió traducción del servicio');
      }
    } catch (error) {
      console.error('Error en la traducción:', error);
      setTranslationError(t('common.translationError'));
      toast.error(t('common.translationError'));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRetry = () => {
    translateText(true); // Forzar actualización de la traducción
  };

  useEffect(() => {
    if (currentLanguage !== 'es' && description) {
      // Intentar traducir automáticamente cuando cambie el idioma
      translateText();
    } else {
      // Si volvemos a español, mostrar el original
      setShowOriginal(true);
      setHasTranslation(false);
      setTranslatedText('');
      setTranslationError(null);
    }
  }, [currentLanguage, description]);

  if (!description) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between">
          {t('vehicles.description')}
          {!shouldShowOriginal && (
            <div className="flex items-center gap-2">
              {hasTranslation && !translationError && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="flex items-center gap-1"
                >
                  <Languages className="h-3 w-3" />
                  {showOriginal ? t('common.showTranslation') : t('common.showOriginal')}
                </Button>
              )}
              {!isTranslating && translationError && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  {t('common.retry')}
                </Button>
              )}
              {!hasTranslation && !isTranslating && !translationError && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => translateText()}
                  className="flex items-center gap-1"
                >
                  <Languages className="h-3 w-3" />
                  {t('common.translate')}
                </Button>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isTranslating ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t('common.translating')}</span>
          </div>
        ) : (
          <div>
            {translationError ? (
              <div className="text-red-500 mb-2 text-sm">{translationError}</div>
            ) : null}
            
            <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
              {showOriginal || !hasTranslation ? description : translatedText}
            </p>
            
            {hasTranslation && !showOriginal && (
              <p className="text-xs text-gray-500 mt-2 italic">
                {t('common.translatedFrom')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleDescription;
