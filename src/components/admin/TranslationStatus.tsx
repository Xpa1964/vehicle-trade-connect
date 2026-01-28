
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { findMissingTranslations, groupTranslationsByModule, calculateTranslationCompleteness } from '@/utils/translationUtils';
import { Language, languageNames } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslationStatusProps {
  initialTab?: 'all' | Language;
  showOnlyMissing?: boolean;
}

const TranslationStatus: React.FC<TranslationStatusProps> = ({ 
  initialTab = 'all',
  showOnlyMissing = false
}) => {
  const { t, currentLanguage } = useLanguage();
  const [completeness, setCompleteness] = useState<Record<Language, number>>({} as Record<Language, number>);
  const [missingTranslations, setMissingTranslations] = useState<any[]>([]);
  const [groupedTranslations, setGroupedTranslations] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | Language>(initialTab);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Calculate translation completeness percentage
        const completenessData = await calculateTranslationCompleteness();
        setCompleteness(completenessData);

        // Find missing translations
        const missingData = await findMissingTranslations();
        setMissingTranslations(missingData);

        // Group translations by module/section
        const grouped = groupTranslationsByModule(missingData);
        setGroupedTranslations(grouped);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };
    
    loadTranslations();
  }, []);

  const filteredTranslations = missingTranslations.filter(item => {
    // Filter by search query
    const matchesSearch = searchQuery ? 
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.englishValue && item.englishValue.toLowerCase().includes(searchQuery.toLowerCase())) :
      true;
    
    // Filter by selected language
    const matchesLanguage = selectedLanguage !== 'all' ? 
      item.missingIn.includes(selectedLanguage) :
      true;

    return matchesSearch && matchesLanguage;
  });

  const renderMissingLanguageBadges = (missingIn: Language[]) => {
    return missingIn.map(lang => (
      <Badge key={lang} variant="outline" className="mr-1 mb-1">
        {languageNames[lang]}
      </Badge>
    ));
  };

  return (
    <div className="space-y-8">
      {/* Translation Completion Progress */}
      {!showOnlyMissing && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">{t('control.translationStatus', { fallback: 'Translation Completion' })}</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(completeness).map(([lang, percentage]) => (
              <div key={lang} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{languageNames[lang as Language]}</span>
                  <span className="text-sm text-muted-foreground">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Translations */}
      <div className="space-y-4">
        {!showOnlyMissing && (
          <h3 className="font-medium text-lg">{t('common.missingTranslations')}</h3>
        )}
        
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input 
            placeholder={t('common.searchTranslations')} 
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Tabs value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as 'all' | Language)}>
            <TabsList>
              <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
              <TabsTrigger value="en">{languageNames.en}</TabsTrigger>
              <TabsTrigger value="fr">{languageNames.fr}</TabsTrigger>
              <TabsTrigger value="it">{languageNames.it}</TabsTrigger>
              <TabsTrigger value="es">{languageNames.es}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Missing Translations Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">{t('common.translationKey')}</TableHead>
                <TableHead>{t('common.englishValue')}</TableHead>
                <TableHead>{t('common.missingIn')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTranslations.length > 0 ? (
                filteredTranslations.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{item.key}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{item.englishValue || t('common.notAvailable')}</TableCell>
                    <TableCell>{renderMissingLanguageBadges(item.missingIn)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    {searchQuery 
                      ? t('common.noTranslationKeysMatch') 
                      : t('common.noMissingTranslations')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TranslationStatus;
