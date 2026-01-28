
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPost, BlogPostFormData } from '@/types/blog';
import BlogPostForm from '@/components/blog/BlogPostForm';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BlogPostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { updateBlogPost, isLoading } = useBlogPosts();

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!id
  });

  const handleSubmit = async (data: BlogPostFormData) => {
    if (!id) return;
    
    const result = await updateBlogPost(id, data);
    if (result) {
      navigate('/admin/blog-management');
    }
  };

  if (isLoadingPost) {
    return (
      <div className="w-full px-4 md:px-6 py-6">
        <div className="max-w-[1400px] mx-auto flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full px-4 md:px-6 py-6">
        <div className="max-w-[1400px] mx-auto text-center py-10">
          <h3 className="text-lg font-medium text-gray-500">
            {t('blog.postNotFound', { fallback: 'Blog post not found' })}
          </h3>
          <Button className="mt-4" onClick={() => navigate('/admin/blog-management')}>
            {t('common.back', { fallback: 'Back' })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 py-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center gap-3 w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin/blog-management')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{t('blog.editPost', { fallback: 'Edit Blog Post' })}</h1>
        </div>
        
        <div className="w-full">
          <BlogPostForm 
            onSubmit={handleSubmit}
            initialData={post}
            isSubmitting={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostEdit;
