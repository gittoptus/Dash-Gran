import React, { useMemo } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
  BarChart, Bar, Cell, ComposedChart, LabelList
} from 'recharts';
import { cn } from '@/lib/utils';
import { Maximize2 } from 'lucide-react';

// Mock Data
const evolutionData = Array.from({ length: 30 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, '0');
  let current = 78 + Math.random() * 5 - 2;
  let previous = 80 + Math.random() * 4 - 2;

  // Simulate the drop on days 10-12
  if (i >= 9 && i <= 11) {
    current = 68 - Math.random() * 5;
  }
  
  return {
    day,
    Atual: Number(current.toFixed(1)),
    Anterior: Number(previous.toFixed(1)),
  };
});

const channelData = [
  { channel: 'Voz', csat: 82 },
  { channel: 'Chat', csat: 78 },
  { channel: 'WhatsApp', csat: 70 },
];

const demandData = [
  { demand: 'Dúvidas simples', csat: 85 },
  { demand: 'Cancelamento', csat: 72 },
  { demand: 'Financeiro', csat: 65 },
  { demand: 'Reclamação', csat: 60 },
];

const detractorReasons = [
  { reason: 'Lentidão no atendimento', percentage: 35 },
  { reason: 'Problema não resolvido', percentage: 28 },
  { reason: 'Muitas transferências', percentage: 15 },
  { reason: 'Falta de empatia', percentage: 12 },
  { reason: 'Outros', percentage: 10 },
];

const promoterReasons = [
  { reason: 'Rapidez no atendimento', percentage: 42 },
  { reason: 'Problema resolvido', percentage: 35 },
  { reason: 'Atendente cordial', percentage: 14 },
  { reason: 'Clareza nas informações', percentage: 6 },
  { reason: 'Outros', percentage: 3 },
];

const notesDistribution = [
  { note: 'Nota 1', percentage: 12, type: 'detrator' },
  { note: 'Nota 2', percentage: 8, type: 'detrator' },
  { note: 'Nota 3', percentage: 15, type: 'neutro' },
  { note: 'Nota 4', percentage: 25, type: 'promotor' },
  { note: 'Nota 5', percentage: 40, type: 'promotor' },
];

// Colors matching Elegant Dark
const colors = {
  primary: '#2563eb',
  secondary: '#94a3b8',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
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
          {label && label.toString().length <= 2 && !isNaN(Number(label)) ? `Dia ${label}` : label}
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

export default function DashboardCSAT() {
  const { filterScale } = useDashboard();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-[20px] w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground">Satisfação do Cliente</h1>
          <p className="text-[13px] text-muted">Consolidado Mensal: 01 Out - 31 Out 2023</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-1.5 bg-card border border-border rounded-full text-xs text-muted">Comparação: Período Anterior</div>
          <div className="px-4 py-1.5 bg-card border border-border rounded-full text-xs text-muted">Canais: Todos</div>
          <div className="px-4 py-1.5 bg-card border border-border rounded-full text-xs text-muted">Demanda: Todas</div>
        </div>
      </div>

      {/* Intelligence Alert Layer */}
      <div className="bg-[rgba(88,166,255,0.1)] border border-[rgba(88,166,255,0.3)] rounded-lg px-4 py-3 flex items-center gap-3 text-[13px]">
        <div className="font-bold text-accent whitespace-nowrap">
          ✧ INSIGHT IA
        </div>
        <div className="text-foreground">
          Queda de CSAT concentrada em atendimentos <strong>Financeiros</strong> no canal <strong>WhatsApp</strong> nos dias 10–12. Alerta crítico para aumento de notas baixas (detratores).
        </div>
      </div>

      {/* Top Layer: Exec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        
        {/* Executive Card */}
        <Card className="border-border bg-card flex flex-col p-[20px]">
          <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.05em] mb-4">
            Satisfação do Cliente
          </div>
          <div className="text-[48px] font-bold text-foreground mb-1 leading-none tracking-tight">{((75.2 * (0.85 + 0.15 * Math.max(0.5, filterScale))).toFixed(1)).replace('.', ',')}%</div>
          
          <div className="text-[14px] font-semibold flex items-center gap-1 mb-5 text-danger">
            ▼ -1,1 p.p vs anterior
          </div>

          <div className="mt-auto pt-4 border-t border-border flex justify-between text-[13px]">
            <div>
              <div className="text-[11px] text-muted mb-2">Volume Base</div>
              <div className="font-semibold text-foreground">{Math.round(1453 * filterScale).toLocaleString('pt-BR')} resp.</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted mb-2">Status</div>
              <div className="px-2 py-0.5 bg-[rgba(210,153,34,0.15)] text-[#d97706] border border-[#d97706] rounded text-[11px]">
                🟡 Atenção
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Evolution Chart Layer */}
      <div className="grid grid-cols-1 gap-6">

        {/* Evolution Chart */}
        <ExpandableCard
          id="csat-evolution"
          title="Evolução de Satisfação vs Período Anterior"
          expanded={expanded}
          setExpanded={setExpanded}
          className="pb-2"
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
                    domain={[40, 100]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Baseline reference */}
                  <ReferenceLine y={75.2} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Média Atual: 75.2%', fill: '#64748b', fontSize: 10 }} />
                  
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
                    stroke={colors.primary} 
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CSAT by Channel */}
        <ExpandableCard
          id="csat-channel"
          title="CSAT por Canal"
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
                  <Bar dataKey="csat" radius={[0, 4, 4, 0] as any} barSize={12} background={{ fill: '#f1f5f9', radius: [0,4,4,0] as any }}>
                    <LabelList dataKey="csat" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.csat < 75 ? colors.danger : colors.primary} />
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
                    <span className="font-bold whitespace-nowrap" style={{ color: d.csat < 75 ? colors.danger : '#0f172a' }}>{d.csat}% </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ExpandableCard>

        {/* CSAT by Demand */}
        <ExpandableCard
          id="csat-demand"
          title="CSAT por Tipo de Atendimento"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[260px]">
            <div className="h-[260px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))} layout="vertical" margin={{ top: 0, right: 40, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="demand" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={110} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="csat" radius={[0, 4, 4, 0] as any} barSize={12} background={{ fill: '#f1f5f9', radius: [0,4,4,0] as any }}>
                    <LabelList dataKey="csat" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {demandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.csat < 70 ? colors.warning : colors.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableCard>

        {/* Histogram (Notes Distribution) */}
        <ExpandableCard
          id="csat-histogram"
          title="Distribuição de Notas (1-5)"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
             <div className="h-[220px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={notesDistribution.map(d => Object.fromEntries(Object.entries(d).map(([k,v]) => [k, typeof v === "number" ? (v > 100 ? Math.round(v * filterScale) : Number((v * (0.85 + 0.15 * filterScale)).toFixed(1))) : v])))} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="note" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(val) => `${val}%`} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0] as any} barSize={24}>
                    <LabelList dataKey="percentage" position="top" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {notesDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.type === 'detrator' ? colors.danger : 
                          entry.type === 'promotor' ? colors.success : 
                          colors.warning
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
                <div>
                    <div className="text-[11px] text-muted mb-1">Detratores (1-2)</div>
                    <div className="text-[14px] font-bold text-danger">20%</div>
                </div>
                <div>
                     <div className="text-[11px] text-muted mb-1">Promotores (4-5)</div>
                    <div className="text-[14px] font-bold text-success">65%</div>
                </div>
            </div>
          </div>
        </ExpandableCard>

        {/* Detractor Reasons */}
        <ExpandableCard
          id="csat-detractors"
          title="Principais Motivos Detratores"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[260px]">
            <div className="h-[260px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detractorReasons} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 'dataMax']} hide />
                  <YAxis type="category" dataKey="reason" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={120} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0] as any} barSize={12} fill={colors.danger} background={{ fill: '#f1f5f9', radius: [0,4,4,0] as any }}>
                    <LabelList dataKey="percentage" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableCard>

        {/* Promoter Reasons */}
        <ExpandableCard
          id="csat-promoters"
          title="Principais Motivos Promotores"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[260px]">
            <div className="h-[260px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={promoterReasons} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 'dataMax']} hide />
                  <YAxis type="category" dataKey="reason" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={120} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0] as any} barSize={12} fill={colors.success} background={{ fill: '#f1f5f9', radius: [0,4,4,0] as any }}>
                    <LabelList dataKey="percentage" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableCard>

      </div>
    </div>
  );
}
