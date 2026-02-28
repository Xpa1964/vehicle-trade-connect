
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRightLeft, Search, Car, HandshakeIcon, Truck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useStaticImage } from '@/hooks/useStaticImage';

const ExchangesInfoPage: React.FC = () => {
  // Use registry-based image that updates from Storage
  const { src: exchangesHeroSrc } = useStaticImage('hero.exchanges');
  const { currentLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const translations = {
    title: {
      es: 'Intercambios de Vehículos',
      en: 'Vehicle Exchanges',
      fr: 'Échanges de Véhicules',
      it: 'Scambi di Veicoli',
      de: 'Fahrzeugaustausch',
      nl: 'Voertuiguitwisselingen',
      pt: 'Trocas de Veículos',
      pl: 'Wymiana Pojazdów',
      dk: 'Køretøjsudvekslinger'
    },
    subtitle: {
      es: 'Una alternativa eficiente para expandir su inventario',
      en: 'An efficient alternative to expand your inventory',
      fr: 'Une alternative efficace pour élargir votre inventaire',
      it: 'Un\'alternativa efficiente per espandere il tuo inventario',
      de: 'Eine effiziente Alternative zur Erweiterung Ihres Inventars',
      nl: 'Een efficiënt alternatief om uw inventaris uit te breiden',
      pt: 'Uma alternativa eficiente para expandir seu inventário',
      pl: 'Efektywna alternatywa dla rozszerzenia Twojego inwentarza',
      dk: 'Et effektivt alternativ til at udvide dit lager'
    },
    description: {
      es: 'Nuestra plataforma de intercambio de vehículos conecta a profesionales que desean expandir o diversificar su inventario, facilitando el intercambio directo de vehículos entre comerciantes.',
      en: 'Our vehicle exchange platform connects professionals who want to expand or diversify their inventory without monetary transactions, facilitating direct vehicle exchanges between traders.',
      fr: 'Notre plateforme d\'échange de véhicules connecte les professionnels qui souhaitent élargir ou diversifier leur inventaire sans transactions monétaires, facilitant l\'échange direct de véhicules entre commerçants.',
      it: 'La nostra piattaforma di scambio di veicoli collega professionisti che desiderano espandere o diversificare il loro inventario senza transazioni monetarie, facilitando lo scambio diretto di veicoli tra commercianti.',
      de: 'Unsere Fahrzeugaustauschplattform verbindet Fachleute, die ihr Inventar ohne Geldtransaktionen erweitern oder diversifizieren möchten, und erleichtert den direkten Fahrzeugaustausch zwischen Händlern.',
      nl: 'Ons voertuiguitwisselingsplatform verbindt professionals die hun inventaris willen uitbreiden of diversifiëren zonder geldelijke transacties, en faciliteert directe voertuiguitwisselingen tussen handelaren.',
      pt: 'Nossa plataforma de troca de veículos conecta profissionais que desejam expandir ou diversificar seu inventário sem transações monetárias, facilitando a troca direta de veículos entre comerciantes.',
      pl: 'Nasza platforma wymiany pojazdów łączy profesjonalistów, którzy chcą rozszerzyć lub zdywersyfikować swój inwentarz bez transakcji pieniężnych, ułatwiając bezpośrednią wymianę pojazdów między handlowcami.',
      dk: 'Vores køretøjsudvekslingsplatform forbinder fagfolk, der ønsker at udvide eller diversificere deres lager uden pengetransaktioner, og letter direkte køretøjsudvekslinger mellem forhandlere.'
    },
    features: {
      title: {
        es: 'Características Principales',
        en: 'Key Features',
        fr: 'Caractéristiques Principales',
        it: 'Caratteristiche Principali',
        de: 'Hauptmerkmale',
        nl: 'Belangrijkste Kenmerken',
        pt: 'Características Principais',
        pl: 'Główne Cechy',
        dk: 'Nøglefunktioner'
      },
      matching: {
        title: {
          es: 'Sistema de Coincidencias',
          en: 'Matching System',
          fr: 'Système de Correspondance',
          it: 'Sistema di Abbinamento',
          de: 'Matching-System',
          nl: 'Matchingssysteem',
          pt: 'Sistema de Correspondência',
          pl: 'System Dopasowywania',
          dk: 'Matchningssystem'
        },
        description: {
          es: 'Algoritmo inteligente que conecta ofertas complementarias.',
          en: 'Smart algorithm that connects complementary offers.',
          fr: 'Algorithme intelligent qui connecte des offres complémentaires.',
          it: 'Algoritmo intelligente che collega offerte complementari.',
          de: 'Intelligenter Algorithmus, der komplementäre Angebote verbindet.',
          nl: 'Slim algoritme dat complementaire aanbiedingen verbindt.',
          pt: 'Algoritmo inteligente que conecta ofertas complementares.',
          pl: 'Inteligentny algorytm łączący komplementarne oferty.',
          dk: 'Smart algoritme, der forbinder komplementære tilbud.'
        }
      },
      preferences: {
        title: {
          es: 'Preferencias Detalladas',
          en: 'Detailed Preferences',
          fr: 'Préférences Détaillées',
          it: 'Preferenze Dettagliate',
          de: 'Detaillierte Präferenzen',
          nl: 'Gedetailleerde Voorkeuren',
          pt: 'Preferências Detalhadas',
          pl: 'Szczegółowe Preferencje',
          dk: 'Detaljerede Præferencer'
        },
        description: {
          es: 'Especifique exactamente qué vehículos aceptaría a cambio.',
          en: 'Specify exactly which vehicles you would accept in return.',
          fr: 'Spécifiez exactement quels véhicules vous accepteriez en retour.',
          it: 'Specifica esattamente quali veicoli accetteresti in cambio.',
          de: 'Geben Sie genau an, welche Fahrzeuge Sie im Gegenzug akzeptieren würden.',
          nl: 'Specificeer exact welke voertuigen u in ruil zou accepteren.',
          pt: 'Especifique exatamente quais veículos você aceitaria em troca.',
          pl: 'Określ dokładnie, jakie pojazdy zaakceptowałbyś w zamian.',
          dk: 'Angiv præcist, hvilke køretøjer du ville acceptere til gengæld.'
        }
      },
      direct: {
        title: {
          es: 'Comunicación Directa',
          en: 'Direct Communication',
          fr: 'Communication Directe',
          it: 'Comunicazione Diretta',
          de: 'Direkte Kommunikation',
          nl: 'Directe Communicatie',
          pt: 'Comunicação Direta',
          pl: 'Bezpośrednia Komunikacja',
          dk: 'Direkte Kommunikation'
        },
        description: {
          es: 'Negocie directamente con otros comerciantes interesados.',
          en: 'Negotiate directly with other interested traders.',
          fr: 'Négociez directement avec d\'autres commerçants intéressés.',
          it: 'Negozia direttamente con altri commercianti interessati.',
          de: 'Verhandeln Sie direkt mit anderen interessierten Händlern.',
          nl: 'Onderhandel direct met andere geïnteresseerde handelaren.',
          pt: 'Negocie diretamente com outros comerciantes interessados.',
          pl: 'Negocjuj bezpośrednio z innymi zainteresowanymi handlowcami.',
          dk: 'Forhandl direkte med andre interesserede forhandlere.'
        }
      },
      logistics: {
        title: {
          es: 'Soporte Logístico',
          en: 'Logistics Support',
          fr: 'Support Logistique',
          it: 'Supporto Logistico',
          de: 'Logistikunterstützung',
          nl: 'Logistieke Ondersteuning',
          pt: 'Suporte Logístico',
          pl: 'Wsparcie Logistyczne',
          dk: 'Logistisk Support'
        },
        description: {
          es: 'Asistencia opcional para la organización del transporte.',
          en: 'Optional assistance for transport organization.',
          fr: 'Assistance optionnelle pour l\'organisation du transport.',
          it: 'Assistenza opzionale per l\'organizzazione del trasporto.',
          de: 'Optionale Unterstützung bei der Transportorganisation.',
          nl: 'Optionele hulp bij de organisatie van transport.',
          pt: 'Assistência opcional para organização de transporte.',
          pl: 'Opcjonalna pomoc w organizacji transportu.',
          dk: 'Valgfri assistance til transportorganisation.'
        }
      }
    },
    
    examples: {
      title: {
        es: 'Ejemplos de Intercambios',
        en: 'Exchange Examples',
        fr: 'Exemples d\'Échanges',
        it: 'Esempi di Scambi',
        de: 'Austauschbeispiele',
        nl: 'Uitwisselingsvoorbeelden',
        pt: 'Exemplos de Trocas',
        pl: 'Przykłady Wymiany',
        dk: 'Udvekslingseksempler'
      },
      simple: {
        title: {
          es: 'Intercambio Directo',
          en: 'Direct Exchange',
          fr: 'Échange Direct',
          it: 'Scambio Diretto',
          de: 'Direkter Austausch',
          nl: 'Directe Uitwisseling',
          pt: 'Troca Direta',
          pl: 'Bezpośrednia Wymiana',
          dk: 'Direkte Udveksling'
        },
        content: {
          es: 'Concesionario en Madrid ofrece Mercedes-Benz Clase C (2021) con 30.000 km. Busca BMW Serie 3 o Serie 5 de similar valor y antigüedad, preferiblemente de Francia o Alemania.',
          en: 'Dealer in Madrid offers Mercedes-Benz C-Class (2021) with 30,000 km. Seeks BMW 3 Series or 5 Series of similar value and age, preferably from France or Germany.',
          fr: 'Concessionnaire à Madrid propose Mercedes-Benz Classe C (2021) avec 30 000 km. Recherche BMW Série 3 ou Série 5 de valeur et d\'âge similaires, de préférence de France ou d\'Allemagne.',
          it: 'Concessionario a Madrid offre Mercedes-Benz Classe C (2021) con 30.000 km. Cerca BMW Serie 3 o Serie 5 di valore ed età simili, preferibilmente dalla Francia o dalla Germania.',
          de: 'Händler in Madrid bietet Mercedes-Benz C-Klasse (2021) mit 30.000 km an. Sucht BMW 3er oder 5er Serie mit ähnlichem Wert und Alter, vorzugsweise aus Frankreich oder Deutschland.',
          nl: 'Dealer in Madrid biedt Mercedes-Benz C-Klasse (2021) met 30.000 km aan. Zoekt BMW 3-serie of 5-serie van vergelijkbare waarde en leeftijd, bij voorkeur uit Frankrijk of Duitsland.',
          pt: 'Concessionária em Madrid oferece Mercedes-Benz Classe C (2021) com 30.000 km. Busca BMW Série 3 ou Série 5 de valor e idade similares, preferencialmente da França ou Alemanha.',
          pl: 'Dealer w Madrycie oferuje Mercedes-Benz Klasa C (2021) z przebiegiem 30.000 km. Poszukuje BMW serii 3 lub 5 o podobnej wartości i wieku, najlepiej z Francji lub Niemiec.',
          dk: 'Forhandler i Madrid tilbyder Mercedes-Benz C-Klasse (2021) med 30.000 km. Søger BMW 3-serie eller 5-serie af tilsvarende værdi og alder, helst fra Frankrig eller Tyskland.'
        }
      },
      multiple: {
        title: {
          es: 'Intercambio Múltiple',
          en: 'Multiple Exchange',
          fr: 'Échange Multiple',
          it: 'Scambio Multiplo',
          de: 'Mehrfachaustausch',
          nl: 'Meervoudige Uitwisseling',
          pt: 'Troca Múltipla',
          pl: 'Wymiana Wielokrotna',
          dk: 'Flere Udvekslinger'
        },
        content: {
          es: 'Distribuidor de Barcelona ofrece 2 Audi A4 (2022) a cambio de una furgoneta Mercedes-Benz Sprinter (2020-2023) en buen estado, con kilometraje máximo de 50.000 km.',
          en: 'Barcelona dealer offers 2 Audi A4 (2022) in exchange for a Mercedes-Benz Sprinter van (2020-2023) in good condition, with maximum mileage of 50,000 km.',
          fr: 'Distributeur de Barcelone propose 2 Audi A4 (2022) en échange d\'un fourgon Mercedes-Benz Sprinter (2020-2023) en bon état, avec kilométrage maximum de 50 000 km.',
          it: 'Distributore di Barcellona offre 2 Audi A4 (2022) in cambio di un furgone Mercedes-Benz Sprinter (2020-2023) in buone condizioni, con chilometraggio massimo di 50.000 km.',
          de: 'Händler in Barcelona bietet 2 Audi A4 (2022) im Austausch gegen einen Mercedes-Benz Sprinter Transporter (2020-2023) in gutem Zustand mit maximal 50.000 km Laufleistung.',
          nl: 'Dealer in Barcelona biedt 2 Audi A4 (2022) in ruil voor een Mercedes-Benz Sprinter bestelwagen (2020-2023) in goede staat, met maximaal 50.000 km.',
          pt: 'Distribuidor de Barcelona oferece 2 Audi A4 (2022) em troca de uma van Mercedes-Benz Sprinter (2020-2023) em bom estado, com quilometragem máxima de 50.000 km.',
          pl: 'Dealer w Barcelonie oferuje 2 Audi A4 (2022) w zamian za furgonetkę Mercedes-Benz Sprinter (2020-2023) w dobrym stanie, z maksymalnym przebiegiem 50.000 km.',
          dk: 'Forhandler i Barcelona tilbyder 2 Audi A4 (2022) i bytte for en Mercedes-Benz Sprinter varevogn (2020-2023) i god stand, med maksimal kørsel på 50.000 km.'
        }
      },
      brands: {
        title: {
          es: 'Intercambio por Marcas',
          en: 'Exchange by Brands',
          fr: 'Échange par Marques',
          it: 'Scambio per Marche',
          de: 'Austausch nach Marken',
          nl: 'Uitwisseling per Merk',
          pt: 'Troca por Marcas',
          pl: 'Wymiana według Marek',
          dk: 'Udveksling efter Mærker'
        },
        content: {
          es: 'Importador de Milán busca diversificar su inventario. Ofrece vehículos Alfa Romeo y Fiat (2020-2023) a cambio de modelos franceses (Renault, Peugeot) o alemanes (Volkswagen, Opel) de similar valor.',
          en: 'Milan importer looking to diversify inventory. Offers Alfa Romeo and Fiat vehicles (2020-2023) in exchange for French models (Renault, Peugeot) or German models (Volkswagen, Opel) of similar value.',
          fr: 'Importateur de Milan cherchant à diversifier son inventaire. Propose des véhicules Alfa Romeo et Fiat (2020-2023) en échange de modèles français (Renault, Peugeot) ou allemands (Volkswagen, Opel) de valeur similaire.',
          it: 'Importatore di Milano che cerca di diversificare il proprio inventario. Offre veicoli Alfa Romeo e Fiat (2020-2023) in cambio di modelli francesi (Renault, Peugeot) o tedeschi (Volkswagen, Opel) di valore simile.',
          de: 'Importeur aus Mailand möchte sein Inventar diversifizieren. Bietet Alfa Romeo und Fiat Fahrzeuge (2020-2023) im Austausch gegen französische Modelle (Renault, Peugeot) oder deutsche Modelle (Volkswagen, Opel) mit ähnlichem Wert.',
          nl: 'Importeur uit Milaan wil zijn inventaris diversifiëren. Biedt Alfa Romeo en Fiat voertuigen (2020-2023) in ruil voor Franse modellen (Renault, Peugeot) of Duitse modellen (Volkswagen, Opel) van vergelijkbare waarde.',
          pt: 'Importador de Milão busca diversificar seu inventário. Oferece veículos Alfa Romeo e Fiat (2020-2023) em troca de modelos franceses (Renault, Peugeot) ou alemães (Volkswagen, Opel) de valor similar.',
          pl: 'Importer z Mediolanu chce zdywersyfikować swój inwentarz. Oferuje pojazdy Alfa Romeo i Fiat (2020-2023) w zamian za francuskie modele (Renault, Peugeot) lub niemieckie modele (Volkswagen, Opel) o podobnej wartości.',
          dk: 'Importør fra Milano søger at diversificere sit lager. Tilbyder Alfa Romeo og Fiat køretøjer (2020-2023) i bytte for franske modeller (Renault, Peugeot) eller tyske modeller (Volkswagen, Opel) af tilsvarende værdi.'
        }
      },
      fleet: {
        title: {
          es: 'Renovación de Flota',
          en: 'Fleet Renewal',
          fr: 'Renouvellement de Flotte',
          it: 'Rinnovo della Flotta',
          de: 'Flottenerneuerung',
          nl: 'Vlootvernieuwing',
          pt: 'Renovação de Frota',
          pl: 'Odnowienie Floty',
          dk: 'Flådefornyelse'
        },
        content: {
          es: 'Empresa de alquiler en París ofrece 5 Renault Clio (2021) con 40.000-45.000 km cada uno, en excelente estado. Busca renovar a modelos híbridos o eléctricos, considerando Toyota Yaris Hybrid o Peugeot e-208.',
          en: 'Paris-based rental company offers 5 Renault Clio (2021) with 40,000-45,000 km each, in excellent condition. Looking to upgrade to hybrid or electric models, considering Toyota Yaris Hybrid or Peugeot e-208.',
          fr: 'Société de location basée à Paris propose 5 Renault Clio (2021) avec 40 000-45 000 km chacune, en excellent état. Cherche à passer aux modèles hybrides ou électriques, considérant Toyota Yaris Hybrid ou Peugeot e-208.',
          it: 'Società di noleggio con sede a Parigi offre 5 Renault Clio (2021) con 40.000-45.000 km ciascuna, in ottime condizioni. Cerca di passare a modelli ibridi o elettrici, considerando Toyota Yaris Hybrid o Peugeot e-208.',
          de: 'Pariser Autovermietung bietet 5 Renault Clio (2021) mit jeweils 40.000-45.000 km in ausgezeichnetem Zustand. Möchte auf Hybrid- oder Elektromodelle upgraden, in Betracht ziehen Toyota Yaris Hybrid oder Peugeot e-208.',
          nl: 'Verhuurbedrijf in Parijs biedt 5 Renault Clio (2021) met elk 40.000-45.000 km, in uitstekende staat. Wil upgraden naar hybride of elektrische modellen, overweegt Toyota Yaris Hybrid of Peugeot e-208.',
          pt: 'Empresa de aluguel em Paris oferece 5 Renault Clio (2021) com 40.000-45.000 km cada, em excelente estado. Busca renovar para modelos híbridos ou elétricos, considerando Toyota Yaris Hybrid ou Peugeot e-208.',
          pl: 'Firma wynajmująca z Paryża oferuje 5 Renault Clio (2021) z przebiegiem 40.000-45.000 km każdy, w doskonałym stanie. Szuka modernizacji do modeli hybrydowych lub elektrycznych, rozważając Toyota Yaris Hybrid lub Peugeot e-208.',
          dk: 'Paris-baseret udlejningsfirma tilbyder 5 Renault Clio (2021) med 40.000-45.000 km hver, i fremragende stand. Søger at opgradere til hybrid- eller elektriske modeller, overvejer Toyota Yaris Hybrid eller Peugeot e-208.'
        }
      }
    }
  };

  const lang = currentLanguage as keyof typeof translations.title;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
        <div className="absolute inset-0">
          <img 
            src={exchangesHeroSrc}
            alt="Exchanges Background"
            className="w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
        
        <div className="relative z-10 p-8 min-h-[320px]">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full">
            <div className="flex flex-col justify-end flex-1 h-full">
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Inicio
                </Button>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
                {translations.title[lang] || translations.title.es}
              </h1>
              <p className="text-lg text-white font-bold drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
                {translations.subtitle[lang] || translations.subtitle.es}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-12">
        <p className="max-w-3xl mx-auto text-foreground">
          {translations.description[lang] || translations.description.es}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center">
            <ArrowRightLeft className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{translations.features.matching.title[lang] || translations.features.matching.title.es}</h3>
            <p className="text-center text-muted-foreground">{translations.features.matching.description[lang] || translations.features.matching.description.es}</p>
          </CardContent>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center">
            <Search className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{translations.features.preferences.title[lang] || translations.features.preferences.title.es}</h3>
            <p className="text-center text-muted-foreground">{translations.features.preferences.description[lang] || translations.features.preferences.description.es}</p>
          </CardContent>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center">
            <Car className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{translations.features.direct.title[lang] || translations.features.direct.title.es}</h3>
            <p className="text-center text-muted-foreground">{translations.features.direct.description[lang] || translations.features.direct.description.es}</p>
          </CardContent>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center">
            <Truck className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{translations.features.logistics.title[lang] || translations.features.logistics.title.es}</h3>
            <p className="text-center text-muted-foreground">{translations.features.logistics.description[lang] || translations.features.logistics.description.es}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {translations.examples.title[lang] || translations.examples.title.es}
        </h2>

        <Tabs defaultValue="simple">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="simple" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              {translations.examples.simple.title[lang] || translations.examples.simple.title.es}
            </TabsTrigger>
            <TabsTrigger value="multiple" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              {translations.examples.multiple.title[lang] || translations.examples.multiple.title.es}
            </TabsTrigger>
            <TabsTrigger value="brands" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {translations.examples.brands.title[lang] || translations.examples.brands.title.es}
            </TabsTrigger>
            <TabsTrigger value="fleet" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              {translations.examples.fleet.title[lang] || translations.examples.fleet.title.es}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground italic">
                  "{translations.examples.simple.content[lang] || translations.examples.simple.content.es}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="multiple">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground italic">
                  "{translations.examples.multiple.content[lang] || translations.examples.multiple.content.es}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="brands">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground italic">
                  "{translations.examples.brands.content[lang] || translations.examples.brands.content.es}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fleet">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground italic">
                  "{translations.examples.fleet.content[lang] || translations.examples.fleet.content.es}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExchangesInfoPage;
