
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw, User, Mail } from 'lucide-react';
import { useState } from 'react';

interface CredentialsDisplayProps {
  credentials: {
    email: string;
    isExistingUser?: boolean;
    message?: string;
  };
  onClose: () => void;
}

const CredentialsDisplay: React.FC<CredentialsDisplayProps> = ({ credentials, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          {credentials.isExistingUser ? (
            <>
              <RefreshCw className="h-5 w-5" />
              Usuario Re-aprobado
            </>
          ) : (
            <>
              <Check className="h-5 w-5" />
              Usuario Creado Exitosamente
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {credentials.isExistingUser && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-blue-800">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                Usuario existente — datos de perfil actualizados
              </span>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">Cuenta creada:</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                  {credentials.email}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(credentials.email, 'email')}
                  className="shrink-0"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-blue-800 mt-0.5" />
            <p className="text-sm text-blue-800">
              {credentials.isExistingUser 
                ? 'El usuario existente puede acceder con sus credenciales actuales.'
                : 'Se ha enviado un email de confirmación al usuario. Deberá verificar su email y crear su contraseña antes de poder acceder.'
              }
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialsDisplay;
