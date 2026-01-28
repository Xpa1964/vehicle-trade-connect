
import { useState, useEffect, useCallback } from 'react';

export const EU_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
  'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
  'Slovenia', 'Spain', 'Sweden'
];

export const MATRICULATION_TAX_RATES = {
  '0': 0,      // 0% for CO2 emissions of 0 g/km
  '120': 0,    // 0% for CO2 emissions of 1-120 g/km
  '160': 4.75, // 4.75% for CO2 emissions of 121-160 g/km
  '200': 9.75, // 9.75% for CO2 emissions of 161-200 g/km
  'over200': 14.75 // 14.75% for CO2 emissions over 200 g/km
};

export const ADMIN_COSTS = {
  dgtFee: 100,         // Approximate DGT registration fee
  technicalSheet: 75,  // Approximate cost for technical data sheet
  itv: 70,             // Approximate cost for import vehicle inspection
  trafficFee: 100,     // Approximate traffic fee for circulation permit
  ivtm: 100            // Default IVTM value (now customizable)
};

const AGENCY_COST = 300;  // Cost of agency services
const TRANSPORT_COST = 500; // Cost of transport

// Valores por defecto para reset
const DEFAULT_VALUES = {
  vehicleType: 'car',
  isNew: true,
  originCountry: 'Germany',
  price: 15000,
  includesVAT: true,
  co2Emissions: 130,
  useAgency: true,
  includeTransport: true,
  ivtmTax: ADMIN_COSTS.ivtm
};

export interface CalculationResults {
  netPrice: number;
  vatCost: number;
  matriculationTax: number;
  adminCosts: number;
  ivtmTax: number;
  agencyCost: number;
  transportCost: number;
  totalCost: number;
}

export const useImportCalculator = () => {
  const [vehicleType, setVehicleType] = useState(DEFAULT_VALUES.vehicleType);
  const [isNew, setIsNew] = useState(DEFAULT_VALUES.isNew);
  const [originCountry, setOriginCountry] = useState(DEFAULT_VALUES.originCountry);
  const [price, setPrice] = useState(DEFAULT_VALUES.price);
  const [includesVAT, setIncludesVAT] = useState(DEFAULT_VALUES.includesVAT);
  const [co2Emissions, setCo2Emissions] = useState(DEFAULT_VALUES.co2Emissions);
  const [useAgency, setUseAgency] = useState(DEFAULT_VALUES.useAgency);
  const [includeTransport, setIncludeTransport] = useState(DEFAULT_VALUES.includeTransport);
  const [ivtmTax, setIvtmTax] = useState(DEFAULT_VALUES.ivtmTax);
  const [results, setResults] = useState<CalculationResults>({
    netPrice: 0,
    vatCost: 0,
    matriculationTax: 0,
    adminCosts: 0,
    ivtmTax: 0,
    agencyCost: 0,
    transportCost: 0,
    totalCost: 0
  });

  // Function to reset all calculator values to defaults
  const resetCalculator = useCallback(() => {
    setVehicleType(DEFAULT_VALUES.vehicleType);
    setIsNew(DEFAULT_VALUES.isNew);
    setOriginCountry(DEFAULT_VALUES.originCountry);
    setPrice(DEFAULT_VALUES.price);
    setIncludesVAT(DEFAULT_VALUES.includesVAT);
    setCo2Emissions(DEFAULT_VALUES.co2Emissions);
    setUseAgency(DEFAULT_VALUES.useAgency);
    setIncludeTransport(DEFAULT_VALUES.includeTransport);
    setIvtmTax(DEFAULT_VALUES.ivtmTax);
    
    // Force immediate results reset
    setResults({
      netPrice: 0,
      vatCost: 0,
      matriculationTax: 0,
      adminCosts: 0,
      ivtmTax: 0,
      agencyCost: 0,
      transportCost: 0,
      totalCost: 0
    });
  }, []);

  // Function to calculate registration tax rate based on CO2 emissions
  const getMatriculationTaxRate = useCallback((emissions: number) => {
    if (emissions === 0) return MATRICULATION_TAX_RATES['0'];
    if (emissions <= 120) return MATRICULATION_TAX_RATES['120'];
    if (emissions <= 160) return MATRICULATION_TAX_RATES['160'];
    if (emissions <= 200) return MATRICULATION_TAX_RATES['200'];
    return MATRICULATION_TAX_RATES['over200'];
  }, []);

  // Calculate results whenever inputs change
  useEffect(() => {
    // Determine net price (without VAT)
    const netPrice = includesVAT ? price / 1.21 : price;
    
    // Calculate VAT (21% in Spain)
    const vatCost = netPrice * 0.21;
    
    // Calculate registration tax based on CO2 emissions
    const matriculationTaxRate = getMatriculationTaxRate(co2Emissions);
    const matriculationTax = netPrice * (matriculationTaxRate / 100);
    
    // Calculate administrative costs - INCLUDING IVTM
    const adminCosts = ADMIN_COSTS.dgtFee + ADMIN_COSTS.technicalSheet + ADMIN_COSTS.itv + ADMIN_COSTS.trafficFee + ivtmTax;
    
    // Optional costs
    const agencyCost = useAgency ? AGENCY_COST : 0;
    const transportCost = includeTransport ? TRANSPORT_COST : 0;
    
    // Total cost - IVTM is now part of adminCosts
    const totalCost = netPrice + vatCost + matriculationTax + adminCosts + agencyCost + transportCost;
    
    setResults({
      netPrice,
      vatCost,
      matriculationTax,
      adminCosts,
      ivtmTax,
      agencyCost,
      transportCost,
      totalCost
    });
  }, [
    price, 
    includesVAT, 
    co2Emissions, 
    useAgency, 
    includeTransport, 
    getMatriculationTaxRate,
    ivtmTax
  ]);

  // Function to print the calculation
  const printCalculation = useCallback(() => {
    // Store the current page title
    const originalTitle = document.title;
    
    // Set a new title for the print
    document.title = "KONECT VO - Import Calculation";
    
    // Print the calculation
    window.print();
    
    // Restore the original title
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  }, []);
  
  return {
    vehicleType,
    isNew,
    originCountry,
    price,
    includesVAT,
    co2Emissions,
    useAgency,
    includeTransport,
    ivtmTax,
    results,
    setVehicleType,
    setIsNew,
    setOriginCountry,
    setPrice,
    setIncludesVAT,
    setCo2Emissions,
    setUseAgency,
    setIncludeTransport,
    setIvtmTax,
    resetCalculator,
    printCalculation
  };
};

export default useImportCalculator;
