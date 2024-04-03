import { test, expect } from 'vitest';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { WerewolfGame } from './werewolf';
import { Player } from './player';
import { Character } from './characters/character';

test('serialize / deserialize', () => {
  const werewolf = new WerewolfGame({ id: '1' });
  for (let i = 0; i < werewolf.numOfPlayers; i++) {
    werewolf.join({ id: `${i}`, name: `player_${i}` });
  }

  expect(werewolf.id).toEqual('1');
  expect(werewolf.players.size).toEqual(werewolf.numOfPlayers);

  werewolf.nextStage();
  expect(werewolf.stage).toBe('start');

  werewolf.nextStage();
  expect(werewolf.characters.size).toBe(werewolf.numOfPlayers);

  const plain = instanceToPlain(werewolf);
  const werewolf2 = plainToInstance(WerewolfGame, plain);

  expect(werewolf2.players.get('1')).toBeInstanceOf(Player);
  expect(werewolf.players.get('1')).toEqual(werewolf2.players.get('1'));
  expect(werewolf2.characters.get('1')).toBeInstanceOf(Character);
  expect(werewolf.characters.get('1')).toEqual(werewolf2.characters.get('1'));
});

test('flow', () => {
  const werewolf = new WerewolfGame({ id: '1' });
  for (let i = 0; i < werewolf.numOfPlayers; i++) {
    werewolf.join({ id: `${i}`, name: `player_${i}` });
  }
  expect(werewolf.players.size).toEqual(werewolf.numOfPlayers);
  expect(werewolf.stage).toBe('pending');

  werewolf.nextStage();
  expect(werewolf.stage).toBe('start');
});
