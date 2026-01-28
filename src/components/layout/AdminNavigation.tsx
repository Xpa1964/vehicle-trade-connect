import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => location.pathname === path;
  
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center bg-white text-auto-blue border-auto-blue hover:bg-auto-blue hover:text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            <span>{t('navigation.backToHome', { fallback: 'Volver al Inicio' })}</span>
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center">
        <Link to="/admin/control-panel">
          <Button
            variant={isActive('/admin/control-panel') ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex items-center",
              isActive('/admin/control-panel') ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            <Settings className="h-4 w-4 mr-2" />
            <span>{t('control.title', { fallback: 'Panel de Control' })}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminNavigation;
