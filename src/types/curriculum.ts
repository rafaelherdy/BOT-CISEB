/**
 * BOT CISEB — Tipos de Dados e Modelagem de Currículo Oficial
 * Rede Estadual de Ensino do Pará (SEDUC-PA / CISEB)
 */

export type StageLevel = 
  | 'Educação Infantil'
  | 'Ensino Fundamental - Anos Iniciais'
  | 'Ensino Fundamental - Anos Finais'
  | 'Ensino Médio'
  | 'EJA'
  | 'Educação Escolar Indígena / Quilombola';

export type DocumentType = 
  | 'plano_de_aula'
  | 'sequencia_didatica'
  | 'alinhamento_curricular';

export type OfficialSourceId = 
  | 'bncc_computacao'
  | 'bncc_geral'
  | 'curriculo_paraense'
  | 'referencial_computacao_pa'
  | 'diretrizes_seduc_pa'
  | 'custom_uploaded_pdf';

export interface OfficialDocumentInfo {
  id: OfficialSourceId;
  title: string;
  shortName: string;
  legalAct: string; // Ex: "Resolução CNE/CP nº 1/2022" ou "Resolução CEE/PA nº 001/2019"
  year: number;
  author: string;
  scope: string;
  status: 'conectado' | 'indexado' | 'aguardando_upload';
  skillsCount: number;
  description: string;
  downloadUrl?: string;
}

export interface CurriculumSkill {
  id: string;
  code: string; // Ex: "EF01CO01", "EF06CO02", "EM13CO01", "PA-EF06CO01"
  originalText: string; // Texto verbatim oficial inalterado
  documentSource: string; // Ex: "Complemento à BNCC — Computação (MEC, 2022)"
  sourceId: OfficialSourceId;
  legalAct: string;
  stage: StageLevel;
  yearOrGrade: string; // Ex: "1º ano", "6º ao 9º ano", "1ª a 3ª série"
  component: string; // Ex: "Tecnologia e Inovação / Computação", "Língua Portuguesa"
  thematicAxis: string; // Ex: "Pensamento Computacional", "Mundo Digital", "Cultura Digital"
  pageReference?: string; // Ex: "p. 14", "p. 312"
  keywords: string[];
  territorialContext?: string; // Contextualização do Pará/Amazônia quando aplicável
}

export interface SearchQuery {
  stage: string;
  component: string;
  theme: string;
  docType: DocumentType;
  exactCode?: string;
  sourceFilter?: OfficialSourceId | 'all';
}

export interface SearchResult {
  skills: CurriculumSkill[];
  totalFound: number;
  sourcesFound: string[];
  queryUsed: SearchQuery;
  searchedAt: string;
  notFoundMessage?: string;
}

export interface PlanStep {
  title: string;
  duration: string;
  description: string;
  teacherRole: string;
  studentRole: string;
  methodologyType: 'plugada' | 'desplugada' | 'hibrida';
  amazonianContextTip?: string;
}

export interface PedagogicalProposal {
  id: string;
  type: DocumentType;
  title: string;
  targetStage: string;
  component: string;
  theme: string;
  estimatedDuration: string;
  validatedSkills: CurriculumSkill[];
  generalObjective: string;
  specificObjectives: string[];
  prerequisites: string[];
  methodologicalApproach: string; // Ex: Aprendizagem Baseada em Problemas, Robótica Sustentável, Pensamento Desplugado
  steps: PlanStep[];
  requiredResources: {
    plugged: string[];
    unplugged: string[];
    amazonianOrRecyclable: string[];
  };
  evaluationCriteria: {
    indicator: string;
    description: string;
    instrument: string; // Ex: Rubrica, Autoavaliação, Diário de Bordo
  }[];
  accessibilityAndInclusion: string;
  legalNotice: string;
  generatedAt: string;
}

export interface CustomUploadedDocument {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  extractedTextLength: number;
  matchedSnippetsCount: number;
}
