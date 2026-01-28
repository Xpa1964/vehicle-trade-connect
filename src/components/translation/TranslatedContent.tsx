import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Json } from '@/integrations/supabase/types';
import { useTranslation } from '@/hooks/useTranslation';
import TranslationLoading from './TranslationLoading';
import TranslationError from './TranslationError';
import TranslationToggle from './TranslationToggle';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

interface TranslatedContentProps {
  originalText: string;
  originalLanguage: string;
  translatedContent?: Json | null;
  targetLanguage: string;
  className?: string;
}

const TranslatedContent: React.FC<TranslatedContentProps> = ({
  originalText,
  originalLanguage,
  translatedContent,
  targetLanguage,
  className = ''
}) => {
  const { t } = useLanguage();
  
  const {
    translation,
    isLoading,
    error,
    showOriginal,
    toggleLanguage,
    retry,
    isCached
  } = useTranslation({
    originalText,
    originalLanguage,
    targetLanguage,
    translatedContent,
    t
  });

  console.log(`🌐 [TranslatedContent] Rendering - originalLang: ${originalLanguage}, targetLang: ${targetLanguage}, showOriginal: ${showOriginal}, isLoading: ${isLoading}, hasTranslation: ${!!translation}`);

  // Sanitiza el texto original y traducido antes de mostrar
  const sanitizedOriginal = sanitizeHtml(originalText);
  const sanitizedTranslation =
    translation && originalLanguage !== targetLanguage ? sanitizeHtml(translation) : null;

  // Si los textos sanitizados difieren del original, muestra un aviso pequeño
  const showSanitizedWarning = sanitizedOriginal !== originalText || (sanitizedTranslation && sanitizedTranslation !== translation);

  // If languages are the same or user wants to see original
  if (originalLanguage === targetLanguage || showOriginal) {
    return (
      <div className={className}>
        <span>{sanitizedOriginal}</span>
        {showSanitizedWarning && (
          <div className="text-xs text-yellow-500 mt-1">El texto fue sanitizado por seguridad</div>
        )}
        {originalLanguage !== targetLanguage && (
          <div className="mt-1">
            <TranslationToggle
              showOriginal={true}
              onToggle={toggleLanguage}
              showOriginalText={t('messages.showOriginal', { fallback: 'Mostrar original' })}
              showTranslationText={t('messages.showTranslation', { fallback: 'Mostrar traducción' })}
            />
          </div>
        )}
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={className}>
        <TranslationLoading loadingMessage={t('common.translating', { fallback: 'Traduciendo...' })} />
      </div>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <div className={className}>
        <TranslationError originalText={originalText} errorMessage={error} />
        <Button 
          variant="outline"
          size="sm"
          onClick={() => retry()}
          className="mt-2 flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          {t('common.retry', { fallback: 'Reintentar' })}
        </Button>
      </div>
    );
  }

  // Show translated content
  if (translation) {
    return (
      <div className={className}>
        <span>{sanitizedTranslation}</span>
        {showSanitizedWarning && (
          <div className="text-xs text-yellow-500 mt-1">El texto fue sanitizado por seguridad</div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <TranslationToggle
            showOriginal={false}
            onToggle={toggleLanguage}
            showOriginalText={t('messages.showOriginal', { fallback: 'Mostrar original' })}
            showTranslationText={t('messages.showTranslation', { fallback: 'Mostrar traducción' })}
          />
          {isCached && (
            <span className="text-xs text-gray-500 flex items-center gap-0.5">
              <Database className="h-3 w-3" />
              {t('common.cached', { fallback: 'Guardado' })}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Fallback to original text
  return (
    <div className={className}>
      <span>{sanitizedOriginal}</span>
      {showSanitizedWarning && (
        <div className="text-xs text-yellow-500 mt-1">El texto fue sanitizado por seguridad</div>
      )}
    </div>
  );
};

export default TranslatedContent;
