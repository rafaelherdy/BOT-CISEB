import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Clock, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Leaf, 
  WifiOff, 
  ShieldAlert,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { PedagogicalProposal, DocumentType } from '../types/curriculum.ts';

interface PedagogicalProposalViewProps {
  proposal: PedagogicalProposal;
}

export const PedagogicalProposalView: React.FC<PedagogicalProposalViewProps> = ({ proposal }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'roteiro' | 'recursos' | 'avaliacao' | 'todos'>('todos');

  const handleCopyAll = () => {
    let fullText = `=========================================================\n`;
    fullText += `BOT CISEB — GUIA DE TECNOLOGIA E INOVAÇÃO DO PARÁ\n`;
    fullText += `SEDUC-PA | Centro de Inovação para a Educação Básica\n`;
    fullText += `=========================================================\n\n`;
    fullText += `TÍTULO: ${proposal.title}\n`;
    fullText += `TIPO: ${proposal.type.toUpperCase()}\n`;
    fullText += `ETAPA: ${proposal.targetStage}\n`;
    fullText += `COMPONENTE: ${proposal.component}\n`;
    fullText += `TEMA: ${proposal.theme}\n`;
    fullText += `DURAÇÃO ESTIMADA: ${proposal.estimatedDuration}\n`;
    fullText += `DATA DE ELABORAÇÃO: ${proposal.generatedAt}\n\n`;

    fullText += `--- HABILIDADES OFICIAIS VALIDADAS ---\n`;
    proposal.validatedSkills.forEach(skill => {
      fullText += `[${skill.code}] ${skill.originalText}\n`;
      fullText += `Fonte: ${skill.documentSource} (${skill.legalAct}) | ${skill.yearOrGrade}\n\n`;
    });

    fullText += `--- OBJETIVO GERAL ---\n${proposal.generalObjective}\n\n`;

    fullText += `--- OBJETIVOS ESPECÍFICOS ---\n`;
    proposal.specificObjectives.forEach((obj, idx) => {
      fullText += `${idx + 1}. ${obj}\n`;
    });

    fullText += `\n--- DESENVOLVIMENTO METODOLÓGICO ---\n`;
    proposal.steps.forEach((step, idx) => {
      fullText += `\n[${step.title} - ${step.duration}]\n`;
      fullText += `Descrição: ${step.description}\n`;
      fullText += `Papel do Professor: ${step.teacherRole}\n`;
      fullText += `Papel do Estudante: ${step.studentRole}\n`;
      if (step.amazonianContextTip) {
        fullText += `Contexto Amazônico/Pará: ${step.amazonianContextTip}\n`;
      }
    });

    fullText += `\n--- RECURSOS PEDAGÓGICOS ---\n`;
    fullText += `Plugados: ${proposal.requiredResources.plugged.join('; ')}\n`;
    fullText += `Desplugados: ${proposal.requiredResources.unplugged.join('; ')}\n`;
    fullText += `Regionais/Sustentáveis: ${proposal.requiredResources.amazonianOrRecyclable.join('; ')}\n`;

    fullText += `\n--- AVALIAÇÃO E RUBRICAS ---\n`;
    proposal.evaluationCriteria.forEach(crit => {
      fullText += `• ${crit.indicator}: ${crit.description} [Instrumento: ${crit.instrument}]\n`;
    });

    fullText += `\n--- NOTA LEGAL E DE CONFORMIDADE ---\n${proposal.legalNotice}\n`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${proposal.title}\n\n`;
    md += `**Documento Técnico CISEB / SEDUC-PA**\n\n`;
    md += `* **Tipo:** ${proposal.type}\n`;
    md += `* **Etapa:** ${proposal.targetStage}\n`;
    md += `* **Componente:** ${proposal.component}\n`;
    md += `* **Duração:** ${proposal.estimatedDuration}\n`;
    md += `* **Elaborado em:** ${proposal.generatedAt}\n\n`;

    md += `## Habilidades Oficiais Homologadas\n\n`;
    proposal.validatedSkills.forEach(s => {
      md += `* **${s.code}**: "${s.originalText}"  \n  *Documento: ${s.documentSource} (${s.legalAct})*\n\n`;
    });

    md += `## Objetivo Geral\n\n${proposal.generalObjective}\n\n`;
    md += `## Objetivos Específicos\n\n`;
    proposal.specificObjectives.forEach(o => {
      md += `* ${o}\n`;
    });

    md += `\n## Roteiro Didático\n\n`;
    proposal.steps.forEach(st => {
      md += `### ${st.title} (${st.duration})\n\n`;
      md += `${st.description}\n\n`;
      md += `* **Mediação Docente:** ${st.teacherRole}\n`;
      md += `* **Atividade Discente:** ${st.studentRole}\n`;
      if (st.amazonianContextTip) {
        md += `* **Contexto Territorial do Pará:** ${st.amazonianContextTip}\n`;
      }
      md += `\n`;
    });

    md += `## Recursos e Infraestrutura\n\n`;
    md += `* **Plugados:** ${proposal.requiredResources.plugged.join(', ')}\n`;
    md += `* **Desplugados:** ${proposal.requiredResources.unplugged.join(', ')}\n`;
    md += `* **Sustentáveis/Amazônicos:** ${proposal.requiredResources.amazonianOrRecyclable.join(', ')}\n\n`;

    md += `## Avaliação e Rubricas\n\n`;
    proposal.evaluationCriteria.forEach(c => {
      md += `* **${c.indicator}:** ${c.description} *(Instrumento: ${c.instrument})*\n`;
    });

    md += `\n---\n*${proposal.legalNotice}*\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BOT_CISEB_${proposal.type}_${proposal.validatedSkills.map(s => s.code).join('_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getDocTypeBadge = (type: DocumentType) => {
    switch (type) {
      case 'plano_de_aula':
        return { label: 'Plano de Aula Oficial', color: 'bg-blue-100 text-blue-900 border-blue-200' };
      case 'sequencia_didatica':
        return { label: 'Sequência Didática Investigativa', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
      case 'alinhamento_curricular':
        return { label: 'Matriz de Alinhamento Curricular', color: 'bg-indigo-100 text-indigo-900 border-indigo-200' };
    }
  };

  const docTypeBadge = getDocTypeBadge(proposal.type);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6 print:shadow-none print:border-none print:m-0">
      {/* Top Banner de Identificação da Proposta */}
      <div className="bg-slate-50 border-b border-slate-200 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${docTypeBadge.color}`}>
              {docTypeBadge.label}
            </span>
            <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              ID: {proposal.id}
            </span>
            <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {proposal.estimatedDuration}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {proposal.title}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Componente: <span className="font-semibold text-slate-800">{proposal.component}</span> | Etapa: <span className="font-semibold text-slate-800">{proposal.targetStage}</span>
          </p>
        </div>

        {/* Botões de Ação: Imprimir, Copiar, Exportar */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 print:hidden">
          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiar Texto</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Baixar .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#003865] hover:bg-[#002b49] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-200" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Rótulo de Validação Exclusiva */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Proposta Baseada Exclusivamente nas Habilidades Validadas:</strong>{' '}
            {proposal.validatedSkills.map(s => s.code).join(', ')}
          </span>
        </div>
        <span className="hidden sm:inline font-semibold text-emerald-800 text-[11px]">
          SEDUC-PA / CISEB Conforme
        </span>
      </div>

      {/* Conteúdo Detalhado da Proposta */}
      <div className="p-5 sm:p-8 space-y-8">
        {/* Seção 1: Objetivos Curriculares */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center font-mono">
              01
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Objetivos de Aprendizagem & Metodologia
            </h3>
          </div>

          <div className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Objetivo Geral Homologado
              </span>
              <p className="text-sm font-semibold text-slate-900 mt-1 leading-relaxed">
                {proposal.generalObjective}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Objetivos Específicos Operacionais
              </span>
              <ul className="space-y-2">
                {proposal.specificObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-600">
              <Compass className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Abordagem Metodológica:</strong> {proposal.methodologicalApproach}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 2: Roteiro e Momentos Didáticos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">
                02
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Desenvolvimento Didático Passo a Passo
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {proposal.steps.length} {proposal.type === 'sequencia_didatica' ? 'etapas modulares' : 'momentos de aula'}
            </span>
          </div>

          <div className="space-y-4">
            {proposal.steps.map((step, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {step.duration}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      step.methodologyType === 'desplugada' 
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : step.methodologyType === 'plugada'
                        ? 'bg-blue-50 text-blue-900 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    }`}>
                      {step.methodologyType === 'desplugada' ? 'Desplugada' : step.methodologyType === 'plugada' ? 'Plugada' : 'Híbrida'}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                  {step.description}
                </p>

                {/* Papéis de Mediação */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100/70">
                    <span className="font-bold text-blue-950 block mb-0.5">Mediação do Professor(a):</span>
                    <span className="text-slate-700 leading-snug">{step.teacherRole}</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/70">
                    <span className="font-bold text-emerald-950 block mb-0.5">Atividade dos Estudantes:</span>
                    <span className="text-slate-700 leading-snug">{step.studentRole}</span>
                  </div>
                </div>

                {/* Dica Territorial Paraense / Amazônica */}
                {step.amazonianContextTip && (
                  <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                    <Leaf className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-amber-900 font-semibold">Contextualização Amazônica / SEDUC-PA:</strong>{' '}
                      {step.amazonianContextTip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Seção 3: Recursos Pedagógicos com Foco em Equidade Territorial */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 font-black text-xs flex items-center justify-center font-mono">
              03
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recursos Didáticos e Infraestrutura (Plugada, Desplugada e Regional)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recursos Plugados */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-700" />
                Recursos Plugados (Laboratório)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {proposal.requiredResources.plugged.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recursos Desplugados */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                Computação Desplugada (Sem Conexão)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {proposal.requiredResources.unplugged.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recursos Regionais / Sustentáveis */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                Materiais Regionais e Sucata Maker
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {proposal.requiredResources.amazonianOrRecyclable.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Seção 4: Critérios de Avaliação e Rubricas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-900 font-black text-xs flex items-center justify-center font-mono">
              04
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Avaliação Formativa e Indicadores de Aprendizagem
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase font-bold tracking-wider">
                  <th className="py-2.5 px-3 w-1/3">Indicador Observável</th>
                  <th className="py-2.5 px-3">Critério de Desempenho</th>
                  <th className="py-2.5 px-3 w-1/4">Instrumento Avaliativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposal.evaluationCriteria.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 align-top">
                      {c.indicator}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 align-top">
                      {c.description}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 align-top font-medium">
                      {c.instrument}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seção 5: Acessibilidade, Inclusão e SOME */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <span className="font-bold text-slate-900 block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Orientações de Inclusão, Acessibilidade e Equidade Territorial (SOME / Indígena / Quilombola):
          </span>
          <p className="leading-relaxed">
            {proposal.accessibilityAndInclusion}
          </p>
        </div>

        {/* Seção 6: NOTA TÉCNICA E REGRAS DE CONFIABILIDADE (OBRIGATÓRIO) */}
        <div className="p-4 rounded-xl border-2 border-slate-300 bg-slate-50/80 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-4 h-4 text-emerald-700" />
            <span>Nota Técnica de Rigor Documental e Autonomia Docente</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-600">
            {proposal.legalNotice}
          </p>
        </div>
      </div>
    </section>
  );
};
