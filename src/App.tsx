/**
 * BOT CISEB — Guia de Tecnologia e Inovação da Rede Estadual de Ensino do Pará
 * SEDUC-PA / CISEB
 */

import React, { useState } from 'react';
import { 
  Header 
} from './components/Header.tsx';
import { 
  QueryForm 
} from './components/QueryForm.tsx';
import { 
  OfficialSkillsTable 
} from './components/OfficialSkillsTable.tsx';
import { 
  PedagogicalProposalView 
} from './components/PedagogicalProposalView.tsx';
import { 
  DocumentRepositoryModal 
} from './components/DocumentRepositoryModal.tsx';
import { 
  ReliabilityModal 
} from './components/ReliabilityModal.tsx';

import { 
  SearchQuery, 
  SearchResult, 
  PedagogicalProposal, 
  CustomUploadedDocument,
  CurriculumSkill 
} from './types/curriculum.ts';
import { 
  queryOfficialCurriculum, 
  getDocumentRepositoryStats 
} from './services/documentEngine.ts';
import { 
  generatePedagogicalProposal 
} from './services/pedagogicalGenerator.ts';

import { 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  GraduationCap, 
  FileCheck2, 
  RefreshCw,
  Compass,
  ArrowDown
} from 'lucide-react';

export default function App() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [proposal, setProposal] = useState<PedagogicalProposal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRepoOpen, setIsRepoOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [customDocs, setCustomDocs] = useState<CustomUploadedDocument[]>([]);

  const stats = getDocumentRepositoryStats();

  const handleSearch = (query: SearchQuery) => {
    setIsLoading(true);
    setProposal(null);

    // Simula pequena latência para visualização de carregamento e consulta determinística
    setTimeout(() => {
      const result = queryOfficialCurriculum(query);
      setSearchResult(result);

      if (result.skills.length > 0) {
        // Seleciona todas as habilidades encontradas por padrão
        const allCodes = result.skills.map(s => s.code);
        setSelectedSkills(allCodes);

        // Gera a proposta pedagógica baseada nas habilidades validadas
        const generatedProposal = generatePedagogicalProposal(
          query.docType,
          result.skills,
          query.stage,
          query.component,
          query.theme
        );
        setProposal(generatedProposal);
      } else {
        setSelectedSkills([]);
        setProposal(null);
      }

      setIsLoading(false);
    }, 400);
  };

  const handleToggleSkill = (code: string) => {
    if (!searchResult) return;

    let updated: string[];
    if (selectedSkills.includes(code)) {
      // Evita desmarcar se for a única selecionada
      if (selectedSkills.length === 1) {
        return;
      }
      updated = selectedSkills.filter(c => c !== code);
    } else {
      updated = [...selectedSkills, code];
    }
    setSelectedSkills(updated);

    // Atualiza a proposta pedagógica com as habilidades ativas selecionadas
    const activeSkills = searchResult.skills.filter(s => updated.includes(s.code));
    if (activeSkills.length > 0) {
      const updatedProposal = generatePedagogicalProposal(
        searchResult.queryUsed.docType,
        activeSkills,
        searchResult.queryUsed.stage,
        searchResult.queryUsed.component,
        searchResult.queryUsed.theme
      );
      setProposal(updatedProposal);
    } else {
      setProposal(null);
    }
  };

  const handleSelectAll = () => {
    if (!searchResult) return;
    if (selectedSkills.length === searchResult.skills.length) {
      // Deixa pelo menos uma se possível
      setSelectedSkills([searchResult.skills[0].code]);
      const updatedProposal = generatePedagogicalProposal(
        searchResult.queryUsed.docType,
        [searchResult.skills[0]],
        searchResult.queryUsed.stage,
        searchResult.queryUsed.component,
        searchResult.queryUsed.theme
      );
      setProposal(updatedProposal);
    } else {
      const allCodes = searchResult.skills.map(s => s.code);
      setSelectedSkills(allCodes);
      const updatedProposal = generatePedagogicalProposal(
        searchResult.queryUsed.docType,
        searchResult.skills,
        searchResult.queryUsed.stage,
        searchResult.queryUsed.component,
        searchResult.queryUsed.theme
      );
      setProposal(updatedProposal);
    }
  };

  const handleAddCustomDoc = (doc: CustomUploadedDocument) => {
    setCustomDocs(prev => [...prev, doc]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* 1. Header Institucional Pará / CISEB */}
      <Header 
        onOpenRepo={() => setIsRepoOpen(true)} 
        onOpenRules={() => setIsRulesOpen(true)} 
      />

      {/* 2. Container Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Banner Institucional de Boas-Vindas */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003865] via-[#004b75] to-[#046a4e] text-white p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rede Estadual de Ensino do Pará • SEDUC-PA</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              BOT CISEB — Guia de Tecnologia e Inovação da Rede Estadual de Ensino do Pará
            </h1>

            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              Assistente técnico de tecnologia, inovação e currículo da rede estadual de ensino do Pará. Consulte documentos curriculares oficiais e elabore planos de aula, sequências didáticas e alinhamentos curriculares com estrita conformidade legal e contextualização amazônica.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-200">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                BNCC Computação (Res. 1/2022)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Currículo Paraense (Res. 001/2019 e 313/2021)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Metodologias Plugadas e Desplugadas
              </span>
            </div>
          </div>

          {/* Efeito decorativo sutil */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 3. Formulário de Consulta Oficial */}
        <section aria-label="Formulário de Consulta Oficial">
          <QueryForm 
            onSearch={handleSearch} 
            isLoading={isLoading} 
          />
        </section>

        {/* 4. Estado de Carregamento */}
        {isLoading && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-blue-600/20 border-t-blue-700 animate-spin" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                Consultando documentos oficiais na base homologada...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Verificando conformidade com a BNCC, o Currículo Paraense e as Diretrizes da SEDUC-PA sem inventar códigos ou referências.
              </p>
            </div>
          </div>
        )}

        {/* 5. Resultados: TABELA OBRIGATÓRIA PRIMEIRO, PROPOSTA PEDAGÓGICA DEPOIS */}
        {searchResult && !isLoading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Âncora indicando os resultados da busca */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-700" />
                <h2 className="text-lg font-bold text-slate-900">
                  Resultados da Consulta Documental Oficial
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {searchResult.skills.length} resultado(s) homologado(s)
              </span>
            </div>

            {/* MANDATÓRIO: A TABELA DEVE SER EXIBIDA ANTES DE QUALQUER PROPOSTA PEDAGÓGICA */}
            <OfficialSkillsTable 
              skills={searchResult.skills}
              notFoundMessage={searchResult.notFoundMessage}
              selectedSkills={selectedSkills}
              onToggleSkill={handleToggleSkill}
              onSelectAll={handleSelectAll}
            />

            {/* MANDATÓRIO: DEPOIS DA TABELA, APRESENTE A PROPOSTA SOLICITADA BASEADA NAS HABILIDADES VALIDADAS */}
            {proposal && selectedSkills.length > 0 && (
              <div className="pt-2">
                <PedagogicalProposalView proposal={proposal} />
              </div>
            )}
          </div>
        )}

        {/* Estado inicial quando nenhuma busca foi feita ainda */}
        {!searchResult && !isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 my-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 mx-auto flex items-center justify-center border border-blue-200">
              <Compass className="w-7 h-7 text-blue-700" />
            </div>
            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Pronto para consultar o currículo oficial
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Selecione a etapa de ensino, o componente curricular, o tema desejado e clique em <strong className="text-slate-800">“Consultar documentos oficiais”</strong> acima.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-4 text-xs text-left">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-1">1. Validação Estrita</span>
                <span className="text-slate-600">Códigos e redações verificados contra atos homologados do MEC e CEE-PA.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-1">2. Tabela Obrigatória</span>
                <span className="text-slate-600">Exibição de Código, Texto Original, Origem e Etapa antes de qualquer proposta.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-1">3. Proposta Didática</span>
                <span className="text-slate-600">Plano, sequência ou alinhamento com metodologias plugadas e desplugadas para o Pará.</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 6. Modais de Suporte e Transparência */}
      <DocumentRepositoryModal 
        isOpen={isRepoOpen} 
        onClose={() => setIsRepoOpen(false)} 
        customDocs={customDocs}
        onAddCustomDoc={handleAddCustomDoc}
      />

      <ReliabilityModal 
        isOpen={isRulesOpen} 
        onClose={() => setIsRulesOpen(false)} 
      />

      {/* 7. Footer Institucional */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-6 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#003865] flex items-center justify-center text-white font-mono font-bold text-xs">
              PA
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                BOT CISEB — Guia de Tecnologia e Inovação da Rede Estadual de Ensino do Pará
              </p>
              <p className="text-[11px] text-slate-500">
                Secretaria de Estado de Educação (SEDUC-PA) • Centro de Inovação para a Educação Básica (CISEB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <button 
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-blue-700 underline cursor-pointer"
            >
              Regras de Confiabilidade
            </button>
            <button 
              onClick={() => setIsRepoOpen(true)}
              className="hover:text-blue-700 underline cursor-pointer"
            >
              Documentos Conectados ({stats.connectedCount})
            </button>
            <span className="text-slate-400">|</span>
            <span>Belém / Pará</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
