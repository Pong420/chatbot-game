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
declare let werewolves: Werewolf[];
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
  werewolves.forEach(c => expect(count(c)).toEqual({ i_am_werewolf: 1 }));
  hunters.forEach(c => expect(count(c)).toEqual({ i_am_hunter: 1 }));
  guards.forEach(c => expect(count(c)).toEqual({ i_am_guard: 1 }));
  predictors.forEach(c => expect(count(c)).toEqual({ i_am_predictor: 1 }));
  witchers.forEach(c => expect(count(c)).toEqual({ i_am_witcher: 1 }));

  guard.protect(guard);

  nextStage('Night');
  werewolves[0].kill(werewolves[0]);
  werewolves[1].kill(villagers[3]);
  werewolves[2].kill(werewolves[3]);
  werewolves[3].kill(werewolves[2]);

  nextStage('Witcher');
  witcher.rescue(werewolves[0]);

  nextStage('Predictor');
  predictor.predict(werewolves[0]);

  nextStage('Daytime');
  nextStage('Vote');

  allVoteTo(predictor);

  nextStage('Voted');

  nextStage('Guard');
  guard.protect(villagers[0]);

  nextStage('Night');
  werewolves[0].kill(villagers[0]);
  werewolves[1].kill(guard);

  nextStage('Witcher');
  witcher.poison(werewolves[1]);

  nextStage('Predictor');
  nextStage('Daytime');
  nextStage('Vote');

  allVoteTo(villagers[2]);
  nextStage('Voted');

  nextStage('Guard');

  nextStage('Night');
  werewolves[0].kill(witcher);

  nextStage('Witcher');
  nextStage('Predictor');
  nextStage('Daytime');
  nextStage('Vote');

  allVoteTo(hunter);

  nextStage('Voted');
  nextStage('Hunter');

  hunter.noShoot();

  nextStage('HunterEnd');

  nextStage('Guard');
  nextStage('Night');
  werewolves[0].kill(villagers[0]);

  nextStage('Witcher');
  nextStage('Predictor');
  nextStage('Daytime');

  nextStage('End');

  expect(count(hunter)).toEqual({ i_am_hunter: 1, no_shot: 1 });
  expect(count(witcher)).toEqual({ i_am_witcher: 1, bodhisattva: 1, poison_master: 1 });
  expect(count(predictor)).toEqual({ i_am_predictor: 1, voyeur: 1 });
  expect(count(guard)).toEqual({ i_am_guard: 1, protected: 2 });

  expect(count(villagers[0])).toEqual({ i_am_villager: 1, vote_to_kill: 3 });
  expect(count(villagers[1])).toEqual({ i_am_villager: 1, vote_to_kill: 3 });
  expect(count(villagers[2])).toEqual({ i_am_villager: 1, vote_to_kill: 1 });
  expect(count(villagers[3])).toEqual({ i_am_villager: 1, dead_on_the_first_day: 1 });

  expect(count(werewolves[0])).toEqual({ i_am_werewolf: 1, god_of_gamblers: 1, nightmare: 1, traitor: 3 });
  expect(count(werewolves[1])).toEqual({ i_am_werewolf: 1, traitor: 2 });
  expect(count(werewolves[2])).toEqual({
    i_am_werewolf: 1,
    traitor: 1,
    fratricidal_fighting: 1,
    dead_on_the_first_day: 1
  });
  expect(count(werewolves[3])).toEqual({
    i_am_werewolf: 1,
    traitor: 1,
    fratricidal_fighting: 1,
    dead_on_the_first_day: 1
  });
});
