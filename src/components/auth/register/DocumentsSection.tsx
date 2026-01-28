
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DocumentsSectionProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  handleFileChange,
  isSubmitting
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="documents">{t('auth.register.documents')}</Label>
      <p className="text-sm text-gray-500 mb-2">
        {t('auth.register.documentsDescription')}
      </p>
      <Input
        id="documents"
        type="file"
        onChange={handleFileChange}
        disabled={isSubmitting}
        required
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        multiple
      />
    </div>
  );
};

export default DocumentsSection;
