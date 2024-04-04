import { test, expect } from 'vitest';
import { Game } from './game';
import { Character, Villager, Werewolf } from './character';
import { Init, Start, Night, Daytime } from './stage';
import { errors } from './error';

test('serialize / deserialize', () => {
  const game = Game.create({ id: '1' });
  let stage = game.stage;
  expect(stage).toBeInstanceOf(Init);

  stage = game.next();
  expect(stage).toBeInstanceOf(Start);

  expect(game.serialize().stage.players).toEqual([]);

  for (let i = 0; i < stage.numOfPlayers; i++) {
    stage.as(Start).join({ id: `${i}`, name: `player_${i}` });
  }

  expect(game.id).toEqual('1');
  expect(game.players.get('1')).not.toMatchObject({ character: expect.any(String) });
  expect(game.players.size).toEqual(stage.numOfPlayers);

  stage = game.next();
  expect(game.stage).toBeInstanceOf(Night);

  let game2 = Game.create({ id: game.id, stage: game.serialize().stage });

  expect(game2.stage).toBeInstanceOf(Night);
  expect(game2.players.get('1')).toBeInstanceOf(Character);
  expect(game2.players.get('1')?.character).toEqual(expect.any(String));
  expect(game.players.get('1')).toEqual(game2.players.get('1'));
});

test('flow', () => {
  const game = Game.create({ id: '1' });
  let stage = game.stage;
  expect(stage).toBeInstanceOf(Init);

  stage = game.next();
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
  expect(stage).toBeInstanceOf(Night);

  const werewolfs = game.stage.getCharacters(Werewolf);
  const villagers = game.stage.getCharacters(Villager);
  const [werewolf] = werewolfs;

  expect(werewolfs.length).toBeGreaterThanOrEqual(1);
  expect(villagers.length).toBeGreaterThanOrEqual(1);
  expect(() => game.next()).toThrowError(expect.any(String));

  werewolf.kill(villagers[0]);
  werewolfs.forEach(w => !w.endTurn && w.idle());

  stage = game.next();
  expect(stage).toBeInstanceOf(Daytime);
});
