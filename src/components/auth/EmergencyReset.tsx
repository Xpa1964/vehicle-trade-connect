
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const EmergencyReset: React.FC = () => {
  const { t } = useLanguage();
  
  const handleClearStorage = () => {
    try {
      // Clear all auth-related localStorage items
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      localStorage.removeItem('supabase.auth.refresh_token');
      
      // Clear role caches
      const roleCacheKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_role_')) {
          roleCacheKeys.push(key);
        }
      }
      
      roleCacheKeys.forEach(key => localStorage.removeItem(key));
      
      toast.success(t('auth.authCacheCleared'));
      
      // Reload the page after a small delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (error) {
      console.error('Failed to clear cache:', error);
      toast.error(t('auth.authCacheClearFailed'));
    }
  };
  
  return (
    <div className="mt-6 p-4 border border-border rounded-md bg-secondary">
      <h3 className="font-semibold text-foreground">{t('auth.loginProblems')}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        {t('auth.loginProblemsDescription')}
      </p>
      <Button 
        variant="outline"
        size="sm"
        onClick={handleClearStorage}
      >
        {t('auth.resetAuth')}
      </Button>
    </div>
  );
};

export default EmergencyReset;
