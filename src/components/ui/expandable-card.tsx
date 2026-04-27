import React from 'react';
import { Card } from '@/components/ui/card';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ExpandableCardProps {
  id: string;
  title: string;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  extraHeader?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ExpandableCard({
  id,
  title,
  expanded,
  setExpanded,
  extraHeader,
  children,
  className,
  contentClassName
}: ExpandableCardProps) {
  const isExpanded = expanded === id;

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-6xl h-[85vh] border-border bg-card flex flex-col p-6 shadow-2xl relative">
          <div className="text-[14px] font-semibold text-muted uppercase tracking-[0.05em] mb-6 flex justify-between items-center">
            <span>{title}</span>
            <div className="flex items-center gap-4">
              {extraHeader}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(null);
                }} 
                className="text-muted hover:text-foreground transition-colors cursor-pointer bg-muted/20 p-1.5 rounded-md" 
                title="Fechar visualização"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-0">
            {children}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className={`border-border bg-card flex flex-col p-[20px] ${className || ''}`}>
      <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.05em] mb-4 flex justify-between items-center">
        <span>{title}</span>
        <div className="flex items-center gap-4">
          {extraHeader}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(id);
            }} 
            className="text-muted hover:text-foreground transition-colors cursor-pointer" 
            title="Expandir visualização"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className={`flex-1 flex flex-col relative w-full ${contentClassName || ''}`}>
        {children}
      </div>
    </Card>
  );
}
