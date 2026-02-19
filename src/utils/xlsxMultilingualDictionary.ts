/**
 * Multilingual keyword dictionary for XLSX validation.
 * Maps localized terms (in 9 languages) to internal DB values.
 * 
 * DB values are what gets stored; every variant maps to one canonical value.
 */

import { Language } from '@/config/languages';
import { translations } from '@/translations';

// ──────────────────────── Types ────────────────────────

export interface MultilingualOption {
  /** The value stored in the database */
  dbValue: string;
  /** Localized labels keyed by language code */
  labels: Record<string, string>;
  /** All known aliases (lowercased, accent-stripped) for fast lookup */
  aliases: string[];
}

export type FieldDictionary = MultilingualOption[];

// ──────────────────────── Normalizer ────────────────────────

const norm = (s: string): string =>
  s.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ──────────────────────── Fuel Types ────────────────────────

const FUEL_DICTIONARY: FieldDictionary = [
  {
    dbValue: 'diesel',
    labels: { es: 'Diésel', en: 'Diesel', fr: 'Diesel', de: 'Diesel', it: 'Diesel', pt: 'Diesel', nl: 'Diesel', pl: 'Diesel', dk: 'Diesel' },
    aliases: ['diesel', 'gasoil', 'gasoleo', 'dsl', 'mazot'],
  },
  {
    dbValue: 'gasoline',
    labels: { es: 'Gasolina', en: 'Gasoline', fr: 'Essence', de: 'Benzin', it: 'Benzina', pt: 'Gasolina', nl: 'Benzine', pl: 'Benzyna', dk: 'Benzin' },
    aliases: ['gasoline', 'gasolina', 'essence', 'benzin', 'benzina', 'benzine', 'benzyna', 'petrol', 'unleaded', 'super', 'sin plomo', 'sans plomb'],
  },
  {
    dbValue: 'electric',
    labels: { es: 'Eléctrico', en: 'Electric', fr: 'Électrique', de: 'Elektrisch', it: 'Elettrico', pt: 'Elétrico', nl: 'Elektrisch', pl: 'Elektryczny', dk: 'Elektrisk' },
    aliases: ['electric', 'electrico', 'electrique', 'elektrisch', 'elettrico', 'eletrico', 'elektryczny', 'elektrisk', 'ev', 'bev'],
  },
  {
    dbValue: 'hybrid',
    labels: { es: 'Híbrido', en: 'Hybrid', fr: 'Hybride', de: 'Hybrid', it: 'Ibrido', pt: 'Híbrido', nl: 'Hybride', pl: 'Hybrydowy', dk: 'Hybrid' },
    aliases: ['hybrid', 'hibrido', 'hybride', 'ibrido', 'hybrydowy', 'hev'],
  },
  {
    dbValue: 'plugin-hybrid',
    labels: { es: 'Híbrido enchufable', en: 'Plug-in Hybrid', fr: 'Hybride rechargeable', de: 'Plug-in-Hybrid', it: 'Ibrido plug-in', pt: 'Híbrido plug-in', nl: 'Plug-in hybride', pl: 'Hybryda plug-in', dk: 'Plug-in hybrid' },
    aliases: ['plugin-hybrid', 'plugin hybrid', 'plug-in hybrid', 'plug-in-hybrid', 'hibrido enchufable', 'hybride rechargeable', 'ibrido plug-in', 'phev'],
  },
  {
    dbValue: 'lpg',
    labels: { es: 'GLP', en: 'LPG', fr: 'GPL', de: 'LPG', it: 'GPL', pt: 'GLP', nl: 'LPG', pl: 'LPG', dk: 'LPG' },
    aliases: ['lpg', 'glp', 'gpl', 'autogas', 'gas licuado'],
  },
  {
    dbValue: 'cng',
    labels: { es: 'GNC', en: 'CNG', fr: 'GNV', de: 'CNG', it: 'Metano', pt: 'GNV', nl: 'CNG', pl: 'CNG', dk: 'CNG' },
    aliases: ['cng', 'gnc', 'gnv', 'metano', 'gas natural', 'natural gas', 'erdgas'],
  },
  {
    dbValue: 'hydrogen',
    labels: { es: 'Hidrógeno', en: 'Hydrogen', fr: 'Hydrogène', de: 'Wasserstoff', it: 'Idrogeno', pt: 'Hidrogênio', nl: 'Waterstof', pl: 'Wodór', dk: 'Brint' },
    aliases: ['hydrogen', 'hidrogeno', 'hydrogene', 'wasserstoff', 'idrogeno', 'hidrogenio', 'waterstof', 'wodor', 'brint', 'h2', 'fcev'],
  },
];

// ──────────────────────── Transmission ────────────────────────

const TRANSMISSION_DICTIONARY: FieldDictionary = [
  {
    dbValue: 'manual',
    labels: { es: 'Manual', en: 'Manual', fr: 'Manuelle', de: 'Schaltgetriebe', it: 'Manuale', pt: 'Manual', nl: 'Handgeschakeld', pl: 'Manualna', dk: 'Manuel' },
    aliases: ['manual', 'manuelle', 'schaltgetriebe', 'manuale', 'handgeschakeld', 'manualna', 'manuel', 'handschaltung', 'stick'],
  },
  {
    dbValue: 'automatic',
    labels: { es: 'Automático', en: 'Automatic', fr: 'Automatique', de: 'Automatik', it: 'Automatico', pt: 'Automático', nl: 'Automaat', pl: 'Automatyczna', dk: 'Automatisk' },
    aliases: ['automatic', 'automatico', 'automatique', 'automatik', 'automaat', 'automatyczna', 'automatisk', 'auto', 'at', 'tiptronic', 'dsg', 'dct', 'cvt', 'pdk'],
  },
  {
    dbValue: 'semi-automatic',
    labels: { es: 'Semi-automático', en: 'Semi-automatic', fr: 'Semi-automatique', de: 'Halbautomatik', it: 'Semi-automatico', pt: 'Semi-automático', nl: 'Semi-automaat', pl: 'Półautomatyczna', dk: 'Semi-automatisk' },
    aliases: ['semi-automatic', 'semi-automatico', 'semi-automatique', 'halbautomatik', 'semi-automaat', 'polautomatyczna', 'semi-automatisk', 'semiautomatico', 'semiautomatique', 'sequenziale', 'robotisee'],
  },
];

// ──────────────────────── IVA Status ────────────────────────

const IVA_DICTIONARY: FieldDictionary = [
  {
    dbValue: 'included',
    labels: { es: 'Incluido', en: 'Included', fr: 'Inclus', de: 'Inklusive', it: 'Incluso', pt: 'Incluído', nl: 'Inclusief', pl: 'W cenie', dk: 'Inkluderet' },
    aliases: ['included', 'incluido', 'inclus', 'inklusive', 'incluso', 'incluido', 'inclusief', 'w cenie', 'inkluderet', 'iva incluido', 'tva incluse', 'mwst inklusive', 'btw inclusief', 'incl'],
  },
  {
    dbValue: 'notIncluded',
    labels: { es: 'No incluido', en: 'Not included', fr: 'Non inclus', de: 'Exklusive', it: 'Non incluso', pt: 'Não incluído', nl: 'Exclusief', pl: 'Bez VAT', dk: 'Ikke inkluderet' },
    aliases: ['notincluded', 'not included', 'no incluido', 'non inclus', 'exklusive', 'non incluso', 'nao incluido', 'exclusief', 'bez vat', 'ikke inkluderet', 'excl', 'netto', 'net', 'ht'],
  },
  {
    dbValue: 'deductible',
    labels: { es: 'Deducible', en: 'Deductible', fr: 'Déductible', de: 'Abzugsfähig', it: 'Deducibile', pt: 'Dedutível', nl: 'Aftrekbaar', pl: 'Odliczalny', dk: 'Fradragsberettiget' },
    aliases: ['deductible', 'deducible', 'deductible', 'abzugsfahig', 'deducibile', 'dedutivel', 'aftrekbaar', 'odliczalny', 'fradragsberettiget', 'iva deducible', 'tva deductible'],
  },
  {
    dbValue: 'rebu',
    labels: { es: 'REBU', en: 'Margin Scheme', fr: 'Régime de marge', de: 'Differenzbesteuerung', it: 'Regime del margine', pt: 'Regime de margem', nl: 'Margeregeling', pl: 'Marża VAT', dk: 'Marginordning' },
    aliases: ['rebu', 'margin scheme', 'margin', 'regime de marge', 'marge', 'differenzbesteuerung', 'regime del margine', 'margine', 'regime de margem', 'margeregeling', 'marza vat', 'marginordning'],
  },
];

// ──────────────────────── Euro Standards ────────────────────────

const EURO_STANDARD_DICTIONARY: FieldDictionary = [
  { dbValue: 'euro1', labels: { es: 'Euro 1', en: 'Euro 1', fr: 'Euro 1', de: 'Euro 1', it: 'Euro 1', pt: 'Euro 1', nl: 'Euro 1', pl: 'Euro 1', dk: 'Euro 1' }, aliases: ['euro1', 'euro 1', 'e1'] },
  { dbValue: 'euro2', labels: { es: 'Euro 2', en: 'Euro 2', fr: 'Euro 2', de: 'Euro 2', it: 'Euro 2', pt: 'Euro 2', nl: 'Euro 2', pl: 'Euro 2', dk: 'Euro 2' }, aliases: ['euro2', 'euro 2', 'e2'] },
  { dbValue: 'euro3', labels: { es: 'Euro 3', en: 'Euro 3', fr: 'Euro 3', de: 'Euro 3', it: 'Euro 3', pt: 'Euro 3', nl: 'Euro 3', pl: 'Euro 3', dk: 'Euro 3' }, aliases: ['euro3', 'euro 3', 'e3'] },
  { dbValue: 'euro4', labels: { es: 'Euro 4', en: 'Euro 4', fr: 'Euro 4', de: 'Euro 4', it: 'Euro 4', pt: 'Euro 4', nl: 'Euro 4', pl: 'Euro 4', dk: 'Euro 4' }, aliases: ['euro4', 'euro 4', 'e4'] },
  { dbValue: 'euro5', labels: { es: 'Euro 5', en: 'Euro 5', fr: 'Euro 5', de: 'Euro 5', it: 'Euro 5', pt: 'Euro 5', nl: 'Euro 5', pl: 'Euro 5', dk: 'Euro 5' }, aliases: ['euro5', 'euro 5', 'e5'] },
  { dbValue: 'euro6', labels: { es: 'Euro 6', en: 'Euro 6', fr: 'Euro 6', de: 'Euro 6', it: 'Euro 6', pt: 'Euro 6', nl: 'Euro 6', pl: 'Euro 6', dk: 'Euro 6' }, aliases: ['euro6', 'euro 6', 'e6'] },
  { dbValue: 'euro6d', labels: { es: 'Euro 6d', en: 'Euro 6d', fr: 'Euro 6d', de: 'Euro 6d', it: 'Euro 6d', pt: 'Euro 6d', nl: 'Euro 6d', pl: 'Euro 6d', dk: 'Euro 6d' }, aliases: ['euro6d', 'euro 6d', 'e6d', 'euro 6d-temp'] },
  { dbValue: 'euro7', labels: { es: 'Euro 7', en: 'Euro 7', fr: 'Euro 7', de: 'Euro 7', it: 'Euro 7', pt: 'Euro 7', nl: 'Euro 7', pl: 'Euro 7', dk: 'Euro 7' }, aliases: ['euro7', 'euro 7', 'e7'] },
];

// ──────────────────────── Vehicle Types ────────────────────────

const VEHICLE_TYPE_DICTIONARY: FieldDictionary = [
  {
    dbValue: 'sedan',
    labels: { es: 'Sedán', en: 'Sedan', fr: 'Berline', de: 'Limousine', it: 'Berlina', pt: 'Sedã', nl: 'Sedan', pl: 'Sedan', dk: 'Sedan' },
    aliases: ['sedan', 'berline', 'limousine', 'berlina', 'seda', 'saloon'],
  },
  {
    dbValue: 'suv',
    labels: { es: 'SUV', en: 'SUV', fr: 'SUV', de: 'SUV', it: 'SUV', pt: 'SUV', nl: 'SUV', pl: 'SUV', dk: 'SUV' },
    aliases: ['suv', 'todo terreno', 'todoterreno', 'tout-terrain', 'gelaendewagen', 'fuoristrada'],
  },
  {
    dbValue: 'hatchback',
    labels: { es: 'Hatchback', en: 'Hatchback', fr: 'Hatchback', de: 'Schrägheck', it: 'Hatchback', pt: 'Hatchback', nl: 'Hatchback', pl: 'Hatchback', dk: 'Hatchback' },
    aliases: ['hatchback', 'compacto', 'compact', 'schragheck', 'utilitaria'],
  },
  {
    dbValue: 'wagon',
    labels: { es: 'Familiar', en: 'Wagon', fr: 'Break', de: 'Kombi', it: 'Station Wagon', pt: 'Perua', nl: 'Stationwagen', pl: 'Kombi', dk: 'Stationcar' },
    aliases: ['wagon', 'familiar', 'break', 'kombi', 'station wagon', 'stationwagen', 'stationcar', 'perua', 'estate', 'touring', 'avant', 'variant'],
  },
  {
    dbValue: 'coupe',
    labels: { es: 'Coupé', en: 'Coupe', fr: 'Coupé', de: 'Coupé', it: 'Coupé', pt: 'Coupé', nl: 'Coupé', pl: 'Coupé', dk: 'Coupé' },
    aliases: ['coupe', 'cupe', 'sport'],
  },
  {
    dbValue: 'convertible',
    labels: { es: 'Descapotable', en: 'Convertible', fr: 'Cabriolet', de: 'Cabrio', it: 'Cabrio', pt: 'Conversível', nl: 'Cabrio', pl: 'Kabriolet', dk: 'Cabriolet' },
    aliases: ['convertible', 'descapotable', 'cabriolet', 'cabrio', 'kabriolet', 'conversivel', 'spider', 'spyder', 'roadster'],
  },
  {
    dbValue: 'van',
    labels: { es: 'Furgoneta', en: 'Van', fr: 'Fourgon', de: 'Transporter', it: 'Furgone', pt: 'Van', nl: 'Bestelwagen', pl: 'Van', dk: 'Varevogn' },
    aliases: ['van', 'furgoneta', 'fourgon', 'transporter', 'furgone', 'bestelwagen', 'varevogn', 'minivan', 'monovolumen', 'monospace', 'mpv'],
  },
  {
    dbValue: 'pickup',
    labels: { es: 'Pick-up', en: 'Pickup', fr: 'Pick-up', de: 'Pick-up', it: 'Pick-up', pt: 'Pickup', nl: 'Pick-up', pl: 'Pickup', dk: 'Pickup' },
    aliases: ['pickup', 'pick-up', 'pick up'],
  },
];

// ──────────────────────── Header → Language Detection ────────────────────────

/** Header keywords per language for detecting the Excel's language */
const HEADER_LANGUAGE_MAP: Record<string, Language> = {
  // Spanish
  'marca': 'es', 'modelo': 'es', 'precio': 'es', 'kilometraje': 'es', 'combustible': 'es', 'transmision': 'es', 'ubicacion': 'es', 'ano': 'es',
  // English
  'brand': 'en', 'model': 'en', 'price': 'en', 'mileage': 'en', 'fuel': 'en', 'transmission': 'en', 'location': 'en', 'year': 'en',
  // French
  'marque': 'fr', 'modele': 'fr', 'prix': 'fr', 'kilometrage': 'fr', 'carburant': 'fr', 'boite': 'fr', 'emplacement': 'fr', 'annee': 'fr',
  // German
  'marke': 'de', 'modell': 'de', 'preis': 'de', 'kilometerstand': 'de', 'kraftstoff': 'de', 'getriebe': 'de', 'standort': 'de', 'jahr': 'de',
  // Italian
  'prezzo': 'it', 'chilometraggio': 'it', 'carburante': 'it', 'cambio': 'it', 'posizione': 'it', 'anno': 'it',
  // Portuguese
  'preco': 'pt', 'quilometragem': 'pt', 'combustivel': 'pt', 'transmissao': 'pt', 'localizacao': 'pt',
  // Dutch
  'merk': 'nl', 'prijs': 'nl', 'brandstof': 'nl', 'transmissie': 'nl', 'locatie': 'nl', 'jaar': 'nl',
  // Polish
  'marka': 'pl', 'cena': 'pl', 'przebieg': 'pl', 'paliwo': 'pl', 'skrzynia': 'pl', 'lokalizacja': 'pl', 'rok': 'pl',
  // Danish
  'maerke': 'dk', 'pris': 'dk', 'kilometertal': 'dk', 'braendstof': 'dk', 'gearkasse': 'dk', 'beliggenhed': 'dk', 'aar': 'dk',
};

// ──────────────────────── Public API ────────────────────────

/** All dictionaries indexed by field name */
const FIELD_DICTIONARIES: Record<string, FieldDictionary> = {
  fuel: FUEL_DICTIONARY,
  transmission: TRANSMISSION_DICTIONARY,
  ivaStatus: IVA_DICTIONARY,
  euroStandard: EURO_STANDARD_DICTIONARY,
  vehicleType: VEHICLE_TYPE_DICTIONARY,
};

/**
 * Look up a user-provided value in the multilingual dictionary for a given field.
 * Returns the canonical DB value, or null if no match found.
 */
export const resolveMultilingualValue = (field: string, rawValue: string): string | null => {
  const dictionary = FIELD_DICTIONARIES[field];
  if (!dictionary) return null;

  const normalized = norm(rawValue);
  if (!normalized) return null;

  // 1. Exact alias match
  for (const option of dictionary) {
    if (option.aliases.some(a => norm(a) === normalized)) {
      return option.dbValue;
    }
  }

  // 2. Label match (any language)
  for (const option of dictionary) {
    for (const label of Object.values(option.labels)) {
      if (norm(label) === normalized) {
        return option.dbValue;
      }
    }
  }

  // 3. Partial / contains match
  for (const option of dictionary) {
    const allTerms = [...option.aliases, ...Object.values(option.labels)];
    for (const term of allTerms) {
      const nt = norm(term);
      if (nt.includes(normalized) || normalized.includes(nt)) {
        return option.dbValue;
      }
    }
  }

  return null;
};

/**
 * Get localized display options for a field in a specific language.
 * Returns array of { value: dbValue, label: localizedLabel }.
 */
export const getLocalizedFieldOptions = (field: string, language: Language): Array<{ value: string; label: string }> => {
  const dictionary = FIELD_DICTIONARIES[field];
  if (!dictionary) return [];

  return dictionary.map(option => ({
    value: option.dbValue,
    label: option.labels[language] || option.labels['en'] || option.dbValue,
  }));
};

/**
 * Get the localized label for a DB value in a specific language.
 */
export const getLocalizedLabel = (field: string, dbValue: string, language: Language): string => {
  const dictionary = FIELD_DICTIONARIES[field];
  if (!dictionary) return dbValue;

  const option = dictionary.find(o => o.dbValue === dbValue);
  if (!option) return dbValue;

  return option.labels[language] || option.labels['en'] || dbValue;
};

/**
 * Get all DB values for a field (for backward-compatible validation).
 */
export const getDbValues = (field: string): string[] => {
  const dictionary = FIELD_DICTIONARIES[field];
  if (!dictionary) return [];
  return dictionary.map(o => o.dbValue);
};

/**
 * Detect the language of an Excel file based on its header row.
 * Returns the most likely language, defaulting to 'es'.
 */
export const detectExcelLanguage = (headers: string[]): Language => {
  const votes: Record<string, number> = {};

  for (const header of headers) {
    const normalized = norm(header);
    // Check each word in the header
    const words = normalized.split(/[_\s-]+/);
    for (const word of words) {
      const lang = HEADER_LANGUAGE_MAP[word];
      if (lang) {
        votes[lang] = (votes[lang] || 0) + 1;
      }
    }
  }

  // Return language with most votes
  let bestLang: Language = 'es';
  let bestCount = 0;
  for (const [lang, count] of Object.entries(votes)) {
    if (count > bestCount) {
      bestCount = count;
      bestLang = lang as Language;
    }
  }

  return bestLang;
};

/**
 * Check if a field has a multilingual dictionary available.
 */
export const hasMultilingualDictionary = (field: string): boolean => {
  return field in FIELD_DICTIONARIES;
};
