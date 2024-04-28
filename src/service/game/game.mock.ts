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

vi.spyOn(module, 'getGame').mockImplementation((id, options = {}) => {
  if (typeof id === 'string' && typeof options?.status === 'undefined') {
    options.status = module.GameStatus.OPEN;
  }

  const games = gameDB.filter(g => (typeof id === 'number' ? g.id === id : g.groupId === id));
  const data = typeof options?.status === 'undefined' ? games[0] : games.find(g => g.status === options.status);
  return Promise.resolve(data || null);
});

vi.spyOn(module, 'createGame').mockImplementation(payload => {
  const data = genMockGameData(payload);
  gameDB.push({ ...data, data: Object.assign({}, data.data, { id: data.id }) });
  return Promise.resolve(data);
});

vi.spyOn(module, 'updateGame').mockImplementation((...payload) => {
  const [data, id, props] =
    typeof payload[0] === 'number' || typeof payload[0] === 'undefined'
      ? [payload[1], payload[0], payload[2]]
      : [{ data: payload[0].serialize() }, payload[0].id, payload[1]];

  let result: Game | undefined;

  for (let i = 0; i < gameDB.length; i++) {
    const current = gameDB[i];
    if (current && current.id === id) {
      gameDB[i] = result = { ...current, ...data, ...props };
      break;
    }
  }

  return Promise.resolve(result || null);
});
