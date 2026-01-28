
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LOGO_IMAGES } from '@/constants/imageAssets';

const BlogList: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch all published blog posts
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['public-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`*, author:profiles(full_name)`)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    }
  });

  const filteredPosts = blogPosts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-6 pt-4 px-4">
      <div className="flex items-center gap-4">
        <img 
          src={LOGO_IMAGES.primary}
          alt="KONECT VO Logo" 
          className="h-12 w-auto"
          loading="eager"
        />
        <div>
          <h1 className="text-3xl font-bold">{t('blog.title', { fallback: 'Blog' })}</h1>
          <p className="text-muted-foreground">
            {t('blog.description', { fallback: 'Explore our latest articles and industry insights' })}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder={t('blog.search', { fallback: 'Search blog posts...' })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map(post => {
              const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString();
              const truncatedExcerpt = post.excerpt 
                ? post.excerpt.length > 100 
                  ? post.excerpt.substring(0, 100) + '...' 
                  : post.excerpt
                : post.content.substring(0, 100) + '...';
                
              return (
                <Card key={post.id} className="h-full flex flex-col">
                  {post.featured_image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {post.author?.full_name || t('blog.unknownAuthor', { fallback: 'Unknown' })} • {formattedDate}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {truncatedExcerpt}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={`/blog/${post.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        {t('blog.readMore', { fallback: 'Read More' })}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <h3 className="text-lg font-medium text-gray-500">
                {searchTerm 
                  ? t('blog.noSearchResults', { fallback: 'No blog posts found matching your search' })
                  : t('blog.noPosts', { fallback: 'No blog posts found' })
                }
              </h3>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setSearchTerm('')}
                >
                  {t('common.clearSearch', { fallback: 'Clear Search' })}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;
