
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, List, Info, FileArchive, ShieldX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface VehicleInfoBlocksProps {
  vehicleId: string;
}

const VehicleInfoBlocks: React.FC<VehicleInfoBlocksProps> = ({ vehicleId }) => {
  const { t } = useLanguage();
  
  const blocks = [
    {
      id: 'equipment',
      title: t('vehicles.equipment'),
      description: t('vehicles.equipmentDescription'),
      icon: <ShieldCheck className="w-12 h-12 text-auto-blue" />,
      link: `/vehicle/${vehicleId}/equipment`,
      buttonText: t('vehicles.viewEquipment')
    },
    {
      id: 'details',
      title: t('vehicles.details'),
      description: t('vehicles.detailsDescription'),
      icon: <List className="w-12 h-12 text-auto-blue" />,
      link: `/vehicle/${vehicleId}/details`,
      buttonText: t('vehicles.viewDetails')
    },
    {
      id: 'damages',
      title: t('vehicles.damages'),
      description: t('vehicles.damagesDescription'),
      icon: <ShieldX className="w-12 h-12 text-auto-blue" />,
      link: `/vehicle/${vehicleId}/damages`,
      buttonText: t('vehicles.viewDamages')
    },
    {
      id: 'additional-info',
      title: t('vehicles.additionalInfo'),
      description: t('vehicles.additionalInfoDescription'),
      icon: <Info className="w-12 h-12 text-auto-blue" />,
      link: `/vehicle/${vehicleId}/additional-info`,
      buttonText: t('vehicles.viewAdditionalInfo')
    },
    {
      id: 'files',
      title: t('vehicles.files'),
      description: t('vehicles.filesDescription'),
      icon: <FileArchive className="w-12 h-12 text-auto-blue" />,
      link: `/vehicle/${vehicleId}/files`,
      buttonText: t('vehicles.viewFiles')
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('vehicles.moreInfo')}</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {blocks.map(block => (
          <Link key={block.id} to={block.link} className="no-underline text-inherit flex-1 min-w-[180px] max-w-[240px]">
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  {block.icon}
                  <h3 className="text-xl font-bold">{block.title}</h3>
                </div>
                <img 
                  src="/lovable-uploads/865135a7-9f1d-44e9-9386-623ae7f90529.png" 
                  alt="Kontact Logo" 
                  className="w-20 mb-3"
                />
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {block.description}
                </p>
                <Button variant="outline" className="mt-auto w-full">
                  {block.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VehicleInfoBlocks;
