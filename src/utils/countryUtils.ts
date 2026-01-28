
export interface Country {
  code: string;
  name: string;
}

export const countries: Country[] = [
  { code: 'es', name: 'España' },
  { code: 'fr', name: 'Francia' },
  { code: 'it', name: 'Italia' },
  { code: 'de', name: 'Alemania' },
  { code: 'pt', name: 'Portugal' },
  { code: 'gb', name: 'Reino Unido' },
  { code: 'nl', name: 'Países Bajos' },
  { code: 'be', name: 'Bélgica' },
  { code: 'ch', name: 'Suiza' },
  { code: 'at', name: 'Austria' },
  { code: 'pl', name: 'Polonia' },
  { code: 'se', name: 'Suecia' },
  { code: 'no', name: 'Noruega' },
  { code: 'dk', name: 'Dinamarca' },
  { code: 'fi', name: 'Finlandia' },
  { code: 'gr', name: 'Grecia' },
  { code: 'ro', name: 'Rumanía' },
  { code: 'bg', name: 'Bulgaria' },
  { code: 'hu', name: 'Hungría' },
  { code: 'cz', name: 'República Checa' },
  { code: 'sk', name: 'Eslovaquia' },
  { code: 'hr', name: 'Croacia' },
  { code: 'si', name: 'Eslovenia' },
  { code: 'ie', name: 'Irlanda' },
  { code: 'us', name: 'Estados Unidos' }
];

export const getCountryCodeByName = (countryName: string): string => {
  if (!countryName) return 'es';

  // Normalizar el nombre del país
  const normalizedName = countryName.trim().toLowerCase();

  // Mapeo consolidado sin duplicados - cada clave es única
  const countryMapping: Record<string, string> = {
    // Español
    'españa': 'es',
    'francia': 'fr',
    'italia': 'it',
    'alemania': 'de',
    'portugal': 'pt',
    'reino unido': 'gb',
    'países bajos': 'nl',
    'bélgica': 'be',
    'suiza': 'ch',
    'austria': 'at',
    'polonia': 'pl',
    'suecia': 'se',
    'noruega': 'no',
    'dinamarca': 'dk',
    'finlandia': 'fi',
    'grecia': 'gr',
    'rumanía': 'ro',
    'bulgaria': 'bg',
    'hungría': 'hu',
    'república checa': 'cz',
    'eslovaquia': 'sk',
    'croacia': 'hr',
    'eslovenia': 'si',
    'irlanda': 'ie',
    'estados unidos': 'us',
    
    // Inglés
    'spain': 'es',
    'france': 'fr',
    'italy': 'it',
    'germany': 'de',
    'united kingdom': 'gb',
    'netherlands': 'nl',
    'belgium': 'be',
    'switzerland': 'ch',
    'poland': 'pl',
    'sweden': 'se',
    'norway': 'no',
    'denmark': 'dk',
    'finland': 'fi',
    'greece': 'gr',
    'romania': 'ro',
    'hungary': 'hu',
    'czech republic': 'cz',
    'slovakia': 'sk',
    'croatia': 'hr',
    'slovenia': 'si',
    'ireland': 'ie',
    'united states': 'us',
    
    // Variantes comunes
    'uk': 'gb',
    'usa': 'us',
    'us': 'us',
    'holland': 'nl',
    'holanda': 'nl',
    'czech': 'cz',
    'great britain': 'gb',
    'gran bretaña': 'gb',
    
    // Francés (solo las variantes únicas)
    'espagne': 'es',
    'allemagne': 'de',
    'italie': 'it',
    'royaume-uni': 'gb',
    'pays-bas': 'nl',
    'belgique': 'be',
    'autriche': 'at',
    'pologne': 'pl',
    'suède': 'se',
    'norvège': 'no',
    'danemark': 'dk',
    'finlande': 'fi',
    'grèce': 'gr',
    'roumanie': 'ro',
    'bulgarie': 'bg',
    'hongrie': 'hu',
    'république tchèque': 'cz',
    'slovaquie': 'sk',
    'croatie': 'hr',
    'slovénie': 'si',
    'irlande': 'ie',
    'états-unis': 'us',
    
    // Alemán (solo las variantes únicas)
    'spanien': 'es',
    'frankreich': 'fr',
    'italien': 'it',
    'deutschland': 'de',
    'vereinigtes königreich': 'gb',
    'niederlande': 'nl',
    'belgien': 'be',
    'schweiz': 'ch',
    'österreich': 'at',
    'polen': 'pl',
    'schweden': 'se',
    'norwegen': 'no',
    'dänemark': 'dk',
    'finnland': 'fi',
    'griechenland': 'gr',
    'rumänien': 'ro',
    'bulgarien': 'bg',
    'ungarn': 'hu',
    'tschechische republik': 'cz',
    'slowakei': 'sk',
    'kroatien': 'hr',
    'slowenien': 'si',
    'irland': 'ie',
    'vereinigte staaten': 'us',
    
    // Italiano (solo las variantes únicas)
    'spagna': 'es',
    'germania': 'de',
    'portogallo': 'pt',
    'regno unito': 'gb',
    'paesi bassi': 'nl',
    'belgio': 'be',
    'svizzera': 'ch',
    'svezia': 'se',
    'norvegia': 'no',
    'danimarca': 'dk',
    'ungheria': 'hu',
    'repubblica ceca': 'cz',
    'slovacchia': 'sk',
    'stati uniti': 'us'
  };
  
  // Buscar mapeo directo
  const directMatch = countryMapping[normalizedName];
  if (directMatch) {
    return directMatch;
  }

  // Buscar coincidencia parcial (útil para casos como "Francia Metropolitana" → "Francia")
  for (const [key, value] of Object.entries(countryMapping)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }

  // Si no se encuentra, usar España como fallback y logear para debugging
  console.warn(`País no encontrado en el mapeo: "${countryName}". Usando España como fallback.`);
  return 'es';
};

export const getCountryNameByCode = (code: string): string => {
  const country = countries.find(c => c.code === code);
  return country ? country.name : code;
};

export const getCountryFlagUrl = (code: string): string => {
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
};
