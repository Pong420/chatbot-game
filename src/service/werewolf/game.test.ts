import { test, expect } from 'vitest';
import { Game } from './game';
import { Villager, Werewolf } from './character';
import { Init, Start, Night, Daytime } from './stage';
import { errors } from './error';

const testSerialisation = (game: Game) => expect(game).toEqual(Game.create({ ...game.serialize() }));

test('flow', () => {
  const game = Game.create({ id: '1' });
  let stage = game.stage;
  expect(stage).toBeInstanceOf(Init);
  testSerialisation(game);

  stage = game.next();
  testSerialisation(game);
  expect(stage).toBeInstanceOf(Start);
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

  stage = game.next();
  testSerialisation(game);
  expect(stage).toBeInstanceOf(Night);

  const werewolfs = game.getCharacters(Werewolf);
  const villagers = game.getCharacters(Villager);
  const [werewolf] = werewolfs;

  expect(werewolfs.length).toBeGreaterThanOrEqual(1);
  expect(villagers.length).toBeGreaterThanOrEqual(1);
  expect(() => game.next()).toThrowError(errors('NOT_END'));

  werewolf.kill(villagers[0]);
  werewolfs.forEach(w => !w.endTurn && w.idle());

  stage = game.next();
  testSerialisation(game);
  expect(stage).toBeInstanceOf(Daytime);
  expect(villagers[0].isDead).toBeTruthy();
  expect(stage.survivors).toHaveLength(stage.numOfPlayers - 1);
  expect(stage.survivors).not.toContainEqual(villagers[0]);
});
