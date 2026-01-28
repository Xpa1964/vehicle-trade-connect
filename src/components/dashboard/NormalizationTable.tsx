import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const NormalizationTable: React.FC = () => {
  const { t } = useLanguage();

  const fuelTypes = [
    {
      normalized: 'gasolina',
      es: ['gasolina', 'nafta', 'petrol'],
      en: ['petrol', 'gasoline'],
      fr: ['essence'],
      it: ['benzina'],
      de: ['benzin'],
      nl: ['benzine'],
      pt: ['gasolina'],
      pl: ['benzyna'],
      dk: ['benzin']
    },
    {
      normalized: 'diesel',
      es: ['diesel', 'gasoil'],
      en: ['diesel'],
      fr: ['diesel', 'gasoil'],
      it: ['diesel', 'gasolio'],
      de: ['diesel'],
      nl: ['diesel'],
      pt: ['diesel'],
      pl: ['diesel'],
      dk: ['diesel']
    },
    {
      normalized: 'electrico',
      es: ['eléctrico', 'electrico'],
      en: ['electric'],
      fr: ['électrique'],
      it: ['elettrico'],
      de: ['elektrisch'],
      nl: ['elektrisch'],
      pt: ['elétrico'],
      pl: ['elektryczny'],
      dk: ['elektrisk']
    },
    {
      normalized: 'hibrido',
      es: ['híbrido', 'hibrido'],
      en: ['hybrid'],
      fr: ['hybride'],
      it: ['ibrido'],
      de: ['hybrid'],
      nl: ['hybride'],
      pt: ['híbrido'],
      pl: ['hybrydowy'],
      dk: ['hybrid']
    }
  ];

  const transmissions = [
    {
      normalized: 'manual',
      es: ['manual'],
      en: ['manual'],
      fr: ['manuelle'],
      it: ['manuale'],
      de: ['manuell'],
      nl: ['handgeschakeld'],
      pt: ['manual'],
      pl: ['manualna'],
      dk: ['manuel']
    },
    {
      normalized: 'automatico',
      es: ['automático', 'automatico'],
      en: ['automatic'],
      fr: ['automatique'],
      it: ['automatico'],
      de: ['automatik'],
      nl: ['automaat'],
      pt: ['automático'],
      pl: ['automatyczna'],
      dk: ['automatisk']
    }
  ];

  const bodyTypes = [
    {
      normalized: 'sedan',
      es: ['sedán', 'sedan', 'berlina'],
      en: ['sedan', 'saloon'],
      fr: ['berline'],
      it: ['berlina'],
      de: ['limousine'],
      nl: ['sedan'],
      pt: ['sedan'],
      pl: ['sedan'],
      dk: ['sedan']
    },
    {
      normalized: 'suv',
      es: ['suv', 'todoterreno'],
      en: ['suv', 'crossover'],
      fr: ['suv'],
      it: ['suv'],
      de: ['suv'],
      nl: ['suv'],
      pt: ['suv'],
      pl: ['suv'],
      dk: ['suv']
    },
    {
      normalized: 'coupe',
      es: ['coupé', 'coupe'],
      en: ['coupe'],
      fr: ['coupé'],
      it: ['coupé'],
      de: ['coupé'],
      nl: ['coupé'],
      pt: ['cupê'],
      pl: ['coupe'],
      dk: ['coupé']
    },
    {
      normalized: 'familiar',
      es: ['familiar', 'station wagon'],
      en: ['estate', 'station wagon'],
      fr: ['break'],
      it: ['station wagon'],
      de: ['kombi'],
      nl: ['stationwagen'],
      pt: ['perua'],
      pl: ['kombi'],
      dk: ['stationcar']
    }
  ];

  const statuses = [
    {
      normalized: 'disponible',
      es: ['disponible', 'available'],
      en: ['available'],
      fr: ['disponible'],
      it: ['disponibile'],
      de: ['verfügbar'],
      nl: ['beschikbaar'],
      pt: ['disponível'],
      pl: ['dostępny'],
      dk: ['tilgængelig']
    },
    {
      normalized: 'reservado',
      es: ['reservado', 'reserved'],
      en: ['reserved'],
      fr: ['réservé'],
      it: ['riservato'],
      de: ['reserviert'],
      nl: ['gereserveerd'],
      pt: ['reservado'],
      pl: ['zarezerwowany'],
      dk: ['reserveret']
    },
    {
      normalized: 'vendido',
      es: ['vendido', 'sold'],
      en: ['sold'],
      fr: ['vendu'],
      it: ['venduto'],
      de: ['verkauft'],
      nl: ['verkocht'],
      pt: ['vendido'],
      pl: ['sprzedany'],
      dk: ['solgt']
    },
    {
      normalized: 'subasta',
      es: ['en subasta', 'subasta', 'in_auction'],
      en: ['in auction', 'auction'],
      fr: ['aux enchères'],
      it: ['in asta'],
      de: ['in auktion'],
      nl: ['in veiling'],
      pt: ['em leilão'],
      pl: ['na aukcji'],
      dk: ['på auktion']
    }
  ];

  const ivaStatuses = [
    {
      normalized: 'incluido',
      es: ['incluido', 'included', 'iva incluido'],
      en: ['included', 'vat included'],
      fr: ['inclus', 'tva incluse'],
      it: ['incluso', 'iva inclusa'],
      de: ['inklusive', 'mwst inklusive'],
      nl: ['inclusief', 'btw inclusief'],
      pt: ['incluído', 'iva incluído'],
      pl: ['włączony', 'vat włączony'],
      dk: ['inkluderet', 'moms inkluderet']
    },
    {
      normalized: 'no_incluido',
      es: ['no incluido', 'notIncluded', 'sin iva'],
      en: ['not included', 'vat not included'],
      fr: ['non inclus', 'hors tva'],
      it: ['non incluso', 'iva esclusa'],
      de: ['nicht inklusive', 'ohne mwst'],
      nl: ['niet inclusief', 'btw exclusief'],
      pt: ['não incluído', 'sem iva'],
      pl: ['nie włączony', 'bez vat'],
      dk: ['ikke inkluderet', 'uden moms']
    },
    {
      normalized: 'deducible',
      es: ['deducible', 'iva deducible'],
      en: ['deductible', 'vat deductible'],
      fr: ['déductible', 'tva déductible'],
      it: ['deducibile', 'iva deducibile'],
      de: ['abzugsfähig', 'mwst abzugsfähig'],
      nl: ['aftrekbaar', 'btw aftrekbaar'],
      pt: ['dedutível', 'iva dedutível'],
      pl: ['odliczalny', 'vat odliczalny'],
      dk: ['fradragsberettiget', 'moms fradrag']
    }
  ];

  const transactionTypes = [
    {
      normalized: 'nacional',
      es: ['nacional', 'national'],
      en: ['national', 'domestic'],
      fr: ['national'],
      it: ['nazionale'],
      de: ['national', 'inländisch'],
      nl: ['nationaal', 'binnenlands'],
      pt: ['nacional'],
      pl: ['krajowy'],
      dk: ['national', 'indenlandsk']
    },
    {
      normalized: 'importacion',
      es: ['importación', 'import'],
      en: ['import'],
      fr: ['importation'],
      it: ['importazione'],
      de: ['import', 'einfuhr'],
      nl: ['import', 'invoer'],
      pt: ['importação'],
      pl: ['import'],
      dk: ['import', 'indførsel']
    },
    {
      normalized: 'exportacion',
      es: ['exportación', 'export'],
      en: ['export'],
      fr: ['exportation'],
      it: ['esportazione'],
      de: ['export', 'ausfuhr'],
      nl: ['export', 'uitvoer'],
      pt: ['exportação'],
      pl: ['eksport'],
      dk: ['eksport', 'udførsel']
    }
  ];

  const euroStandards = [
    {
      normalized: 'euro1',
      es: ['euro1', 'euro 1'],
      en: ['euro1', 'euro 1'],
      fr: ['euro1', 'euro 1'],
      it: ['euro1', 'euro 1'],
      de: ['euro1', 'euro 1'],
      nl: ['euro1', 'euro 1'],
      pt: ['euro1', 'euro 1'],
      pl: ['euro1', 'euro 1'],
      dk: ['euro1', 'euro 1']
    },
    {
      normalized: 'euro2',
      es: ['euro2', 'euro 2'],
      en: ['euro2', 'euro 2'],
      fr: ['euro2', 'euro 2'],
      it: ['euro2', 'euro 2'],
      de: ['euro2', 'euro 2'],
      nl: ['euro2', 'euro 2'],
      pt: ['euro2', 'euro 2'],
      pl: ['euro2', 'euro 2'],
      dk: ['euro2', 'euro 2']
    },
    {
      normalized: 'euro3',
      es: ['euro3', 'euro 3'],
      en: ['euro3', 'euro 3'],
      fr: ['euro3', 'euro 3'],
      it: ['euro3', 'euro 3'],
      de: ['euro3', 'euro 3'],
      nl: ['euro3', 'euro 3'],
      pt: ['euro3', 'euro 3'],
      pl: ['euro3', 'euro 3'],
      dk: ['euro3', 'euro 3']
    },
    {
      normalized: 'euro4',
      es: ['euro4', 'euro 4'],
      en: ['euro4', 'euro 4'],
      fr: ['euro4', 'euro 4'],
      it: ['euro4', 'euro 4'],
      de: ['euro4', 'euro 4'],
      nl: ['euro4', 'euro 4'],
      pt: ['euro4', 'euro 4'],
      pl: ['euro4', 'euro 4'],
      dk: ['euro4', 'euro 4']
    },
    {
      normalized: 'euro5',
      es: ['euro5', 'euro 5'],
      en: ['euro5', 'euro 5'],
      fr: ['euro5', 'euro 5'],
      it: ['euro5', 'euro 5'],
      de: ['euro5', 'euro 5'],
      nl: ['euro5', 'euro 5'],
      pt: ['euro5', 'euro 5'],
      pl: ['euro5', 'euro 5'],
      dk: ['euro5', 'euro 5']
    },
    {
      normalized: 'euro6',
      es: ['euro6', 'euro 6'],
      en: ['euro6', 'euro 6'],
      fr: ['euro6', 'euro 6'],
      it: ['euro6', 'euro 6'],
      de: ['euro6', 'euro 6'],
      nl: ['euro6', 'euro 6'],
      pt: ['euro6', 'euro 6'],
      pl: ['euro6', 'euro 6'],
      dk: ['euro6', 'euro 6']
    },
    {
      normalized: 'euro6d',
      es: ['euro6d', 'euro 6d'],
      en: ['euro6d', 'euro 6d'],
      fr: ['euro6d', 'euro 6d'],
      it: ['euro6d', 'euro 6d'],
      de: ['euro6d', 'euro 6d'],
      nl: ['euro6d', 'euro 6d'],
      pt: ['euro6d', 'euro 6d'],
      pl: ['euro6d', 'euro 6d'],
      dk: ['euro6d', 'euro 6d']
    },
    {
      normalized: 'euro7',
      es: ['euro7', 'euro 7'],
      en: ['euro7', 'euro 7'],
      fr: ['euro7', 'euro 7'],
      it: ['euro7', 'euro 7'],
      de: ['euro7', 'euro 7'],
      nl: ['euro7', 'euro 7'],
      pt: ['euro7', 'euro 7'],
      pl: ['euro7', 'euro 7'],
      dk: ['euro7', 'euro 7']
    }
  ];

  const colors = [
    {
      normalized: 'blanco',
      es: ['blanco', 'white'],
      en: ['white'],
      fr: ['blanc'],
      it: ['bianco'],
      de: ['weiß'],
      nl: ['wit'],
      pt: ['branco'],
      pl: ['biały'],
      dk: ['hvid']
    },
    {
      normalized: 'negro',
      es: ['negro', 'black'],
      en: ['black'],
      fr: ['noir'],
      it: ['nero'],
      de: ['schwarz'],
      nl: ['zwart'],
      pt: ['preto'],
      pl: ['czarny'],
      dk: ['sort']
    },
    {
      normalized: 'gris',
      es: ['gris', 'grey', 'gray'],
      en: ['grey', 'gray'],
      fr: ['gris'],
      it: ['grigio'],
      de: ['grau'],
      nl: ['grijs'],
      pt: ['cinza'],
      pl: ['szary'],
      dk: ['grå']
    },
    {
      normalized: 'plata',
      es: ['plata', 'plateado', 'silver'],
      en: ['silver'],
      fr: ['argent'],
      it: ['argento'],
      de: ['silber'],
      nl: ['zilver'],
      pt: ['prata'],
      pl: ['srebrny'],
      dk: ['sølv']
    },
    {
      normalized: 'azul',
      es: ['azul', 'blue'],
      en: ['blue'],
      fr: ['bleu'],
      it: ['blu'],
      de: ['blau'],
      nl: ['blauw'],
      pt: ['azul'],
      pl: ['niebieski'],
      dk: ['blå']
    },
    {
      normalized: 'rojo',
      es: ['rojo', 'red'],
      en: ['red'],
      fr: ['rouge'],
      it: ['rosso'],
      de: ['rot'],
      nl: ['rood'],
      pt: ['vermelho'],
      pl: ['czerwony'],
      dk: ['rød']
    },
    {
      normalized: 'verde',
      es: ['verde', 'green'],
      en: ['green'],
      fr: ['vert'],
      it: ['verde'],
      de: ['grün'],
      nl: ['groen'],
      pt: ['verde'],
      pl: ['zielony'],
      dk: ['grøn']
    },
    {
      normalized: 'amarillo',
      es: ['amarillo', 'yellow'],
      en: ['yellow'],
      fr: ['jaune'],
      it: ['giallo'],
      de: ['gelb'],
      nl: ['geel'],
      pt: ['amarelo'],
      pl: ['żółty'],
      dk: ['gul']
    },
    {
      normalized: 'naranja',
      es: ['naranja', 'orange'],
      en: ['orange'],
      fr: ['orange'],
      it: ['arancione'],
      de: ['orange'],
      nl: ['oranje'],
      pt: ['laranja'],
      pl: ['pomarańczowy'],
      dk: ['orange']
    },
    {
      normalized: 'marron',
      es: ['marrón', 'marron', 'brown'],
      en: ['brown'],
      fr: ['marron'],
      it: ['marrone'],
      de: ['braun'],
      nl: ['bruin'],
      pt: ['marrom'],
      pl: ['brązowy'],
      dk: ['brun']
    },
    {
      normalized: 'beige',
      es: ['beige'],
      en: ['beige'],
      fr: ['beige'],
      it: ['beige'],
      de: ['beige'],
      nl: ['beige'],
      pt: ['bege'],
      pl: ['beżowy'],
      dk: ['beige']
    }
  ];

  const conditions = [
    {
      normalized: 'nuevo',
      es: ['nuevo', 'new', '0km'],
      en: ['new', 'brand new'],
      fr: ['neuf', 'nouveau'],
      it: ['nuovo'],
      de: ['neu'],
      nl: ['nieuw'],
      pt: ['novo'],
      pl: ['nowy'],
      dk: ['ny']
    },
    {
      normalized: 'usado',
      es: ['usado', 'used', 'segunda mano'],
      en: ['used', 'second hand'],
      fr: ['occasion', 'usagé'],
      it: ['usato'],
      de: ['gebraucht'],
      nl: ['gebruikt', 'tweedehands'],
      pt: ['usado'],
      pl: ['używany'],
      dk: ['brugt']
    },
    {
      normalized: 'seminuevo',
      es: ['seminuevo', 'semi-nuevo', 'pre-owned'],
      en: ['pre-owned', 'nearly new'],
      fr: ['semi-neuf'],
      it: ['semi-nuovo'],
      de: ['jahreswagen'],
      nl: ['zo goed als nieuw'],
      pt: ['semi-novo'],
      pl: ['prawie nowy'],
      dk: ['næsten ny']
    },
    {
      normalized: 'certificado',
      es: ['certificado', 'certified'],
      en: ['certified', 'approved'],
      fr: ['certifié'],
      it: ['certificato'],
      de: ['zertifiziert'],
      nl: ['gecertificeerd'],
      pt: ['certificado'],
      pl: ['certyfikowany'],
      dk: ['certificeret']
    }
  ];

  const vehicleTypes = [
    {
      normalized: 'turismo',
      es: ['turismo', 'coche', 'automóvil'],
      en: ['car', 'passenger car'],
      fr: ['voiture', 'automobile'],
      it: ['automobile', 'auto'],
      de: ['pkw', 'personenwagen'],
      nl: ['personenauto'],
      pt: ['automóvel', 'carro'],
      pl: ['samochód osobowy'],
      dk: ['personbil']
    },
    {
      normalized: 'furgoneta',
      es: ['furgoneta', 'van'],
      en: ['van'],
      fr: ['fourgon'],
      it: ['furgone'],
      de: ['transporter'],
      nl: ['bestelwagen'],
      pt: ['carrinha'],
      pl: ['furgonetka'],
      dk: ['varevogn']
    },
    {
      normalized: 'camion',
      es: ['camión', 'truck'],
      en: ['truck', 'lorry'],
      fr: ['camion'],
      it: ['camion'],
      de: ['lkw'],
      nl: ['vrachtwagen'],
      pt: ['caminhão'],
      pl: ['ciężarówka'],
      dk: ['lastbil']
    },
    {
      normalized: 'motocicleta',
      es: ['motocicleta', 'moto'],
      en: ['motorcycle', 'motorbike'],
      fr: ['moto', 'motocyclette'],
      it: ['moto', 'motocicletta'],
      de: ['motorrad'],
      nl: ['motorfiets'],
      pt: ['motocicleta', 'moto'],
      pl: ['motocykl'],
      dk: ['motorcykel']
    }
  ];

  const renderSection = (title: string, data: any[]) => (
    <div className="space-y-3">
      <h4 className="font-semibold text-foreground">{title}</h4>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">{t('api.docs.normalization.normalized')}</TableHead>
              <TableHead>ES</TableHead>
              <TableHead>EN</TableHead>
              <TableHead>FR</TableHead>
              <TableHead>IT</TableHead>
              <TableHead>DE</TableHead>
              <TableHead>NL</TableHead>
              <TableHead>PT</TableHead>
              <TableHead>PL</TableHead>
              <TableHead>DK</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  <Badge variant="secondary">{item.normalized}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.es.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.es.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.en.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.en.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.fr.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.fr.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.it.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.it.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.de.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.de.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.nl.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.nl.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.pt.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.pt.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.pl.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.pl.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.dk.map((val: string, i: number) => (
                      <span key={i} className="text-sm text-muted-foreground">
                        {val}{i < item.dk.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Nota explicativa */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-muted-foreground">
          <strong>{t('api.docs.normalization.note')}</strong>
        </p>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {t('api.docs.normalization.description')}
      </p>
      
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="required-fields">
          <AccordionTrigger className="text-base font-semibold">
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Obligatorio</Badge>
              <span>{t('api.docs.normalization.requiredFields')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {renderSection(t('api.docs.normalization.fuelTypes'), fuelTypes)}
            {renderSection(t('api.docs.normalization.transmissions'), transmissions)}
            {renderSection(t('api.docs.normalization.bodyTypes'), bodyTypes)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="optional-fields">
          <AccordionTrigger className="text-base font-semibold">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Opcional</Badge>
              <span>{t('api.docs.normalization.optionalFields')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {renderSection(t('api.docs.normalization.statuses'), statuses)}
            {renderSection(t('api.docs.normalization.ivaStatuses'), ivaStatuses)}
            {renderSection(t('api.docs.normalization.transactionTypes'), transactionTypes)}
            {renderSection(t('api.docs.normalization.euroStandards'), euroStandards)}
            {renderSection(t('api.docs.normalization.colors'), colors)}
            {renderSection(t('api.docs.normalization.conditions'), conditions)}
            {renderSection(t('api.docs.normalization.vehicleTypes'), vehicleTypes)}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default NormalizationTable;
