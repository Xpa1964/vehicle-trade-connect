
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Car, BadgeEuro, FileBarChart, Truck, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EU_COUNTRIES, MATRICULATION_TAX_RATES } from './useImportCalculator';
import VehicleTab from './tabs/VehicleTab';
import FiscalTab from './tabs/FiscalTab';
import EmissionsTab from './tabs/EmissionsTab';
import ServicesTab from './tabs/ServicesTab';

interface CalculatorFormProps {
  vehicleType: string;
  isNew: boolean;
  originCountry: string;
  price: number;
  includesVAT: boolean;
  co2Emissions: number;
  useAgency: boolean;
  includeTransport: boolean;
  ivtmTax: number;
  setVehicleType: (type: string) => void;
  setIsNew: (isNew: boolean) => void;
  setOriginCountry: (country: string) => void;
  setPrice: (price: number) => void;
  setIncludesVAT: (includes: boolean) => void;
  setCo2Emissions: (emissions: number) => void;
  setUseAgency: (use: boolean) => void;
  setIncludeTransport: (include: boolean) => void;
  setIvtmTax: (tax: number) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  vehicleType, isNew, originCountry, price, includesVAT, co2Emissions, useAgency, includeTransport, ivtmTax,
  setVehicleType, setIsNew, setOriginCountry, setPrice, setIncludesVAT, setCo2Emissions, setUseAgency, setIncludeTransport, setIvtmTax
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('vehicle');

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{t('calculator.form.title', { fallback: 'Vehicle and Import Details' })}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('calculator.form.description', { fallback: 'Enter the details to calculate import costs' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8 bg-secondary">
              <TabsTrigger value="vehicle" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Car className="h-4 w-4" />
                <span>{t('calculator.tabs.vehicle', { fallback: 'Vehicle' })}</span>
              </TabsTrigger>
              <TabsTrigger value="fiscal" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BadgeEuro className="h-4 w-4" />
                <span>{t('calculator.tabs.fiscal', { fallback: 'Fiscal' })}</span>
              </TabsTrigger>
              <TabsTrigger value="emissions" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileBarChart className="h-4 w-4" />
                <span>{t('calculator.tabs.emissions', { fallback: 'Emissions' })}</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Truck className="h-4 w-4" />
                <span>{t('calculator.tabs.services', { fallback: 'Services' })}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicle">
              <VehicleTab
                vehicleType={vehicleType}
                isNew={isNew}
                originCountry={originCountry}
                setVehicleType={setVehicleType}
                setIsNew={setIsNew}
                setOriginCountry={setOriginCountry}
              />
            </TabsContent>

            <TabsContent value="fiscal">
              <FiscalTab
                price={price}
                includesVAT={includesVAT}
                ivtmTax={ivtmTax}
                setPrice={setPrice}
                setIncludesVAT={setIncludesVAT}
                setIvtmTax={setIvtmTax}
              />
            </TabsContent>
            
            <TabsContent value="emissions">
              <EmissionsTab
                co2Emissions={co2Emissions}
                setCo2Emissions={setCo2Emissions}
              />
            </TabsContent>
            
            <TabsContent value="services">
              <ServicesTab
                useAgency={useAgency}
                includeTransport={includeTransport}
                setUseAgency={setUseAgency}
                setIncludeTransport={setIncludeTransport}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Button 
        onClick={() => setActiveTab(
          activeTab === 'vehicle' ? 'fiscal' :
          activeTab === 'fiscal' ? 'emissions' :
          activeTab === 'emissions' ? 'services' : 'vehicle'
        )}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {activeTab === 'services' 
          ? t('calculator.buttons.calculate', { fallback: 'Calculate costs' })
          : t('calculator.buttons.next', { fallback: 'Next step' })}
      </Button>
    </div>
  );
};

export default CalculatorForm;
