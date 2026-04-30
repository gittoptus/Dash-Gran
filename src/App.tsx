/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
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

  return (
    <DashboardProvider>
      <div className="flex min-h-screen w-screen bg-background text-foreground font-sans overflow-hidden">
        <Sidebar activePath={activePath} onNavigate={setActivePath} />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
          
          {/* Global Toolbar Header */}
          <header className="flex-none px-8 py-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/60 backdrop-blur-md z-20 sticky top-0 shadow-sm relative">
            <div>
              <div className="text-[11px] text-[#64748b] mb-1 uppercase tracking-[0.05em] font-semibold">
                Visão Operacional / <span className="text-primary">{activePath}</span>
              </div>
              <h2 className="text-[20px] font-semibold text-foreground tracking-tight">{getTitle()}</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
              <BusinessMetricsFilter />
              <DateRangePicker value={dateRange} onChange={setDateRange} />
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
