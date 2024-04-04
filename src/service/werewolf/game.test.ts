import { test, expect } from 'vitest';
import { Game } from './game';
import { Character } from './character';
import { Pending, Start, Night } from './stage';

test('serialize / deserialize', () => {
  const game = Game.create({ id: '1' });
  let stage = game.stage;

  let plain = game.serialize();
  expect(plain.stage.players).toEqual([]);

  for (let i = 0; i < stage.numOfPlayers; i++) {
    stage.as(Pending).join({ id: `${i}`, name: `player_${i}` });
  }

  expect(game.id).toEqual('1');
  expect(game.players.get('1')).not.toMatchObject({ character: expect.any(String) });
  expect(game.players.size).toEqual(stage.numOfPlayers);

  stage = game.next();
  stage = game.next();

  plain = game.serialize();

  let game2 = Game.create({ id: game.id, stage: plain.stage });

  expect(game2.stage).toBeInstanceOf(Night);
  expect(game2.players.get('1')).toBeInstanceOf(Character);
  expect(game2.players.get('1')?.character).toEqual(expect.any(String));
  expect(game.players.get('1')).toEqual(game2.players.get('1'));
});

test('flow', () => {
  const game = Game.create({ id: '1' });
  let stage = game.stage;

  expect(stage).toBeInstanceOf(Pending);

  for (let i = 0; i < stage.numOfPlayers; i++) {
    stage.as(Pending).join({ id: `${i}`, name: `player_${i}` });
  }
  expect(game.players.size).toEqual(game.stage.numOfPlayers);

  stage = game.next();
  expect(stage).toBeInstanceOf(Start);

  stage = game.next();
  expect(stage).toBeInstanceOf(Night);
});
