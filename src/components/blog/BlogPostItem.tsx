
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPost } from '@/types/blog';
import { Calendar, Edit, Trash, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostItemProps {
  post: BlogPost;
  onDelete: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showApprovalActions?: boolean;
}

const BlogPostItem: React.FC<BlogPostItemProps> = ({ 
  post, 
  onDelete,
  onApprove,
  onReject,
  showApprovalActions = false
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'secondary';
      case 'pending_approval':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return t('blog.published', { fallback: 'Published' });
      case 'draft':
        return t('blog.draft', { fallback: 'Draft' });
      case 'pending_approval':
        return t('blog.pendingApproval', { fallback: 'Pending Approval' });
      default:
        return status;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          <Badge variant={getStatusBadgeVariant(post.status) as any}>{getStatusText(post.status)}</Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          {post.created_at && format(new Date(post.created_at), 'PP')}
          {post.author?.full_name && (
            <>
              <span className="mx-1">•</span>
              <span>{t('blog.by', { fallback: 'By' })} {post.author.full_name}</span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 grow">
        <p className="text-sm line-clamp-3">
          {post.excerpt || post.content?.substring(0, 150)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 flex flex-wrap gap-2">
        {showApprovalActions && post.status === 'pending_approval' ? (
          <>
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onApprove?.(post.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              {t('blog.approve', { fallback: 'Approve' })}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onReject?.(post.id)}
            >
              <X className="h-4 w-4 mr-1" />
              {t('blog.reject', { fallback: 'Reject' })}
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/blog-management/${post.id}`)}
            >
              {t('blog.view', { fallback: 'View' })}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate(`/blog-management/edit/${post.id}`)}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              {t('blog.editPost', { fallback: 'Edit' })}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(post.id)}
            >
              <Trash className="h-4 w-4 mr-1" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BlogPostItem;
