
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const MyProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log('🔍 MyProfile Debug:', {
    currentUserId: user?.id,
    willRedirectTo: user?.id ? `/user/${user.id}` : '/login'
  });

  // Si el usuario está logueado, redirigir a su perfil específico
  React.useEffect(() => {
    if (user?.id) {
      console.log('🔄 MyProfile redirecting to:', `/user/${user.id}`);
      navigate(`/user/${user.id}`, { replace: true });
    } else {
      console.log('🔄 No user found, staying on MyProfile page');
    }
  }, [user?.id, navigate]);

  // Si no hay usuario, mostrar mensaje de login
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto">
          <User className="h-4 w-4" />
          <AlertDescription>
            <strong>Necesitas iniciar sesión para ver tu perfil.</strong>
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Mientras se redirige
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert className="max-w-md mx-auto bg-green-50 border-green-200">
        <User className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>📝 Redirigiendo a tu perfil...</strong>
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <Building2 className="h-4 w-4 mr-2" />
              Ir a Dashboard
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MyProfile;
