
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CookiesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('nav.backToHome')}
            </Link>
          </Button>
        </div>

        <div className="bg-card shadow-sm rounded-lg p-6 sm:p-8 border border-border">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
            {t('cookies.title')}
          </h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('cookies.whatAreCookies')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cookies.whatAreCookiesDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('cookies.typesTitle')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">{t('cookies.essential')}</h3>
                  <p className="text-muted-foreground">{t('cookies.essentialDesc')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">{t('cookies.performance')}</h3>
                  <p className="text-muted-foreground">{t('cookies.performanceDesc')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">{t('cookies.preferences')}</h3>
                  <p className="text-muted-foreground">{t('cookies.preferencesDesc')}</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('cookies.controlTitle')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cookies.controlDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('cookies.updatesTitle')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cookies.updatesDesc')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
