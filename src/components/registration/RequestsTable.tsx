
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { RegistrationRequest } from '@/hooks/useRegistrationRequests';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RequestsTableProps {
  requests: RegistrationRequest[] | undefined;
  activeTab: string;
  onOpenDetails: (request: RegistrationRequest) => void;
  onChangeTab: (tab: string) => void;
}

export const RequestsTable = ({
  requests,
  activeTab,
  onOpenDetails,
  onChangeTab
}: RequestsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tipo de Negocio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.company_name}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.business_type}</TableCell>
                <TableCell>
                  {format(new Date(request.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <Badge className={`
                    ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                      request.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                      'bg-red-100 text-red-800 hover:bg-red-100'}
                  `}>
                    {request.status === 'pending' ? 'Pendiente' :
                    request.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenDetails(request)}
                  >
                    Ver detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-muted-foreground">No hay solicitudes de registro {activeTab !== 'all' ? `con estado "${activeTab}"` : ''}</p>
                  {activeTab !== 'all' && (
                    <Button variant="outline" size="sm" onClick={() => onChangeTab('all')}>
                      Ver todas las solicitudes
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
