import React, { useState, useMemo } from 'react';
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
import { getSuggestion, validateCorrectedValue, getFieldOptions } from '@/utils/vehicleValidationSuggestions';
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
import { AlertCircle, CheckCircle2, Lightbulb, X, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditableErrorTableProps {
  errors: ValidationError[];
  onErrorsUpdate: (updatedErrors: ValidationError[]) => void;
}

interface ErrorRow extends ValidationError {
  id: string;
  excluded: boolean;
  correctedValue?: any;
  isCorrected?: boolean;
}

export const EditableErrorTable: React.FC<EditableErrorTableProps> = ({ errors, onErrorsUpdate }) => {
  const { t } = useLanguage();
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Convertir errores a filas editables
  const [errorRows, setErrorRows] = useState<ErrorRow[]>(() =>
    errors.map((error, index) => ({
      ...error,
      id: `${error.row}-${error.field}-${index}`,
      excluded: false,
      correctedValue: error.value,
      isCorrected: false,
    }))
  );

  const handleValueChange = (rowId: string, newValue: any) => {
    setErrorRows(prev =>
      prev.map(row => {
        if (row.id === rowId) {
          const validation = validateCorrectedValue(row.field, newValue);
          return {
            ...row,
            correctedValue: newValue,
            isCorrected: validation.valid,
            error: validation.valid ? '✓ Corregido' : validation.error || row.error,
            severity: validation.valid ? 'warning' : 'error' as 'error' | 'warning',
          };
        }
        return row;
      })
    );
  };

  const handleApplySuggestion = (rowId: string) => {
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
              error: validation.valid ? '✓ Corregido' : validation.error || row.error,
              severity: validation.valid ? 'warning' : 'error' as 'error' | 'warning',
            };
          }
        }
        return row;
      })
    );
  };

  const handleToggleExclude = (rowId: string) => {
    setErrorRows(prev =>
      prev.map(row => (row.id === rowId ? { ...row, excluded: !row.excluded } : row))
    );
  };

  const handleApplyAllSuggestions = () => {
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
            error: validation.valid ? '✓ Corregido' : validation.error || row.error,
            severity: validation.valid ? 'warning' : 'error' as 'error' | 'warning',
          };
        }
        return row;
      })
    );
  };

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
          const fieldOptions = getFieldOptions(row.original.field);
          
          if (row.original.excluded) {
            return <span className="text-muted-foreground">(excluido)</span>;
          }

          // Si el campo tiene opciones predefinidas, mostrar select
          if (fieldOptions.length > 0) {
            return (
              <Select
                value={row.original.correctedValue?.toString() || ''}
                onValueChange={(value) => handleValueChange(row.original.id, value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder={t('common.select', { fallback: 'Seleccionar' })} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {fieldOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          // Para campos de texto/número
          return (
            <Input
              type={['year', 'price', 'mileage', 'doors', 'engineSize', 'enginePower', 'co2Emissions'].includes(row.original.field) ? 'number' : 'text'}
              value={row.original.correctedValue?.toString() || ''}
              onChange={(e) => handleValueChange(row.original.id, e.target.value)}
              className="h-8"
              placeholder={t('vehicles.enterValue', { fallback: 'Introducir valor' })}
            />
          );
        },
        size: 200,
      },
      {
        accessorKey: 'error',
        header: t('vehicles.errorDescription', { fallback: 'Descripción del Error' }),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.isCorrected ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <span className={row.original.isCorrected ? 'text-success' : 'text-destructive'}>
              {row.original.error}
            </span>
          </div>
        ),
        size: 250,
      },
      {
        id: 'actions',
        header: t('common.actions', { fallback: 'Acciones' }),
        cell: ({ row }) => {
          if (row.original.excluded || row.original.isCorrected) return null;

          const suggestion = getSuggestion(row.original.field, row.original.value, row.original.error);

          return (
            <div className="flex items-center gap-2">
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
        size: 80,
      },
    ],
    [t]
  );

  const table = useReactTable({
    data: errorRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleApplyCorrections = () => {
    const updatedErrors = errorRows
      .filter(row => !row.excluded && row.isCorrected)
      .map(row => ({
        ...row,
        value: row.correctedValue,
      }));

    onErrorsUpdate(updatedErrors);
  };

  const stats = useMemo(() => {
    const corrected = errorRows.filter(r => r.isCorrected && !r.excluded).length;
    const excluded = errorRows.filter(r => r.excluded).length;
    const pending = errorRows.filter(r => !r.isCorrected && !r.excluded).length;
    return { corrected, excluded, pending };
  }, [errorRows]);

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{stats.pending}</Badge>
            <span>{t('vehicles.pendingErrors', { fallback: 'Pendientes' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-success">{stats.corrected}</Badge>
            <span>{t('vehicles.correctedErrors', { fallback: 'Corregidos' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{stats.excluded}</Badge>
            <span>{t('vehicles.excludedErrors', { fallback: 'Excluidos' })}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleApplyAllSuggestions}
            variant="outline"
            size="sm"
            disabled={stats.pending === 0}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            {t('vehicles.applyAllSuggestions', { fallback: 'Aplicar Todas las Sugerencias' })}
          </Button>
          <Button
            onClick={handleApplyCorrections}
            size="sm"
            disabled={stats.corrected === 0}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {t('vehicles.applyCorrections', { fallback: 'Aplicar Correcciones' })} ({stats.corrected})
          </Button>
        </div>
      </div>

      {/* Tabla */}
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
                className={`border-b transition-colors hover:bg-muted/50 ${
                  row.original.excluded ? 'opacity-50' : ''
                } ${row.original.isCorrected ? 'bg-success/5' : ''}`}
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
    </div>
  );
};
