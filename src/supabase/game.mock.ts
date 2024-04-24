import { vi } from 'vitest';
import { nanoid } from 'nanoid';
import * as module from './game';

export type Game = module.Game;

export const gameDB = [] as Game[];

export const genMockGameData = (override?: Partial<Game>): Game => {
  return {
    id: gameDB.length + 1,
    groupId: nanoid(),
    data: null,
    type: 'unknown',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 0,
    ...override
  };
};

vi.spyOn(module, 'getGame').mockImplementation(groupId => {
  const data = gameDB.find(g => g.groupId === groupId && g.status === module.GameStatus.OPEN);
  return Promise.resolve(data || null);
});

vi.spyOn(module, 'createGame').mockImplementation(payload => {
  const game = gameDB.find(g => g.groupId === payload.groupId && g.status === module.GameStatus.OPEN);
  if (game) {
    throw new Error(`Duplicated`);
  }

  const data = genMockGameData(payload);
  gameDB.push({ ...payload, ...JSON.parse(JSON.stringify(data)) });
  return Promise.resolve({ data, error: null }) as unknown as ReturnType<(typeof module)['createGame']>;
});

vi.spyOn(module, 'updateGame').mockImplementation((...payload) => {
  const [changes, groupId] =
    typeof payload[0] === 'string' ? [payload[1], payload[0]] : [payload[0].serialize(), payload[0].groupId];

  let result: Game | undefined;

  for (let i = 0; i < gameDB.length; i++) {
    const data = gameDB[i];
    if (data && data.groupId === groupId && data.status === module.GameStatus.OPEN) {
      gameDB[i] = result = { ...data, ...changes };
    }
  }

  if (!result) throw Error(`game not found`);
  return Promise.resolve(result);
});
