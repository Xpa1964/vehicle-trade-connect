import React, { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { ValidationError } from '@/utils/xlsxParser';
import { getSuggestion, validateCorrectedValue, getLocalizedOptions } from '@/utils/vehicleValidationSuggestions';
import { hasMultilingualDictionary, getLocalizedLabel } from '@/utils/xlsxMultilingualDictionary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle2, Lightbulb, ArrowUpDown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export interface CorrectionEntry {
  row: number;
  field: string;
  correctedValue: any;
}

interface EditableErrorTableProps {
  errors: ValidationError[];
  onErrorsUpdate: (updatedErrors: ValidationError[]) => void;
  /** Called with correction entries that should be applied to actual vehicle data */
  onApplyToVehicles?: (corrections: CorrectionEntry[]) => void;
}

interface ErrorRow extends ValidationError {
  id: string;
  excluded: boolean;
  correctedValue?: any;
  isCorrected?: boolean;
}

export const EditableErrorTable: React.FC<EditableErrorTableProps> = ({ errors, onErrorsUpdate, onApplyToVehicles }) => {
  const { t, currentLanguage } = useLanguage();
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const [errorRows, setErrorRows] = useState<ErrorRow[]>(() =>
    errors.map((error, index) => ({
      ...error,
      id: `${error.row}-${error.field}-${index}`,
      excluded: false,
      correctedValue: error.value,
      isCorrected: false,
    }))
  );

  const handleValueChange = useCallback((rowId: string, newValue: any) => {
    setErrorRows(prev =>
      prev.map(row => {
        if (row.id === rowId) {
          const validation = validateCorrectedValue(row.field, newValue);
          return {
            ...row,
            correctedValue: newValue,
            isCorrected: validation.valid,
            error: validation.valid 
              ? t('vehicles.corrected', { fallback: '✓ Corregido' }) 
              : validation.error || row.error,
            severity: validation.valid ? 'warning' : 'error' as 'error' | 'warning',
          };
        }
        return row;
      })
    );
  }, [t]);

  const handleApplySuggestion = useCallback((rowId: string) => {
    setErrorRows(prev =>
      prev.map(row => {
        if (row.id === rowId) {
          const suggestion = getSuggestion(row.field, row.value, row.error);
          if (suggestion) {
            const validation = validateCorrectedValue(row.field, suggestion);
            return {
              ...row,
              correctedValue: suggestion,
              isCorrected: validation.valid,
              error: validation.valid 
                ? t('vehicles.corrected', { fallback: '✓ Corregido' }) 
                : validation.error || row.error,
              severity: validation.valid ? 'warning' : 'error' as 'error' | 'warning',
            };
          }
        }
        return row;
      })
    );
  }, [t]);

  const handleToggleExclude = useCallback((rowId: string) => {
    setErrorRows(prev =>
      prev.map(row => (row.id === rowId ? { ...row, excluded: !row.excluded } : row))
    );
  }, []);

  const handleApplyAllSuggestions = useCallback(() => {
    setErrorRows(prev =>
      prev.map(row => {
        if (row.excluded || row.isCorrected) return row;
        
        const suggestion = getSuggestion(row.field, row.value, row.error);
        if (suggestion) {
          const validation = validateCorrectedValue(row.field, suggestion);
          return {
            ...row,
            correctedValue: suggestion,
            isCorrected: validation.valid,
            error: validation.valid 
              ? t('vehicles.corrected', { fallback: '✓ Corregido' }) 
              : validation.error || row.error,
            severity: validation.valid ? 'warning' : 'error' as 'error' | 'warning',
          };
        }
        return row;
      })
    );
  }, [t]);

  const columns = useMemo<ColumnDef<ErrorRow>[]>(
    () => [
      {
        id: 'exclude',
        header: '',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.excluded}
            onCheckedChange={() => handleToggleExclude(row.original.id)}
            aria-label={t('vehicles.excludeRow', { fallback: 'Excluir fila' })}
          />
        ),
        size: 40,
      },
      {
        accessorKey: 'row',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('vehicles.row', { fallback: 'Fila' })}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">#{row.original.row}</div>,
        size: 70,
      },
      {
        accessorKey: 'field',
        header: t('vehicles.field', { fallback: 'Campo' }),
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.field}
          </Badge>
        ),
        size: 120,
      },
      {
        accessorKey: 'value',
        header: t('vehicles.originalValue', { fallback: 'Valor Original' }),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground italic">
            {row.original.value || <span className="text-destructive">(vacío)</span>}
          </span>
        ),
        size: 150,
      },
      {
        id: 'correctedValue',
        header: t('vehicles.correctedValue', { fallback: 'Valor Corregido' }),
        cell: ({ row }) => {
          const localizedOptions = getLocalizedOptions(row.original.field, currentLanguage);
          
          if (row.original.excluded) {
            return <span className="text-muted-foreground">(excluido)</span>;
          }

          if (localizedOptions.length > 0) {
            // For multilingual fields, show localized label but store DB value
            const currentLabel = hasMultilingualDictionary(row.original.field) 
              ? getLocalizedLabel(row.original.field, row.original.correctedValue?.toString() || '', currentLanguage)
              : row.original.correctedValue?.toString() || '';
            
            return (
              <Select
                value={row.original.correctedValue?.toString() || ''}
                onValueChange={(value) => handleValueChange(row.original.id, value)}
              >
                <SelectTrigger className={cn("h-8", row.original.isCorrected && "border-green-500/50 bg-green-500/5")}>
                  <SelectValue placeholder={t('common.select', { fallback: 'Seleccionar' })}>
                    {currentLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {localizedOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          return (
            <Input
              type={['year', 'price', 'mileage', 'doors', 'engineSize', 'enginePower', 'co2Emissions'].includes(row.original.field) ? 'number' : 'text'}
              value={row.original.correctedValue?.toString() || ''}
              onChange={(e) => handleValueChange(row.original.id, e.target.value)}
              className={cn("h-8", row.original.isCorrected && "border-green-500/50 bg-green-500/5")}
              placeholder={t('vehicles.enterValue', { fallback: 'Introducir valor' })}
            />
          );
        },
        size: 200,
      },
      {
        accessorKey: 'error',
        header: t('vehicles.status', { fallback: 'Estado' }),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.isCorrected ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : row.original.excluded ? (
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <span className={cn(
              "text-sm",
              row.original.isCorrected && "text-green-600",
              !row.original.isCorrected && !row.original.excluded && "text-destructive"
            )}>
              {row.original.error}
            </span>
          </div>
        ),
        size: 250,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          if (row.original.excluded || row.original.isCorrected) return null;

          const suggestion = getSuggestion(row.original.field, row.original.value, row.original.error);

          return (
            <div className="flex items-center gap-1">
              {suggestion && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApplySuggestion(row.original.id)}
                        className="h-8 px-2"
                      >
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {t('vehicles.suggestion', { fallback: 'Sugerencia' })}: <strong>{suggestion}</strong>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        },
        size: 60,
      },
    ],
    [t, handleValueChange, handleApplySuggestion, handleToggleExclude]
  );

  const table = useReactTable({
    data: errorRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const handleApplyCorrections = useCallback(() => {
    const corrected = errorRows.filter(row => !row.excluded && row.isCorrected);
    
    // Build correction entries for patching vehicle data
    const corrections: CorrectionEntry[] = corrected.map(row => ({
      row: row.row,
      field: row.field,
      correctedValue: row.correctedValue,
    }));

    // Notify parent with corrections to apply to vehicles
    if (onApplyToVehicles) {
      onApplyToVehicles(corrections);
    }

    // Also call legacy callback
    onErrorsUpdate(corrected.map(row => ({ ...row, value: row.correctedValue })));
  }, [errorRows, onErrorsUpdate, onApplyToVehicles]);

  const stats = useMemo(() => {
    const corrected = errorRows.filter(r => r.isCorrected && !r.excluded).length;
    const excluded = errorRows.filter(r => r.excluded).length;
    const pending = errorRows.filter(r => !r.isCorrected && !r.excluded).length;
    return { corrected, excluded, pending, total: errorRows.length };
  }, [errorRows]);

  return (
    <div className="space-y-4">
      {/* Action bar with stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-muted/50 rounded-lg">
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{stats.pending}</Badge>
            <span>{t('vehicles.pendingErrors', { fallback: 'Pendientes' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600 hover:bg-green-700">{stats.corrected}</Badge>
            <span>{t('vehicles.correctedErrors', { fallback: 'Corregidos' })}</span>
          </div>
          {stats.excluded > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.excluded}</Badge>
              <span>{t('vehicles.excludedErrors', { fallback: 'Excluidos' })}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleApplyAllSuggestions}
            variant="outline"
            size="sm"
            disabled={stats.pending === 0}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {t('vehicles.autoFix', { fallback: 'Auto-corregir todo' })}
          </Button>
          <Button
            onClick={handleApplyCorrections}
            size="sm"
            disabled={stats.corrected === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {t('vehicles.applyAndValidate', { fallback: 'Aplicar y Re-validar' })} ({stats.corrected})
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      {stats.total > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t('vehicles.correctionProgress', { fallback: 'Progreso de corrección' })}</span>
            <span>{Math.round(((stats.corrected + stats.excluded) / stats.total) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 transition-all duration-300 rounded-full"
              style={{ width: `${((stats.corrected + stats.excluded) / stats.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50",
                  row.original.excluded && "opacity-40 bg-muted/20",
                  row.original.isCorrected && "bg-green-500/5"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Help text */}
      {stats.pending > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {t('vehicles.editHint', { fallback: 'Edita directamente los valores en la columna "Valor Corregido" o usa el botón 💡 para aplicar sugerencias automáticas.' })}
        </p>
      )}
    </div>
  );
};
