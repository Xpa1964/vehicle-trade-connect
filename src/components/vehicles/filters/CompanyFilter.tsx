
import React, { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompanyFilterProps {
  company: string;
  setCompany: (company: string) => void;
  vehicles: any[];
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({ 
  company, 
  setCompany, 
  vehicles 
}) => {
  const { t } = useLanguage();
  
  // CORREGIDO: Mejorar el mapeo de empresas para evitar "empresa no especificada"
  const companiesWithCount = useMemo(() => {
    const companyMap = new Map();
    
    vehicles.forEach(vehicle => {
      // CORREGIDO: Lógica mejorada para obtener el nombre de la empresa
      const companyName = vehicle.profiles?.company_name || 
                         vehicle.profiles?.full_name || 
                         'Usuario sin nombre';
      const userId = vehicle.user_id;
      
      console.log('🏢 Company mapping:', {
        userId,
        vehicleId: vehicle.id,
        profiles: vehicle.profiles,
        companyName
      });
      
      if (!companyMap.has(userId)) {
        companyMap.set(userId, {
          name: companyName,
          userId: userId,
          count: 0
        });
      }
      companyMap.get(userId).count++;
    });
    
    const result = Array.from(companyMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    console.log('🏢 Final companies list:', result);
    
    return result;
  }, [vehicles]);

  return (
    <Select value={company} onValueChange={setCompany}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('filters.selectCompany')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('filters.allCompanies')}</SelectItem>
        {companiesWithCount.map((company) => (
          <SelectItem key={company.userId} value={company.userId}>
            <div className="flex justify-between items-center w-full">
              <span className="truncate">{company.name}</span>
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {company.count}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CompanyFilter;
