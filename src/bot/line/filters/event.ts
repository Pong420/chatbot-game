import { WebhookEvent } from '@line/bot-sdk';
import { isGroupEvent, isSingleEvent } from '@line/types';

export const Single = isSingleEvent;

export const Group = isGroupEvent;
export const GroupId = (event: WebhookEvent) => isGroupEvent(event) && event.source.groupId;
export const MemberJoin = (event: WebhookEvent) =>
  event.type === 'memberJoined' && isGroupEvent(event) ? event : false;
export const MemberLeft = (event: WebhookEvent) => (event.type === 'memberLeft' && isGroupEvent(event) ? event : false);
export const LeaveGroup = (event: WebhookEvent) => (event.type === 'leave' && isGroupEvent(event) ? event : false);

export const DebugGroup = (event: WebhookEvent) =>
  isGroupEvent(event) && event.source.groupId === process.env.LINE_DEBUG_GROUP_ID;
