
import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type ConversationsTableProps = {
  canViewLogs: boolean;
  isLoading: boolean;
  conversations: any[] | null;
};

const ConversationsTable: React.FC<ConversationsTableProps> = ({
  canViewLogs,
  isLoading,
  conversations
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-0">
        {canViewLogs ? (
          isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          ) : conversations && conversations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Última actividad</TableHead>
                  <TableHead>Mensajes</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.map((conversation) => (
                  <TableRow key={conversation.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-muted-foreground">
                      {conversation.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      {conversation.source_title || 'Sin título'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {conversation.seller_profile?.company_name || conversation.seller_profile?.full_name || 'Sistema'}
                        </span>
                        {conversation.seller_id && (
                          <span className="text-xs text-muted-foreground">
                            ID: {conversation.seller_id.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {conversation.buyer_profile?.company_name || conversation.buyer_profile?.full_name || 'Usuario'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {conversation.buyer_id.substring(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${conversation.status === 'active' ? 'bg-green-100 text-green-800' : 
                          conversation.status === 'archived' ? 'bg-muted text-muted-foreground' : 
                          'bg-red-100 text-red-800'}`}>
                        {conversation.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(conversation.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(conversation.updated_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {conversation.messages?.[0]?.count || 0}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/conversations/${conversation.id}`)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">No se encontraron conversaciones</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500">No tienes permiso para ver esta información.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationsTable;
