import React from 'react';
import { PhoneOff, Bot, ArrowRightLeft, Settings, LifeBuoy, TrendingUp, HeartHandshake, UserCheck, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar({ activePath = 'fcr', onNavigate }: { activePath?: string, onNavigate?: (path: string) => void }) {
  const menuItems = [
    { id: 'volume', label: 'Volume', icon: Hash },
    { id: 'fcr', label: 'Resolução (FCR)', icon: TrendingUp },
    { id: 'csat', label: 'Satisfação (CSAT)', icon: HeartHandshake },
    { id: 'bot', label: 'Encerramento Bot', icon: Bot },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft },
    { id: 'retencao', label: 'Engajamento', icon: UserCheck },
    { id: 'abandono', label: 'Abandono', icon: PhoneOff },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'help', label: 'Ajuda', icon: LifeBuoy },
  ];

  return (
    <div className="w-64 h-screen bg-[#f8fafc] text-muted flex flex-col border-r border-[#e2e8f0] shrink-0 sticky top-0">
      
      {/* Logo Area */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-[#ffffff] border border-[#e2e8f0] flex items-center justify-center text-muted font-bold text-[18px]">
            📊
          </div>
          <span className="font-semibold text-foreground text-[20px] tracking-tight">Analytics</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-2 space-y-2">
        <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.05em] mb-4 mt-2 px-2">
          Métricas Core
        </div>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors border",
              activePath === item.id 
                ? "bg-[#2563eb] text-white border-transparent" 
                : "bg-transparent text-muted border-transparent hover:bg-[#ffffff] hover:text-foreground hover:border-[#e2e8f0]"
            )}
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors border border-transparent bg-transparent text-muted hover:bg-[#ffffff] hover:text-foreground hover:border-[#e2e8f0]"
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </button>
        ))}
        
        {/* User Profile Mini */}
        <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-[#ffffff] border border-[#e2e8f0] flex items-center justify-center text-[12px] font-bold text-foreground">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[14px] font-medium text-foreground truncate">Admin User</p>
            <p className="text-[12px] text-muted truncate">Operações cx</p>
          </div>
        </div>
      </div>

    </div>
  );
}
