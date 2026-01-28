import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ReportPackages from '@/components/info-pages/vehicle-reports/ReportPackages';
import ReportFeatures from '@/components/info-pages/vehicle-reports/ReportFeatures';

const VehicleReportsInfoPage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  
  const translations = {
    title: {
      es: 'Informes de Vehículos',
      en: 'Vehicle Reports',
      fr: 'Rapports de Véhicules',
      it: 'Rapporti sui Veicoli'
    },
    subtitle: {
      es: 'Información detallada y verificada sobre cualquier vehículo',
      en: 'Detailed and verified information on any vehicle',
      fr: 'Informations détaillées et vérifiées sur n\'importe quel véhicule',
      it: 'Informazioni dettagliate e verificate su qualsiasi veicolo'
    },
    restrictionNotice: {
      es: 'IMPORTANTE: Todos nuestros informes están limitados a vehículos matriculados en España.',
      en: 'IMPORTANT: All our reports are limited to vehicles registered in Spain.',
      fr: 'IMPORTANT: Tous nos rapports sont limités aux véhicules immatriculés en Espagne.',
      it: 'IMPORTANTE: Tutti i nostri rapporti sono limitati ai veicoli immatricolati in Spagna.',
      de: 'WICHTIG: Alle unsere Berichte sind auf in Spanien zugelassene Fahrzeuge beschränkt.',
      nl: 'BELANGRIJK: Alle onze rapporten zijn beperkt tot in Spanje geregistreerde voertuigen.',
      pl: 'WAŻNE: Wszystkie nasze raporty są ograniczone do pojazdów zarejestrowanych w Hiszpanii.',
      pt: 'IMPORTANTE: Todos os nossos relatórios estão limitados a veículos matriculados na Espanha.',
      dk: 'VIGTIGT: Alle vores rapporter er begrænset til køretøjer registreret i Spanien.'
    },
    reportTypes: {
      title: {
        es: 'Tipos de Informes',
        en: 'Report Types',
        fr: 'Types de Rapports',
        it: 'Tipi di Rapporti'
      },
      basic: {
        title: {
          es: 'Informe DGT',
          en: 'DGT Report',
          fr: 'Rapport DGT',
          it: 'Rapporto DGT',
          de: 'DGT-Bericht',
          nl: 'DGT-Rapport',
          pl: 'Raport DGT',
          pt: 'Relatório DGT',
          dk: 'DGT-Rapport'
        },
        description: {
          es: 'Información oficial procedente de la Dirección General de Tráfico',
          en: 'Official information from the Traffic General Directorate',
          fr: 'Informations officielles de la Direction Générale de la Circulation',
          it: 'Informazioni ufficiali dalla Direzione Generale del Traffico',
          de: 'Offizielle Informationen der Generaldirektion für Verkehr',
          nl: 'Officiële informatie van de Algemene Directie Verkeer',
          pl: 'Oficjalne informacje z Dyrekcji Generalnej Ruchu Drogowego',
          pt: 'Informação oficial da Direção Geral de Tráfego',
          dk: 'Officiel information fra Generaldirektoratet for Trafik'
        },
        features: {
          es: [
            'Datos de identificación del vehículo (matrícula, bastidor)',
            'Historial de titularidad',
            'Historial de lecturas del cuentakilómetros',
            'Cargas o gravámenes vigentes',
            'Historial de inspecciones técnicas (ITV)',
            'Historial de bajas temporales',
            'Datos técnicos oficiales (cilindrada, potencia, combustible)'
          ],
          en: [
            'Vehicle identification data (license plate, chassis)',
            'Ownership history',
            'Odometer reading history',
            'Current liens or encumbrances',
            'Technical inspection history (ITV)',
            'Temporary deregistration history',
            'Official technical data (displacement, power, fuel)'
          ],
          fr: [
            'Données d\'identification du véhicule (plaque, châssis)',
            'Historique de propriété',
            'Historique des relevés du compteur kilométrique',
            'Charges ou hypothèques en vigueur',
            'Historique des inspections techniques (ITV)',
            'Historique des radiations temporaires',
            'Données techniques officielles (cylindrée, puissance, carburant)'
          ],
          it: [
            'Dati di identificazione del veicolo (targa, telaio)',
            'Cronologia di proprietà',
            'Cronologia delle letture del contachilometri',
            'Gravami o ipoteche vigenti',
            'Cronologia delle ispezioni tecniche (ITV)',
            'Cronologia delle radiazioni temporanee',
            'Dati tecnici ufficiali (cilindrata, potenza, carburante)'
          ],
          de: [
            'Fahrzeugidentifikationsdaten (Kennzeichen, Fahrgestell)',
            'Eigentumsverlauf',
            'Kilometerzähler-Verlauf',
            'Gültige Belastungen oder Pfandrechte',
            'Technische Inspektionsverlauf (ITV)',
            'Verlauf vorübergehender Abmeldungen',
            'Offizielle technische Daten (Hubraum, Leistung, Kraftstoff)'
          ],
          nl: [
            'Voertuigidentificatiegegevens (kenteken, chassis)',
            'Eigendomsgeschiedenis',
            'Kilometertellergeschiedenis',
            'Huidige beslagen of hypotheken',
            'Technische inspectiegeschiedenis (ITV)',
            'Geschiedenis van tijdelijke afmeldingen',
            'Officiële technische gegevens (cilinderinhoud, vermogen, brandstof)'
          ],
          pl: [
            'Dane identyfikacyjne pojazdu (tablica rejestracyjna, podwozie)',
            'Historia własności',
            'Historia odczytów licznika kilometrów',
            'Obecne obciążenia lub hipoteki',
            'Historia inspekcji technicznych (ITV)',
            'Historia tymczasowych wyrejestrowań',
            'Oficjalne dane techniczne (pojemność, moc, paliwo)'
          ],
          pt: [
            'Dados de identificação do veículo (matrícula, chassi)',
            'Histórico de propriedade',
            'Histórico de leituras do odômetro',
            'Encargos ou hipotecas vigentes',
            'Histórico de inspeções técnicas (ITV)',
            'Histórico de baixas temporárias',
            'Dados técnicos oficiais (cilindrada, potência, combustível)'
          ],
          dk: [
            'Køretøjsidentifikationsdata (nummerplade, chassis)',
            'Ejerhistorik',
            'Kilometertæller historik',
            'Nuværende byrder eller panterettigheder',
            'Teknisk inspektionshistorik (ITV)',
            'Midlertidig afregistreringshistorik',
            'Officielle tekniske data (slagvolumen, effekt, brændstof)'
          ]
        },
        price: {
          es: '29€',
          en: '€29',
          fr: '29€',
          it: '29€',
          de: '29€',
          nl: '€29',
          pl: '29€',
          pt: '29€',
          dk: '29€'
        }
      },
      plus: {
        title: {
          es: 'Informe Técnico Completo',
          en: 'Complete Technical Report',
          fr: 'Rapport Technique Complet',
          it: 'Rapporto Tecnico Completo',
          de: 'Vollständiger Technischer Bericht',
          nl: 'Volledig Technisch Rapport',
          pl: 'Pełny Raport Techniczny',
          pt: 'Relatório Técnico Completo',
          dk: 'Komplet Teknisk Rapport'
        },
        description: {
          es: 'Informe técnico exhaustivo con todos los datos DGT y análisis adicional',
          en: 'Comprehensive technical report with all DGT data and additional analysis',
          fr: 'Rapport technique exhaustif avec toutes les données DGT et analyse supplémentaire',
          it: 'Rapporto tecnico esaustivo con tutti i dati DGT e analisi aggiuntiva',
          de: 'Umfassender technischer Bericht mit allen DGT-Daten und zusätzlicher Analyse',
          nl: 'Uitgebreid technisch rapport met alle DGT-gegevens en aanvullende analyse',
          pl: 'Kompleksowy raport techniczny ze wszystkimi danymi DGT i dodatkową analizą',
          pt: 'Relatório técnico abrangente com todos os dados DGT e análise adicional',
          dk: 'Omfattende teknisk rapport med alle DGT-data og yderligere analyse'
        },
        features: {
          es: [
            'Todo lo incluido en Informe DGT',
            'Información técnica detallada',
            'Historial completo de inspecciones con defectos',
            'Información medioambiental (emisiones CO2, nivel de emisiones)',
            'Datos de seguridad (EuroNCAP si disponible)',
            'Verificación de antecedentes del titular',
            'Análisis de valoración del vehículo'
          ],
          en: [
            'Everything included in DGT Report',
            'Detailed technical information',
            'Complete inspection history with defects',
            'Environmental information (CO2 emissions, emission level)',
            'Safety data (EuroNCAP if available)',
            'Owner background verification',
            'Vehicle valuation analysis'
          ],
          fr: [
            'Tout ce qui est inclus dans le Rapport DGT',
            'Informations techniques détaillées',
            'Historique complet des inspections avec défauts',
            'Informations environnementales (émissions CO2, niveau d\'émissions)',
            'Données de sécurité (EuroNCAP si disponible)',
            'Vérification des antécédents du titulaire',
            'Analyse d\'évaluation du véhicule'
          ],
          it: [
            'Tutto ciò che è incluso nel Rapporto DGT',
            'Informazioni tecniche dettagliate',
            'Cronologia completa delle ispezioni con difetti',
            'Informazioni ambientali (emissioni CO2, livello di emissioni)',
            'Dati di sicurezza (EuroNCAP se disponibile)',
            'Verifica dei precedenti del titolare',
            'Analisi di valutazione del veicolo'
          ],
          de: [
            'Alles im DGT-Bericht enthalten',
            'Detaillierte technische Informationen',
            'Vollständiger Inspektionsverlauf mit Mängeln',
            'Umweltinformationen (CO2-Emissionen, Emissionsstufe)',
            'Sicherheitsdaten (EuroNCAP falls verfügbar)',
            'Überprüfung der Vorgeschichte des Eigentümers',
            'Fahrzeugbewertungsanalyse'
          ],
          nl: [
            'Alles in DGT-Rapport inbegrepen',
            'Gedetailleerde technische informatie',
            'Volledige inspectiegeschiedenis met gebreken',
            'Milieu-informatie (CO2-uitstoot, emissieniveau)',
            'Veiligheidsgegevens (EuroNCAP indien beschikbaar)',
            'Verificatie achtergrond eigenaar',
            'Voertuigwaarderingsanalyse'
          ],
          pl: [
            'Wszystko zawarte w Raporcie DGT',
            'Szczegółowe informacje techniczne',
            'Pełna historia inspekcji z usterkami',
            'Informacje środowiskowe (emisje CO2, poziom emisji)',
            'Dane bezpieczeństwa (EuroNCAP jeśli dostępne)',
            'Weryfikacja historii właściciela',
            'Analiza wyceny pojazdu'
          ],
          pt: [
            'Tudo incluído no Relatório DGT',
            'Informação técnica detalhada',
            'Histórico completo de inspeções com defeitos',
            'Informação ambiental (emissões CO2, nível de emissões)',
            'Dados de segurança (EuroNCAP se disponível)',
            'Verificação de antecedentes do proprietário',
            'Análise de avaliação do veículo'
          ],
          dk: [
            'Alt inkluderet i DGT-Rapport',
            'Detaljerede tekniske oplysninger',
            'Komplet inspektionshistorik med defekter',
            'Miljøoplysninger (CO2-emissioner, emissionsniveau)',
            'Sikkerhedsdata (EuroNCAP hvis tilgængelig)',
            'Verifikation af ejers baggrund',
            'Køretøjsvurderingsanalyse'
          ]
        },
        price: {
          es: '59€',
          en: '€59',
          fr: '59€',
          it: '59€',
          de: '59€',
          nl: '€59',
          pl: '59€',
          pt: '59€',
          dk: '59€'
        }
      },
      premium: {
        title: {
          es: 'Informe Premium con Inspección Física',
          en: 'Premium Report with Physical Inspection',
          fr: 'Rapport Premium avec Inspection Physique',
          it: 'Rapporto Premium con Ispezione Fisica',
          de: 'Premium-Bericht mit Physischer Inspektion',
          nl: 'Premium Rapport met Fysieke Inspectie',
          pl: 'Raport Premium z Inspekcją Fizyczną',
          pt: 'Relatório Premium com Inspeção Física',
          dk: 'Premium Rapport med Fysisk Inspektion'
        },
        description: {
          es: 'Informe técnico completo + inspección física presencial del vehículo',
          en: 'Complete technical report + on-site physical vehicle inspection',
          fr: 'Rapport technique complet + inspection physique sur place du véhicule',
          it: 'Rapporto tecnico completo + ispezione fisica in loco del veicolo',
          de: 'Vollständiger technischer Bericht + physische Fahrzeuginspektion vor Ort',
          nl: 'Volledig technisch rapport + fysieke voertuiginspectie ter plaatse',
          pl: 'Pełny raport techniczny + fizyczna inspekcja pojazdu na miejscu',
          pt: 'Relatório técnico completo + inspeção física presencial do veículo',
          dk: 'Komplet teknisk rapport + fysisk køretøjsinspektion på stedet'
        },
        features: {
          es: [
            'Todo lo incluido en Informe Técnico',
            'Inspección física presencial del vehículo',
            'Revisión de 126 puntos de inspección',
            'Verificación de carrocería y pintura',
            'Revisión mecánica completa',
            'Estado de neumáticos y frenos',
            'Prueba de funcionamiento de todos los sistemas',
            'Documentación fotográfica detallada',
            'Informe completo entregado en PDF',
            'Certificado de inspección'
          ],
          en: [
            'Everything included in Technical Report',
            'On-site physical vehicle inspection',
            '126-point inspection review',
            'Body and paint verification',
            'Complete mechanical review',
            'Tire and brake condition',
            'Functional test of all systems',
            'Detailed photographic documentation',
            'Complete report delivered in PDF',
            'Inspection certificate'
          ],
          fr: [
            'Tout ce qui est inclus dans le Rapport Technique',
            'Inspection physique sur place du véhicule',
            'Révision de 126 points d\'inspection',
            'Vérification de la carrosserie et de la peinture',
            'Révision mécanique complète',
            'État des pneus et des freins',
            'Test de fonctionnement de tous les systèmes',
            'Documentation photographique détaillée',
            'Rapport complet livré en PDF',
            'Certificat d\'inspection'
          ],
          it: [
            'Tutto ciò che è incluso nel Rapporto Tecnico',
            'Ispezione fisica in loco del veicolo',
            'Revisione di 126 punti di ispezione',
            'Verifica della carrozzeria e della verniciatura',
            'Revisione meccanica completa',
            'Stato di pneumatici e freni',
            'Test di funzionamento di tutti i sistemi',
            'Documentazione fotografica dettagliata',
            'Rapporto completo consegnato in PDF',
            'Certificato di ispezione'
          ],
          de: [
            'Alles im Technischen Bericht enthalten',
            'Physische Fahrzeuginspektion vor Ort',
            '126-Punkte-Inspektionsprüfung',
            'Karosserie- und Lackverifizierung',
            'Vollständige mechanische Überprüfung',
            'Reifen- und Bremsenzustand',
            'Funktionstest aller Systeme',
            'Detaillierte fotografische Dokumentation',
            'Vollständiger Bericht als PDF geliefert',
            'Inspektionszertifikat'
          ],
          nl: [
            'Alles in Technisch Rapport inbegrepen',
            'Fysieke voertuiginspectie ter plaatse',
            '126-punten inspectiecontrole',
            'Carrosserie en lakverificatie',
            'Volledige mechanische controle',
            'Staat van banden en remmen',
            'Functietest van alle systemen',
            'Gedetailleerde fotografische documentatie',
            'Volledig rapport geleverd als PDF',
            'Inspectiecertificaat'
          ],
          pl: [
            'Wszystko zawarte w Raporcie Technicznym',
            'Fizyczna inspekcja pojazdu na miejscu',
            'Przegląd 126 punktów inspekcyjnych',
            'Weryfikacja nadwozia i lakieru',
            'Pełny przegląd mechaniczny',
            'Stan opon i hamulców',
            'Test funkcjonalny wszystkich systemów',
            'Szczegółowa dokumentacja fotograficzna',
            'Pełny raport dostarczony w PDF',
            'Certyfikat inspekcji'
          ],
          pt: [
            'Tudo incluído no Relatório Técnico',
            'Inspeção física presencial do veículo',
            'Revisão de 126 pontos de inspeção',
            'Verificação de carroçaria e pintura',
            'Revisão mecânica completa',
            'Estado de pneus e freios',
            'Teste de funcionamento de todos os sistemas',
            'Documentação fotográfica detalhada',
            'Relatório completo entregue em PDF',
            'Certificado de inspeção'
          ],
          dk: [
            'Alt inkluderet i Teknisk Rapport',
            'Fysisk køretøjsinspektion på stedet',
            '126-punkts inspektionskontrol',
            'Karosseri- og lakverifikation',
            'Komplet mekanisk gennemgang',
            'Dæk- og bremsetilstand',
            'Funktionstest af alle systemer',
            'Detaljeret fotografisk dokumentation',
            'Komplet rapport leveret som PDF',
            'Inspektionscertifikat'
          ]
        },
        price: {
          es: 'Solicitar presupuesto',
          en: 'Request quote',
          fr: 'Demander un devis',
          it: 'Richiedi preventivo',
          de: 'Angebot anfordern',
          nl: 'Vraag offerte aan',
          pl: 'Zapytaj o wycenę',
          pt: 'Solicitar orçamento',
          dk: 'Anmod om tilbud'
        },
        restrictions: {
          es: 'Mínimo 5 vehículos por solicitud | Solo vehículos ubicados en España',
          en: 'Minimum 5 vehicles per request | Only vehicles located in Spain',
          fr: 'Minimum 5 véhicules par demande | Uniquement véhicules situés en Espagne',
          it: 'Minimo 5 veicoli per richiesta | Solo veicoli situati in Spagna',
          de: 'Mindestens 5 Fahrzeuge pro Anfrage | Nur Fahrzeuge in Spanien',
          nl: 'Minimaal 5 voertuigen per aanvraag | Alleen voertuigen in Spanje',
          pl: 'Minimum 5 pojazdów na wniosek | Tylko pojazdy znajdujące się w Hiszpanii',
          pt: 'Mínimo 5 veículos por solicitação | Apenas veículos localizados na Espanha',
          dk: 'Minimum 5 køretøjer pr. anmodning | Kun køretøjer placeret i Spanien'
        }
      }
    },
    viewSample: {
      es: 'Ver Ejemplo de Informe',
      en: 'View Sample Report',
      fr: 'Voir Exemple de Rapport',
      it: 'Visualizza Esempio di Rapporto',
      de: 'Beispielbericht Ansehen',
      nl: 'Voorbeeldrapport Bekijken',
      pl: 'Zobacz Przykładowy Raport',
      pt: 'Ver Relatório de Exemplo',
      dk: 'Se Eksempelrapport'
    },
    reportFeatures: {
      title: {
        es: 'Qué Incluyen Nuestros Informes',
        en: 'What Our Reports Include',
        fr: 'Ce que Nos Rapports Incluent',
        it: 'Cosa Includono i Nostri Rapporti'
      },
      identity: {
        title: {
          es: 'Verificación de Identidad',
          en: 'Identity Verification',
          fr: 'Vérification d\'Identité',
          it: 'Verifica dell\'Identità'
        },
        description: {
          es: 'Confirmación de número de chasis, motor y otros identificadores',
          en: 'Confirmation of chassis number, engine, and other identifiers',
          fr: 'Confirmation du numéro de châssis, du moteur et d\'autres identifiants',
          it: 'Conferma del numero di telaio, motore e altri identificatori'
        }
      },
      history: {
        title: {
          es: 'Historial Completo',
          en: 'Complete History',
          fr: 'Historique Complet',
          it: 'Storia Completa'
        },
        description: {
          es: 'Registro de propietarios, siniestros, reparaciones y mantenimientos',
          en: 'Record of owners, accidents, repairs, and maintenance',
          fr: 'Registre des propriétaires, des accidents, des réparations et de l\'entretien',
          it: 'Registro dei proprietari, incidenti, riparazioni e manutenzioni'
        }
      },
      legal: {
        title: {
          es: 'Verificación Legal',
          en: 'Legal Verification',
          fr: 'Vérification Légale',
          it: 'Verifica Legale'
        },
        description: {
          es: 'Comprobación de cargas, embargos y situación administrativa',
          en: 'Check for liens, seizures, and administrative status',
          fr: 'Vérification des charges, des saisies et du statut administratif',
          it: 'Controllo di gravami, sequestri e stato amministrativo'
        }
      }
    },
    cta: {
      es: 'Solicitar Informe',
      en: 'Request Report',
      fr: 'Demander un Rapport',
      it: 'Richiedi Rapporto',
      de: 'Bericht Anfordern',
      nl: 'Rapport Aanvragen',
      pl: 'Poproś o Raport',
      pt: 'Solicitar Relatório',
      dk: 'Anmod om Rapport'
    }
  };

  const lang = currentLanguage as keyof typeof translations.title;
  
  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 max-w-full">
        {/* Header con imagen de fondo */}
        <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
          <div className="absolute inset-0">
            <img 
              src="/images/vehicle-reports-hero.png"
              alt="Vehicle Reports Background"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 35%' }}
              loading="lazy"
              decoding="async"
            />
          </div>
          
          <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full">
              <div className="flex flex-col justify-end flex-1 h-full">
                <div className="mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.location.href = '/'}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Inicio
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {/* Máscara independiente para el título */}
                  <div className="inline-block">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                      <h1 className="text-3xl md:text-4xl font-bold text-white">
                        {t('reports.title', { fallback: 'Informes de Vehículos' })}
                      </h1>
                    </div>
                  </div>
                  
                  {/* Máscara independiente para el subtítulo */}
                  <div className="inline-block">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                      <p className="text-lg text-white font-medium">
                        {translations.subtitle[lang]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <ReportPackages translations={translations} lang={lang} />

          <ReportFeatures translations={translations} lang={lang} />

          <div className="bg-gray-100 p-8 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">
              {lang === 'es' ? '¿Necesita un informe urgente?' : 
               lang === 'fr' ? 'Besoin d\'un rapport urgent?' : 
               lang === 'it' ? 'Hai bisogno di un rapporto urgente?' : 
               'Need an urgent report?'}
            </h3>
            <p className="text-gray-600">
              {lang === 'es' ? 'Ofrecemos servicios express con entrega en menos de 24 horas' : 
               lang === 'fr' ? 'Nous proposons des services express avec livraison en moins de 24 heures' : 
               lang === 'it' ? 'Offriamo servizi express con consegna in meno di 24 ore' : 
               'We offer express services with delivery in less than 24 hours'}
            </p>
          </div>
          <Button size="lg" className="bg-auto-blue hover:bg-blue-700">
            {lang === 'es' ? 'Solicitar Servicio Express' : 
             lang === 'fr' ? 'Demander un Service Express' : 
             lang === 'it' ? 'Richiedi Servizio Express' : 
             'Request Express Service'}
          </Button>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleReportsInfoPage;
