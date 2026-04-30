import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Métricas de negócio base do usuário
export const filterStructure = [
  {
    id: "interlocutor",
    name: "Tipo interlocutor",
    options: [
      { id: "aluno", label: "Aluno" },
      { id: "nao_aluno", label: "Não aluno" },
      { id: "pendente_interlocutor", label: "* classificação pendente" }
    ]
  },
  {
    id: "intent_bu",
    name: "Classificação da intenção (BU)",
    options: [
      { id: "cursos_prep", label: "Cursos preparatórios" },
      { id: "ensino_superior", label: "Ensino superior" },
      { id: "pendente_intent", label: "* classificação pendente" }
    ]
  },
  {
    id: "product",
    name: "Classificação do produto",
    options: [
      { id: "assinatura_ilimitada", label: "Assinatura Ilimitada" },
      { id: "cursos_avulsos", label: "Cursos avulsos" },
      { id: "graduacao_digital", label: "Graduação Digital (EAD)" },
      { id: "pos_graduacao", label: "Pós-graduação/MBA (EAD)" },
      { id: "graduacao_presencial", label: "Graduação Presencial" },
      { id: "gran_questoes", label: "Gran Questões" },
      { id: "assinatura_oab", label: "Assinatura OAB" },
      { id: "assinatura_residencias", label: "Assinatura Residências" },
      { id: "coaching", label: "Coaching e Mentoria" },
      { id: "gran_dicas", label: "Gran Dicas" },
      { id: "pendente_produto", label: "* classificação pendente" }
    ]
  },
  {
    id: "subject",
    name: "Classificação do assunto",
    options: [
      { id: "cursos_preparacao", label: "Cursos e preparação" },
      { id: "cancelamento", label: "Cancelamento ou trancamento" },
      { id: "uso_plataforma", label: "Uso da plataforma" },
      { id: "regularizacao_pagamento", label: "Regularização de pagamento" },
      { id: "problemas_tecnicos", label: "Problemas técnicos de plataforma ou aplicativos" },
      { id: "renovacao", label: "Renovação de assinatura ou contrato" },
      { id: "regras_institucionais", label: "Regras institucionais" },
      { id: "rematricula", label: "Rematrícula" },
      { id: "ouvidoria", label: "Ouvidoria" },
      { id: "grade_conteudo", label: "Grade e conteúdo" },
      { id: "concursos", label: "Concursos e carreiras" },
      { id: "dilacao", label: "Dilação" },
      { id: "professores", label: "Professores e mentores" },
      { id: "pendente_assunto", label: "* classificação pendente" }
    ]
  },
  {
    id: "status",
    name: "Status Sessão",
    options: [
      { id: "transferido", label: "Transferido" },
      { id: "abandonado", label: "Abandonado" },
      { id: "retido", label: "Retido" },
      { id: "pendente_status", label: "* classificação pendente" }
    ]
  },
  {
    id: "fallback",
    name: "Fallback de entendimento do bot",
    options: [
      { id: "ok", label: "OK" },
      { id: "nao_entendimento", label: "Não entendimento" }
    ]
  }
];

interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, string[]>;
}

interface DashboardContextProps {
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  filterScale: number; // A generic multiplier to simulate filtering on mock data
  savedFilters: SavedFilter[];
  setSavedFilters: React.Dispatch<React.SetStateAction<SavedFilter[]>>;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Inicialmente, tudo selecionado ou nada (nada = 100%)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
    try {
      const item = window.localStorage.getItem('savedFilters');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [savedFilters]);

  const filterScale = useMemo(() => {
    let scale = 1;

    filterStructure.forEach(cat => {
      const selectedCount = selectedFilters[cat.id] ? selectedFilters[cat.id].length : 0;
      if (selectedCount > 0) {
        // Assume options are roughly equal weighted for demo
        scale = scale * (selectedCount / cat.options.length);
      }
    });

    // We keep a floor of 0.01 so it never completely disappears, and a ceiling of 1
    return Math.max(0.01, Math.min(1, scale));
  }, [selectedFilters]);

  return (
    <DashboardContext.Provider value={{ selectedFilters, setSelectedFilters, filterScale, savedFilters, setSavedFilters }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};
