
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X, Star, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImagePreview } from './types';

interface ImagePreviewGridProps {
  images: ImagePreview[];
  onReorder: (startIndex: number, endIndex: number) => void;
  onRemove: (index: number) => void;
  onSetPrimary: (index: number) => void;
  onEdit?: (index: number) => void;
}

export const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
  images,
  onReorder,
  onRemove,
  onSetPrimary,
  onEdit
}) => {
  const { t } = useLanguage();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="images" direction="horizontal">
        {(provided) => (
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
            ref={provided.innerRef} 
            {...provided.droppableProps}
          >
            {images.map((image, index) => (
              <Draggable key={`image-${index}`} draggableId={`image-${index}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`
                      relative group aspect-square rounded-lg overflow-hidden border-2 
                      ${image.isPrimary ? 'border-primary ring-2 ring-primary/20' : 'border-border'} 
                      ${snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'}
                      transition-all duration-200 cursor-grab active:cursor-grabbing
                    `}
                  >
                    {/* Image */}
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Primary badge */}
                    {image.isPrimary && (
                      <Badge className="absolute top-2 left-2 bg-auto-blue text-white">
                        <Star className="h-3 w-3 mr-1" />
                        {t('vehicles.primary', { fallback: 'Principal' })}
                      </Badge>
                    )}
                    
                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {!image.isPrimary && (
                        <Button 
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetPrimary(index);
                          }}
                          className="text-xs px-2"
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {onEdit && (
                        <Button 
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(index);
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(index);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Image number */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
