import React, { useMemo } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell, ComposedChart, LabelList
} from 'recharts';
import { cn } from '@/lib/utils';
import { Maximize2 } from 'lucide-react';

// Mock Data
const evolutionData = Array.from({ length: 30 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, '0');
  let current = 71 + Math.random() * 2 - 1; 
  let previous = 73.8 + Math.random() * 2 - 1; 

  // Simulate the peak on days 10-12
  if (i >= 9 && i <= 11) {
    current = 78 + Math.random() * 3;
  }
  
  return {
    day,
    Atual: Number(current.toFixed(1)),
    Anterior: Number(previous.toFixed(1)),
  };
});

const channelData = [
  { channel: 'WhatsApp', rate: 75 },
  { channel: 'Chat', rate: 65 },
  { channel: 'Voz', rate: 55 },
];

const motivoData = [
  { motive: 'Bot não entendeu a intenção', rate: 40 },
  { motive: 'Fluxo não cobre a solicitação', rate: 30 },
  { motive: 'Usuário exigiu humano', rate: 20 },
  { motive: 'Erro de integração/técnico', rate: 10 },
];

const origemData = [
  { origin: 'Durante o processo (Meio)', rate: 50 },
  { origin: 'No momento final', rate: 30 },
  { origin: 'Imediatamente no menu', rate: 20 },
];

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
      // Para FCR, CSAT, Bot, Retenção, uma variação positiva geralmente é boa, então verde. 
      // Em casos como "Taxa de Transferência", positivo pode ser ruim, mas o padrão será mantido ou ajustaremos conforme a cor.
      let variationColor = isPositive ? 'text-success' : 'text-danger';
      // Inversão de cor para Transferência (mais = ruim)
      if (typeof window !== 'undefined' && window.location.pathname.includes('transferencia')) {
        variationColor = isPositive ? 'text-danger' : 'text-success';
      }

      variationInfo = (
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between gap-4">
          <span className="text-[11px] text-muted uppercase">Var. Período Ant.:</span>
          <span className={`text-[12px] font-bold ${variationColor}`}>
            {isPositive ? '+' : ''}{perc.toFixed(1)}%
          </span>
        </div>
      );
    }

    return (
      <div className="bg-card border text-[13px] border-border p-3 rounded-lg shadow-lg min-w-[170px]">
        <p className="font-semibold text-foreground mb-2">
          {label && label.toString().includes("Dia") ? label : `Dia ${label}`}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || '#2563eb' }} />
                <span className="text-muted font-medium">{entry.name}:</span>
              </div>
              <span className="text-foreground font-bold">
                {typeof entry.value === "number" && entry.value % 1 !== 0 ? entry.value.toFixed(1) : (typeof entry.value === "number" ? entry.value.toLocaleString("pt-BR") : entry.value)}%
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

export default function DashboardTransfer() {
  const { filterScale } = useDashboard();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-[20px] w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground">Encaminhamento para Atendimento Humano</h1>
          <p className="text-[13px] text-muted">Mede a dependência operacional e falhas de retenção da automação.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-1.5 bg-card border border-border rounded-full text-xs text-muted">Comparação: Período Anterior</div>
          <div className="px-4 py-1.5 bg-card border border-border rounded-full text-xs text-muted">Canais: Todos</div>
        </div>
      </div>

      {/* Intelligence Alert Layer */}
      <div className="bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.3)] rounded-lg px-4 py-3 flex items-center gap-3 text-[13px]">
        <div className="font-bold text-danger whitespace-nowrap">
          ✧ ALERTA CRÍTICO
        </div>
        <div className="text-foreground">
          Alta dependência de atendimento humano identificada. Um <strong>pico anômalo de transferências</strong> ocorreu nos dias 10–12 derivado de quebras severas no meio do fluxo, principalmente por <strong>falha de entendimento</strong>.
        </div>
      </div>

      {/* Top Layer: Exec Card & Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Executive Card */}
        <Card className="lg:col-span-1 border-border bg-card flex flex-col p-[20px]">
          <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.05em] mb-4">
            Taxa de Transferência
          </div>
          <div className="text-[48px] font-bold text-foreground mb-1 leading-none tracking-tight">{((71.3 * (0.85 + 0.15 * Math.max(0.5, filterScale))).toFixed(1)).replace('.', ',')}%</div>
          
          <div className="text-[14px] font-semibold flex items-center gap-1 mb-5 text-success">
            ▼ -2,5 p.p vs anterior
          </div>

          <div className="mt-auto pt-4 border-t border-border flex justify-between text-[13px]">
            <div>
              <div className="text-[11px] text-muted mb-2">Volume Base</div>
              <div className="font-semibold text-foreground">{Math.round(75437 * filterScale).toLocaleString('pt-BR')} sessões</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted mb-2">Status</div>
              <div className="px-2 py-0.5 bg-[rgba(248,81,73,0.15)] text-danger border border-danger/50 rounded text-[11px]">
                🔴 Alto
              </div>
            </div>
          </div>
        </Card>

        {/* Evolution Chart */}
        <ExpandableCard
          id="transfer-evolution"
          title="Evolução de Retenção e Quebras vs Período Anterior"
          expanded={expanded}
          setExpanded={setExpanded}
          className="lg:col-span-3 pb-2"
          extraHeader={
            <div className="flex gap-3">
                <span className="text-[10px] opacity-60 text-foreground">● Atual</span>
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
                    domain={[60, 90]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Baseline reference */}
                  <ReferenceLine y={71.3} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Média Atual: 71.3%', fill: '#64748b', fontSize: 10 }} />
                  
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
                  <Line 
                    type="monotone" 
                    dataKey="Atual" 
                    stroke={colors.danger} 
                    strokeWidth={3} 
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
          </div>
        </ExpandableCard>
      </div>

      {/* Diagnosis Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Transfer Rate by Channel */}
        <ExpandableCard
          id="transfer-channel"
          title="Transferência por Canal"
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
                  <Bar dataKey="rate" name="Transferências" radius={[0, 4, 4, 0] as any} barSize={12} background={{ fill: '#f1f5f9', radius: [0,4,4,0] as any }}>
                    <LabelList dataKey="rate" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.rate > 70 ? colors.danger : colors.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-3">
              {channelData.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <span className="text-muted font-medium">{d.channel}</span>
                  <div className="flex items-center gap-2">
                    {/* Show a red indicator if severely high transferring channel */}
                    {d.rate > 70 && <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />}
                    <span className="font-bold whitespace-nowrap" style={{ color: d.rate > 70 ? colors.danger : '#0f172a' }}>{d.rate}% </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ExpandableCard>

        {/* Motive (Crucial Diagnosis) */}
        <ExpandableCard
          id="transfer-motive"
          title="Motivo da Transferência"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
            <div className="h-[220px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={motivoData.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="motive" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={140} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="rate" name="Incidência" radius={[0, 4, 4, 0] as any} barSize={12} background={{ fill: '#f1f5f9', radius: [0,4,4,0] as any }}>
                    <LabelList dataKey="rate" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {motivoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? colors.warning : colors.secondary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-3 pt-2 border-t border-border/50">
               <span className="text-[11px] text-muted leading-tight block">
                 A maior ofensa recai sobre a capacidade cognitiva do modelo de Chat atual com <strong>40% liderando os escapes manuais.</strong>
               </span>
            </div>
          </div>
        </ExpandableCard>

        {/* Flow origin (Where the break happens) */}
        <ExpandableCard
          id="transfer-origin"
          title="Origem no Fluxo (Onde o bot falha)"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
            <div className="h-[220px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={origemData.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="origin" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(val) => `${val}%`} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="rate" name="Perda" radius={[4, 4, 0, 0] as any} barSize={24}>
                    <LabelList dataKey="rate" position="top" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {origemData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.rate >= 50 ? colors.danger : colors.primary} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
           <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted/10 p-2 rounded">
                    <div className="text-[11px] text-muted mb-1">Risco Imediato</div>
                    <div className="text-[13px] font-bold text-foreground">Menu Inicial (20%)</div>
                </div>
                <div className="bg-danger/10 p-2 rounded">
                     <div className="text-[11px] text-muted mb-1">Concentração Crítica</div>
                    <div className="text-[13px] font-bold text-danger">Meio do Fluxo (50%)</div>
                </div>
            </div>
          </div>
        </ExpandableCard>

      </div>
    </div>
  );
}
