
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProfileHeaderProps {
  onBack: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>
    </div>
  );
};

export default ProfileHeader;
