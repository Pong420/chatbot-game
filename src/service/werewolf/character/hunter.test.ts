import { expect, test } from 'vitest';
import { Game } from '../game';
import { stages } from '../stage';
import { t } from '../locales';
import { testSuite } from '../test';
import { Character } from './_character';
import { Werewolf } from './werewolf';
import { Villager } from './villager';
import { Hunter } from './hunter';
import { Witcher } from './witcher';

declare let game: Game;
declare let survivors: Character[];
declare let werewolves: Werewolf[];
declare let villagers: Villager[];
declare let hunters: Hunter[];
declare let witchers: Witcher[];

test.each(['', 'not '])('hunter was killed - %sshot', shot => {
  const { createGame, nextStage, allWaive } = testSuite();

  createGame({ customCharacters: ['Werewolf', 'Hunter', 'Hunter', 'Villager', 'Villager', 'Villager'] });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Night');
  werewolves[0].kill(villagers[0]);
  expect(() => hunters[0].shoot(hunters[0])).toThrowError(t(`NotReadyForShoot`));
  expect(() => hunters[0].shoot(villagers[0])).toThrowError(t(`NotReadyForShoot`));

  nextStage('Daytime');
  nextStage('Vote');
  allWaive();

  nextStage('Voted');

  nextStage('Night');
  werewolves[0].kill(hunters[0]);

  nextStage('Daytime');

  nextStage('Hunter');

  expect(() => hunters[0].shoot(hunters[0])).toThrowError(t(`ShootSelf`));
  expect(() => hunters[0].shoot(villagers[0])).toThrowError(t(`CantKillDeadTarget`, villagers[0].nickname));
  expect(() => hunters[1].shoot(hunters[0])).toThrowError(t(`NotReadyForShoot`));

  if (shot === '') {
    hunters[0].shoot(werewolves[0]);
    expect(survivors).toContain(werewolves[0]);
    nextStage('HunterEnd');
    // expect(survivors).not.toContain(werewolves[0]);
    // nextStage('End');
  } else {
    hunters[0].noShoot();
    nextStage('HunterEnd');
    nextStage('Vote');
  }

  expect(survivors).not.toContain(hunters[0]);
});

test('hunter - vote', () => {
  const { createGame, nextStage, allVoteTo } = testSuite();

  createGame({ customCharacters: ['Werewolf', 'Hunter', 'Villager', 'Villager', 'Villager', 'Villager'] });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Night');
  werewolves[0].idle();

  nextStage('Daytime');
  nextStage('Vote');
  allVoteTo(hunters[0]);

  nextStage('Voted');

  nextStage('Hunter');
});

test('hunter - witcher', () => {
  const { createGame, nextStage, allWaive } = testSuite();

  createGame({ customCharacters: ['Werewolf', 'Hunter', 'Witcher', 'Villager', 'Villager', 'Villager'] });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Night');
  werewolves[0].kill(hunters[0]);

  nextStage('Witcher');
  witchers[0].rescue(hunters[0]);

  nextStage('Daytime');
  nextStage('Vote');
  allWaive();

  nextStage('Voted');

  nextStage('Night');
  werewolves[0].kill(hunters[0]);

  nextStage('Witcher');
  witchers[0].poison(hunters[0]);

  nextStage('Daytime');
  nextStage('Vote');
});
