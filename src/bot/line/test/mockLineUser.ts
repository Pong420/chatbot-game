/* eslint-disable @typescript-eslint/no-explicit-any */

import { vi } from 'vitest';
import { nanoid } from 'nanoid';
import { Profile, WebhookEvent } from '@line/bot-sdk';
import { userDB, genMockUserData } from '@service/game/user.mock';
import { fakerZH_TW } from '@faker-js/faker';
import { createGroupTextMessage, createSingleTextMessage } from './mockEvent';

vi.mock('../utils/getUserProfile', () => {
  return {
    getUserProfile: vi.fn().mockImplementation((event: WebhookEvent | null, userId = event?.source.userId): Profile => {
      const user = users.get(userId || '');
      if (!user) throw new Error(`User not found`);
      return user.profile;
    })
  };
});

const users = new Map<string, LineUser>();

interface SendOption {
  postback?: boolean;
}

interface GroupMessageOption extends SendOption {
  mentionees?: string[];
}

const names = new Set<string>();
const getName = (): string => {
  const name = fakerZH_TW.person.fullName();
  if (names.has(name)) {
    return getName();
  }
  names.add(name);
  return name;
};

export class LineUser {
  name: string;

  groupId: string;

  profile: Profile;

  constructor({ name = getName(), userId = nanoid(), groupId = nanoid() } = {}) {
    this.name = name;
    this.groupId = groupId;
    this.profile = {
      displayName: name,
      userId,
      pictureUrl: '',
      statusMessage: ''
    };
    users.set(userId, this);

    const user = genMockUserData({ userId: userId, nickname: name });
    userDB.set(user.userId, user);
  }

  get userId() {
    return this.profile.userId;
  }

  groupMessage(text: string, { postback = false, mentionees }: GroupMessageOption = {}) {
    return createGroupTextMessage(text, {
      userId: this.userId,
      groupId: this.groupId,
      postback,
      mentionees
    });
  }

  singleMessage(text: string, { postback = false }: SendOption = {}) {
    return createSingleTextMessage(text, {
      userId: this.userId,
      groupId: this.groupId,
      postback
    });
  }
}
