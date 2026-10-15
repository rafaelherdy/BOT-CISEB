import React from 'react';
import { ShieldCheck, BookOpen, FileCheck, Layers, ExternalLink } from 'lucide-react';
import { getDocumentRepositoryStats } from '../services/documentEngine.ts';

interface HeaderProps {
  onOpenRepo: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRepo, onOpenRules }) => {
  const stats = getDocumentRepositoryStats();

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      {/* Barra institucional SEDUC-PA */}
      <div className="bg-gradient-to-r from-[#002b49] via-[#003865] to-[#05513a] text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[11px] sm:text-xs">
              Governo do Estado do Pará — Secretaria de Estado de Educação (SEDUC-PA)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-200">
            <span className="hidden md:inline font-mono">CISEB — Centro de Inovação para a Educação Básica</span>
            <span className="bg-emerald-600/60 px-2 py-0.5 rounded text-[10px] font-medium tracking-wider text-emerald-100">
              Versão 2.4 Homologada
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal do Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Logo CISEB Emblem */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#003865] to-[#047857] flex items-center justify-center text-white shadow-md shadow-emerald-950/15 shrink-0 border border-white/20">
              <span className="font-black text-xl tracking-tighter text-white font-mono">PA</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  BOT CISEB
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Guia Oficial
                  </span>
                </h1>
              </div>
              <p className="text-sm font-medium text-slate-600 mt-0.5">
                Assistente técnico de tecnologia, inovação e currículo da rede estadual de ensino do Pará
              </p>
            </div>
          </div>

          {/* Ações e Status da Base */}
          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            <button
              onClick={onOpenRepo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Ver documentos e PDFs oficiais conectados"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>Base Oficial: {stats.connectedCount} Documentos</span>
            </button>

            <button
              onClick={onOpenRules}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold transition-colors cursor-pointer"
              title="Regras estritas de confiabilidade documental"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Confiabilidade Normativa</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
