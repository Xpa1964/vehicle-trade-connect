
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BlogPostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post-view', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`*, author:profiles(full_name)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">
          {t('blog.postNotFound', { fallback: 'Blog post not found' })}
        </h3>
        <Button className="mt-4" onClick={() => navigate('/blog')}>
          {t('common.back', { fallback: 'Back' })}
        </Button>
      </div>
    );
  }

  const isAuthor = user?.id === post.author_id;
  const formattedDate = new Date(post.created_at).toLocaleDateString();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back', { fallback: 'Back' })}
        </Button>
        
        {isAuthor && (
          <Button asChild variant="outline">
            <a href={`/blog-management/edit/${post.id}`}>
              <Edit className="h-4 w-4 mr-1" />
              {t('common.edit', { fallback: 'Edit' })}
            </a>
          </Button>
        )}
      </div>
      
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{post.author?.full_name || t('blog.unknownAuthor', { fallback: 'Unknown' })}</span>
                <span>•</span>
                <span>{formattedDate}</span>
                <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                  {post.status === 'published' ? t('blog.published', { fallback: 'Published' }) : t('blog.draft', { fallback: 'Draft' })}
                </Badge>
              </div>
            </div>
          </div>
          
          {post.featured_image && (
            <div className="my-6">
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-auto rounded-lg object-cover max-h-[400px]"
              />
            </div>
          )}
          
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPostView;
