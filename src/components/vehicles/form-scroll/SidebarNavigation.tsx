
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Car, 
  IdCard, 
  CreditCard, 
  Settings, 
  Package, 
  FileText, 
  AlertTriangle, 
  Camera, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  completedSections?: string[];
}

const sections = [
  { id: 'basic', title: 'Detalles Básicos', icon: Car },
  { id: 'identification', title: 'Identificación', icon: IdCard },
  { id: 'transaction', title: 'Transacción', icon: CreditCard },
  { id: 'specs', title: 'Especificaciones', icon: Settings },
  { id: 'equipment', title: 'Equipamiento', icon: Package },
  { id: 'additional', title: 'Info Adicional', icon: FileText },
  { id: 'damages', title: 'Daños', icon: AlertTriangle },
  { id: 'media', title: 'Imágenes', icon: Camera },
  { id: 'published', title: 'Publicación', icon: CheckCircle }
];

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionClick,
  completedSections = []
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    setIsMobileMenuOpen(false);
  };

  const NavigationContent = () => (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
        Formulario de Vehículo
      </h3>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        const isCompleted = completedSections.includes(section.id);
        
        return (
          <Button
            key={section.id}
            data-section-id={section.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-auto py-3 px-3 text-left rounded-lg transition-all duration-200 min-h-[48px] touch-manipulation",
              isActive && "bg-primary/10 text-primary border-l-4 border-primary shadow-sm",
              isCompleted && !isActive && "bg-success/10 text-success hover:bg-success/15",
              !isActive && !isCompleted && "hover:bg-muted/50"
            )}
            onClick={() => handleSectionClick(section.id)}
          >
            <Icon className={cn(
              "h-5 w-5 flex-shrink-0 transition-colors",
              isActive && "text-primary",
              isCompleted && !isActive && "text-success",
              !isActive && !isCompleted && "text-muted-foreground"
            )} />
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm font-medium truncate transition-colors",
                isActive && "text-primary",
                isCompleted && !isActive && "text-success"
              )}>
                {section.title}
              </div>
              {isCompleted && (
                <div className="text-xs text-success mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Completado
                </div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Siempre visible con scroll */}
      <div className="hidden lg:block w-full sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
          <div className="p-6 flex-1">
            <NavigationContent />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Toggle Button - Mejorado con z-index correcto */}
      <div className="lg:hidden sticky top-4 z-30 mx-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto bg-card/95 backdrop-blur-sm shadow-lg border-border/20 hover:bg-card/95 transition-all duration-200 min-h-[48px] touch-manipulation"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2">
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="font-medium">Navegación</span>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {sections.find(s => s.id === activeSection)?.title}
            </span>
          </div>
        </Button>
      </div>

      {/* Mobile Sidebar - Drawer con z-index corregido */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop con z-index más alto para evitar superposiciones */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Sidebar - z-index más alto que el backdrop */}
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-80 sm:w-96 bg-card shadow-2xl z-[70] overflow-y-auto animate-slide-in-right">
            <div className="p-6 pt-8">
              {/* Header del drawer */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/20">
                <h2 className="text-lg font-semibold text-foreground">Navegación</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 p-0 rounded-full hover:bg-muted/50 touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <NavigationContent />
            </div>
          </div>
        </>
      )}
    </>
  );
};
