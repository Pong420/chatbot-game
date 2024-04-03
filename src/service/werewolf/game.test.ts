import { test, expect } from 'vitest';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Game } from './game';
import { Pending, Start, Night } from './stage';
import { Character } from './character';

test('serialize / deserialize', () => {
  const game = plainToInstance(Game, { id: '1' });
  let plain = instanceToPlain(game);
  expect(plain.stage.players).toEqual([]);

  let stage = game.stage;
  for (let i = 0; i < stage.numOfPlayers; i++) {
    stage.as(Pending).join({ id: `${i}`, name: `player_${i}` });
  }

  expect(game.id).toEqual('1');
  expect(game.players.get('1')).not.toMatchObject({ character: expect.any(String) });
  expect(game.players.size).toEqual(stage.numOfPlayers);

  stage = game.next();
  stage = game.next();
  expect(stage).toBeInstanceOf(Night);

  plain = instanceToPlain(game);
  let game2 = plainToInstance(Game, plain);

  expect(game2.players.get('1')).toBeInstanceOf(Character);
  expect(game2.players.get('1')?.character).toEqual(expect.any(String));
  expect(game.players.get('1')).toEqual(game2.players.get('1'));
});

test('stage', () => {
  const game = plainToInstance(Game, { id: '1' });
  const pending = game.stage as Pending;
  expect(pending).toBeInstanceOf(Pending);

  for (let i = 0; i < pending.numOfPlayers; i++) {
    pending.join({ id: `${i}`, name: `player_${i}` });
  }
  expect(pending.players.size).toEqual(pending.numOfPlayers);

  const start = (game.stage = pending.next());
  expect(start).toBeInstanceOf(Start);
  expect(pending.players.size).toEqual(pending.numOfPlayers);
});
