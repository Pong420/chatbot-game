import { testSuite } from '@werewolf/test';
import { expect, test } from 'vitest';
import { Werewolf } from './werewolf';
import { Villager } from './villager';
import { Guard } from './guard';
import { Character } from './_character';
import { Game } from '../game';
import { stages } from '../stage';
import { t } from '../locales';

declare let game: Game;
declare let survivors: Character;
declare let werewolfs: Werewolf[];
declare let villagers: Villager[];
declare let guards: Guard[];

test('guard', () => {
  const { createGame, nextStage, allVoteTo, allWaive } = testSuite();

  const characters = [Werewolf, Werewolf, Guard, Villager, Villager, Villager];
  createGame({ numOfPlayers: characters.length, characters });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Guard');
  expect(() => werewolfs[0].kill(guards[0])).toThrowError(t(`NotYourTurn`));
  expect(guards[0].protect(guards[0])).toEqual(t(`ProtectSelfSuccess`));

  expect(() => guards[0].protect(guards[0])).toThrowError(t(`TurnEnded`));
  expect(() => guards[0].protect(villagers[0])).toThrowError(t(`TurnEnded`));

  nextStage('Night');
  werewolfs[0].kill(guards[0]);
  werewolfs[1].idle();

  nextStage('Daytime');
  expect(guards[0].isDead).toBeFalse();
  expect(survivors).toHaveLength(6);

  nextStage('Vote');
  allVoteTo(villagers[0]);

  nextStage('Voted');
  expect(villagers[0].isDead).toBeTrue();

  nextStage('Guard');
  expect(() => guards[0].protect(guards[0])).toThrowError(t(`DuplicatedProtectedSelf`));
  expect(() => guards[0].protect(villagers[0])).toThrowError(t(`TargetIsDead`, villagers[0].nickname));
  expect(guards[0].protect(villagers[1])).toEqual(t('ProtectSuccess'));

  nextStage('Night');
  werewolfs[0].kill(villagers[1]);
  werewolfs[1].kill(villagers[1]);

  nextStage('Daytime');
  expect(villagers[0].isDead).toBeTrue();
  expect(survivors).toHaveLength(4);

  nextStage('Vote');
  allVoteTo(werewolfs[1]);

  nextStage('Voted');
  nextStage('Guard');
  expect(guards[0].protect(guards[0])).toEqual(t(`ProtectSelfSuccess`));

  nextStage('Night');
  werewolfs[0].idle();

  nextStage('Daytime');
  expect(survivors).toHaveLength(3);

  nextStage('Vote');
  allWaive();

  nextStage('Voted');
  nextStage('Guard');
  expect(guards[0].noProtect()).toEqual(t(`NoProtectSuccess`));
  expect(() => guards[0].protect(villagers[2])).toThrowError(t(`TurnEnded`));

  nextStage('Night');
  werewolfs[0].kill(guards[0]);

  nextStage('End');
});
