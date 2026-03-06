
import React from 'react';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';

interface AudioButtonProps {
  language: string;
  languageCode: string;
  audioUrl: string;
  className?: string;
  onVideoClick?: (videoUrl: string) => void;
}

const AudioButton: React.FC<AudioButtonProps> = ({ 
  language, 
  languageCode, 
  audioUrl, 
  className = "",
  onVideoClick
}) => {
  const handleAudioClick = () => {
    // Si es español, abrir el enlace de NotebookLM
    if (languageCode === 'es') {
      try {
        const notebookUrl = 'https://notebooklm.google.com/notebook/cdc7ee1f-3668-45d9-bd6a-93cdad0bed0d/audio';
        window.open(notebookUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error al abrir el enlace de audio:', error);
        alert('No se pudo abrir el audio. Por favor, intenta acceder directamente a NotebookLM.');
      }
      return;
    }
    
    // Si es italiano, abrir el enlace de NotebookLM
    if (languageCode === 'it') {
      try {
        const notebookUrl = 'https://notebooklm.google.com/notebook/566f281b-33bc-4b11-9560-09f7224ae6df/audio';
        window.open(notebookUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error al abrir el enlace de audio:', error);
        alert('No se pudo abrir el audio. Por favor, intenta acceder directamente a NotebookLM.');
      }
      return;
    }
    
    // Si es alemán, abrir el modal de video
    if (languageCode === 'de') {
      if (onVideoClick) {
        const videoUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/audio-files/okosystem-fur-fahrzeugprofis_wAkbhkCG.mp4`;
        onVideoClick(videoUrl);
      }
      return;
    }
    
    // Para otros idiomas, mostrar mensaje de próximamente
    alert(`Audio en ${language} próximamente disponible`);
  };

  return (
    <Button
      onClick={handleAudioClick}
      variant="outline"
      size="sm"
      className={`flex items-center space-x-2 ${className}`}
    >
      <Headphones className="h-4 w-4" />
      <span className="font-medium">{languageCode.toUpperCase()}</span>
    </Button>
  );
};

export default AudioButton;
