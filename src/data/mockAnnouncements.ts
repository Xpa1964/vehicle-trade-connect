
import { Announcement } from '@/types/announcement';

// Mock announcements data
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Nuevos modelos Toyota disponibles',
    content: 'Acabamos de recibir una nueva remesa de vehículos Toyota desde Japón. Los modelos incluyen Corolla, RAV4 y Camry del año 2025 con especificaciones completas y documentación lista para exportación inmediata. Para más información, contacte a nuestro departamento de ventas.',
    created_at: '2025-04-10T00:00:00Z',
    updated_at: '2025-04-10T00:00:00Z',
    user_id: null,
    status: 'active',
    type: 'offer',
    category: 'vehicles'
  },
  {
    id: 'ann-002',
    title: 'Actualización de tarifas de transporte',
    content: 'Informamos que a partir del próximo mes las tarifas de transporte se actualizarán debido a los cambios en los costos de combustible y regulaciones internacionales. Las nuevas tarifas estarán disponibles en la sección de transporte. Si tiene dudas sobre cómo esto afectará sus pedidos actuales, por favor contacte a nuestro servicio de atención al cliente.',
    created_at: '2025-04-08T00:00:00Z',
    updated_at: '2025-04-08T00:00:00Z',
    user_id: null,
    status: 'active',
    type: 'offer',
    category: 'transport'
  },
  {
    id: 'ann-003',
    title: 'Mantenimiento programado',
    content: 'La plataforma estará en mantenimiento el próximo sábado de 02:00 a 05:00 GMT. Durante este período, algunas funciones pueden no estar disponibles. Recomendamos planificar sus actividades teniendo en cuenta esta ventana de mantenimiento. Gracias por su comprensión.',
    created_at: '2025-04-05T00:00:00Z',
    updated_at: '2025-04-05T00:00:00Z',
    user_id: null,
    status: 'finished',
    type: 'offer',
    category: 'system'
  },
  {
    id: 'ann-004',
    title: 'Busco proveedor de repuestos para Nissan',
    content: 'Estamos buscando proveedores confiables de repuestos originales y alternativos para vehículos Nissan, especialmente modelos recientes (2020-2025). Necesitamos establecer una relación comercial a largo plazo con entregas regulares. Si su empresa puede proporcionar estos productos, por favor contacte con nuestro departamento de compras.',
    created_at: '2025-04-03T00:00:00Z',
    updated_at: '2025-04-03T00:00:00Z',
    user_id: null,
    status: 'active',
    type: 'search',
    category: 'parts'
  }
];

// Get all announcements sorted by date (newest first)
export const getAllAnnouncements = (): Announcement[] => {
  return [...mockAnnouncements].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

// Get only active announcements sorted by date (newest first)
export const getActiveAnnouncements = (): Announcement[] => {
  return mockAnnouncements
    .filter(announcement => announcement.status === 'active')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Get announcement by ID
export const getAnnouncementById = (id: string): Announcement | undefined => {
  return mockAnnouncements.find(announcement => announcement.id === id);
};

// Mock function to add a new announcement
export const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Announcement => {
  const newId = `ann-${String(mockAnnouncements.length + 1).padStart(3, '0')}`;
  const currentDate = new Date().toISOString();
  
  const newAnnouncement: Announcement = {
    id: newId,
    created_at: currentDate,
    updated_at: currentDate,
    ...announcement
  };
  
  mockAnnouncements.unshift(newAnnouncement);
  return newAnnouncement;
};

// Mock function to update announcement
export const updateAnnouncement = (id: string, updates: Partial<Announcement>): Announcement | undefined => {
  const index = mockAnnouncements.findIndex(a => a.id === id);
  if (index === -1) return undefined;
  
  mockAnnouncements[index] = { 
    ...mockAnnouncements[index], 
    ...updates,
    updated_at: new Date().toISOString()
  };
  return mockAnnouncements[index];
};
