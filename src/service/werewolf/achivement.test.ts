/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from 'vitest';
import { Game } from './game';
import { Stage } from './stage';
import { Character, Villager, Werewolf, Witcher, Hunter, Guard, Predictor } from './character';
import { testSuite } from './test';
import { achievementCount } from './achivement';

declare let game: Game;
declare let stage: Stage;
declare let survivors: Character[];
declare let werewolfs: Werewolf[];
declare let villagers: Villager[];
declare let hunters: Hunter[];
declare let hunter: Hunter;
declare let guards: Guard[];
declare let guard: Guard;
declare let predictors: Predictor[];
declare let predictor: Predictor;
declare let witchers: Witcher[];
declare let witcher: Witcher;

const count = (character: Character) => achievementCount(character, game);

test('basic', () => {
  const { createGame, nextStage, allVoteTo, allWaive } = testSuite();
  createGame({ numOfPlayers: 12 });
  nextStage('Guard');

  villagers.forEach(c => expect(count(c)).toEqual({ i_am_villager: 1 }));
  werewolfs.forEach(c => expect(count(c)).toEqual({ i_am_werewolf: 1 }));
  hunters.forEach(c => expect(count(c)).toEqual({ i_am_hunter: 1 }));
  guards.forEach(c => expect(count(c)).toEqual({ i_am_guard: 1 }));
  predictors.forEach(c => expect(count(c)).toEqual({ i_am_predictor: 1 }));
  witchers.forEach(c => expect(count(c)).toEqual({ i_am_witcher: 1 }));

  guard.protect(guard);

  nextStage('Night');
  werewolfs[0].kill(werewolfs[0]);
  werewolfs[1].kill(villagers[3]);
  werewolfs[2].kill(werewolfs[3]);
  werewolfs[3].kill(werewolfs[2]);

  nextStage('Witcher');
  witcher.rescue(werewolfs[0]);

  nextStage('Predictor');
  predictor.predict(werewolfs[0]);

  nextStage('Daytime');
  nextStage('Vote');

  allVoteTo(predictor);

  nextStage('Voted');

  nextStage('Guard');
  guard.protect(villagers[0]);

  nextStage('Night');
  werewolfs[0].kill(villagers[0]);
  werewolfs[1].kill(guard);

  nextStage('Witcher');
  witcher.poison(hunter);

  nextStage('Daytime');
  nextStage('Vote');

  allVoteTo(villagers[2]);
  nextStage('Voted');

  nextStage('Night');

  // console.log(count(hunter));
});

// test('hunter', () => {});
