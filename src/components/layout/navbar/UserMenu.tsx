import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserWithMeta } from '@/types/auth'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { User, LogOut, Users } from 'lucide-react';

export interface UserMenuProps {
  isHomePage: boolean;
  isScrolled: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ isHomePage, isScrolled }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  // Priorizar datos del perfil de la base de datos
  const displayName = user?.profile?.company_name || user?.profile?.full_name || user?.name || 'Usuario';

  // Determine text color based on page location and scroll state
  const textClass = (isHomePage && !isScrolled) ? 'text-white' : 'text-foreground';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`flex items-center gap-2 h-10 px-3 touch-manipulation min-h-[44px] ${
            isHomePage && !isScrolled 
              ? 'text-white hover:text-gray-200 hover:bg-white/10' 
              : 'text-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 z-[100]" align="end" sideOffset={4}>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-sm truncate">{displayName}</span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center cursor-pointer min-h-[44px] touch-manipulation">
              {t('nav.dashboard', { fallback: 'Panel de Control' })}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer min-h-[44px] touch-manipulation">
              <User className="mr-2 h-4 w-4" />
              {t('profile.title', { fallback: 'Mi Perfil' })}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/users" className="flex items-center cursor-pointer min-h-[44px] touch-manipulation">
              <Users className="mr-2 h-4 w-4" />
              {t('messages.userDirectory', { fallback: 'Directorio de Usuarios' })}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/messages" className="flex items-center cursor-pointer min-h-[44px] touch-manipulation">
              {t('nav.messages', { fallback: 'Mensajes' })}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={logout}
          className="text-destructive focus:text-destructive cursor-pointer min-h-[48px] touch-manipulation font-medium bg-destructive/10 hover:bg-destructive/20 focus:bg-destructive/20"
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span className="text-base">{t('auth.logout', { fallback: 'Cerrar Sesión' })}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
