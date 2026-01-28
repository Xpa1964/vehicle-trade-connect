
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AccessDeniedCard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-red-500">Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No tienes permisos para gestionar roles y permisos.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')} 
            className="mt-4"
          >
            Volver al Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDeniedCard;
