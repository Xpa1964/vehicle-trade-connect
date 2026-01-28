
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'pending_approval';
  created_at: string;
  updated_at: string;
  published_at?: string;
  tags: string[];
  author?: {
    full_name?: string;
  };
}

export interface BlogPostFormData {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'pending_approval';
  tags: string[];
}
