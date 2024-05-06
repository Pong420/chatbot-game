import { test, expect } from 'vitest';
import { Game } from './game';
import { Start, Stage, VoteBaseStage } from './stage';
import { Character, Villager, Werewolf } from './character';
import { t } from './locales';
import { testSuite } from './test';
import { Voting } from './death';

declare let game: Game;
declare let stage: Stage;
declare let survivors: Character[];
declare let werewolves: Werewolf[];
declare let villagers: Villager[];

test('basic', () => {
  const { createGame, nextStage, allVoteTo, allWaive } = testSuite();
  createGame({ customCharacters: ['Werewolf', 'Villager', 'Villager', 'Villager', 'Villager', 'Villager'] });

  expect(game.stage).toBeInstanceOf(Start);
  expect(game.players.size).toBe(6);

  nextStage('Night');
  expect(werewolves).toHaveLength(1);
  expect(villagers).toHaveLength(5);
  expect(() => game.next()).toThrowError(t('StageNotEnded'));

  werewolves[0].kill(villagers[0]);
  werewolves.forEach(w => !w.endTurn && w.idle());
  expect(() => werewolves[0].kill(villagers[0])).toThrowError(t(`TurnEnded`));
  expect(() => villagers[0].vote(villagers[1])).toThrowError(t('VoteNotStarted'));

  // --------------------------------------------------------------------------------

  nextStage('Daytime');
  expect(survivors).toHaveLength(5);
  expect(survivors).not.toContainEqual(villagers[0]);
  expect(stage.death).toHaveLength(1);

  // --------------------------------------------------------------------------------

  let vote: VoteBaseStage = nextStage('Vote');

  expect(() => werewolves[0].kill(villagers[1])).toThrowError(t('NotYourTurn'));

  expect(() => villagers[0].vote(villagers[0])).toThrowError(t('YouDead'));
  expect(() => villagers[0].vote(villagers[1])).toThrowError(t('YouDead'));
  expect(() => villagers[2].vote(villagers[0])).toThrowError(t('CantKillDeadTarget', villagers[0].nickname));

  villagers[1].vote(werewolves[0]);
  werewolves[0].vote(villagers[1]);

  expect(() => game.next()).toThrowError(t('StageNotEnded'));

  allWaive();

  expect(vote.countResults()).toMatchObject({ numberOfVotes: 2, count: 1 });
  expect(stage.death).toHaveLength(0);

  // --------------------------------------------------------------------------------

  // two players got one vote, enter re-vote
  vote = nextStage('ReVote');

  expect(vote.candidates.size).toBe(2);
  expect(vote.voter).toHaveLength(3);

  expect(() => game.next()).toThrowError(t('StageNotEnded'));
  expect(() => villagers[2].vote(villagers[0])).toThrowError(t('CantKillDeadTarget', villagers[0].nickname)); // expecet not to VoteOutOfRange

  expect(() => villagers[1].vote(werewolves[0])).toThrowError(t(`CandidateCantVote`));
  expect(() => werewolves[0].vote(villagers[1])).toThrowError(t(`CandidateCantVote`));

  allWaive();

  expect(vote.countResults()).toMatchObject({ numberOfVotes: 0, count: 0 });
  expect(stage.death).toHaveLength(0);

  // --------------------------------------------------------------------------------

  const voted = nextStage('Voted');
  expect(survivors).toHaveLength(5);
  expect(stage.death).toHaveLength(0);

  expect(voted.results).toEqual({
    numberOfVotes: 0,
    count: 0,
    players: [],
    votes: []
  });

  // --------------------------------------------------------------------------------

  nextStage('Night');

  expect(werewolves[0].kill(villagers[1])).toEqual(t(`KillSuccss`));

  // --------------------------------------------------------------------------------

  nextStage('Daytime');
  expect(stage.death).toHaveLength(1);

  // --------------------------------------------------------------------------------

  vote = nextStage('Vote');
  allVoteTo(werewolves[0]);

  // --------------------------------------------------------------------------------

  nextStage('Voted');

  nextStage('End');

  expect(werewolves[0].isDead).toBeTrue();
  expect(werewolves[0].causeOfDeath[0]).toBeInstanceOf(Voting);
  expect(stage.death).toHaveLength(1);
});
