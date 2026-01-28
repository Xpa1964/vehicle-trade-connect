
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { CardFooter } from '@/components/ui/card';

const RegisterFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <CardFooter className="flex flex-col">
      <p className="text-center text-sm text-gray-600">
        {t('auth.register.haveAccount')}{' '}
        <Link to="/login" className="text-auto-blue hover:underline">
          {t('auth.login')}
        </Link>
      </p>
    </CardFooter>
  );
};

export default RegisterFooter;
