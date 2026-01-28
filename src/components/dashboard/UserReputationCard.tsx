
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { UserWithMeta } from '@/types/auth';
import StarRating from '@/components/ratings/StarRating';
import { useRatings } from '@/hooks/useRatings';

interface UserReputationCardProps {
  user: UserWithMeta;
}

const UserReputationCard: React.FC<UserReputationCardProps> = ({ user }) => {
  const { ratingSummary, ratingsLoading } = useRatings(user?.id);
  
  return (
    <Card className="bg-card border-sky-400/50 border-l-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-foreground">
          <Star className="w-5 h-5 mr-2 text-sky-400" />
          Tu reputación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="mr-4">
            {ratingsLoading ? (
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-muted-foreground">Cargando...</span>
              </div>
            ) : (
              <StarRating 
                rating={ratingSummary?.average_rating || 0} 
                size={24} 
                showValue 
              />
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Basado en {ratingSummary?.total_ratings || 0} valoraciones</p>
            {ratingSummary?.verified_ratings && ratingSummary.verified_ratings > 0 ? (
              <p className="text-[#22C55E]">{ratingSummary.verified_ratings} valoraciones verificadas</p>
            ) : null}
          </div>
          <div className="ml-auto">
            <Button variant="outline" asChild>
              <Link to={`/user/${user.id}`}>Ver perfil</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserReputationCard;
