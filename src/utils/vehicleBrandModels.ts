/**
 * Static brand → models mapping for the vehicle form.
 * Used as fallback when no models exist in the database for a given brand.
 */

export const BRAND_MODELS: Record<string, string[]> = {
  'AUDI': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'E-TRON', 'E-TRON GT', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RSQ8', 'S3', 'S4', 'S5', 'TT'],
  'BMW': ['SERIE 1', 'SERIE 2', 'SERIE 3', 'SERIE 4', 'SERIE 5', 'SERIE 6', 'SERIE 7', 'SERIE 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'I3', 'I4', 'IX', 'IX3', 'M2', 'M3', 'M4', 'M5'],
  'MERCEDES-BENZ': ['CLASE A', 'CLASE B', 'CLASE C', 'CLASE E', 'CLASE S', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'AMG GT', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'SPRINTER', 'VITO', 'CLASE V'],
  'VOLKSWAGEN': ['GOLF', 'POLO', 'PASSAT', 'TIGUAN', 'T-ROC', 'T-CROSS', 'TOUAREG', 'ARTEON', 'TAIGO', 'ID.3', 'ID.4', 'ID.5', 'CADDY', 'TRANSPORTER', 'MULTIVAN', 'UP!'],
  'FORD': ['FIESTA', 'FOCUS', 'MONDEO', 'PUMA', 'KUGA', 'EXPLORER', 'MUSTANG', 'MUSTANG MACH-E', 'RANGER', 'TRANSIT', 'TRANSIT CUSTOM', 'TOURNEO', 'GALAXY', 'S-MAX', 'ECOSPORT'],
  'RENAULT': ['CLIO', 'MEGANE', 'CAPTUR', 'KADJAR', 'SCENIC', 'TALISMAN', 'ARKANA', 'KOLEOS', 'ZOE', 'TWINGO', 'KANGOO', 'MASTER', 'TRAFIC', 'AUSTRAL', 'ESPACE', 'MEGANE E-TECH'],
  'PEUGEOT': ['108', '208', '308', '408', '508', '2008', '3008', '5008', 'RIFTER', 'PARTNER', 'EXPERT', 'BOXER', 'E-208', 'E-2008', 'E-308'],
  'CITROEN': ['C1', 'C3', 'C3 AIRCROSS', 'C4', 'C4 X', 'C5 AIRCROSS', 'C5 X', 'BERLINGO', 'JUMPY', 'JUMPER', 'AMI', 'E-C4'],
  'OPEL': ['CORSA', 'ASTRA', 'INSIGNIA', 'CROSSLAND', 'GRANDLAND', 'MOKKA', 'COMBO', 'VIVARO', 'MOVANO', 'ZAFIRA'],
  'SEAT': ['IBIZA', 'LEON', 'ARONA', 'ATECA', 'TARRACO', 'ALHAMBRA', 'MII'],
  'TOYOTA': ['YARIS', 'COROLLA', 'CAMRY', 'C-HR', 'RAV4', 'HIGHLANDER', 'LAND CRUISER', 'AYGO X', 'BZ4X', 'GR86', 'SUPRA', 'HILUX', 'PROACE', 'PROACE CITY'],
  'NISSAN': ['MICRA', 'JUKE', 'QASHQAI', 'X-TRAIL', 'LEAF', 'ARIYA', 'NAVARA', 'TOWNSTAR', 'INTERSTAR', 'NOTE', 'KICKS'],
  'HONDA': ['CIVIC', 'HR-V', 'CR-V', 'ZR-V', 'JAZZ', 'E:NY1', 'ACCORD', 'CITY'],
  'HYUNDAI': ['I10', 'I20', 'I30', 'KONA', 'TUCSON', 'SANTA FE', 'IONIQ 5', 'IONIQ 6', 'BAYON', 'NEXO', 'STARIA'],
  'KIA': ['PICANTO', 'RIO', 'CEED', 'SPORTAGE', 'SORENTO', 'NIRO', 'EV6', 'EV9', 'STONIC', 'XCEED', 'STINGER', 'CARNIVAL'],
  'MAZDA': ['MAZDA2', 'MAZDA3', 'MAZDA6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'MX-5', 'MX-30'],
  'MITSUBISHI': ['SPACE STAR', 'ASX', 'ECLIPSE CROSS', 'OUTLANDER', 'L200'],
  'SUBARU': ['IMPREZA', 'XV', 'FORESTER', 'OUTBACK', 'BRZ', 'SOLTERRA', 'LEVORG', 'WRX'],
  'VOLVO': ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'V90', 'C40', 'EX30', 'EX90'],
  'JAGUAR': ['XE', 'XF', 'F-PACE', 'E-PACE', 'I-PACE', 'F-TYPE'],
  'LAND ROVER': ['DEFENDER', 'DISCOVERY', 'DISCOVERY SPORT', 'RANGE ROVER', 'RANGE ROVER SPORT', 'RANGE ROVER EVOQUE', 'RANGE ROVER VELAR'],
  'PORSCHE': ['911', 'CAYENNE', 'MACAN', 'PANAMERA', 'TAYCAN', '718 CAYMAN', '718 BOXSTER'],
  'FERRARI': ['296 GTB', '296 GTS', 'SF90', 'F8', 'ROMA', 'PORTOFINO', '812', 'PUROSANGUE', 'DAYTONA SP3'],
  'LAMBORGHINI': ['HURACAN', 'URUS', 'REVUELTO'],
  'MASERATI': ['GHIBLI', 'LEVANTE', 'QUATTROPORTE', 'MC20', 'GRECALE', 'GRANTURISMO'],
  'ALFA ROMEO': ['GIULIA', 'STELVIO', 'TONALE', 'GIULIETTA', '4C'],
  'FIAT': ['500', '500X', '500L', '500E', 'PANDA', 'TIPO', 'DOBLO', 'DUCATO', 'SCUDO', '600'],
  'LANCIA': ['YPSILON'],
  'SKODA': ['FABIA', 'OCTAVIA', 'SUPERB', 'KAMIQ', 'KAROQ', 'KODIAQ', 'SCALA', 'ENYAQ', 'CITIGO'],
  'DACIA': ['SANDERO', 'DUSTER', 'JOGGER', 'SPRING', 'LOGAN', 'LODGY', 'DOKKER'],
  'SUZUKI': ['SWIFT', 'VITARA', 'S-CROSS', 'JIMNY', 'IGNIS', 'ACROSS', 'SWACE'],
  'ISUZU': ['D-MAX'],
  'JEEP': ['RENEGADE', 'COMPASS', 'WRANGLER', 'GLADIATOR', 'GRAND CHEROKEE', 'AVENGER', 'COMMANDER'],
  'CHEVROLET': ['CAMARO', 'CORVETTE', 'SPARK', 'TRAX', 'EQUINOX', 'TAHOE', 'SUBURBAN', 'SILVERADO', 'COLORADO'],
  'CADILLAC': ['CT4', 'CT5', 'ESCALADE', 'XT4', 'XT5', 'XT6', 'LYRIQ'],
  'BUICK': ['ENCORE', 'ENVISION', 'ENCLAVE'],
  'GMC': ['SIERRA', 'CANYON', 'TERRAIN', 'ACADIA', 'YUKON', 'HUMMER EV'],
  'CHRYSLER': ['300', 'PACIFICA', 'VOYAGER'],
  'DODGE': ['CHALLENGER', 'CHARGER', 'DURANGO', 'HORNET'],
  'LINCOLN': ['CORSAIR', 'NAUTILUS', 'AVIATOR', 'NAVIGATOR'],
  'ACURA': ['INTEGRA', 'TLX', 'MDX', 'RDX'],
  'INFINITI': ['Q50', 'Q60', 'QX50', 'QX55', 'QX60', 'QX80'],
  'LEXUS': ['UX', 'NX', 'RX', 'ES', 'IS', 'LS', 'LC', 'LX', 'RZ', 'GX'],
  'TESLA': ['MODEL 3', 'MODEL Y', 'MODEL S', 'MODEL X', 'CYBERTRUCK'],
};

/**
 * Get models for a brand, using static mapping.
 */
export const getStaticModelsForBrand = (brand: string): string[] => {
  const upper = brand.toUpperCase().trim();
  return BRAND_MODELS[upper] || [];
};
