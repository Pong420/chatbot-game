import { test, expect } from 'vitest';
import { Game } from './game';
import { Daytime, End, Voted, Night, Start, Stage } from './stage';
import { Character, Villager, Werewolf } from './character';
import { t } from './locales';
import { Voting } from './death';
import { werewolfTestUtils } from './test';

declare let game: Game;
declare let stage: Stage;
declare let survivors: Character[];
declare let werewolfs: Werewolf[];
declare let villagers: Villager[];

test('basic', () => {
  const { createGame, next } = werewolfTestUtils();
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

  // test vote and vote to self
  let daytime = next(Daytime);
  expect(survivors).toHaveLength(stage.players.size - 1);
  expect(survivors).not.toContainEqual(villagers[0]);
  expect(() => werewolfs[0].kill(villagers[1])).toThrowError(t('NotYourTurn'));

  expect(() => villagers[0].vote(villagers[0])).toThrowError(t('YouDead'));
  expect(() => villagers[0].vote(villagers[1])).toThrowError(t('YouDead'));
  expect(() => villagers[2].vote(villagers[0])).toThrowError(t('TargetIsDead', villagers[0].nickname));

  villagers[1].vote(werewolfs[0]);
  werewolfs[0].vote(villagers[1]);

  expect(() => game.next()).toThrowError(t('StageNotEnded'));
  survivors.forEach(survivor => {
    if (survivor.endTurn) return;
    expect(survivor.vote(survivor)).toMatchObject({ self: true });
  });
  survivors.forEach(survivor => {
    expect(daytime.candidates.get(survivor.id)).toHaveLength(1);
  });
  expect(daytime.countResults()).toMatchObject({ numberOfVotes: survivors.length, count: 1 });

  // --------------------------------------------------------------------------------

  // everyone gets one vote in previous round, so vote again
  for (let i = 0; i < 10; i++) {
    daytime = next(Daytime);

    if (i === 0) {
      expect(daytime.candidates.size).toBe(survivors.length);
    } else {
      expect(daytime.candidates.size).toBe(2);
    }

    expect(() => game.next()).toThrowError(t('StageNotEnded'));
    expect(() => villagers[2].vote(villagers[0])).toThrowError(t('TargetIsDead', villagers[0].nickname)); // expecet not to VoteOutOfRange

    villagers[1].vote(werewolfs[0]);
    werewolfs[0].vote(villagers[1]);
    survivors.forEach(survivor => !survivor.endTurn && survivor.waive());

    expect(daytime.countResults()).toMatchObject({ numberOfVotes: 2, count: 1 });
  }

  // --------------------------------------------------------------------------------

  // two players gets one vote, others player wavied, so vote again
  daytime = next(Daytime);
  survivors.forEach(survivor => (survivor.id === villagers[1].id ? survivor.waive() : survivor.vote(villagers[1])));

  expect(daytime.countResults()).toMatchObject({ numberOfVotes: survivors.length - 1, count: survivors.length - 1 });

  // --------------------------------------------------------------------------------

  // villagers[1] is dead by voting

  const voted = next(Voted);

  expect(voted.results).toEqual({
    numberOfVotes: survivors.length,
    count: survivors.length,
    players: [villagers[1].id],
    votes: Array.from({ length: 4 }, () => expect.any(String))
  });
  expect(villagers[1].causeOfDeath[0]).toBeInstanceOf(Voting);
  expect(villagers[1].causeOfDeath[0] as Voting).toHaveProperty('total', survivors.length);
  expect(survivors).toHaveLength(stage.players.size - 2);

  // --------------------------------------------------------------------------------

  next(Night);

  expect(() => werewolfs[0].kill(villagers[1])).toThrowError(t('TargetIsDead', villagers[1].nickname)); // expecet not to VoteOutOfRange
  werewolfs[0].kill(villagers[2]);
  expect(stage.nearDeath).toHaveLength(1);

  // --------------------------------------------------------------------------------

  // villagers[2] is killed by werewolf

  next(Daytime);
  expect(survivors).toHaveLength(3);
  werewolfs[0].vote(villagers[3]);
  villagers[4].vote(villagers[3]);
  villagers[3].vote(werewolfs[0]);

  // --------------------------------------------------------------------------------

  next(End);
});
