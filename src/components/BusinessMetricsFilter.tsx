import React, { useState } from 'react';
import { Filter, X, Check, Save, ChevronDown } from 'lucide-react';
import { filterStructure, useDashboard } from '@/contexts/DashboardContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils'; // Make sure utils exists

export default function BusinessMetricsFilter() {
  const { selectedFilters, setSelectedFilters, savedFilters, setSavedFilters } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const [isSavedFiltersOpen, setIsSavedFiltersOpen] = useState(false);
  const [isSavingFilter, setIsSavingFilter] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    filterStructure.map(c => c.id)
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const toggleOption = (categoryId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const currentCategoryFilters = prev[categoryId] || [];
      if (currentCategoryFilters.includes(optionId)) {
        return {
          ...prev,
          [categoryId]: currentCategoryFilters.filter(id => id !== optionId)
        };
      } else {
        return {
          ...prev,
          [categoryId]: [...currentCategoryFilters, optionId]
        };
      }
    });
  };

  const clearAll = () => {
    setSelectedFilters({});
  };

  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return;
    
    const newFilter = {
      id: Date.now().toString(),
      name: newFilterName.trim(),
      filters: { ...selectedFilters }
    };
    
    setSavedFilters(prev => [...prev, newFilter]);
    setNewFilterName("");
    setIsSavingFilter(false);
  };

  const loadFilter = (filter: any) => {
    setSelectedFilters(filter.filters);
  };

  const deleteSavedFilter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFilters(prev => prev.filter(f => f.id !== id));
  };

  let totalSelected = 0;
  Object.values(selectedFilters).forEach((curr) => {
    if (Array.isArray(curr)) {
      totalSelected += curr.length;
    }
  });

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto relative">
      {savedFilters.length > 0 && (
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsSavedFiltersOpen(!isSavedFiltersOpen)}
            className="flex items-center justify-between gap-2 px-3 py-2 h-auto text-sm font-medium border border-border rounded-lg bg-card hover:bg-accent/50 group w-full md:w-auto"
          >
            Filtros Salvos
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isSavedFiltersOpen ? "rotate-180" : "")} />
          </Button>

          {isSavedFiltersOpen && (
            <div className="absolute top-full left-0 mt-1 w-[200px] bg-popover border border-border rounded-md shadow-md z-50 py-1 text-popover-foreground">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Filtros Personalizados</div>
              <div className="h-px bg-border my-1" />
              {savedFilters.map((filter) => (
                <div 
                  key={filter.id} 
                  className="flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5 hover:bg-accent hover:text-accent-foreground text-sm"
                  onClick={() => {
                    loadFilter(filter);
                    setIsSavedFiltersOpen(false);
                  }}
                >
                  <span className="truncate">{filter.name}</span>
                  <div 
                    className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    onClick={(e) => deleteSavedFilter(filter.id, e)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer w-full justify-center md:w-auto md:justify-start",
            isOpen ? "bg-accent text-accent-foreground border-border" : "bg-card border-border hover:bg-accent/50 text-foreground"
          )}
        >
          <Filter className="w-4 h-4 text-muted-foreground" />
          Métricas de Negócio
          {totalSelected > 0 && (
            <Badge className="ml-1 px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
              {totalSelected}
            </Badge>
          )}
        </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-y-auto flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-xl">Filtros de Métricas</SheetTitle>
              <SheetDescription>
                Refine os dados exibidos nos dashboards por categorias de negócio.
              </SheetDescription>
            </div>
            {totalSelected > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-xs text-muted-foreground hover:text-foreground">
                Limpar tudo
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-card/50">
          <div className="flex flex-col gap-4">
            {filterStructure.map((category) => {
              const selectedInCategory = selectedFilters[category.id] || [];
              const isExpanded = expandedCategories.includes(category.id);
              
              return (
                <div key={category.id} className="flex flex-col gap-2 rounded-lg border border-border/50 bg-card overflow-hidden">
                  <button 
                    onClick={() => toggleCategory(category.id)}
                    className="flex flex-row items-center justify-between p-3.5 bg-muted/10 hover:bg-muted/30 transition-colors w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {category.name}
                      </h4>
                      {selectedInCategory.length > 0 && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                          {selectedInCategory.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
                  </button>
                  
                  {isExpanded && (
                    <div className="flex flex-col gap-1 px-3 pb-3 pt-1">
                      {category.options.map((option) => {
                        const isSelected = selectedInCategory.includes(option.id);
                        return (
                          <div
                            key={option.id}
                            onClick={() => toggleOption(category.id, option.id)}
                            className={cn(
                              "flex items-start gap-2.5 p-2 rounded-md cursor-pointer transition-colors group",
                              isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-accent/50"
                            )}
                          >
                            <div className={cn(
                              "mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                              isSelected 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "bg-card border-input group-hover:border-primary/50"
                            )}>
                              {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                            </div>
                            <span className={cn(
                              "text-xs leading-tight font-medium",
                              isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                              {option.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <SheetFooter className="p-6 border-t border-border bg-muted/20 sm:justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            {!isSavingFilter ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 text-xs h-9"
                onClick={() => setIsSavingFilter(true)}
                disabled={totalSelected === 0}
              >
                <Save className="w-4 h-4" />
                Salvar Filtro
              </Button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input 
                  value={newFilterName}
                  onChange={(e) => setNewFilterName(e.target.value)}
                  placeholder="Nome do filtro"
                  className="h-9 text-xs w-[180px]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveFilter();
                    if (e.key === 'Escape') setIsSavingFilter(false);
                  }}
                />
                <Button size="sm" className="h-9 px-3" onClick={handleSaveFilter}>OK</Button>
                <Button variant="ghost" size="sm" className="h-9 px-2" onClick={() => setIsSavingFilter(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          <Button onClick={() => setIsOpen(false)} className="h-9">
            Aplicar {totalSelected > 0 ? `(${totalSelected})` : 'Filtros'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </div>
  );
}
