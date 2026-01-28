import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOGO_IMAGES } from '@/constants/imageAssets';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Home, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      if (!accessToken || !refreshToken) {
        setError(t('auth.invalidResetLink'));
        setIsCheckingToken(false);
        return;
      }

      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) {
          setError(t('auth.invalidOrExpiredToken'));
        } else {
          setIsValidToken(true);
        }
      } catch (err) {
        console.error('[ResetPassword] Token validation error:', err);
        setError(t('auth.invalidResetLink'));
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password || !confirmPassword) {
      setError(t('auth.fillAllFields'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        toast.success(t('auth.passwordUpdatedSuccessfully'), {
          description: t('auth.redirectingToLogin')
        });
        
        // Sign out and redirect to login
        await supabase.auth.signOut();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('[ResetPassword] Error:', err);
      setError(t('auth.updatePasswordError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('auth.validatingToken')}</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
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
            
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-destructive">
              {t('auth.invalidLink')}
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              {error}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('auth.requestNewResetLink')}
              </p>
              <Button 
                onClick={() => navigate('/forgot-password')}
                className="w-full"
              >
                {t('auth.forgotPassword')}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
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
          
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-foreground">
            {t('auth.resetPassword')}
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            {t('auth.enterNewPassword')}
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
              <Label htmlFor="password" className="text-sm font-medium">{t('auth.newPassword')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation pr-10"
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation pr-10"
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 sm:h-10 text-base sm:text-sm touch-manipulation font-medium" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('auth.updatePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
