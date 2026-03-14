
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Filter, BarChart3, TrendingUp, Users } from 'lucide-react';

interface CampaignEvent {
  id: string;
  session_id: string;
  video_language: string | null;
  campaign: string | null;
  dealer: string | null;
  contact: string | null;
  visitor_country: string | null;
  user_agent?: string | null;
  referrer?: string | null;
  interests?: string[] | null;
  video_started: boolean;
  video_completed: boolean;
  popup_shown: boolean;
  register_clicked: boolean;
  created_at: string;
}

const LANGUAGES = ['es', 'en', 'fr', 'it', 'pt', 'de', 'nl', 'pl', 'dk'];
const DUPLICATE_WINDOW_MS = 15_000;

const AdminCampaigns: React.FC = () => {
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCampaign, setFilterCampaign] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterDealer, setFilterDealer] = useState('');
  const [filterContact, setFilterContact] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('campaign_events' as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setEvents(data as unknown as CampaignEvent[]);
    setLoading(false);
  };

  const deduplicatedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const lastSeenByFingerprint = new Map<string, number>();

    return sorted.filter((event) => {
      const fingerprint = [
        event.campaign || '',
        event.video_language || '',
        event.dealer || '',
        event.contact || '',
        event.user_agent || '',
        event.referrer || '',
      ].join('|').toLowerCase();

      const currentTs = new Date(event.created_at).getTime();
      const lastTs = lastSeenByFingerprint.get(fingerprint);

      if (lastTs && Math.abs(lastTs - currentTs) <= DUPLICATE_WINDOW_MS) {
        return false;
      }

      lastSeenByFingerprint.set(fingerprint, currentTs);
      return true;
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    return deduplicatedEvents.filter(e => {
      if (filterCampaign && !e.campaign?.toLowerCase().includes(filterCampaign.toLowerCase())) return false;
      if (filterLanguage !== 'all' && e.video_language !== filterLanguage) return false;
      if (filterDealer && !e.dealer?.toLowerCase().includes(filterDealer.toLowerCase())) return false;
      if (filterContact && !e.contact?.toLowerCase().includes(filterContact.toLowerCase())) return false;
      if (filterDateFrom && e.created_at < filterDateFrom) return false;
      if (filterDateTo && e.created_at > filterDateTo + 'T23:59:59') return false;
      return true;
    });
  }, [deduplicatedEvents, filterCampaign, filterLanguage, filterDealer, filterContact, filterDateFrom, filterDateTo]);

  // Individual session rows sorted by date (newest first)
  const individualRows = useMemo(() => {
    return filteredEvents.map(e => {
      const interests = e.interests || [];
      const buyPattern = /comprar|buying|acheter|kaufen|køb|kopen|comprare|kupno|compra/i;
      const sellPattern = /vender|selling|vendre|verkaufen|salg|verkopen|vendere|sprzedaż|venta/i;
      return {
        id: e.id,
        contact: e.contact || '-',
        campaign: e.campaign || 'direct',
        language: (e.video_language || 'es').toUpperCase(),
        date: new Date(e.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
        video_started: e.video_started,
        video_completed: e.video_completed,
        popup_shown: e.popup_shown,
        register_clicked: e.register_clicked,
        country: e.visitor_country || '-',
        wantsBuy: interests.some(i => buyPattern.test(i) && !i.includes('/')),
        wantsSell: interests.some(i => sellPattern.test(i) && !i.includes('/')),
        wantsBoth: interests.some(i => i.includes('/')),
      };
    });
  }, [filteredEvents]);

  const byLanguage = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEvents.forEach(e => { const l = e.video_language || 'es'; map[l] = (map[l] || 0) + 1; });
    return Object.entries(map).map(([language, visits]) => ({ language: language.toUpperCase(), visits }));
  }, [filteredEvents]);

  const byCampaign = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEvents.forEach(e => { const c = e.campaign || 'direct'; map[c] = (map[c] || 0) + 1; });
    return Object.entries(map).map(([campaign, visits]) => ({ campaign, visits }));
  }, [filteredEvents]);

  const dailyVisits = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEvents.forEach(e => { const d = e.created_at?.slice(0, 10) || ''; if (d) map[d] = (map[d] || 0) + 1; });
    return Object.entries(map).sort().map(([date, visits]) => ({ date, visits }));
  }, [filteredEvents]);

  const funnelData = useMemo(() => {
    const t = filteredEvents.length;
    return [
      { step: 'Visitas', value: t },
      { step: 'Reproducciones', value: filteredEvents.filter(e => e.video_started).length },
      { step: 'Completas', value: filteredEvents.filter(e => e.video_completed).length },
      { step: 'Popup', value: filteredEvents.filter(e => e.popup_shown).length },
      { step: 'Registro', value: filteredEvents.filter(e => e.register_clicked).length },
    ];
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Campañas</h1>
        <Button onClick={fetchEvents} variant="outline" size="sm">Actualizar</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <Input placeholder="Contacto" value={filterContact} onChange={e => setFilterContact(e.target.value)} />
            <Input placeholder="Campaña" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)} />
            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger><SelectValue placeholder="Idioma" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l.toUpperCase()}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Dealer" value={filterDealer} onChange={e => setFilterDealer(e.target.value)} />
            <Input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
            <Input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Visitas', value: filteredEvents.length },
          { label: 'Reproducciones', value: filteredEvents.filter(e => e.video_started).length },
          { label: 'Completas', value: filteredEvents.filter(e => e.video_completed).length },
          { label: 'Popup', value: filteredEvents.filter(e => e.popup_shown).length },
          { label: 'Registro', value: filteredEvents.filter(e => e.register_clicked).length },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Individual session tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" /> Seguimiento individual ({individualRows.length} sesiones)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Campaña</TableHead>
                    <TableHead>Idioma</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Fecha</TableHead>
                     <TableHead className="text-center">▶ Abre</TableHead>
                     <TableHead className="text-center">✅ Completa</TableHead>
                     <TableHead className="text-center">💬 Popup</TableHead>
                     <TableHead className="text-center">📧 Click</TableHead>
                     <TableHead>Intereses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {individualRows.length === 0 ? (
                    <TableRow>
                     <TableCell colSpan={10} className="text-center text-muted-foreground py-8">Sin datos</TableCell>
                    </TableRow>
                  ) : (
                    individualRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.contact}</TableCell>
                        <TableCell>{row.campaign}</TableCell>
                        <TableCell>{row.language}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{row.date}</TableCell>
                        <TableCell className="text-center">{row.video_started ? '✅' : '❌'}</TableCell>
                        <TableCell className="text-center">{row.video_completed ? '✅' : '❌'}</TableCell>
                        <TableCell className="text-center">{row.popup_shown ? '✅' : '❌'}</TableCell>
                        <TableCell className="text-center">{row.register_clicked ? '✅' : '❌'}</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate" title={row.interests}>{row.interests}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Visitas por idioma</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byLanguage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="language" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Visitas por campaña</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byCampaign}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="campaign" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="visits" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Evolución diaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Embudo de conversión</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="step" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCampaigns;
