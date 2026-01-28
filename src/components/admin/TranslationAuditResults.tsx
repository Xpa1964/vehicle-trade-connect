import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { findMissingTranslations, calculateTranslationCompleteness, groupTranslationsByModule } from '@/utils/translationUtils';
import { toast } from 'sonner';

interface AuditResults {
  completeness: Record<string, number>;
  missingCount: number;
  isComplete: boolean;
  groupedMissing: Record<string, any[]>;
}

export const TranslationAuditResults = () => {
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const performAudit = async () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1); // Force refresh
    try {
      // Force a fresh import of translations to clear any caching
      const missingTranslations = await findMissingTranslations();
      const completeness = await calculateTranslationCompleteness();
      const groupedMissing = groupTranslationsByModule(missingTranslations);
      
      const results: AuditResults = {
        completeness,
        missingCount: missingTranslations.length,
        isComplete: Object.values(completeness).every(p => p === 100),
        groupedMissing
      };
      
      setAuditResults(results);
      
      console.log('Audit results:', {
        missingCount: results.missingCount,
        completeness: results.completeness,
        groupedMissing: Object.keys(results.groupedMissing)
      });
      
      if (results.isComplete) {
        toast.success('🎉 All translations are complete!');
      } else {
        toast.warning(`Found ${results.missingCount} missing translations`);
      }
    } catch (error) {
      console.error('Audit error:', error);
      toast.error('Error performing translation audit');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performAudit();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Auditing Translations...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Analyzing translation completeness...</div>
        </CardContent>
      </Card>
    );
  }

  if (!auditResults) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p>Failed to load audit results</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {auditResults.isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            )}
            Translation System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {auditResults.isComplete
                  ? '✅ All translations are complete'
                  : `⚠️ ${auditResults.missingCount} missing translations found`}
              </p>
            </div>
            <Button onClick={performAudit} variant="outline" size="sm" key={refreshKey}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Language Completeness */}
      <Card>
        <CardHeader>
          <CardTitle>Language Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(auditResults.completeness).map(([lang, percentage]) => (
              <div key={lang} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium uppercase">{lang}</span>
                  {percentage === 100 && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <Badge variant={percentage === 100 ? "default" : "secondary"}>
                  {percentage}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Missing Translations Details */}
      {!auditResults.isComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Missing Translations by Module</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(auditResults.groupedMissing).length === 0 ? (
              <p className="text-muted-foreground">No missing translations found.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(auditResults.groupedMissing).map(([module, differences]) => (
                  <div key={module} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{module}</h4>
                    <div className="space-y-1 text-sm">
                      {differences.slice(0, 5).map((diff: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center">
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">{diff.key}</code>
                          <span className="text-muted-foreground text-xs">
                            Missing in: {diff.missingIn.join(', ')}
                          </span>
                        </div>
                      ))}
                      {differences.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          ...and {differences.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};