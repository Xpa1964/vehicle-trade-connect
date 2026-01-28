
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPostFormData } from '@/types/blog';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  featured_image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'pending_approval']),
  tags: z.array(z.string())
});

interface BlogPostFormProps {
  initialData?: BlogPostFormData;
  onSubmit: (data: BlogPostFormData) => void;
  isSubmitting: boolean;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ 
  initialData, 
  onSubmit,
  isSubmitting 
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [tagInput, setTagInput] = useState<string>('');
  
  const defaultValues: BlogPostFormData = initialData || {
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
    tags: []
  };

  const { control, register, handleSubmit, formState: { errors }, watch, setValue } = useForm<BlogPostFormData>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const tags = watch('tags');

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setValue('tags', [...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue('tags', tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Check if user is an admin
  const isAdmin = user?.role === 'admin';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">{t('blog.formTitle', { fallback: 'Title' })}</Label>
        <Input 
          id="title"
          {...register('title')} 
          placeholder={t('blog.titlePlaceholder', { fallback: 'Enter blog post title' })}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">{t('blog.content', { fallback: 'Content' })}</Label>
        <Textarea 
          id="content"
          {...register('content')} 
          placeholder={t('blog.contentPlaceholder', { fallback: 'Write your blog post content here' })}
          className="min-h-[200px]"
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">{t('blog.excerpt', { fallback: 'Excerpt' })}</Label>
        <Textarea 
          id="excerpt"
          {...register('excerpt')} 
          placeholder={t('blog.excerptPlaceholder', { fallback: 'A short summary of your post (optional)' })}
          className="min-h-[100px]"
        />
        {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="featured_image">{t('blog.featuredImage', { fallback: 'Featured Image URL' })}</Label>
        <Input 
          id="featured_image"
          {...register('featured_image')} 
          placeholder={t('blog.imageUrlPlaceholder', { fallback: 'Image URL (optional)' })}
        />
        {errors.featured_image && <p className="text-sm text-red-500">{errors.featured_image.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label>{t('blog.tags', { fallback: 'Tags' })}</Label>
        <div className="flex gap-2">
          <Input 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('blog.tagsPlaceholder', { fallback: 'Add a tag' })} 
          />
          <Button type="button" onClick={handleAddTag} variant="secondary">
            {t('blog.addTag', { fallback: 'Add' })}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <div key={tag} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {tag}
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">{t('blog.status', { fallback: 'Status' })}</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t('blog.selectStatus', { fallback: 'Select status' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t('blog.draft', { fallback: 'Draft' })}</SelectItem>
                {isAdmin ? (
                  <SelectItem value="published">{t('blog.published', { fallback: 'Published' })}</SelectItem>
                ) : (
                  <SelectItem value="pending_approval">{t('blog.pendingApproval', { fallback: 'Pending Approval' })}</SelectItem>
                )}
                {isAdmin && (
                  <SelectItem value="pending_approval">{t('blog.pendingApproval', { fallback: 'Pending Approval' })}</SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialData ? t('blog.editPost', { fallback: 'Update Post' }) : t('blog.createPost', { fallback: 'Create Post' })}
      </Button>
      
      {!isAdmin && (
        <div className="text-sm text-muted-foreground">
          <p>{t('blog.pendingApprovalMessage', { fallback: 'Your post will be reviewed before being published' })}</p>
        </div>
      )}
    </form>
  );
};

export default BlogPostForm;
