
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Star, User, Building2, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import UserRatingBadge from './UserRatingBadge';
import { useRatings } from '@/hooks/useRatings';
import { useAuth } from '@/contexts/AuthContext';
import { directChatService } from '@/services/directChat';
import { toast } from 'sonner';

interface UserCardWithSelectionProps {
  userId: string;
  userName?: string;
  companyName?: string;
  businessType?: string;
  country?: string;
  companyLogo?: string;
  isSelected?: boolean;
  onSelectionChange?: (userId: string, selected: boolean) => void;
  showSelection?: boolean;
}

const UserCardWithSelection: React.FC<UserCardWithSelectionProps> = ({
  userId,
  userName,
  companyName,
  businessType,
  country,
  companyLogo,
  isSelected = false,
  onSelectionChange,
  showSelection = false
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ratingSummary } = useRatings(userId);
  
  const displayName = companyName || userName || 'Usuario';
  
  const businessTypeLabels: Record<string, string> = {
    'dealer': 'Concesionario',
    'multibrand_used': 'Multimarca VO',
    'buy_sell': 'Compraventa',
    'rent_a_car': 'Rent a Car',
    'renting': 'Renting',
    'workshop': 'Taller',
    'importer': 'Importador',
    'exporter': 'Exportador',
    'trader': 'Comerciante',
    'other': 'Otro'
  };

  const handleDirectContact = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para contactar');
      return;
    }

    if (user.id === userId) {
      toast.error('No puedes contactarte a ti mismo');
      return;
    }

    const conversationId = await directChatService.createDirectConversation(
      user.id, 
      userId, 
      'Hola, me pongo en contacto contigo desde el directorio de usuarios.'
    );

    if (conversationId) {
      navigate('/messages');
      toast.success('Conversación iniciada correctamente');
    }
  };

  const handleSelectionChange = (checked: boolean) => {
    onSelectionChange?.(userId, checked);
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="text-center pb-2">
        <div className="flex justify-between items-start mb-3">
          {showSelection && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleSelectionChange}
              className="mt-1"
            />
          )}
          
          <div className="flex-1 flex justify-center">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${displayName} logo`}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {displayName[0].toUpperCase()}
              </div>
            )}
          </div>
          
          {!showSelection && <div className="w-6"></div>}
        </div>
        
        <CardTitle className="text-lg">{displayName}</CardTitle>
        {businessType && (
          <Badge variant="outline" className="text-xs w-fit mx-auto">
            {businessTypeLabels[businessType] || businessType}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Contact Person */}
        {userName && companyName && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-1" />
            <span>{userName}</span>
          </div>
        )}
        
        {/* Location */}
        {country && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{country}</span>
          </div>
        )}

        {/* Rating */}
        {ratingSummary && ratingSummary.total_ratings > 0 && (
          <div className="flex justify-center">
            <UserRatingBadge
              averageRating={Number(ratingSummary.average_rating)}
              totalRatings={Number(ratingSummary.total_ratings)}
              verifiedRatings={Number(ratingSummary.verified_ratings)}
              compact
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Link to={`/user/${userId}`} className="block">
            <Button className="w-full" size="sm">
              <Building2 className="w-4 h-4 mr-2" />
              Ver Perfil Completo
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={handleDirectContact}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contactar Directamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCardWithSelection;
