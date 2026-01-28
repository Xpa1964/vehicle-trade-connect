
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, ListOrdered, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Escribe tu mensaje aquí...",
  maxLength = 2000,
  className = ''
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);

  const applyFormat = (format: string) => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newCursorPos = start + (selectedText ? 2 : 2);
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        newCursorPos = start + (selectedText ? 1 : 1);
        break;
      case 'list':
        formattedText = selectedText ? `\n• ${selectedText}` : '\n• ';
        newCursorPos = start + (selectedText ? 3 : 3);
        break;
      case 'numbered':
        formattedText = selectedText ? `\n1. ${selectedText}` : '\n1. ';
        newCursorPos = start + (selectedText ? 4 : 4);
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: 'bold', tooltip: 'Negrita (**texto**)' },
    { icon: Italic, action: 'italic', tooltip: 'Cursiva (*texto*)' },
    { icon: List, action: 'list', tooltip: 'Lista con viñetas' },
    { icon: ListOrdered, action: 'numbered', tooltip: 'Lista numerada' }
  ];

  return (
    <div className={cn('space-y-2', className)}>
      {/* Toolbar de formato */}
      <div className="flex items-center gap-1 p-2 border rounded-md bg-gray-50">
        <div className="flex items-center gap-1">
          {formatButtons.map(({ icon: Icon, action, tooltip }) => (
            <Button
              key={action}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => applyFormat(action)}
              className="h-8 w-8 p-0"
              title={tooltip}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Type className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
        </div>
      </div>

      {/* Editor */}
      <Textarea
        id="rich-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={6}
        className="min-h-[150px] resize-y"
      />

      {/* Ayuda de formato */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Formato disponible:</strong> **negrita**, *cursiva*, • listas, 1. numeradas</p>
      </div>
    </div>
  );
};

export default RichTextEditor;
