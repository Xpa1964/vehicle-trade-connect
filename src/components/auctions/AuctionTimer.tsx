import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuctionStatus } from '@/types/auction';

interface AuctionTimerProps {
  startDate: string;
  endDate: string;
  status: AuctionStatus;
}

export const AuctionTimer: React.FC<AuctionTimerProps> = ({ 
  startDate, 
  endDate, 
  status 
}) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState('');
  const [isAntiSnipe, setIsAntiSnipe] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      let difference;
      let prefix;

      if (status === 'scheduled' && now < start) {
        difference = start - now;
        prefix = t('auctions.startsIn', { fallback: 'Comienza en' });
      } else if (status === 'active' && now < end) {
        difference = end - now;
        prefix = t('auctions.endsIn', { fallback: 'Termina en' });
        
        // Detectar últimos 10 minutos (anti-sniping)
        setIsAntiSnipe(difference <= 10 * 60 * 1000);
      } else {
        setTimeLeft(t('auctions.time.ended', { fallback: 'Finalizada' }));
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let timeString = '';
      if (days > 0) {
        timeString = `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        timeString = `${minutes}m ${seconds}s`;
      }

      setTimeLeft(`${prefix}: ${timeString}`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate, status, t]);

  const getTimerColor = () => {
    if (status === 'ended' || status === 'completed' || status === 'cancelled') {
      return 'text-gray-500';
    }
    if (isAntiSnipe) {
      return 'text-red-600 animate-pulse';
    }
    if (status === 'active') {
      return 'text-green-600';
    }
    return 'text-blue-600';
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className={`w-5 h-5 ${getTimerColor()}`} />
      <span className={`font-semibold ${getTimerColor()}`}>
        {timeLeft}
      </span>
      {isAntiSnipe && status === 'active' && (
        <span className="text-xs text-red-600 font-medium">
          ({t('auctions.antiSnipeActive', { fallback: 'Anti-sniping activo' })})
        </span>
      )}
    </div>
  );
};
