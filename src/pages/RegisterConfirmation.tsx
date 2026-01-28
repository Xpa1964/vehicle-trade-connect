
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const RegisterConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 text-[#22C55E] mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Solicitud Recibida
          </CardTitle>
          <CardDescription>
            Gracias por su interés en KONTACT VO
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Hemos recibido su solicitud de registro. Nuestro equipo revisará la información proporcionada y le contactará por email con la resolución.
          </p>
          
          <p className="text-muted-foreground">
            Este proceso puede tardar entre 24-48 horas hábiles.
          </p>
          
          <div className="pt-4">
            <Link to="/">
              <Button variant="outline" className="w-full">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterConfirmation;
