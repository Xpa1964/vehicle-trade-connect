import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Gavel, TrendingUp, Shield, Zap, Users, Calendar, Award, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuctionsInfoPage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const translations = {
    title: {
      es: 'Subastas de Vehículos',
      en: 'Vehicle Auctions',
      fr: 'Enchères de Véhicules',
      it: 'Aste di Veicoli',
      de: 'Fahrzeugauktionen',
      pt: 'Leilões de Veículos',
      nl: 'Voertuigveilingen',
      dk: 'Køretøjsauktioner',
      pl: 'Aukcje Pojazdów'
    },
    subtitle: {
      es: 'Compra y vende vehículos de manera eficiente en nuestras subastas profesionales',
      en: 'Buy and sell vehicles efficiently in our professional auctions',
      fr: 'Achetez et vendez des véhicules efficacement dans nos enchères professionnelles',
      it: 'Acquista e vendi veicoli in modo efficiente nelle nostre aste professionali',
      de: 'Kaufen und verkaufen Sie Fahrzeuge effizient in unseren professionellen Auktionen',
      pt: 'Compre e venda veículos de forma eficiente em nossos leilões profissionais',
      nl: 'Koop en verkoop voertuigen efficiënt in onze professionele veilingen',
      dk: 'Køb og sælg køretøjer effektivt i vores professionelle auktioner',
      pl: 'Kupuj i sprzedawaj pojazdy efektywnie na naszych profesjonalnych aukcjach'
    },
    comingSoon: {
      es: '🎯 PRÓXIMAMENTE - Estamos preparando algo especial',
      en: '🎯 COMING SOON - We are preparing something special',
      fr: '🎯 BIENTÔT DISPONIBLE - Nous préparons quelque chose de spécial',
      it: '🎯 PROSSIMAMENTE - Stiamo preparando qualcosa di speciale',
      de: '🎯 DEMNÄCHST - Wir bereiten etwas Besonderes vor',
      pt: '🎯 EM BREVE - Estamos preparando algo especial',
      nl: '🎯 BINNENKORT - We bereiden iets speciaals voor',
      dk: '🎯 KOMMER SNART - Vi forbereder noget specielt',
      pl: '🎯 WKRÓTCE - Przygotowujemy coś wyjątkowego'
    },
    description: {
      es: 'Publica tus vehículos y participa en nuestras subastas periódicas. Compra o vende fácilmente en una plataforma de subastas diseñada especialmente para profesionales del sector automotriz. Disfruta de un entorno seguro, transparente y eficiente para gestionar tus operaciones con total confianza.',
      en: 'Upload your vehicles for auctions and don\'t miss the periodic auctions where you can easily buy or sell. Our auction platform is specifically designed for automotive industry professionals, offering a secure and transparent environment.',
      fr: 'Téléchargez vos véhicules pour les enchères et ne manquez pas les enchères périodiques où vous pouvez facilement acheter ou vendre. Notre plateforme d\'enchères est spécialement conçue pour les professionnels de l\'industrie automobile, offrant un environnement sécurisé et transparent.',
      it: 'Carica i tuoi veicoli per le aste e non perdere le aste periodiche dove puoi facilmente comprare o vendere. La nostra piattaforma d\'asta è specificamente progettata per i professionisti dell\'industria automobilistica, offrendo un ambiente sicuro e trasparente.',
      de: 'Laden Sie Ihre Fahrzeuge für Auktionen hoch und verpassen Sie nicht die regelmäßigen Auktionen, bei denen Sie einfach kaufen oder verkaufen können. Unsere Auktionsplattform ist speziell für Fachleute der Automobilindustrie konzipiert und bietet eine sichere und transparente Umgebung.',
      pt: 'Envie seus veículos para leilões e não perca os leilões periódicos onde você pode comprar ou vender facilmente. Nossa plataforma de leilões é especificamente projetada para profissionais da indústria automotiva, oferecendo um ambiente seguro e transparente.',
      nl: 'Upload uw voertuigen voor veilingen en mis de periodieke veilingen niet waar u gemakkelijk kunt kopen of verkopen. Ons veilingplatform is speciaal ontworpen voor professionals uit de automobielsector en biedt een veilige en transparante omgeving.',
      dk: 'Upload dine køretøjer til auktioner og gå ikke glip af de periodiske auktioner, hvor du nemt kan købe eller sælge. Vores auktionsplatform er specielt designet til professionelle i bilindustrien og tilbyder et sikkert og gennemsigtigt miljø.',
      pl: 'Prześlij swoje pojazdy na aukcje i nie przegap okresowych aukcji, na których możesz łatwo kupić lub sprzedać. Nasza platforma aukcyjna jest specjalnie zaprojektowana dla profesjonalistów z branży motoryzacyjnej, oferując bezpieczne i przejrzyste środowisko.'
    },
    features: {
      title: {
        es: 'Características Principales',
        en: 'Key Features',
        fr: 'Caractéristiques Principales',
        it: 'Caratteristiche Principali',
        de: 'Hauptmerkmale',
        pt: 'Características Principais',
        nl: 'Belangrijkste Kenmerken',
        dk: 'Nøglefunktioner',
        pl: 'Główne Cechy'
      },
      periodic: {
        title: {
          es: 'Subastas Periódicas',
          en: 'Periodic Auctions',
          fr: 'Enchères Périodiques',
          it: 'Aste Periodiche',
          de: 'Regelmäßige Auktionen',
          pt: 'Leilões Periódicos',
          nl: 'Periodieke Veilingen',
          dk: 'Periodiske Auktioner',
          pl: 'Aukcje Okresowe'
        },
        description: {
          es: 'Eventos de subasta programados regularmente para maximizar la participación.',
          en: 'Regularly scheduled auction events to maximize participation.',
          fr: 'Événements d\'enchères régulièrement programmés pour maximiser la participation.',
          it: 'Eventi d\'asta programmati regolarmente per massimizzare la partecipazione.',
          de: 'Regelmäßig geplante Auktionsveranstaltungen zur Maximierung der Teilnahme.',
          pt: 'Eventos de leilão programados regularmente para maximizar a participação.',
          nl: 'Regelmatig geplande veilingevenementen om deelname te maximaliseren.',
          dk: 'Regelmæssigt planlagte auktionsbegivenheder for at maksimere deltagelsen.',
          pl: 'Regularnie zaplanowane wydarzenia aukcyjne w celu maksymalizacji uczestnictwa.'
        }
      },
      competitive: {
        title: {
          es: 'Precios Competitivos',
          en: 'Competitive Prices',
          fr: 'Prix Compétitifs',
          it: 'Prezzi Competitivi',
          de: 'Wettbewerbsfähige Preise',
          pt: 'Preços Competitivos',
          nl: 'Concurrerende Prijzen',
          dk: 'Konkurrencedygtige Priser',
          pl: 'Konkurencyjne Ceny'
        },
        description: {
          es: 'Sistema de pujas transparente que garantiza el mejor valor de mercado.',
          en: 'Transparent bidding system that ensures the best market value.',
          fr: 'Système d\'enchères transparent qui garantit la meilleure valeur marchande.',
          it: 'Sistema di offerta trasparente che garantisce il miglior valore di mercato.',
          de: 'Transparentes Bietverfahren, das den besten Marktwert gewährleistet.',
          pt: 'Sistema de lances transparente que garante o melhor valor de mercado.',
          nl: 'Transparant biedsysteem dat de beste marktwaarde garandeert.',
          dk: 'Gennemsigtigt budsystem, der sikrer den bedste markedsværdi.',
          pl: 'Przejrzysty system licytacji, który zapewnia najlepszą wartość rynkową.'
        }
      },
      secure: {
        title: {
          es: 'Entorno Seguro',
          en: 'Secure Environment',
          fr: 'Environnement Sécurisé',
          it: 'Ambiente Sicuro',
          de: 'Sichere Umgebung',
          pt: 'Ambiente Seguro',
          nl: 'Veilige Omgeving',
          dk: 'Sikkert Miljø',
          pl: 'Bezpieczne Środowisko'
        },
        description: {
          es: 'Verificación de participantes y transacciones protegidas.',
          en: 'Participant verification and protected transactions.',
          fr: 'Vérification des participants et transactions protégées.',
          it: 'Verifica dei partecipanti e transazioni protette.',
          de: 'Teilnehmerverifizierung und geschützte Transaktionen.',
          pt: 'Verificação de participantes e transações protegidas.',
          nl: 'Deelnemersverificatie en beschermde transacties.',
          dk: 'Deltagerverifikation og beskyttede transaktioner.',
          pl: 'Weryfikacja uczestników i chronione transakcje.'
        }
      },
      fast: {
        title: {
          es: 'Proceso Rápido',
          en: 'Fast Process',
          fr: 'Processus Rapide',
          it: 'Processo Veloce',
          de: 'Schneller Prozess',
          pt: 'Processo Rápido',
          nl: 'Snel Proces',
          dk: 'Hurtig Proces',
          pl: 'Szybki Proces'
        },
        description: {
          es: 'Desde la puja hasta la transacción final de manera ágil y eficiente.',
          en: 'From bidding to final transaction in an agile and efficient manner.',
          fr: 'De l\'enchère à la transaction finale de manière agile et efficace.',
          it: 'Dall\'offerta alla transazione finale in modo agile ed efficiente.',
          de: 'Von der Gebotabgabe bis zur Endtransaktion auf agile und effiziente Weise.',
          pt: 'Desde o lance até a transação final de maneira ágil e eficiente.',
          nl: 'Van bieding tot definitieve transactie op een flexibele en efficiënte manier.',
          dk: 'Fra bud til endelig transaktion på en smidig og effektiv måde.',
          pl: 'Od licytacji do ostatecznej transakcji w zwinny i efektywny sposób.'
        }
      }
    },
    howItWorks: {
      title: {
        es: 'Cómo Funciona',
        en: 'How It Works',
        fr: 'Comment Ça Marche',
        it: 'Come Funziona',
        de: 'Wie Es Funktioniert',
        pt: 'Como Funciona',
        nl: 'Hoe Het Werkt',
        dk: 'Hvordan Det Virker',
        pl: 'Jak To Działa'
      },
      step1: {
        es: 'Regístrate y verifica tu cuenta profesional',
        en: 'Register and verify your professional account',
        fr: 'Inscrivez-vous et vérifiez votre compte professionnel',
        it: 'Registrati e verifica il tuo account professionale',
        de: 'Registrieren und verifizieren Sie Ihr professionelles Konto',
        pt: 'Registre-se e verifique sua conta profissional',
        nl: 'Registreer en verifieer uw professionele account',
        dk: 'Tilmeld dig og verificer din professionelle konto',
        pl: 'Zarejestruj się i zweryfikuj swoje konto profesjonalne'
      },
      step2: {
        es: 'Sube tus vehículos con documentación completa',
        en: 'Upload your vehicles with complete documentation',
        fr: 'Téléchargez vos véhicules avec documentation complète',
        it: 'Carica i tuoi veicoli con documentazione completa',
        de: 'Laden Sie Ihre Fahrzeuge mit vollständiger Dokumentation hoch',
        pt: 'Envie seus veículos com documentação completa',
        nl: 'Upload uw voertuigen met volledige documentatie',
        dk: 'Upload dine køretøjer med komplet dokumentation',
        pl: 'Prześlij swoje pojazdy z pełną dokumentacją'
      },
      step3: {
        es: 'Participa en subastas o crea las tuyas propias',
        en: 'Participate in auctions or create your own',
        fr: 'Participez aux enchères ou créez les vôtres',
        it: 'Partecipa alle aste o crea le tue',
        de: 'Nehmen Sie an Auktionen teil oder erstellen Sie Ihre eigenen',
        pt: 'Participe de leilões ou crie os seus próprios',
        nl: 'Neem deel aan veilingen of creëer uw eigen',
        dk: 'Deltag i auktioner eller opret dine egne',
        pl: 'Weź udział w aukcjach lub stwórz własne'
      },
      step4: {
        es: 'Completa la transacción de forma segura',
        en: 'Complete the transaction securely',
        fr: 'Complétez la transaction en toute sécurité',
        it: 'Completa la transazione in modo sicuro',
        de: 'Schließen Sie die Transaktion sicher ab',
        pt: 'Complete a transação com segurança',
        nl: 'Voltooi de transactie veilig',
        dk: 'Gennemfør transaktionen sikkert',
        pl: 'Bezpiecznie zakończ transakcję'
      }
    }
  };

  const lang = currentLanguage as keyof typeof translations.title;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section con imagen de fondo */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-8">
        <div className="absolute inset-0">
          <img 
            src="/images/auctions-hero.png"
            alt="Auctions Background"
            className="w-full h-full object-contain object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="relative z-10 p-8 bg-gradient-to-r from-black/20 to-black/10" style={{ minHeight: '320px' }}>
          <div className="max-w-7xl mx-auto flex flex-col justify-center h-full">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="mb-4 inline-flex items-center text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('navigation.backToHome')}
            </button>
            
            <h1 className="text-4xl font-bold text-white mb-3">
              {translations.title[lang] || translations.title.es}
            </h1>
            <p className="text-lg text-white font-bold max-w-3xl">
              {translations.subtitle[lang] || translations.subtitle.es}
            </p>
          </div>
        </div>
      </div>

      {/* Descripción principal */}
      <div className="mb-12">
        <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
          {translations.description[lang] || translations.description.es}
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {translations.features.title[lang] || translations.features.title.es}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Calendar className="h-10 w-10 text-blue-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {translations.features.periodic.title[lang] || translations.features.periodic.title.es}
              </h3>
              <p className="text-muted-foreground">
                {translations.features.periodic.description[lang] || translations.features.periodic.description.es}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <TrendingUp className="h-10 w-10 text-green-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {translations.features.competitive.title[lang] || translations.features.competitive.title.es}
              </h3>
              <p className="text-muted-foreground">
                {translations.features.competitive.description[lang] || translations.features.competitive.description.es}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Shield className="h-10 w-10 text-purple-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {translations.features.secure.title[lang] || translations.features.secure.title.es}
              </h3>
              <p className="text-muted-foreground">
                {translations.features.secure.description[lang] || translations.features.secure.description.es}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Zap className="h-10 w-10 text-amber-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {translations.features.fast.title[lang] || translations.features.fast.title.es}
              </h3>
              <p className="text-muted-foreground">
                {translations.features.fast.description[lang] || translations.features.fast.description.es}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {translations.howItWorks.title[lang] || translations.howItWorks.title.es}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                      1
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-muted-foreground">
                {translations.howItWorks.step1[lang] || translations.howItWorks.step1.es}
              </p>
            </CardContent>
          </Card>

              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                      2
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-muted-foreground">
                {translations.howItWorks.step2[lang] || translations.howItWorks.step2.es}
              </p>
            </CardContent>
          </Card>

              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                      3
                    </div>
                    <Gavel className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-muted-foreground">
                {translations.howItWorks.step3[lang] || translations.howItWorks.step3.es}
              </p>
            </CardContent>
          </Card>

              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                      4
                    </div>
                    <Award className="h-8 w-8 text-amber-400" />
              </div>
              <p className="text-muted-foreground">
                {translations.howItWorks.step4[lang] || translations.howItWorks.step4.es}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuctionsInfoPage;
