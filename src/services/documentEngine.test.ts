import test from 'node:test';
import assert from 'node:assert/strict';
import { queryOfficialCurriculum, validateSkillCode, normalizeText } from './documentEngine.ts';
import { NOT_FOUND_STANDARD_MESSAGE, OFFICIAL_SKILLS_DATABASE } from '../data/officialCurriculumDatabase.ts';

test('normalizeText removes accents and converts to lowercase', () => {
  assert.equal(normalizeText('Educação e Inovação'), 'educacao e inovacao');
  assert.equal(normalizeText('PARÁ — Robótica'), 'para — robotica');
  assert.equal(normalizeText('   EF06CO01  '), 'ef06co01');
});

test('queryOfficialCurriculum retrieves skills by exact code', () => {
  const result = queryOfficialCurriculum({
    stage: 'Ensino Fundamental - Anos Finais',
    component: 'Tecnologia e Inovação / Computação',
    theme: 'algoritmos',
    docType: 'plano_de_aula',
    exactCode: 'EF06CO01',
  });

  assert.equal(result.totalFound >= 1, true);
  assert.equal(result.skills[0].code, 'EF06CO01');
  assert.equal(result.skills[0].documentSource, 'Complemento à BNCC — Computação (MEC, 2022)');
  assert.equal(result.skills[0].yearOrGrade, '6º ano');
  assert.equal(result.skills[0].thematicAxis, 'Mundo Digital');
});

test('queryOfficialCurriculum retrieves Pará-specific skills with PA- prefix', () => {
  const result = queryOfficialCurriculum({
    stage: 'Ensino Fundamental - Anos Finais',
    component: 'Tecnologia e Inovação / Computação',
    theme: 'conectividade',
    docType: 'sequencia_didatica',
    exactCode: 'PA-EF06CO01',
  });

  assert.equal(result.totalFound >= 1, true);
  const paSkill = result.skills.find(s => s.code === 'PA-EF06CO01');
  assert.ok(paSkill);
  assert.equal(paSkill?.documentSource, 'Currículo Paraense (SEDUC-PA, 2019/2021)');
  assert.equal(paSkill?.legalAct, 'Resolução CEE/PA nº 001/2019');
});

test('queryOfficialCurriculum returns exact standard message when no skill is found', () => {
  const result = queryOfficialCurriculum({
    stage: 'Ensino Fundamental - Anos Iniciais',
    component: 'Tecnologia e Inovação / Computação',
    theme: 'termodinamica_quantica_inexistente_xyz',
    docType: 'plano_de_aula',
  });

  assert.equal(result.totalFound, 0);
  assert.equal(result.skills.length, 0);
  assert.equal(result.notFoundMessage, NOT_FOUND_STANDARD_MESSAGE);
  assert.equal(
    result.notFoundMessage, 
    'Não foi localizada referência explícita a essa habilidade nos documentos oficiais disponíveis na base.'
  );
});

test('validateSkillCode correctly validates authentic codes and rejects invented codes', () => {
  const valid = validateSkillCode('EF01CO01');
  assert.equal(valid.isValid, true);
  assert.equal(valid.skill?.code, 'EF01CO01');

  const validPa = validateSkillCode('PA-EF08CO03');
  assert.equal(validPa.isValid, true);
  assert.equal(validPa.skill?.code, 'PA-EF08CO03');

  // Invented code must be rejected with the exact official reliability phrase
  const invalid = validateSkillCode('EF99FAKE00');
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.message, NOT_FOUND_STANDARD_MESSAGE);
});

test('preserves verbatim original text without alterations', () => {
  const skill = OFFICIAL_SKILLS_DATABASE.find(s => s.code === 'EF06CO02');
  assert.ok(skill);
  assert.equal(
    skill?.originalText,
    'Construir algoritmos com estruturas sequenciais, condicionais e de repetição, implementando-os em ambientes de programação textual ou por blocos.'
  );
});
