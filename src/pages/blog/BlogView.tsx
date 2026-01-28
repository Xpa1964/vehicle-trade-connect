
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPost } from '@/types/blog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es, fr, it } from 'date-fns/locale';

const BlogView: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const getDateLocale = () => {
    switch (currentLanguage) {
      case 'es': return es;
      case 'fr': return fr;
      case 'it': return it;
      default: return undefined;
    }
  };

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['published-blog-posts', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select(`*, author:profiles(full_name)`)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  const handleDownloadPost = (post: BlogPost) => {
    const content = `
${post.title}
${post.author?.full_name ? `Por: ${post.author.full_name}` : ''}
${post.published_at ? `Publicado: ${format(new Date(post.published_at), 'dd/MM/yyyy', { locale: getDateLocale() })}` : ''}

${post.excerpt || ''}

${post.content}

Tags: ${post.tags.join(', ')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 md:px-6">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        <div className="text-center w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('blog.title', { fallback: 'Blog' })}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('blog.description', { fallback: 'Explore our latest articles and industry insights' })}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('blog.search', { fallback: 'Search blog posts...' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {blogPosts.length > 0 ? (
          <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="h-full hover:shadow-lg transition-shadow w-full">
                {post.featured_image && (
                  <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{t('blog.published', { fallback: 'Published' })}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadPost(post)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  {post.excerpt && (
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>
                          {t('blog.by', { fallback: 'By' })} {post.author?.full_name || t('blog.unknownAuthor', { fallback: 'Unknown' })}
                        </span>
                      </div>
                      {post.published_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(post.published_at), 'dd/MM/yyyy', { locale: getDateLocale() })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {post.content.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 w-full">
            <h3 className="text-lg font-medium text-gray-500">
              {searchTerm 
                ? t('blog.noSearchResults', { fallback: 'No blog posts found matching your search' })
                : t('blog.noPosts', { fallback: 'No blog posts found' })
              }
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogView;
