
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, CheckCircle2, Calendar, Languages } from 'lucide-react';
import { Rating } from '@/types/rating';
import StarRating from './StarRating';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es, fr, de, it, nl, pt, pl } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface RatingCardProps {
  rating: Rating;
  userName: string;
}

const localeMap: Record<string, typeof es> = { es, fr, de, it, nl, pt, pl };

const RatingCard: React.FC<RatingCardProps> = ({ rating, userName }) => {
  const { t, currentLanguage } = useLanguage();
  const locale = localeMap[currentLanguage] || undefined;
  const formattedDate = formatDistanceToNow(parseISO(rating.date), { addSuffix: true, locale });

  const [translatedComment, setTranslatedComment] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!rating.comment) return;
    setTranslatedComment(null);
    
    const translateComment = async () => {
      setIsTranslating(true);
      try {
        const { data, error } = await supabase.functions.invoke('translate-text', {
          body: { text: rating.comment, sourceLanguage: 'es', targetLanguage: currentLanguage }
        });
        if (!error && data?.translation) {
          setTranslatedComment(data.translation);
        }
      } catch (err) {
        console.error('Translation error:', err);
      } finally {
        setIsTranslating(false);
      }
    };

    if (currentLanguage !== 'es') {
      translateComment();
    }
  }, [rating.comment, currentLanguage]);

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'purchase': return t('rating.transactionPurchase');
      case 'exchange': return t('rating.transactionExchange');
      case 'service': return t('rating.transactionService');
      default: return t('rating.transactionOther');
    }
  };

  return (
    <Card className="w-full mb-4 border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={userName} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{userName}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" /> 
              {formattedDate}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <StarRating rating={rating.rating} showValue={true} />
          {rating.verified && (
            <span className="ml-2 flex items-center text-xs text-green-400">
              <CheckCircle2 className="h-3 w-3 mr-1" /> {t('rating.verified')}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">
          {translatedComment || rating.comment}
        </p>
        {isTranslating && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Languages className="h-3 w-3 animate-pulse" /> {t('rating.translating') || 'Translating...'}
          </p>
        )}
      </CardContent>
      {rating.transactionType && (
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          {t('rating.transactionType')}: {getTransactionLabel(rating.transactionType)}
        </CardFooter>
      )}
    </Card>
  );
};

export default RatingCard;
