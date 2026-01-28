
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPostFormData } from '@/types/blog';
import BlogPostForm from '@/components/blog/BlogPostForm';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BlogPostCreate: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { createBlogPost, isLoading } = useBlogPosts();

  const handleSubmit = async (data: BlogPostFormData) => {
    const result = await createBlogPost(data);
    if (result) {
      navigate('/admin/blog-management');
    }
  };

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
          <h1 className="text-3xl font-bold">{t('blog.createPost', { fallback: 'Create Blog Post' })}</h1>
        </div>
        
        <div className="w-full">
          <BlogPostForm 
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostCreate;
