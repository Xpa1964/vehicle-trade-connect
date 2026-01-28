import { Language } from '@/config/languages';
import { translations } from '@/translations';

/**
 * Mapa inverso: nombre de columna traducido -> nombre de campo interno
 * Esto permite al parser reconocer columnas en cualquier idioma
 */
export const getColumnToFieldMap = (language: Language): Record<string, string> => {
  const t = (key: string) => translations[language]?.[key] || key;
  
  return {
    // Mandatory fields
    [t('xlsx.column.brand')]: 'brand',
    [t('xlsx.column.model')]: 'model',
    [t('xlsx.column.year')]: 'year',
    [t('xlsx.column.price')]: 'price',
    [t('xlsx.column.mileage')]: 'mileage',
    [t('xlsx.column.fuel')]: 'fuel',
    [t('xlsx.column.transmission')]: 'transmission',
    [t('xlsx.column.location')]: 'location',
    [t('xlsx.column.country')]: 'country',
    
    // Optional fields
    [t('xlsx.column.vin')]: 'vin',
    [t('xlsx.column.licensePlate')]: 'licensePlate',
    [t('xlsx.column.vehicleType')]: 'vehicleType',
    [t('xlsx.column.color')]: 'color',
    [t('xlsx.column.doors')]: 'doors',
    [t('xlsx.column.engineSize')]: 'engineSize',
    [t('xlsx.column.enginePower')]: 'enginePower',
    [t('xlsx.column.euroStandard')]: 'euroStandard',
    [t('xlsx.column.co2Emissions')]: 'co2Emissions',
    [t('xlsx.column.ivaStatus')]: 'ivaStatus',
    [t('xlsx.column.cocStatus')]: 'cocStatus',
    [t('xlsx.column.acceptsExchange')]: 'acceptsExchange',
    [t('xlsx.column.commissionSale')]: 'commissionSale',
    [t('xlsx.column.publicSalePrice')]: 'publicSalePrice',
    [t('xlsx.column.commissionAmount')]: 'commissionAmount',
    [t('xlsx.column.description')]: 'description'
  };
};

/**
 * Mapeo de campos internos a nombres de columna traducidos
 */
export const getFieldToColumnMap = (language: Language): Record<string, string> => {
  const t = (key: string) => translations[language]?.[key] || key;
  
  return {
    // Mandatory fields
    brand: t('xlsx.column.brand'),
    model: t('xlsx.column.model'),
    year: t('xlsx.column.year'),
    price: t('xlsx.column.price'),
    mileage: t('xlsx.column.mileage'),
    fuel: t('xlsx.column.fuel'),
    transmission: t('xlsx.column.transmission'),
    location: t('xlsx.column.location'),
    country: t('xlsx.column.country'),
    
    // Optional fields
    vin: t('xlsx.column.vin'),
    licensePlate: t('xlsx.column.licensePlate'),
    vehicleType: t('xlsx.column.vehicleType'),
    color: t('xlsx.column.color'),
    doors: t('xlsx.column.doors'),
    engineSize: t('xlsx.column.engineSize'),
    enginePower: t('xlsx.column.enginePower'),
    euroStandard: t('xlsx.column.euroStandard'),
    co2Emissions: t('xlsx.column.co2Emissions'),
    ivaStatus: t('xlsx.column.ivaStatus'),
    cocStatus: t('xlsx.column.cocStatus'),
    acceptsExchange: t('xlsx.column.acceptsExchange'),
    commissionSale: t('xlsx.column.commissionSale'),
    publicSalePrice: t('xlsx.column.publicSalePrice'),
    commissionAmount: t('xlsx.column.commissionAmount'),
    description: t('xlsx.column.description')
  };
};

/**
 * Obtiene todos los nombres de columnas traducidos para todos los idiomas
 * Útil para el parser que necesita reconocer columnas en cualquier idioma
 */
export const getAllColumnNames = (): Record<string, string> => {
  const allLanguages: Language[] = ['es', 'en', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'dk'];
  const allColumns: Record<string, string> = {};
  
  allLanguages.forEach(lang => {
    const map = getColumnToFieldMap(lang);
    Object.assign(allColumns, map);
  });
  
  return allColumns;
};
