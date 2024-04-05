import { vi } from 'vitest';
import { GroupSummaryResponse, MembersCountResponse } from '@line/bot-sdk';
import { client } from '../client';
import { User } from './mockUser';

export type GroupStats = GroupSummaryResponse & MembersCountResponse;

const groups = new Map<string, Group>();

export class Group {
  name: string;

  groupId: string;

  members: User[] = [];

  constructor(groupId: string, name: string) {
    this.name = name;
    this.groupId = groupId;
    groups.set(groupId, this);
  }

  groupName(name: string) {
    this.name = name;
  }

  stats(): GroupStats {
    return {
      pictureUrl: '',
      groupId: this.groupId,
      groupName: this.name,
      count: this.members.length
    };
  }

  join(user: User) {
    user.groupId = this.groupId;
    this.members.push(user);
  }

  leave(user: User) {
    this.members = this.members.filter(u => u.userId === user.userId);
  }
}

client.getGroupMemberCount = vi.fn().mockImplementation(async function (
  groupId: string
): Promise<MembersCountResponse> {
  const group = groups.get(groupId);
  if (!group) throw new Error(`group not found`);
  return group.stats();
});

client.getGroupSummary = vi.fn().mockImplementation(async function (groupId: string): Promise<GroupSummaryResponse> {
  const group = groups.get(groupId);
  if (!group) throw new Error(`group not found`);
  return group.stats();
});
