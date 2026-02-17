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

      // Generate flat equipment list
      const allEquipmentItems = Object.values(equipmentByCategory).flatMap(category => category.items);

      const ivaText = vehicle.ivaStatus === 'included' ? 'IVA incluido' : vehicle.ivaStatus === 'deductible' ? 'IVA deducible' : vehicle.ivaStatus === 'notIncluded' ? 'IVA no incluido' : '';

      const heroImageUrl = primaryImage?.image_url || '';

      const equipmentHtml = allEquipmentItems.length > 0 
        ? `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
            ${allEquipmentItems.map(item => `
              <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;font-size:13px;color:#334155;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                ${item.name}
              </div>
            `).join('')}
          </div>`
        : `<p style="color:#94a3b8;font-style:italic;text-align:center;padding:20px;">${t('vehicles.equipmentNotAvailable')}</p>`;

      const conditionHtml = damages.length > 0 
        ? `<div style="border:2px solid #ef4444;border-radius:12px;padding:24px;background:#fef2f2;">
            <h3 style="font-size:16px;font-weight:600;color:#dc2626;margin-bottom:16px;">⚠️ Daños reportados</h3>
            ${damages.map(d => `
              <div style="padding:12px;background:white;border-radius:8px;margin-bottom:8px;border-left:4px solid ${getSeverityColor(d.severity)};">
                <strong>${d.damage_type || 'Daño'}</strong>
                <span style="float:right;background:${getSeverityColor(d.severity)};color:white;padding:2px 10px;border-radius:12px;font-size:11px;">${getSeverityText(d.severity)}</span>
                ${d.location ? `<p style="margin-top:6px;font-size:13px;color:#64748b;">Ubicación: ${d.location}</p>` : ''}
                ${d.description ? `<p style="font-size:13px;color:#64748b;">${d.description}</p>` : ''}
                ${d.repair_cost ? `<p style="font-size:13px;color:#64748b;">Coste estimado: ${formatPrice(d.repair_cost)}</p>` : ''}
              </div>
            `).join('')}
          </div>`
        : `<div style="border:2px solid #22c55e;border-radius:12px;padding:24px;background:#f0fdf4;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              <h3 style="font-size:16px;font-weight:600;color:#16a34a;">Sin daños reportados</h3>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <span style="background:#dcfce7;color:#166534;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;">✓ Vehículo revisado</span>
              <span style="background:#dbeafe;color:#1e40af;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;">✓ Disponible</span>
            </div>
          </div>`;

      const technicalItems = [
        { label: 'Color', value: vehicle.color || 'No especificado' },
        { label: 'Combustible', value: vehicle.fuel },
        { label: 'Transmisión', value: vehicle.transmission },
        { label: 'Kilometraje', value: `${vehicle.mileage?.toLocaleString()} km` },
        ...(vehicle.vin ? [{ label: 'VIN', value: vehicle.vin }] : []),
        ...(vehicle.enginePower ? [{ label: 'Potencia', value: `${vehicle.enginePower} CV` }] : []),
        ...(vehicle.engineSize ? [{ label: 'Cilindrada', value: `${vehicle.engineSize}` }] : []),
        ...(vehicle.doors ? [{ label: 'Puertas', value: `${vehicle.doors}` }] : []),
        ...(vehicle.co2Emissions ? [{ label: 'Emisiones CO₂', value: `${vehicle.co2Emissions} g/km` }] : []),
        ...(vehicle.euroStandard ? [{ label: 'Norma Euro', value: vehicle.euroStandard.toUpperCase() }] : []),
        { label: 'Acepta intercambios', value: (vehicle.acceptsExchange || vehicle.accepts_exchange) ? 'Sí' : 'No' },
      ];

      const technicalGridHtml = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${technicalItems.map(item => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#f8fafc;border-radius:10px;border-left:4px solid #f97316;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <span style="font-weight:500;color:#64748b;font-size:13px;">${item.label}</span>
            <span style="font-weight:600;color:#0f172a;font-size:13px;">${item.value}</span>
          </div>
        `).join('')}
      </div>`;

      // SVG icons for key info row
      const svgCalendar = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
      const svgGauge = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>';
      const svgFuel = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V5a2 2 0 012-2h8a2 2 0 012 2v17"/><path d="M15 10h2a2 2 0 012 2v2a2 2 0 002 2h0"/><path d="M3 22h12"/><rect x="6" y="9" width="6" height="4" rx="1"/></svg>';
      const svgGear = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>';
      const svgPin = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';

      const vehicleData = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Ficha Técnica - ${vehicle.brand} ${vehicle.model}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family:'Inter',sans-serif; color:#1e293b; background:#fff; }
            @media print {
              body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
              .page-break { page-break-before:always; }
              .no-break { break-inside:avoid; }
            }
          </style>
        </head>
        <body>

          <!-- HERO IMAGE -->
          ${heroImageUrl ? `
          <div style="width:100%;height:320px;overflow:hidden;position:relative;">
            <img src="${heroImageUrl}" alt="${vehicle.brand} ${vehicle.model}" style="width:100%;height:100%;object-fit:cover;" />
            <div style="position:absolute;bottom:0;left:0;right:0;height:120px;background:linear-gradient(transparent,rgba(0,0,0,0.7));"></div>
          </div>
          ` : ''}

          <div style="max-width:800px;margin:0 auto;padding:30px 40px;">

            <!-- TITLE -->
            <div style="margin-bottom:8px;">
              <h1 style="font-size:32px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">${vehicle.brand} ${vehicle.model}</h1>
              <p style="font-size:15px;color:#94a3b8;font-weight:400;">Ficha técnica profesional del vehículo</p>
            </div>

            <!-- PRICE BANNER -->
            <div style="background:linear-gradient(135deg,#f97316,#fb923c);color:white;padding:20px 30px;border-radius:14px;margin:20px 0 30px 0;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:34px;font-weight:800;letter-spacing:-0.5px;">${formatPrice(vehicle.price)}</div>
                <div style="font-size:13px;opacity:0.9;margin-top:2px;">${ivaText}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:12px;opacity:0.8;">Ref. ${vehicle.id.slice(0, 8).toUpperCase()}</div>
              </div>
            </div>

            <!-- KEY INFO ROW -->
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:35px;" class="no-break">
              <div style="background:#f8fafc;border-left:4px solid #f97316;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                <div style="margin-bottom:6px;">${svgCalendar}</div>
                <div style="font-size:11px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Año</div>
                <div style="font-size:16px;font-weight:700;color:#0f172a;">${vehicle.year}</div>
              </div>
              <div style="background:#f8fafc;border-left:4px solid #f97316;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                <div style="margin-bottom:6px;">${svgGauge}</div>
                <div style="font-size:11px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Kilometraje</div>
                <div style="font-size:16px;font-weight:700;color:#0f172a;">${vehicle.mileage?.toLocaleString()} km</div>
              </div>
              <div style="background:#f8fafc;border-left:4px solid #f97316;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                <div style="margin-bottom:6px;">${svgFuel}</div>
                <div style="font-size:11px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Combustible</div>
                <div style="font-size:16px;font-weight:700;color:#0f172a;">${vehicle.fuel}</div>
              </div>
              <div style="background:#f8fafc;border-left:4px solid #f97316;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                <div style="margin-bottom:6px;">${svgGear}</div>
                <div style="font-size:11px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Transmisión</div>
                <div style="font-size:16px;font-weight:700;color:#0f172a;">${vehicle.transmission}</div>
              </div>
              <div style="background:#f8fafc;border-left:4px solid #f97316;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                <div style="margin-bottom:6px;">${svgPin}</div>
                <div style="font-size:11px;color:#94a3b8;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Ubicación</div>
                <div style="font-size:16px;font-weight:700;color:#0f172a;">${vehicle.location}</div>
              </div>
            </div>

            <!-- DESCRIPTION -->
            ${vehicle.description ? `
            <div style="margin-bottom:35px;" class="no-break">
              <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #f1f5f9;">Descripción del vehículo</h2>
              <div style="background:#f8fafc;padding:20px 24px;border-radius:12px;border-left:4px solid #f97316;color:#475569;font-size:14px;line-height:1.7;">
                ${vehicle.description}
              </div>
            </div>
            ` : ''}

            <!-- TECHNICAL DETAILS -->
            <div style="margin-bottom:35px;" class="no-break">
              <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #f1f5f9;">Detalles técnicos</h2>
              ${technicalGridHtml}
            </div>

            <!-- EQUIPMENT -->
            <div style="margin-bottom:35px;" class="no-break">
              <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #f1f5f9;">Equipamiento</h2>
              ${equipmentHtml}
            </div>

            <!-- VEHICLE CONDITION -->
            <div style="margin-bottom:35px;" class="no-break">
              <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #f1f5f9;">Estado del vehículo</h2>
              ${conditionHtml}
            </div>

            <!-- FOOTER -->
            <div style="margin-top:50px;padding-top:30px;border-top:2px solid #f1f5f9;text-align:center;">
              <img src="/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png" alt="Kontact VO" style="height:40px;margin-bottom:12px;" />
              <p style="font-size:14px;font-weight:600;color:#0f172a;">Marketplace Automotriz Profesional</p>
              <p style="font-size:12px;color:#94a3b8;margin-top:6px;">Documento generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
              <a href="${window.location.origin}/vehicles/${vehicle.id}" style="display:inline-block;margin-top:16px;background:linear-gradient(135deg,#f97316,#fb923c);color:white;padding:10px 28px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Ver vehículo en la plataforma</a>
            </div>

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
    <Card className="w-full bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <FileText className="h-4 w-4 text-primary" />
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
          className="w-full flex items-center gap-2 border-border text-foreground hover:bg-primary/10 hover:border-primary/30"
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