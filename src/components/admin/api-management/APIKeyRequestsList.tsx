import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, CheckCircle, XCircle, Search, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAPIKeyRequests } from '@/hooks/useAPIKeyRequests';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import APIKeyRequestDetails from './APIKeyRequestDetails';

const APIKeyRequestsList: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const { requests, isLoading } = useAPIKeyRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const filteredRequests = requests?.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    const profile = request.profiles as any;
    return (
      request.name.toLowerCase().includes(searchLower) ||
      profile?.email?.toLowerCase().includes(searchLower) ||
      profile?.company_name?.toLowerCase().includes(searchLower)
    );
  });

  const pendingRequests = filteredRequests?.filter(r => r.status === 'pending') || [];
  const processedRequests = filteredRequests?.filter(r => r.status !== 'pending') || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">{t('api.status.pending') || 'Pending'}</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">{t('api.status.approved') || 'Approved'}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('api.status.rejected') || 'Rejected'}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('api.requests.title') || 'API Key Requests'}</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('api.requests.search') || 'Search requests...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-orange-600">
                {t('api.requests.pending') || 'Pending Approval'} ({pendingRequests.length})
              </h3>
              <div className="space-y-2">
                {pendingRequests.map((request) => {
                  const profile = request.profiles as any;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {getStatusIcon(request.status)}
                        <div className="flex-1">
                          <div className="font-medium">{request.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {profile?.company_name || profile?.email}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(request.created_at), 'PPp', {
                            locale: currentLanguage === 'es' ? es : enUS
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusBadge(request.status)}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                {t('api.requests.processed') || 'Processed Requests'} ({processedRequests.length})
              </h3>
              <div className="space-y-2">
                {processedRequests.map((request) => {
                  const profile = request.profiles as any;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {getStatusIcon(request.status)}
                        <div className="flex-1">
                          <div className="font-medium">{request.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {profile?.company_name || profile?.email}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(request.created_at), 'PPp', {
                            locale: currentLanguage === 'es' ? es : enUS
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusBadge(request.status)}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredRequests?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm 
                ? (t('api.requests.noResults') || 'No matching requests found') 
                : (t('api.requests.empty') || 'No requests yet')}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRequest && (
        <APIKeyRequestDetails
          request={selectedRequest}
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        />
      )}
    </>
  );
};

export default APIKeyRequestsList;
