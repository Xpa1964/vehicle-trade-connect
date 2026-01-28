
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface RequestsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  requestCount: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  children: React.ReactNode;
}

export const RequestsTabs = ({
  activeTab,
  onTabChange,
  requestCount,
  children
}: RequestsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="all" className="flex gap-2">
          Todas
          <Badge variant="secondary">{requestCount.all}</Badge>
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex gap-2">
          Pendientes
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{requestCount.pending}</Badge>
        </TabsTrigger>
        <TabsTrigger value="approved" className="flex gap-2">
          Aprobadas
          <Badge variant="secondary" className="bg-green-100 text-green-800">{requestCount.approved}</Badge>
        </TabsTrigger>
        <TabsTrigger value="rejected" className="flex gap-2">
          Rechazadas
          <Badge variant="secondary" className="bg-red-100 text-red-800">{requestCount.rejected}</Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab}>
        {children}
      </TabsContent>
    </Tabs>
  );
};
