
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MessageSquare,
  Hammer,
  Calculator,
  Plus,
  Megaphone,
  ArrowLeftRight,
  BookOpen
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const actions = [
    // Auction functionality removed
    {
      icon: Plus,
      title: t('quickActions.publishVehicle'),
      description: t('quickActions.publishVehicleDescription'),
      onClick: () => navigate('/vehicle-management'),
      color: 'text-green-600'
    },
    {
      icon: BookOpen,
      title: t('quickActions.professionalBlog'),
      description: t('quickActions.professionalBlogDescription'),
      onClick: () => navigate('/blog'),
      color: 'text-blue-600'
    },
    {
      icon: Megaphone,
      title: t('quickActions.publishAnnouncement'),
      description: t('quickActions.publishAnnouncementDescription'),
      onClick: () => navigate('/publish-announcement'),
      color: 'text-purple-600'
    },
    {
      icon: ArrowLeftRight,
      title: t('quickActions.publishExchange'),
      description: t('quickActions.publishExchangeDescription'),
      onClick: () => navigate('/exchange-form'),
      color: 'text-indigo-600'
    },
    {
      icon: MessageSquare,
      title: t('quickActions.messages'),
      description: t('quickActions.messagesDescription'),
      onClick: () => navigate('/messages'),
      color: 'text-orange-600'
    },
    {
      icon: Hammer,
      title: t('quickActions.requestReport'),
      description: t('quickActions.requestReportDescription'),
      onClick: () => navigate('/vehicle-reports'),
      color: 'text-red-600'
    },
    {
      icon: Calculator,
      title: t('quickActions.quoteTransport'),
      description: t('quickActions.quoteTransportDescription'),
      onClick: () => navigate('/transport'),
      color: 'text-cyan-600'
    }
  ];

  return (
    <Card className="border border-gray-800 shadow-sm bg-white h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t('quickActions.title')}</CardTitle>
        <p className="text-sm text-gray-600">{t('quickActions.description')}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto p-3 md:p-4 flex items-start justify-start space-x-3 hover:shadow-md transition-shadow min-h-[60px] md:min-h-[80px]"
                onClick={action.onClick}
              >
                <IconComponent className={`h-4 w-4 md:h-5 md:w-5 ${action.color} flex-shrink-0 mt-0.5`} />
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                  <span className="font-medium text-sm md:text-base leading-tight">{action.title}</span>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 md:line-clamp-none">
                    {action.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
