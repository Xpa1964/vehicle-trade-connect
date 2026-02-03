import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';
import { useStatistics } from '@/hooks/useStatistics';

const DashboardMessaging: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { messages } = useStatistics();
  
  const unreadCount = messages?.count || 0;
  
  return (
    <Card className="bg-card border-border/50 h-full">
      <CardContent className="p-4 flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          {/* Icono prominente */}
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            {/* Badge contador */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {t('messages.title', { fallback: 'Mensajería' })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount} {t('messages.unread', { fallback: 'mensajes sin leer' })}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate('/messages')}
          className="gap-2"
        >
          {t('messages.goTo', { fallback: 'Ir a Mensajes' })}
          <ArrowRight size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardMessaging;
