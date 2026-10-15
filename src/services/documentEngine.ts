/**
 * BOT CISEB — Motor de Consulta Documental Oficial
 * Rede Estadual de Ensino do Pará (SEDUC-PA / CISEB)
 * 
 * Responsabilidades:
 * - Consulta estrita a documentos oficiais conectados
 * - Garantia de fidelidade literal (verbatim) dos textos normativos
 * - Proibição absoluta de alucinação de códigos ou referências
 * - Validação prévia de códigos antes do repasse à camada pedagógica
 * - Tratamento padrão de ausência de habilidade na base
 */

import type { 
  CurriculumSkill, 
  SearchQuery, 
  SearchResult, 
  OfficialDocumentInfo,
  CustomUploadedDocument 
} from '../types/curriculum.ts';
import { 
  OFFICIAL_SKILLS_DATABASE, 
  OFFICIAL_DOCUMENTS_METADATA, 
  NOT_FOUND_STANDARD_MESSAGE 
} from '../data/officialCurriculumDatabase.ts';

// Normalização de texto para busca insensível a acentos e maiúsculas
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Consulta a base oficial de habilidades curriculares.
 * Aplica regras estritas: não inventa habilidades, preserva trechos literais.
 */
export function queryOfficialCurriculum(
  query: SearchQuery, 
  customSkills: CurriculumSkill[] = []
): SearchResult {
  const allSkills = [...OFFICIAL_SKILLS_DATABASE, ...customSkills];
  const normTheme = normalizeText(query.theme);
  const normStage = normalizeText(query.stage);
  const normComponent = normalizeText(query.component);
  const normExactCode = normalizeText(query.exactCode || '');

  // Se o usuário digitou um código exato diretamente
  if (normExactCode) {
    const directMatch = allSkills.filter(s => 
      normalizeText(s.code) === normExactCode || 
      normalizeText(s.code).replace(/[^a-z0-9]/g, '') === normExactCode.replace(/[^a-z0-9]/g, '')
    );
    if (directMatch.length > 0) {
      return {
        skills: directMatch,
        totalFound: directMatch.length,
        sourcesFound: Array.from(new Set(directMatch.map(s => s.documentSource))),
        queryUsed: query,
        searchedAt: new Date().toISOString(),
      };
    }
  }

  // Filtragem multifatorial
  const filtered = allSkills.filter(skill => {
    // Filtro por fonte oficial se especificado
    if (query.sourceFilter && query.sourceFilter !== 'all') {
      if (skill.sourceId !== query.sourceFilter) {
        return false;
      }
    }

    // Filtro por Etapa / Ano se fornecido e não for genérico ("todas")
    if (normStage && normStage !== 'todas as etapas' && normStage !== 'todos') {
      const skillStageNorm = normalizeText(skill.stage);
      const skillGradeNorm = normalizeText(skill.yearOrGrade);

      // Mapeamento flexível de sinônimos de etapas
      const stageMatches = 
        skillStageNorm.includes(normStage) || 
        normStage.includes(skillStageNorm) ||
        (normStage.includes('anos finais') && skillStageNorm.includes('anos finais')) ||
        (normStage.includes('anos iniciais') && skillStageNorm.includes('anos iniciais')) ||
        (normStage.includes('medio') && skillStageNorm.includes('medio')) ||
        (normStage.includes('infantil') && skillStageNorm.includes('infantil')) ||
        (normStage.includes('6') && (skillGradeNorm.includes('6') || skillStageNorm.includes('anos finais'))) ||
        (normStage.includes('7') && (skillGradeNorm.includes('7') || skillStageNorm.includes('anos finais'))) ||
        (normStage.includes('8') && (skillGradeNorm.includes('8') || skillStageNorm.includes('anos finais'))) ||
        (normStage.includes('9') && (skillGradeNorm.includes('9') || skillStageNorm.includes('anos finais'))) ||
        (normStage.includes('1') && normStage.includes('ano') && skillGradeNorm.includes('1º ano'));

      if (!stageMatches) {
        return false;
      }
    }

    // Filtro por Componente Curricular se fornecido
    if (normComponent && normComponent !== 'todos' && normComponent !== 'todos os componentes') {
      const skillCompNorm = normalizeText(skill.component);
      const compMatches = 
        skillCompNorm.includes(normComponent) || 
        normComponent.includes(skillCompNorm) ||
        (normComponent.includes('computacao') && skillCompNorm.includes('computacao')) ||
        (normComponent.includes('tecnologia') && skillCompNorm.includes('tecnologia')) ||
        (normComponent.includes('portuguesa') && skillCompNorm.includes('portuguesa')) ||
        (normComponent.includes('matematica') && skillCompNorm.includes('matematica')) ||
        (normComponent.includes('ciencias') && skillCompNorm.includes('ciencias'));

      if (!compMatches) {
        return false;
      }
    }

    // Filtro por Tema / Objeto de Conhecimento
    if (normTheme && normTheme !== '') {
      const inOriginalText = normalizeText(skill.originalText).includes(normTheme);
      const inCode = normalizeText(skill.code).includes(normTheme);
      const inAxis = normalizeText(skill.thematicAxis).includes(normTheme);
      const inKeywords = skill.keywords.some(k => normalizeText(k).includes(normTheme) || normTheme.includes(normalizeText(k)));
      const inTerritorial = skill.territorialContext ? normalizeText(skill.territorialContext).includes(normTheme) : false;

      // Suporte a divisão de palavras-chave múltiplas (ex: "algoritmo sequencia")
      const themeWords = normTheme.split(/\s+/).filter(w => w.length > 2);
      const anyWordMatch = themeWords.length > 1 && themeWords.some(w => 
        normalizeText(skill.originalText).includes(w) || 
        skill.keywords.some(k => normalizeText(k).includes(w))
      );

      if (!inOriginalText && !inCode && !inAxis && !inKeywords && !inTerritorial && !anyWordMatch) {
        return false;
      }
    }

    return true;
  });

  // Se nenhuma habilidade foi localizada
  if (filtered.length === 0) {
    return {
      skills: [],
      totalFound: 0,
      sourcesFound: [],
      queryUsed: query,
      searchedAt: new Date().toISOString(),
      notFoundMessage: NOT_FOUND_STANDARD_MESSAGE,
    };
  }

  // Ordenação de relevância: habilidades específicas do Pará e de Computação prioritárias
  filtered.sort((a, b) => {
    // Se o código for do Pará, pontua mais
    const aIsPa = a.code.startsWith('PA-') || a.code.startsWith('CISEB');
    const bIsPa = b.code.startsWith('PA-') || b.code.startsWith('CISEB');
    if (aIsPa && !bIsPa) return -1;
    if (!aIsPa && bIsPa) return 1;
    return a.code.localeCompare(b.code);
  });

  const distinctSources = Array.from(new Set(filtered.map(s => s.documentSource)));

  return {
    skills: filtered,
    totalFound: filtered.length,
    sourcesFound: distinctSources,
    queryUsed: query,
    searchedAt: new Date().toISOString(),
  };
}

/**
 * Validador estrito de código curricular oficial.
 * Assegura que nenhum código gerado ou digitado seja aceito se não constar na base oficial.
 */
export function validateSkillCode(code: string, customSkills: CurriculumSkill[] = []): {
  isValid: boolean;
  skill?: CurriculumSkill;
  message: string;
} {
  if (!code || !code.trim()) {
    return {
      isValid: false,
      message: 'Código curricular não informado.',
    };
  }

  const allSkills = [...OFFICIAL_SKILLS_DATABASE, ...customSkills];
  const cleanedTarget = normalizeText(code).replace(/[^a-z0-9-]/g, '');
  
  const found = allSkills.find(s => 
    normalizeText(s.code).replace(/[^a-z0-9-]/g, '') === cleanedTarget
  );

  if (found) {
    return {
      isValid: true,
      skill: found,
      message: `Código ${found.code} validado com sucesso no documento: ${found.documentSource}`,
    };
  }

  return {
    isValid: false,
    message: NOT_FOUND_STANDARD_MESSAGE,
  };
}

/**
 * Retorna os metadados dos documentos oficiais conectados à base.
 */
export function getOfficialDocuments(): OfficialDocumentInfo[] {
  return OFFICIAL_DOCUMENTS_METADATA;
}

/**
 * Estatísticas do repositório documental oficial
 */
export function getDocumentRepositoryStats() {
  const totalOfficialSkills = OFFICIAL_SKILLS_DATABASE.length;
  const docs = OFFICIAL_DOCUMENTS_METADATA;
  const paraSkillsCount = OFFICIAL_SKILLS_DATABASE.filter(s => s.sourceId === 'curriculo_paraense' || s.sourceId === 'referencial_computacao_pa' || s.sourceId === 'diretrizes_seduc_pa').length;
  const nationalSkillsCount = OFFICIAL_SKILLS_DATABASE.filter(s => s.sourceId === 'bncc_computacao' || s.sourceId === 'bncc_geral').length;

  return {
    totalOfficialSkills,
    documentsCount: docs.length,
    connectedCount: docs.filter(d => d.status === 'conectado').length,
    paraSkillsCount,
    nationalSkillsCount,
    lastUpdate: '2026-10',
  };
}
