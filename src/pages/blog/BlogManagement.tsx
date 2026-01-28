
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus } from 'lucide-react';
import BlogPostItem from '@/components/blog/BlogPostItem';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const BlogManagement: React.FC = () => {
  const { t } = useLanguage();
  const { 
    blogPosts, 
    pendingPosts, 
    isLoadingPosts, 
    isLoadingPending, 
    deleteBlogPost,
    approveBlogPost,
    rejectBlogPost,
    isAdmin
  } = useBlogPosts();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      await deleteBlogPost(postToDelete);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="w-full px-4 md:px-6 py-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold">{t('control.blogManagement')}</h1>
          <Button asChild>
            <Link to="/admin/blog-management/create">
              <Plus className="h-4 w-4 mr-1" />
              {t('control.addBlogPost')}
            </Link>
          </Button>
        </div>
        
        {isAdmin && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">{t('blog.title', { fallback: 'All Posts' })}</TabsTrigger>
              <TabsTrigger value="pending">
                {t('blog.pendingApproval', { fallback: 'Pending Approval' })}
                {pendingPosts && pendingPosts.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 text-xs rounded-full">
                    {pendingPosts.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="w-full">
              {renderBlogPosts(blogPosts, isLoadingPosts, false)}
            </TabsContent>
            
            <TabsContent value="pending" className="w-full">
              {renderPendingPosts(pendingPosts, isLoadingPending)}
            </TabsContent>
          </Tabs>
        )}
        
        {!isAdmin && (
          <div className="w-full">
            {renderBlogPosts(blogPosts, isLoadingPosts, false)}
          </div>
        )}
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('blog.confirmDelete', { fallback: 'Confirm Deletion' })}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('blog.deleteWarning', { fallback: 'Are you sure you want to delete this blog post? This action cannot be undone.' })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel', { fallback: 'Cancel' })}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t('common.delete', { fallback: 'Delete' })}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
  
  function renderBlogPosts(posts: any[] | undefined, isLoading: boolean, showApprovalActions: boolean) {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!posts || posts.length === 0) {
      return (
        <div className="col-span-full text-center py-10 w-full">
          <h3 className="text-lg font-medium text-gray-500">
            {t('blog.noPosts', { fallback: 'No blog posts found' })}
          </h3>
          <p className="text-gray-400">
            {t('blog.getStarted', { fallback: 'Create your first blog post to get started' })}
          </p>
          <Button className="mt-4" asChild>
            <Link to="/admin/blog-management/create">
              <Plus className="h-4 w-4 mr-1" />
              {t('control.addBlogPost')}
            </Link>
          </Button>
        </div>
      );
    }
    
    return (
      <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <BlogPostItem 
            key={post.id} 
            post={post} 
            onDelete={handleDeleteClick}
            showApprovalActions={showApprovalActions}
          />
        ))}
      </div>
    );
  }
  
  function renderPendingPosts(posts: any[] | undefined, isLoading: boolean) {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-10 w-full">
          <h3 className="text-lg font-medium text-gray-500">
            {t('blog.noSearchResults', { fallback: 'No pending posts found' })}
          </h3>
        </div>
      );
    }
    
    return (
      <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <BlogPostItem 
            key={post.id} 
            post={post} 
            onDelete={handleDeleteClick}
            onApprove={approveBlogPost}
            onReject={rejectBlogPost}
            showApprovalActions={true}
          />
        ))}
      </div>
    );
  }
};

export default BlogManagement;
