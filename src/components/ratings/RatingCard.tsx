
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, CheckCircle2, Calendar } from 'lucide-react';
import { Rating } from '@/types/rating';
import StarRating from './StarRating';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface RatingCardProps {
  rating: Rating;
  userName: string;
}

const RatingCard: React.FC<RatingCardProps> = ({ rating, userName }) => {
  const formattedDate = formatDistanceToNow(parseISO(rating.date), { addSuffix: true, locale: es });
  
  return (
    <Card className="w-full mb-4 border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={userName} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{userName}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" /> 
              {formattedDate}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <StarRating rating={rating.rating} showValue={true} />
          {rating.verified && (
            <span className="ml-2 flex items-center text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Verificada
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{rating.comment}</p>
      </CardContent>
      {rating.transactionType && (
        <CardFooter className="pt-0 text-xs text-gray-500">
          Tipo de transacción: {rating.transactionType === 'purchase' ? 'Compra' : 
            rating.transactionType === 'exchange' ? 'Intercambio' : 
            rating.transactionType === 'service' ? 'Servicio' : 'Otra'}
        </CardFooter>
      )}
    </Card>
  );
};

export default RatingCard;
