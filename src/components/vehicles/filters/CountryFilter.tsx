
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface Country {
  code: string;
  name: string;
}

interface CountryFilterProps {
  country: string;
  setCountry: (country: string) => void;
  countries: Country[];
}

const CountryFilter: React.FC<CountryFilterProps> = ({ country, setCountry, countries }) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1 block">{t('filters.country')}</label>
      <Select value={country} onValueChange={setCountry}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder={t('filters.selectCountry')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filters.allCountries')}</SelectItem>
          {countries.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountryFilter;
