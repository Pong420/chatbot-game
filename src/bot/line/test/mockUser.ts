/* eslint-disable @typescript-eslint/no-explicit-any */

import { vi } from 'vitest';
import { Profile, WebhookEvent } from '@line/bot-sdk';
import { createGroupTextMessage, createSingleTextMessage } from './mockEvent';
import { getUserProfile } from '../utils/getUserProfile';

vi.mock('../utils/getUserProfile');

const users = new Map<string, User>();

(getUserProfile as any).mockImplementation((event: WebhookEvent | null, userId = event?.source.userId): Profile => {
  const user = users.get(userId || '');
  if (!user) throw new Error(`User not found`);
  return user.profile;
});

export const createProfile = (displayName: string) => {
  return {
    displayName,
    userId: displayName + '_id',
    pictureUrl: '',
    statusMessage: ''
  };
};

interface SendOption {
  postback?: boolean;
}
interface GroupMessageOption extends SendOption {
  mentionees?: string[];
}

export class User {
  name: string;

  groupId: string;

  profile: Profile;

  constructor(name: string, groupId: string) {
    this.name = name;
    this.groupId = groupId;
    this.profile = createProfile(name);
    users.set(this.profile.userId, this);
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
