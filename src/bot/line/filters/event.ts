import { WebhookEvent } from '@line/bot-sdk';
import { isGroupEvent, isSingleEvent } from '@line/types';

export const Single = isSingleEvent;

export const Group = isGroupEvent;
export const GroupId = (event: WebhookEvent) => isGroupEvent(event) && event.source.groupId;
export const MemberJoin = (event: WebhookEvent) => event.type === 'memberJoined';
export const MemberLeft = (event: WebhookEvent) => event.type === 'memberLeft';
export const LeaveGroup = (event: WebhookEvent) => event.type === 'leave';
