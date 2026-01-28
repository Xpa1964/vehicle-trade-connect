
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Headphones, ArrowLeft, Pin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AudioLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language: string;
  languageCode: string;
}

const AudioLinkModal: React.FC<AudioLinkModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  language,
  languageCode
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-blue-600" />
            Audio en {language}
          </DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <p>
              El audio se abrirá en una nueva pestaña de NotebookLM de Google.
            </p>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Pin className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">
                  ✨ ¡Novedad! Botón de regreso persistente
                </p>
              </div>
              <p className="text-sm text-green-700">
                Aparecerá un botón flotante en la esquina inferior derecha que te permitirá regresar fácilmente a KONTACT VO cuando termines de escuchar.
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">
                💡 Instrucciones:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• El audio se abrirá en NotebookLM</li>
                <li>• Verás un botón persistente de regreso</li>
                <li>• Haz clic en el botón cuando termines de escuchar</li>
                <li>• También puedes usar Alt+Tab para cambiar de pestaña</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Audio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioLinkModal;
