
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import ContactPageLogo from "@/components/contact/ContactPageLogo";
import ContactCorporateHeader from "@/components/contact/ContactCorporateHeader";

const ContactPage: React.FC = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted');
  };

  return (
    <div className="min-h-screen bg-background py-4 px-2 sm:px-6 lg:px-8">
      {/* Header Corporativo */}
      <ContactCorporateHeader />

      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('nav.backToHome', { fallback: 'Volver al Inicio' })}
            </Link>
          </Button>
        </div>

        {/* Grid de dos columnas para desktop, apilado en móvil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bloque Izquierdo: Infos de contacto */}
          <div className="bg-card shadow-sm rounded-lg p-6 sm:p-8 h-fit flex flex-col justify-between border border-border">
            <h2 className="text-2xl font-semibold mb-8 text-foreground">{t('contact.title')}</h2>
            <div className="space-y-7">
              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-foreground">{t('contact.email')}</h3>
                  <p className="text-muted-foreground">info@kontactvo.com</p>
                  <p className="text-muted-foreground">fjpa@kontactvo.com</p>
                </div>
              </div>
              {/* Oficina */}
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-foreground">{t('contact.mainOffice')}</h3>
                  <p className="text-muted-foreground">
                    KONTACT VO<br />
                    Plaça Joan Oliu 6<br />
                    Sabadell, Barcelona
                  </p>
                </div>
              </div>
              {/* Chat en vivo */}
              <div className="flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-foreground">{t('contact.liveChat')}</h3>
                  <p className="text-muted-foreground">
                    {t('contact.liveChatDescription')}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link to="/messages">{t('contact.accessChat')}</Link>
                  </Button>
                </div>
              </div>
            </div>
            {/* Bloque info usuarios */}
            <div className="mt-8 p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-sm text-amber-400">
                {t('contact.registeredUserInfo')}
              </p>
            </div>
          </div>

          {/* Bloque Derecho: Formulario + Horarios */}
          <div className="bg-card shadow-sm rounded-lg p-6 sm:p-8 flex flex-col justify-between h-fit border border-border">
            <h2 className="text-2xl font-bold mb-6 text-foreground">{t('contact.sendMessage')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t('contact.firstName')} *</Label>
                  <Input id="firstName" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">{t('contact.lastName')} *</Label>
                  <Input id="lastName" type="text" required className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">{t('contact.email')} *</Label>
                <Input id="email" type="email" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="company">{t('contact.company')}</Label>
                <Input id="company" type="text" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject">{t('contact.subject')} *</Label>
                <Input id="subject" type="text" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">{t('contact.message')} *</Label>
                <Textarea 
                  id="message" 
                  rows={6} 
                  required 
                  className="mt-1"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="privacy" required className="rounded border-border" />
                <Label htmlFor="privacy" className="text-sm text-muted-foreground">
                  {t('contact.privacyAccept')}{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline">
                    {t('common.privacyPolicy')}
                  </Link>{' '}
                  {t('contact.privacyAnd')}
                </Label>
              </div>
              <Button type="submit" size="lg" className="w-full">
                {t('contact.sendButton')}
              </Button>
            </form>

            {/* Horarios de Atención bajo el formulario */}
            <div className="mt-8 p-4 bg-info/10 border border-info/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-[#0EA5E9]">{t('contact.businessHours')}</h3>
              <div className="text-sm text-[#0EA5E9]/80 space-y-1">
                <p>{t('contact.mondayFriday')}</p>
                <p>{t('contact.saturday')}</p>
                <p>{t('contact.sunday')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
