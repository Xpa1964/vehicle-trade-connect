
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useRatings } from '@/hooks/useRatings';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuickRatingDialogProps {
  userId: string;
  userName: string;
  trigger: React.ReactNode;
  onRatingSubmitted?: () => void;
}

const QuickRatingDialog: React.FC<QuickRatingDialogProps> = ({
  userId,
  userName,
  trigger,
  onRatingSubmitted
}) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const { createRating, isCreatingRating } = useRatings(userId);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: t('common.error'),
        description: t('rating.errorLogin'),
        variant: "destructive"
      });
      return;
    }

    if (user.id === userId) {
      toast({
        title: t('common.error'), 
        description: t('rating.errorSelfRate'),
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: t('common.error'),
        description: t('rating.errorSelectRating'),
        variant: "destructive"
      });
      return;
    }

    createRating({
      toUserId: userId,
      ratingData: {
        rating,
        comment,
        transactionType: 'general'
      }
    });

    // Mostrar mensaje de éxito personalizado
    toast({
      title: t('rating.successTitle'),
      description: t('rating.successDescription'),
      variant: "default"
    });

    setOpen(false);
    setRating(0);
    setComment('');
    onRatingSubmitted?.();
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return t('rating.experience1');
      case 2: return t('rating.experience2');
      case 3: return t('rating.experience3');
      case 4: return t('rating.experience4');
      case 5: return t('rating.experience5');
      default: return t('rating.selectStars');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-center uppercase tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('rating.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-3">
            <span className="font-semibold text-gray-700">{t('rating.userLabel')}</span> {userName}
            <br />
            <span className="text-gray-600 mt-2 block">
              {t('rating.description')}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-5 py-4">
            {/* Rating Stars - Optimizado */}
            <div className="grid gap-3">
              <Label className="text-lg font-semibold">{t('rating.ratingRequired')}</Label>
              <div className="flex items-center justify-center gap-2 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-all duration-200 hover:scale-125 transform"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-gray-700">
                  {getRatingText(hoveredRating || rating)}
                </p>
              </div>
            </div>

            {/* Comment - Optimizado */}
            <div className="grid gap-3">
              <Label htmlFor="comment" className="text-lg font-semibold">
                {t('rating.commentOptional')}
              </Label>
              <Textarea
                id="comment"
                placeholder={t('rating.commentPlaceholder')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] text-base"
              />
            </div>

            {/* Rating Guidelines - Más compacta */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold mb-2 text-blue-800">{t('rating.guideTitle')}</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>{t('rating.star1')}</div>
                <div>{t('rating.star2')}</div>
                <div>{t('rating.star3')}</div>
                <div>{t('rating.star4')}</div>
                <div>{t('rating.star5')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer fijo */}
        <DialogFooter className="flex-shrink-0 flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} size="lg">
            {t('rating.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isCreatingRating || rating === 0}
            size="lg"
            className={cn(
              "min-w-[150px]",
              rating > 0 ? "bg-yellow-500 hover:bg-yellow-600" : ""
            )}
          >
            {isCreatingRating ? (
              <>
                <Star className="w-4 h-4 mr-2 animate-spin" />
                {t('rating.submitting')}
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2 fill-current" />
                {t('rating.submit')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickRatingDialog;
