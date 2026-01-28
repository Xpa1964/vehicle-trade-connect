import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOGO_IMAGES } from '@/constants/imageAssets';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ForgotPassword: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError(t('auth.emailRequired'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setError(error.message);
      } else {
        setIsEmailSent(true);
        toast.success(t('auth.resetEmailSent'), {
          description: t('auth.checkEmailInstructions')
        });
      }
    } catch (err: any) {
      console.error('[ForgotPassword] Error:', err);
      setError(t('auth.resetPasswordError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-sm sm:max-w-md shadow-2xl">
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleReturnHome}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                {t('common.returnHome')}
              </Button>
            </div>
            
            {/* KONTACT VO Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src={LOGO_IMAGES.primary} 
                alt="KONTACT VO Logo" 
                className="h-16 w-auto drop-shadow-sm"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  console.log('Error loading primary logo, trying fallback');
                  e.currentTarget.src = LOGO_IMAGES.fallbacks[0];
                  e.currentTarget.onerror = () => {
                    console.log('Error loading fallback logo, using text fallback');
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'text-2xl font-bold text-primary';
                    fallback.textContent = 'KONTACT VO';
                    e.currentTarget.parentNode?.appendChild(fallback);
                  };
                }}
              />
            </div>
            
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-[#22C55E]">
              {t('auth.emailSent')}
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              {t('auth.checkEmailForInstructions')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('auth.didntReceiveEmail')}
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsEmailSent(false)}
                className="w-full"
              >
                {t('auth.tryAgain')}
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBackToLogin}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('auth.backToLogin')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm sm:max-w-md shadow-2xl">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleReturnHome}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              {t('common.returnHome')}
            </Button>
          </div>
          
          {/* KONTACT VO Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={LOGO_IMAGES.primary} 
              alt="KONTACT VO Logo" 
              className="h-16 w-auto drop-shadow-sm"
              loading="eager"
              fetchPriority="high"
              onError={(e) => {
                console.log('Error loading primary logo, trying fallback');
                e.currentTarget.src = LOGO_IMAGES.fallbacks[0];
                e.currentTarget.onerror = () => {
                  console.log('Error loading fallback logo, using text fallback');
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'text-2xl font-bold text-primary';
                  fallback.textContent = 'KONTACT VO';
                  e.currentTarget.parentNode?.appendChild(fallback);
                };
              }}
            />
          </div>
          
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            {t('auth.forgotPassword')}
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            {t('auth.enterEmailToReset')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 sm:h-10 text-base sm:text-sm touch-manipulation font-medium" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('auth.sendResetEmail')}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleBackToLogin}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('auth.backToLogin')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
