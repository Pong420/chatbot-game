/* eslint-disable @typescript-eslint/no-unused-vars */
import { testSuite } from '@werewolf/test';
import { t } from '@werewolf/locales';
import { expect, test } from 'vitest';
import { Character } from './_character';
import { Werewolf } from './werewolf';
import { Villager } from './villager';
import { Guard } from './guard';
import { Hunter } from './hunter';
import { Predictor } from './predictor';
import { Witcher } from './witcher';
import { Game } from '../game';
import { Stage, stages } from '../stage';

declare let game: Game;
declare let stage: Stage;
declare let survivors: Character[];
declare let werewolves: Werewolf[];
declare let villagers: Villager[];
declare let hunter: Hunter;
declare let guard: Guard;
declare let predictor: Predictor;
declare let witcher: Witcher;

test('werewolves know each others', () => {
  const { createGame, nextStage, allWaive, allVoteTo } = testSuite();
  createGame({ werewolvesKnowEachOthers: true });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Guard');
  expect(werewolves).toHaveLength(4);
  expect(werewolves).toSatisfyAll((w: Werewolf) => w.knowEachOthers);
  guard.protect(villagers[0]);

  nextStage('Night');
  werewolves[0].idle();
  expect(() => game.next()).toThrowError(t(`StageNotEnded`));
  werewolves.slice(1).forEach(w => w.kill(villagers[0]));

  nextStage('Witcher');
  expect(game.stage.nearDeath).toHaveLength(0);
  expect(villagers[0].causeOfDeath).toHaveLength(0);
  expect(witcher.idle());

  expect(werewolves[0].hungry).toBeFalse();

  nextStage('Predictor');
  predictor.predict(villagers[0]);

  nextStage('Daytime');
  nextStage('Vote');
  allVoteTo(villagers[0]);

  nextStage('Voted');

  nextStage('Guard');
  guard.protect(guard);

  nextStage('Night');
  werewolves.forEach(werewolf => {
    expect(() => werewolf.kill(villagers[0])).toThrowError(t(`CantKillDeadTarget`, villagers[0].nickname));
    werewolf.kill(werewolves[0]);
  });

  nextStage('Witcher');
  witcher.rescue(werewolves[0]);

  nextStage('Predictor');
  predictor.predict(guard);

  nextStage('Daytime');
  nextStage('Vote');

  allVoteTo(witcher);
  nextStage('Voted');

  nextStage('Guard');
  guard.protect(werewolves[0]);

  nextStage('Night');
  werewolves[0].kill(predictor);
  werewolves.slice(1).forEach(werewolf => werewolf.idle());

  nextStage('Witcher');
  expect(werewolves).toSatisfyAll((werewolf: Werewolf) => werewolf.hungry);
  expect(predictor.causeOfDeath).toHaveLength(0);

  nextStage('Predictor');
  predictor.predict(werewolves[1]);

  nextStage('Daytime');
  nextStage('Vote');
  allVoteTo(predictor);

  nextStage('Voted');

  nextStage('Guard');
  guard.noProtect();

  nextStage('Night');
  werewolves.forEach(werewolf => {
    expect(() => werewolf.idle()).toThrowError(t(`Hungry`));
  });
  werewolves.slice(0, 2).forEach(werewolf => werewolf.kill(villagers[1]));
  werewolves.slice(2, 4).forEach(werewolf => werewolf.kill(villagers[2]));

  nextStage('Witcher');
  nextStage('Predictor');
  nextStage('Daytime');

  expect([villagers[1], villagers[2]].some(i => i.isDead)).toBeTruthy();
  expect([villagers[1], villagers[2]].some(i => !i.isDead)).toBeTruthy();

  nextStage('Vote');
  allVoteTo(guard);

  nextStage('Voted');

  nextStage('Guard');
  nextStage('Night');
  werewolves.forEach(werewolf => werewolf.kill(hunter));

  nextStage('Witcher');
  nextStage('Predictor');
  nextStage('Daytime');
  nextStage('Hunter');

  hunter.shoot(werewolves[3]);
  nextStage('HunterEnd');

  nextStage('Vote');
  allVoteTo(villagers[3]);
  nextStage('Voted');

  nextStage('End');
});
