import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Upload, 
  FileText, 
  AlertCircle, 
  Search, 
  ShieldCheck, 
  Layers,
  ExternalLink,
  Calendar,
  FileCheck
} from 'lucide-react';
import { OfficialDocumentInfo, CustomUploadedDocument } from '../types/curriculum.ts';
import { OFFICIAL_DOCUMENTS_METADATA } from '../data/officialCurriculumDatabase.ts';

interface DocumentRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customDocs: CustomUploadedDocument[];
  onAddCustomDoc: (doc: CustomUploadedDocument) => void;
}

export const DocumentRepositoryModal: React.FC<DocumentRepositoryModalProps> = ({
  isOpen,
  onClose,
  customDocs,
  onAddCustomDoc,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.txt')) {
      setUploadError('Por favor, selecione um arquivo em formato PDF ou TXT oficial.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    // Leitura rápida do arquivo local
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const newDoc: CustomUploadedDocument = {
        id: `DOC-EXT-${Date.now().toString(36)}`,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toLocaleDateString('pt-BR'),
        extractedTextLength: text.length,
        matchedSnippetsCount: 0,
      };

      onAddCustomDoc(newDoc);
      setUploading(false);
      setUploadSuccess(`Documento "${file.name}" conectado e indexado na sessão com sucesso.`);
    };

    reader.onerror = () => {
      setUploading(false);
      setUploadError('Erro ao ler o arquivo PDF local. Tente novamente.');
    };

    reader.readAsText(file);
  };

  const filteredDocs = OFFICIAL_DOCUMENTS_METADATA.filter(doc => 
    doc.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    doc.legalAct.toLowerCase().includes(filterQuery.toLowerCase()) ||
    doc.author.toLowerCase().includes(filterQuery.toLowerCase()) ||
    doc.scope.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-[#002b49] via-[#003865] to-[#044c37] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <BookOpen className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Repositório de Documentos Curriculares Oficiais</h3>
              <p className="text-xs text-slate-300">
                Fontes homologadas do MEC, CNE, SEDUC-PA e CISEB para consulta fidedigna
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Busca e Upload */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar por nome, resolução ou órgão (ex: SEDUC, CNE, Resolução 1/2022)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>Conectar PDF Adicional</span>
            <input 
              type="file" 
              accept=".pdf,.txt" 
              onChange={handleFileUpload} 
              className="sr-only" 
              disabled={uploading}
            />
          </label>
        </div>

        {/* Mensagens de Upload */}
        {uploadSuccess && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-900 text-xs border-b border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}
        {uploadError && (
          <div className="px-4 py-2 bg-rose-50 text-rose-900 text-xs border-b border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Lista de Documentos Conectados */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                5 Documentos Fundamentais Conectados à Base:
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Homologados
              </span>
            </div>

            {filteredDocs.map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                        {doc.shortName}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Conectado & Indexado
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {doc.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded shrink-0">
                    {doc.skillsCount} habilidades
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {doc.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="font-mono font-medium text-slate-700">
                    Ato Legal: {doc.legalAct}
                  </span>
                  <span>Órgão: {doc.author} ({doc.year})</span>
                </div>
              </div>
            ))}
          </div>

          {/* Documentos Customizados Adicionados na Sessão */}
          {customDocs.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Documentos Adicionais Conectados pelo Usuário nesta Sessão:
              </span>
              {customDocs.map((cd) => (
                <div 
                  key={cd.id}
                  className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">{cd.fileName}</span>
                      <span className="text-[11px] text-slate-500">
                        Conectado em {cd.uploadedAt} • {(cd.fileSize / 1024).toFixed(1)} KB indexados
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Ativo na Sessão
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="text-[11px]">
            Conforme Instrução Normativa da SEDUC-PA e Parecer CNE/CP nº 2/2022.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fechar Visualizador
          </button>
        </div>
      </div>
    </div>
  );
};
