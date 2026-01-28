import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApproveAPIKeyRequest, useRejectAPIKeyRequest } from '@/hooks/useApproveAPIKeyRequest';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Clock, CheckCircle, XCircle, User, Mail, Building } from 'lucide-react';

interface APIKeyRequestDetailsProps {
  request: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const APIKeyRequestDetails: React.FC<APIKeyRequestDetailsProps> = ({ request, open, onOpenChange }) => {
  const { t, currentLanguage } = useLanguage();
  const approveMutation = useApproveAPIKeyRequest();
  const rejectMutation = useRejectAPIKeyRequest();
  
  const [keyName, setKeyName] = useState(request.name);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const profile = request.profiles as any;
  const reviewer = request.reviewer as any;

  const handleApprove = () => {
    approveMutation.mutate(
      { requestId: request.id, keyName },
      {
        onSuccess: () => {
          onOpenChange(false);
        }
      }
    );
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    
    rejectMutation.mutate(
      { requestId: request.id, reason: rejectionReason },
      {
        onSuccess: () => {
          onOpenChange(false);
        }
      }
    );
  };

  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <DialogTitle>{t('api.requestDetails.title') || 'API Key Request Details'}</DialogTitle>
              <DialogDescription>
                {format(new Date(request.created_at), 'PPp', {
                  locale: currentLanguage === 'es' ? es : enUS
                })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{t('api.requestDetails.user') || 'User'}:</span>
              <span>{profile?.email}</span>
            </div>
            {profile?.company_name && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t('api.requestDetails.company') || 'Company'}:</span>
                <span>{profile.company_name}</span>
              </div>
            )}
          </div>

          {/* Request Details */}
          <div className="space-y-4">
            <div>
              <Label>{t('api.requestDetails.keyName') || 'Requested Key Name'}</Label>
              <Input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                disabled={request.status !== 'pending'}
                className="mt-1.5"
              />
            </div>

            {request.reason && (
              <div>
                <Label>{t('api.requestDetails.reason') || 'Reason'}</Label>
                <div className="mt-1.5 p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                  {request.reason}
                </div>
              </div>
            )}
          </div>

          {/* Status Info */}
          {request.status !== 'pending' && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t('api.requestDetails.status') || 'Status'}:</span>
                <Badge variant={
                  request.status === 'approved' ? 'default' : 'destructive'
                }>
                  {request.status === 'approved' 
                    ? (t('api.status.approved') || 'Approved') 
                    : (t('api.status.rejected') || 'Rejected')}
                </Badge>
              </div>
              {reviewer && (
                <div className="text-sm text-muted-foreground">
                  {t('api.requestDetails.reviewedBy') || 'Reviewed by'}: {reviewer.email}
                </div>
              )}
              {request.reviewed_at && (
                <div className="text-sm text-muted-foreground">
                  {format(new Date(request.reviewed_at), 'PPp', {
                    locale: currentLanguage === 'es' ? es : enUS
                  })}
                </div>
              )}
              {request.rejection_reason && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    {t('api.requestDetails.rejectionReason') || 'Rejection Reason'}:
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">{request.rejection_reason}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="space-y-3">
              {!showRejectForm ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1"
                    disabled={approveMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {t('api.requestDetails.reject') || 'Reject'}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={approveMutation.isPending || !keyName.trim()}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {approveMutation.isPending 
                      ? (t('api.requestDetails.approving') || 'Approving...') 
                      : (t('api.requestDetails.approve') || 'Approve')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="rejectionReason">
                      {t('api.requestDetails.rejectionReasonLabel') || 'Rejection Reason'} <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder={t('api.requestDetails.rejectionReasonPlaceholder') || 'Explain why this request is being rejected...'}
                      rows={3}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionReason('');
                      }}
                      className="flex-1"
                      disabled={rejectMutation.isPending}
                    >
                      {t('common.cancel') || 'Cancel'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={rejectMutation.isPending || !rejectionReason.trim()}
                      className="flex-1"
                    >
                      {rejectMutation.isPending 
                        ? (t('api.requestDetails.rejecting') || 'Rejecting...') 
                        : (t('api.requestDetails.confirmReject') || 'Confirm Rejection')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {request.status !== 'pending' && (
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
              {t('common.close') || 'Close'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyRequestDetails;
