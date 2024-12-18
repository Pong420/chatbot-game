import { expect, test } from 'vitest';
import { t } from '../locales';
import { Game } from '../game';
import { Stage, stages } from '../stage';
import { testSuite } from '../test';
import { Character } from './_character';
import { Werewolf } from './werewolf';
import { Villager } from './villager';
import { Witcher } from './witcher';

declare let game: Game;
declare let stage: Stage;
declare let survivors: Character[];
declare let werewolves: Werewolf[];
declare let villagers: Villager[];
declare let witchers: Witcher[];

test('witcher', () => {
  const { createGame, nextStage, allWaive } = testSuite();

  createGame({ customCharacters: ['Werewolf', 'Witcher', 'Villager', 'Villager', 'Villager', 'Villager'] });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Night');
  werewolves[0].idle();

  nextStage('Witcher');
  expect(stage.nearDeath).toHaveLength(0);
  survivors.forEach(survivor => {
    expect(() => witchers[0].rescue(survivor)).toThrowError(t(`TargetNotInjured`, survivor.nickname));
  });
  expect(() => game.next()).toThrowError(t('StageNotEnded'));
  witchers[0].idle();

  nextStage('Daytime');

  nextStage('Vote');
  allWaive();

  nextStage('Voted');

  nextStage('Night');
  werewolves[0].kill(villagers[0]);

  nextStage('Witcher');
  expect(stage.nearDeath).toHaveLength(1);
  expect(() => witchers[0].rescue(villagers[1])).toThrowError(t(`TargetNotInjured`, villagers[1].nickname));
  witchers[0].idle();
  expect(() => witchers[0].rescue(villagers[0])).toThrowError(t(`TurnEnded`));

  nextStage('Daytime');
  expect(stage.death).toHaveLength(1);

  nextStage('Vote');
  allWaive();

  nextStage('Voted');
  nextStage('Night');
  werewolves[0].kill(villagers[1]);

  nextStage('Witcher');
  expect(() => witchers[0].rescue(villagers[0])).toThrowError(t(`TargetIsDead`, villagers[0].nickname));
  expect(witchers[0].rescue(villagers[1])).toEqual(t(`RescueSuccess`));

  nextStage('Daytime');
  expect(villagers[1].isDead).toBeFalse();
  expect(stage.death).toHaveLength(0);

  nextStage('Vote');
  allWaive();

  nextStage('Voted');

  nextStage('Night');

  werewolves[0].kill(villagers[1]);

  nextStage('Witcher');
  expect(() => witchers[0].rescue(villagers[1])).toThrowError(t(`Rescued`));
  witchers[0].idle();
  expect(stage.death).toHaveLength(0);

  nextStage('Daytime');
  expect(stage.death).toHaveLength(1);

  nextStage('Vote');
  allWaive();

  nextStage('Voted');

  nextStage('Night');

  werewolves[0].kill(witchers[0]);

  nextStage('Witcher');
  expect(() => witchers[0].poison(witchers[0])).toThrowError(t(`PoisonSelf`));
  expect(witchers[0].poison(werewolves[0])).toEqual(t(`PoisonSuccess`));

  nextStage('Daytime');

  nextStage('End');
  expect(survivors).toHaveLength(2);
  expect(survivors).toSatisfyAll((survivor: Character) => survivor instanceof Villager);
  expect(stage.death).toHaveLength(2);
});

test('witcher - no medicine', () => {
  const { createGame, nextStage, allWaive } = testSuite();

  createGame({ customCharacters: ['Werewolf', 'Witcher', 'Villager', 'Villager', 'Villager', 'Villager'] });

  nextStage('Night');
  werewolves[0].kill(villagers[0]);

  witchers[0].rescued = villagers[0].id;
  witchers[0].poisoned = villagers[0].id;

  nextStage('Witcher');
  expect(witchers[0].endTurn).toBeTrue();
  expect(() => witchers[0].rescue(villagers[0])).toThrowError(t(`NoMoreMedicine`));
  expect(() => witchers[0].idle()).not.toThrowError();

  nextStage('Daytime');

  nextStage('Vote');
  allWaive();
});
