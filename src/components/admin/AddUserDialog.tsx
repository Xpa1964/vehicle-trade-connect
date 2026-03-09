import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

const ROLES: { value: AppRole; label: string }[] = [
  { value: 'user', label: 'Usuario' },
  { value: 'dealer', label: 'Dealer' },
  { value: 'professional', label: 'Profesional' },
  { value: 'individual', label: 'Individual' },
  { value: 'fleet_manager', label: 'Fleet Manager' },
  { value: 'transporter', label: 'Transportista' },
  { value: 'workshop', label: 'Taller' },
  { value: 'analyst', label: 'Analista' },
  { value: 'content_manager', label: 'Content Manager' },
  { value: 'admin', label: 'Administrador' },
];

const BUSINESS_TYPES = [
  { value: 'dealer', label: 'Concesionario' },
  { value: 'multibrand_used', label: 'Multimarca VO' },
  { value: 'buy_sell', label: 'Compraventa' },
  { value: 'rent_a_car', label: 'Rent a Car' },
  { value: 'renting', label: 'Renting' },
  { value: 'workshop', label: 'Taller' },
  { value: 'importer', label: 'Importador' },
  { value: 'exporter', label: 'Exportador' },
  { value: 'trader', label: 'Comerciante' },
  { value: 'other', label: 'Otro' },
];

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, onUserCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    company_name: '',
    contact_phone: '',
    country: '',
    business_type: '',
    role: 'user' as AppRole,
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      email: '',
      password: '',
      full_name: '',
      company_name: '',
      contact_phone: '',
      country: '',
      business_type: '',
      role: 'user',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast({ title: 'Error', description: 'Email y contraseña son obligatorios', variant: 'destructive' });
      return;
    }

    if (form.password.length < 6) {
      toast({ title: 'Error', description: 'La contraseña debe tener al menos 6 caracteres', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-user-admin', {
        body: {
          email: form.email,
          password: form.password,
          userData: { full_name: form.full_name },
          profileData: {
            full_name: form.full_name,
            company_name: form.company_name,
            contact_phone: form.contact_phone,
            country: form.country,
            business_type: form.business_type || null,
          },
          roleData: { role: form.role },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Usuario creado', description: `Se ha creado el usuario ${form.email} correctamente` });
      resetForm();
      onOpenChange(false);
      onUserCreated();
    } catch (err: any) {
      console.error('[AddUserDialog] Error:', err);
      toast({ title: 'Error al crear usuario', description: err.message || 'Error desconocido', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                placeholder="Nombre y apellidos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Empresa</Label>
              <Input
                id="company_name"
                value={form.company_name}
                onChange={(e) => updateField('company_name', e.target.value)}
                placeholder="Nombre de la empresa"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Teléfono</Label>
                <Input
                  id="contact_phone"
                  value={form.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  placeholder="España"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Actividad</Label>
              <Select value={form.business_type} onValueChange={(v) => updateField('business_type', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={form.role} onValueChange={(v) => updateField('role', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creando...</> : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
