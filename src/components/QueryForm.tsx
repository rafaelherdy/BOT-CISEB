import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  FileText, 
  Layers, 
  CheckSquare, 
  AlertCircle, 
  HelpCircle,
  GraduationCap,
  BookMarked,
  Compass,
  ShieldCheck
} from 'lucide-react';
import { DocumentType, SearchQuery } from '../types/curriculum.ts';

interface QueryFormProps {
  onSearch: (query: SearchQuery) => void;
  isLoading: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSearch, isLoading }) => {
  const [stage, setStage] = useState<string>('Ensino Fundamental - Anos Finais');
  const [component, setComponent] = useState<string>('Tecnologia e Inovação / Computação');
  const [theme, setTheme] = useState<string>('Algoritmos e Pensamento Computacional');
  const [docType, setDocType] = useState<DocumentType>('plano_de_aula');
  const [exactCode, setExactCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const sampleThemes = [
    { label: 'Algoritmos e Programação em Blocos', stage: 'Ensino Fundamental - Anos Finais', comp: 'Tecnologia e Inovação / Computação' },
    { label: 'Robótica Sustentável e Sucata (Amazônia)', stage: 'Ensino Fundamental - Anos Finais', comp: 'Tecnologia e Inovação / Computação' },
    { label: 'Conectividade e Computação Desplugada no Pará', stage: 'Ensino Fundamental - Anos Finais', comp: 'Tecnologia e Inovação / Computação' },
    { label: 'Inteligência Artificial e Ética', stage: 'Ensino Médio', comp: 'Tecnologia e Inovação / Computação' },
    { label: 'SOME e Inovação Territorial', stage: 'Ensino Médio', comp: 'Tecnologia e Inovação / Computação' },
    { label: 'Mídias Digitais e Checagem de Fatos', stage: 'Ensino Fundamental - Anos Finais', comp: 'Língua Portuguesa' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!stage.trim()) {
      setErrorMsg('Por favor, selecione o ano/série ou a etapa de ensino.');
      return;
    }

    if (!component.trim()) {
      setErrorMsg('Por favor, selecione o componente curricular.');
      return;
    }

    if (!theme.trim() && !exactCode.trim()) {
      setErrorMsg('Por favor, informe um tema, objeto de conhecimento ou código da habilidade.');
      return;
    }

    onSearch({
      stage,
      component,
      theme: theme.trim(),
      docType,
      exactCode: exactCode.trim(),
    });
  };

  const handleApplyPreset = (preset: typeof sampleThemes[0]) => {
    setTheme(preset.label);
    setStage(preset.stage);
    setComponent(preset.comp);
    setExactCode('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 transition-all">
      {/* Banner de apresentação da tela inicial */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-2.5">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
          <span>Planejamento Curricular Alinhado à SEDUC-PA</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Consulta de Documentos Oficiais e Planejamento Pedagógico
        </h2>
        <p className="text-slate-600 text-sm mt-1 max-w-3xl leading-relaxed">
          Preencha os campos abaixo para recuperar as habilidades homologadas da <strong className="text-slate-800">BNCC</strong>, do <strong className="text-slate-800">Currículo Paraense</strong>, das <strong className="text-slate-800">Normas de Computação (MEC, 2022)</strong> e das <strong className="text-slate-800">Diretrizes da SEDUC-PA</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grade com os 3 primeiros campos obrigatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Ano/série ou etapa de ensino */}
          <div className="space-y-1.5">
            <label htmlFor="stage-select" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Ano / Série ou Etapa de Ensino <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="stage-select"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="Ensino Fundamental - Anos Iniciais">Ensino Fundamental — Anos Iniciais (1º ao 5º ano)</option>
                <option value="Ensino Fundamental - Anos Finais">Ensino Fundamental — Anos Finais (6º ao 9º ano)</option>
                <option value="Ensino Médio">Ensino Médio (1ª a 3ª série)</option>
                <option value="Educação Infantil">Educação Infantil</option>
                <option value="EJA">EJA — Educação de Jovens e Adultos</option>
                <option value="Educação Escolar Indígena / Quilombola">Educação Escolar Indígena / Quilombola</option>
                <option value="Todas as Etapas">Todas as Etapas (Busca ampla)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Filtra habilidades específicas para a faixa etária</p>
          </div>

          {/* 2. Componente curricular */}
          <div className="space-y-1.5">
            <label htmlFor="component-select" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Componente Curricular <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="component-select"
                value={component}
                onChange={(e) => setComponent(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="Tecnologia e Inovação / Computação">Tecnologia e Inovação / Computação</option>
                <option value="Língua Portuguesa">Língua Portuguesa / Linguagens</option>
                <option value="Matemática">Matemática e suas Tecnologias</option>
                <option value="Ciências da Natureza">Ciências da Natureza</option>
                <option value="Ciências Humanas e Sociais Aplicadas">Ciências Humanas / História / Geografia</option>
                <option value="Arte">Arte / Educação Maker</option>
                <option value="Todos os Componentes">Todos os componentes curriculares</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <BookMarked className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Área do conhecimento normatizada</p>
          </div>

          {/* 3. Tema ou objeto de conhecimento */}
          <div className="space-y-1.5">
            <label htmlFor="theme-input" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Tema ou Objeto de Conhecimento <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="theme-input"
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: algoritmos, robótica, IA, redes..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all placeholder:text-slate-400"
                required
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Palavras-chave ou conceito a ser trabalhado</p>
          </div>
        </div>

        {/* Sugestões rápidas de temas para facilitar a consulta pelo docente */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Sugestões Rápidas de Temas Oficiais:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleThemes.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  theme === preset.label
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 font-medium'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Tipo de documento e Código Opcional */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            4. Tipo de Documento Pedagógico a Elaborar <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Opção 1: Plano de Aula */}
            <label
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                docType === 'plano_de_aula'
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="docType"
                value="plano_de_aula"
                checked={docType === 'plano_de_aula'}
                onChange={() => setDocType('plano_de_aula')}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className={`w-4 h-4 ${docType === 'plano_de_aula' ? 'text-blue-700' : 'text-slate-500'}`} />
                  Plano de Aula
                </span>
                <span className={`w-3.5 h-3.5 rounded-full border-2 ${docType === 'plano_de_aula' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`} />
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Estrutura modular de 50 ou 100 min com objetivos, momentos didáticos e rubricas de avaliação.
              </p>
            </label>

            {/* Opção 2: Sequência Didática */}
            <label
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                docType === 'sequencia_didatica'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="docType"
                value="sequencia_didatica"
                checked={docType === 'sequencia_didatica'}
                onChange={() => setDocType('sequencia_didatica')}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className={`w-4 h-4 ${docType === 'sequencia_didatica' ? 'text-emerald-700' : 'text-slate-500'}`} />
                  Sequência Didática
                </span>
                <span className={`w-3.5 h-3.5 rounded-full border-2 ${docType === 'sequencia_didatica' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`} />
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Percurso investigativo de 4 semanas com etapas integradas, prototipagem maker e mostra discente.
              </p>
            </label>

            {/* Opção 3: Alinhamento Curricular */}
            <label
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                docType === 'alinhamento_curricular'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="docType"
                value="alinhamento_curricular"
                checked={docType === 'alinhamento_curricular'}
                onChange={() => setDocType('alinhamento_curricular')}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className={`w-4 h-4 ${docType === 'alinhamento_curricular' ? 'text-indigo-700' : 'text-slate-500'}`} />
                  Alinhamento Curricular
                </span>
                <span className={`w-3.5 h-3.5 rounded-full border-2 ${docType === 'alinhamento_curricular' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`} />
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Matriz vertical e horizontal relacionando habilidades, objetos de conhecimento e indicadores SEDUC.
              </p>
            </label>
          </div>
        </div>

        {/* Busca direta opcional por código oficial */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Deseja buscar diretamente por um código oficial?</span>
            <span className="block text-[11px] text-slate-500">Exemplos: EF06CO01, PA-EF08CO03, EM13CO01, EF06CI02</span>
          </div>
          <div className="w-full sm:w-56 shrink-0">
            <input
              type="text"
              value={exactCode}
              onChange={(e) => setExactCode(e.target.value.toUpperCase())}
              placeholder="Código oficial exato..."
              className="w-full uppercase font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Mensagem de Erro de Validação de Formulário */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Botão Principal de Submissão com Texto Exato do Requisito */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Garantia de fidelidade literal aos documentos homologados pelo CNE e SEDUC-PA.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#003865] to-[#047857] hover:from-[#002a4d] hover:to-[#035e44] text-white text-sm font-bold shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Consultando documentos oficiais...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-emerald-300" />
                <span>Consultar documentos oficiais</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
