/**
 * BOT CISEB — Camada de Elaboração de Propostas Pedagógicas
 * Rede Estadual de Ensino do Pará (SEDUC-PA / CISEB)
 * 
 * Regra de Ouro:
 * A geração é estritamente vinculada às habilidades validadas na etapa anterior.
 * Não inventa códigos, não adultera redações da lei e explicita a fronteira
 * entre a norma oficial e a sugestão didática.
 */

import type { 
  CurriculumSkill, 
  DocumentType, 
  PedagogicalProposal, 
  PlanStep 
} from '../types/curriculum.ts';

export const OFFICIAL_LEGAL_NOTICE = 
  'NOTA TÉCNICA DE CONFORMIDADE CURRICULAR: Os códigos e redações das habilidades transcritas nesta proposta correspondem estritamente aos documentos oficiais homologados da BNCC (Resoluções CNE/CP nº 2/2017, nº 4/2018 e Complemento nº 1/2022) e do Currículo Paraense (Resoluções CEE/PA nº 001/2019 e nº 313/2021). As propostas metodológicas, roteiros e rubricas são orientações técnico-pedagógicas do BOT CISEB de apoio à prática docente, preservando a autonomia do professor e o Projeto Político-Pedagógico (PPP) da unidade escolar.';

/**
 * Gera proposta pedagógica a partir exclusivamente de habilidades validadas.
 */
export function generatePedagogicalProposal(
  type: DocumentType,
  validatedSkills: CurriculumSkill[],
  stage: string,
  component: string,
  theme: string
): PedagogicalProposal {
  if (!validatedSkills || validatedSkills.length === 0) {
    throw new Error('Não é possível gerar proposta pedagógica sem habilidades oficiais previamente validadas.');
  }

  const primarySkill = validatedSkills[0];
  const allCodes = validatedSkills.map(s => s.code).join(', ');
  const hasParaSkill = validatedSkills.some(s => s.code.startsWith('PA-') || s.code.startsWith('CISEB'));

  // Definir título e estrutura com base no tipo
  let title = '';
  let estimatedDuration = '';
  let generalObjective = '';
  let specificObjectives: string[] = [];
  let steps: PlanStep[] = [];
  let methodologicalApproach = '';

  const cleanTheme = theme || primarySkill.thematicAxis || 'Tecnologia e Inovação';

  if (type === 'plano_de_aula') {
    title = `Plano de Aula: ${cleanTheme} — Alinhado a ${allCodes}`;
    estimatedDuration = '2 aulas de 50 minutos (bloco de 100 min)';
    methodologicalApproach = 'Metodologia Ativa com Aprendizagem Baseada em Problemas e Computação Criativa (com opção plugada e desplugada para a realidade do Pará)';
    
    generalObjective = `Desenvolver a compreensão teórico-prática sobre "${cleanTheme}" articulando a habilidade oficial [${primarySkill.code}] (${primarySkill.thematicAxis}) à resolução de situações reais da comunidade escolar paraense.`;
    
    specificObjectives = [
      `Mobilizar a habilidade oficial ${primarySkill.code} para interpretar e analisar conceitos essenciais de ${cleanTheme}.`,
      `Experimentar a aplicação prática por meio de registro investigativo ou prototipagem colaborativa em sala de aula ou Espaço Maker.`,
      `Sistematizar as aprendizagens conectando os saberes tecnológicos aos impactos sociais, ambientais e culturais no Estado do Pará.`,
      ...(validatedSkills.length > 1 
        ? [`Integrar de forma interdisciplinar a habilidade complementar ${validatedSkills[1].code}.`] 
        : [])
    ];

    steps = [
      {
        title: 'Momento 1: Acolhimento, Diagnóstico e Problematização Inicial',
        duration: '20 minutos',
        description: `Abertura com uma pergunta disparadora contextualizada à realidade local dos estudantes: "Como o tema '${cleanTheme}' se manifesta no nosso bairro, município ou ecossistema ribeirinho/urbano?". Levantamento de conhecimentos prévios e apresentação da habilidade oficial foco [${primarySkill.code}].`,
        teacherRole: 'Mediar a tempestade de ideias, registrar hipóteses no quadro e situar o objeto de conhecimento curricular.',
        studentRole: 'Compartilhar vivências cotidianas, expressar dúvidas iniciais e formular hipóteses investigativas em duplas.',
        methodologyType: 'desplugada',
        amazonianContextTip: 'Se houver oscilação de energia ou rede, utilizar cartazes e relatos orais baseados na dinâmica socioambiental dos rios e florestas do Pará.'
      },
      {
        title: 'Momento 2: Atividade Prática — "Mão na Massa" (Maker / Algorítmica)',
        duration: '50 minutos',
        description: `Desenvolvimento de uma atividade estruturada orientada pela habilidade [${primarySkill.code}]. Em caso de recursos digitais (laboratório/smartphones), os estudantes realizam simulação ou programação visual. Em caso de baixa conectividade, realiza-se o percurso em modalidade de Computação Desplugada com desafios de cartões ordenados, fluxogramas físicos ou protótipos de sucata.`,
        teacherRole: 'Circular pelos grupos, provocar o pensamento crítico ("O que acontece se mudarmos essa condição?"), apoiar mediação inclusiva.',
        studentRole: 'Trabalhar colaborativamente em equipes de 3 a 4 estudantes, planejando, testando, corrigindo falhas (depuração) e elaborando o produto final.',
        methodologyType: 'hibrida',
        amazonianContextTip: 'Incentivar o uso de materiais reaproveitados da região ou dados abertos de preservação ambiental da Amazônia.'
      },
      {
        title: 'Momento 3: Socialização, Sistematização Conceitual e Registro de Bordo',
        duration: '30 minutos',
        description: `Cada equipe apresenta sua solução ou algoritmo em 2 minutos. O professor faz a amarração formal com o texto literal da habilidade [${primarySkill.code}], sintetizando os conceitos-chave de ${primarySkill.thematicAxis} e registrando no Diário de Bordo da turma.`,
        teacherRole: 'Sistematizar os conceitos formalizados, conectar os resultados das equipes e validar o alcance dos objetivos.',
        studentRole: 'Expor o raciocínio utilizado, analisar os erros como parte do aprendizado e preencher a autoavaliação rápida.',
        methodologyType: 'desplugada',
        amazonianContextTip: 'Valorizar a expressão oral e os saberes culturais trazidos pelos estudantes do interior e da capital.'
      }
    ];

  } else if (type === 'sequencia_didatica') {
    title = `Sequência Didática: Percurso Investigativo em ${cleanTheme}`;
    estimatedDuration = '4 semanas (8 a 10 horas-aula modulares)';
    methodologicalApproach = 'Sequência Didática Investigativa (SDI) em 4 etapas articuladas, com foco em desenvolvimento contínuo de competências digitais e socioemocionais.';
    
    generalObjective = `Articular o ciclo completo de aprendizagem sobre "${cleanTheme}", integrando as habilidades oficiais validadas (${allCodes}) desde a problematização até a produção de uma solução autoral aplicável à realidade paraense.`;

    specificObjectives = [
      `Etapa 1: Sensibilização diagnóstica e apropriação dos conceitos de ${primarySkill.thematicAxis}.`,
      `Etapa 2: Aplicação do pensamento computacional e da cultura digital na decomposição de desafios reais do Pará.`,
      `Etapa 3: Prototipagem colaborativa (plugada ou desplugada) alinhada às habilidades ${allCodes}.`,
      `Etapa 4: Avaliação por pares, validação comunitária e documentação no portfólio escolar.`
    ];

    steps = [
      {
        title: 'Encontro 1: Imersão Temática e Identificação de Problemas Territoriais',
        duration: '2 horas-aula (100 min)',
        description: `Leitura compartilhada de notícias, mapas ou cenários das 12 Regiões de Integração do Pará. Apresentação do desafio e vinculação explícita com a habilidade [${primarySkill.code}].`,
        teacherRole: 'Apresentar dados oficiais, provocar o debate e orientar a delimitação do problema a ser enfrentado.',
        studentRole: 'Mapear desafios do seu território escolar e registrar as primeiras indagações de pesquisa.',
        methodologyType: 'desplugada',
        amazonianContextTip: 'Conectar com temas da COP30, bioeconomia paraense e gestão de recursos hídricos.'
      },
      {
        title: 'Encontro 2: Pensamento Algorítmico, Decomposição e Modelagem',
        duration: '2 horas-aula (100 min)',
        description: `Trabalho com os pilares da computação: quebrar o problema em partes (decomposição), buscar semelhanças (padrões) e desenhar o fluxo lógico de ação (algoritmo).`,
        teacherRole: 'Fornecer matrizes lógicas e apoiar na transição entre linguagem natural e representação esquemática.',
        studentRole: 'Esboçar fluxogramas e regras lógicas de funcionamento em cartolinas ou ferramentas digitais simples.',
        methodologyType: 'hibrida',
        amazonianContextTip: 'Uso de dinâmicas lúdicas corporais (computação corporal/desplugada) para turmas do SOME ou escolas ribeirinhas.'
      },
      {
        title: 'Encontro 3: Criação de Protótipo e Desenvolvimento Colaborativo',
        duration: '3 horas-aula (150 min)',
        description: `Execução prática da solução. Implementação em software educativo (Scratch, App Inventor, planilhas) ou montagem de protótipo físico nos Espaços Maker da SEDUC-PA.`,
        teacherRole: 'Facilitar materiais, orientar testes contínuos e estimular a resiliência cognitiva no teste de falhas.',
        studentRole: 'Construir a solução técnica em grupos, realizando testes e ajustes iterativos com base nos critérios estabelecidos.',
        methodologyType: 'plugada',
        amazonianContextTip: 'Reaproveitamento de placas, fios, papelão e sementes para protótipos de robótica de baixo custo.'
      },
      {
        title: 'Encontro 4: Mostra Pedagógica CISEB, Compartilhamento e Devolutiva',
        duration: '2 horas-aula (100 min)',
        description: `Mostra interna de tecnologia e inovação na escola. Apresentação das soluções para colegas de outras turmas, gestores e comunidade escolar.`,
        teacherRole: 'Conduzir a sessão de avaliação formativa e autoavaliação com base nas rubricas oficiais.',
        studentRole: 'Explicar a lógica construída, responder a questionamentos dos pares e autoavaliar sua trajetória de aprendizagem.',
        methodologyType: 'desplugada',
        amazonianContextTip: 'Comemoração com destaque à inovação cidadã nascida no território amazônico.'
      }
    ];

  } else {
    // Alinhamento Curricular
    title = `Matriz de Alinhamento Curricular: ${cleanTheme}`;
    estimatedDuration = 'Planejamento Bimestral / Trimestral de Componente Curricular';
    methodologicalApproach = 'Alinhamento Curricular por Competências e Habilidades Homologadas com Indicadores Observáveis e Territorialidade SEDUC-PA.';
    
    generalObjective = `Estruturar o planejamento do componente "${component}" para a etapa "${stage}", garantindo conformidade estrita entre as habilidades oficiais validadas (${allCodes}), objetos de conhecimento e práticas avaliativas.`;

    specificObjectives = [
      `Mapear a correspondência direta entre as habilidades homologadas e os objetos de conhecimento do Currículo Paraense.`,
      `Definir evidências de aprendizagem observáveis e instrumentos avaliativos adequados às especificidades da rede estadual.`,
      `Assegurar a progressão das habilidades ao longo dos anos letivos e a transição entre o Ensino Fundamental e o Ensino Médio.`,
      `Garantir adaptação pedagógica para modalidades especiais (SOME, EJA, Educação Escolar Indígena e Quilombola).`
    ];

    steps = [
      {
        title: 'Dimensão 1: Enquadramento Normativo e Mapeamento de Habilidades',
        duration: 'Fase de Planejamento Docente (Semana Pedagógica)',
        description: `Análise comparativa das habilidades oficiais validadas (${allCodes}) com o Projeto Político-Pedagógico da escola e o plano anual de curso.`,
        teacherRole: 'Verificar pré-requisitos conceituais e articular o cronograma curricular anual.',
        studentRole: 'Participar de sondagem diagnóstica para identificação do nível de proficiência inicial.',
        methodologyType: 'desplugada',
        amazonianContextTip: 'Considerar o calendário hidrológico e sazonal das regiões ribeirinhas do Pará no cronograma escolar.'
      },
      {
        title: 'Dimensão 2: Integração de Metodologias Ativas e Espaços de Aprendizagem',
        duration: 'Desenvolvimento ao longo do período letivo',
        description: `Articulação dos espaços disponíveis: Sala de aula regular, Laboratório de Informática Educativa (LIE), Espaço Maker SEDUC e biblioteca.`,
        teacherRole: 'Alternar intencionalmente práticas plugadas e desplugadas para garantir que nenhum estudante seja excluído.',
        studentRole: 'Vivenciar percursos diversificados de aprendizagem individual e em equipe.',
        methodologyType: 'hibrida',
        amazonianContextTip: 'Articular parcerias comunitárias e projetos de bioeconomia alinhados às vocações econômicas locais.'
      },
      {
        title: 'Dimensão 3: Matriz de Evidências e Avaliação Formativa Contínua',
        duration: 'Acompanhamento contínuo e consolidação bimestral',
        description: `Aferição das habilidades por meio de rubricas de desempenho com níveis: Inicial, Em Desenvolvimento, Proficiente e Avançado.`,
        teacherRole: 'Fornecer devolutivas formativas rápidas e replanejar intervenções para estudantes em defasagem.',
        studentRole: 'Utilizar a rubrica para monitorar o próprio progresso e estabelecer metas de estudo.',
        methodologyType: 'desplugada',
        amazonianContextTip: 'Incentivar registros que valorizem a oralidade e a produção cultural local.'
      }
    ];
  }

  // Recursos pedagógicos adequados ao Pará
  const requiredResources = {
    plugged: [
      'Computadores ou notebooks do laboratório escolar / tablets educacionais da SEDUC-PA',
      'Plataformas livres de programação visual (Scratch, MakeCode ou Portugol Studio)',
      'Acesso à internet para pesquisa guiada em fontes confiáveis (quando disponível)'
    ],
    unplugged: [
      'Papel quadriculado, cartolinas, canetas coloridas e fita adesiva',
      'Cartões de comandos impressos com setas e instruções condicionais (Se... Então)',
      'Tabuleiros no chão desenhados com giz para percursos de computação desplugada',
      'Diário de Bordo impresso para anotações reflexivas individuais e em grupo'
    ],
    amazonianOrRecyclable: [
      'Sucata eletrônica descarregada (teclados antigos, fios, carcaças de eletrônicos para desmontagem maker)',
      'Materiais recicláveis regionais (papelão, garrafas PET, embalagens limpas)',
      'Fibras e sementes vegetais amazônicas para confecção de peças táticas de prototipagem sustentável',
      'Mapas impressos da hidrografia e dos municípios paraenses para contextualização espacial'
    ]
  };

  // Critérios de Avaliação e Rubrica Formativa
  const evaluationCriteria = [
    {
      indicator: `Domínio da Habilidade Oficial [${primarySkill.code}]`,
      description: `O estudante compreende e aplica a essência da habilidade ("${primarySkill.originalText.substring(0, 90)}...") na atividade prática proposta.`,
      instrument: 'Rubrica de Desempenho com 4 níveis (Insuficiente, Básico, Proficiente, Avançado)'
    },
    {
      indicator: 'Pensamento Crítico e Resolução de Problemas',
      description: 'Capacidade de identificar erros conceituais ou falhas na solução (depuração) e propor alternativas sem desanimar diante de impasses.',
      instrument: 'Observação sistemática da mediação em sala de aula'
    },
    {
      indicator: 'Trabalho Colaborativo e Ética Digital',
      description: 'Respeito à diversidade de opiniões no grupo, divisão justa de tarefas e uso ético de informações e ferramentas tecnológicas.',
      instrument: 'Autoavaliação discente e avaliação por pares'
    },
    {
      indicator: 'Contextualização com a Realidade Paraense',
      description: 'Pertinência das soluções propostas frente aos desafios ambientais, sociais e culturais do território do Pará.',
      instrument: 'Apresentação oral / Produto final registrado no Diário de Bordo'
    }
  ];

  const accessibilityAndInclusion = 
    'Garantir formatos acessíveis para estudantes com deficiência visual (instruções em relevo e audiodescrição de percursos desplugados), estudantes com deficiência auditiva (recursos visuais e glossário em Libras para termos tecnológicos) e neurodivergentes (rotinas visuais claras, prazos flexíveis e pausas sensoriais). Para turmas do SOME e comunidades ribeirinhas com baixa conectividade, toda a atividade prática possui rota 100% desplugada equivalente, garantindo equidade pedagógica plena.';

  const prerequisites = [
    'Conhecimentos básicos de leitura, interpretação de textos e seriação lógica correspondentes à etapa.',
    'Noções iniciais de cooperação em grupo e regras de convivência escolar em espaços compartilhados.',
    ...(stage.includes('Médio') ? ['Compreensão elementar sobre busca de informações em ambiente virtual e sistemas operacionais.'] : [])
  ];

  return {
    id: `PROP-${Date.now().toString(36).toUpperCase()}`,
    type,
    title,
    targetStage: stage,
    component,
    theme: cleanTheme,
    estimatedDuration,
    validatedSkills,
    generalObjective,
    specificObjectives,
    prerequisites,
    methodologicalApproach,
    steps,
    requiredResources,
    evaluationCriteria,
    accessibilityAndInclusion,
    legalNotice: OFFICIAL_LEGAL_NOTICE,
    generatedAt: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
  };
}
