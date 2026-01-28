import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: any;
}

const ImageDiagnostic: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Bucket Access
    try {
      addResult({ test: 'Bucket Access', status: 'loading', message: 'Verificando acceso al bucket...' });
      
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('vehicles');
      
      if (bucketError) {
        addResult({ 
          test: 'Bucket Access', 
          status: 'error', 
          message: `Error al acceder al bucket: ${bucketError.message}`,
          details: bucketError 
        });
      } else {
        addResult({ 
          test: 'Bucket Access', 
          status: 'success', 
          message: `Bucket accesible. Público: ${bucketData?.public}`,
          details: bucketData 
        });
      }
    } catch (error) {
      addResult({ 
        test: 'Bucket Access', 
        status: 'error', 
        message: `Error inesperado: ${error}` 
      });
    }

    // Test 2: List Files
    try {
      addResult({ test: 'List Files', status: 'loading', message: 'Listando archivos en el bucket...' });
      
      const { data: files, error: listError } = await supabase.storage
        .from('vehicles')
        .list('', { limit: 5 });
      
      if (listError) {
        addResult({ 
          test: 'List Files', 
          status: 'error', 
          message: `Error al listar archivos: ${listError.message}`,
          details: listError 
        });
      } else {
        addResult({ 
          test: 'List Files', 
          status: 'success', 
          message: `${files?.length || 0} archivos encontrados`,
          details: files 
        });
      }
    } catch (error) {
      addResult({ 
        test: 'List Files', 
        status: 'error', 
        message: `Error inesperado: ${error}` 
      });
    }

    // Test 3: Database Vehicle Images
    try {
      addResult({ test: 'Database Images', status: 'loading', message: 'Verificando imágenes en la base de datos...' });
      
      const { data: dbImages, error: dbError } = await supabase
        .from('vehicle_images')
        .select('id, vehicle_id, image_url, is_primary')
        .limit(5);
      
      if (dbError) {
        addResult({ 
          test: 'Database Images', 
          status: 'error', 
          message: `Error al obtener imágenes de la BD: ${dbError.message}`,
          details: dbError 
        });
      } else {
        addResult({ 
          test: 'Database Images', 
          status: 'success', 
          message: `${dbImages?.length || 0} registros de imágenes en la BD`,
          details: dbImages 
        });
      }
    } catch (error) {
      addResult({ 
        test: 'Database Images', 
        status: 'error', 
        message: `Error inesperado: ${error}` 
      });
    }

    // Test 4: Public URL Generation
    try {
      addResult({ test: 'URL Generation', status: 'loading', message: 'Probando generación de URLs públicas...' });
      
      const testPath = 'test-image.jpg';
      const { data: urlData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(testPath);
      
      addResult({ 
        test: 'URL Generation', 
        status: 'success', 
        message: `URL generada correctamente`,
        details: { url: urlData.publicUrl, baseUrl: urlData.publicUrl.split('/vehicles/')[0] }
      });
    } catch (error) {
      addResult({ 
        test: 'URL Generation', 
        status: 'error', 
        message: `Error al generar URL: ${error}` 
      });
    }

    // Test 5: Real Image URL Test
    try {
      addResult({ test: 'Real Image Test', status: 'loading', message: 'Probando acceso a imagen real...' });
      
      const { data: realImage } = await supabase
        .from('vehicle_images')
        .select('image_url')
        .limit(1)
        .single();
      
      if (realImage?.image_url) {
        const response = await fetch(realImage.image_url, { method: 'HEAD' });
        
        if (response.ok) {
          addResult({ 
            test: 'Real Image Test', 
            status: 'success', 
            message: `Imagen accesible (${response.status})`,
            details: { 
              url: realImage.image_url, 
              status: response.status,
              headers: Object.fromEntries(response.headers.entries())
            }
          });
        } else {
          addResult({ 
            test: 'Real Image Test', 
            status: 'error', 
            message: `Imagen no accesible (${response.status})`,
            details: { url: realImage.image_url, status: response.status }
          });
        }
      } else {
        addResult({ 
          test: 'Real Image Test', 
          status: 'warning', 
          message: 'No se encontraron imágenes en la BD para probar'
        });
      }
    } catch (error) {
      addResult({ 
        test: 'Real Image Test', 
        status: 'error', 
        message: `Error al probar imagen real: ${error}` 
      });
    }

    // Test 6: CORS Test
    try {
      addResult({ test: 'CORS Test', status: 'loading', message: 'Verificando configuración CORS...' });
      
      const testUrl = supabase.storage.from('vehicles').getPublicUrl('nonexistent.jpg').data.publicUrl;
      
      const corsResponse = await fetch(testUrl, {
        method: 'GET',
        mode: 'cors'
      }).catch(e => ({ error: e }));
      
      if ('error' in corsResponse) {
        const errorMsg = corsResponse.error.toString();
        if (errorMsg.includes('CORS')) {
          addResult({ 
            test: 'CORS Test', 
            status: 'error', 
            message: 'Problema de CORS detectado',
            details: corsResponse.error
          });
        } else {
          addResult({ 
            test: 'CORS Test', 
            status: 'success', 
            message: 'CORS configurado correctamente (archivo no encontrado es normal)'
          });
        }
      } else {
        addResult({ 
          test: 'CORS Test', 
          status: 'success', 
          message: 'CORS configurado correctamente'
        });
      }
    } catch (error) {
      addResult({ 
        test: 'CORS Test', 
        status: 'warning', 
        message: `Test CORS inconcluso: ${error}` 
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'loading': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'loading': return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          Diagnóstico de Imágenes de Vehículos
        </CardTitle>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-fit"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ejecutando...
            </>
          ) : (
            'Ejecutar Diagnóstico'
          )}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <h3 className="font-semibold">{result.test}</h3>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">Ver detalles</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {results.length === 0 && !isRunning && (
          <div className="text-center text-gray-500 py-8">
            Haz clic en "Ejecutar Diagnóstico" para comenzar
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageDiagnostic;