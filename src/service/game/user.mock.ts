import { vi } from 'vitest';
import { nanoid } from 'nanoid';
import * as module from './user';

export type User = module.User;

export const userDB = new Map<string, User>();

export const genMockUserData = (override?: Partial<User>) => {
  return {
    id: userDB.size + 1,
    userId: nanoid(),
    nickname: nanoid(),
    game: null,
    title: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...override
  };
};

vi.spyOn(module, 'getUser').mockImplementation(userId => {
  const data = userDB.get(userId);
  return Promise.resolve(data || null);
});

vi.spyOn(module, 'createUser').mockImplementation(({ userId }) => {
  if (userDB.has(userId)) {
    return Promise.resolve({ data: null, error: { code: 0 } }) as unknown as ReturnType<(typeof module)['createUser']>;
  }
  const data = genMockUserData({ userId });
  userDB.set(userId, data);
  return Promise.resolve(data);
});

vi.spyOn(module, 'updateUser').mockImplementation((userId, payload) => {
  let data = userDB.get(userId);
  if (data) {
    data = { ...data, ...payload };
    userDB.set(userId, data);
  }
  return Promise.resolve(data || null);
});
