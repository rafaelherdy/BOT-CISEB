import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertOctagon, FileCheck, Ban } from 'lucide-react';
import { NOT_FOUND_STANDARD_MESSAGE } from '../data/officialCurriculumDatabase.ts';

interface ReliabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReliabilityModal: React.FC<ReliabilityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    {
      number: '1',
      title: 'Não inventar códigos, habilidades ou referências',
      desc: 'O BOT CISEB é estritamente proibido de gerar códigos alfanuméricos fictícios ou criar textos pedagógicos simulando serem da BNCC ou do Currículo Paraense.',
      status: 'Bloqueio Algorítmico Ativo',
    },
    {
      number: '2',
      title: 'Preservação integral dos textos oficiais (Verbatim)',
      desc: 'Toda habilidade transcrita preserva integralmente a pontuação, grafia e redação homologada nos pareceres e resoluções do CNE e do CEE-PA.',
      status: 'Conformidade Legal Estrita',
    },
    {
      number: '3',
      title: 'Não apresentar conteúdo gerado pela IA como citação oficial',
      desc: 'Há uma demarcação clara e visual entre o que é lei/norma (a habilidade na tabela prévia) e o que é sugestão didática de apoio elaborada pelo assistente (proposta pedagógica posterior).',
      status: 'Transparência Metodológica',
    },
    {
      number: '4',
      title: 'Resposta padrão mandatória quando não localizado',
      desc: `Caso uma consulta não encontre correspondência exata nos atos homologados, o sistema emite obrigatoriamente a frase: “${NOT_FOUND_STANDARD_MESSAGE}”`,
      status: 'Resposta Normativa Oficial',
    },
    {
      number: '5',
      title: 'Não simular consultas a arquivos não conectados',
      desc: 'O sistema apenas efetua consultas sobre os documentos efetivamente indexados na base oficial ou carregados expressamente pelo usuário.',
      status: 'Integridade de Dados',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center border border-emerald-700">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Regras de Confiabilidade do BOT CISEB</h3>
              <p className="text-xs text-emerald-200">
                Diretrizes de fidelidade documental e integridade da rede estadual do Pará
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com as 5 Regras */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Para garantir a segurança jurídica e a seriedade pedagógica das decisões dos professores e equipes gestoras da SEDUC-PA, o BOT CISEB opera sob cinco princípios inegociáveis:
          </p>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div 
                key={rule.number}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                      {rule.number}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {rule.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {rule.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
