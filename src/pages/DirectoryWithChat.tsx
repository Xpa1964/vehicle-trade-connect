
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import UsersDirectoryWithSelection from '@/components/shared/UsersDirectoryWithSelection';

const DirectoryWithChat: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Panel de Control
        </Button>
      </div>

      <UsersDirectoryWithSelection />
    </div>
  );
};

export default DirectoryWithChat;
