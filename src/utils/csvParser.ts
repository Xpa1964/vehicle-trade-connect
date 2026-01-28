import { VehicleFormData } from '@/types/vehicle';

export interface CSVVehicleData extends Omit<VehicleFormData, 'images'> {
  imageUrls?: string; // URLs separated by semicolons
}

export const parseCSV = (csvText: string): CSVVehicleData[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const vehicles: CSVVehicleData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const vehicle: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim().replace(/"/g, '') || '';
      
      switch (header) {
        case 'year':
        case 'price':
        case 'mileage':
        case 'engineSize':
        case 'enginePower':
        case 'doors':
        case 'co2Emissions':
        case 'commissionAmount':
          vehicle[header] = value ? parseInt(value, 10) : undefined;
          break;
        case 'acceptsExchange':
        case 'cocStatus':
        case 'commissionSale':
          vehicle[header] = value.toLowerCase() === 'true';
          break;
        case 'imageUrls':
          vehicle[header] = value;
          break;
        default:
          if (value) {
            vehicle[header] = value;
          }
          break;
      }
    });

    // Only add if has required fields
    if (vehicle.brand && vehicle.model && vehicle.year && vehicle.price) {
      vehicles.push(vehicle as CSVVehicleData);
    }
  }

  return vehicles;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

export const downloadImageFromUrl = async (url: string): Promise<File | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'image.jpg';
    const extension = filename.split('.').pop() || 'jpg';
    
    // Create a File object from the blob
    return new File([blob], `downloaded_${Date.now()}.${extension}`, { 
      type: blob.type || 'image/jpeg' 
    });
  } catch (error) {
    console.error('Error downloading image from URL:', url, error);
    return null;
  }
};