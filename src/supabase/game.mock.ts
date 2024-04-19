import { vi } from 'vitest';
import { nanoid } from 'nanoid';
import * as module from './game';

export type Game = module.Game;

export const gameDB = new Map<string, Game>();

export const genMockGameData = (override?: Partial<Game>): Game => {
  return {
    id: gameDB.size + 1,
    groupId: nanoid(),
    data: null,
    type: 'unknown',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...override
  };
};

vi.spyOn(module, 'getGame').mockImplementation(groupId => {
  const data = gameDB.get(groupId);
  return Promise.resolve(data || null);
});

vi.spyOn(module, 'createGame').mockImplementation(payload => {
  if (gameDB.has(payload.groupId)) {
    throw new Error(`Duplicated`);
  }

  const data = genMockGameData(payload);
  gameDB.set(payload.groupId, JSON.parse(JSON.stringify(data)));
  return Promise.resolve({ data, error: null }) as unknown as ReturnType<(typeof module)['createGame']>;
});

vi.spyOn(module, 'updateGame').mockImplementation((...payload) => {
  const [changes, groupId] =
    typeof payload[0] === 'string' ? [payload[1], payload[0]] : [payload[0].serialize(), payload[0].groupId];
  let data = gameDB.get(groupId);
  if (data) {
    data = { ...data, ...changes };
    gameDB.set(groupId, JSON.parse(JSON.stringify(data)));
  }
  if (!data) throw Error(`game not found`);
  return Promise.resolve(data);
});
