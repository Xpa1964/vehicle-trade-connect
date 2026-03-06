import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Database, Code, Languages, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NormalizationTable from './NormalizationTable';

const APIDocumentation: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            {t('api.docs.title')}
          </h2>
        </div>

        <Tabs defaultValue="process" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="process">
              {t('api.docs.process')}
            </TabsTrigger>
            <TabsTrigger value="format">
              {t('api.docs.format')}
            </TabsTrigger>
            <TabsTrigger value="integration">
              {t('api.docs.integration')}
            </TabsTrigger>
            <TabsTrigger value="normalization">
              {t('api.docs.normalization')}
            </TabsTrigger>
            <TabsTrigger value="reference">
              {t('api.docs.reference')}
            </TabsTrigger>
          </TabsList>

          {/* Proceso de Solicitud */}
          <TabsContent value="process" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t('api.docs.process.title')}
              </h3>
              
              <div className="space-y-6">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {t(`api.docs.process.step${step}`)}
                      </h4>
                      <p className="text-muted-foreground">
                        {t(`api.docs.process.step${step}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>{t('api.docs.process.limits')}:</strong> {t('api.docs.process.limitsDesc')}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Formato de Datos */}
          <TabsContent value="format" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('api.docs.format.title')}
              </h3>
              
              <p className="text-muted-foreground">
                {t('api.docs.format.description')}
              </p>

              <Accordion type="multiple" className="w-full">
                {/* Campos Obligatorios */}
                <AccordionItem value="required">
                  <AccordionTrigger className="text-base">
                    <div className="flex items-center gap-2">
                      {t('api.docs.format.requiredFieldsTitle')}
                      <Badge variant="destructive">{t('api.docs.format.mandatory')}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
{`{
  "make": "BMW",              // ${t('api.docs.format.makeDesc')}
  "model": "Serie 3",         // ${t('api.docs.format.modelDesc')}
  "year": 2022,               // ${t('api.docs.format.yearDesc')}
  "price": 35000,             // ${t('api.docs.format.priceDesc')}
  "fuel_type": "diesel",      // ${t('api.docs.format.fuelTypeDesc')}
  "transmission": "automático", // ${t('api.docs.format.transmissionDesc')}
  "body_type": "sedan"        // ${t('api.docs.format.bodyTypeDesc')}
}`}
                        </pre>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <AlertCircle className="inline h-4 w-4 mr-1" />
                        {t('api.docs.format.requiredNote')}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Campos Opcionales - Datos Directos */}
                <AccordionItem value="direct">
                  <AccordionTrigger className="text-base">
                    <div className="flex items-center gap-2">
                      {t('api.docs.format.directFieldsTitle')}
                      <Badge variant="secondary">{t('api.docs.format.optional')}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('api.docs.format.directFieldsDesc')}
                      </p>
                      
                      <div className="grid gap-4">
                        {/* Mileage */}
                        <div className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-1">
                            <code className="font-semibold">mileage</code>
                            <Badge variant="outline" className="text-xs">number</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t('api.docs.format.mileageDesc')}</p>
                          <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">45000</code>
                        </div>

                        {/* Mileage Unit */}
                        <div className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-1">
                            <code className="font-semibold">mileage_unit</code>
                            <Badge variant="outline" className="text-xs">string</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t('api.docs.format.mileageUnitDesc')}</p>
                          <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">"km" | "mi"</code>
                        </div>

                        {/* VIN */}
                        <div className="border rounded-lg p-3 bg-amber-50/50 dark:bg-amber-950/20">
                          <div className="flex items-start justify-between mb-1">
                            <code className="font-semibold">vin</code>
                            <Badge variant="outline" className="text-xs">string</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t('api.docs.format.vinDesc')}</p>
                          <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">"WBA3B5G50DNP26082"</code>
                        </div>

                        {/* License Plate */}
                        <div className="border rounded-lg p-3 bg-amber-50/50 dark:bg-amber-950/20">
                          <div className="flex items-start justify-between mb-1">
                            <code className="font-semibold">license_plate</code>
                            <Badge variant="outline" className="text-xs">string</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t('api.docs.format.licensePlateDesc')}</p>
                          <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">"1234ABC"</code>
                        </div>

                        {/* Description */}
                        <div className="border rounded-lg p-3 bg-amber-50/50 dark:bg-amber-950/20">
                          <div className="flex items-start justify-between mb-1">
                            <code className="font-semibold">description</code>
                            <Badge variant="outline" className="text-xs">string</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t('api.docs.format.descriptionDesc')}</p>
                          <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">"BMW en excelente estado..."</code>
                        </div>

                        {/* Images */}
                        <div className="border rounded-lg p-3 bg-amber-50/50 dark:bg-amber-950/20">
                          <div className="flex items-start justify-between mb-1">
                            <code className="font-semibold">images</code>
                            <Badge variant="outline" className="text-xs">string[]</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t('api.docs.format.imagesDesc')}</p>
                          <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">["https://...", "https://..."]</code>
                        </div>

                        {/* Other fields in compact format */}
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">doors</code>
                            <Badge variant="outline" className="text-xs ml-2">number</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.doorsDesc')}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">seats</code>
                            <Badge variant="outline" className="text-xs ml-2">number</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.seatsDesc')}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">engine_size</code>
                            <Badge variant="outline" className="text-xs ml-2">string</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.engineSizeDesc')}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">horsepower</code>
                            <Badge variant="outline" className="text-xs ml-2">number</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.horsepowerDesc')}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">registration_date</code>
                            <Badge variant="outline" className="text-xs ml-2">string</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.registrationDateDesc')}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">co2_emissions</code>
                            <Badge variant="outline" className="text-xs ml-2">number</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.co2Desc')}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">warranty</code>
                            <Badge variant="outline" className="text-xs ml-2">boolean</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.warrantyDesc')}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">equipment</code>
                            <Badge variant="outline" className="text-xs ml-2">string[]</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.equipmentDesc')}</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <code className="font-semibold text-sm">interior_color</code>
                            <Badge variant="outline" className="text-xs ml-2">string</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{t('api.docs.format.interiorColorDesc')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Campos Opcionales - Normalizados */}
                <AccordionItem value="normalized">
                  <AccordionTrigger className="text-base">
                    <div className="flex items-center gap-2">
                      {t('api.docs.format.normalizedFieldsTitle')}
                      <Badge variant="secondary">{t('api.docs.format.optional')}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('api.docs.format.normalizedFieldsDesc')}
                      </p>
                      
                      <div className="grid gap-3">
                        {['status', 'iva_status', 'transaction_type', 'euro_standard', 'color', 'condition', 'vehicle_type'].map((field) => (
                          <div key={field} className="border rounded-lg p-3">
                            <div className="flex items-start justify-between mb-1">
                              <code className="font-semibold">{field}</code>
                              <Badge variant="outline" className="text-xs">string</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {t(`api.docs.format.${field}Desc`)}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <AlertCircle className="inline h-4 w-4 mr-1" />
                        {t('api.docs.format.seeNormalizationTab')}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Validaciones */}
                <AccordionItem value="validations">
                  <AccordionTrigger className="text-base">
                    {t('api.docs.format.validations')}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <code className="font-semibold">year</code>
                        <p className="text-sm text-muted-foreground mt-1">{t('api.docs.format.yearValidation')}</p>
                      </div>
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <code className="font-semibold">price</code>
                        <p className="text-sm text-muted-foreground mt-1">{t('api.docs.format.priceValidation')}</p>
                      </div>
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <code className="font-semibold">mileage</code>
                        <p className="text-sm text-muted-foreground mt-1">{t('api.docs.format.mileageValidation')}</p>
                      </div>
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <code className="font-semibold">vin</code>
                        <p className="text-sm text-muted-foreground mt-1">{t('api.docs.format.vinValidation')}</p>
                      </div>
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <code className="font-semibold">images</code>
                        <p className="text-sm text-muted-foreground mt-1">{t('api.docs.format.imagesValidation')}</p>
                      </div>
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <code className="font-semibold">description</code>
                        <p className="text-sm text-muted-foreground mt-1">{t('api.docs.format.descriptionValidation')}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Ejemplo Completo */}
                <AccordionItem value="complete-example">
                  <AccordionTrigger className="text-base">
                    {t('api.docs.format.completeExample')}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`{
  // Campos Obligatorios
  "make": "BMW",
  "model": "Serie 3",
  "year": 2022,
  "price": 35000,
  "fuel_type": "diesel",
  "transmission": "automático",
  "body_type": "sedan",
  
  // Campos Opcionales - Datos Directos (Críticos)
  "mileage": 45000,
  "mileage_unit": "km",
  "vin": "WBA3B5G50DNP26082",
  "license_plate": "1234ABC",
  "description": "BMW Serie 3 en excelente estado, único dueño, revisiones oficiales al día.",
  "images": [
    "https://ejemplo.com/imagen1.jpg",
    "https://ejemplo.com/imagen2.jpg"
  ],
  
  // Campos Opcionales - Especificaciones
  "doors": 4,
  "seats": 5,
  "engine_size": "2.0L",
  "horsepower": 190,
  "registration_date": "2022-01-15",
  "co2_emissions": 120,
  "warranty": true,
  "equipment": ["GPS", "Leather seats", "Parking sensors"],
  "interior_color": "Negro",
  
  // Campos Opcionales - Normalizados (ver pestaña Normalización)
  "status": "available",
  "iva_status": "incluido",
  "transaction_type": "nacional",
  "euro_standard": "euro6d",
  "color": "azul",
  "condition": "usado",
  "vehicle_type": "turismo"
}`}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          {/* Integración Técnica */}
          <TabsContent value="integration" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Code className="h-5 w-5" />
                {t('api.docs.integration.title')}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('api.docs.integration.endpoint')}
                  </h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <code className="text-sm">POST {import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-vehicles</code>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('api.docs.integration.headers')}
                  </h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('api.docs.integration.examples')}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">cURL</p>
                      <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`curl -X POST \\
  ${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-vehicles \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "make": "BMW",
    "model": "Serie 3",
    "year": 2022,
    "price": 35000,
    "fuel_type": "diesel",
    "transmission": "automático",
    "body_type": "sedan",
    "mileage": 45000,
    "vin": "WBA3B5G50DNP26082",
    "license_plate": "1234ABC",
    "description": "BMW Serie 3 en excelente estado",
    "images": ["https://ejemplo.com/img1.jpg"]
  }'`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">JavaScript/Node.js</p>
                      <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`const response = await fetch(
  '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-vehicles',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      make: 'BMW',
      model: 'Serie 3',
      year: 2022,
      price: 35000,
      fuel_type: 'diesel',
      transmission: 'automático',
      body_type: 'sedan',
      mileage: 45000,
      vin: 'WBA3B5G50DNP26082',
      license_plate: '1234ABC',
      description: 'BMW Serie 3 en excelente estado',
      images: ['https://ejemplo.com/img1.jpg']
    })
  }
);`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Python</p>
                      <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`import requests

response = requests.post(
    'https://inqqnsvlimtpjxjxuzaf.supabase.co/functions/v1/sync-vehicles',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'make': 'BMW',
        'model': 'Serie 3',
        'year': 2022,
        'price': 35000,
        'fuel_type': 'diesel',
        'transmission': 'automático',
        'body_type': 'sedan',
        'mileage': 45000,
        'vin': 'WBA3B5G50DNP26082',
        'license_plate': '1234ABC',
        'description': 'BMW Serie 3 en excelente estado',
        'images': ['https://ejemplo.com/img1.jpg']
    }
)`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-foreground mb-2">
                    {t('api.docs.integration.rateLimit')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t('api.docs.integration.rateLimitDesc')}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Normalización Multiidioma */}
          <TabsContent value="normalization" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Languages className="h-5 w-5" />
                {t('api.docs.normalization.title')}
              </h3>
              
              <p className="text-muted-foreground">
                {t('api.docs.normalization.description')}
              </p>

              <NormalizationTable />
            </div>
          </TabsContent>

          {/* Referencia Rápida */}
          <TabsContent value="reference" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t('api.docs.reference.title')}
              </h3>
              
              <p className="text-muted-foreground">
                {t('api.docs.reference.description')}
              </p>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-semibold">{t('api.docs.reference.field')}</th>
                      <th className="text-left p-3 font-semibold">{t('api.docs.reference.type')}</th>
                      <th className="text-left p-3 font-semibold">{t('api.docs.reference.status')}</th>
                      <th className="text-left p-3 font-semibold">{t('api.docs.reference.normalization')}</th>
                      <th className="text-left p-3 font-semibold">{t('api.docs.reference.example')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { field: 'make', type: 'string', required: true, normalized: false, example: 'BMW' },
                      { field: 'model', type: 'string', required: true, normalized: false, example: 'Serie 3' },
                      { field: 'year', type: 'number', required: true, normalized: false, example: '2022' },
                      { field: 'price', type: 'number', required: true, normalized: false, example: '35000' },
                      { field: 'fuel_type', type: 'string', required: true, normalized: true, example: 'diesel' },
                      { field: 'transmission', type: 'string', required: true, normalized: true, example: 'automático' },
                      { field: 'body_type', type: 'string', required: true, normalized: true, example: 'sedan' },
                      { field: 'mileage', type: 'number', required: false, normalized: false, example: '45000', critical: true },
                      { field: 'vin', type: 'string', required: false, normalized: false, example: 'WBA3B5G50DNP26082', critical: true },
                      { field: 'license_plate', type: 'string', required: false, normalized: false, example: '1234ABC', critical: true },
                      { field: 'description', type: 'string', required: false, normalized: false, example: 'BMW en...', critical: true },
                      { field: 'images', type: 'string[]', required: false, normalized: false, example: '["https://..."]', critical: true },
                      { field: 'status', type: 'string', required: false, normalized: true, example: 'available' },
                      { field: 'color', type: 'string', required: false, normalized: true, example: 'azul' },
                      { field: 'condition', type: 'string', required: false, normalized: true, example: 'usado' },
                    ].map((item, idx) => (
                      <tr key={idx} className={item.critical ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}>
                        <td className="p-3">
                          <code className="font-semibold">{item.field}</code>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">{item.type}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={item.required ? 'destructive' : 'secondary'} className="text-xs">
                            {item.required ? t('api.docs.format.mandatory') : t('api.docs.format.optional')}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          {item.normalized ? '✓' : '—'}
                        </td>
                        <td className="p-3">
                          <code className="text-xs">{item.example}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium mb-1">
                  <AlertCircle className="inline h-4 w-4 mr-1" />
                  {t('api.docs.reference.criticalNote')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('api.docs.reference.criticalNoteDesc')}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default APIDocumentation;
