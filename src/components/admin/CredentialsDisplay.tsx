
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff, Check, RefreshCw, User } from 'lucide-react';

interface CredentialsDisplayProps {
  credentials: {
    email: string;
    password: string;
    isExistingUser?: boolean;
  };
  onClose: () => void;
}

const CredentialsDisplay: React.FC<CredentialsDisplayProps> = ({ credentials, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
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
              Contraseña Actualizada
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
                Usuario existente - Se ha generado una nueva contraseña
              </span>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">Credenciales de Acceso:</h4>
          
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {credentials.isExistingUser ? 'Nueva Contraseña:' : 'Contraseña:'}
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                  {showPassword ? credentials.password : '••••••••••••'}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(credentials.password, 'password')}
                  className="shrink-0"
                >
                  {copiedField === 'password' ? (
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
          <p className="text-sm text-blue-800">
            <strong>Importante:</strong> {credentials.isExistingUser 
              ? 'Se ha generado una nueva contraseña para este usuario existente. La nueva contraseña ha sido enviada por email.'
              : 'Estas credenciales han sido enviadas por email al usuario.'
            } Asegúrate de guardarlas de forma segura si es necesario.
          </p>
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
