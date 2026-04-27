import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DateRange = {
  from: string;
  to: string;
  label?: string;
};

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export default function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFrom, setLocalFrom] = useState(value.from);
  const [localTo, setLocalTo] = useState(value.to);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const presets = [
    { label: 'Hoje', days: 0 },
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 15 dias', days: 15 },
    { label: 'Últimos 30 dias', days: 30 },
    { label: 'Este Mês', days: -1 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    const toDate = new Date(); // Could explicitly use '2026-04-17' based on the system date
    const fromDate = new Date();
    
    if (preset.days === -1) {
      fromDate.setDate(1); // First day of current month
    } else if (preset.days === 0) {
      // Today
    } else {
      fromDate.setDate(toDate.getDate() - preset.days + 1);
    }
    
    const fromStr = fromDate.toISOString().split('T')[0];
    const toStr = toDate.toISOString().split('T')[0];
    
    setLocalFrom(fromStr);
    setLocalTo(toStr);
    onChange({ from: fromStr, to: toStr, label: preset.label });
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    onChange({ from: localFrom, to: localTo, label: 'Personalizado' });
    setIsOpen(false);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const displayLabel = value.label || `${formatDate(value.from)} - ${formatDate(value.to)}`;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-[8px] text-[13px] font-medium text-foreground hover:bg-muted/10 transition-colors shadow-sm"
      >
        <CalendarIcon className="w-4 h-4 text-muted" />
        <span>{displayLabel}</span>
        <ChevronDown className="w-4 h-4 ml-1 opacity-50 text-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl z-50 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Períodos Rápidos</h4>
              <div className="grid grid-cols-2 gap-2">
                {presets.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className={cn(
                      "px-3 py-1.5 text-[12px] bg-background border rounded-[6px] transition-colors text-left text-foreground hover:bg-muted/10",
                      value.label === p.label ? "border-[#2563eb] text-[#2563eb]" : "border-border hover:border-[#2563eb] hover:text-[#2563eb]"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Personalizado</h4>
              <div className="flex gap-3 items-center mb-4">
                <div className="flex-1">
                  <label className="text-[11px] text-[#64748b] mb-1 block">Data Inicial</label>
                  <input 
                    type="date" 
                    value={localFrom}
                    onChange={(e) => setLocalFrom(e.target.value)}
                    className="w-full bg-background border border-border rounded-[6px] px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:border-[#2563eb] color-scheme-light"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-[#64748b] mb-1 block">Data Final</label>
                  <input 
                    type="date"
                    value={localTo}
                    onChange={(e) => setLocalTo(e.target.value)}
                    className="w-full bg-background border border-border rounded-[6px] px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:border-[#2563eb] color-scheme-light"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>
              <button 
                onClick={handleCustomApply}
                className="w-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-white font-medium py-[6px] rounded-[6px] text-[13px] transition-colors"
              >
                Aplicar Filtro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
