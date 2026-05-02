/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import DashboardFCR from './components/DashboardFCR';
import DashboardCSAT from './components/DashboardCSAT';
import DashboardBot from './components/DashboardBot';
import DashboardTransfer from './components/DashboardTransfer';
import DashboardRetention from './components/DashboardRetention';
import DashboardVolume from './components/DashboardVolume';
import DashboardCustom from './components/DashboardCustom';
import DateRangePicker, { DateRange } from './components/DateRangePicker';
import BusinessMetricsFilter from './components/BusinessMetricsFilter';
import { DashboardProvider } from './contexts/DashboardContext';
import { Bot, ArrowRightLeft, TrendingUp, HeartHandshake, UserCheck, Hash, LayoutDashboard, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function App() {
  const [activePath, setActivePath] = useState('volume');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: '2026-03-18',
    to: '2026-04-17',
    label: 'Últimos 30 dias'
  });

  const getTitle = () => {
    switch (activePath) {
      case 'volume': return 'Volume Operacional';
      case 'fcr': return 'Resolutividade (FCR)';
      case 'csat': return 'Satisfação (CSAT)';
      case 'bot': return 'Resolução no Bot';
      case 'transferencias': return 'Transbordo Estratégico';
      case 'retencao': return 'Engajamento e Retenção';
      case 'custom': return 'Dashboards Personalizados';
      default: return 'Painel Analítico';
    }
  };

  const tabs = [
    { id: 'volume', label: 'Volume', icon: Hash },
    { id: 'fcr', label: 'Resolução (FCR)', icon: TrendingUp },
    { id: 'csat', label: 'Satisfação (CSAT)', icon: HeartHandshake },
    { id: 'bot', label: 'Encerramento Bot', icon: Bot },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft },
    { id: 'retencao', label: 'Engajamento', icon: UserCheck },
    { id: 'custom', label: 'Customizado', icon: LayoutDashboard },
  ];

  return (
    <DashboardProvider>
      <div className="flex min-h-screen w-screen bg-background text-foreground font-sans overflow-hidden">
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
          
          {/* Global Toolbar Header */}
          <header className="flex-none pt-4 border-b border-border flex flex-col gap-4 bg-card/60 backdrop-blur-md z-20 sticky top-0 shadow-sm relative">
            <div className="px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-primary rounded-[4px] flex items-center justify-center shrink-0">
                    <Database className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="font-semibold tracking-tight text-foreground text-[14px]">
                    Toptus
                  </span>
                </div>
                <div className="text-[11px] text-[#64748b] mb-1 uppercase tracking-[0.05em] font-semibold">
                  Visão Operacional / <span className="text-primary">{activePath}</span>
                </div>
                <h2 className="text-[20px] font-semibold text-foreground tracking-tight">{getTitle()}</h2>
              </div>
              
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                <BusinessMetricsFilter />
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="px-8 mt-2 flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePath(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 border-b-2 text-[14px] font-medium transition-colors hover:bg-muted/50",
                    activePath === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-auto p-6 md:p-8">
            <div className="w-full">
              {activePath === 'volume' && <DashboardVolume />}
              {activePath === 'fcr' && <DashboardFCR />}
              {activePath === 'csat' && <DashboardCSAT />}
              {activePath === 'bot' && <DashboardBot />}
              {activePath === 'transferencias' && <DashboardTransfer />}
              {activePath === 'retencao' && <DashboardRetention />}
              {activePath === 'custom' && <DashboardCustom />}
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
