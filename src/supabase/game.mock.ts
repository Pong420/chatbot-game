import { vi } from 'vitest';
import { nanoid } from 'nanoid';
import * as module from './game';
import { ERROR_CODE_EMPTY } from './supabase';

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

vi.spyOn(module, 'getGame').mockImplementation(userId => {
  const data = gameDB.get(userId);
  return Promise.resolve({ data, error: data ? null : { code: ERROR_CODE_EMPTY } }) as unknown as ReturnType<
    (typeof module)['getGame']
  >;
});

vi.spyOn(module, 'createGame').mockImplementation(payload => {
  const data = genMockGameData(payload);
  gameDB.set(payload.groupId, JSON.parse(JSON.stringify(data)));
  return Promise.resolve({ data, error: null }) as unknown as ReturnType<(typeof module)['createGame']>;
});

vi.spyOn(module, 'updateGame').mockImplementation((userId, payload) => {
  let data = gameDB.get(userId);
  if (data) {
    data = { ...data, ...payload };
    gameDB.set(userId, JSON.parse(JSON.stringify(data)));
  }
  return Promise.resolve({ data, error: data ? null : { code: 0 } }) as unknown as ReturnType<
    (typeof module)['updateGame']
  >;
});
