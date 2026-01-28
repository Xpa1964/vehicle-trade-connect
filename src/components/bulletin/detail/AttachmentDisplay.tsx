import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Download, FileText, Image, Archive, Music, Video, File, Paperclip } from 'lucide-react';
import { useAnnouncementAttachments } from '@/hooks/useAnnouncementAttachments';
import { Announcement } from '@/types/announcement';
import { supabase } from '@/integrations/supabase/client';
import AnnouncementImageGallery from './AnnouncementImageGallery';

interface AttachmentDisplayProps {
  announcement: Announcement;
  currentUserId?: string;
}

const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({
  announcement,
  currentUserId
}) => {
  const { attachments, loading, deleting, deleteAttachment } = useAnnouncementAttachments(announcement.id);
  
  if (loading) {
    return (
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium mb-3">Archivos adjuntos</h4>
        <div className="text-sm text-muted-foreground">Cargando archivos...</div>
      </div>
    );
  }

  if (!attachments || attachments.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'txt':
        return <FileText className="h-6 w-6 text-gray-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return <Image className="h-6 w-6 text-green-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive className="h-6 w-6 text-purple-500" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music className="h-6 w-6 text-orange-500" />;
      case 'mp4':
      case 'avi':
      case 'mkv':
      case 'mov':
        return <Video className="h-6 w-6 text-pink-500" />;
      default:
        return <File className="h-6 w-6 text-gray-400" />;
    }
  };

  const isImage = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDelete = async (attachmentId: string) => {
    await deleteAttachment(attachmentId);
  };

  const getFileUrl = (attachment: any) => {
    return supabase.storage.from('announcement_attachments').getPublicUrl(attachment.storage_path).data.publicUrl;
  };

  const canDelete = currentUserId === announcement.user_id;

  // Separate images from other files
  const imageAttachments = attachments.filter(attachment => isImage(attachment.file_name));
  const fileAttachments = attachments.filter(attachment => !isImage(attachment.file_name));

  return (
    <div className="space-y-8">
      {/* Images Gallery */}
      {imageAttachments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Galería de Imágenes</h3>
          </div>
          <AnnouncementImageGallery 
            images={imageAttachments.map(att => ({
              id: att.id,
              file_name: att.file_name,
              storage_path: att.storage_path
            }))} 
          />
        </div>
      )}

      {/* Document Files */}
      {fileAttachments.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Paperclip className="h-5 w-5 text-primary" />
              Archivos Adjuntos ({fileAttachments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {fileAttachments.map((attachment, index) => (
                <div 
                  key={attachment.id} 
                  className="flex items-center justify-between p-6 hover:bg-muted/20 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                      {getFileIcon(attachment.file_name)}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {attachment.file_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(attachment.file_size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(getFileUrl(attachment))}
                      className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                    
                    {canDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(attachment.id)}
                        disabled={deleting === attachment.id}
                        className="text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttachmentDisplay;