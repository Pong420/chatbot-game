import { test, expect } from 'vitest';
import { Game } from './game';
import { Daytime, End, Voted, Night, Start, Stage } from './stage';
import { Character, Villager, Werewolf } from './character';
import { t } from './locales';
import { werewolfTestUtils } from './test';
import { Voting } from './death';

declare let game: Game;
declare let stage: Stage;
declare let survivors: Character[];
declare let werewolfs: Werewolf[];
declare let villagers: Villager[];

// TODO: test turn

test('basic', () => {
  const { createGame, next, allVoteTo, allWaive } = werewolfTestUtils();
  createGame({ numOfPlayers: 6, characters: [Werewolf, Villager, Villager, Villager, Villager, Villager] });

  expect(game.stage).toBeInstanceOf(Start);
  expect(game.players.size).toBe(6);

  next(Night);
  expect(werewolfs).toHaveLength(1);
  expect(villagers).toHaveLength(5);
  expect(() => game.next()).toThrowError(t('StageNotEnded'));

  werewolfs[0].kill(villagers[0]);
  werewolfs.forEach(w => !w.endTurn && w.idle());
  expect(() => werewolfs[0].kill(villagers[0])).toThrowError(t(`TurnEnded`));
  expect(() => werewolfs[0].vote(villagers[0])).toThrowError(t('VoteNotStarted'));
  expect(stage.nearDeath).toHaveLength(1);

  // --------------------------------------------------------------------------------

  let daytime = next(Daytime);
  expect(survivors).toHaveLength(5);
  expect(survivors).not.toContainEqual(villagers[0]);
  expect(() => werewolfs[0].kill(villagers[1])).toThrowError(t('NotYourTurn'));

  expect(() => villagers[0].vote(villagers[0])).toThrowError(t('YouDead'));
  expect(() => villagers[0].vote(villagers[1])).toThrowError(t('YouDead'));
  expect(() => villagers[2].vote(villagers[0])).toThrowError(t('CantKillDeadTarget', villagers[0].nickname));

  villagers[1].vote(werewolfs[0]);
  werewolfs[0].vote(villagers[1]);

  expect(() => game.next()).toThrowError(t('StageNotEnded'));
  allWaive();
  expect(daytime.countResults()).toMatchObject({ numberOfVotes: 2, count: 1 });

  // --------------------------------------------------------------------------------

  // two players got one vote, enter second round
  daytime = next(Daytime);

  expect(daytime.candidates.size).toBe(2);

  expect(() => game.next()).toThrowError(t('StageNotEnded'));
  expect(() => villagers[2].vote(villagers[0])).toThrowError(t('CantKillDeadTarget', villagers[0].nickname)); // expecet not to VoteOutOfRange

  expect(() => villagers[1].vote(werewolfs[0])).toThrowError(t(`TurnEnded`));
  expect(() => werewolfs[0].vote(villagers[1])).toThrowError(t(`TurnEnded`));

  allWaive();

  expect(daytime.countResults()).toMatchObject({ numberOfVotes: 0, count: 0 });

  // --------------------------------------------------------------------------------

  const voted = next(Voted);
  expect(survivors).toHaveLength(5);

  expect(voted.results).toEqual({
    numberOfVotes: 0,
    count: 0,
    players: [],
    votes: []
  });

  // --------------------------------------------------------------------------------

  next(Night);

  expect(werewolfs[0].kill(villagers[1])).toEqual(t(`KillSuccss`));
  expect(stage.nearDeath).toHaveLength(1);

  // --------------------------------------------------------------------------------

  daytime = next(Daytime);
  expect(daytime.secondRound).toBeFalse();
  allVoteTo(werewolfs[0]);

  // --------------------------------------------------------------------------------

  next(End);

  expect(werewolfs[0].isDead).toBeTrue();
  expect(werewolfs[0].causeOfDeath[0]).toBeInstanceOf(Voting);
});
