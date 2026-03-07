
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Megaphone, Search, Tag, Check, X, Upload, File, Briefcase, Car, Wrench, Star, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Announcement } from '@/types/announcement';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAnnouncementFileUpload } from '@/hooks/useAnnouncementFileUpload';
import PendingFileUpload from '@/components/bulletin/PendingFileUpload';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters."
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters."
  }),
  status: z.enum(['active', 'finished'], {
    required_error: "You need to select a status."
  }),
  category: z.enum(['business_opportunities', 'vehicle_search', 'available_vehicles', 'professional_services'], {
    required_error: "You need to select an announcement category."
  }),
  is_featured: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface AnnouncementFormProps {
  onAnnouncementAdded: (announcement: Announcement) => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onAnnouncementAdded }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const { uploadFile } = useAnnouncementFileUpload();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'active',
      category: 'business_opportunities',
      is_featured: false,
    },
  });

  const handlePendingFilesChange = (files: File[]) => {
    setPendingFiles(files);
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error(t('auth.loginRequired'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Validación robusta de sesión antes de crear anuncio
      console.log('🔐 [FORM] Iniciando validación de sesión antes de crear anuncio...');
      const { validateUserSession, handleRLSError, logSessionState } = await import('@/utils/sessionValidation');
      
      // Log estado actual
      await logSessionState('Antes de crear anuncio');
      
      // Validar sesión
      const validation = await validateUserSession();
      if (!validation.isValid) {
        console.error('[AnnouncementForm] Session validation failed:', validation.error);
        toast.error(validation.error || t('toast.sessionError'));
        return;
      }

      // Add the announcement to Supabase
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: values.title,
          content: values.content,
          status: values.status,
          category: values.category,
          user_id: validation.userId!, // Usar el userId validado
          type: values.category === 'vehicle_search' ? 'search' : 'offer',
          is_featured: values.is_featured,
          featured_until: values.is_featured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null, // 30 days
          view_count: 0,
          priority: values.is_featured ? 1 : 0
        })
        .select()
        .single();
      
      if (error) {
        console.error('[AnnouncementForm] Error adding announcement:', error);
        const userFriendlyError = handleRLSError(error);
        toast.error(t('toast.announcementDeleteError'), {
          description: userFriendlyError
        });
        throw error;
      }
      
      // Now upload pending files with the real announcement ID
      if (pendingFiles.length > 0) {
        console.log(`📁 Subiendo ${pendingFiles.length} archivos para anuncio ${data.id}...`);
        
        for (const file of pendingFiles) {
          try {
            const uploadResult = await uploadFile(file, data.id);
            if (uploadResult.success) {
              console.log(`✅ Archivo subido: ${file.name}`);
            } else {
              console.error(`❌ Error subiendo ${file.name}:`, uploadResult.error);
              toast.error(`Error subiendo ${file.name}: ${uploadResult.error}`);
            }
          } catch (error) {
            console.error(`❌ Error subiendo ${file.name}:`, error);
            toast.error(`Error subiendo ${file.name}`);
          }
        }
        
        console.log('📁 Proceso de subida de archivos completado');
      }
      
      // Notify parent component about the new announcement
      if (data) {
        onAnnouncementAdded(data as unknown as Announcement);
      }
      
      // Reset form
      form.reset();
      setPendingFiles([]);
      
      // Show toast notification
      toast.success(t('bulletin.announcementAddedTitle'), {
        description: t('bulletin.announcementAddedDescription'),
      });
    } catch (error) {
      console.error('Error submitting announcement:', error);
      toast.error(t('common.error'), {
        description: t('toast.announcementDeleteError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Announcement Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-foreground">{t('bulletin.form.category')}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-md hover:bg-secondary">
                    <RadioGroupItem value="business_opportunities" id="business_opportunities" />
                    <FormLabel htmlFor="business_opportunities" className="flex items-center cursor-pointer w-full text-foreground">
                      <Briefcase className="h-4 w-4 mr-2 text-blue-400" />
                      {t('bulletin.business_opportunities')}
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-md hover:bg-secondary">
                    <RadioGroupItem value="vehicle_search" id="vehicle_search" />
                    <FormLabel htmlFor="vehicle_search" className="flex items-center cursor-pointer w-full text-foreground">
                      <Search className="h-4 w-4 mr-2 text-green-400" />
                      {t('bulletin.vehicle_search')}
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-md hover:bg-secondary">
                    <RadioGroupItem value="available_vehicles" id="available_vehicles" />
                    <FormLabel htmlFor="available_vehicles" className="flex items-center cursor-pointer w-full text-foreground">
                      <Car className="h-4 w-4 mr-2 text-red-400" />
                      {t('bulletin.available_vehicles')}
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-md hover:bg-secondary">
                    <RadioGroupItem value="professional_services" id="professional_services" />
                    <FormLabel htmlFor="professional_services" className="flex items-center cursor-pointer w-full text-foreground">
                      <Wrench className="h-4 w-4 mr-2 text-purple-400" />
                      {t('bulletin.professional_services')}
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription className="text-muted-foreground">
                {t('bulletin.form.categoryDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">{t('bulletin.form.title')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('bulletin.form.titlePlaceholder')} 
                  {...field} 
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                {t('bulletin.form.titleDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">{t('bulletin.form.content')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('bulletin.form.contentPlaceholder')} 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                {t('bulletin.form.contentDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Featured Announcement */}
        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-secondary/30">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center text-foreground">
                  <Star className="h-4 w-4 mr-2 text-amber-400" />
                  {t('bulletin.featuredAnnouncement', { fallback: 'Featured Announcement' })}
                </FormLabel>
                <FormDescription className="text-muted-foreground">
                  {t('bulletin.featuredDescription', { fallback: 'Featured announcements appear at the top of the list with greater visibility for 30 days.' })}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        {/* File Attachments */}
        <FormItem>
          <FormLabel className="text-foreground">{t('bulletin.attachments', { fallback: 'File attachments' })}</FormLabel>
          <PendingFileUpload
            onFilesChange={handlePendingFilesChange}
            acceptedTypes=".xlsx,.xls,.docx,.doc,.pdf,.jpg,.jpeg,.png,.gif,.webp"
            maxFiles={5}
            className="w-full"
          />
          <FormDescription className="text-muted-foreground">
            {t('bulletin.attachmentsDescription', { fallback: 'You can select up to 5 files. They will be uploaded after creating the announcement.' })}
          </FormDescription>
        </FormItem>
        
        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-foreground">{t('bulletin.form.status')}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <FormLabel htmlFor="active" className="flex items-center cursor-pointer text-foreground">
                      <Check className="h-4 w-4 mr-2 text-green-400" />
                      {t('bulletin.statusActive')}
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="finished" id="finished" />
                    <FormLabel htmlFor="finished" className="flex items-center cursor-pointer text-foreground">
                      <X className="h-4 w-4 mr-2 text-muted-foreground" />
                      {t('bulletin.statusFinished')}
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <Megaphone className="h-4 w-4 mr-2" />
          {isSubmitting ? t('common.loading') : t('bulletin.form.submit')}
        </Button>
      </form>
    </Form>
  );
};

export default AnnouncementForm;
