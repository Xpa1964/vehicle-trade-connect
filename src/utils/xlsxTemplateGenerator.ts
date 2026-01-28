import ExcelJS from 'exceljs';
import { countries } from './countryUtils';
import { Language } from '@/config/languages';
import { translations } from '@/translations';

const VEHICLE_BRANDS = [
  'AUDI', 'BMW', 'MERCEDES-BENZ', 'VOLKSWAGEN', 'FORD', 'RENAULT', 'PEUGEOT', 'CITROEN',
  'OPEL', 'SEAT', 'TOYOTA', 'NISSAN', 'HONDA', 'HYUNDAI', 'KIA', 'MAZDA', 'MITSUBISHI',
  'SUBARU', 'VOLVO', 'JAGUAR', 'LAND ROVER', 'PORSCHE', 'FERRARI', 'LAMBORGHINI', 'MASERATI',
  'ALFA ROMEO', 'FIAT', 'LANCIA', 'SKODA', 'DACIA', 'SUZUKI', 'ISUZU', 'JEEP', 'CHEVROLET',
  'CADILLAC', 'BUICK', 'GMC', 'CHRYSLER', 'DODGE', 'LINCOLN', 'ACURA', 'INFINITI', 'LEXUS',
  'TESLA'
].sort();

const FUEL_TYPES = ['diesel', 'gasoline', 'electric', 'hybrid', 'plugin-hybrid', 'lpg', 'cng', 'hydrogen'];
const TRANSMISSIONS = ['manual', 'automatic', 'semi-automatic'];
const IVA_STATUS = ['included', 'notIncluded', 'deductible', 'rebu'];
const EURO_STANDARDS = ['euro1', 'euro2', 'euro3', 'euro4', 'euro5', 'euro6', 'euro6d', 'euro7'];

export const generateXLSXTemplate = async (language: Language = 'es') => {
  const t = (key: string) => translations[language]?.[key] || key;
  
  const workbook = new ExcelJS.Workbook();

  // ================== TAB 1: INSTRUCCIONES ==================
  const instructionsSheet = workbook.addWorksheet(t('xlsx.tabInstructions'));
  
  const instructionsData = [
    [t('xlsx.title')],
    [''],
    [t('xlsx.step1')],
    [t('xlsx.step2')],
    [t('xlsx.step3')],
    [t('xlsx.step4')],
    [t('xlsx.step5')],
    [''],
    [t('xlsx.important')],
    [t('xlsx.requiredFieldsNote')],
    [t('xlsx.decimalSeparator')],
    [t('xlsx.yearRange')],
    [t('xlsx.booleanValues')],
    [''],
    [t('xlsx.imageAssociation.title')],
    [''],
    [t('xlsx.imageAssociation.option1Title')],
    [t('xlsx.imageAssociation.option1Example1')],
    [t('xlsx.imageAssociation.option1Example2')],
    [t('xlsx.imageAssociation.option1Desc')],
    [''],
    [t('xlsx.imageAssociation.option2Title')],
    [t('xlsx.imageAssociation.option2Example1')],
    [t('xlsx.imageAssociation.option2Example2')],
    [''],
    [t('xlsx.imageAssociation.option3Title')],
    [t('xlsx.imageAssociation.option3Desc')],
    [t('xlsx.imageAssociation.option3Structure')],
    [''],
    [t('xlsx.imageAssociation.note')],
    [''],
    [t('xlsx.requiredFieldsSection')],
    [t('xlsx.brandField')],
    [t('xlsx.modelField')],
    [t('xlsx.yearField')],
    [t('xlsx.priceField')],
    [t('xlsx.mileageField')],
    [t('xlsx.fuelField')],
    [t('xlsx.transmissionField')],
    [t('xlsx.locationField')],
    [t('xlsx.countryField')],
    [''],
    [t('xlsx.optionalFieldsSection')],
    [t('xlsx.vinField')],
    [t('xlsx.licensePlateField')],
    [t('xlsx.vehicleTypeField')],
    [t('xlsx.colorField')],
    [t('xlsx.doorsField')],
    [t('xlsx.engineSizeField')],
    [t('xlsx.enginePowerField')],
    [t('xlsx.euroStandardField')],
    [t('xlsx.co2EmissionsField')],
    [t('xlsx.ivaStatusField')],
    [t('xlsx.cocStatusField')],
    [t('xlsx.acceptsExchangeField')],
    [t('xlsx.commissionSaleField')],
    [t('xlsx.publicSalePriceField')],
    [t('xlsx.commissionAmountField')],
    [t('xlsx.descriptionField')],
    [''],
    [t('xlsx.examples')],
    [t('xlsx.exampleRow')],
    [t('xlsx.exampleData')],
    [''],
    [t('xlsx.validations')],
    [t('xlsx.validationExcel')],
    [t('xlsx.validationNumbers')],
    [t('xlsx.validationYears')],
    [t('xlsx.validationPrices')],
    [''],
    [t('xlsx.help')],
    [t('xlsx.helpText')]
  ];

  instructionsData.forEach((row, index) => {
    instructionsSheet.addRow(row);
    if (index === 0) {
      // Estilo del título
      instructionsSheet.getRow(1).font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
      instructionsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      instructionsSheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    }
  });

  instructionsSheet.getColumn(1).width = 100;

  // ================== TAB 2: DATOS VEHÍCULOS (UNIFICADO) ==================
  const dataSheet = workbook.addWorksheet(t('xlsx.tabVehicleData'));

  // Crear encabezados con campos obligatorios y opcionales
  const headers = [
    // Obligatorios
    `${t('xlsx.column.brand')}*`,
    `${t('xlsx.column.model')}*`,
    `${t('xlsx.column.year')}*`,
    `${t('xlsx.column.price')}*`,
    `${t('xlsx.column.mileage')}*`,
    `${t('xlsx.column.fuel')}*`,
    `${t('xlsx.column.transmission')}*`,
    `${t('xlsx.column.location')}*`,
    `${t('xlsx.column.country')}*`,
    // Opcionales
    t('xlsx.column.vin'),
    t('xlsx.column.licensePlate'),
    t('xlsx.column.vehicleType'),
    t('xlsx.column.color'),
    t('xlsx.column.doors'),
    t('xlsx.column.engineSize'),
    t('xlsx.column.enginePower'),
    t('xlsx.column.euroStandard'),
    t('xlsx.column.co2Emissions'),
    t('xlsx.column.ivaStatus'),
    t('xlsx.column.cocStatus'),
    t('xlsx.column.acceptsExchange'),
    t('xlsx.column.commissionSale'),
    t('xlsx.column.publicSalePrice'),
    t('xlsx.column.commissionAmount'),
    t('xlsx.column.description')
  ];

  const headerRow = dataSheet.addRow(headers);
  
  // Estilo de encabezados - obligatorios en azul, opcionales en gris
  headerRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    
    if (colNumber <= 9) {
      // Campos obligatorios - azul
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
    } else {
      // Campos opcionales - gris
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF808080' }
      };
    }
  });

  // Fila de ejemplo
  const exampleRow = [
    'AUDI', 'A4', '2020', '25000', '50000',
    'diesel', 'automatic', 'Madrid', 'España',
    'WVWZZZ1KZBW123456', 'ABC1234', 'sedan', 'Negro', '4',
    '1968', '150', 'euro6', '120',
    'included', 'true', 'false', 'false',
    '', '', 'Vehículo en excelente estado'
  ];
  dataSheet.addRow(exampleRow);

  // Ajustar anchos de columnas
  const columnWidths = [
    20, 20, 10, 12, 12, 15, 18, 20, 20, // Obligatorios
    20, 15, 15, 15, 8, 12, 12, 15, 12, 15, 12, 15, 15, 15, 15, 40 // Opcionales
  ];
  
  columnWidths.forEach((width, index) => {
    dataSheet.getColumn(index + 1).width = width;
  });

  // Aplicar validaciones de datos con dropdowns
  // Brand (columna A)
  for (let row = 2; row <= 1000; row++) {
    dataSheet.getCell(`A${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: [`"${VEHICLE_BRANDS.join(',')}"`],
      showErrorMessage: true,
      errorStyle: 'error',
      errorTitle: t('xlsx.validationErrorTitle'),
      error: t('xlsx.validationError')
    };
  }

  // Fuel (columna F)
  for (let row = 2; row <= 1000; row++) {
    dataSheet.getCell(`F${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: [`"${FUEL_TYPES.join(',')}"`],
      showErrorMessage: true,
      errorStyle: 'error',
      errorTitle: t('xlsx.validationErrorTitle'),
      error: t('xlsx.validationError')
    };
  }

  // Transmission (columna G)
  for (let row = 2; row <= 1000; row++) {
    dataSheet.getCell(`G${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: [`"${TRANSMISSIONS.join(',')}"`],
      showErrorMessage: true,
      errorStyle: 'error',
      errorTitle: t('xlsx.validationErrorTitle'),
      error: t('xlsx.validationError')
    };
  }

  // Country (columna I)
  for (let row = 2; row <= 1000; row++) {
    dataSheet.getCell(`I${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: [`"${countries.map(c => c.name).join(',')}"`],
      showErrorMessage: true,
      errorStyle: 'error',
      errorTitle: t('xlsx.validationErrorTitle'),
      error: t('xlsx.validationError')
    };
  }

  // Euro Standard (columna Q)
  for (let row = 2; row <= 1000; row++) {
    dataSheet.getCell(`Q${row}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`"${EURO_STANDARDS.join(',')}"`]
    };
  }

  // IVA Status (columna S)
  for (let row = 2; row <= 1000; row++) {
    dataSheet.getCell(`S${row}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`"${IVA_STATUS.join(',')}"`]
    };
  }

  // COC Status, Accepts Exchange, Commission Sale (columnas T, U, V)
  for (let row = 2; row <= 1000; row++) {
    ['T', 'U', 'V'].forEach(col => {
      dataSheet.getCell(`${col}${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"true,false"']
      };
    });
  }

  // ================== TAB 3: LISTAS (OCULTA) ==================
  const listsSheet = workbook.addWorksheet(t('xlsx.tabLists'), { state: 'hidden' });
  
  const listsHeaders = ['MARCAS', 'COMBUSTIBLES', 'TRANSMISIONES', 'PAÍSES', 'EURO', 'IVA', 'BOOLEANOS'];
  listsSheet.addRow(listsHeaders);

  const maxLength = Math.max(
    VEHICLE_BRANDS.length,
    FUEL_TYPES.length,
    TRANSMISSIONS.length,
    countries.length,
    EURO_STANDARDS.length,
    IVA_STATUS.length,
    2
  );

  for (let i = 0; i < maxLength; i++) {
    listsSheet.addRow([
      VEHICLE_BRANDS[i] || '',
      FUEL_TYPES[i] || '',
      TRANSMISSIONS[i] || '',
      countries[i]?.name || '',
      EURO_STANDARDS[i] || '',
      IVA_STATUS[i] || '',
      i < 2 ? (i === 0 ? 'true' : 'false') : ''
    ]);
  }

  // Generar y descargar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = t('xlsx.filename');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
