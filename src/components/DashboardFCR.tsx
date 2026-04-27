import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
  BarChart, Bar, Cell,
  ComposedChart, LabelList
} from 'recharts';
import { AlertCircle, ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Info, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data
const evolutionData = Array.from({ length: 30 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, '0');
  let current = 72 + Math.random() * 5 - 2;
  let previous = 69 + Math.random() * 4 - 2;

  // Simulate the drop on days 10-12
  if (i >= 9 && i <= 11) {
    current = 65 - Math.random() * 5;
  }
  
  return {
    day,
    Atual: Number(current.toFixed(1)),
    Anterior: Number(previous.toFixed(1)),
  };
});

const channelData = [
  { channel: 'WhatsApp', fcr: 68, trend: 'down' },
  { channel: 'Chatbot', fcr: 75, trend: 'up' },
];

const demandData = [
  { demand: 'Dúvida Simples', fcr: 85 },
  { demand: 'Segunda Via', fcr: 78 },
  { demand: 'Rastreio', fcr: 70 },
  { demand: 'Prob. Técnico', fcr: 60 },
  { demand: 'Financeiro', fcr: 55 },
];

// Heatmap mock logic (1 to 30)
const heatmapData = evolutionData.map(d => ({
  day: d.day,
  value: d.Atual
}));

// Colors
const colors = {
  primary: '#2563eb',
  secondary: '#94a3b8',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border text-[13px] border-border p-3 rounded-lg shadow-lg">
        <p className="font-semibold text-foreground mb-1">Dia {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted font-medium">{entry.name}:</span>
            <span className="text-foreground font-bold">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardFCR() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-[20px] w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground">Performance Operational — FCR</h1>
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
          Queda no FCR concentrada no canal <strong className="font-semibold">WhatsApp</strong> nos dias 10–12 devido a alta volatilidade em demandas <strong className="font-semibold">Financeiras</strong>.
        </div>
      </div>

      {/* Top Layer: Exec Card & Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Executive Card */}
        <Card className="lg:col-span-1 border-border bg-card flex flex-col p-[20px]">
          <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.05em] mb-4">
            Resolução no Primeiro Contato
          </div>
          <div className="text-[48px] font-bold text-foreground mb-1 leading-none tracking-tight">72,9%</div>
          
          <div className="text-[14px] font-semibold flex items-center gap-1 mb-5 text-[#16a34a]">
            ▲ +3,2 p.p vs set
          </div>

          <div className="mt-auto pt-4 border-t border-border flex justify-between text-[13px]">
            <div>
              <div className="text-[11px] text-muted mb-2">Volume Total</div>
              <div className="font-semibold text-foreground">1.455 atend.</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted mb-2">Status</div>
              <div className="px-2 py-0.5 bg-[rgba(210,153,34,0.15)] text-[#d97706] border border-[#d97706] rounded text-[11px]">
                🟡 Estável
              </div>
            </div>
          </div>
        </Card>

        {/* Evolution Chart */}
        <ExpandableCard 
          id="fcr-evolution"
          title="Evolução Temporal vs Período Anterior"
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
                <ComposedChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <ReferenceLine y={72.9} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Média: 72.9%', fill: '#64748b', fontSize: 10 }} />
                  
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FCR by Channel */}
        <ExpandableCard
          id="fcr-channel"
          title="FCR por Canal"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
            <div className="h-[220px] w-full flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="channel" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} />
                  <Bar dataKey="fcr" radius={[0, 4, 4, 0]} barSize={12} background={{ fill: '#f1f5f9', radius: [0,4,4,0] }}>
                    <LabelList dataKey="fcr" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fcr < 70 ? colors.danger : colors.primary} />
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
                    <span className="font-bold whitespace-nowrap" style={{ color: d.fcr < 70 ? colors.danger : '#0f172a' }}>{d.fcr}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ExpandableCard>

        {/* FCR by Demand */}
        <ExpandableCard
          id="fcr-demand"
          title="FCR por Tipo de Demanda"
          expanded={expanded}
          setExpanded={setExpanded}
          contentClassName="justify-center"
        >
          <div className="flex-1 flex flex-col justify-center min-h-[260px]">
            <div className="h-[260px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData} layout="vertical" margin={{ top: 0, right: 40, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="demand" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={110} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} />
                  <Bar dataKey="fcr" radius={[0, 4, 4, 0]} barSize={12} background={{ fill: '#f1f5f9', radius: [0,4,4,0] }}>
                    <LabelList dataKey="fcr" position="right" fill="#64748b" fontSize={10} formatter={(val: any) => `${val}%`} />
                    {demandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fcr < 65 ? colors.warning : colors.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ExpandableCard>

        {/* Heatmap (Intensity) */}
        <ExpandableCard
          id="fcr-heatmap"
          title="FCR por Dia (Heatmap)"
          expanded={expanded}
          setExpanded={setExpanded}
        >
          <div className="flex-1 flex flex-col min-h-[260px]">
            <div className="grid grid-cols-7 gap-1 mt-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d,i) => (
                <div key={i} className="text-center text-[10px] font-medium text-muted mb-1">{d}</div>
              ))}
              
              <div className="rounded-[2px] bg-transparent aspect-square" />
              <div className="rounded-[2px] bg-transparent aspect-square" />
              <div className="rounded-[2px] bg-transparent aspect-square" />

              {heatmapData.map((d, i) => {
                let bgClass = "bg-[#15803d]";
                if (d.value > 75) bgClass = "bg-[#22c55e]";
                else if (d.value > 70) bgClass = "bg-[#16a34a]";
                else if (d.value > 65) bgClass = "bg-[#f8fafc]";
                else bgClass = "bg-[#dc2626]";

                return (
                  <div 
                    key={i} 
                    className={cn(
                      "rounded-[2px] aspect-square flex items-center justify-center text-[10px] font-medium text-transparent relative group cursor-pointer transition-all hover:ring-1 hover:ring-muted",
                      bgClass
                    )}
                  >
                    {d.day}
                    
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-border text-foreground text-[11px] rounded p-1.5 bottom-full mb-1 w-max pointer-events-none shadow-xl">
                      Dia {d.day}: {d.value}%
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-auto pt-4 text-[11px] text-muted">
              Legenda: Operação crítica nos dias 10-12.
            </div>
          </div>
        </ExpandableCard>

      </div>
    </div>
  );
}
