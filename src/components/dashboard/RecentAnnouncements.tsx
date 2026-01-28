
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Megaphone, ArrowRight, CalendarIcon, Tag, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import TranslatedContent from '../translation/TranslatedContent';

const RecentAnnouncements: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  
  const { data: recentAnnouncements = [] } = useQuery({
    queryKey: ['recent-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        status: (item as any).status || 'active',
        type: (item as any).type || 'announcement', 
        category: (item as any).category || 'general'
      }));
    },
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{t('bulletin.title')}</CardTitle>
          <CardDescription>{t('bulletin.recentAnnouncements')}</CardDescription>
        </div>
        <Link to="/bulletin">
          <Button variant="ghost" size="sm" className="gap-1">
            <Megaphone className="w-4 h-4" />
            {t('bulletin.viewAll')}
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {recentAnnouncements.length > 0 ? (
            recentAnnouncements.map(announcement => (
              <div key={announcement.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <Link to={`/bulletin/${announcement.id}`} className="hover:underline">
                    <h3 className="font-medium text-sm">
                      <TranslatedContent
                        originalText={announcement.title}
                        originalLanguage="es"
                        targetLanguage={currentLanguage}
                      />
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full flex items-center ${
                      (announcement as any).type === 'offer' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-success/10 text-[#22C55E] border border-success/20'
                    }`}>
                      {(announcement as any).type === 'offer' ? (
                        <>
                          <Tag className="h-2 w-2 mr-1" />
                          <span className="hidden sm:inline">{t('bulletin.form.offer')}</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-2 w-2 mr-1" />
                          <span className="hidden sm:inline">{t('bulletin.form.search')}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {new Date(announcement.created_at).toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  <TranslatedContent 
                    originalText={announcement.content} 
                    originalLanguage="es"
                    targetLanguage={currentLanguage}
                  />
                </p>
                <div className="mt-1 text-right">
                  <Link to={`/bulletin/${announcement.id}`} className="text-auto-blue hover:text-auto-blue-dark text-xs flex items-center justify-end">
                    {t('bulletin.readMore')} 
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">{t('bulletin.noAnnouncements')}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/bulletin">
          <Button variant="outline" size="sm">
            {t('bulletin.viewAll')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentAnnouncements;
