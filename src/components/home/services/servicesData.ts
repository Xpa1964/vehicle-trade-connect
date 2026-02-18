
import { 
  Car, 
  Calculator, 
  FileText, 
  RefreshCw, 
  Volume2, 
  Truck, 
  BookOpen,
  MessageSquare,
  Gavel
} from 'lucide-react';
import { getStaticImagePath } from '@/hooks/useStaticImage';

export interface ServiceItem {
  icon: any;
  titleKey: string;
  descriptionKey: string;
  link: string;
  gradient: string;
  backgroundImage?: string;
  badge?: string;
  /** Registry image ID for centralized management */
  registryId?: string;
}

/**
 * Services data with images resolved from STATIC_IMAGE_REGISTRY
 * All backgroundImage paths are now controlled centrally
 */
export const servicesData: ServiceItem[] = [
  {
    icon: Car,
    titleKey: 'services.vehicleGallery',
    descriptionKey: 'services.vehicleGalleryDesc',
    link: '/vehicle-gallery-info',
    gradient: '',
    backgroundImage: getStaticImagePath('services.showroom'),
    registryId: 'services.showroom'
  },
  {
    icon: MessageSquare,
    titleKey: 'services.messaging',
    descriptionKey: 'services.messagingDesc',
    link: '/messaging-info',
    gradient: '',
    backgroundImage: getStaticImagePath('services.messaging'),
    registryId: 'services.messaging'
  },
  {
    icon: RefreshCw,
    titleKey: 'services.exchanges',
    descriptionKey: 'services.exchangesDesc',
    link: '/exchanges-info',
    gradient: '',
    backgroundImage: getStaticImagePath('services.exchanges'),
    registryId: 'services.exchanges'
  },
  {
    icon: Gavel,
    titleKey: 'services.auctions',
    descriptionKey: 'services.auctionsDesc',
    link: '/auctions-info',
    gradient: '',
    backgroundImage: getStaticImagePath('services.auctions'),
    registryId: 'services.auctions'
  },
  {
    icon: Volume2,
    titleKey: 'services.bulletinBoard',
    descriptionKey: 'services.bulletinBoardDesc',
    link: '/bulletin-info',
    gradient: '',
    backgroundImage: getStaticImagePath('services.bulletin'),
    registryId: 'services.bulletin'
  },
  {
    icon: Truck,
    titleKey: 'services.transport',
    descriptionKey: 'services.transportDesc',
    link: '/transport-express',
    gradient: '',
    backgroundImage: getStaticImagePath('services.transport'),
    registryId: 'services.transport'
  },
  {
    icon: Calculator,
    titleKey: 'services.importCalculator',
    descriptionKey: 'services.importCalculatorDesc',
    link: '/import-calculator',
    gradient: '',
    backgroundImage: getStaticImagePath('services.calculator'),
    registryId: 'services.calculator'
  },
  {
    icon: BookOpen,
    titleKey: 'services.blog',
    descriptionKey: 'services.blogDesc',
    link: '/blog',
    gradient: '',
    backgroundImage: getStaticImagePath('services.blog'),
    registryId: 'services.blog'
  }
];
