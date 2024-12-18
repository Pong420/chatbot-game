import { vi } from 'vitest';
import { GroupSummaryResponse, MembersCountResponse } from '@line/bot-sdk';
import { LineUser } from './mockLineUser';
import { client } from './mockClient';

export type GroupStats = GroupSummaryResponse & MembersCountResponse;

const groups = new Map<string, Group>();

export class Group {
  name: string;

  groupId: string;

  members: LineUser[] = [];

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

  join(user: LineUser) {
    user.groupId = this.groupId;
    this.members.push(user);
  }

  leave(user: LineUser) {
    this.members = this.members.filter(u => u.userId === user.userId);
  }
}

vi.spyOn(client, 'getGroupMemberCount').mockImplementation(async (groupId: string): Promise<MembersCountResponse> => {
  const group = groups.get(groupId);
  if (!group) throw new Error(`group not found`);
  return group.stats();
});

vi.spyOn(client, 'getGroupSummary').mockImplementation(async (groupId: string): Promise<GroupSummaryResponse> => {
  const group = groups.get(groupId);
  if (!group) throw new Error(`group not found`);
  return group.stats();
});
