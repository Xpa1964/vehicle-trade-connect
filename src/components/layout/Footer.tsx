import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border text-foreground py-4 sm:py-6 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Contacto */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('footer.contact', { fallback: 'Contacto' })}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('footer.privacyPolicy', { fallback: 'Política de Privacidad' })}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('footer.contact', { fallback: 'Contacto' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('footer.legal', { fallback: 'Legal' })}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('footer.termsConditions', { fallback: 'Términos y Condiciones' })}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('footer.cookies', { fallback: 'Política de Cookies' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto y Soporte */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('footer.contactSupport', { fallback: 'Contacto y Soporte' })}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/auction-policies" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('footer.auctionPolicies', { fallback: 'Políticas de Subasta' })}
                </Link>
              </li>
              <li>
                <Link to="/community-guidelines" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {t('footer.communityGuidelines', { fallback: 'Normas de la Comunidad' })}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-center items-center">
            <p className="text-muted-foreground text-sm text-center">
              © 2024 KONTACT VO. {t('footer.allRightsReserved', { fallback: 'Todos los derechos reservados.' })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
