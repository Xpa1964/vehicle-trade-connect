
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, User } from 'lucide-react';

interface CustomerProfileCardProps {
  companyName?: string;
  contactPerson?: string;
  traderType?: string;
  businessDescription?: string;
  companyLogo?: string;
}

/**
 * Component that displays key customer information from the registration form
 * in a clean, professional card format
 */
const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({
  companyName = 'Sin nombre de empresa',
  contactPerson = 'Sin persona de contacto',
  traderType = '',
  businessDescription = 'Sin descripción',
  companyLogo,
}) => {
  // Format trader type for display
  const formatTraderType = (type: string): string => {
    const types: Record<string, string> = {
      'buyer': 'Comprador',
      'seller': 'Vendedor',
      'trader': 'Trader',
      'buyer_seller': 'Comprador/Vendedor'
    };
    
    return types[type] || type;
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden min-h-[280px] flex flex-col">
      <CardHeader className="border-b bg-muted/40 pb-4">
        <div className="flex items-center">
          <Avatar className="h-14 w-14 mr-4">
            {companyLogo ? (
              <AvatarImage src={companyLogo} alt={companyName} />
            ) : (
              <AvatarFallback>
                {getInitials(companyName)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{companyName}</CardTitle>
            {traderType && (
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full max-w-[180px] truncate">
                {formatTraderType(traderType)}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4 flex-1">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-start">
            <User className="h-5 w-5 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Persona de contacto</p>
              <p className="text-base">{contactPerson}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Building className="h-5 w-5 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Actividad</p>
              <p className="text-base">{businessDescription}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerProfileCard;
