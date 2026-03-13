
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';

interface CampaignEvent {
  id: string;
  session_id: string;
  video_language: string | null;
  campaign: string | null;
  dealer: string | null;
  visitor_country: string | null;
  video_started: boolean;
  video_completed: boolean;
  popup_shown: boolean;
  register_clicked: boolean;
  created_at: string;
}

const LANGUAGES = ['es', 'en', 'fr', 'it', 'pt', 'de', 'nl', 'pl', 'dk'];

const AdminCampaigns: React.FC = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCampaign, setFilterCampaign] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterDealer, setFilterDealer] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('campaign_events' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEvents(data as unknown as CampaignEvent[]);
    }
    setLoading(false);
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (filterCampaign && !e.campaign?.toLowerCase().includes(filterCampaign.toLowerCase())) return false;
      if (filterLanguage !== 'all' && e.video_language !== filterLanguage) return false;
      if (filterDealer && !e.dealer?.toLowerCase().includes(filterDealer.toLowerCase())) return false;
      if (filterDateFrom && e.created_at < filterDateFrom) return false;
      if (filterDateTo && e.created_at > filterDateTo + 'T23:59:59') return false;
      return true;
    });
  }, [events, filterCampaign, filterLanguage, filterDealer, filterDateFrom, filterDateTo]);

  // Aggregated table data
  const aggregatedData = useMemo(() => {
    const groups: Record<string, {
      campaign: string; language: string; dealer: string;
      visits: number; plays: number; completions: number; popups: number; clicks: number;
    }> = {};

    filteredEvents.forEach(e => {
      const key = `${e.campaign || 'direct'}|${e.video_language || 'es'}|${e.dealer || '-'}`;
      if (!groups[key]) {
        groups[key] = {
          campaign: e.campaign || 'direct',
          language: e.video_language || 'es',
          dealer: e.dealer || '-',
          visits: 0, plays: 0, completions: 0, popups: 0, clicks: 0,
        };
      }
      groups[key].visits++;
      if (e.video_started) groups[key].plays++;
      if (e.video_completed) groups[key].completions++;
      if (e.popup_shown) groups[key].popups++;
      if (e.register_clicked) groups[key].clicks++;
    });

    return Object.values(groups).sort((a, b) => b.visits - a.visits);
  }, [filteredEvents]);

  // Charts data
  const byLanguage = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEvents.forEach(e => {
      const lang = e.video_language || 'es';
      map[lang] = (map[lang] || 0) + 1;
    });
    return Object.entries(map).map(([lang, count]) => ({ language: lang.toUpperCase(), visits: count }));
  }, [filteredEvents]);

  const byCampaign = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEvents.forEach(e => {
      const c = e.campaign || 'direct';
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).map(([campaign, count]) => ({ campaign, visits: count }));
  }, [filteredEvents]);

  const dailyVisits = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEvents.forEach(e => {
      const day = e.created_at?.slice(0, 10) || '';
      if (day) map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).sort().map(([date, count]) => ({ date, visits: count }));
  }, [filteredEvents]);

  const funnelData = useMemo(() => {
    const total = filteredEvents.length;
    const plays = filteredEvents.filter(e => e.video_started).length;
    const completions = filteredEvents.filter(e => e.video_completed).length;
    const popups = filteredEvents.filter(e => e.popup_shown).length;
    const clicks = filteredEvents.filter(e => e.register_clicked).length;
    return [
      { step: 'Visitas', value: total },
      { step: 'Reproducciones', value: plays },
      { step: 'Completas', value: completions },
      { step: 'Popup', value: popups },
      { step: 'Registro', value: clicks },
    ];
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Campañas</h1>
        <Button onClick={fetchEvents} variant="outline" size="sm">
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Campaña"
              value={filterCampaign}
              onChange={e => setFilterCampaign(e.target.value)}
            />
            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {LANGUAGES.map(l => (
                  <SelectItem key={l} value={l}>{l.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Dealer"
              value={filterDealer}
              onChange={e => setFilterDealer(e.target.value)}
            />
            <Input
              type="date"
              value={filterDateFrom}
              onChange={e => setFilterDateFrom(e.target.value)}
              placeholder="Desde"
            />
            <Input
              type="date"
              value={filterDateTo}
              onChange={e => setFilterDateTo(e.target.value)}
              placeholder="Hasta"
            />
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

      {/* Results table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Resultados por campaña
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
                    <TableHead>Campaña</TableHead>
                    <TableHead>Idioma</TableHead>
                    <TableHead>Dealer</TableHead>
                    <TableHead className="text-right">Visitas</TableHead>
                    <TableHead className="text-right">Reproducciones</TableHead>
                    <TableHead className="text-right">Completas</TableHead>
                    <TableHead className="text-right">Popup</TableHead>
                    <TableHead className="text-right">Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Sin datos
                      </TableCell>
                    </TableRow>
                  ) : (
                    aggregatedData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{row.campaign}</TableCell>
                        <TableCell>{row.language.toUpperCase()}</TableCell>
                        <TableCell>{row.dealer}</TableCell>
                        <TableCell className="text-right">{row.visits}</TableCell>
                        <TableCell className="text-right">{row.plays}</TableCell>
                        <TableCell className="text-right">{row.completions}</TableCell>
                        <TableCell className="text-right">{row.popups}</TableCell>
                        <TableCell className="text-right">{row.clicks}</TableCell>
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
          <CardHeader>
            <CardTitle className="text-base">Visitas por idioma</CardTitle>
          </CardHeader>
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
          <CardHeader>
            <CardTitle className="text-base">Visitas por campaña</CardTitle>
          </CardHeader>
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
          <CardHeader>
            <CardTitle className="text-base">Embudo de conversión</CardTitle>
          </CardHeader>
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
