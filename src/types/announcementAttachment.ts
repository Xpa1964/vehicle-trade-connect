export interface AnnouncementAttachment {
  id: string;
  announcement_id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
  updated_at?: string;
}