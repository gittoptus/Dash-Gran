import React, { useMemo } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
  BarChart, Bar, Cell, ComposedChart, LabelList, AreaChart, Area
} from 'recharts';
import { cn } from '@/lib/utils';
import { Maximize2, AlertTriangle } from 'lucide-react';

// Mock Data
const evolutionData = Array.from({ length: 30 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, '0');
  const baseVolume = 3000;
  // Create a peak around day 5
  const isPeak = i === 4 || i === 5;
  let current = baseVolume + (isPeak ? 2500 : Math.random() * 800 - 400); 
  let previous = baseVolume - 200 + Math.random() * 600 - 300; 
  
  return {
    day,
    Atual: Math.round(current),
    Anterior: Math.round(previous),
    isPeak
  };
});

const channelData = [
  { channel: 'WhatsApp', volume: 99 },
  { channel: 'Chat', volume: 0.7 },
  { channel: 'App', volume: 0.2 },
  { channel: 'Outros', volume: 0.1 },
];

const dayOfWeekData = [
  { day: 'Seg', volume: 21000 },
  { day: 'Ter', volume: 19500 },
  { day: 'Qua', volume: 18000 },
  { day: 'Qui', volume: 17500 },
  { day: 'Sex', volume: 16000 },
  { day: 'Sáb', volume: 8000 },
  { day: 'Dom', volume: 5840 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => {
  const hour = `${i.toString().padStart(2, '0')}:00`;
  let volume = 0;
  if (i >= 10 && i <= 14) volume = 8000 + Math.random() * 2000; // Peak
  else if (i >= 8 && i < 10) volume = 4000 + Math.random() * 2000; // Morning ramp
  else if (i > 14 && i <= 18) volume = 5000 + Math.random() * 1000; // Afternoon
  else volume = 500 + Math.random() * 500; // Night/Dawn
  
  return {
    hour,
    volume: Math.round(volume),
  };
});

// Colors matching Elegant Dark Theme
const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  muted: '#f1f5f9'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    let variationInfo = null;
    const atualEntry = payload.find((p: any) => p.name?.toLowerCase() === 'atual' || p.dataKey === 'atual' || p.dataKey === 'Atual');
    const anteriorEntry = payload.find((p: any) => p.name?.toLowerCase() === 'anterior' || p.dataKey === 'anterior' || p.dataKey === 'Anterior');

    if (atualEntry && anteriorEntry && anteriorEntry.value > 0) {
      const perc = ((atualEntry.value - anteriorEntry.value) / anteriorEntry.value) * 100;
      const isPositive = perc > 0;
      variationInfo = (
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between gap-4">
          <span className="text-[11px] text-muted uppercase">Var. Período Ant.:</span>
          <span className={`text-[12px] font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '+' : ''}{perc.toFixed(1)}%
          </span>
        </div>
      );
    }

    return (
      <div className="bg-card border text-[13px] border-border p-3 rounded-lg shadow-lg min-w-[170px]">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || colors.primary }} />
                <span className="text-muted font-medium">{entry.name}:</span>
              </div>
              <span className="text-foreground font-bold">
                {entry.value.toLocaleString('pt-BR')}
                {entry.name === 'Volume' && entry.value <= 100 ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
        {variationInfo}
      </div>
    );
  }
  return null;
};

export default function DashboardVolume() {
  const { filterScale } = useDashboard();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-[20px] w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground">Volume de Atendimento (Sessões)</h1>
          <p className="text-[13px] text-muted">Mede a escala, pressão operacional e o contexto dos demais indicadores.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-1.5 bg-card border border-border rounded-full text-xs text-muted">Comparação: Período Anterior</div>
          <div className="px-4 py-1.5 bg-card border border-border rounded-full text-xs text-muted">Canais: Todos</div>
        </div>
      </div>

      {/* Intelligence Alert Layer */}
      <div className="bg-[rgba(210,153,34,0.1)] border border-[rgba(210,153,34,0.3)] rounded-lg px-4 py-3 flex items-center gap-3 text-[13px]">
        <div className="font-bold text-warning whitespace-nowrapflex items-center gap-2">
          <AlertTriangle className="w-4 h-4 inline-block mr-1" />
          ✧ ATENÇÃO OPERACIONAL
        </div>
        <div className="text-foreground">
          Pico de volume detectado nos dias 05 e 06 pressionou a operação, impactando negativamente FCR e CSAT com possível sobrecarga.
        </div>
      </div>

      {/* Top Layer: Exec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Executive Card 1 */}
        <Card className="border-border bg-card flex flex-col p-[20px]">
          <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.05em] mb-4">
            Total de Atendimentos
          </div>
          <div className="text-[48px] font-bold text-foreground mb-1 leading-none tracking-tight">{Math.round(105840 * filterScale).toLocaleString('pt-BR')}</div>
          
          <div className="text-[14px] font-semibold flex items-center gap-1 mb-5 text-warning">
            ▲ +8,5% vs anterior
          </div>

          <div className="mt-auto pt-4 border-t border-border flex justify-between text-[13px]">
             <div>
              <div className="text-[11px] text-muted mb-2">Média Diária</div>
              <div className="font-semibold text-foreground">{Math.round(3528 * filterScale).toLocaleString('pt-BR')}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted mb-2">Status</div>
              <div className="px-2 py-0.5 bg-[rgba(210,153,34,0.15)] text-warning border border-warning/50 rounded text-[11px]">
                🟡 Crescimento
              </div>
            </div>
          </div>
        </Card>

        {/* Executive Card 2 */}
        <Card className="border-border bg-card flex flex-col p-[20px]">
          <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.05em] mb-4">
            % Encerrado no Bot
          </div>
          <div className="text-[48px] font-bold text-foreground mb-1 leading-none tracking-tight">71,3%</div>
          
          <div className="text-[14px] font-semibold flex items-center gap-1 mb-5 text-success">
            ▲ +2,1% vs anterior
          </div>

          <div className="mt-auto pt-4 border-t border-border flex justify-between text-[13px]">
             <div>
              <div className="text-[11px] text-muted mb-2">Vol. Encerrado</div>
              <div className="font-semibold text-foreground">{Math.round(105840 * 0.713 * filterScale).toLocaleString('pt-BR')}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted mb-2">Status</div>
              <div className="px-2 py-0.5 bg-[rgba(22,163,74,0.15)] text-success border border-success/50 rounded text-[11px]">
                🟢 Eficiente
              </div>
            </div>
          </div>
        </Card>

        {/* Executive Card 3 */}
        <Card className="border-border bg-card flex flex-col p-[20px]">
          <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.05em] mb-4">
            % Transbordo
          </div>
          <div className="text-[48px] font-bold text-foreground mb-1 leading-none tracking-tight">28,7%</div>
          
          <div className="text-[14px] font-semibold flex items-center gap-1 mb-5 text-success">
            ▼ -2,1% vs anterior
          </div>

          <div className="mt-auto pt-4 border-t border-border flex justify-between text-[13px]">
             <div>
              <div className="text-[11px] text-muted mb-2">Vol. Transbordo</div>
              <div className="font-semibold text-foreground">{Math.round(105840 * 0.287 * filterScale).toLocaleString('pt-BR')}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted mb-2">Status</div>
              <div className="px-2 py-0.5 bg-[rgba(22,163,74,0.15)] text-success border border-success/50 rounded text-[11px]">
                🟢 Ideal
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Evolution Chart Layer */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Evolution Chart */}
        <ExpandableCard
          id="volume-evolution"
          title="Evolução do Volume vs Período Anterior"
          expanded={expanded}
          setExpanded={setExpanded}
          className="pb-2"
          extraHeader={
            <div className="flex gap-3">
                <span className="text-[10px] opacity-60 text-foreground">■ Atual</span>
                <span className="text-[10px] opacity-60 text-foreground">┈ Anterior</span>
            </div>
          }
        >
          <div className="h-[240px] w-full min-h-[240px] flex-1 border-b border-border pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={evolutionData.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(val) => val > 1000 ? `${(val/1000).toFixed(1)}k` : val}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Previous Period */}
                  <Line 
                    type="monotone" 
                    dataKey="Anterior" 
                    stroke={colors.secondary} 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  
                  {/* Current Period */}
                  <Bar 
                    dataKey="Atual" 
                    radius={[2, 2, 0, 0] as any}
                    maxBarSize={40}
                  >
                     {evolutionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isPeak ? colors.warning : colors.primary} 
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
          </div>
        </ExpandableCard>
      </div>

      {/* Diagnosis Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Volume by Channel */}
        <ExpandableCard
          id="volume-channel"
          title="Volume por Canal (%)"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
             <div className="h-[220px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="channel" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="volume" name="Volume" radius={[0, 4, 4, 0] as any} barSize={12} background={{ fill: '#f1f5f9', radius: [0,4,4,0] as any }}>
                    <LabelList dataKey="volume" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? colors.danger : colors.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
             <div className="mt-2 text-center text-xs text-danger font-medium">
               Risco Operacional: Alta dependência de canal único
             </div>
          </div>
        </ExpandableCard>

        {/* Volume by Day of Week */}
        <ExpandableCard
          id="volume-day"
          title="Volume por Dia da Semana"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
             <div className="h-[220px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekData.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(val) => val > 1000 ? `${(val/1000).toFixed(0)}k` : val} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="volume" name="Sessões" radius={[4, 4, 0, 0] as any} barSize={20}>
                    <LabelList dataKey="volume" position="top" fill="#64748b" fontSize={10} formatter={(val: any) => val > 1000 ? `${(val/1000).toFixed(1)}k` : val} />
                    {dayOfWeekData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index <= 1 ? colors.primary : colors.secondary} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center text-xs text-muted">
               Concentração no início da semana
             </div>
          </div>
        </ExpandableCard>

        {/* Distribution by Hour */}
        <ExpandableCard
          id="volume-hour"
          title="Distribuição por Hora (Sazonalidade)"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
            <div className="h-[220px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.warning} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.warning} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10 }} 
                    interval={3}
                    dy={10} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(val) => val > 1000 ? `${(val/1000).toFixed(0)}k` : val} />
                 <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="volume" name="Volume" stroke={colors.warning} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center text-xs text-warning font-medium">
               Pico OperacionalCrítico: 10h–14h
             </div>
          </div>
        </ExpandableCard>

      </div>
    </div>
  );
}
