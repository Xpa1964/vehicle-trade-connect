import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'sonner';
import { useEnhancedVehicleData } from '@/hooks/useEnhancedVehicleData';

interface VehicleDataSheetProps {
  vehicle: Vehicle;
}

const VehicleDataSheet: React.FC<VehicleDataSheetProps> = ({ vehicle }) => {
  const { t } = useLanguage();
  const {
    equipmentByCategory,
    damages,
    vehicleInformation,
    primaryImage,
    isLoading
  } = useEnhancedVehicleData(vehicle.id);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'Bajo';
      case 'medium': return 'Medio';
      case 'high': return 'Alto';
      default: return severity || 'No especificada';
    }
  };

  const handleDownloadPDF = async () => {
    if (isLoading) {
      toast.error(t('common.loading', { fallback: 'Esperando a que se carguen los datos...' }));
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      // Generate flat equipment list (without categories)
      const allEquipmentItems = Object.values(equipmentByCategory).flatMap(category => category.items);
      const equipmentList = allEquipmentItems.length > 0 ? `
        <div class="equipment-list">
          ${allEquipmentItems.map(item => `
            <div class="equipment-item">• ${item.name}</div>
          `).join('')}
        </div>
      ` : `<p class="no-equipment">${t('vehicles.equipmentNotAvailable')}</p>`;

      // Vehicle status section (damages)
      const vehicleStatusSection = damages.length > 0 ? `
        <div class="section">
          <h2 class="section-title">${t('vehicles.vehicleState')}</h2>
          ${damages.map(damage => `
            <div class="damage-item" style="border-left-color: ${getSeverityColor(damage.severity)};">
              <div class="damage-header">
                <h4 class="damage-title">${damage.title}</h4>
                <span class="damage-severity" style="background-color: ${getSeverityColor(damage.severity)};">${getSeverityText(damage.severity)}</span>
              </div>
              <div class="damage-details">
                 <p><strong>${t('vehicles.damages')}:</strong> ${damage.damage_type}</p>
                 ${damage.location ? `<p><strong>${t('vehicles.location')}:</strong> ${damage.location}</p>` : ''}
                 ${damage.description ? `<p><strong>${t('vehicles.description')}:</strong> ${damage.description}</p>` : ''}
                 ${damage.estimated_cost ? `<p><strong>${t('vehicles.price')}:</strong> ${formatPrice(damage.estimated_cost)}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="section">
          <h2 class="section-title">${t('vehicles.vehicleState')}</h2>
          <p class="no-equipment">${t('vehicles.noDamagesReported')}</p>
        </div>
      `;

      // Comprehensive vehicle information for right column
      const vehicleInfoSection = `
        <div class="section">
          <h2 class="section-title">Información del Vehículo</h2>
          
          <div class="info-subsection">
            <h4>Identificación del Vehículo</h4>
            <div class="info-content">
              ${vehicle.vin ? `<p><strong>VIN:</strong> ${vehicle.vin}</p>` : ''}
              ${vehicle.licensePlate ? `<p><strong>Matrícula:</strong> ${vehicle.licensePlate}</p>` : ''}
              ${vehicle.registrationDate ? `<p><strong>Fecha de Registro:</strong> ${new Date(vehicle.registrationDate).toLocaleDateString('es-ES')}</p>` : ''}
              ${vehicle.vehicleType ? `<p><strong>Tipo de Vehículo:</strong> ${vehicle.vehicleType}</p>` : ''}
              ${vehicle.transactionType ? `<p><strong>Tipo de Transacción:</strong> ${vehicle.transactionType}</p>` : ''}
              ${vehicle.acceptsExchange ? `<p><strong>Acepta Intercambios:</strong> ${vehicle.acceptsExchange ? 'Sí' : 'No'}</p>` : ''}
            </div>
          </div>

          <div class="info-subsection">
            <h4>Detalles Técnicos</h4>
            <div class="info-content">
              ${vehicle.enginePower ? `<p><strong>Potencia del Motor:</strong> ${vehicle.enginePower} CV</p>` : ''}
              ${vehicle.engineSize ? `<p><strong>Cilindrada:</strong> ${vehicle.engineSize}</p>` : ''}
              <p><strong>Color:</strong> ${vehicle.color || 'No especificado'}</p>
              ${vehicle.doors ? `<p><strong>Puertas:</strong> ${vehicle.doors}</p>` : ''}
              <p><strong>Combustible:</strong> ${vehicle.fuel}</p>
              <p><strong>Transmisión:</strong> ${vehicle.transmission}</p>
              <p><strong>Kilometraje:</strong> ${vehicle.mileage?.toLocaleString()} km</p>
              ${vehicle.co2Emissions ? `<p><strong>Emisiones CO2:</strong> ${vehicle.co2Emissions} g/km</p>` : ''}
              ${vehicle.euroStandard ? `<p><strong>Norma Euro:</strong> ${vehicle.euroStandard}</p>` : ''}
            </div>
          </div>

          <div class="info-subsection">
            <h4>Información Adicional</h4>
            <div class="info-content">
              <p><strong>Estado del Vehículo:</strong> ${vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'sold' ? 'Vendido' : vehicle.status === 'reserved' ? 'Reservado' : vehicle.status}</p>
              ${vehicle.ivaStatus ? `<p><strong>Estado IVA:</strong> ${vehicle.ivaStatus}</p>` : ''}
              ${vehicle.publicSalePrice ? `<p><strong>Precio Venta Pública:</strong> ${formatPrice(vehicle.publicSalePrice)}</p>` : ''}
              ${vehicle.commissionSale ? `<p><strong>Venta en Comisión:</strong> Sí</p>` : ''}
              ${vehicle.commissionAmount ? `<p><strong>Comisión:</strong> ${formatPrice(vehicle.commissionAmount)}</p>` : ''}
            </div>
          </div>

          ${vehicleInformation?.technical_specifications ? `
            <div class="info-subsection">
              <h4>Especificaciones Técnicas Adicionales</h4>
              <div class="info-content">${vehicleInformation.technical_specifications}</div>
            </div>
          ` : ''}
          
          ${vehicleInformation?.maintenance_history ? `
            <div class="info-subsection">
              <h4>Historial de Mantenimiento</h4>
              <div class="info-content">${vehicleInformation.maintenance_history}</div>
            </div>
          ` : ''}
          
          ${vehicleInformation?.additional_notes ? `
            <div class="info-subsection">
              <h4>Notas Adicionales</h4>
              <div class="info-content">${vehicleInformation.additional_notes}</div>
            </div>
          ` : ''}
        </div>
      `;

      const vehicleData = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Ficha Técnica - ${vehicle.brand} ${vehicle.model}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #1e293b;
              background: #ffffff;
              padding: 30px;
              font-size: 14px;
            }
            
            .header {
              display: grid;
              grid-template-columns: 2fr auto 1fr;
              align-items: center;
              gap: 30px;
              border-bottom: 3px solid #f97316;
              padding-bottom: 25px;
              margin-bottom: 30px;
            }
            
            .header-left {
              /* Vehicle info section */
            }
            
            .header-center {
              display: flex;
              justify-content: center;
            }
            
            .header-right {
              display: flex;
              justify-content: flex-end;
            }
            
            .kontact-logo {
              width: 180px;
              height: auto;
            }
            
            .vehicle-image {
              width: 200px;
              height: 150px;
              object-fit: cover;
              border-radius: 12px;
              border: 3px solid #f97316;
            }
            
            .title {
              font-size: 32px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 8px;
            }
            
            .subtitle {
              font-size: 18px;
              color: #64748b;
              font-weight: 400;
            }
            
            .price-section {
              background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
              color: white;
              padding: 25px;
              border-radius: 15px;
              margin: 25px 0;
              text-align: center;
            }
            
            .price {
              font-size: 36px;
              font-weight: 700;
              margin-bottom: 5px;
            }
            
            .price-label {
              font-size: 16px;
              opacity: 0.9;
            }
            
            .section {
              margin-bottom: 30px;
              break-inside: avoid;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 18px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e2e8f0;
            }
            
            .data-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            
            .data-item {
              display: flex;
              justify-content: space-between;
              padding: 15px 18px;
              background: #f8fafc;
              border-radius: 10px;
              border-left: 4px solid #f97316;
            }
            
            .data-label {
              font-weight: 500;
              color: #475569;
            }
            
            .data-value {
              font-weight: 600;
              color: #0f172a;
              text-align: right;
            }
            
            .description {
              background: #f8fafc;
              padding: 25px;
              border-radius: 10px;
              border-left: 4px solid #f97316;
              font-style: italic;
              color: #475569;
            }
            
            .content-columns {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 30px;
            }
            
            .equipment-list {
              /* Equipment flat list container */
            }
            
            .no-equipment {
              color: #64748b;
              font-style: italic;
              padding: 20px;
              text-align: center;
              background: #f8fafc;
              border-radius: 8px;
            }
            
            .equipment-item {
              padding: 6px 0;
              font-size: 13px;
              color: #475569;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .equipment-item:last-child {
              border-bottom: none;
            }
            
            .damage-item {
              margin-bottom: 20px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 10px;
              border-left: 4px solid #64748b;
            }
            
            .damage-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            
            .damage-title {
              font-size: 16px;
              font-weight: 600;
              color: #0f172a;
            }
            
            .damage-severity {
              padding: 4px 12px;
              border-radius: 20px;
              color: white;
              font-size: 12px;
              font-weight: 500;
            }
            
            .damage-details p {
              margin-bottom: 8px;
              font-size: 14px;
              color: #475569;
            }
            
            .info-subsection {
              margin-bottom: 20px;
              padding: 15px;
              background: #f1f5f9;
              border-radius: 8px;
            }
            
            .info-subsection h4 {
              font-size: 14px;
              font-weight: 600;
              color: #f97316;
              margin-bottom: 10px;
            }
            
            .info-content {
              font-size: 13px;
              color: #475569;
              line-height: 1.5;
            }
            
            .footer {
              margin-top: 50px;
              padding-top: 25px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #64748b;
              font-size: 12px;
            }
            
            @media print {
              body { padding: 15px; font-size: 12px; }
              .no-print { display: none; }
              .section { break-inside: avoid; }
              .damage-item { break-inside: avoid; }
              .equipment-category { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-left">
              <h1 class="title">${vehicle.brand} ${vehicle.model}</h1>
              <p class="subtitle">${t('vehicles.technicalDataSheet')}</p>
            </div>
            <div class="header-center">
              <img src="/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png" alt="KONTACT VO Logo" class="kontact-logo" />
            </div>
            <div class="header-right">
              ${primaryImage ? `<img src="${primaryImage.image_url}" alt="${vehicle.brand} ${vehicle.model}" class="vehicle-image" />` : ''}
            </div>
          </div>
          
          <div class="price-section">
            <div class="price">${formatPrice(vehicle.price)}</div>
            <div class="price-label">${t('vehicles.salePrice')}</div>
          </div>
          
          <div class="section">
            <h2 class="section-title">${t('vehicles.generalInformation')}</h2>
            <div class="data-grid">
              <div class="data-item">
                <span class="data-label">${t('vehicles.brand')}:</span>
                <span class="data-value">${vehicle.brand}</span>
              </div>
              <div class="data-item">
                <span class="data-label">${t('vehicles.model')}:</span>
                <span class="data-value">${vehicle.model}</span>
              </div>
              <div class="data-item">
                <span class="data-label">${t('vehicles.year')}:</span>
                <span class="data-value">${vehicle.year}</span>
              </div>
              <div class="data-item">
                <span class="data-label">${t('vehicles.mileage')}:</span>
                <span class="data-value">${vehicle.mileage?.toLocaleString()} ${t('vehicles.km')}</span>
              </div>
              <div class="data-item">
                <span class="data-label">${t('vehicles.fuel')}:</span>
                <span class="data-value">${vehicle.fuel}</span>
              </div>
              <div class="data-item">
                <span class="data-label">${t('vehicles.transmission')}:</span>
                <span class="data-value">${vehicle.transmission}</span>
              </div>
              <div class="data-item">
                <span class="data-label">${t('vehicles.color')}:</span>
                <span class="data-value">${vehicle.color || t('vehicles.notSpecified')}</span>
              </div>
              <div class="data-item">
                <span class="data-label">${t('vehicles.location')}:</span>
                <span class="data-value">${vehicle.location}</span>
              </div>
              ${vehicle.vin ? `
              <div class="data-item">
                <span class="data-label">${t('vehicles.vin')}:</span>
                <span class="data-value">${vehicle.vin}</span>
              </div>
              ` : ''}
              ${vehicle.licensePlate ? `
              <div class="data-item">
                <span class="data-label">${t('vehicles.licensePlate')}:</span>
                <span class="data-value">${vehicle.licensePlate}</span>
              </div>
              ` : ''}
              ${vehicle.doors ? `
              <div class="data-item">
                <span class="data-label">${t('vehicles.doors')}:</span>
                <span class="data-value">${vehicle.doors}</span>
              </div>
              ` : ''}
              ${vehicle.enginePower ? `
              <div class="data-item">
                <span class="data-label">${t('vehicles.enginePower')}:</span>
                <span class="data-value">${vehicle.enginePower} ${t('vehicles.hp')}</span>
              </div>
              ` : ''}
              ${vehicle.engineSize ? `
              <div class="data-item">
                <span class="data-label">${t('vehicles.engineSize')}:</span>
                <span class="data-value">${vehicle.engineSize}</span>
              </div>
              ` : ''}
              ${vehicle.co2Emissions ? `
              <div class="data-item">
                <span class="data-label">${t('vehicles.co2Emissions')}:</span>
                <span class="data-value">${vehicle.co2Emissions} g/km</span>
              </div>
              ` : ''}
            </div>
          </div>
          
          ${vehicle.description ? `
          <div class="section">
            <h2 class="section-title">${t('vehicles.description')}</h2>
            <div class="description">
              ${vehicle.description}
            </div>
          </div>
          ` : ''}
          
          <div class="content-columns">
            <div class="column-left">
              <div class="section">
                <h2 class="section-title">${t('vehicles.equipment')}</h2>
                ${equipmentList}
              </div>
            </div>
            <div class="column-right">
              ${vehicleInfoSection}
            </div>
          </div>
          
          ${vehicleStatusSection}
          
          <div class="footer">
            <p><strong>KONTACT VO</strong> - Marketplace Automotriz Profesional</p>
            <p>Documento generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}</p>
            <p>Para más información y contacto directo con el vendedor, visite nuestra plataforma</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(vehicleData);
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
      }, 250);

      toast.success(t('vehicles.datasheetSuccess'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t('vehicles.datasheetError'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-brand-orange" />
          Ficha Técnica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {t('vehicles.datasheetDescription')}
        </p>
        <Button 
          onClick={handleDownloadPDF}
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2"
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          {isLoading ? t('common.loading', { fallback: 'Cargando datos...' }) : t('vehicles.downloadDatasheet')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleDataSheet;