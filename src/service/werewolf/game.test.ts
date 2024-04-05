import { test, expect } from 'vitest';
import { Game } from './game';
import { Character, Villager, Werewolf } from './character';
import { Init, Start, Night, Daytime, Stage } from './stage';
import { errors } from './error';
import { Voted } from './death';

const testSerialisation = (game: Game) => {
  const serialized = Game.create(game.serialize());
  expect(game).toMatchObject(serialized);
};

test('flow', () => {
  const game = Game.create({ id: '1' });

  let stage = game.stage;
  let survivors: Character[] = [];
  let werewolfs: Werewolf[] = [];
  let villagers: Villager[] = [];

  const next = (StageConstructor: typeof Stage) => {
    stage = game.next();
    testSerialisation(game);
    expect(stage).toBeInstanceOf(StageConstructor);

    survivors = game.stage.survivors;
    werewolfs = game.getCharacters(Werewolf);
    villagers = game.getCharacters(Villager);
  };

  expect(stage).toBeInstanceOf(Init);
  testSerialisation(game);

  // --------------------------------------------------------------------------------

  next(Start);
  expect(() => game.next()).toThrowError(errors('NOT_ENOUGH_PLAYERS'));

  for (let i = 0; i <= stage.numOfPlayers; i++) {
    const join = () => stage.as(Start).join({ id: `${i}`, name: `player_${i}` });

    if (i >= stage.numOfPlayers) {
      expect(join).toThrowError(errors('GAME_FULL')); // full
    } else {
      join();
      expect(join).toThrowError(errors('DUPLICATED_JOIN')); // duplicated join
    }
  }
  expect(game.players.size).toEqual(game.stage.numOfPlayers);

  // --------------------------------------------------------------------------------

  next(Night);
  expect(stage.turn).toBe(1);
  expect(werewolfs.length).toBeGreaterThanOrEqual(1);
  expect(villagers.length).toBeGreaterThanOrEqual(1);
  expect(() => game.next()).toThrowError(errors('STAGE_NOT_ENDED'));

  werewolfs[0].kill(villagers[0]);
  werewolfs.forEach(w => !w.endTurn && w.idle());
  expect(() => werewolfs[0].kill(villagers[0])).toThrowError();

  // --------------------------------------------------------------------------------

  // test vote and vote to self
  next(Daytime);
  expect(survivors).toHaveLength(stage.numOfPlayers - 1);
  expect(survivors).not.toContainEqual(villagers[0]);
  expect(() => werewolfs[0].kill(villagers[1])).toThrowError(errors('NOT_YOUR_TURN'));

  let daytime = stage.as(Daytime);
  expect(() => villagers[0].vote(villagers[0])).toThrowError(errors('YOU_DEAD'));
  expect(() => villagers[0].vote(villagers[1])).toThrowError(errors('YOU_DEAD'));
  expect(() => villagers[2].vote(villagers[0])).toThrowError(errors('TARGET_IS_DEAD'));

  villagers[1].vote(werewolfs[0]);
  werewolfs[0].vote(villagers[1]);

  expect(() => game.next()).toThrowError(errors('STAGE_NOT_ENDED'));
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
  next(Daytime);
  daytime = stage.as(Daytime);
  expect(daytime.candidates.size).toBe(survivors.length);
  expect(() => game.next()).toThrowError(errors('STAGE_NOT_ENDED'));
  expect(() => villagers[2].vote(villagers[0])).toThrowError(errors('TARGET_IS_DEAD')); // expecet not to VOTE_OUT_OF_RANGE

  villagers[1].vote(werewolfs[0]);
  werewolfs[0].vote(villagers[1]);
  survivors.forEach(survivor => !survivor.endTurn && survivor.waive());

  expect(daytime.countResults()).toMatchObject({ numberOfVotes: 2, count: 1 });

  // --------------------------------------------------------------------------------

  // two players gets one vote, others player wavied, so vote again
  next(Daytime);
  daytime = stage.as(Daytime);
  expect(daytime.candidates.size).toBe(2);
  expect(() => villagers[2].vote(villagers[2])).toThrowError(errors('VOTE_OUT_OF_RANGE'));
  expect(() => villagers[2].vote(villagers[3])).toThrowError(errors('VOTE_OUT_OF_RANGE'));

  villagers[1].vote(werewolfs[0]);
  werewolfs[0].vote(villagers[1]);
  survivors.forEach(survivor => !survivor.endTurn && survivor.waive());

  expect(daytime.countResults()).toMatchObject({ numberOfVotes: 2, count: 1 });

  // --------------------------------------------------------------------------------

  // two players gets one vote, others player wavied, so vote again
  next(Daytime);
  daytime = stage.as(Daytime);
  survivors.forEach(survivor => (survivor.id === villagers[1].id ? survivor.waive() : survivor.vote(villagers[1])));

  expect(daytime.countResults()).toMatchObject({ numberOfVotes: survivors.length - 1, count: survivors.length - 1 });

  // --------------------------------------------------------------------------------

  // villagers[1] is dead as all players voted

  next(Night);
  expect(villagers[1].causeOfDeath[0]).toBeInstanceOf(Voted);
  expect(villagers[1].causeOfDeath[0] as Voted).toHaveProperty('total', survivors.length);
  expect(survivors).toHaveLength(stage.numOfPlayers - 2);
});
