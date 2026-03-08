
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/shared/BackButton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRatings } from '@/hooks/useRatings';
import { useLanguage } from '@/contexts/LanguageContext';
import ProfileSummary from '@/components/profile/ProfileSummary';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { getUserRating } from '@/utils/ratingUtils';
import { LOGO_IMAGES } from '@/constants/imageAssets';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  console.log('🔍 ProfilePage Debug:', {
    urlUserId: id,
    currentUserId: user?.id,
    route: window.location.pathname
  });

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto bg-card border-border">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-foreground">
            ID de usuario no encontrado. <Button variant="link" onClick={() => navigate('/users')} className="p-0 h-auto text-primary">Ver directorio de usuarios</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isOwnProfileByRoute = user?.id === id;
  
  console.log('🔍 ProfilePage Ownership Check:', {
    currentUserId: user?.id,
    profileUserId: id,
    isOwnProfileByRoute,
    route: `/user/${id}`
  });

  // Query optimizada para obtener el perfil
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', id, user?.id],
    queryFn: async () => {
      console.log('🔍 Fetching profile for ID:', id);

      // If this is own profile route, fetch full profile through standard RLS path
      if (user?.id === id) {
        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', id)
          .maybeSingle();

        if (!data && !error) {
          const byProfileId = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          data = byProfileId.data;
          error = byProfileId.error;
        }

        if (error) {
          console.error('Error fetching own profile:', error);
          throw error;
        }

        console.log('🔍 Own profile data received:', data);
        return data;
      }

      // For external profiles (including imported IDs), use secure backend function
      const { data: publicProfile, error: publicError } = await supabase
        .rpc('get_public_profile_by_identifier', { p_identifier: id });

      if (publicError) {
        console.error('Error fetching public profile:', publicError);
        throw publicError;
      }

      console.log('🔍 Public profile data received:', publicProfile);
      return publicProfile as any;
    },
    enabled: !!id,
    retry: 1,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  const profileOwnerId = profile?.user_id || profile?.id || id;
  const isOwnProfile = !!user?.id && !!profileOwnerId && user.id === profileOwnerId;

  // Obtener ratings del usuario (siempre contra user_id real)
  const { ratings, ratingSummary, ratingsLoading } = useRatings(profileOwnerId);
  const userRating = getUserRating(profileOwnerId);

  console.log('⭐ ProfilePage - ratingSummary:', ratingSummary);
  console.log('🔍 ProfilePage - profile data:', profile);
  console.log('🔍 ProfilePage - loading:', isLoading);
  console.log('🔍 ProfilePage - error:', error);

  if (isLoading || ratingsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium text-foreground">{t('profile.loading')}</div>
          {isLoading && <div className="text-sm text-muted-foreground">{t('profile.loadingUser')}</div>}
          {ratingsLoading && <div className="text-sm text-muted-foreground">{t('profile.loadingRatingsData')}</div>}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('🔍 ProfilePage error:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto bg-card border-border">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-foreground">
            Error al cargar el perfil: {error.message}. <Button variant="link" onClick={() => navigate('/users')} className="p-0 h-auto text-primary">Ver directorio de usuarios</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto bg-card border-border">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-foreground">
            Perfil no encontrado para el ID: {id}. <Button variant="link" onClick={() => navigate('/users')} className="p-0 h-auto text-primary">Ver directorio de usuarios</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayName = profile.company_name || profile.full_name || 'Usuario';
  const publicProfileData = { ...profile, id: profileOwnerId };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Aquí iría la lógica para contactar (abrir chat, etc.)
    console.log('Contactar usuario:', profileOwnerId);
  };

  const handleRatingSubmitted = () => {
    // Recargar datos después de enviar una valoración
    refetch();
    window.location.reload();
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con logo de Kontact y navegación */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img 
            src={LOGO_IMAGES.primary}
            alt="KONTACT VO Logo" 
            className="h-8 w-auto"
            onError={(e) => {
              console.log('Error loading brand logo, using fallback');
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-xl font-bold text-primary">KONTACT VO</span>
        </div>
        <BackButton />
      </div>

      {/* Header con información más clara */}
      <div className="mb-6">
        {isOwnProfile ? (
          <Alert className="bg-primary/10 border-primary/20">
            <User className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              <strong>📝 {t('profile.user', { fallback: 'Este es tu perfil personal.' })}</strong> Otros usuarios pueden encontrarte y valorarte desde aquí.
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  <Building2 className="h-4 w-4 mr-2" />
                  {t('common.backToDashboard', { fallback: 'Ir a Dashboard' })}
                </Button>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="ml-2">
                    {t('profile.editProfile')}
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-info/10 border-info/20">
            <Info className="h-4 w-4 text-info" />
            <AlertDescription className="text-foreground">
              <strong>🌟 {t('profile.info', { fallback: 'Perfil de' })} {displayName}.</strong> Puedes valorar a este usuario para compartir tu experiencia.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Contenido principal */}
      {isEditing && isOwnProfile ? (
        <ProfileEditForm 
          profileData={profile}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <ProfileSummary
              profileData={publicProfileData}
              userRating={userRating}
              isCurrentUser={isOwnProfile}
              onContact={handleContact}
              onRate={handleRatingSubmitted}
              user={user}
            />
          </div>
          
          {/* Profile Tabs */}
          <div className="lg:col-span-2">
            <ProfileTabs
              user={user}
              isCurrentUser={isOwnProfile}
              profileData={publicProfileData}
              userRating={{ ratings }}
              onRatingSubmit={handleRatingSubmitted}
              onProfileUpdate={refetch}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
