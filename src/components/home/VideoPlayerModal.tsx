import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title = 'Video Presentación'
}) => {
  const isYouTube = videoUrl.includes('youtube.com/embed');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="w-full aspect-video bg-black">
          {isYouTube ? (
            <iframe
              src={videoUrl}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full"
              frameBorder="0"
            />
          ) : (
            <video
              className="w-full h-full"
              controls
              playsInline
              preload="metadata"
              autoPlay
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
