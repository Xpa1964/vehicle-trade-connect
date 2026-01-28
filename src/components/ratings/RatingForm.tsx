
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const ratingSchema = z.object({
  rating: z.number().min(1, 'Debe seleccionar una puntuación').max(5),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
});

type RatingFormData = z.infer<typeof ratingSchema>;

interface RatingFormProps {
  onSubmit: (data: RatingFormData) => void;
  recipientName: string;
}

const RatingForm: React.FC<RatingFormProps> = ({ onSubmit, recipientName }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
  });

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const handleFormSubmit = (data: RatingFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label className="text-base font-medium">
          Valorar a {recipientName}
        </Label>
        <p className="text-sm text-gray-600 mb-3">
          Comparte tu experiencia con este usuario
        </p>
      </div>

      {/* Star Rating */}
      <div className="space-y-2">
        <Label>Puntuación *</Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  star <= (hoverRating || selectedRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {selectedRating > 0 && (
              <>
                {selectedRating} de 5 estrellas
              </>
            )}
          </span>
        </div>
        {errors.rating && (
          <p className="text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="comment">Comentario *</Label>
        <Textarea
          id="comment"
          {...register('comment')}
          placeholder="Describe tu experiencia con este usuario..."
          rows={4}
          className="resize-none"
        />
        {errors.comment && (
          <p className="text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Enviar Valoración
      </Button>
    </form>
  );
};

export default RatingForm;
