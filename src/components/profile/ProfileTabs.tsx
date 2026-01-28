
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserWithMeta } from '@/types/auth';
import RatingForm from '@/components/ratings/RatingForm';
import RatingCard from '@/components/ratings/RatingCard';
import { useRatings } from '@/hooks/useRatings';
import PrivacySettings from './PrivacySettings';

// Tipo unificado para manejar datos del usuario
type DisplayUser = {
  id?: string;
  email?: string;
  created_at?: string;
  profile?: {
    full_name?: string;
    company_name?: string;
    business_type?: string;
    contact_phone?: string;
    country?: string;
    address?: string;
    trader_type?: string;
    registration_date?: string;
    total_operations?: number;
    operations_breakdown?: {
      buys?: number;
      sells?: number;
      exchanges?: number;
    };
    show_contact_details?: boolean;
    show_location_details?: boolean;
    show_business_stats?: boolean;
    company_logo?: string;
    created_at?: string;
    updated_at?: string;
  };
};

interface ProfileTabsProps {
  user?: UserWithMeta;
  isCurrentUser?: boolean;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  profileData?: any;
  userRating?: any;
  onRatingSubmit?: (data: any) => void;
  onProfileUpdate?: () => void;
  getValueFromJson?: (jsonData: any, key: string, defaultValue?: number) => number;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  user, 
  isCurrentUser = false,
  activeTab,
  setActiveTab,
  profileData,
  userRating,
  onRatingSubmit,
  onProfileUpdate,
  getValueFromJson
}) => {
  const { t } = useLanguage();
  const { ratings, ratingsLoading } = useRatings(user?.id);

  // Crear displayUser unificado con acceso seguro
  const displayUser: DisplayUser = user ? {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    profile: user.profile
  } : {
    profile: profileData
  };

  // Only show privacy settings for own profile
  const tabsList = isCurrentUser 
    ? [
        { value: 'info', label: t('profile.info') },
        { value: 'ratings', label: t('profile.ratings') },
        { value: 'privacy', label: t('profile.privacy') }
      ]
    : [
        { value: 'info', label: t('profile.info') },
        { value: 'ratings', label: t('profile.ratings') }
      ];

  const TabsComponent = activeTab && setActiveTab 
    ? ({ children, ...props }: any) => (
        <Tabs value={activeTab} onValueChange={setActiveTab} {...props}>
          {children}
        </Tabs>
      )
    : Tabs;

  return (
    <TabsComponent defaultValue="info" className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabsList.length}, 1fr)` }}>
        {tabsList.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.info')}</CardTitle>
            <CardDescription>{t('profile.profileDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{t('profile.companyName')}</p>
                <p className="text-base">{displayUser.profile?.company_name || t('profile.notSpecified')}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">{t('profile.businessType')}</p>
                <p className="text-base">{displayUser.profile?.business_type || t('profile.notSpecified')}</p>
              </div>
              
              {/* Show contact details only if privacy setting allows it or it's own profile */}
              {(isCurrentUser || displayUser.profile?.show_contact_details) && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('profile.email')}</p>
                    <p className="text-base">{displayUser.email || t('profile.notSpecified')}</p>
                  </div>
                  
                  {displayUser.profile?.contact_phone && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('profile.phone')}</p>
                      <p className="text-base">{displayUser.profile.contact_phone}</p>
                    </div>
                  )}
                </>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">{t('profile.country')}</p>
                <p className="text-base">{displayUser.profile?.country || t('profile.notSpecified')}</p>
              </div>
              
              {/* Show full address only if privacy setting allows it or it's own profile */}
              {(isCurrentUser || displayUser.profile?.show_location_details) && displayUser.profile?.address && (
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('profile.address')}</p>
                  <p className="text-base">{displayUser.profile.address}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">{t('profile.traderType')}</p>
                <Badge variant="outline">{displayUser.profile?.trader_type || 'buyer_seller'}</Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">{t('profile.memberSince')}</p>
                <p className="text-base">
                  {new Date(displayUser.profile?.registration_date || displayUser.profile?.created_at || displayUser.created_at || new Date()).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Show business stats only if privacy setting allows it or it's own profile */}
            {(isCurrentUser || displayUser.profile?.show_business_stats) && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">{t('profile.businessStats')}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {displayUser.profile?.total_operations || 0}
                    </p>
                    <p className="text-sm text-gray-500">{t('profile.totalOperations')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {displayUser.profile?.operations_breakdown?.buys || 0}
                    </p>
                    <p className="text-sm text-gray-500">{t('profile.purchases')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {displayUser.profile?.operations_breakdown?.sells || 0}
                    </p>
                    <p className="text-sm text-gray-500">{t('profile.sales')}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ratings" className="space-y-4">
        {!isCurrentUser && (
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.rateUser')}</CardTitle>
              <CardDescription>{t('profile.rateExperience')}</CardDescription>
            </CardHeader>
            <CardContent>
              <RatingForm 
                onSubmit={onRatingSubmit || ((data) => {
                  console.log('Rating submitted:', data);
                })}
                recipientName={displayUser.profile?.company_name || displayUser.profile?.full_name || t('profile.user')}
              />
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.ratings')}</CardTitle>
            <CardDescription>
              {userRating?.ratings?.length || ratings?.length ? 
                `${userRating?.ratings?.length || ratings?.length} ${t('profile.ratingsCount')}` : 
                t('profile.noRatings')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ratingsLoading ? (
              <p>{t('profile.loadingRatings')}</p>
            ) : (userRating?.ratings?.length || ratings?.length) ? (
              <div className="space-y-4">
                {(userRating?.ratings || ratings)?.map((rating: any) => (
                  <RatingCard 
                    key={rating.id} 
                    rating={{
                      id: rating.id,
                      fromUserId: rating.fromUserId || rating.from_user_id,
                      toUserId: rating.toUserId || rating.to_user_id,
                      rating: rating.rating,
                      comment: rating.comment,
                      date: rating.date || rating.created_at,
                      verified: rating.verified,
                      transactionType: rating.transactionType || rating.transaction_type
                    }}
                    userName={rating.reviewerName || rating.from_user_profile?.company_name || rating.from_user_profile?.full_name || t('profile.anonymousUser')}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">{t('profile.noRatings')}</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {isCurrentUser && (
        <TabsContent value="privacy" className="space-y-4">
          <PrivacySettings initialSettings={{
            show_contact_details: displayUser.profile?.show_contact_details,
            show_location_details: displayUser.profile?.show_location_details,
            show_business_stats: displayUser.profile?.show_business_stats
          }} />
        </TabsContent>
      )}
    </TabsComponent>
  );
};

export default ProfileTabs;
