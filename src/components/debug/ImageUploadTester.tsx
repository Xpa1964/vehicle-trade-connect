
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useChatImageUpload } from '@/hooks/useChatImageUpload';
import { Upload, Image, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ImageUploadTester: React.FC = () => {
  const { isUploading, progress, error, lastUploadedImage, uploadImage, getUploadStats } = useChatImageUpload();
  const [testResults, setTestResults] = useState<Array<{
    timestamp: string;
    success: boolean;
    path?: string;
    error?: string;
  }>>([]);

  const handleTestUpload = async () => {
    try {
      // Crear una imagen de prueba (1x1 pixel PNG transparente)
      const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      const result = await uploadImage(testImageData, `test-image-${Date.now()}.png`);
      
      setTestResults(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        success: result.success,
        path: result.path,
        error: result.error
      }]);
      
    } catch (error) {
      console.error('Error en test:', error);
    }
  };

  const stats = getUploadStats();

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-600" />
          Tester de Subida de Imágenes
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado actual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <span className={`text-sm ${isUploading ? 'text-blue-600' : 'text-green-600'}`}>
              {isUploading ? 'Subiendo...' : 'Listo'}
            </span>
          </div>
          
          {isUploading && (
            <Progress value={progress} className="w-full" />
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          {lastUploadedImage && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              Última imagen: {lastUploadedImage}
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Estadísticas</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total imágenes: {stats.totalImages}</div>
            <div>Último upload: {stats.lastUpload ? new Date(stats.lastUpload).toLocaleString() : 'Nunca'}</div>
          </div>
        </div>

        {/* Botón de test */}
        <Button 
          onClick={handleTestUpload} 
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? 'Subiendo...' : 'Probar Subida de Imagen'}
        </Button>

        {/* Resultados de tests */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Resultados de Tests:</h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className={`text-xs p-2 rounded ${
                  result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {result.success ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    <span>{result.timestamp}</span>
                  </div>
                  {result.success ? (
                    <div>✅ Guardado en: {result.path}</div>
                  ) : (
                    <div>❌ Error: {result.error}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
