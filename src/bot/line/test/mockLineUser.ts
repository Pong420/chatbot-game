/* eslint-disable @typescript-eslint/no-explicit-any */

import { vi } from 'vitest';
import { nanoid } from 'nanoid';
import { Profile, WebhookEvent } from '@line/bot-sdk';
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

export class LineUser {
  name: string;

  groupId: string;

  profile: Profile;

  constructor(name = nanoid(), groupId = nanoid()) {
    this.name = name;
    this.groupId = groupId;
    this.profile = {
      displayName: name,
      userId: `id_${name}`,
      pictureUrl: '',
      statusMessage: ''
    };
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
