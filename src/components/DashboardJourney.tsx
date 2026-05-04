import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Route, Group, CheckCircle, ShoppingCart, TrendingUp, Download, Eye, AlertTriangle, Plus, Minus, Maximize, Minimize, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, YAxis } from 'recharts';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { cn } from '@/lib/utils';

const mockChartData = [
  { value: 40 }, { value: 45 }, { value: 42 }, { value: 50 }, { value: 65 }, { value: 70 }, { value: 68 }, { value: 80 }
];

const NodeTooltip = ({ name, conversion, volume }: { name: string, conversion: string, volume: string }) => (
  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#131E20] text-white p-3 rounded-lg shadow-xl w-max min-w-[200px] max-w-[280px] text-left">
    <div className="font-semibold text-[13px] mb-2 text-balance leading-tight">{name}</div>
    <div className="flex flex-col gap-1.5">
      <div className="text-[11px] text-[#A8C8C0] flex justify-between gap-4 items-center">
        <span>Conversão:</span>
        <span className="font-semibold text-white bg-white/10 px-1.5 py-0.5 rounded">{conversion}</span>
      </div>
      <div className="text-[11px] text-[#A8C8C0] flex justify-between gap-4 items-center">
        <span>Volume:</span>
        <span className="font-semibold text-white bg-white/10 px-1.5 py-0.5 rounded">{volume}</span>
      </div>
    </div>
    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#131E20]"></div>
  </div>
);

export default function DashboardJourney() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expanded, setExpanded] = useState({
    total: true,
    naoAluno: true,
    cursosPrep: true,
    aluno: true,
    rematricula: true,
    identificarRenov: true
  });

  const toggleTotal = () => setExpanded(prev => ({ ...prev, total: !prev.total }));
  const toggleNaoAluno = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, naoAluno: !prev.naoAluno }));
  };
  const toggleCursosPrep = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, cursosPrep: !prev.cursosPrep }));
  };
  const toggleAluno = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, aluno: !prev.aluno }));
  };
  const toggleRematricula = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, rematricula: !prev.rematricula }));
  };
  const toggleIdentificar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, identificarRenov: !prev.identificarRenov }));
  };

  const cursosData = [
    { name: 'Assinatura Ilimitada', fullName: 'Assinatura Ilimitada', value: '4.469', percentage: '69,3%', pct: '69.3%' },
    { name: 'Cursos avulsos', fullName: 'Cursos avulsos', value: '1.446', percentage: '22,4%', pct: '22.4%' },
    { name: 'Assinatura OAB', fullName: 'Assinatura OAB', value: '192', percentage: '3,0%', pct: '3.0%' },
    { name: 'Coaching e Mentoria', fullName: 'Coaching e Mentoria', value: '105', percentage: '1,6%', pct: '1.6%' },
    { name: 'Graduação Presencial', fullName: 'Graduação Presencial', value: '97', percentage: '1,5%', pct: '1.5%' },
    { name: 'Gran Questões', fullName: 'Gran Questões', value: '56', percentage: '0,9%', pct: '0.9%' },
    { name: 'Assinatura Residências', fullName: 'Assinatura Residências', value: '41', percentage: '0,6%', pct: '0.6%' },
    { name: 'Graduação Digital (EAD)', fullName: 'Graduação Digital (EAD)', value: '19', percentage: '0,3%', pct: '0.3%' },
  ];

  const temasData = [
    { name: 'Cursos e preparação', fullName: 'Cursos e preparação', value: '696', percentage: '81,2%', pct: '81.2%' },
    { name: 'Uso da plataforma', fullName: 'Uso da plataforma', value: '53', percentage: '6,2%', pct: '6.2%' },
    { name: 'Ouvidoria', fullName: 'Ouvidoria', value: '27', percentage: '3,2%', pct: '3.2%' },
    { name: 'Regras institucionais', fullName: 'Regras institucionais', value: '27', percentage: '3,2%', pct: '3.2%' },
    { name: 'Rematrícula', fullName: 'Rematrícula', value: '22', percentage: '2,6%', pct: '2.6%', hasChildren: true },
    { name: 'Regularização de pagame...', fullName: 'Regularização de pagamento', value: '14', percentage: '1,6%', pct: '1.6%' },
    { name: 'Problemas técnicos de pla...', fullName: 'Problemas técnicos de plataforma', value: '6', percentage: '0,7%', pct: '0.7%' },
    { name: 'Grade e conteúdo', fullName: 'Grade e conteúdo', value: '5', percentage: '0,6%', pct: '0.6%' },
  ];

  const subTemasData = [
    { name: 'Identificar Renovação Ass...', fullName: 'Identificar Renovação Assinatura', ops: '27 ops', sessions: '16 sessões (72,7%)', pct: '72.7%' },
    { name: 'Identificar Renovação Gra...', fullName: 'Identificar Renovação Graduação', ops: '27 ops', sessions: '16 sessões (72,7%)', pct: '72.7%', hasChildren: true },
    { name: 'Consultar Validação', fullName: 'Consultar Validação', ops: '22 ops', sessions: '22 sessões (100,0%)', pct: '100%' },
    { name: 'Identificar Inadimplência', fullName: 'Identificar Inadimplência', ops: '19 ops', sessions: '17 sessões (77,3%)', pct: '77.3%' },
    { name: 'Transferência Humano', fullName: 'Transferência Humano', ops: '19 ops', sessions: '18 sessões (81,8%)', pct: '81.8%' },
    { name: 'Gerar Link de Cobrança', fullName: 'Gerar Link de Cobrança', ops: '3 ops', sessions: '1 sessões (4,5%)', pct: '4.5%' },
    { name: 'Consultar Link de Pagame...', fullName: 'Consultar Link de Pagamento', ops: '1 ops', sessions: '1 sessões (4,5%)', pct: '4.5%' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Service Flow Tree */}
      <Card 
        className={cn(
          "overflow-hidden border-border shadow-sm flex flex-col items-center justify-start bg-white transition-all duration-300",
          isFullscreen ? "fixed inset-0 z-[100] w-screen h-screen rounded-none" : "relative min-h-[700px]"
        )} 
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      >
           <TransformWrapper
          initialScale={0.8}
          minScale={0.1}
          maxScale={4}
          centerOnInit={true}
          limitToBounds={false}
          wheel={{ step: 0.1 }}
          panning={{ velocityDisabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
                <button
                  className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded-md shadow-sm text-foreground hover:bg-muted"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded-md shadow-sm text-foreground hover:bg-muted"
                  onClick={() => zoomIn()}
                  title="Aproximar"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded-md shadow-sm text-foreground hover:bg-muted"
                  onClick={() => zoomOut()}
                  title="Afastar"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded-md shadow-sm text-foreground hover:bg-muted"
                  onClick={() => resetTransform()}
                  title="Limpar zoom"
                >
                  <span className="text-[10px] font-bold">1:1</span>
                </button>
              </div>

              <TransformComponent wrapperClass="!w-full !h-full absolute inset-0 cursor-grab active:cursor-grabbing" contentClass="w-max h-max flex flex-col items-center justify-start p-12 min-h-full min-w-full">
                <div className="flex flex-col items-center w-full pt-12 pb-32 px-12">

                  {/* Root Level: TOTAL */}
                  <div className="flex flex-col items-center relative">
                    <div 
                      className="bg-primary/5 w-[240px] p-5 rounded-xl border border-primary/20 shadow-sm relative z-10 flex flex-col items-center text-center cursor-pointer hover:bg-primary/10 transition-colors group"
                      onClick={toggleTotal}
                    >
                      <NodeTooltip name="Total" conversion="100%" volume="22.060" />
                      <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                      <h4 className="text-[28px] font-bold text-foreground mb-1 text-primary">22.060</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-muted-foreground">100%</p>
                      </div>
                      <div className="mt-2">
                         {expanded.total ? <ChevronUp className="w-4 h-4 text-primary/60" /> : <ChevronDown className="w-4 h-4 text-primary/60" />}
                      </div>
                    </div>

                    {expanded.total && (
                      <>
                        {/* Connector Down from Total */}
                        <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>

                        {/* Level 2 Container */}
                        <div className="flex justify-center items-start">
                          
                          {/* Left: Aluno */}
                          <div className="flex flex-col items-center relative px-[16px]">
                            {/* Lines */}
                            <div className="absolute top-0 right-0 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>
                            <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>
                            
                            <div 
                              className="bg-white w-[240px] p-5 rounded-xl border border-border shadow-sm relative z-10 flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={toggleAluno}
                            >
                              <NodeTooltip name="Aluno" conversion="61,6%" volume="13.033" />
                              <p className="text-[14px] font-semibold text-foreground mb-1">Aluno</p>
                              <h4 className="text-[24px] font-bold text-foreground mb-3">13.033</h4>
                              <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden mb-2">
                                <div className="bg-primary h-full rounded-full" style={{ width: '61.6%' }}></div>
                              </div>
                              <p className="text-[13px] font-medium text-muted-foreground mb-2">61,6%</p>
                              <div className="mt-1">
                                {expanded.aluno ? <ChevronUp className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />}
                              </div>
                            </div>
                            
                            {expanded.aluno && (
                              <>
                                <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>
                                {/* Level 3 under Aluno */}
                                <div className="flex justify-center items-start w-fit mx-auto">
                                   {temasData.map((item, idx) => (
                                     <div key={idx} className="flex flex-col items-center relative px-[4px]">
                                       {idx > 0 && <div className="absolute top-0 right-1/2 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>}
                                       {idx < temasData.length - 1 && <div className="absolute top-0 left-1/2 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>}
                                       <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>

                                       <div 
                                          className={`bg-white w-[240px] p-5 rounded-xl border ${item.hasChildren ? 'border-primary cursor-pointer hover:bg-slate-50 transition-colors shadow-md' : 'border-border shadow-sm'} relative z-10 flex flex-col items-center text-center group min-h-[148px]`}
                                          onClick={item.hasChildren ? toggleRematricula : undefined}
                                       >
                                         <NodeTooltip name={item.fullName} conversion={item.percentage} volume={item.value} />
                                         <p className="text-[12px] font-semibold text-foreground mb-2 min-h-[36px] flex items-center justify-center text-balance">{item.name}</p>
                                          <h4 className="text-[20px] font-bold text-foreground mb-3 mt-auto">{item.value}</h4>
                                          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-2">
                                            <div className="bg-primary h-full rounded-full" style={{ width: item.pct }}></div>
                                          </div>
                                          <p className="text-[11px] font-medium text-muted-foreground mb-2">{item.percentage}</p>
                                          <div className="mt-1">
                                             {item.hasChildren ? (expanded.rematricula ? <ChevronUp className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" /> : <ChevronDown className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />) : <span className="text-muted-foreground/50 text-[10px]">▼</span>}
                                          </div>
                                       </div>

                                       {item.hasChildren && expanded.rematricula && (
                                          <>
                                            <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>
                                            {/* SubTemas Container */}
                                            <div className="flex justify-center items-start w-fit mx-auto">
                                                {subTemasData.map((sub, sidx) => (
                                                   <div key={sidx} className="flex flex-col items-center relative px-[4px]">
                                                      {sidx > 0 && <div className="absolute top-0 right-1/2 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>}
                                                      {sidx < subTemasData.length - 1 && <div className="absolute top-0 left-1/2 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>}
                                                      <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>

                                                      <div 
                                                        className={`bg-[#F8F5FF] w-[240px] p-5 rounded-xl border ${sub.hasChildren ? 'border-primary cursor-pointer hover:bg-[#F3EEFF] transition-colors shadow-md' : 'border-primary/20 shadow-sm'} relative z-10 flex flex-col items-center text-center group min-h-[148px]`}
                                                        onClick={sub.hasChildren ? toggleIdentificar : undefined}
                                                      >
                                                        <NodeTooltip name={sub.fullName} conversion={sub.pct} volume={sub.ops} />
                                                        <p className="text-[12px] font-semibold text-primary mb-2 min-h-[36px] flex items-center justify-center text-balance leading-tight">{sub.name}</p>
                                                        <p className="text-[11px] text-muted-foreground mt-auto mb-1">{sub.ops}</p>
                                                        <p className="text-[11px] font-medium text-primary mb-3">{sub.sessions}</p>
                                                        <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden mb-2">
                                                            <div className="bg-[#2E7D5B] h-full rounded-full" style={{ width: sub.pct }}></div>
                                                        </div>
                                                        <div className="mt-1">
                                                            {sub.hasChildren ? (expanded.identificarRenov ? <ChevronUp className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" /> : <ChevronDown className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />) : <span className="text-primary/40 text-[10px]">▼</span>}
                                                        </div>
                                                      </div>

                                                      {sub.hasChildren && expanded.identificarRenov && (
                                                         <>
                                                            <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>
                                                            {/* Success/Fail */}
                                                            <div className="flex justify-center items-start w-fit mx-auto gap-4">
                                                               <div className="flex flex-col items-center relative">
                                                                 <div className="absolute top-0 right-[-8px] w-[110%] border-t-[2px] border-dashed border-slate-400"></div>
                                                                 <div className="h-[16px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>
                                                                 <div className="bg-[#E6F4EA] px-6 py-3 rounded-xl border border-[#2E7D5B]/30 flex flex-col items-center shadow-sm relative z-10 group">
                                                                    <NodeTooltip name="Sucesso em Identificação" conversion="96,3%" volume="26 ops" />
                                                                    <p className="text-[12px] font-semibold text-[#2E7D5B] mb-1">Sucesso</p>
                                                                    <p className="text-[18px] font-bold text-[#2E7D5B] mb-1">26</p>
                                                                    <p className="text-[11px] text-[#2E7D5B]/80 font-medium">96,3%</p>
                                                                 </div>
                                                               </div>
                                                               <div className="flex flex-col items-center relative">
                                                                 <div className="absolute top-0 left-[-8px] w-[110%] border-t-[2px] border-dashed border-slate-400"></div>
                                                                 <div className="h-[16px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>
                                                                 <div className="bg-[#FCE8E8] px-6 py-3 rounded-xl border border-[#B84545]/30 flex flex-col items-center shadow-sm relative z-10 group">
                                                                    <NodeTooltip name="Falha em Identificação" conversion="3,7%" volume="1 ops" />
                                                                    <p className="text-[12px] font-semibold text-[#B84545] mb-1">Falha</p>
                                                                    <p className="text-[18px] font-bold text-[#B84545] mb-1">1</p>
                                                                    <p className="text-[11px] text-[#B84545]/80 font-medium">3,7%</p>
                                                                 </div>
                                                               </div>
                                                            </div>
                                                         </>
                                                      )}
                                                   </div>
                                                ))}
                                            </div>
                                          </>
                                       )}
                                     </div>
                                   ))}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Right: Não aluno */}
                          <div className="flex flex-col items-center relative px-[16px]">
                            {/* Lines */}
                            <div className="absolute top-0 left-0 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>
                            <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>

                            <div 
                              className="bg-white w-[240px] p-5 rounded-xl border border-primary shadow-md relative z-10 flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={toggleNaoAluno}
                            >
                              <NodeTooltip name="Não aluno" conversion="38,4%" volume="8.108" />
                              <p className="text-[14px] font-semibold text-foreground mb-1">Não aluno</p>
                              <h4 className="text-[24px] font-bold text-foreground mb-3">8.108</h4>
                              <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden mb-2">
                                <div className="bg-primary h-full rounded-full" style={{ width: '38.4%' }}></div>
                              </div>
                              <p className="text-[13px] font-medium text-muted-foreground mb-2">38,4%</p>
                              <div className="mt-1">
                                 {expanded.naoAluno ? <ChevronUp className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />}
                              </div>
                            </div>
                            
                            {expanded.naoAluno && (
                              <>
                                {/* Connector Down from Não Aluno */}
                                <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>

                                {/* Level 3 Container */}
                                <div className="flex justify-center items-start">
                                  
                                  {/* Left: Cursos preparatórios */}
                                  <div className="flex flex-col items-center relative px-[16px]">
                                    {/* Lines */}
                                    <div className="absolute top-0 right-0 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>
                                    <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>

                                    <div 
                                      className="bg-white w-[240px] p-5 rounded-xl border border-border shadow-sm relative z-10 flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50 transition-colors"
                                      onClick={toggleCursosPrep}
                                    >
                                      <NodeTooltip name="Cursos preparatórios" conversion="79,5%" volume="6.446" />
                                      <p className="text-[14px] font-semibold text-foreground mb-1">Cursos preparatórios</p>
                                      <h4 className="text-[24px] font-bold text-foreground mb-3">6.446</h4>
                                      <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden mb-2">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '79.5%' }}></div>
                                      </div>
                                      <p className="text-[13px] font-medium text-muted-foreground mb-2">79,5%</p>
                                      <div className="mt-1">
                                         {expanded.cursosPrep ? <ChevronUp className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />}
                                      </div>
                                    </div>
                                    
                                    {expanded.cursosPrep && (
                                      <>
                                        <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>
                                        {/* Level 4 Container */}
                                        <div className="flex justify-center items-start w-fit mx-auto">
                                          {cursosData.map((item, idx) => (
                                            <div key={idx} className="flex flex-col items-center relative px-[4px]">
                                              {/* Lines */}
                                              {idx > 0 && <div className="absolute top-0 right-1/2 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>}
                                              {idx < cursosData.length - 1 && <div className="absolute top-0 left-1/2 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>}
                                              <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>
                                              
                                              <div className="bg-white w-[240px] p-5 rounded-xl border border-border shadow-sm relative z-10 flex flex-col items-center text-center group min-h-[148px]">
                                                <NodeTooltip name={item.fullName} conversion={item.percentage} volume={item.value} />
                                                <p className="text-[12px] font-semibold text-foreground mb-2 min-h-[36px] flex items-center justify-center text-balance">{item.name}</p>
                                                <h4 className="text-[20px] font-bold text-foreground mb-3 mt-auto">{item.value}</h4>
                                                <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-2">
                                                  <div className="bg-primary h-full rounded-full" style={{ width: item.pct }}></div>
                                                </div>
                                                <p className="text-[11px] font-medium text-muted-foreground mb-2">{item.percentage}</p>
                                                <div className="mt-1">
                                                  <span className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors text-[10px]">▼</span>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  {/* Right: Ensino superior */}
                                  <div className="flex flex-col items-center relative px-[16px]">
                                    {/* Lines */}
                                    <div className="absolute top-0 left-0 w-[50%] border-t-[2px] border-dashed border-slate-400"></div>
                                    <div className="h-[20px] w-[0px] border-l-[2px] border-dashed border-slate-400"></div>

                                    <div className="bg-white w-[240px] p-5 rounded-xl border border-border shadow-sm relative z-10 flex flex-col items-center text-center group">
                                      <NodeTooltip name="Ensino superior" conversion="20,5%" volume="1.662" />
                                      <p className="text-[14px] font-semibold text-foreground mb-1">Ensino superior</p>
                                      <h4 className="text-[24px] font-bold text-foreground mb-3">1.662</h4>
                                      <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden mb-2">
                                        <div className="bg-primary h-full rounded-full" style={{ width: '20.5%' }}></div>
                                      </div>
                                      <p className="text-[13px] font-medium text-muted-foreground mb-2">20,5%</p>
                                      <div className="mt-1">
                                        <span className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors text-[10px]">▼</span>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </>
                            )}
                          </div>

                        </div>
                      </>
                    )}
                  </div>

                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm border border-border p-4 rounded-xl text-xs space-y-2 shadow-sm z-20">
          <p className="font-bold text-foreground mb-2 uppercase tracking-wider text-[10px]">Legenda</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2E7D5B]"></span>
            <span className="text-muted-foreground">Ótimo (&gt;90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#B87918]"></span>
            <span className="text-muted-foreground">Atenção (70-90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#B84545]"></span>
            <span className="text-muted-foreground">Crítico (&lt;70%)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 border-t border-dashed border-muted-foreground"></span>
              <span className="text-muted-foreground">Fluxo Secundário</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-6 h-[3px] bg-primary"></span>
              <span className="text-muted-foreground">Caminho Principal</span>
            </div>
          </div>
        </div>
      </Card>


      
    </div>
  );
}
