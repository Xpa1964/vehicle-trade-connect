
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditionsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('nav.backToHome', { fallback: 'Volver al Inicio' })}
            </Link>
          </Button>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {t('terms.title', { fallback: 'Términos y Condiciones' })}
          </h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.introduction.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.introduction.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p1')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p2')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.introduction.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p3')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p4')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p5')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.introduction.subtitle3')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p6')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p7')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.introduction.subtitle4')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p8')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.introduction.subtitle5')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p9')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p10')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p11')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.introduction.p12')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.introduction.p13')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.delivery.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.delivery.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.delivery.p1')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.delivery.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.delivery.p2')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.delivery.subtitle3')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.delivery.p3')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.delivery.subtitle4')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.delivery.p4')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.payment.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.payment.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.payment.p1')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.payment.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.payment.p2')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.obligations.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.obligations.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.obligations.p1')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.obligations.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.obligations.p2')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.obligations.subtitle3')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.obligations.p3')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.registration.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.registration.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.registration.p1')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.registration.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.registration.p2')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.prohibited.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.prohibited.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.prohibited.p1')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.prohibited.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.prohibited.p2')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.general.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.general.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.general.p1')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.general.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.general.p2')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.exemption.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.exemption.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.exemption.p1')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.exemption.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.exemption.p2')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.integrity.title')}</h2>
              <h3 className="text-xl font-medium mb-3">{t('terms.integrity.subtitle1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('terms.integrity.p1')}
              </p>
              
              <h3 className="text-xl font-medium mb-3">{t('terms.integrity.subtitle2')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.integrity.p2')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.modifications.title')}</h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.modifications.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.contact.title')}</h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.contact.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
