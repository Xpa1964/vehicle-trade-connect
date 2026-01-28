
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface BusinessDetailsSectionProps {
  formData: {
    businessType: string;
    traderType: string;
    description: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSelectChange: (value: React.ChangeEvent<HTMLInputElement> | string) => void;
  handleTraderTypeChange: (value: string) => void;
  isSubmitting: boolean;
}

const BusinessDetailsSection: React.FC<BusinessDetailsSectionProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleTraderTypeChange,
  isSubmitting
}) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="businessType">{t('auth.register.businessType')}</Label>
        <Select onValueChange={handleSelectChange} value={formData.businessType || "dealer"}>
          <SelectTrigger>
            <SelectValue placeholder={t('auth.register.selectActivity')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dealer">Concesionario</SelectItem>
            <SelectItem value="multibrand_used">Multimarca VO</SelectItem>
            <SelectItem value="buy_sell">Compraventa</SelectItem>
            <SelectItem value="rent_a_car">Rent a Car</SelectItem>
            <SelectItem value="renting">Renting</SelectItem>
            <SelectItem value="workshop">Taller</SelectItem>
            <SelectItem value="importer">Importador</SelectItem>
            <SelectItem value="exporter">Exportador</SelectItem>
            <SelectItem value="trader">Comerciante</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="traderType">{t('auth.register.traderType')}</Label>
        <Select onValueChange={handleTraderTypeChange} value={formData.traderType || "buyer"}>
          <SelectTrigger>
            <SelectValue placeholder={t('auth.register.selectType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyer">{t('auth.register.buyer')}</SelectItem>
            <SelectItem value="seller">{t('auth.register.seller')}</SelectItem>
            <SelectItem value="trader">{t('auth.register.trader')}</SelectItem>
            <SelectItem value="buyer_seller">{t('auth.register.buyerSeller')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">{t('auth.register.description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required
          placeholder={t('auth.register.briefDescription')}
          className="h-20"
        />
      </div>
    </>
  );
};

export default BusinessDetailsSection;
