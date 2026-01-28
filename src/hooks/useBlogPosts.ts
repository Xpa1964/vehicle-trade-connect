
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { BlogPost, BlogPostFormData } from '@/types/blog';

export const useBlogPosts = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const isAdmin = user?.role === 'admin';

  // Fetch all blog posts based on user role
  const { data: blogPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['blog-posts', isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select(`*, author:profiles(full_name)`)

      // If user is not an admin, filter posts
      if (!isAdmin) {
        // For non-admins, show only their own posts or published posts by anyone
        query = query.or(`status.eq.published,author_id.eq.${user?.id}`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: !!user
  });

  // Fetch only pending approval posts (for admin view)
  const { data: pendingPosts, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pending-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`*, author:profiles(full_name)`)
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: isAdmin && !!user
  });

  // Create new blog post
  const createBlogPost = async (postData: BlogPostFormData) => {
    setIsLoading(true);
    try {
      // If user is not admin and tries to publish directly, force to pending_approval
      if (!isAdmin && postData.status === 'published') {
        postData.status = 'pending_approval';
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          author_id: user?.id,
          published_at: postData.status === 'published' ? new Date().toISOString() : null
        })
        .select();

      if (error) throw error;
      
      if (postData.status === 'pending_approval') {
        toast.success(t('blog.pendingApprovalMessage', { fallback: 'Your post has been submitted for review' }));
      } else {
        toast.success(t('blog.postCreated', { fallback: 'Blog post created successfully' }));
      }
      
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-blog-posts'] });
      return data?.[0] as BlogPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error(t('blog.createError', { fallback: 'Error creating blog post' }));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing blog post
  const updateBlogPost = async (id: string, postData: BlogPostFormData) => {
    setIsLoading(true);
    try {
      // If user is not admin and tries to publish directly, force to pending_approval
      if (!isAdmin && postData.status === 'published') {
        postData.status = 'pending_approval';
      }

      // Set published_at based on status
      const updateData = {
        ...postData,
        published_at: postData.status === 'published' 
          ? new Date().toISOString() 
          : null
      };
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (postData.status === 'pending_approval') {
        toast.success(t('blog.pendingApprovalMessage', { fallback: 'Your post has been submitted for review' }));
      } else {
        toast.success(t('blog.postUpdated', { fallback: 'Blog post updated successfully' }));
      }
      
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-blog-posts'] });
      return data?.[0] as BlogPost;
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error(t('blog.updateError', { fallback: 'Error updating blog post' }));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Approve blog post (admin only)
  const approveBlogPost = async (id: string) => {
    if (!isAdmin) return null;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast.success(t('blog.postApproved', { fallback: 'Blog post approved successfully' }));
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-blog-posts'] });
      return data?.[0] as BlogPost;
    } catch (error) {
      console.error('Error approving blog post:', error);
      toast.error(t('blog.updateError', { fallback: 'Error approving blog post' }));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Reject blog post (admin only)
  const rejectBlogPost = async (id: string) => {
    if (!isAdmin) return null;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast.success(t('blog.postRejected', { fallback: 'Blog post rejected' }));
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-blog-posts'] });
      return data?.[0] as BlogPost;
    } catch (error) {
      console.error('Error rejecting blog post:', error);
      toast.error(t('blog.updateError', { fallback: 'Error rejecting blog post' }));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete blog post
  const deleteBlogPost = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success(t('blog.postDeleted', { fallback: 'Blog post deleted successfully' }));
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-blog-posts'] });
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error(t('blog.deleteError', { fallback: 'Error deleting blog post' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    blogPosts,
    pendingPosts,
    isLoadingPosts,
    isLoadingPending,
    isLoading,
    createBlogPost,
    updateBlogPost,
    approveBlogPost,
    rejectBlogPost,
    deleteBlogPost,
    isAdmin
  };
};
