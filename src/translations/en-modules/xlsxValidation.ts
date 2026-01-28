export default {
  // Required field errors
  'xlsx.validation.brandRequired': 'Brand is required',
  'xlsx.validation.modelRequired': 'Model is required',
  'xlsx.validation.yearRequired': 'Year is required',
  'xlsx.validation.priceRequired': 'Price is required',
  'xlsx.validation.mileageRequired': 'Mileage is required',
  'xlsx.validation.fuelRequired': 'Fuel type is required',
  'xlsx.validation.transmissionRequired': 'Transmission is required',
  'xlsx.validation.locationRequired': 'Location is required',
  'xlsx.validation.countryRequired': 'Country is required',
  
  // Format errors
  'xlsx.validation.brandUnrecognized': 'Unrecognized brand: "{value}"',
  'xlsx.validation.brandSuggestion': 'Must be one of the brands from the dropdown list',
  'xlsx.validation.yearRange': 'Year must be between 1900 and {maxYear}',
  'xlsx.validation.pricePositive': 'Price must be a positive number',
  'xlsx.validation.mileagePositive': 'Mileage must be a non-negative number',
  'xlsx.validation.fuelInvalid': 'Unrecognized fuel type: "{value}"',
  'xlsx.validation.transmissionInvalid': 'Unrecognized transmission type: "{value}"',
  'xlsx.validation.countryInvalid': 'Unrecognized country: "{value}"',
  
  // General errors
  'xlsx.validation.sheetNotFound': 'Data sheet not found. Make sure to use the correct template.',
  'xlsx.validation.fileReadError': 'Error reading XLSX file',
  'xlsx.validation.vinInvalid': 'VIN must be 17 alphanumeric characters',
  'xlsx.validation.doorsRange': 'Number of doors must be between 2 and 7',
  'xlsx.validation.euroStandardInvalid': 'Invalid Euro standard',
  'xlsx.validation.ivaStatusInvalid': 'Invalid VAT status',
  'xlsx.validation.booleanInvalid': 'Invalid boolean value',
  'xlsx.validation.descriptionTooLong': 'Description cannot exceed 2000 characters',
};
