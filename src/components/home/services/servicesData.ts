
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

export interface ServiceItem {
  icon: any;
  titleKey: string;
  descriptionKey: string;
  link: string;
  gradient: string;
  backgroundImage?: string;
  badge?: string;
}

export const servicesData: ServiceItem[] = [
  {
    icon: Car,
    titleKey: 'services.vehicleGallery',
    descriptionKey: 'services.vehicleGalleryDesc',
    link: '/vehicle-gallery-info',
    gradient: '',
    backgroundImage: '/images/showroom-gallery.png'
  },
  {
    icon: MessageSquare,
    titleKey: 'services.messaging',
    descriptionKey: 'services.messagingDesc',
    link: '/messaging-info',
    gradient: '',
    backgroundImage: '/images/messaging-chat.png'
  },
  {
    icon: FileText,
    titleKey: 'services.vehicleReports',
    descriptionKey: 'services.vehicleReportsDesc',
    link: '/vehicle-reports-info',
    gradient: '',
    backgroundImage: '/images/vehicle-inspection.png'
  },
  {
    icon: RefreshCw,
    titleKey: 'services.exchanges',
    descriptionKey: 'services.exchangesDesc',
    link: '/exchanges-info',
    gradient: '',
    backgroundImage: '/images/vehicle-exchanges.png'
  },
  {
    icon: Gavel,
    titleKey: 'services.auctions',
    descriptionKey: 'services.auctionsDesc',
    link: '/auctions-info',
    gradient: '',
    backgroundImage: '/images/auctions-hero.png'
  },
  {
    icon: Volume2,
    titleKey: 'services.bulletinBoard',
    descriptionKey: 'services.bulletinBoardDesc',
    link: '/bulletin-info',
    gradient: '',
    backgroundImage: '/images/bulletin-board.png'
  },
  {
    icon: Truck,
    titleKey: 'services.transport',
    descriptionKey: 'services.transportDesc',
    link: '/transport-express',
    gradient: '',
    backgroundImage: '/images/transport-highway.png'
  },
  {
    icon: Calculator,
    titleKey: 'services.importCalculator',
    descriptionKey: 'services.importCalculatorDesc',
    link: '/import-calculator',
    gradient: '',
    backgroundImage: '/images/import-calculator.png'
  },
  {
    icon: BookOpen,
    titleKey: 'services.blog',
    descriptionKey: 'services.blogDesc',
    link: '/blog',
    gradient: '',
    backgroundImage: '/images/blog.png'
  }
];
