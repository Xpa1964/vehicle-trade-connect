import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isYouTube = videoUrl.includes('youtube.com/embed');

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[95vw] max-w-5xl bg-card rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="w-full aspect-video bg-black">
          {isYouTube ? (
            <iframe
              src={videoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
              referrerPolicy="strict-origin-when-cross-origin"
              title="YouTube video player"
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
      </div>
    </div>
  );
};

export default VideoPlayerModal;
