import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download, FileText, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showProgressToast } from '@/components/ui/progress-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateAuditData, type AuditData } from '@/utils/auditDataGenerator';
import { generatePDF } from '@/utils/pdfGenerator';
import { generateWord } from '@/utils/wordGenerator';
import { AuditReportHeader } from '@/components/admin/audit/AuditReportHeader';
import { SecurityAuditSection } from '@/components/admin/audit/SecurityAuditSection';
import { UXAuditSection } from '@/components/admin/audit/UXAuditSection';
import { QAAuditSection } from '@/components/admin/audit/QAAuditSection';
import { MetricsSection } from '@/components/admin/audit/MetricsSection';
import { RoadmapSection } from '@/components/admin/audit/RoadmapSection';

const AuditReportPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentRole } = useUserRole();
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadAuditData = async () => {
      try {
        setLoading(true);
        const data = await generateAuditData();
        setAuditData(data);
      } catch (error) {
        console.error('Error loading audit data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuditData();
  }, []);

  const handleRefreshAudit = async () => {
    setIsRefreshing(true);
    const toastId = showProgressToast.loading('Actualizando auditoría', 'audit-refresh');
    
    try {
      const freshData = await generateAuditData();
      setAuditData(freshData);
      showProgressToast.success('✅ Auditoría actualizada correctamente', toastId);
    } catch (error) {
      console.error('Error refreshing audit:', error);
      showProgressToast.error('❌ Error al actualizar auditoría', toastId);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!auditData) return;
    setGenerating(true);
    const toastId = showProgressToast.loading('Generando PDF', 'pdf-generation');
    
    try {
      await generatePDF(auditData);
      showProgressToast.success('✅ PDF generado correctamente', toastId);
    } catch (error) {
      showProgressToast.error('❌ Error al generar PDF', toastId);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!auditData) return;
    setGenerating(true);
    const toastId = showProgressToast.loading('Generando documento Word', 'word-generation');
    
    try {
      await generateWord(auditData);
      showProgressToast.success('✅ Documento Word generado correctamente', toastId);
    } catch (error) {
      showProgressToast.error('❌ Error al generar documento Word', toastId);
    } finally {
      setGenerating(false);
    }
  };

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has admin role
  const isAdmin = currentRole === 'admin' || 
                 currentRole === 'content_manager' || 
                 currentRole === 'analyst';
                 
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permiso para acceder al reporte de auditoría.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Generando reporte de auditoría...</span>
        </div>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No se pudo generar el reporte de auditoría. Por favor, intenta nuevamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <Button 
          onClick={handleRefreshAudit} 
          disabled={isRefreshing || generating}
          variant="outline"
          className="gap-2"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Actualizar Auditoría
        </Button>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={generating || isRefreshing}
          className="gap-2"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Descargar PDF
        </Button>
        <Button 
          onClick={handleDownloadWord} 
          disabled={generating || isRefreshing}
          variant="outline"
          className="gap-2"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Descargar Word
        </Button>
      </div>

      {/* Report Content */}
      <div id="audit-report-content">
        <AuditReportHeader data={auditData} />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Completo</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="uiux">UI/UX</TabsTrigger>
            <TabsTrigger value="qa">QA</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 mt-6">
            <SecurityAuditSection data={auditData} />
            <UXAuditSection data={auditData} />
            <QAAuditSection data={auditData} />
            <MetricsSection data={auditData} />
            <RoadmapSection data={auditData} />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SecurityAuditSection data={auditData} />
          </TabsContent>

          <TabsContent value="uiux" className="mt-6">
            <UXAuditSection data={auditData} />
          </TabsContent>

          <TabsContent value="qa" className="mt-6">
            <QAAuditSection data={auditData} />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <MetricsSection data={auditData} />
          </TabsContent>

          <TabsContent value="roadmap" className="mt-6">
            <RoadmapSection data={auditData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuditReportPage;
