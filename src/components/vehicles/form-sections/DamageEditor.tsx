
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image } from 'lucide-react';

interface Damage {
  id?: string;
  damage_type: 'exterior' | 'interior' | 'mechanical';
  title: string;
  description?: string;
  severity: 'minor' | 'moderate' | 'severe';
  location?: string;
  estimated_cost?: number;
  images?: File[];
}

interface DamageEditorProps {
  damage: Damage;
  onSave: (damage: Damage) => void;
  onCancel: () => void;
}

export const DamageEditor: React.FC<DamageEditorProps> = ({ damage, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Damage>(damage);
  const [selectedImages, setSelectedImages] = useState<File[]>(damage.images || []);

  const handleInputChange = (field: keyof Damage, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...files] }));
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      return; // Don't save if title is empty
    }
    onSave({ ...formData, images: selectedImages });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título del Daño *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ej: Rayón en puerta delantera"
          />
        </div>
        
        <div>
          <Label htmlFor="severity">Severidad</Label>
          <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minor">Menor</SelectItem>
              <SelectItem value="moderate">Moderado</SelectItem>
              <SelectItem value="severe">Severo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Ej: Puerta delantera izquierda"
          />
        </div>
        
        <div>
          <Label htmlFor="estimated_cost">Costo Estimado (€)</Label>
          <Input
            id="estimated_cost"
            type="number"
            value={formData.estimated_cost || ''}
            onChange={(e) => handleInputChange('estimated_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe el daño en detalle..."
          rows={3}
        />
      </div>

      <div>
        <Label>Imágenes del Daño</Label>
        <div className="mt-2">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Subir imágenes del daño</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {selectedImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <Card>
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        <span className="text-xs truncate">{image.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" onClick={handleSave} disabled={!formData.title.trim()}>
          Guardar Daño
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
