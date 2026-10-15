import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePedagogicalProposal } from './pedagogicalGenerator.ts';
import { OFFICIAL_SKILLS_DATABASE } from '../data/officialCurriculumDatabase.ts';

test('generatePedagogicalProposal throws if no validated skills are provided', () => {
  assert.throws(() => {
    generatePedagogicalProposal(
      'plano_de_aula',
      [],
      'Ensino Fundamental - Anos Finais',
      'Tecnologia e Inovação / Computação',
      'Robótica'
    );
  }, /Não é possível gerar proposta pedagógica sem habilidades oficiais previamente validadas/);
});

test('generatePedagogicalProposal generates complete lesson plan based strictly on validated skills', () => {
  const sampleSkill = OFFICIAL_SKILLS_DATABASE.find(s => s.code === 'EF06CO01');
  assert.ok(sampleSkill);

  const proposal = generatePedagogicalProposal(
    'plano_de_aula',
    [sampleSkill!],
    'Ensino Fundamental - Anos Finais',
    'Tecnologia e Inovação / Computação',
    'Hardware e Software'
  );

  assert.equal(proposal.type, 'plano_de_aula');
  assert.equal(proposal.validatedSkills.length, 1);
  assert.equal(proposal.validatedSkills[0].code, 'EF06CO01');
  assert.ok(proposal.title.includes('EF06CO01'));
  assert.ok(proposal.generalObjective.includes('EF06CO01'));
  assert.equal(proposal.steps.length, 3);
  assert.ok(proposal.requiredResources.unplugged.length > 0);
  assert.ok(proposal.evaluationCriteria.length >= 3);
  assert.ok(proposal.legalNotice.includes('NOTA TÉCNICA'));
});

test('generatePedagogicalProposal generates sequence and alignment modes correctly', () => {
  const paSkill = OFFICIAL_SKILLS_DATABASE.find(s => s.code === 'PA-EF08CO03');
  assert.ok(paSkill);

  const sequence = generatePedagogicalProposal(
    'sequencia_didatica',
    [paSkill!],
    'Ensino Fundamental - Anos Finais',
    'Tecnologia e Inovação / Computação',
    'Robótica Sustentável e Sucata'
  );

  assert.equal(sequence.type, 'sequencia_didatica');
  assert.equal(sequence.steps.length, 4);

  const alignment = generatePedagogicalProposal(
    'alinhamento_curricular',
    [paSkill!],
    'Ensino Fundamental - Anos Finais',
    'Tecnologia e Inovação / Computação',
    'Robótica Sustentável'
  );

  assert.equal(alignment.type, 'alinhamento_curricular');
  assert.ok(alignment.title.includes('Matriz de Alinhamento Curricular'));
});
