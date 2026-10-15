import React, { useState } from 'react';
import { 
  FileCheck2, 
  Copy, 
  Check, 
  AlertTriangle, 
  Info, 
  Download, 
  BadgeCheck, 
  ExternalLink,
  BookOpenCheck,
  Tag
} from 'lucide-react';
import { CurriculumSkill } from '../types/curriculum.ts';
import { NOT_FOUND_STANDARD_MESSAGE } from '../data/officialCurriculumDatabase.ts';

interface OfficialSkillsTableProps {
  skills: CurriculumSkill[];
  notFoundMessage?: string;
  selectedSkills: string[];
  onToggleSkill: (code: string) => void;
  onSelectAll: () => void;
}

export const OfficialSkillsTable: React.FC<OfficialSkillsTableProps> = ({
  skills,
  notFoundMessage,
  selectedSkills,
  onToggleSkill,
  onSelectAll,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyVerbatim = (skill: CurriculumSkill) => {
    const textToCopy = `[${skill.code}] ${skill.originalText} (Fonte: ${skill.documentSource}, ${skill.legalAct}, ${skill.yearOrGrade})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(skill.code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Se não foi localizada nenhuma habilidade na base
  if (!skills || skills.length === 0) {
    return (
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-6 sm:p-8 my-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-800" />
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Resultado da Verificação Curricular
              </span>
              {/* O texto exato exigido na especificação */}
              <h3 className="text-base sm:text-lg font-bold text-amber-950 mt-1.5 leading-snug">
                “{notFoundMessage || NOT_FOUND_STANDARD_MESSAGE}”
              </h3>
            </div>
            
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              Em estrita conformidade com as <strong className="font-semibold">Regras de Confiabilidade do BOT CISEB</strong>, o sistema <em>não gera códigos fictícios</em> e <em>não apresenta suposições como citação oficial</em>. A proposta pedagógica só é elaborada a partir de habilidades homologadas registradas nos documentos oficiais da rede estadual do Pará e da União.
            </p>

            <div className="bg-white/80 rounded-xl p-3.5 border border-amber-200/80 text-xs text-slate-700 space-y-1.5">
              <span className="font-semibold text-slate-800 block">Dicas para localizar a habilidade oficial:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Utilize termos amplos de computação como <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">algoritmo</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">desplugada</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">robótica</code> ou <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">dados</code>.</li>
                <li>Se souber o código oficial homologado, digite-o diretamente no campo específico (ex: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">EF06CO01</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">PA-EF06CO01</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">EM13CO01</code>).</li>
                <li>Abra o painel "Base Oficial" no topo para consultar todos os 5 documentos e resoluções conectados.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6">
      {/* Cabeçalho Obrigatório da Tabela */}
      <div className="bg-gradient-to-r from-slate-900 via-[#002b49] to-[#044c37] p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                Habilidades Oficiais Homologadas e Validadas
              </span>
              <span className="text-xs text-slate-300">
                ({skills.length} {skills.length === 1 ? 'habilidade localizada' : 'habilidades localizadas'})
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              Tabela de Correspondência Documental Obrigatória
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Exibição prévia obrigatória antes da elaboração pedagógica. Textos literais preservados na íntegra.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onSelectAll}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-colors cursor-pointer"
            >
              {selectedSkills.length === skills.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
            </button>
          </div>
        </div>
      </div>

      {/* Nota de Integridade */}
      <div className="bg-blue-50/60 border-b border-blue-100 px-4 sm:px-6 py-2.5 text-xs text-blue-900 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Preservação Integral:</strong> Os textos abaixo são transcrições exatas dos atos normativos oficiais (Resoluções CNE/CP e CEE/PA).
          </span>
        </div>
        <span className="text-[11px] text-blue-700 font-mono hidden md:inline">
          Rigor Art. 2º da Resolução CNE/CP 1/2022
        </span>
      </div>

      {/* Tabela Responsiva com as 4 colunas estritas especificadas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4 w-12 text-center">Uso</th>
              <th className="py-3 px-3 sm:px-4 w-32 sm:w-36">Código</th>
              <th className="py-3 px-4 sm:px-6">Texto Original do Documento</th>
              <th className="py-3 px-4 w-52 sm:w-64">Documento de Origem</th>
              <th className="py-3 px-3 sm:px-4 w-36 sm:w-44">Ano / Etapa</th>
              <th className="py-3 px-3 w-16 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {skills.map((skill) => {
              const isSelected = selectedSkills.includes(skill.code);
              const isParaSkill = skill.code.startsWith('PA-') || skill.code.startsWith('CISEB') || skill.sourceId === 'curriculo_paraense';

              return (
                <tr 
                  key={skill.id}
                  className={`transition-colors ${
                    isSelected ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/40 text-slate-400'
                  }`}
                >
                  {/* Seleção para a Proposta */}
                  <td className="py-4 px-3 sm:px-4 text-center align-top">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSkill(skill.code)}
                      aria-label={`Incluir habilidade ${skill.code} na proposta`}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                  </td>

                  {/* 1. Coluna Código */}
                  <td className="py-4 px-3 sm:px-4 align-top">
                    <div className="space-y-1">
                      <span className={`inline-block font-mono font-bold text-xs px-2.5 py-1 rounded-md border ${
                        isParaSkill
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-blue-50 text-blue-900 border-blue-300'
                      }`}>
                        {skill.code}
                      </span>
                      {isParaSkill && (
                        <span className="block text-[10px] font-semibold text-emerald-800 uppercase tracking-tight">
                          Currículo Pará
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 2. Coluna Texto Original do Documento */}
                  <td className="py-4 px-4 sm:px-6 align-top">
                    <div className="space-y-2">
                      <p className="text-slate-800 text-sm font-medium leading-relaxed font-sans">
                        “{skill.originalText}”
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <Tag className="w-3 h-3 text-slate-400" />
                          Eixo: {skill.thematicAxis}
                        </span>
                        {skill.pageReference && (
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {skill.pageReference}
                          </span>
                        )}
                        {skill.territorialContext && (
                          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {skill.territorialContext}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 3. Coluna Documento de Origem */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-900 block leading-snug">
                        {skill.documentSource}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {skill.legalAct}
                      </span>
                    </div>
                  </td>

                  {/* 4. Coluna Ano/Etapa */}
                  <td className="py-4 px-3 sm:px-4 align-top">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-800 block">
                        {skill.yearOrGrade}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {skill.stage}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {skill.component}
                      </span>
                    </div>
                  </td>

                  {/* Ações: Copiar citação literal */}
                  <td className="py-4 px-3 text-center align-top">
                    <button
                      onClick={() => handleCopyVerbatim(skill)}
                      title="Copiar citação literal oficial"
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    >
                      {copiedCode === skill.code ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rodapé da Tabela */}
      <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
        <div>
          <span>
            {selectedSkills.length} de {skills.length} habilidade(s) selecionada(s) para a proposta pedagógica a seguir.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-700">Autenticidade Curricular Garantida</span>
        </div>
      </div>
    </div>
  );
};
