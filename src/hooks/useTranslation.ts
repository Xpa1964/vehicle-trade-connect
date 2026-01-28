
import { useState, useCallback, useEffect } from 'react';
import { Json } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { TRANSLATION_CONFIG } from '@/config/languages';

interface UseTranslationProps {
  originalText: string;
  originalLanguage: string;
  targetLanguage: string;
  translatedContent?: Json | null;
  t: (key: string, params?: Record<string, string | number | undefined>) => string;
}

export const useTranslation = ({
  originalText,
  originalLanguage,
  targetLanguage,
  translatedContent,
  t
}: UseTranslationProps) => {
  const [translation, setTranslation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [isCached, setIsCached] = useState<boolean>(false);

  // Reset state when target language changes
  useEffect(() => {
    console.log(`🌐 [useTranslation] Language changed to: ${targetLanguage}, resetting state`);
    setError(null);
    setShowOriginal(false);
    setIsCached(false);
    setTranslation('');
  }, [targetLanguage]);

  // Create a memoized translate function to prevent excessive re-renders
  const translateText = useCallback(async () => {
    console.log(`🌐 [useTranslation] Starting translation from ${originalLanguage} to ${targetLanguage}`);
    
    // If languages are the same, no need to translate
    if (originalLanguage === targetLanguage) {
      console.log(`🌐 [useTranslation] Languages are the same, no translation needed`);
      setTranslation(originalText);
      setIsLoading(false);
      return;
    }
    
    // If we already have a cached translation for this target language, use it
    if (translatedContent && typeof translatedContent === 'object' && translatedContent[targetLanguage]) {
      console.log(`🌐 [useTranslation] Using cached translation for ${targetLanguage}`);
      setTranslation(translatedContent[targetLanguage]);
      setIsCached(true);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setIsCached(false);
    
    try {
      console.log(`🌐 [useTranslation] Calling Edge Function to translate: "${originalText.substring(0, 50)}..."`);
      
      // Map target language to Google Translate code (dk -> da)
      const googleTargetLanguage = TRANSLATION_CONFIG.googleTranslateCodes[targetLanguage] || targetLanguage;
      
      // Call the Supabase Edge function to translate the text
      const { data, error: functionError } = await supabase.functions.invoke('translate-text', {
        body: JSON.stringify({
          text: originalText,
          sourceLanguage: originalLanguage || 'es',
          targetLanguage: googleTargetLanguage
        })
      });
      
      console.log("🌐 [useTranslation] Translation response:", data);
      
      if (functionError) {
        console.error("🌐 [useTranslation] Function error:", functionError);
        throw new Error(`Translation function error: ${functionError.message}`);
      }
      
      if (!data || !data.translation) {
        console.error("🌐 [useTranslation] No translation in response:", data);
        throw new Error('No translation returned from service');
      }
      
      console.log(`🌐 [useTranslation] Successfully translated to: "${data.translation.substring(0, 50)}..."`);
      setTranslation(data.translation);
      setIsCached(!!data.cached);
      setIsLoading(false);
    } catch (err) {
      console.error('🌐 [useTranslation] Translation error:', err);
      setError(t('common.translationError', { fallback: 'Error de traducción' }));
      // Fallback to the original text when translation fails
      setTranslation(originalText);
      setIsLoading(false);
    }
  }, [originalText, originalLanguage, targetLanguage, translatedContent, t]);

  // Retry translation with exponential backoff
  const retryTranslation = useCallback(async (retries = 2, delay = 1000) => {
    let currentRetry = 0;
    
    const attempt = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`🌐 [useTranslation] Retry ${currentRetry + 1}: Translating from ${originalLanguage} to ${targetLanguage}`);
        
        // Map target language to Google Translate code (dk -> da)
        const googleTargetLanguage = TRANSLATION_CONFIG.googleTranslateCodes[targetLanguage] || targetLanguage;
        
        const { data, error: functionError } = await supabase.functions.invoke('translate-text', {
          body: JSON.stringify({
            text: originalText,
            sourceLanguage: originalLanguage || 'es',
            targetLanguage: googleTargetLanguage
          })
        });
        
        if (functionError) throw new Error(functionError.message);
        if (!data || !data.translation) throw new Error('No translation data');
        
        console.log(`🌐 [useTranslation] Retry successful: Got translation data`);
        
        setTranslation(data.translation);
        setIsCached(!!data.cached);
        setIsLoading(false);
        return true;
      } catch (err) {
        if (currentRetry < retries) {
          currentRetry++;
          console.log(`🌐 [useTranslation] Translation retry ${currentRetry}/${retries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attempt(); // Recursively retry
        } else {
          console.error(`🌐 [useTranslation] All retries failed:`, err);
          setError(t('common.translationError', { fallback: 'Error de traducción' }));
          setTranslation(originalText);
          setIsLoading(false);
          return false;
        }
      }
    };
    
    return attempt();
  }, [originalText, originalLanguage, targetLanguage, t]);

  // Toggle between original text and translation
  const toggleLanguage = useCallback(() => {
    console.log(`🌐 [useTranslation] Toggling language, showOriginal was: ${showOriginal}`);
    setShowOriginal(prev => !prev);
  }, [showOriginal]);

  // Retry failed translation
  const retry = useCallback(() => {
    console.log(`🌐 [useTranslation] Retrying translation`);
    return retryTranslation();
  }, [retryTranslation]);

  // Load translation when component mounts or when key props change
  useEffect(() => {
    console.log(`🌐 [useTranslation] Effect triggered: ${originalLanguage} -> ${targetLanguage}`);
    
    // If languages are the same, no need to translate
    if (originalLanguage === targetLanguage) {
      console.log(`🌐 [useTranslation] Same language, setting original text`);
      setTranslation(originalText);
      return;
    }
    
    // If we already have a cached translation, use it
    if (translatedContent && typeof translatedContent === 'object' && translatedContent[targetLanguage]) {
      console.log(`🌐 [useTranslation] Found cached translation, using it`);
      setTranslation(translatedContent[targetLanguage]);
      setIsCached(true);
      return;
    }
    
    // Otherwise, load translation
    console.log(`🌐 [useTranslation] No cached translation found, calling translateText`);
    translateText();
  }, [originalText, originalLanguage, targetLanguage, translatedContent, translateText]);

  return {
    translation,
    isLoading,
    error,
    showOriginal,
    toggleLanguage,
    retry,
    isCached
  };
};
