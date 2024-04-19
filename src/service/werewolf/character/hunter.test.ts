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
declare let werewolfs: Werewolf[];
declare let villagers: Villager[];
declare let hunters: Hunter[];
declare let witchers: Witcher[];

test.each(['', 'not '])('hunter was killed - %sshot', shot => {
  const { createGame, nextStage, allWaive } = testSuite();

  const characters = [Werewolf, Hunter, Hunter, Villager, Villager, Villager];
  createGame({ numOfPlayers: characters.length, characters });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Night');
  werewolfs[0].kill(villagers[0]);
  expect(() => hunters[0].shoot(hunters[0])).toThrowError(t(`NotYourTurn`));
  expect(() => hunters[0].shoot(villagers[0])).toThrowError(t(`NotYourTurn`));

  nextStage('Daytime');
  allWaive();

  nextStage('Voted');

  nextStage('Night');
  werewolfs[0].kill(hunters[0]);

  nextStage('Hunter');

  expect(() => hunters[0].shoot(hunters[0])).toThrowError(t(`ShootSelf`));
  expect(() => hunters[0].shoot(villagers[0])).toThrowError(t(`CantKillDeadTarget`, villagers[0].nickname));

  // TODO: make this better
  expect(() => hunters[1].shoot(hunters[0])).toThrowError(t(`TurnEnded`));

  if (shot === '') {
    hunters[0].shoot(werewolfs[0]);
    expect(survivors).toContain(werewolfs[0]);
    nextStage('End');
    expect(survivors).not.toContain(werewolfs[0]);
  } else {
    hunters[0].noShoot();
    nextStage('Daytime');
  }

  expect(survivors).not.toContain(hunters[0]);
});

test('hunter - vote', () => {
  const { createGame, nextStage, allVoteTo } = testSuite();

  const characters = [Werewolf, Hunter, Villager, Villager, Villager, Villager];
  createGame({ numOfPlayers: characters.length, characters });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Night');
  werewolfs[0].idle();

  nextStage('Daytime');
  allVoteTo(hunters[0]);

  nextStage('Voted');

  nextStage('Hunter');
});

test('hunter - witcher', () => {
  const { createGame, nextStage, allWaive } = testSuite();

  const characters = [Werewolf, Hunter, Witcher, Villager, Villager, Villager];
  createGame({ numOfPlayers: characters.length, characters });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Night');
  werewolfs[0].kill(hunters[0]);

  nextStage('Witcher');
  witchers[0].rescue(hunters[0]);

  nextStage('Daytime');
  allWaive();

  nextStage('Voted');

  nextStage('Night');
  werewolfs[0].kill(hunters[0]);

  nextStage('Witcher');
  witchers[0].poison(hunters[0]);

  nextStage('Daytime');
});
