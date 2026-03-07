
import React from 'react';
import { Link } from 'react-router-dom';
import { User, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserLinkProps {
  userId: string;
  userName?: string;
  companyName?: string;
  className?: string;
  showIcon?: boolean;
  showExternalIcon?: boolean;
}

const UserLink: React.FC<UserLinkProps> = ({
  userId,
  userName,
  companyName,
  className,
  showIcon = true,
  showExternalIcon = false
}) => {
  const displayName = companyName || userName || 'Usuario';
  
  
  return (
    <Link
      to={`/user/${userId}`}
      className={cn(
        "flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors group",
        className
      )}
      title={`Ver perfil de ${displayName} - Haz clic para valorar y ver más información`}
    >
      {showIcon && <User className="h-4 w-4 mr-1" />}
      <span>{displayName}</span>
      {showExternalIcon && (
        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );
};

export default UserLink;
