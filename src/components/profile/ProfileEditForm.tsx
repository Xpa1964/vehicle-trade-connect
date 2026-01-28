

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileEditFormProps {
  profileData: any;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ProfileFormData {
  company_name: string;
  full_name: string;
  contact_phone: string;
  country: string;
  business_type: string;
  trader_type: string;
  address: string;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profileData,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProfileFormData>({
    defaultValues: {
      company_name: profileData?.company_name || '',
      full_name: profileData?.full_name || '',
      contact_phone: profileData?.contact_phone || '',
      country: profileData?.country || '',
      business_type: profileData?.business_type || '',
      trader_type: profileData?.trader_type || '',
      address: profileData?.address || ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', profileData.id);

      if (error) throw error;

      // Refresh user data in AuthContext
      await refreshUser();

      toast({
        title: t('profile.profileUpdated'),
        description: t('profile.profileUpdateSuccess'),
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: t('profile.error'),
        description: t('profile.profileUpdateError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t('profile.editProfile')}
          <Button onClick={onCancel} variant="outline" size="sm">
            <X className="h-4 w-4 mr-2" />
            {t('profile.cancel')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">{t('profile.companyName')}</Label>
              <Input
                id="company_name"
                {...register('company_name', { required: t('profile.companyNameRequired') })}
              />
              {errors.company_name && (
                <p className="text-sm text-red-600">{errors.company_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">{t('profile.contactName')}</Label>
              <Input
                id="full_name"
                {...register('full_name', { required: t('profile.contactNameRequired') })}
              />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">{t('profile.phone')}</Label>
              <Input
                id="contact_phone"
                type="tel"
                {...register('contact_phone')}
                placeholder={t('profile.onlyVisibleToYou')}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">{t('profile.fieldRestricted')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">{t('profile.country')}</Label>
              <Input
                id="country"
                {...register('country')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type">{t('profile.businessType')}</Label>
              <Select onValueChange={(value) => setValue('business_type', value)} defaultValue={profileData?.business_type}>
                <SelectTrigger>
                  <SelectValue placeholder={t('profile.selectBusinessType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dealer">{t('businessType.dealer')}</SelectItem>
                  <SelectItem value="multibrand_used">{t('businessType.multibrand_used')}</SelectItem>
                  <SelectItem value="buy_sell">{t('businessType.buy_sell')}</SelectItem>
                  <SelectItem value="rent_a_car">{t('businessType.rent_a_car')}</SelectItem>
                  <SelectItem value="renting">{t('businessType.renting')}</SelectItem>
                  <SelectItem value="workshop">{t('businessType.workshop')}</SelectItem>
                  <SelectItem value="importer">{t('businessType.importer')}</SelectItem>
                  <SelectItem value="exporter">{t('businessType.exporter')}</SelectItem>
                  <SelectItem value="trader">{t('businessType.trader')}</SelectItem>
                  <SelectItem value="other">{t('businessType.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trader_type">{t('profile.traderType')}</Label>
              <Select onValueChange={(value) => setValue('trader_type', value)} defaultValue={profileData?.trader_type}>
                <SelectTrigger>
                  <SelectValue placeholder={t('profile.selectTraderType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">{t('auth.register.buyer')}</SelectItem>
                  <SelectItem value="seller">{t('auth.register.seller')}</SelectItem>
                  <SelectItem value="trader">{t('auth.register.trader')}</SelectItem>
                  <SelectItem value="buyer_seller">{t('auth.register.buyerSeller')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('profile.address')}</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder={t('profile.completeAddress')}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">{t('profile.fieldRestricted')}</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('profile.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? t('profile.saving') : t('profile.saveChanges')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
