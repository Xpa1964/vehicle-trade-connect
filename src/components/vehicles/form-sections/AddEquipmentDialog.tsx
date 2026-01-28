import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

interface AddEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquipmentAdded: (equipmentId: string) => void;
}

export const AddEquipmentDialog: React.FC<AddEquipmentDialogProps> = ({
  open,
  onOpenChange,
  onEquipmentAdded,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['equipment-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_categories')
        .select('id, name')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data || [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !categoryId) {
      toast.error(t('vehicles.equipmentNameRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('equipment_items')
        .insert({
          name: name.trim(),
          standard_name: name.toLowerCase().trim(),
          category_id: categoryId,
          description: description.trim() || null,
          display_order: 9999, // Al final de la lista
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        toast.success(t('vehicles.equipmentAddedSuccess'));
        onEquipmentAdded(data.id);
        
        // Reset form
        setName('');
        setCategoryId('');
        setDescription('');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast.error(t('vehicles.equipmentAddError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('vehicles.addNewEquipment')}</DialogTitle>
          <DialogDescription>
            {t('vehicles.addNewEquipmentDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="equipment-name">
              {t('vehicles.equipmentName')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="equipment-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('vehicles.equipmentNamePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment-category">
              {t('vehicles.equipmentCategory')} <span className="text-destructive">*</span>
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger id="equipment-category">
                <SelectValue placeholder={t('vehicles.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment-description">
              {t('vehicles.equipmentDescription')}
            </Label>
            <Textarea
              id="equipment-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('vehicles.equipmentDescriptionPlaceholder')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t('common.saving')}
                </>
              ) : (
                t('common.save')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
