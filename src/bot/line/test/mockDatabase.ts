import { vi } from 'vitest';
import { nanoid } from 'nanoid';
import { User } from '@/service/user';
import * as api from '../utils/user';
import { LineUser } from './mockLineUser';

const userDB = new Map<string, User>();

export const clearDB = () => {
  userDB.clear();
};

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

export const createUser = (payload: LineUser | Partial<User>) => {
  const user = genMockUserData(payload instanceof LineUser ? { userId: payload.userId, nickname: payload.name } : {});
  userDB.set(user.userId, user);
  return user;
};

vi.spyOn(api, 'getUser').mockImplementation(async (event, userId) => {
  const uid = userId || event?.source.userId || '';
  let user = userDB.get(uid);
  if (!user) {
    user = genMockUserData({ userId });
    userDB.set(uid, user);
  }
  return user;
});
