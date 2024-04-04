import { test, expect } from 'vitest';
import { Game } from './game';
import { Villager, Werewolf } from './character';
import { Init, Start, Night, Daytime, Stage } from './stage';
import { errors } from './error';

const testSerialisation = (game: Game) => {
  const serialized = Game.create(game.serialize());
  expect(game).toMatchObject(serialized);
};

test('flow', () => {
  const game = Game.create({ id: '1' });

  let stage = game.stage;
  let werewolfs: Werewolf[] = [];
  let villagers: Villager[] = [];
  let [werewolf] = werewolfs;
  let [villager] = villagers;

  const next = (StageConstructor: typeof Stage) => {
    stage = game.next();
    testSerialisation(game);
    expect(stage).toBeInstanceOf(StageConstructor);

    werewolfs = game.getCharacters(Werewolf);
    villagers = game.getCharacters(Villager);
    [werewolf] = werewolfs;
    [villager] = villagers;
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
  expect(werewolfs.length).toBeGreaterThanOrEqual(1);
  expect(villagers.length).toBeGreaterThanOrEqual(1);
  expect(() => game.next()).toThrowError(errors('NOT_END'));

  werewolf.kill(villager);
  werewolfs.forEach(w => !w.endTurn && w.idle());

  // --------------------------------------------------------------------------------

  next(Daytime);
  expect(stage.survivors).toHaveLength(stage.numOfPlayers - 1);
  expect(stage.survivors).not.toContainEqual(villager);
  expect(() => werewolf.kill(villagers[1])).toThrowError(errors('NOT_YOUR_TURN'));
});
