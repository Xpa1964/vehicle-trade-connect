
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LOGO_IMAGES } from '@/constants/imageAssets';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Home } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EmergencyReset from '@/components/auth/EmergencyReset';

const Login: React.FC = () => {
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('[Login] User is authenticated, redirecting to home');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`[Login] Attempting login with email: ${email}`);
      const success = await login(email, password);
      if (success) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('[Login] Error during login:', err);
      setError('Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };
  
  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg mb-4">Ya has iniciado sesión, redirigiendo...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
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
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="h-4 w-4" />
              {t('common.returnHome')}
            </Button>
          </div>
          
          {/* KONTACT VO Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={LOGO_IMAGES.primaryPNG} 
              alt="KONTACT VO Logo" 
              className="h-24 w-auto drop-shadow-sm"
              loading="eager"
              fetchPriority="high"
              onError={(e) => {
                console.log('Error loading primary logo, trying fallback');
                e.currentTarget.src = LOGO_IMAGES.fallbacks[0];
                e.currentTarget.onerror = () => {
                  console.log('Error loading fallback logo, using text fallback');
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'text-2xl font-bold text-auto-blue';
                  fallback.textContent = 'KONTACT VO';
                  e.currentTarget.parentNode?.appendChild(fallback);
                };
              }}
            />
          </div>
          
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            {t('auth.login')}
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            {t('auth.enterCredentials')}
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
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">{t('auth.password')}</Label>
                <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
                className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 sm:h-10 text-base sm:text-sm touch-manipulation font-medium" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('auth.login')}
            </Button>
          </form>
          
          {/* Emergency reset component */}
          <EmergencyReset />
        </CardContent>
        
        <CardFooter className="flex flex-col p-4 sm:p-6 pt-0">
          <p className="text-center text-sm text-gray-600">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="text-blue-500 hover:underline font-medium">
              {t('auth.register')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
