import React from 'react';
import ImageDiagnostic from '@/components/debug/ImageDiagnostic';

const ImageDiagnosticPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Diagnóstico de Sistema de Imágenes</h1>
        <p className="text-gray-600">
          Esta herramienta verifica todos los aspectos del sistema de imágenes para identificar problemas.
        </p>
      </div>
      
      <ImageDiagnostic />
    </div>
  );
};

export default ImageDiagnosticPage;