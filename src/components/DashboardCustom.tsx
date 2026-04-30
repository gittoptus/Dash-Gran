import React, { useState } from 'react';
import { ResponsiveGridLayout, useContainerWidth, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Card } from '@/components/ui/card';
import { LayoutGrid, Plus, BarChart3, PieChart, LineChart, ScatterChart, Map, CandlestickChart, X, Columns, Search, Move, Settings, Database, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const mockDataLineBar = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 800 },
  { name: 'Mai', value: 500 }
];

const mockDataPie = [
  { name: 'Alpha', value: 400 },
  { name: 'Beta', value: 300 },
  { name: 'Gamma', value: 200 }
];

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

const mockDataScatter = [
  { x: 10, y: 30 }, { x: 30, y: 200 }, { x: 45, y: 100 }, 
  { x: 50, y: 400 }, { x: 70, y: 150 }, { x: 100, y: 250 }
];

// Predefined widgets that a user can add
const AVAILABLE_WIDGETS = [
  { id: 'w1', title: 'Data Line Chart', type: 'chart', icon: LineChart },
  { id: 'w2', title: 'Data Bar Chart', type: 'chart', icon: BarChart3 },
  { id: 'w3', title: 'Data Pie Chart', type: 'chart', icon: PieChart },
  { id: 'w4', title: 'Data Scatter Chart', type: 'chart', icon: ScatterChart },
  { id: 'w5', title: 'GEO/Map', type: 'chart', icon: Map },
  { id: 'w6', title: 'Candlestick Chart', type: 'chart', icon: CandlestickChart },
];

export default function DashboardCustom() {
  const { width, containerRef } = useContainerWidth();
  const [widgets, setWidgets] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeConfigWidget, setActiveConfigWidget] = useState<string | null>(null);

  const addWidget = (widgetInfo: any) => {
    const instanceId = Date.now().toString();
    setWidgets([
      ...widgets,
      { 
        ...widgetInfo, 
        instanceId, 
        isConfigured: false,
        layout: {
          i: instanceId,
          x: (widgets.length * 4) % 12,
          y: Infinity,
          w: widgetInfo.type === 'chart' ? 6 : 4,
          h: widgetInfo.type === 'chart' ? 4 : 3,
          minW: 3,
          minH: 2
        }
      }
    ]);
    setIsCatalogOpen(false); // Close catalog after adding
  };

  const removeWidget = (instanceId: string) => {
    setWidgets(widgets.filter(w => w.instanceId !== instanceId));
    if (activeConfigWidget === instanceId) {
      setActiveConfigWidget(null);
    }
  };

  const applyConfig = () => {
    setWidgets(widgets.map(w => w.instanceId === activeConfigWidget ? { ...w, isConfigured: true } : w));
    setActiveConfigWidget(null);
  };

  const onLayoutChange = (layout: any[], layouts: { [key: string]: any[] }) => {
    // We could save layouts here, but react-grid-layout manages current layout during drag
    const newWidgets = widgets.map(w => {
      const match = layout.find(l => l.i === w.instanceId);
      if (match) {
        return { ...w, layout: match };
      }
      return w;
    });
    setWidgets(newWidgets);
  };

  const renderChart = (w: any) => {
    if (!w.isConfigured) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
          <div className="text-[12px] text-muted">[ Espaço para {w.title} ]</div>
          <div className="text-[10px] text-muted mt-1 px-4">Utilize as configurações para conectar os dados a este componente</div>
        </div>
      );
    }

    if (w.id === 'w1') {
      return (
        <div className="w-full h-full pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={mockDataLineBar} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      );
    }
    if (w.id === 'w2') {
      return (
        <div className="w-full h-full pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={mockDataLineBar} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0] as any} barSize={24} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    if (w.id === 'w3') {
      return (
        <div className="w-full h-full pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Pie data={mockDataPie} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">
                {mockDataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      );
    }
    if (w.id === 'w4') {
      return (
        <div className="w-full h-full pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsScatterChart margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis type="number" dataKey="x" name="X" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
              <YAxis type="number" dataKey="y" name="Y" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Scatter name="Dados" data={mockDataScatter} fill="#10b981" />
            </RechartsScatterChart>
          </ResponsiveContainer>
        </div>
      );
    }
    if (w.id === 'w5') {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full opacity-100 text-primary">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
            <Map className="w-6 h-6" />
          </div>
          <span className="text-[13px] font-medium text-foreground">Mapa Renderizado</span>
          <span className="text-[11px] text-muted mt-1 px-4 text-center">Conectado com base de dados geolocalizados</span>
        </div>
      );
    }
    if (w.id === 'w6') {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full opacity-100 text-primary">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-3">
            <CandlestickChart className="w-6 h-6" />
          </div>
          <span className="text-[13px] font-medium text-foreground">Série Financeira Renderizada</span>
          <span className="text-[11px] text-muted mt-1 px-4 text-center">Conectado com série temporal financeira</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[calc(100vh-140px)] relative overflow-x-hidden">
      
      {/* Catalog Sheet (Left) */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-full md:w-80 bg-card border-r border-border shadow-2xl transform transition-transform duration-300 z-50 flex flex-col",
          isCatalogOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-[14px] flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            Catálogo de Métricas
          </h3>
          <button 
            onClick={() => setIsCatalogOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Buscar métrica..." 
              className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-primary text-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {AVAILABLE_WIDGETS.map(widget => (
            <div 
              key={widget.id}
              onClick={() => addWidget(widget)}
              className="p-3 rounded-lg border border-border bg-background hover:border-primary hover:shadow-sm hover:bg-muted/5 cursor-pointer transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-md bg-muted/20 flex items-center justify-center flex-shrink-0 text-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <widget.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-foreground">{widget.title}</div>
                <div className="text-[12px] text-muted capitalize">{widget.type === 'kpi' ? 'Indicador' : 'Gráfico'}</div>
              </div>
              <button className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Overlay when catalog sheet is open */}
      {isCatalogOpen && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsCatalogOpen(false)}
        />
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-foreground">Meu Dashboard Customizado</h3>
            <p className="text-[12px] text-muted">Ajuste os blocos conforme necessidade.</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing && (
              <button 
                onClick={() => setIsCatalogOpen(true)}
                className="px-4 py-1.5 bg-background border border-primary text-primary text-[13px] font-medium rounded hover:bg-primary/5 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Widget
              </button>
            )}
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-1.5 bg-primary text-primary-foreground text-[13px] font-medium rounded hover:bg-primary/90 transition-colors"
            >
              {isEditing ? 'Visualizar Painel' : 'Editar Painel'}
            </button>
          </div>
        </div>

        <div ref={containerRef} className={cn(
          "flex-1 p-0 md:p-6 rounded-lg",
          isEditing ? "bg-muted/10 border-2 border-dashed border-border" : "bg-transparent p-0"
        )}>
          {widgets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <Columns className="w-8 h-8 text-muted" />
              </div>
              <p className="text-[14px] font-medium text-foreground mb-1">Nenhum widget adicionado</p>
              <p className="text-[12px] text-muted">Selecione métricas no catálogo para começar a popular seu dashboard.</p>
            </div>
          ) : (
            <ResponsiveGridLayout
              width={width}
              className="layout -mx-2"
              layouts={{ lg: widgets.map(w => w.layout) }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={80}
              onLayoutChange={onLayoutChange}
              dragConfig={{ enabled: isEditing, handle: '.drag-handle' }}
              resizeConfig={{ enabled: isEditing }}
              margin={[16, 16]}
            >
              {widgets.map(w => (
                <div key={w.instanceId} data-grid={w.layout}>
                  <Card 
                    className="relative group bg-card h-full w-full flex flex-col shadow-sm overflow-hidden"
                  >
                    <div className="p-4 flex flex-col h-full overflow-hidden">
                      <div className="flex justify-between items-center mb-2 flex-shrink-0">
                        <div className="flex items-center gap-2 text-muted truncate">
                          <w.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-[12px] font-semibold uppercase tracking-wider truncate">{w.title}</span>
                        </div>
                        {isEditing && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-card shadow-sm rounded-md p-0.5 border border-border">
                            <button 
                              onClick={() => setActiveConfigWidget(w.instanceId)}
                              className="w-6 h-6 flex items-center justify-center text-muted hover:text-foreground hover:bg-muted rounded cursor-pointer"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                            <button className="drag-handle w-6 h-6 flex items-center justify-center text-muted hover:text-foreground hover:bg-muted rounded cursor-move">
                              <Move className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => removeWidget(w.instanceId)}
                              className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
                        {renderChart(w)}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </div>
      </div>

      {/* Configuration Sheet (Right Medium) */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-card border-l border-border shadow-2xl transform transition-transform duration-300 z-50 flex flex-col",
          activeConfigWidget ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-[14px]">Conectar Dados</h3>
          </div>
          <button 
            onClick={() => setActiveConfigWidget(null)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-5 relative">
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Fonte de Dados (Source)</label>
              <div className="relative">
                <Server className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <select className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-primary text-foreground appearance-none">
                  <option>Selecione uma fonte...</option>
                  <option>Banco de Dados Principal (PostgreSQL)</option>
                  <option>Data Warehouse (BigQuery)</option>
                  <option>API Externa (Zendesk/Salesforce)</option>
                  <option>Planilha (Google Sheets)</option>
                </select>
              </div>
              <p className="text-[11px] text-muted mt-1.5">Escolha de onde os dados deste widget serão extraídos.</p>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Métrica (Y-Axis / Value)</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-primary text-foreground">
                <option>Selecione...</option>
                <option>Volume de Contatos</option>
                <option>CSAT Médio</option>
                <option>FCR (%)</option>
                <option>Taxa de Retenção</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Dimensão (X-Axis / Categoria)</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-primary text-foreground">
                <option>Selecione...</option>
                <option>Data / Tempo</option>
                <option>Canal de Atendimento</option>
                <option>Fila / Motivo</option>
                <option>Operador</option>
              </select>
            </div>
            
            <div className="pt-4 border-t border-border">
              <label className="block text-[13px] font-medium text-foreground mb-1.5">Filtros Específicos</label>
              <button className="w-full py-2 bg-muted/20 border border-dashed border-border rounded-md text-[12px] text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                Adicionar Filtro
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-3">
          <button 
            onClick={() => setActiveConfigWidget(null)}
            className="px-4 py-2 bg-background border border-border text-foreground text-[13px] font-medium rounded-md hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={applyConfig}
            className="px-4 py-2 bg-primary text-primary-foreground text-[13px] font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Aplicar Dados
          </button>
        </div>
      </div>
      
      {/* Overlay when config sheet is open */}
      {activeConfigWidget && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
          onClick={() => setActiveConfigWidget(null)}
        />
      )}

    </div>
  );
}
