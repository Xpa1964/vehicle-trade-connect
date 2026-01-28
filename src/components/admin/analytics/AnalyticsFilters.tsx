
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date;
  to: Date;
}

interface AnalyticsFiltersProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  selectedMetrics: string;
  onMetricsChange: (metrics: string) => void;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  selectedMetrics,
  onMetricsChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Filter className="h-4 w-4 text-muted-foreground" />
      
      {/* Selector de Rango de Fechas */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                  {format(dateRange.to, "LLL dd, y", { locale: es })}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y", { locale: es })
              )
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onDateRangeChange({ from: range.from, to: range.to });
              }
            }}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>

      {/* Selector de Métricas */}
      <Select value={selectedMetrics} onValueChange={onMetricsChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Seleccionar métricas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las métricas</SelectItem>
          <SelectItem value="users">Solo usuarios</SelectItem>
          <SelectItem value="vehicles">Solo vehículos</SelectItem>
          <SelectItem value="transactions">Solo transacciones</SelectItem>
          <SelectItem value="engagement">Solo engagement</SelectItem>
        </SelectContent>
      </Select>

      {/* Presets de Fecha */}
      <div className="flex gap-1">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDateRangeChange({
            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            to: new Date()
          })}
        >
          7 días
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDateRangeChange({
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            to: new Date()
          })}
        >
          30 días
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDateRangeChange({
            from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            to: new Date()
          })}
        >
          90 días
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
